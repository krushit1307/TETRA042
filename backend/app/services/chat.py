"""Advisory pipeline: NLLB → English → RAG + TinyLlama → NLLB → user language."""

from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional

import torch

from app.config import ADVISORY_TEMPERATURE, CHANNEL_MAX_TOKENS
from app.services.advisory import (
    build_chat_system_prompt,
    build_diagnosis_context,
    build_disease_prompt,
    build_general_qa_prompt,
    format_as_bullets,
    format_facts_only,
    format_kb_facts_only,
    gather_rag_facts,
)
from app.services import models as model_registry

logger = logging.getLogger("sasya.chat")

NLLB_MAP = {
    "hi": "hin_Deva",
    "en": "eng_Latn",
    "bn": "ben_Beng",
    "gu": "guj_Gujr",
    "kn": "kan_Knda",
    "ml": "mal_Mlym",
    "mr": "mar_Deva",
    "or": "ory_Orya",
    "ta": "tam_Taml",
    "te": "tel_Telu",
}

NO_FACTS_MSG = (
    "I don't have specific information on this topic. "
    "Please consult your local agricultural officer."
)

_MIN_FACTS_PROMPT = (
    "No exact match in the agricultural database. "
    "Answer the farmer's question using general safe agricultural knowledge. "
    "Recommend consulting a local agriculture officer for chemical doses and purchases."
)

_URL_RE = re.compile(r"https?://\S+", re.I)
_DOSE_RE = re.compile(r"\d+\s*(ml|mg|g|kg|ppm|litre|liter|ltr)\b", re.I)
_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")
_GUJARATI_RE = re.compile(r"[\u0A80-\u0AFF]")
_BENGALI_RE = re.compile(r"[\u0980-\u09FF]")


def _forced_bos_token_id(tokenizer, lang_code: str) -> int:
    """Resolve NLLB target-language token (fixes wrong-language output)."""
    if hasattr(tokenizer, "lang_code_to_id"):
        mapping = tokenizer.lang_code_to_id
        if callable(mapping):
            mapping = mapping()
        if isinstance(mapping, dict) and lang_code in mapping:
            return mapping[lang_code]
    token_id = tokenizer.convert_tokens_to_ids(lang_code)
    if token_id is not None and token_id != getattr(tokenizer, "unk_token_id", -1):
        return token_id
    raise ValueError(f"Unknown NLLB language code: {lang_code}")


def _effective_lang(text: str, lang: str) -> str:
    """Detect Indian scripts when the client sends lang=en for typed regional text."""
    if lang and lang != "en":
        return lang
    if _DEVANAGARI_RE.search(text):
        return "hi"
    if _GUJARATI_RE.search(text):
        return "gu"
    if _BENGALI_RE.search(text):
        return "bn"
    return lang or "en"


def translate_text(text: str, src: str, tgt: str) -> str:
    """NLLB translation between supported languages."""
    if src == tgt or not text.strip():
        return text
    bundle = model_registry.nllb_bundle()
    if bundle is None and not model_registry.load_nllb():
        logger.warning("NLLB unavailable — skipping %s → %s translation", src, tgt)
        return text
    bundle = model_registry.nllb_bundle()
    assert bundle is not None

    tokenizer = bundle["tokenizer"]
    model = bundle["model"]
    device = bundle["device"]

    src_code = NLLB_MAP.get(src, "eng_Latn")
    tgt_code = NLLB_MAP.get(tgt, "eng_Latn")
    tokenizer.src_lang = src_code
    if hasattr(tokenizer, "tgt_lang"):
        tokenizer.tgt_lang = tgt_code

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    try:
        bos_id = _forced_bos_token_id(tokenizer, tgt_code)
    except ValueError as exc:
        logger.error("NLLB language error: %s", exc)
        return text

    with torch.no_grad():
        out = model.generate(
            **inputs,
            forced_bos_token_id=bos_id,
            max_length=512,
            num_beams=4,
            early_stopping=True,
        )
    return tokenizer.batch_decode(out, skip_special_tokens=True)[0]


def _translate_bullet_list(items: List[str], lang: str) -> List[str]:
    """Translate a list of strings in one NLLB call to save latency on CPU."""
    if not items or lang == "en":
        return items
    blob = "\n".join(f"• {item}" for item in items)
    translated = translate_text(blob, "en", lang)
    lines = [
        re.sub(r"^[•\-\*]\s*", "", line.strip())
        for line in translated.splitlines()
        if line.strip()
    ]
    return lines if len(lines) == len(items) else [
        translate_text(item, "en", lang) for item in items
    ]


def translate_diagnosis_fields(result: Dict[str, Any], lang: str) -> Dict[str, Any]:
    """Translate image-diagnosis text fields to the selected farmer language."""
    if not lang or lang == "en":
        return result

    out = dict(result)
    if out.get("display_name"):
        out["display_name"] = translate_text(out["display_name"], "en", lang)
    if out.get("crop"):
        out["crop"] = translate_text(out["crop"], "en", lang)
    if out.get("cause"):
        out["cause"] = translate_text(out["cause"], "en", lang)
    if out.get("prevention"):
        out["prevention"] = translate_text(out["prevention"], "en", lang)
    if out.get("treatment"):
        out["treatment"] = _translate_bullet_list(list(out["treatment"]), lang)
    if out.get("top3"):
        names = [str(p.get("display_name", "")) for p in out["top3"]]
        translated_names = _translate_bullet_list(names, lang)
        out["top3"] = [
            {**item, "display_name": translated_names[i] if i < len(translated_names) else item.get("display_name", "")}
            for i, item in enumerate(out["top3"])
        ]
    if out.get("confidence_band"):
        out["confidence_band"] = translate_text(str(out["confidence_band"]), "en", lang)
    return out


def _to_user_lang(text_en: str, user_lang: str) -> str:
    """Translate English answer back to the user's language, keeping bullet spacing."""
    if user_lang == "en":
        return text_en

    # Translate each bullet separately so NLLB does not collapse into one paragraph.
    if "•" in text_en and "\n" in text_en:
        parts = [p.strip() for p in re.split(r"\n\n+", text_en) if p.strip()]
        if len(parts) > 1:
            translated = [translate_text(part, "en", user_lang) for part in parts]
            return "\n\n".join(translated)

    return translate_text(text_en, "en", user_lang)


def _to_english(text: str, user_lang: str) -> str:
    """Translate any user input to English before TinyLlama."""
    return translate_text(text, user_lang, "en") if user_lang != "en" else text


def _max_tokens(channel: str) -> int:
    return CHANNEL_MAX_TOKENS.get(channel, CHANNEL_MAX_TOKENS["web"])


def _fallback_response(
    user_message: str,
    allowed_facts: str,
    diagnosis: Optional[Dict[str, Any]],
    channel: str,
) -> tuple[str, str]:
    if diagnosis:
        return format_facts_only(
            label=diagnosis["disease"],
            display_name=diagnosis["display_name"],
            crop=diagnosis["crop"],
            confidence=diagnosis["confidence"],
            band=diagnosis["confidence_band"],
            channel=channel,
            top3=diagnosis.get("top3"),
        ), "facts_only"
    if allowed_facts.strip() and allowed_facts != _MIN_FACTS_PROMPT:
        return format_kb_facts_only(user_message, channel=channel), "kb_only"
    return NO_FACTS_MSG, "no_facts"


def _wrap_tinyllama_chat(system: str, user: str) -> str:
    return f"<|system|>\n{system}\n<|user|>\n{user}\n<|assistant|>\n"


def _sanitize_llm_response(response: str, allowed_facts: str) -> str:
    """Strip hallucinated URLs, doses, and citation blocks."""
    if not response:
        return ""

    if _URL_RE.search(response) and not _URL_RE.search(allowed_facts):
        response = _URL_RE.sub("", response)

    if _DOSE_RE.search(response) and not _DOSE_RE.search(allowed_facts):
        response = re.sub(r"\d+\s*(ml|mg|g|kg|ppm|litre|liter|ltr)\b", "[dose]", response, flags=re.I)

    for pattern in (
        r"(?im)^\s*sources?\s*:.*$",
        r"(?im)^\s*confidence\s*:.*$",
        r"(?im)^\s*top-3\s*:.*$",
        r"(?im)http\S*",
    ):
        if not re.search(pattern.replace("(?im)", ""), allowed_facts, re.I):
            response = re.sub(pattern, "", response)

    response = re.sub(r"\n{3,}", "\n\n", response).strip()
    return response


def _response_is_safe(response: str, allowed_facts: str, diagnosis: Optional[Dict[str, Any]]) -> bool:
    if len(response) < 10:
        return False
    if _URL_RE.search(response):
        return False
    if diagnosis:
        primary = diagnosis.get("display_name", "").lower()
        for alt in diagnosis.get("top3", [])[1:3]:
            alt_name = str(alt.get("display_name", "")).lower()
            if alt_name and alt_name in response.lower() and alt_name not in primary:
                return False
    return True


@torch.no_grad()
def _tinyllama_rewrite(
    system: str, user: str, channel: str, allowed_facts: str, diagnosis: Optional[Dict[str, Any]]
) -> Optional[str]:
    if not model_registry.load_tinyllama():
        return None
    tiny = model_registry.tinyllama_bundle()
    if tiny is None:
        return None

    tokenizer = tiny["tokenizer"]
    model = tiny["model"]
    device = tiny["device"]

    prompt = _wrap_tinyllama_chat(system, user)
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048).to(device)
    gen = model.generate(
        **inputs,
        max_new_tokens=_max_tokens(channel),
        temperature=ADVISORY_TEMPERATURE,
        top_p=0.85,
        do_sample=True,
        repetition_penalty=1.2,
        pad_token_id=tokenizer.eos_token_id,
    )
    full = tokenizer.decode(gen[0], skip_special_tokens=True)
    response = full.split("<|assistant|>")[-1].strip() if "<|assistant|>" in full else full.strip()
    response = _sanitize_llm_response(response, allowed_facts)
    if not _response_is_safe(response, allowed_facts, diagnosis):
        return None
    return response if len(response) >= 10 else None


def run_advisory_pipeline(
    user_message: str,
    *,
    lang: str = "en",
    channel: str = "web",
    diagnosis: Optional[Dict[str, Any]] = None,
) -> tuple[str, str]:
    """
    Universal flow for every question:
      1. Detect user language
      2. NLLB: user text → English
      3. RAG: gather facts (KB + disease_info + pest) in English
      4. TinyLlama: answer in English
      5. NLLB: English answer → user language
    """
    user_lang = _effective_lang(user_message, lang)
    user_en = _to_english(user_message, user_lang)
    system = build_chat_system_prompt(channel)

    if diagnosis:
        allowed_facts = build_diagnosis_context(
            label=diagnosis["disease"],
            display_name=diagnosis["display_name"],
            crop=diagnosis["crop"],
            confidence=diagnosis["confidence"],
            band=diagnosis["confidence_band"],
            top3=diagnosis.get("top3", []),
            include_top3=False,
        )
        user_payload = build_disease_prompt(
            label=diagnosis["disease"],
            display_name=diagnosis["display_name"],
            crop=diagnosis["crop"],
            confidence=diagnosis["confidence"],
            band=diagnosis["confidence_band"],
            user_message=user_en,
            channel=channel,
            top3=None,
        )
        user_payload = user_payload.replace(system, "", 1).strip()
    else:
        allowed_facts = gather_rag_facts(user_en, channel=channel)
        if not allowed_facts.strip():
            allowed_facts = _MIN_FACTS_PROMPT
        user_payload = build_general_qa_prompt(
            facts=allowed_facts, user_message=user_en, channel=channel
        ).replace(system, "", 1).strip()

    source = "tinyllama"
    try:
        response_en = _tinyllama_rewrite(system, user_payload, channel, allowed_facts, diagnosis)
        if not response_en:
            response_en, source = _fallback_response(user_en, allowed_facts, diagnosis, channel)
    except Exception as exc:
        logger.warning("TinyLlama advisory failed: %s", exc)
        response_en, source = _fallback_response(user_en, allowed_facts, diagnosis, channel)

    response_en = format_as_bullets(response_en, channel=channel)
    response = _to_user_lang(response_en, user_lang)
    if user_lang != "en":
        response = format_as_bullets(response, channel=channel)
    return response, source


def generate_response(
    user_message: str,
    *,
    lang: str = "en",
    channel: str = "web",
    diagnosis: Optional[Dict[str, Any]] = None,
) -> tuple[str, str]:
    return run_advisory_pipeline(user_message, lang=lang, channel=channel, diagnosis=diagnosis)


def explain_diagnosis(diagnosis: dict, lang: str = "en", channel: str = "web") -> tuple[str, str]:
    return run_advisory_pipeline(
        "Explain the diagnosis and treatment to the farmer.",
        lang=lang,
        channel=channel,
        diagnosis=diagnosis,
    )
