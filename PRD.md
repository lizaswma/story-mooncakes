# 小兔过中秋节 (Little Rabbit's Mooncake Festival) — PRD

**Status:** Scope decided — ready to scaffold
**Product:** Interactive storybook web app, book #2 in the 「小兔」 holiday series (after [小兔过万圣节](../story-halloween/PRD.md))
**Primary user:** A 2–3 year old, co-playing with a parent
**Author/owner:** liza.ma@gmail.com

---

## 1. Vision

A cozy, tappable bedtime storybook that walks a toddler through a Mid-Autumn Festival
night with 小兔: make a lantern, watch a dragon dance, then give away a mooncake —
one piece at a time — to grandma, grandpa, and a friend, before sharing the very last
piece with mom and dad. At bedtime, the whole family looks up at the full moon
together, and 小兔 spots a rabbit on it.

Where book 1 was about *collecting* (stickers, counting up to 6), this book is about
**sharing** — 小兔 starts with a whole mooncake cut into **four** pieces and gives them
away one by one, so the child counts **down**: 4 → 3 → 2 → 1 → 0. Counting down through
a warm, social act (giving) rather than an abstract number line.

The story is **told in Mandarin by default**, with a **parent-controlled toggle to
switch the whole book to English** (text and narration) — same mechanism as book 1.

小兔 and the full art/interaction pipeline are **reused from the series**, per the
locked [style bible](../little-rabbit-style/STYLE.md). This book introduces 小兔's
**family** (妈妈/爸爸/婆婆/公公) for the first time in the series — all rabbits, same
silhouette/fur/ear rules as 小兔, just adult proportions — plus a callback cameo from
小猫 (the cat from book 1).

## 2. Who we're designing for (2–3 years old)

Same facts as book 1 — cannot read, navigates by picture/sound/touch, tapping only
(no dragging), loves repetition of the same pattern more than novelty, no
winning/losing, short ~2–5 minute sittings, a parent co-reads and narrates.

One addition specific to this book: **counting down (4→3→2→1) introduces
subtraction-by-one through a concrete, social action** — giving a piece away — rather
than an abstract number line. The child isn't expected to understand subtraction; the
tap-and-watch-the-plate-get-emptier pattern does the teaching.

## 3. Platform & tech stack

Same stack as book 1, reused wholesale for maintainability and series consistency:

| Area | Decision |
|---|---|
| Type | Web app, installable to iPad home screen (PWA), not a native app |
| Framework | React 18 (function components + hooks) + TypeScript |
| Build | Vite |
| Routing | None — single view, `pageIndex` state, optional `#p3` deep-link |
| PWA | `vite-plugin-pwa`, fully offline after first load, `display: standalone`, landscape |
| Audio | Howler.js, audio sprites for SFX |
| Animation | CSS transitions + keyframes |
| State | React context: `{ language, pageIndex, muted }`, persisted to `localStorage` |
| Backend | None |
| Reuse | Copy the `story-halloween` app shell (page engine, audio wrapper, PWA config, language context) rather than rebuild it |

Target device: iPad (retina), with desktop Chrome/Safari for development.

## 4. Bilingual requirement (core feature)

Identical mechanism to book 1 — see [story-halloween PRD §4](../story-halloween/PRD.md)
for the full behavior spec. Key points carried over as-is:

- Default `zh`, opt-in `en`, toggle in a top-corner control + parent menu.
- `type PageText = { zh: string; en: string }`, one narration clip per page per language.
- Mandarin sentences 4–8 characters; English short and natural, not a literal gloss.
- Selection persists to `localStorage`.

This book's secondary line (parallel to book 1's "不给糖就捣蛋！") is the recipient's
thank-you *plus* the remaining-piece countdown, spoken on the three giving pages —
folding the count into the actual read-aloud script rather than leaving it as only a
numeral badge and an isolated spoken-number sound bite:

- Page 6: `zh` 谢谢小兔！还剩三块。 / `en` Thank you! Three left.
- Page 7: `zh` 谢谢小兔！还剩两块。 / `en` Thank you! Two left.
- Page 8: `zh` 谢谢小兔！还剩一块。 / `en` Thank you! One left.

No pinyin in v1, same as book 1.

## 5. Story structure (page-by-page)

12 pages + title card — same shape as book 1, content re-themed around Mid-Autumn.

**Title card:** 「小兔」系列 / The Little Rabbit Series — **小兔过中秋节 · Little
Rabbit's Mooncake Festival** — 小兔 holding a whole mooncake on a plate, full moon and
a rabbit lantern behind. Start: 开始 / Start.

| # | Beat | 中文 (4–8 字) | English | Tap interaction | SFX |
|---|---|---|---|---|---|
| 1 | Opening | 中秋节到了！ | It's the Mooncake Festival! | Tap moon → swap to a brighter full-frame variant (same technique as book 1's opening beat) | soft chime |
| 2 | Make lantern | 小兔做兔子灯，准备过中秋。 | Little Rabbit makes a rabbit lantern for the Mooncake Festival. | Tap → lantern decorates (swap: blank → rabbit lantern) | paper rustle |
| 3 | Light it | 小兔点亮兔子灯，真亮呀！ | Little Rabbit lights the lantern. It's so bright! | Tap lantern → whole-page glow pulse (CSS only, no extra art — same as book 1's costume beat) | sparkle |
| 4 | Cut mooncake | 月饼切成四块，小兔要去分享啦！ | The mooncake is cut into four pieces. Little Rabbit heads out to share them! | Tap → cut (swap: whole → 4 wedges on the plate) | slice + soft ta-da |
| 5 | Dragon dance | 小兔看舞龙，好热闹！ | On the way, Little Rabbit watches the dragon dance. So lively! | Tap dragon → it winds and dances across the street (repeatable encore) | drum + cymbal |
| 6 | Give #1 (4→3) | 小兔给婆婆一块月饼。 | Little Rabbit gives Grandma a piece of the mooncake. | Tap wedge → travels to 婆婆, plate 4→3, numeral + spoken number | happy hum |
| 7 | Give #2 (3→2) | 小兔给公公一块月饼。 | Little Rabbit gives Grandpa a piece of the mooncake. | Tap wedge → plate 3→2, numeral + spoken number | happy hum |
| 8 | Give #3 (2→1) | 小兔给小猫一块月饼。 | Little Rabbit gives a piece of the mooncake to Mr. Cat. | Tap wedge → plate 2→1, numeral + spoken number | happy hum |
| 9 | Go home | 小兔带着最后一块月饼回家。 | Little Rabbit goes home with the last piece of mooncake. | Tap door → swap (closed → open, warm interior, 妈妈 & 爸爸 waiting) | door creak (warm) |
| 10 | Reunion | 小兔回到家，和爸爸妈妈分最后一块月饼。 | Little Rabbit is home — she shares the last piece with Mom and Dad. | Tap → 妈妈 & 爸爸 lean in for a family hug; the last quarter stays on 小兔's own plate, shared together rather than handed off | warm chime |
| 11 | Moon-gaze | 一起看月亮。 | Let's look at the moon together. | Tap moon → swap to a full-frame variant with a tiny rabbit glowing into view on it — 月亮上有只兔子！/ "There's a rabbit in the moon!" | magical twinkle |
| 12 | Bedtime | 中秋节快乐，晚安！ | Happy Mooncake Festival. Good night! | Tap lantern → dims, 小兔 curls up asleep | lullaby sting |

Secondary text on pages 6–8 pairs the recipient's thank-you with the remaining-piece
countdown (e.g. 谢谢小兔！还剩三块。/ "Thank you! Three left.") — see §4.2 — so the
count is part of the read-aloud script, not just the numeral badge and spoken-number
sound bite. Page 10 is not part of the countdown — 小兔 keeps her last quarter rather
than giving it away, so its secondary line is simply 一家团圆。/ "Together as one
family," not a count.

## 6. Interactivity model

Reuses book 1's [data model](../story-halloween/src/types.ts) — `Page`, `Asset`,
`Hotspot`, `ExtraTap` carry over unchanged. `twinkle` (an isolated animated sprite
layer) is defined in the shared type but, like in book 1, never actually shipped on a
page — every "make something glow/brighten" beat instead uses `swap` (a full-frame
edit-pass variant, pages 1, 11) or a targetLayer-less `glow` (a whole-page CSS pulse,
page 3), both proven in book 1 and requiring no new asset-isolation technique. This
book adds one new kind:

```ts
| {
    kind: "give";
    sfx: string;
    hotspot: Hotspot;
    /** Sticker-equivalent: the mooncake-wedge sprite id being given away. */
    wedge: string;
    /** Who receives it — drives which character animates a "take/thank you" beat. */
    recipient: string;
    /** Plate count remaining AFTER this tap (4, 3, 2, or 1). */
    remaining: number;
    /** Counting page 11)-style behavior: speak the number, show a numeral badge. */
    counting?: boolean;
  }
```

`give` is the mirror image of book 1's `stick` (which *added* a sticker to a
collection) — here the plate starts full and a tap *removes* one wedge, sending it to
a recipient. `counting: true` on the three `give` taps (pages 6, 7, 8) drives the
numeral badge and the spoken number, counting down 4→3→2→1. Page 10 is **not** a
`give` — 小兔 keeps her last quarter rather than handing it off, so it's a plain
`swap` (the family leaning in for a hug), same as the page 9 door reveal. No further
counting/numeral badge after page 8; the countdown stops at 1, not 0.

### 6.1 Secondary taps (easter eggs)

Following book 1's `ExtraTap` pattern (pokeable background elements, never required,
always pleasant, repeatable forever). Per the moon being a recurring motif this book, a
`moon-bright` extra appears on every page where the moon is visible in the background
(1, 4, 5, 9, 10, 12) as a quiet through-line to the page 11 payoff — **not** on page 11
itself, to avoid diluting that reveal. Page 3 also intentionally has no extras (a quiet
single-beat page). Draft picks, to be finalized once backgrounds are actually sketched
(real hotspot coordinates depend on final art layout):

| # | Extras (flash / sfx) |
|---|---|
| 1 | `window-peek` / soft night sound |
| 2 | `scraps-flutter` / rustle · `stool-wobble` / tap |
| 3 | *(none — quiet beat)* |
| 4 | `teapot-steam` / soft whistle · `window-moon` / chime |
| 5 | `tree-leaves` / rustle · `window-moon` / chime *(dragon is the main interaction, not an extra)* |
| 6 | `plant-sway` / rustle |
| 7 | `chair-rock` / creak · `lantern-bright` / flare |
| 8 | `cat-tail` / purr · `toy-wiggle` / squeak |
| 9 | `window-bright` / chime · `window-moon` / chime |
| 10 | `window-moon` / chime · `candle-flare` / flare |
| 11 | *(none — protect the Jade Rabbit payoff)* |
| 12 | `window-moon` / chime (last appearance) · `blanket-wiggle` / soft whump |

### 6.2 Rules carried over from book 1

One interactive element per page (page 2's lantern decorates in a single tap, not a
multi-step assembly — a deliberate choice to keep the series rule consistent). Tap
targets ≥120pt. Every tap does something pleasant, nothing is ever "incomplete."
Interactions are not gates. `prefers-reduced-motion` honored throughout.

## 7. Navigation & UX

Identical to book 1 — large left/right arrow buttons + swipe, no auto-advance, subtle
progress dots, narration auto-plays on page turn and replays on tap, global mute, small
gear-icon parent menu (language / mute / restart), prominent series-branded title card.
See [story-halloween PRD §7](../story-halloween/PRD.md) for the full spec; nothing
about this changes for book 2.

## 8. Art & asset pipeline

### 8.1 Character reuse

小兔 is **never redrawn** — every new pose/scene is generated from the locked
`little-rabbit-style/character/hero.png` reference, per the
[style bible](../little-rabbit-style/STYLE.md). No new costume is needed this book
(小兔 wears no costume in the Mid-Autumn story, unlike book 1's pumpkin suit).

### 8.2 New characters needed

- **妈妈 / 爸爸 / 婆婆 / 公公** — first appearance in the series. All rabbits, same
  silhouette/fur/ear/outline rules as 小兔 (one ear up, one flopped; cream fur; warm
  brown outlines; no belly patch), generated at adult proportions (taller, rounder,
  maybe a little more weathered/textured for 婆婆/公公 — subtle, not cartoonish aging).
  These become the locked "family" reference sheet for all future books.
- **小猫** — reused from book 1. Confirm its existing art still matches the style
  bible (locked 2026-09-07, after book 1 shipped) before reusing; regenerate from the
  book 1 asset only if there's a visible palette/line-weight drift.

### 8.3 New props

- **Rabbit lantern (兔子灯)** — blank/undecorated, decorated, and lit states.
- **Mooncake** — whole, and cut into 4/3/2/1/0-wedge plate states (or composite wedges
  onto an empty-plate base in code, same approach as book 1's sticker bag).
- **Dragon puppet** — still pose and a dancing/winding pose (or a short sprite
  sequence) for the page 5 tap.
- **Moon plate with Jade Rabbit overlay** — a subtle rabbit-shaped glow/silhouette
  layer that fades in on the page 11 tap.

### 8.4 Specs & organization

Same export specs as book 1 (2048px long edge, 16:10 plates, PNG with alpha for
layers, WebP for backgrounds) and the same `public/pages/NN/`, `public/audio/{lang}/`,
`public/sfx/` layout.

## 9. Resolved decisions

1. **Structure:** sharing/counting-down (4→3→2→1→0), not collecting/counting-up —
   deliberately inverted from book 1 to fit Mid-Autumn's reunion theme.
2. **Recipients:** 婆婆, 公公, and 小猫 (the cat from book 1, a deliberate series
   callback) get one wedge each; the last quarter stays with 小兔 herself, shared
   with 妈妈 and 爸爸 as a family moment (a hug, not a hand-off — see the resolved
   open note below).
3. **Family species:** all rabbits, same style-bible rules as 小兔, just adult
   proportions. First appearance of family in the series.
4. **Jade Rabbit moon reveal:** yes, as the bedtime emotional high point (page 11) —
   小兔 spots a rabbit on the moon. Drawn from the real Chang'e/Jade Rabbit myth, not
   invented.
5. **Prep beat:** decorate-and-light a rabbit lantern (兔子灯), not a mooncake-wrapping
   scene — reuses book 1's `glow` interaction and ties to a real Mid-Autumn tradition.
6. **Dragon dance:** included, based on the real Tai Hang Fire Dragon Dance (大坑舞火龙)
   Mid-Autumn tradition. Merged into page 5 as that page's one main interaction
   (replacing a plain door-open beat) rather than a separate page or background-only
   texture.
7. **Countdown display:** numerals shown (a badge ticking 4→3→2→1), plus spoken
   numbers — consistent with book 1's counting page already establishing numerals are
   fine for this age. The countdown stops at 1, not 0 — see the resolved open note
   below.
8. **Lantern-making (page 2):** one tap, fully decorated at once — keeps the series
   rule of one interactive element per page, even though multi-step assembly was
   considered.
9. **Recurring moon easter egg:** yes, on every page where the moon is visible in the
   background (not just pages 1 and 11) — foreshadows the page 11 reveal.
10. **Page count:** kept at 12 + title card, matching book 1, by merging the dragon
    dance into the existing "go out" beat rather than adding a 13th page.

### Resolved open note

- **The original open question — whether the final 1→0 tap should split the last
  wedge between two recipients, and whether a literal "0" badge is too abstract for
  this age — is resolved, once real art could be seen in motion (M2).** A quarter
  piece splitting further into two eighths for 妈妈 and 爸爸 was both physically odd
  to draw and unreadable to a toddler. Decided instead: 小兔 keeps the last quarter
  on her own plate — nothing is given away or subdivided further, and the family
  simply shares it together in spirit. Page 10 is therefore **not** a `give`/counting
  beat at all (no numeral badge, no heart, no "0") — it's a plain `swap` to a
  family-hug variant, same mechanism as the page 9 door reveal. The countdown that
  matters to a toddler (4→3→2→1, pages 4/6/7/8) is unaffected; page 10 is a pure
  reunion beat, not a fifth countdown step.

## 10. Non-goals (v1)

Same as book 1 §10, plus:

- A costume for 小兔 (none needed — no costume beat in this story).
- A second dedicated dragon-dance page (merged into page 5 instead).
- Pinyin, background music, accounts/sync, record-your-own narration, analytics,
  native packaging, printing/PDF export — all same as book 1.

## 11. Milestones

| # | Deliverable |
|---|---|
| M0 | Scaffold: copy the `story-halloween` app shell (page engine, language context, audio wrapper, PWA config); swap in this book's 12-page + title data |
| M1 | Full content in Mandarin: all 12 pages, `zh` text, `zh` narration (plain TTS), all SFX, all interactions incl. the new `give`/`split` kind working with placeholder art |
| M2 | Real art integrated: family reference sheet (妈妈/爸爸/婆婆/公公) + new props (lantern, dragon, mooncake states, moon/Jade-Rabbit overlay) + confirm/regenerate 小猫 → layered exports wired in |
| M3 | Bilingual: `en` text + `en` narration + toggle, in-place language switch, persistence |
| M4 | Final voices: regenerate `zh` + `en` narration with LLM-generated voices (per-language model), swap in as assets |
| M5 | PWA polish: offline precache verified, install-to-home-screen, landscape lock, reduced-motion, mute, restart, title card |
| M6 | Playtest with the toddler; tune pacing, tap-target sizes, the page 10 "0" treatment, narration timing |

## 12. Success criteria

- A parent can read the whole book to the child in one ~4-minute sitting.
- The child can trigger every page's interaction with a single tap, unassisted,
  including the new give/split mechanic.
- The countdown (4→3→2→1→0) is legible to a toddler as "fewer pieces left," without
  needing to understand subtraction.
- Switching 中 ⇄ EN changes every sentence and every narration line, with no loss of
  place.
- Works with the iPad in airplane mode after first load.
- 小兔's art, and the new family/prop art, can be dropped into a third holiday book
  without redrawing the character.
