from fastapi import APIRouter
from pydantic import BaseModel

from app.services.elevenlabs_service import (
    start_voice_session as start_voice_session_service,
)

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])


class VoiceSessionRequest(BaseModel):
    language: str
    crop: str
    disease: str
    confidence: float
    severity: str


@router.post("/start-voice-session")
async def start_voice_session(request: VoiceSessionRequest):
    result = start_voice_session_service(
        language=request.language,
        crop=request.crop,
        disease=request.disease,
        confidence=request.confidence,
        severity=request.severity,
    )

    return result