# Sasya AI Backend (TETRA042)

FastAPI + Gradio backend for crop disease detection and multilingual farmer advisory.

## Live API (recommended for frontend)

```
https://neel2601-sasya-ai-backend.hf.space
```

## Local setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
copy .env.example .env
python -m uvicorn space:app --host 0.0.0.0 --port 7860
```

Open `http://localhost:7860/docs` for API docs.

## Models (auto-download from Hugging Face)

| Component | Source |
|-----------|--------|
| Disease CNN | `Neel2601/sasya-disease-v2` |
| TinyLlama LoRA | `Neel2601/tinyllama-agricultural-adapter` |
| NLLB translation | `facebook/nllb-200-distilled-600M` |
| Whisper STT | `openai/whisper-small` |

## Knowledge base (chat RAG)

For full chat answers locally, place `agricultural_kb.json` at:

```
trained_models/agricultural_tinyllama/agricultural_kb.json
```

This file is **not in git** (too large). Ask a teammate or copy from the deployed HF Space Docker image. Without it, disease detection still works; chat uses disease_info + general fallback.

## Frontend connection

In `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://neel2601-sasya-ai-backend.hf.space
```

For local backend:

```
NEXT_PUBLIC_API_URL=http://localhost:7860
```

## API endpoints

- `GET /health`
- `POST /image-diagnosis` — upload image + `language` form field
- `POST /chat` — text Q&A (`lang`, `channel`)
- `POST /speech-to-text`
- `POST /translate`
- `POST /text-to-speech`

## Deploy to Hugging Face Space

See `Dockerfile`. Push this folder to a Docker Space or use the existing `farmer-ai-backend` Space.
