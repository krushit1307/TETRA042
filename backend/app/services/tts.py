"""Text-to-speech: gTTS → edge-tts → optional ElevenLabs."""

from __future__ import annotations

import logging
import os
import tempfile
from pathlib import Path
from typing import Optional

logger = logging.getLogger("sasya.tts")

GTTS_LANG = {
    "hi": "hi",
    "en": "en",
    "bn": "bn",
    "gu": "gu",
    "kn": "kn",
    "ml": "ml",
    "mr": "mr",
    "ta": "ta",
    "te": "te",
    "or": "en",  # gTTS has no Odia — fallback en
}

EDGE_VOICE = {
    "hi": "hi-IN-SwaraNeural",
    "en": "en-IN-NeerjaNeural",
    "bn": "bn-IN-TanishaaNeural",
    "gu": "gu-IN-DhwaniNeural",
    "kn": "kn-IN-SapnaNeural",
    "ml": "ml-IN-MidhunNeural",
    "mr": "mr-IN-AarohiNeural",
    "ta": "ta-IN-PallaviNeural",
    "te": "te-IN-ShrutiNeural",
    "or": "en-IN-NeerjaNeural",
}


def _elevenlabs_tts(text: str, lang: str) -> Optional[Path]:
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        return None
    try:
        import httpx

        voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {"xi-api-key": api_key, "Content-Type": "application/json"}
        payload = {"text": text, "model_id": "eleven_multilingual_v2"}
        with httpx.Client(timeout=60) as client:
            r = client.post(url, json=payload, headers=headers)
            r.raise_for_status()
        out = Path(tempfile.mkstemp(suffix=".mp3")[1])
        out.write_bytes(r.content)
        return out
    except Exception as exc:
        logger.warning("ElevenLabs TTS failed: %s", exc)
        return None


async def _edge_tts(text: str, lang: str) -> Optional[Path]:
    try:
        import edge_tts

        voice = EDGE_VOICE.get(lang, EDGE_VOICE["en"])
        out = Path(tempfile.mkstemp(suffix=".mp3")[1])
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(out))
        return out
    except Exception as exc:
        logger.warning("edge-tts failed: %s", exc)
        return None


def _gtts(text: str, lang: str) -> Optional[Path]:
    try:
        from gtts import gTTS

        code = GTTS_LANG.get(lang, "en")
        out = Path(tempfile.mkstemp(suffix=".mp3")[1])
        gTTS(text=text, lang=code).save(str(out))
        return out
    except Exception as exc:
        logger.warning("gTTS failed: %s", exc)
        return None


async def synthesize(text: str, lang: str = "hi") -> Path:
    """Returns path to mp3. Caller should delete after serving."""
    if not text.strip():
        raise ValueError("Empty text for TTS")

    # Priority: ElevenLabs (if key) → edge-tts → gTTS
    path = _elevenlabs_tts(text, lang)
    if path:
        return path

    path = await _edge_tts(text, lang)
    if path:
        return path

    path = _gtts(text, lang)
    if path:
        return path

    raise RuntimeError("All TTS backends failed")
