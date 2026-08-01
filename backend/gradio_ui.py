"""Gradio demo UI for Hugging Face Space (API stays on FastAPI routes)."""

from __future__ import annotations

import io
import logging

import gradio as gr
from PIL import Image

from app.services.zerogpu import gpu_decorator

logger = logging.getLogger("sasya.gradio")

LANG_CHOICES = [
    ("English", "en"),
    ("Hindi", "hi"),
    ("Gujarati", "gu"),
    ("Marathi", "mr"),
    ("Tamil", "ta"),
    ("Telugu", "te"),
    ("Bengali", "bn"),
    ("Kannada", "kn"),
    ("Malayalam", "ml"),
]


def _pil_to_bytes(image: Image.Image) -> bytes:
    buf = io.BytesIO()
    image.convert("RGB").save(buf, format="JPEG")
    return buf.getvalue()


@gpu_decorator(duration=120)
def diagnose_leaf(image, language: str, explain: bool):
    """Disease CNN + optional TinyLlama advisory."""
    if image is None:
        return "Please upload a leaf image.", ""

    from app.services import chat as chat_service, disease

    try:
        result = disease.diagnose(_pil_to_bytes(image))
        result = chat_service.translate_diagnosis_fields(result, language)
    except Exception as exc:
        return f"Diagnosis error: {exc}", ""

    lines = [
        f"**{result['display_name']}**",
        f"Crop: {result['crop']}",
        f"Confidence: {result['confidence']}% ({result['confidence_band']})",
        "",
        f"**Cause:** {result.get('cause') or '—'}",
        "",
        "**Treatment:**",
        *[f"- {t}" for t in result.get("treatment", [])],
    ]
    if result.get("prevention"):
        lines += ["", f"**Prevention:** {result['prevention']}"]

    if result.get("top3"):
        lines += ["", "**Top-3:**"]
        for p in result["top3"]:
            lines.append(f"- {p['display_name']}: {p['confidence']}%")

    structured = "\n".join(lines)
    advisory = ""

    if explain:
        try:
            from app.services import chat as chat_service

            text, source = chat_service.run_advisory_pipeline(
                "Explain the diagnosis and treatment to the farmer.",
                lang=language,
                channel="web",
                diagnosis=result,
            )
            advisory = f"*({source})*\n\n{text}"
        except Exception as exc:
            advisory = f"Advisory unavailable: {exc}"

    return structured, advisory


@gpu_decorator(duration=180)
def ask_chat(message: str, language: str, channel: str):
    """KB retrieval + TinyLlama rewrite."""
    if not message.strip():
        return "Please enter a question."
    try:
        from app.services import chat as chat_service

        text, source = chat_service.run_advisory_pipeline(
            message, lang=language, channel=channel
        )
        return f"*Source: {source}*\n\n{text}"
    except Exception as exc:
        return f"Error: {exc}"


def build_demo() -> gr.Blocks:
    with gr.Blocks(title="Sasya AI") as demo:
        gr.Markdown(
            """
            # 🌾 Sasya AI
            **Crop disease detection & farmer advisory for India**

            REST API for mobile/web: `/docs` · `/health` · `/image-diagnosis` · `/chat`
            """
        )

        with gr.Tabs():
            with gr.Tab("🍃 Disease Detection"):
                with gr.Row():
                    with gr.Column():
                        leaf_img = gr.Image(type="pil", label="Upload leaf photo")
                        lang_dd = gr.Dropdown(
                            choices=LANG_CHOICES,
                            value="en",
                            label="Language",
                        )
                        explain_cb = gr.Checkbox(
                            label="AI explanation (TinyLlama — facts only)",
                            value=True,
                        )
                        diag_btn = gr.Button("Diagnose", variant="primary")
                    with gr.Column():
                        diag_out = gr.Markdown(label="Diagnosis")
                        advisory_out = gr.Markdown(label="Farmer advisory")

                # Pass @spaces.GPU function directly — no lambda wrapper
                diag_btn.click(
                    fn=diagnose_leaf,
                    inputs=[leaf_img, lang_dd, explain_cb],
                    outputs=[diag_out, advisory_out],
                )

            with gr.Tab("💬 Ask Sasya"):
                chat_msg = gr.Textbox(
                    label="Your question",
                    placeholder="e.g. How to control powdery mildew in wheat?",
                    lines=3,
                )
                with gr.Row():
                    chat_lang = gr.Dropdown(
                        choices=LANG_CHOICES,
                        value="en",
                        label="Language",
                    )
                    chat_channel = gr.Dropdown(
                        choices=["web", "whatsapp", "voice"],
                        value="web",
                        label="Channel",
                    )
                chat_btn = gr.Button("Ask", variant="primary")
                chat_out = gr.Markdown()

                chat_btn.click(
                    fn=ask_chat,
                    inputs=[chat_msg, chat_lang, chat_channel],
                    outputs=chat_out,
                )

            with gr.Tab("📡 API"):
                gr.Markdown(
                    """
                    ### Mobile / Expo integration
                    ```
                    EXPO_PUBLIC_API_URL=https://neel2601-sasya-ai.hf.space
                    ```

                    | Endpoint | Method |
                    |----------|--------|
                    | `/health` | GET |
                    | `/image-diagnosis` | POST |
                    | `/chat` | POST |
                    | `/chat-with-image` | POST |
                    | `/speech-to-text` | POST |
                    | `/voice-chat` | POST |
                    | `/translate` | POST |

                    Open **[API docs](/docs)** for interactive testing.
                    """
                )

    return demo
