"""Optional @spaces.GPU — only required on HF ZeroGPU; no-op on CPU basic."""

from __future__ import annotations

import os

USE_ZEROGPU = os.getenv("USE_ZEROGPU", "0").lower() in ("1", "true", "yes")


def gpu_decorator(duration: int = 120):
    """Apply @spaces.GPU on ZeroGPU; plain function on CPU basic."""
    if USE_ZEROGPU:
        try:
            import spaces

            return spaces.GPU(duration=duration)
        except ImportError:
            pass

    def passthrough(fn):
        return fn

    return passthrough
