#!/usr/bin/env python3
"""Derive moon-glow easter-egg frames: `window-moon.webp` for pages 6 and 8, and
`window-moon-off.webp` for page 12 (the moon tapped after 小兔 falls asleep).

Every other extra flash is a model-generated edit of the page's resting
background (see public/pages/README.md and tools/wire-art.py), but pages 6 and 8
never got a `window-moon` plate, so tapping their moon did nothing. This
stands in for it: it takes each page's own `background.webp` and adds the same
kind of soft warm halo the generated moons on pages 4/5/9/10/12 have. Nothing
else in the frame changes, so it composes cleanly with the focus region in
src/book.ts.

Regenerate real plates in little-rabbit-style and add them to wire-art.py to
replace these; wire-art.py doesn't know about these files, so it won't
overwrite them. (Page 12's ordinary `window-moon.webp` IS a generated plate;
only the `-off` variant here is derived, from `scene-off.webp`.)

Usage (from the repo root):  python3 tools/make-moon-glow.py
Needs Pillow + numpy.
"""
from pathlib import Path

import numpy as np
from PIL import Image

PAGES = Path(__file__).resolve().parent.parent / "public" / "pages"

# (page, source frame, output, moon centre x, y, radius in px on the 2048px-wide
# art, halo colour, disc colour). Centre/radius are measured from the art (the
# moon is the one big flat disc in each region).
WARM = ((255, 214, 140), (255, 248, 228))  # matches the other pages' moons
COOL = ((175, 218, 255), (228, 244, 255))  # page 12's blue-lit night frame
JOBS = [
    ("06", "background", "window-moon", 448, 131, 61, WARM),  # pale yellow, upper-left by the tree
    ("08", "background", "window-moon", 1569, 199, 139, WARM),  # cream white, upper-right
    ("12", "scene-off", "window-moon-off", 1585, 288, 89, COOL),  # lights off, 小兔 asleep
]


def moon_glow(bg: np.ndarray, cx: float, cy: float, r: float, colors) -> np.ndarray:
    glow_c, disc_c = (np.array(c, dtype=float) for c in colors)
    h, w, _ = bg.shape
    yy, xx = np.mgrid[:h, :w]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)

    out = bg.astype(float)

    # Halo: strongest at the moon's rim, fading out over ~1.6 radii. Screen-blended
    # so it only ever brightens, and it lifts the sky rather than painting over it.
    fall = np.exp(-np.clip(d - r, 0, None) / (0.75 * r))
    halo = 0.85 * fall * (d > r * 0.9)
    halo *= np.clip(1 - (d - r) / (2.4 * r), 0, 1)  # hard-zero far out
    out = 255 - (255 - out) * (1 - halo[..., None] * glow_c / 255)

    # Disc: ease toward a brighter cream, feathered at the rim.
    disc = np.clip((r * 1.02 - d) / (0.08 * r), 0, 1) * 0.7
    out = out * (1 - disc[..., None]) + disc_c * disc[..., None]

    return np.clip(out, 0, 255).astype(np.uint8)


def main() -> None:
    for page, src_name, out_name, cx, cy, r, colors in JOBS:
        src = PAGES / page / f"{src_name}.webp"
        dst = PAGES / page / f"{out_name}.webp"
        bg = np.asarray(Image.open(src).convert("RGB"))
        Image.fromarray(moon_glow(bg, cx, cy, r, colors)).save(dst, "WEBP", quality=88)
        print(f"wrote {dst.relative_to(PAGES.parent.parent)}")


if __name__ == "__main__":
    main()
