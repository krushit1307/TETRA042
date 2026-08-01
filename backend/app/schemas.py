from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    models: Dict[str, bool]
    device: str


class PredictionItem(BaseModel):
    label: str
    display_name: str
    confidence: float


class DiagnosisResponse(BaseModel):
    disease: str
    display_name: str
    confidence: float
    confidence_band: str
    crop: str
    need_voice: bool = False
    cause: Optional[str] = None
    treatment: List[str] = Field(default_factory=list)
    prevention: Optional[Union[str, List[str]]] = None
    top3: List[PredictionItem] = Field(default_factory=list)
    advisory: Optional[str] = None
    advisory_source: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    language: str
    source: str = "tinyllama"


class VoiceChatResponse(BaseModel):
    transcript: str
    response: str
    language: str
    source: str
    audio_base64: Optional[str] = None


class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str


class SpeechResponse(BaseModel):
    text: str
    language: str = "auto"
