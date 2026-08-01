"""Upload TinyLlama LoRA adapter to Hugging Face Hub."""

from pathlib import Path

from huggingface_hub import HfApi

REPO = "Neel2601/tinyllama-agricultural-adapter"
ADAPTER_DIR = Path(__file__).resolve().parents[1] / "trained_models" / "tinyllama_agricultural"

WEIGHT_NAMES = ("adapter_model.safetensors", "adapter_model.bin")


def _find_weights(folder: Path) -> Path | None:
    for name in WEIGHT_NAMES:
        p = folder / name
        if p.exists():
            return p
    ckpt = folder / "checkpoint-6279"
    if ckpt.exists():
        for name in WEIGHT_NAMES:
            p = ckpt / name
            if p.exists():
                return p
    return None


def main() -> None:
    weights = _find_weights(ADAPTER_DIR)
    if weights is None:
        print("ERROR: No adapter_model.safetensors or .bin found.")
        print(f"Looked in: {ADAPTER_DIR}")
        print("TinyLlama will run in facts-only mode until weights are uploaded.")
        return

    api = HfApi()
    api.create_repo(REPO, repo_type="model", exist_ok=True, private=False)
    api.upload_folder(
        folder_path=str(weights.parent),
        repo_id=REPO,
        repo_type="model",
        ignore_patterns=["checkpoint-*", "trainer_state.json", "*.log"],
    )
    print(f"Uploaded adapter to https://huggingface.co/{REPO}")


if __name__ == "__main__":
    main()
