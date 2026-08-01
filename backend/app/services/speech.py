"""Speech-to-text via Whisper."""

from __future__ import annotations

import logging
import tempfile
from pathlib import Path

import librosa
import torch

from app.services import models as model_registry

logger = logging.getLogger("sasya.speech")


def _load_audio(audio_bytes: bytes) -> tuple:
    suffix = ".wav"
    if audio_bytes[:3] == b"ID3" or audio_bytes[:2] == b"\xff\xfb":
        suffix = ".mp3"
    elif audio_bytes[:4] == b"OggS":
        suffix = ".ogg"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        audio, _ = librosa.load(tmp_path, sr=16000, mono=True)
        return audio
    finally:
        Path(tmp_path).unlink(missing_ok=True)


def transcribe(audio_bytes: bytes, language: str | None = None) -> str:
    if not model_registry.load_whisper():
        raise RuntimeError("Whisper not available")

    bundle = model_registry.whisper_bundle()
    assert bundle is not None

    processor = bundle["processor"]
    model = bundle["model"]
    device = bundle["device"]

    audio = _load_audio(audio_bytes)
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    gen_kwargs: dict = {"max_new_tokens": 256}
    if language:
        try:
            gen_kwargs["forced_decoder_ids"] = processor.get_decoder_prompt_ids(
                language=language, task="transcribe"
            )
        except Exception:
            pass

    with torch.no_grad():
        ids = model.generate(**inputs, **gen_kwargs)
    return processor.batch_decode(ids, skip_special_tokens=True)[0].strip()
