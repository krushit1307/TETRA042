from fastapi import APIRouter

from app.schemas import HealthResponse
from app.services import disease, models as model_registry

router = APIRouter(tags=["health"])


@router.get("/", summary="Root")
async def root():
    return {"name": "Sasya AI", "docs": "/docs", "health": "/health"}


@router.get("/health", response_model=HealthResponse)
async def health():
    st = model_registry.status()
    st["disease"] = disease.is_loaded()
    return HealthResponse(
        status="ok",
        models=st,
        device=str(model_registry.device()),
    )
