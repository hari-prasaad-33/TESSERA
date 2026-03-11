"""
Dataset downloader for SocialEQ and SocialFX.

SocialFX: HuggingFace `seungheondoh/socialfx-original`
SocialEQ: socialeq.org / Zenodo backup
"""

from __future__ import annotations
import json
import requests
from pathlib import Path

from tessera_rag.config import RAW_DIR


# ── SocialFX ──────────────────────────────────────────────────────────────────

def download_socialfx(out_dir: Path = RAW_DIR / "socialfx") -> Path:
    """
    Download the SocialFX dataset from HuggingFace.
    Returns the directory containing the raw JSON/JSONL files.
    """
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        from datasets import load_dataset  # type: ignore
    except ImportError:
        raise RuntimeError("Install the 'datasets' package: pip install datasets")

    print("Downloading SocialFX from HuggingFace (seungheondoh/socialfx-original)…")
    ds = load_dataset("seungheondoh/socialfx-original", trust_remote_code=True)

    # Persist all splits to JSONL for inspection / offline use
    for split_name, split_data in ds.items():
        out_path = out_dir / f"{split_name}.jsonl"
        with open(out_path, "w", encoding="utf-8") as f:
            for row in split_data:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
        print(f"  ✓ {split_name}: {len(split_data)} rows → {out_path}")

    # Print first example so we can inspect the structure
    first = next(iter(ds.values()))[0]
    print("\nSocialFX first example (structure):")
    _pretty_print_structure(first)

    return out_dir


# ── SocialEQ ──────────────────────────────────────────────────────────────────

# Known URL candidates (try in order)
_SOCIALEQ_URLS = [
    "https://zenodo.org/records/1415792/files/socialeq_data.json",
    "https://zenodo.org/records/1415792/files/data.json",
    "http://socialeq.org/data/socialeq_data.json",
    "http://socialeq.org/data/data.json",
]


def download_socialeq(out_dir: Path = RAW_DIR / "socialeq") -> Path | None:
    """
    Download SocialEQ from Zenodo / socialeq.org.
    Returns path to the downloaded file, or None if unavailable.
    """
    out_dir.mkdir(parents=True, exist_ok=True)

    for url in _SOCIALEQ_URLS:
        try:
            print(f"Trying SocialEQ URL: {url}")
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                out_path = out_dir / "socialeq_raw.json"
                out_path.write_bytes(resp.content)
                print(f"  ✓ Downloaded SocialEQ → {out_path}")
                data = resp.json()
                print(f"  ✓ Parsed JSON — top-level keys: {list(data.keys())[:10]}")
                if isinstance(data, list):
                    print(f"  ✓ List of {len(data)} entries")
                    print("  First entry structure:")
                    _pretty_print_structure(data[0])
                return out_path
        except Exception as e:
            print(f"  ✗ {e}")
            continue

    print("WARNING: Could not download SocialEQ from any known URL.")
    print("Continuing with SocialFX only.")
    return None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _pretty_print_structure(obj: dict | list, indent: int = 2) -> None:
    """Print the structure of an object without huge arrays."""
    def summarise(v):
        if isinstance(v, list):
            if len(v) > 6:
                return f"[{summarise(v[0])}, ... ({len(v)} items)]"
            return [summarise(i) for i in v]
        if isinstance(v, dict):
            return {k: summarise(vv) for k, vv in list(v.items())[:8]}
        if isinstance(v, float):
            return round(v, 4)
        return v

    print(json.dumps(summarise(obj), indent=indent))


def download_all() -> tuple[Path, Path | None]:
    """Download both datasets. Returns (socialfx_dir, socialeq_path_or_None)."""
    fx_dir = download_socialfx()
    eq_path = download_socialeq()
    return fx_dir, eq_path
