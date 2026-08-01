from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas import ChatResponse, DiagnosisResponse, PredictionItem
from app.services import chat as chat_service
from app.services import disease

router = APIRouter(tags=["diagnosis"])


@router.post("/image-diagnosis", response_model=DiagnosisResponse)
async def image_diagnosis(
    image_file: UploadFile = File(...),
    language: str = Form("en"),
    channel: str = Form("web"),
    explain: bool = Form(False),
    message: str = Form("What disease is this and how do I treat it?"),
):
    """
    Image → EfficientNet-V2 → disease_info.json lookup.
    If explain=true, TinyLlama rewrites facts (RAG, no hallucination).
    """
    if not disease.is_loaded():
        raise HTTPException(status_code=503, detail="Disease model not loaded")

    raw = await image_file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty image")

    try:
        result = disease.diagnose(raw)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    result = chat_service.translate_diagnosis_fields(result, language)

    advisory = None
    advisory_source = None
    if explain:
        advisory, advisory_source = chat_service.run_advisory_pipeline(
            message, lang=language, channel=channel, diagnosis=result
        )

    return DiagnosisResponse(
        disease=result["disease"],
        display_name=result["display_name"],
        confidence=result["confidence"],
        confidence_band=result["confidence_band"],
        crop=result["crop"],
        cause=result.get("cause"),
        treatment=result.get("treatment", []),
        prevention=result.get("prevention"),
        top3=[PredictionItem(**p) for p in result.get("top3", [])],
        advisory=advisory,
        advisory_source=advisory_source,
    )


@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_alias(
    image: UploadFile = File(...),
    language: str = Form("en"),
    channel: str = Form("web"),
    explain: bool = Form(False),
    message: str = Form("What disease is this and how do I treat it?"),
):
    return await image_diagnosis(
        image_file=image,
        language=language,
        channel=channel,
        explain=explain,
        message=message,
    )


@router.post("/chat", response_model=ChatResponse)
async def agricultural_chat(
    message: str = Form(...),
    lang: str = Form("en"),
    channel: str = Form("web"),
):
    """
    General Q&A: agricultural_kb.json keyword retrieval → TinyLlama rewrite.
    """
    try:
        text, source = chat_service.run_advisory_pipeline(message, lang=lang, channel=channel)
        return ChatResponse(response=text, language=lang, source=source)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/chat-with-image", response_model=ChatResponse)
async def chat_with_image(
    message: str = Form(...),
    image_file: UploadFile = File(...),
    lang: str = Form("en"),
    channel: str = Form("web"),
):
    """Full pipeline: image diagnosis + RAG advisory."""
    if not disease.is_loaded():
        raise HTTPException(status_code=503, detail="Disease model not loaded")

    raw = await image_file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty image")

    try:
        diagnosis = disease.diagnose(raw)
        text, source = chat_service.run_advisory_pipeline(
            message, lang=lang, channel=channel, diagnosis=diagnosis
        )
        return ChatResponse(response=text, language=lang, source=source)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
