import json
import logging
import urllib.request

from app.config import ELEVENLABS_AGENT_ID, ELEVENLABS_API_KEY

logger = logging.getLogger("sasya.elevenlabs")


def get_signed_url(agent_id: str | None, api_key: str | None) -> str | None:
    """Generate a signed WebSocket URL for ElevenLabs Conversational AI."""
    if not agent_id or not api_key:
        return None
    try:
        url = f"https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id={agent_id}"
        req = urllib.request.Request(url, headers={"xi-api-key": api_key})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data.get("signed_url")
    except Exception as exc:
        logger.error("Failed to get ElevenLabs signed URL: %s", exc)
        return None


LANG_MAP = {
    "en": "English",
    "gu": "Gujarati",
    "hi": "Hindi",
    "mr": "Marathi",
    "pa": "Punjabi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "bn": "Bengali",
    "or": "Odia",
}


def start_voice_session(
    language: str,
    crop: str,
    disease: str,
    confidence: float,
    severity: str,
):
    """Prepare data for an ElevenLabs voice session."""
    signed_url = get_signed_url(ELEVENLABS_AGENT_ID, ELEVENLABS_API_KEY)
    lang_name = LANG_MAP.get(language.lower(), language)

    return {
        "api_key_loaded": ELEVENLABS_API_KEY is not None,
        "agent_id": ELEVENLABS_AGENT_ID,
        "signed_url": signed_url,
        "dynamic_variables": {
            "language": lang_name,
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "severity": severity,
        },
    }
