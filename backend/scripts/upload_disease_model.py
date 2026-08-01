# Upload disease model to Hugging Face Hub
# Run after: hf auth login  (or set HF_TOKEN env var)

from huggingface_hub import HfApi

REPO = "Neel2601/sasya-disease-v2"
CKPT = "trained_models/disease_detection/best_model.pth"
CLASSES = "trained_models/disease_detection/classes.json"

api = HfApi()
api.create_repo(REPO, repo_type="model", exist_ok=True)
api.upload_file(path_or_fileobj=CKPT, path_in_repo="best_model.pth", repo_id=REPO, repo_type="model")
api.upload_file(path_or_fileobj=CLASSES, path_in_repo="classes.json", repo_id=REPO, repo_type="model")
print(f"Uploaded to https://huggingface.co/{REPO}")
