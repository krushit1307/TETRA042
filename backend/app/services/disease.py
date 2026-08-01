"""EfficientNet-V2-S disease classifier."""

from __future__ import annotations

import io
import json
import logging
from typing import Any, Dict, List, Optional

import albumentations as A
import numpy as np
import timm
import torch
import torch.nn as nn
from albumentations.pytorch import ToTensorV2
from huggingface_hub import hf_hub_download
from PIL import Image

from app.config import (
    CLASSES_PATH,
    DISEASE_CKPT,
    DISEASE_MODEL_NAME,
    HF_DISEASE_REPO,
    IMAGENET_MEAN,
    IMAGENET_STD,
    IMG_SIZE,
)
from app.services.advisory import lookup_treatment

logger = logging.getLogger("sasya.disease")

_model: Optional[nn.Module] = None
_device: torch.device = torch.device("cpu")
_class_data: Dict[str, Any] = {}
_transform: Optional[A.Compose] = None


def _build_transform() -> A.Compose:
    return A.Compose(
        [
            A.Resize(height=IMG_SIZE, width=IMG_SIZE),
            A.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
            ToTensorV2(),
        ]
    )


def _resolve_checkpoint() -> str:
    if DISEASE_CKPT.exists():
        return str(DISEASE_CKPT)
    logger.info("Downloading disease checkpoint from HF Hub: %s", HF_DISEASE_REPO)
    return hf_hub_download(repo_id=HF_DISEASE_REPO, filename="best_model.pth")


def _resolve_classes() -> Dict[str, Any]:
    if CLASSES_PATH.exists():
        with CLASSES_PATH.open(encoding="utf-8") as f:
            return json.load(f)
    path = hf_hub_download(repo_id=HF_DISEASE_REPO, filename="classes.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load() -> bool:
    global _model, _device, _class_data, _transform
    try:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        _class_data = _resolve_classes()
        num_classes = len(_class_data.get("classes", []))
        if num_classes == 0:
            raise RuntimeError("classes.json has no classes")

        _model = timm.create_model(DISEASE_MODEL_NAME, pretrained=False, num_classes=num_classes)
        ckpt = _resolve_checkpoint()
        state = torch.load(ckpt, map_location=_device, weights_only=True)
        _model.load_state_dict(state)
        _model.to(_device)
        _model.eval()
        _transform = _build_transform()
        logger.info("Disease model loaded on %s (%d classes)", _device, num_classes)
        return True
    except Exception as exc:
        logger.error("Failed to load disease model: %s", exc)
        _model = None
        return False


def is_loaded() -> bool:
    return _model is not None


def confidence_band(prob: float) -> str:
    if prob >= 0.70:
        return "high"
    if prob >= 0.50:
        return "medium"
    return "low"


def _label_to_crop(label: str) -> str:
    return label.split("__")[0].replace("_", " ") if "__" in label else "Unknown"


@torch.no_grad()
def diagnose(image_bytes: bytes) -> Dict[str, Any]:
    if _model is None or _transform is None:
        raise RuntimeError("Disease model not loaded")

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    rgb = np.array(image)
    tensor = _transform(image=rgb)["image"].unsqueeze(0).to(_device)

    logits = _model(tensor)
    probs = torch.softmax(logits, dim=1)[0].cpu().numpy()
    top3_idx = np.argsort(probs)[::-1][:3]

    classes: List[str] = _class_data["classes"]
    label_to_display: Dict[str, str] = _class_data.get("label_to_display", {})

    top1 = int(top3_idx[0])
    label = classes[top1]
    conf = float(probs[top1])
    display = label_to_display.get(label, label.replace("__", " ").replace("_", " "))
    display = " ".join(display.split())  # normalize whitespace
    crop = _label_to_crop(label)
    band = confidence_band(conf)

    top3 = []
    for idx in top3_idx:
        lbl = classes[int(idx)]
        top3.append(
            {
                "label": lbl,
                "display_name": " ".join(
                    label_to_display.get(lbl, lbl.replace("__", " ").replace("_", " ")).split()
                ),
                "confidence": round(float(probs[int(idx)]) * 100, 2),
            }
        )

    info = lookup_treatment(label)
    treatment = info.get("treatment", [])
    if isinstance(treatment, str):
        treatment = [treatment]

    return {
        "disease": label,
        "display_name": display,
        "confidence": round(conf * 100, 2),
        "confidence_band": band,
        "crop": crop,
        "cause": info.get("cause"),
        "treatment": treatment,
        "prevention": info.get("prevention"),
        "top3": top3,
    }
