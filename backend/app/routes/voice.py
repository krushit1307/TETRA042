from fastapi import APIRouter
from pydantic import BaseModel

import app.services.elevenlabs_service as elevenlabs_service

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])


class VoiceSessionRequest(BaseModel):
    language: str
    crop: str
    disease: str
    confidence: float
    severity: str


@router.post("/start-voice-session")
async def start_voice_session(request: VoiceSessionRequest):
    return elevenlabs_service.start_voice_session(
        language=request.language,
        crop=request.crop,
        disease=request.disease,
        confidence=request.confidence,
        severity=request.severity,
    )
