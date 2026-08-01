"""Sasya AI backend configuration."""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_DIR = Path(__file__).resolve().parent

TRAINED_MODELS_DIR = ROOT / "trained_models"
DISEASE_DIR = TRAINED_MODELS_DIR / "disease_detection"
MODELS_DIR = ROOT / "models"

DISEASE_INFO_PATH = APP_DIR / "data" / "disease_info.json"
KB_PATH = TRAINED_MODELS_DIR / "agricultural_tinyllama" / "agricultural_kb.json"
CLASSES_PATH = DISEASE_DIR / "classes.json"
DISEASE_CKPT = DISEASE_DIR / "best_model.pth"

# Hugging Face repos (fallback when local weights missing — e.g. on HF Space)
HF_DISEASE_REPO = "Neel2601/sasya-disease-v2"
HF_TINYLLAMA_ADAPTER = "Neel2601/tinyllama-agricultural-adapter"
HF_WHISPER_REPO = "Neel2601/whisper-multilingual"  # or openai/whisper-small

TINYLLAMA_BASE = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
NLLB_MODEL = "facebook/nllb-200-distilled-600M"
WHISPER_MODEL = "openai/whisper-small"
USE_WHISPER_FINETUNE = os.getenv("USE_WHISPER_FINETUNE", "0").lower() in ("1", "true", "yes")

DISEASE_MODEL_NAME = "tf_efficientnetv2_s"
IMG_SIZE = 384
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)

PORT = int(os.getenv("PORT", "7860"))

# TinyLlama advisory — channel-specific output length (max_new_tokens)
CHANNEL_MAX_TOKENS = {
    "whatsapp": 100,   # 80–120 short bullets
    "voice": 70,       # 60–80 spoken sentences
    "web": 180,        # 150–200 bullets + confidence
    "expo": 180,       # same as web
}
ADVISORY_TEMPERATURE = 0.4  # 0.3–0.5 — facts only, no creativity
