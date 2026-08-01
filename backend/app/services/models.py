"""Lazy loaders for Whisper, NLLB, TinyLlama."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Optional

import torch
from transformers import (
    AutoModelForCausalLM,
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    WhisperForConditionalGeneration,
    WhisperProcessor,
)

from app.config import (
    HF_TINYLLAMA_ADAPTER,
    MODELS_DIR,
    NLLB_MODEL,
    ROOT,
    TINYLLAMA_BASE,
    WHISPER_MODEL,
)

logger = logging.getLogger("sasya.models")

try:
    from peft import PeftModel

    PEFT_AVAILABLE = True
except ImportError:
    PEFT_AVAILABLE = False

_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_whisper: Optional[Dict[str, Any]] = None
_nllb: Optional[Dict[str, Any]] = None
_tinyllama: Optional[Dict[str, Any]] = None
_tinyllama_adapter_loaded: bool = False


def device() -> torch.device:
    return _device


def adapter_loaded() -> bool:
    return _tinyllama_adapter_loaded


def _find_adapter_dir() -> Optional[Path]:
    local = ROOT / "trained_models" / "tinyllama_agricultural"
    for folder in (local, local / "checkpoint-6279"):
        if not folder.exists():
            continue
        if (folder / "adapter_config.json").exists() and (
            (folder / "adapter_model.safetensors").exists()
            or (folder / "adapter_model.bin").exists()
        ):
            return folder
    return None


def load_whisper() -> bool:
    global _whisper
    if _whisper is not None:
        return True
    try:
        from app.config import USE_WHISPER_FINETUNE

        local = ROOT / "trained_models" / "whisper_multilingual"
        if USE_WHISPER_FINETUNE and local.exists():
            model_id = str(local)
        else:
            model_id = WHISPER_MODEL
        logger.info("Loading Whisper: %s", model_id)
        processor = WhisperProcessor.from_pretrained(model_id)
        dtype = torch.float16 if _device.type == "cuda" else torch.float32
        model = WhisperForConditionalGeneration.from_pretrained(model_id, torch_dtype=dtype)
        model.to(_device)
        model.eval()
        _whisper = {"processor": processor, "model": model, "device": _device}
        return True
    except Exception as exc:
        logger.error("Whisper load failed: %s", exc)
        return False


def load_nllb() -> bool:
    global _nllb
    if _nllb is not None:
        return True
    try:
        local = MODELS_DIR / "translation" / "nllb_600m"
        model_id = str(local) if local.exists() else NLLB_MODEL
        logger.info("Loading NLLB: %s", model_id)
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
        model.to(_device)
        model.eval()
        _nllb = {"tokenizer": tokenizer, "model": model, "device": _device}
        return True
    except Exception as exc:
        logger.error("NLLB load failed: %s", exc)
        return False


def load_tinyllama() -> bool:
    """Load TinyLlama with agricultural LoRA when available; else base model."""
    global _tinyllama, _tinyllama_adapter_loaded
    if _tinyllama is not None:
        return True
    if not PEFT_AVAILABLE:
        logger.warning("peft not installed — loading base TinyLlama without adapter")

    adapter_dir = _find_adapter_dir()
    adapter_id = str(adapter_dir) if adapter_dir else HF_TINYLLAMA_ADAPTER

    try:
        logger.info("Loading TinyLlama base: %s", TINYLLAMA_BASE)
        tokenizer = AutoTokenizer.from_pretrained(TINYLLAMA_BASE)
        dtype = torch.float16 if _device.type == "cuda" else torch.float32
        base = AutoModelForCausalLM.from_pretrained(
            TINYLLAMA_BASE, torch_dtype=dtype, low_cpu_mem_usage=True
        )
        model = base
        _tinyllama_adapter_loaded = False
        if PEFT_AVAILABLE:
            try:
                model = PeftModel.from_pretrained(base, adapter_id, is_trainable=False)
                _tinyllama_adapter_loaded = True
                logger.info("TinyLlama agricultural adapter loaded from %s", adapter_id)
            except Exception as adapter_exc:
                logger.warning(
                    "TinyLlama adapter unavailable (%s) — using base model",
                    adapter_exc,
                )
        model.to(_device)
        model.eval()
        _tinyllama = {"tokenizer": tokenizer, "model": model, "device": _device}
        return True
    except Exception as exc:
        logger.error("TinyLlama load failed: %s", exc)
        _tinyllama = None
        _tinyllama_adapter_loaded = False
        return False


def whisper_bundle() -> Optional[Dict[str, Any]]:
    return _whisper


def nllb_bundle() -> Optional[Dict[str, Any]]:
    return _nllb


def tinyllama_bundle() -> Optional[Dict[str, Any]]:
    return _tinyllama


def status() -> Dict[str, bool]:
    return {
        "disease": False,
        "whisper": _whisper is not None,
        "nllb": _nllb is not None,
        "tinyllama": _tinyllama is not None,
        "tinyllama_adapter": _tinyllama_adapter_loaded,
    }
