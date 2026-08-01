FROM python:3.10-slim

WORKDIR /code

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/home/user/.cache/huggingface

COPY --chown=user requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r /code/requirements.txt

COPY --chown=user space.py gradio_ui.py /code/
COPY --chown=user app /code/app
COPY --chown=user trained_models/disease_detection/classes.json /code/trained_models/disease_detection/classes.json
COPY --chown=user trained_models/agricultural_tinyllama/agricultural_kb.json /code/trained_models/agricultural_tinyllama/agricultural_kb.json

EXPOSE 7860

CMD ["uvicorn", "space:app", "--host", "0.0.0.0", "--port", "7860"]
