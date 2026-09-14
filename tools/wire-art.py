#!/usr/bin/env python3
"""Convert approved little-rabbit-style/mooncakes illustrations into
public/pages/NN/*, matching the naming src/book.ts expects.

Run from the repo root: `python3 tools/wire-art.py`
Requires Pillow (`pip install pillow`) with WebP support.

Background / full-frame swap layers -> .webp (opaque, 2048px long edge).
The one true isolated cutout layer (page 5's dragon) -> .png (keeps alpha,
2048px long edge). See public/pages/README.md for the full file map, and
little-rabbit-style/pipeline.md for how the source plates were generated.

Easter-egg `extras` flash layers (PRD §6.1) are wired the same way as any
other full-frame layer -- they're just additional entries in each page's
layer dict below.
"""
import os
from PIL import Image

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO_ROOT, "..", "little-rabbit-style", "scenes", "approved", "mooncakes")
DEST = os.path.join(REPO_ROOT, "public", "pages")
LONG_EDGE = 2048

# (page, background source, {layer_id: (source_file, format)})
PAGES = [
    ("00", "p00-scene.jpeg", {}),
    (
        "01",
        "p01-scene.jpeg",
        {
            "scene-bright": ("p01-bright.jpeg", "webp"),
            "window-peek": ("p01-window-peek.jpeg", "webp"),
        },
    ),
    (
        "02",
        "p02-scene.jpeg",
        {
            "scene-decorated": ("p02-decorated.jpeg", "webp"),
            "scraps-flutter": ("p02-scraps-flutter.jpeg", "webp"),
            "stool-wobble": ("p02-stool-wobble.jpeg", "webp"),
        },
    ),
    ("03", "p03-scene.jpeg", {}),
    (
        "04",
        "p04-whole.jpeg",
        {
            "scene-cut": ("p04-cut.jpeg", "webp"),
            "teapot-steam": ("p04-teapot-steam.jpeg", "webp"),
            "window-moon": ("p04-window-moon.jpeg", "webp"),
        },
    ),
    (
        "05",
        "p05-scene.jpeg",
        {
            "dragon": ("dragon-layer.png", "png"),
            "tree-leaves": ("p05-tree-leaves.jpeg", "webp"),
            "window-moon": ("p05-window-moon.jpeg", "webp"),
        },
    ),
    (
        "06",
        "p06-scene.jpeg",
        {
            "scene-given": ("p06-given.jpeg", "webp"),
            "plant-sway": ("p06-plant-sway.jpeg", "webp"),
        },
    ),
    (
        "07",
        "p07-scene.jpeg",
        {
            "scene-given": ("p07-given.jpeg", "webp"),
            "chair-rock": ("p07-chair-rock.jpeg", "webp"),
            "lantern-bright": ("p07-lantern-bright.jpeg", "webp"),
        },
    ),
    (
        "08",
        "p08-scene.jpeg",
        {
            "scene-given": ("p08-given.jpeg", "webp"),
            "cat-tail": ("p08-cat-tail.jpeg", "webp"),
            "toy-wiggle": ("p08-toy-wiggle.jpeg", "webp"),
        },
    ),
    (
        "09",
        "p09-closed.jpeg",
        {
            "scene-open": ("p09-open.jpeg", "webp"),
            "window-moon": ("p09-window-moon.jpeg", "webp"),
            # "window-bright" dropped -- 4 generation attempts (plain brighten x3,
            # curtain-shift x1) all came back visually identical to the source.
        },
    ),
    (
        "10",
        "p10-scene.jpeg",
        {
            "scene-given": ("p10-given.jpeg", "webp"),
            "window-moon": ("p10-window-moon.jpeg", "webp"),
            "candle-flare": ("p10-candle-flare.jpeg", "webp"),
        },
    ),
    ("11", "p11-scene.jpeg", {"jade-rabbit": ("jade-rabbit.jpeg", "webp")}),
    (
        "12",
        "p12-scene.jpeg",
        {
            "scene-off": ("p12-off.jpeg", "webp"),
            "window-moon": ("p12-window-moon.jpeg", "webp"),
            "blanket-wiggle": ("p12-blanket-wiggle.jpeg", "webp"),
        },
    ),
]


def resize(im: Image.Image) -> Image.Image:
    w, h = im.size
    if w <= LONG_EDGE:
        return im
    scale = LONG_EDGE / w
    return im.resize((LONG_EDGE, round(h * scale)), Image.LANCZOS)


def convert(src_path: str, dest_path: str, fmt: str):
    im = resize(Image.open(src_path))
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if fmt == "webp":
        im.convert("RGB").save(dest_path, "WEBP", quality=88, method=6)
    else:
        im.save(dest_path, "PNG", optimize=True)
    print(f"{src_path} -> {dest_path} ({im.size})")


if __name__ == "__main__":
    for page, bg_file, layers in PAGES:
        convert(os.path.join(SRC, bg_file), os.path.join(DEST, page, "background.webp"), "webp")
        for layer_id, (fname, fmt) in layers.items():
            convert(os.path.join(SRC, fname), os.path.join(DEST, page, f"{layer_id}.{fmt}"), fmt)
    print("done")
