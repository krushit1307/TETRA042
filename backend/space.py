"""
Sasya AI — Hugging Face Space entry point (Gradio SDK).

Works on CPU basic (recommended) and ZeroGPU (set USE_ZEROGPU=1).
"""

from __future__ import annotations

import gradio as gr

from app.main import app as fastapi_app
from gradio_ui import build_demo

demo = build_demo()

# Gradio UI at / ; REST API at /health, /chat, /docs, etc.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn

    from app.config import PORT

    uvicorn.run("space:app", host="0.0.0.0", port=PORT)
