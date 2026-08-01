"""Sasya AI — Agricultural disease detection & advisory API."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import PORT
from app.routes import diagnose, health, speech, voice
from app.services import advisory, disease, models as model_registry

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger("sasya.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading Sasya AI models...")
    disease.load()
    advisory.preload()
    logger.info("Startup complete — disease=%s device=%s", disease.is_loaded(), model_registry.device())
    yield
    logger.info("Shutting down Sasya AI")


app = FastAPI(
    title="Sasya AI",
    description="Crop disease detection & farmer advisory for India",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(diagnose.router)
app.include_router(speech.router)
app.include_router(voice.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=False)
