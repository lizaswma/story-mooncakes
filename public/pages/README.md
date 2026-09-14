# Scene art

One folder per step. `00` is the title card; `01`–`12` are the story pages
(PRD.md §5). Every file is referenced from `src/book.ts`.

Wired from the approved plates in `../../little-rabbit-style/scenes/approved/mooncakes/`
(the `-scene` / `-whole` / `-closed` files as `background.webp`, each edit-pass
file as the page's one `to`/`targetLayer` layer), resized to 2048px long edge,
matching book 1's (`story-halloween`) convention. Re-run `tools/wire-art.py`
from the repo root after any art update in `little-rabbit-style`.

| Folder | Files | Source (little-rabbit-style) |
|---|---|---|
| `00` | `background.webp` | `p00-scene.jpeg` |
| `01` | `background.webp`, `scene-bright.webp`, `window-peek.webp` | `p01-scene.jpeg`, `p01-bright.jpeg`, `p01-window-peek.jpeg` |
| `02` | `background.webp`, `scene-decorated.webp`, `scraps-flutter.webp`, `stool-wobble.webp` | `p02-scene.jpeg`, `p02-decorated.jpeg`, `p02-scraps-flutter.jpeg`, `p02-stool-wobble.jpeg` |
| `03` | `background.webp` | `p03-scene.jpeg` |
| `04` | `background.webp`, `scene-cut.webp`, `teapot-steam.webp`, `window-moon.webp` | `p04-whole.jpeg`, `p04-cut.jpeg`, `p04-teapot-steam.jpeg`, `p04-window-moon.jpeg` |
| `05` | `background.webp`, `dragon.png` (alpha), `tree-leaves.webp`, `window-moon.webp` | `p05-scene.jpeg`, `dragon-layer.png`, `p05-tree-leaves.jpeg`, `p05-window-moon.jpeg` |
| `06` | `background.webp`, `scene-given.webp`, `plant-sway.webp` | `p06-scene.jpeg`, `p06-given.jpeg`, `p06-plant-sway.jpeg` |
| `07` | `background.webp`, `scene-given.webp`, `chair-rock.webp`, `lantern-bright.webp` | `p07-scene.jpeg`, `p07-given.jpeg`, `p07-chair-rock.jpeg`, `p07-lantern-bright.jpeg` |
| `08` | `background.webp`, `scene-given.webp`, `cat-tail.webp`, `toy-wiggle.webp` | `p08-scene.jpeg`, `p08-given.jpeg`, `p08-cat-tail.jpeg`, `p08-toy-wiggle.jpeg` |
| `09` | `background.webp`, `scene-open.webp`, `window-moon.webp` | `p09-closed.jpeg`, `p09-open.jpeg`, `p09-window-moon.jpeg` |
| `10` | `background.webp`, `scene-given.webp`, `window-moon.webp`, `candle-flare.webp` | `p10-scene.jpeg`, `p10-given.jpeg`, `p10-window-moon.jpeg`, `p10-candle-flare.jpeg` |
| `11` | `background.webp`, `jade-rabbit.webp` | `p11-scene.jpeg`, `jade-rabbit.jpeg` |
| `12` | `background.webp`, `scene-off.webp`, `window-moon.webp`, `blanket-wiggle.webp` | `p12-scene.jpeg`, `p12-off.jpeg`, `p12-window-moon.jpeg`, `p12-blanket-wiggle.jpeg` |

All `extras` easter-egg flashes are now wired (PRD §6.1), except one:

- **`p09`'s `window-bright`** was dropped from `book.ts` — 4 generation
  attempts across 3 different techniques (a plain brightness increase ×3,
  a curtain-shift edit ×1) all came back visually identical to the source
  plate. Page 9 keeps its one other extra (`window-moon`) instead.
- `/stickers/*.webp` (not used this book) is still unwired — not needed.

Each extra's hotspot in `book.ts` was re-measured against its actual
generated art (not the original rough placeholder guesses) once these
landed.

Specs (PRD §8.4): 2048px long edge as `.webp` for backgrounds and full-frame
swap layers (opaque, no alpha needed — each is a complete edited scene); `.png`
with alpha only for a true isolated cutout composited over the background,
i.e. the page 5 dragon (interaction kind `dance`). Layers are drawn
`object-fit: contain` over the full stage.
