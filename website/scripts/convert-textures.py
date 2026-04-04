#!/usr/bin/env python3
"""
Legacy entry point: delegates to Node + sharp + optional ImageMagick.

From repo root:
  cd website && npm run convert:textures

For EXR conversion, install ImageMagick 7 and ensure `magick` is on PATH.
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    script = ROOT / "scripts" / "convert-textures.mjs"
    r = subprocess.run(["node", str(script)], cwd=ROOT)
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
