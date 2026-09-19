# Sound effects

Language-independent (PRD.md §4.1). Referenced by name from `src/book.ts`.
TTS can generate narration but not sound design, so these are synthesized from
scratch (bell/pluck tones, filtered noise, pitch sweeps) by `tools/make-sfx.py`
— deterministic, no sourcing or licensing. Edit a recipe there and re-run
`python3 tools/make-sfx.py [name ...]` (needs numpy + `ffmpeg`).

They're placeholder-grade synthesis: fine to ship and playtest with, and a
recorded/sourced replacement can drop in under the same filename with no code
changes (same as the narration voice swap in `../audio/README.md`).

| File | Used on |
|---|---|
| `chime.mp3` | p1 main tap; extra on p4/5/9/10/12 (`window-moon`) |
| `hush.mp3` | p1 extra (`window-peek`) |
| `rustle.mp3` | p2 main tap; extra on p2 (`scraps-flutter`), p5 (`tree-leaves`), p6 (`plant-sway`) |
| `tap.mp3` | p2 extra (`stool-wobble`) |
| `sparkle.mp3` | p3 main tap (lantern lights up) |
| `slice.mp3` | p4 main tap (mooncake cut) |
| `whistle.mp3` | p4 extra (`teapot-steam`) |
| `drum.mp3` | p5 main tap (dragon dance) |
| `hum.mp3` | p6/7/8 main tap (giving a piece) |
| `creak.mp3` | p7 extra (`chair-rock`); p9 main tap (door opens) |
| `flare.mp3` | p7 extra (`lantern-bright`); p10 extra (`candle-flare`) |
| `purr.mp3` | p8 extra (`cat-tail`) |
| `squeak.mp3` | p8 extra (`toy-wiggle`) |
| `warm-chime.mp3` | p10 main tap (family reunion reveal) |
| `magic.mp3` | p11 main tap (Jade Rabbit reveal) |
| `lullaby.mp3` | p12 main tap (bedtime) |
| `whump.mp3` | p12 extra (`blanket-wiggle`) |

Keep them short (≤ 1.5 s), soft, non-startling — same bar as story-halloween's
SFX plan. `make-sfx.py` levels every clip to the same average loudness (peak
capped near -9 dBFS) so no tap is louder than another and all sit under the
narration.
