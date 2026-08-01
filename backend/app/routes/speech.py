from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.schemas import SpeechResponse, TranslateResponse, VoiceChatResponse
from app.services import chat as chat_service
from app.services import disease
from app.services import speech as speech_service
from app.services import tts as tts_service

router = APIRouter(tags=["speech"])


def _audio_b64(path) -> str:
    import base64
    data = path.read_bytes()
    path.unlink(missing_ok=True)
    return base64.b64encode(data).decode("ascii")


@router.post("/speech-to-text", response_model=SpeechResponse)
async def speech_to_text(
    audio_file: UploadFile = File(...),
    lang: str | None = Form(None),
):
    raw = await audio_file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty audio")
    try:
        text = speech_service.transcribe(raw, language=lang)
        return SpeechResponse(text=text, language=lang or "auto")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/translate", response_model=TranslateResponse)
async def translate(
    text: str = Form(...),
    source_lang: str = Form("en"),
    target_lang: str = Form("hi"),
):
    try:
        out = chat_service.translate_text(text, source_lang, target_lang)
        return TranslateResponse(
            translated_text=out,
            source_lang=source_lang,
            target_lang=target_lang,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/text-to-speech")
async def text_to_speech(
    text: str = Form(...),
    language: str = Form("hi"),
):
    """TTS: ElevenLabs (if key) → edge-tts → gTTS."""
    try:
        audio_path = await tts_service.synthesize(text, language)
        return FileResponse(
            audio_path,
            media_type="audio/mpeg",
            filename=f"speech_{language}.mp3",
            headers={"Cache-Control": "no-cache"},
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/voice-chat", response_model=VoiceChatResponse)
async def voice_chat(
    audio_file: UploadFile = File(...),
    language: str = Form("hi"),
    channel: str = Form("voice"),
    return_audio: bool = Form(False),
):
    """Whisper → KB/disease facts → TinyLlama → NLLB → optional TTS."""
    raw = await audio_file.read()
    try:
        text = speech_service.transcribe(raw, language=language)
        response, source = chat_service.run_advisory_pipeline(
            text, lang=language, channel=channel
        )
        audio_b64 = None
        if return_audio:
            audio_path = await tts_service.synthesize(response, language)
            audio_b64 = _audio_b64(audio_path)
        return VoiceChatResponse(
            transcript=text,
            response=response,
            language=language,
            source=source,
            audio_base64=audio_b64,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/voice-diagnosis")
async def voice_diagnosis(
    audio_file: UploadFile = File(...),
    image_file: UploadFile = File(...),
    language: str = Form("hi"),
    channel: str = Form("voice"),
    return_audio: bool = Form(False),
):
    if not disease.is_loaded():
        raise HTTPException(status_code=503, detail="Disease model not loaded")

    audio_raw = await audio_file.read()
    image_raw = await image_file.read()
    try:
        text = speech_service.transcribe(audio_raw, language=language)
        diag = disease.diagnose(image_raw)
        response, source = chat_service.run_advisory_pipeline(
            text, lang=language, channel=channel, diagnosis=diag
        )
        result = {
            "transcript": text,
            "diagnosis": diag,
            "response": response,
            "language": language,
            "source": source,
            "audio_base64": None,
        }
        if return_audio:
            audio_path = await tts_service.synthesize(response, language)
            result["audio_base64"] = _audio_b64(audio_path)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
