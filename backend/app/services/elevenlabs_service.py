"""ElevenLabs service for Sasya AI voice assistant."""

from app.config import ELEVENLABS_AGENT_ID, ELEVENLABS_API_KEY


def start_voice_session(
    language: str,
    crop: str,
    disease: str,
    confidence: float,
    severity: str,
):
    """Prepare data for an ElevenLabs voice session."""
    return {
        "api_key_loaded": ELEVENLABS_API_KEY is not None,
        "agent_id": ELEVENLABS_AGENT_ID,
        "dynamic_variables": {
            "language": language,
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "severity": severity,
        },
    }
