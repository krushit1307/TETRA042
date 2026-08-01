"""Treatment lookup, KB retrieval, and TinyLlama prompt builder (no retraining)."""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

from app.config import CLASSES_PATH, DISEASE_INFO_PATH, KB_PATH

logger = logging.getLogger("sasya.advisory")

_disease_info: Dict[str, Any] | None = None
_kb_index: Dict[str, Any] | None = None
_disease_labels: List[str] | None = None
_label_display: Dict[str, str] | None = None

_WORD_RE = re.compile(r"[a-zA-Z\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF]+")

# Crop names in English, romanized Hindi, and Devanagari
_CROP_ALIASES = {
    "tomato": "tomato",
    "tamatar": "tomato",
    "टमाटर": "tomato",
    "wheat": "wheat",
    "gehun": "wheat",
    "गेहूं": "wheat",
    "गेहूँ": "wheat",
    "rice": "rice",
    "chawal": "rice",
    "धान": "rice",
    "चावल": "rice",
    "maize": "maize",
    "corn": "maize",
    "मक्का": "maize",
    "potato": "potato",
    "aloo": "potato",
    "आलू": "potato",
    "cotton": "cotton",
    "kapas": "cotton",
    "कपास": "cotton",
    "mango": "mango",
    "आम": "mango",
    "sugarcane": "sugarcane",
    "गन्ना": "sugarcane",
    "onion": "onion",
    "प्याज": "onion",
    "chilli": "chilli",
    "mirchi": "chilli",
    "मिर्च": "chilli",
    "gram": "gram",
    "chana": "gram",
    "चना": "gram",
    "mustard": "mustard",
    "सरसों": "mustard",
}

_PEST_MARKERS = frozenset({
    "pest",
    "pests",
    "insect",
    "insects",
    "bug",
    "bugs",
    "caterpillar",
    "bollworm",
    "whitefly",
    "aphid",
    "thrips",
    "mite",
    "mites",
    "control",
    "keet",
    "keed",
    "keede",
    "niyantran",
    "कीट",
    "कीड़े",
    "कीडा",
})

_LIVESTOCK_WORDS = frozenset({
    "poultry",
    "cow",
    "goat",
    "pig",
    "duck",
    "rabbit",
    "buffalo",
    "fish",
    "veterinary",
    "deworming",
})

_GENERIC_PEST_ADVICE = [
    "Scout the field every 3–5 days and identify the pest before spraying.",
    "Use pheromone or light traps for monitoring infestation levels.",
    "Prefer neem oil (5 ml/L) or biopesticides (Bt) before chemical sprays.",
    "Follow your local agriculture department spray schedule and dosage.",
    "Remove heavily infested plant parts and manage crop residue after harvest.",
]

_CROP_PEST_ADVICE: Dict[str, List[str]] = {
    "cotton": [
        "Monitor for pink bollworm and whitefly; use 5 pheromone traps per hectare.",
        "At peak egg-laying, spray emamectin benzoate or spinosad as per label.",
        "Avoid excess nitrogen — it increases pest outbreaks in cotton.",
        "Grow refugia/non-Bt border rows when using Bt cotton (mandatory in India).",
        "Remove crop stubble after harvest to break the bollworm life cycle.",
    ],
    "tomato": [
        "Monitor for fruit borer, whitefly, and leaf miner; use yellow sticky traps.",
        "Spray neem oil 5 ml/L or release Trichogramma wasps for fruit borer.",
        "Remove and destroy infested fruits and leaves promptly.",
        "Avoid monocropping; rotate with legumes to reduce pest buildup.",
    ],
    "wheat": [
        "Watch for aphids and termites at tillering stage.",
        "Apply need-based imidacloprid only when aphid count exceeds economic threshold.",
        "Deep summer ploughing helps reduce soil-borne pests.",
    ],
    "rice": [
        "Monitor for stem borer and leaf folder; use light traps at tillering.",
        "Release Trichogramma cards at 50,000/ha for stem borer control.",
        "Maintain proper water level; avoid excess nitrogen.",
    ],
}


def preload() -> None:
    """Warm caches at startup."""
    load_disease_info()
    load_kb()


def load_disease_info() -> Dict[str, Any]:
    global _disease_info
    if _disease_info is None:
        if DISEASE_INFO_PATH.exists():
            with DISEASE_INFO_PATH.open(encoding="utf-8") as f:
                _disease_info = json.load(f)
            logger.info("disease_info loaded (%d entries)", len(_disease_info))
        else:
            _disease_info = {}
    return _disease_info


def load_kb() -> Dict[str, Any]:
    global _kb_index
    if _kb_index is None:
        if KB_PATH.exists():
            logger.info("Loading agricultural KB from %s", KB_PATH)
            with KB_PATH.open(encoding="utf-8") as f:
                _kb_index = json.load(f)
            logger.info("KB loaded (%d keyword buckets)", len(_kb_index))
        else:
            logger.warning("agricultural_kb.json not found at %s", KB_PATH)
            _kb_index = {}
    return _kb_index


def _tokenize(text: str) -> List[str]:
    tokens = [w.lower() for w in _WORD_RE.findall(text) if len(w) > 2]
    expanded: List[str] = []
    for t in tokens:
        expanded.append(t)
        if t in _CROP_ALIASES:
            expanded.append(_CROP_ALIASES[t])
    return expanded


def _keywords(question: str) -> List[str]:
    """Single words + adjacent bigrams for richer KB lookup."""
    words = _tokenize(question)
    keys = list(words)
    for i in range(len(words) - 1):
        keys.append(f"{words[i]} {words[i + 1]}")
    return keys


def _load_disease_labels() -> List[str]:
    global _disease_labels, _label_display
    if _disease_labels is not None:
        return _disease_labels
    _disease_labels = []
    _label_display = {}
    if CLASSES_PATH.exists():
        with CLASSES_PATH.open(encoding="utf-8") as f:
            data = json.load(f)
        _disease_labels = [
            lbl for lbl in data.get("classes", []) if "healthy" not in lbl.lower()
        ]
        _label_display = data.get("label_to_display", {})
    else:
        _disease_labels = [k for k in load_disease_info() if "healthy" not in k.lower()]
    return _disease_labels


def _display_name(label: str) -> str:
    _load_disease_labels()
    if _label_display and label in _label_display:
        return " ".join(_label_display[label].split())
    return label.replace("__", " ").replace("___", " ").replace("_", " ")


def detect_crop(question: str) -> Optional[str]:
    tokens = set(_tokenize(question))
    q_lower = question.lower()
    for alias, crop in _CROP_ALIASES.items():
        if alias in tokens or alias in q_lower:
            return crop
    for crop in set(_CROP_ALIASES.values()):
        if crop in q_lower:
            return crop
    return None


def is_pest_query(question: str) -> bool:
    tokens = set(_tokenize(question))
    if tokens & _PEST_MARKERS:
        return True
    return any(marker in question for marker in ("कीट", "कीड़े", "कीडा"))


def match_disease_from_query(question: str) -> Optional[str]:
    """Match free-text questions like 'tomato early blight treatment' to a disease label."""
    q_lower = question.lower()
    q_tokens = set(_tokenize(question))
    best_label: Optional[str] = None
    best_score = 0

    for label in _load_disease_labels():
        crop, _, disease = label.partition("__")
        if not disease:
            continue
        crop_words = [w for w in crop.replace("_", " ").lower().split() if len(w) > 2]
        disease_words = [w for w in disease.replace("_", " ").lower().split() if len(w) > 2]
        if not crop_words or not disease_words:
            continue

        score = 0
        for w in crop_words:
            if w in q_lower or w in q_tokens:
                score += 3
        for w in disease_words:
            if w in q_lower or w in q_tokens:
                score += 3

        if score > best_score and score >= 6:
            best_score = score
            best_label = label

    return best_label


def format_disease_advice(label: str, channel: str = "web") -> str:
    info = lookup_treatment(label)
    treatment = info.get("treatment", [])
    if isinstance(treatment, str):
        treatment = [treatment]
    name = _display_name(label)
    limit = 4 if channel == "whatsapp" else 8

    if channel == "voice":
        t0 = treatment[0] if treatment else "Consult your local agriculture officer."
        return f"For {name}: {t0}"

    lines = [f"**{name}**", ""]
    if info.get("cause"):
        lines += [f"Cause: {info['cause']}", ""]
    lines.append("Treatment:")
    lines += [f"• {t}" for t in treatment[:limit]]
    prev = info.get("prevention")
    if prev:
        lines += ["", f"Prevention: {prev}"]
    return "\n".join(lines)


def format_pest_advice(crop: str, channel: str = "web") -> str:
    tips = _CROP_PEST_ADVICE.get(crop, _GENERIC_PEST_ADVICE)
    limit = 3 if channel == "whatsapp" else 5 if channel == "voice" else len(tips)
    title = crop.replace("_", " ").title()
    lines = [f"**Pest control for {title}**", ""]
    lines += [f"• {t}" for t in tips[:limit]]
    return "\n".join(lines)


def retrieve_kb_entries(question: str, max_entries: int = 3) -> List[Dict[str, Any]]:
    db = load_kb()
    if not db:
        return []

    keys = _keywords(question)
    if not keys:
        return []

    detected_crop = detect_crop(question)
    q_tokens = set(_tokenize(question))
    scored: List[Tuple[int, Dict[str, Any]]] = []
    seen: set[str] = set()

    for key in keys:
        bucket = db.get(key)
        if not bucket:
            continue
        weight = 3 if " " in key else 1
        for entry in bucket[:10]:
            uid = entry.get("question", "") + "|" + entry.get("answer", "")
            if uid in seen:
                continue
            seen.add(uid)
            entry_q = entry.get("question", "").lower()
            entry_a = entry.get("answer", "").lower()
            q_words = set(_tokenize(entry_q))
            overlap = len(q_words & q_tokens)
            score = overlap * 2 + weight

            if detected_crop:
                if detected_crop in entry_q:
                    score += 12
                else:
                    for other in set(_CROP_ALIASES.values()):
                        if other != detected_crop and other in entry_q:
                            score -= 8
                            break

            if any(w in entry_a for w in _LIVESTOCK_WORDS):
                if detected_crop or "crop" in q_tokens or "plant" in q_tokens:
                    score -= 20

            if score > 0:
                scored.append((score, entry))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [e for _, e in scored[:max_entries]]


def gather_rag_facts(question: str, channel: str = "web") -> str:
    """Merge KB, disease_info, and pest facts into English context for TinyLlama."""
    parts: List[str] = []

    kb = retrieve_kb_context(question, max_entries=3)
    if kb:
        parts.append(kb)

    label = match_disease_from_query(question)
    if label:
        info = lookup_treatment(label)
        treatment = info.get("treatment", [])
        if isinstance(treatment, str):
            treatment = [treatment]
        parts.append(
            f"Disease database — {_display_name(label)}:\n"
            f"Cause: {info.get('cause', 'Unknown')}\n"
            f"Treatment:\n"
            + "\n".join(f"  - {t}" for t in treatment)
            + f"\nPrevention: {info.get('prevention', _DEFAULT_PREVENTION)}"
        )

    if is_pest_query(question):
        crop = detect_crop(question)
        if crop:
            tips = _CROP_PEST_ADVICE.get(crop, _GENERIC_PEST_ADVICE)
            limit = 3 if channel == "whatsapp" else 5
            parts.append(
                f"Pest control for {crop}:\n" + "\n".join(f"  - {t}" for t in tips[:limit])
            )

    return "\n\n".join(parts)


def retrieve_kb_context(question: str, max_entries: int = 3) -> str:
    """Keyword retrieval from agricultural_kb.json — source of truth for general Q&A."""
    entries = retrieve_kb_entries(question, max_entries)
    if not entries:
        return ""
    lines: List[str] = []
    for entry in entries:
        lines.append(f"Q: {entry.get('question', '')}")
        lines.append(f"A: {entry.get('answer', '')}")
    return "\n".join(lines)


_DEFAULT_PREVENTION = "Use certified seeds and monitor field regularly."


def _ensure_prevention(info: Dict[str, Any]) -> Dict[str, Any]:
    if info.get("prevention"):
        return info
    return {**info, "prevention": _DEFAULT_PREVENTION}


def lookup_treatment(label: str) -> Dict[str, Any]:
    """Map CNN class label (Crop__Disease) to disease_info.json entry."""
    db = load_disease_info()
    if label in db:
        return _ensure_prevention(db[label])

    if "__" in label:
        crop, disease = label.split("__", 1)
        # Prefer PlantVillage-style keys (Crop___Disease) — they include prevention.
        for candidate in (f"{crop}___{disease}", f"{crop}_{disease}"):
            if candidate in db:
                return _ensure_prevention(db[candidate])

        crop_l = crop.lower()
        disease_l = disease.lower().replace("_", " ")
        for key, val in db.items():
            key_l = key.lower()
            if not key_l.startswith(crop_l):
                continue
            suffix = key[len(crop) :].lstrip("_")
            suffix_l = suffix.lower().replace("_", " ")
            if disease_l in suffix_l or suffix_l in disease_l:
                return _ensure_prevention(val)

    norm = label.replace("__", " ").replace("_", " ").lower()
    for key, val in db.items():
        if norm in key.lower().replace("_", " "):
            return _ensure_prevention(val)

    return {
        "cause": "Environmental stress or pathogen infection.",
        "treatment": [
            "Remove affected leaves and destroy them.",
            "Apply recommended fungicide/bactericide as per local agri officer advice.",
            "Improve drainage and air circulation.",
        ],
        "prevention": _DEFAULT_PREVENTION,
    }


def build_diagnosis_context(
    *,
    label: str,
    display_name: str,
    crop: str,
    confidence: float,
    band: str,
    top3: List[Dict[str, Any]],
    include_top3: bool = False,
) -> str:
    info = lookup_treatment(label)
    treatment = info.get("treatment", [])
    if isinstance(treatment, str):
        treatment = [treatment]

    top3_lines = ""
    if include_top3 and top3:
        top3_lines = "\nTop-3 predictions:\n" + "\n".join(
            f"  - {p.get('display_name', p.get('label'))}: {p.get('confidence', 0):.1f}%"
            for p in top3[:3]
        )

    return f"""Crop: {crop}
Disease: {display_name}
Internal label: {label}
Confidence: {confidence:.1f}% ({band})
Cause: {info.get('cause', 'Unknown')}
Treatment facts:
{chr(10).join(f'  - {t}' for t in treatment)}
Prevention: {info.get('prevention', 'Follow integrated pest management.')}{top3_lines}"""


def build_chat_system_prompt(channel: str = "web") -> str:
    length = {
        "web": "Write exactly 3 bullet points.",
        "expo": "Write exactly 3 bullet points.",
        "whatsapp": "Write 2 short bullet points.",
        "voice": "Write 2-3 short spoken sentences for a phone call. No bullet symbols.",
    }.get(channel, "Write exactly 3 bullet points.")

    format_rule = (
        "FORMAT: Use exactly 3 bullet points (2 for WhatsApp). "
        "Each bullet must contain 2-3 full sentences (about 2-3 lines of practical detail). "
        "Start each bullet with • and leave a blank line between bullets. "
        "Do not write one-sentence bullets or a single paragraph."
        if channel != "voice"
        else ""
    )

    return (
        "You are Sasya AI, a farmer assistant for India. "
        "Always respond in English. "
        "Use the facts below when available. Do not invent URLs, citations, or unlisted chemical doses. "
        "If facts are limited, give helpful general agricultural guidance and suggest consulting a local officer. "
        f"{format_rule}"
        f"{length} Use simple language a farmer can follow."
    )


def build_general_qa_prompt(*, facts: str, user_message: str, channel: str) -> str:
    system = build_chat_system_prompt(channel)
    return (
        f"{system}\n\n"
        f"Facts:\n{facts}\n\n"
        f"Farmer question: {user_message}"
    )


def build_disease_prompt(
    *,
    label: str,
    display_name: str,
    crop: str,
    confidence: float,
    band: str,
    user_message: str,
    channel: str = "web",
    top3: Optional[List[Dict[str, Any]]] = None,
) -> str:
    info = lookup_treatment(label)
    treatment = info.get("treatment", [])
    if isinstance(treatment, str):
        treatment = [treatment]

    facts = "\n".join(f"  - {t}" for t in treatment)
    system = build_chat_system_prompt(channel)

    top3_block = ""
    # Top-3 is shown in API JSON only — never feed alternate diseases to the LLM

    return (
        f"{system}\n\n"
        f"Crop: {crop}\n"
        f"Disease: {display_name} (confidence: {confidence:.0f}%, band: {band})\n"
        f"Cause: {info.get('cause', 'Unknown')}\n"
        f"Treatment:\n{facts}\n"
        f"Prevention: {info.get('prevention', 'Follow integrated pest management.')}"
        f"{top3_block}\n\n"
        f"Farmer question: {user_message}"
    )


def _split_sentences(text: str) -> List[str]:
    parts = [s.strip() for s in re.split(r"(?<=[.!?।])\s+", text) if len(s.strip()) > 8]
    return [p for p in parts if not p.endswith(":") or len(p) > 40]


def _group_sentences_into_bullets(
    sentences: List[str], *, num_bullets: int = 3, min_per: int = 2, max_per: int = 3
) -> List[str]:
    if not sentences:
        return []
    if len(sentences) == 1:
        return sentences

    grouped: List[str] = []
    idx = 0
    for b in range(num_bullets):
        if idx >= len(sentences):
            break
        remaining_bullets = num_bullets - b
        remaining_sents = len(sentences) - idx
        take = min(max_per, max(min_per, remaining_sents // remaining_bullets))
        take = min(take, remaining_sents)
        chunk = sentences[idx : idx + take]
        grouped.append(" ".join(chunk))
        idx += take
    return grouped


def format_as_bullets(text: str, channel: str = "web", max_points: int = 3) -> str:
    """Format chat text as 2-3 bullets, each with 2-3 sentences."""
    if channel == "voice":
        return text.strip()

    text = re.sub(r"\n{3,}", "\n\n", text.strip())
    if not text:
        return text

    chunks: List[str] = []
    if re.search(r"^[•\-\*]\s", text, re.M) or re.search(r"^\d+\.\s", text, re.M):
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            line = re.sub(r"^\d+\.\s*", "", line)
            line = re.sub(r"^[•\-\*]\s*", "", line)
            if line and not (line.endswith(":") and len(line) < 50):
                chunks.append(line)
    else:
        chunks = _split_sentences(text)

    sentences: List[str] = []
    for chunk in chunks:
        if len(chunk) > 180 and ". " in chunk:
            sentences.extend(_split_sentences(chunk))
        else:
            sentences.append(chunk)

    if not sentences:
        return text

    num_bullets = 2 if channel == "whatsapp" else max_points
    grouped = _group_sentences_into_bullets(sentences, num_bullets=num_bullets)
    if not grouped:
        return text

    return "\n\n".join(f"• {b}" for b in grouped[:num_bullets])


def format_kb_facts_only(question: str, channel: str = "web") -> str:
    """Fallback — return best KB answer without LLM."""
    entries = retrieve_kb_entries(question, max_entries=1)
    if not entries:
        return (
            "I don't have specific information on this topic. "
            "Please consult your local agricultural officer."
        )
    answer = entries[0].get("answer", "")
    if channel == "voice":
        parts = re.split(r"[.!?।]\s+", answer)
        return parts[0].strip() + "." if parts else answer
    if channel == "whatsapp" and len(answer) > 280:
        answer = answer[:277] + "..."
    return format_as_bullets(answer, channel=channel)


def format_facts_only(
    *,
    label: str,
    display_name: str,
    crop: str,
    confidence: float,
    band: str,
    channel: str = "web",
    top3: Optional[List[Dict[str, Any]]] = None,
) -> str:
    info = lookup_treatment(label)
    treatment = info.get("treatment", [])
    if isinstance(treatment, str):
        treatment = [treatment]

    if channel == "voice":
        t0 = treatment[0] if treatment else "Consult local agri officer."
        return (
            f"Your {crop} crop likely has {display_name}, "
            f"{confidence:.0f} percent confidence. {t0}"
        )

    lines = [
        f"Diagnosis: {display_name} ({confidence:.0f}% confidence, {band})",
        f"Crop: {crop}",
        "",
        "Treatment:",
        *[f"• {t}" for t in treatment[:4 if channel == "whatsapp" else 8]],
    ]
    prev = info.get("prevention")
    if prev:
        lines += ["", f"Prevention: {prev}"]
    # top3 stays in API JSON only — not in farmer-facing advisory text
    return "\n".join(lines)
