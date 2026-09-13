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
| `01` | `background.webp`, `scene-bright.webp` | `p01-scene.jpeg`, `p01-bright.jpeg` |
| `02` | `background.webp`, `scene-decorated.webp` | `p02-scene.jpeg`, `p02-decorated.jpeg` |
| `03` | `background.webp` | `p03-scene.jpeg` |
| `04` | `background.webp`, `scene-cut.webp` | `p04-whole.jpeg`, `p04-cut.jpeg` |
| `05` | `background.webp`, `dragon.png` (alpha) | `p05-scene.jpeg`, `dragon-layer.png` |
| `06` | `background.webp`, `scene-given.webp` | `p06-scene.jpeg`, `p06-given.jpeg` |
| `07` | `background.webp`, `scene-given.webp` | `p07-scene.jpeg`, `p07-given.jpeg` |
| `08` | `background.webp`, `scene-given.webp` | `p08-scene.jpeg`, `p08-given.jpeg` |
| `09` | `background.webp`, `scene-open.webp` | `p09-closed.jpeg`, `p09-open.jpeg` |
| `10` | `background.webp`, `scene-given.webp` | `p10-scene.jpeg`, `p10-given.jpeg` |
| `11` | `background.webp`, `jade-rabbit.webp` | `p11-scene.jpeg`, `jade-rabbit.jpeg` |
| `12` | `background.webp`, `scene-off.webp` | `p12-scene.jpeg`, `p12-off.jpeg` |

Not yet wired — no approved art exists for these (the app shows the layer id
as a dashed placeholder box until it does, so nothing breaks):

- Every `extras` easter-egg flash referenced in `src/book.ts` (`window-peek`,
  `teapot-steam`, `plant-sway`, `moon-bright`, …) — PRD §6.1.
- `/stickers/*.webp` (not used this book).

Specs (PRD §8.4): 2048px long edge as `.webp` for backgrounds and full-frame
swap layers (opaque, no alpha needed — each is a complete edited scene); `.png`
with alpha only for a true isolated cutout composited over the background,
i.e. the page 5 dragon (interaction kind `dance`). Layers are drawn
`object-fit: contain` over the full stage.
