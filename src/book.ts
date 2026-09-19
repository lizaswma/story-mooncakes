import type { Asset, Page, TitleCard } from "./types";

// ── Asset path helpers (same convention as story-halloween) ────────────────
// Real art drops into /public/pages/NN/. Until then <Layer> shows the id as a
// labelled placeholder box (PRD §8.4, milestone M0).
const pageDir = (n: number) => `/pages/${String(n).padStart(2, "0")}`;

const bg = (n: number): Asset => ({
  id: `bg-${n}`,
  src: `${pageDir(n)}/background.webp`,
  alt: "",
});

const layer = (
  n: number,
  id: string,
  extra: Partial<Asset> & { ext?: "png" | "jpg" | "webp" } = {},
): Asset => {
  const { ext = "png", ...rest } = extra;
  return {
    id,
    src: `${pageDir(n)}/${id}.${ext}`,
    alt: "",
    ...rest,
  };
};

/** Audio paths — narration is per-page per-language (PRD §4.3). */
export const narrationSrc = (pageId: number, lang: string) =>
  `/audio/${lang}/${String(pageId).padStart(2, "0")}.mp3`;
export const countSrc = (n: number, lang: string) =>
  `/audio/${lang}/count/${n}.mp3`;
export const sfxSrc = (name: string) => `/sfx/${name}.mp3`;

// ── Title card (PRD §7.4 / §5) ──────────────────────────────────────────────
export const TITLE_CARD: TitleCard = {
  series: { zh: "「小兔」系列", en: "The Little Rabbit series" },
  title: { zh: "小兔过中秋节", en: "Little Rabbit's Mooncake Festival" },
  start: { zh: "开始", en: "Start" },
  // 小兔 holding a whole mooncake, full moon + rabbit lantern behind — part of
  // the cover art; the app overlays the text.
  background: { id: "bg-title", src: "/pages/00/background.webp", alt: "" },
  layers: [],
};

// Secondary phrases (PRD §4/§5), parallel to book 1's trick-or-treat chant. The
// giving pages (6, 7, 8) fold the remaining-piece countdown into this line —
// otherwise the count only ever showed up as a numeral badge + an isolated
// spoken-number sound bite, never in the actual read-aloud script.
const thanksAndCount = (zh: string, en: string) => ({
  zh: `谢谢小兔！${zh}`,
  en: `Thank you! ${en}`,
});
const THANKS_3 = thanksAndCount("还剩三块。", "Three left.");
const THANKS_2 = thanksAndCount("还剩两块。", "Two left.");
const THANKS_1 = thanksAndCount("还剩一块。", "One left.");
const REUNION = { zh: "一家团圆。", en: "Together as one family." };
const ITS_A_RABBIT = { zh: "月亮上有只兔子！", en: "There's a rabbit in the moon!" };

// Hotspots are % of the stage {x,y = top-left, w,h}. Re-measured against the
// actual approved art (main interactions + all extras) once it existed --
// the original M0 placeholders (centred on where each element was only
// *described* to sit) had drifted in several places, e.g. every `give` page
// shared one guessed rectangle that only happened to line up on page 10.
export const PAGES: Page[] = [
  {
    id: 1,
    text: { zh: "中秋节到了！", en: "It's the Mooncake Festival!" },
    background: bg(1),
    // Simplified from `twinkle` (an isolated moon sprite — untested in this
    // codebase, book 1 defined but never shipped it) to `swap`, matching book
    // 1's own near-identical "moon gets brighter" opening beat.
    layers: [layer(1, "scene-bright", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "chime",
      to: "scene-bright",
      hotspot: { x: 58, y: 4, w: 26, h: 30 }, // moon, upper-right
    },
    extras: [
      // aboveReveal + focus: after the moon swap fires, `scene-bright` would
      // otherwise cover this flash and the window tap went visually dead.
      // Focused on the window so the brightened moon doesn't dim.
      { flash: "window-peek", sfx: "hush", hotspot: { x: 28, y: 46, w: 14, h: 18 }, aboveReveal: true, focus: { x: 27, y: 42, w: 14, h: 26 } }, // the lit window, left
    ],
  },
  {
    id: 2,
    text: {
      zh: "小兔做兔子灯，准备过中秋。",
      en: "Little Rabbit makes a rabbit lantern for the Mooncake Festival.",
    },
    background: bg(2),
    layers: [layer(2, "scene-decorated", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "rustle",
      to: "scene-decorated",
      // Re-measured against the actual art (was y:30,h:40 — a hangover from
      // the M0 placeholder guess): the blank lantern's rim/loop sits as high
      // as ~21% down the frame, so the old box's 30% top cut off its top
      // third and a toddler tapping the lantern's dome missed the target.
      hotspot: { x: 36, y: 15, w: 30, h: 38 }, // the blank lantern on the table
    },
    extras: [
      // aboveReveal + focus on both (the decorated lantern stays put): without
      // them the flash sits under `scene-decorated` and a tap after the
      // lantern swap goes visually dead. Focus rects include the motion
      // (flying scraps, the wobbling stool), which the hotspot alone doesn't.
      { flash: "scraps-flutter", sfx: "rustle", hotspot: { x: 15, y: 72, w: 27, h: 26 }, aboveReveal: true, focus: { x: 14, y: 52, w: 30, h: 30 } }, // basket of paper scraps
      { flash: "stool-wobble", sfx: "tap", hotspot: { x: 58, y: 58, w: 24, h: 37 }, aboveReveal: true, focus: { x: 56, y: 52, w: 26, h: 40 } }, // the little stool
    ],
  },
  {
    id: 3,
    text: {
      zh: "小兔点亮兔子灯，真亮呀！",
      en: "Little Rabbit lights the lantern. It's so bright!",
    },
    background: bg(3),
    // No targetLayer — whole-page `glow` pulse (CSS only, zero extra art),
    // the same pattern book 1 used for its "costume lights up" beat.
    layers: [],
    interaction: {
      kind: "glow",
      sfx: "sparkle",
      hotspot: { x: 30, y: 20, w: 30, h: 50 }, // the lantern, held up
    },
    // Quiet single-beat page — no extras (PRD §6.1).
  },
  {
    id: 4,
    text: {
      zh: "月饼切成四块，小兔要去分享啦！",
      en: "The mooncake is cut into four pieces. Little Rabbit heads out to share them!",
    },
    background: bg(4),
    layers: [layer(4, "scene-cut", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "slice",
      to: "scene-cut",
      hotspot: { x: 40, y: 44, w: 26, h: 30 }, // the whole mooncake + knife
    },
    // Both extras flash above the cut-mooncake reveal, but *focused* on their
    // own element: an unfocused full-frame flash is a pre-cut frame, so it
    // showed the mooncake whole again for a beat. Once cut, it stays cut.
    extras: [
      { flash: "teapot-steam", sfx: "whistle", hotspot: { x: 52, y: 42, w: 23, h: 23 }, aboveReveal: true, focus: { x: 58, y: 28, w: 16, h: 24 } }, // teapot, right (steam rises above it)
      { flash: "window-moon", sfx: "chime", hotspot: { x: 5, y: 5, w: 25, h: 53 }, aboveReveal: true, focus: { x: 3, y: 2, w: 28, h: 46 } }, // window + moon, left
    ],
  },
  {
    id: 5,
    text: {
      zh: "小兔看舞龙，好热闹！",
      en: "On the way, Little Rabbit watches the dragon dance. So lively!",
    },
    background: bg(5),
    layers: [layer(5, "dragon")],
    interaction: {
      kind: "dance",
      sfx: "drum",
      targetLayer: "dragon",
      hold: 1400,
      hotspot: { x: 30, y: 30, w: 42, h: 46 }, // the dragon puppet, mid-street
    },
    extras: [
      // The tree is an L: canopy across the top left, thin trunk down the left
      // edge. The old single box (10,35,22x50) sat mostly on 小兔 (x 20-31%,
      // y 50-93%) and missed the canopy, so tap the two parts separately.
      { flash: "tree-leaves", sfx: "rustle", hotspot: { x: 0, y: 0, w: 29, h: 47 }, alsoTap: [{ x: 0, y: 47, w: 17, h: 36 }] }, // tree: canopy (+ trunk, stopping above the ▶ replay button) + falling leaves, left
      { flash: "window-moon", sfx: "chime", hotspot: { x: 53, y: 0, w: 25, h: 32 } }, // moon, upper-right
    ],
  },
  {
    id: 6,
    text: {
      zh: "小兔给婆婆一块月饼。",
      en: "Little Rabbit gives Grandma a piece of the mooncake.",
    },
    secondaryText: THANKS_3,
    background: bg(6),
    layers: [layer(6, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 3,
      counting: true,
      hotspot: { x: 32, y: 60, w: 24, h: 30 }, // the plate of wedges, in 小兔's paws
    },
    extras: [
      // aboveReveal + focus keep this tap visible after the give (see page 2).
      { flash: "plant-sway", sfx: "rustle", hotspot: { x: 40, y: 38, w: 16, h: 30 }, aboveReveal: true, focus: { x: 42, y: 28, w: 14, h: 36 } }, // potted plant by 婆婆's door
      // window-moon is derived from the resting background by
      // tools/make-moon-glow.py (no generated plate exists for 6/8). Focus is
      // the moon + its halo, well clear of the give reveal.
      { flash: "window-moon", sfx: "chime", hotspot: { x: 12, y: 0, w: 20, h: 26 }, aboveReveal: true, focus: { x: 11, y: 0, w: 22, h: 28 } }, // moon, upper-left by the tree
    ],
  },
  {
    id: 7,
    text: {
      zh: "小兔给公公一块月饼。",
      en: "Little Rabbit gives Grandpa a piece of the mooncake.",
    },
    secondaryText: THANKS_2,
    background: bg(7),
    layers: [layer(7, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 2,
      counting: true,
      hotspot: { x: 48, y: 55, w: 28, h: 42 }, // 小兔 + the plate of wedges, right side
    },
    extras: [
      // aboveReveal + focus keep both taps visible after the give. chair-rock's
      // region necessarily overlaps 公公 (he rocks with the chair), so his
      // piece of mooncake blinks out for the length of the rock, then returns.
      // The flash's stray lantern edit is outside the focus, so it's masked off.
      { flash: "chair-rock", sfx: "creak", hotspot: { x: 8, y: 25, w: 28, h: 71 }, aboveReveal: true, focus: { x: 7, y: 22, w: 27, h: 72 } }, // 公公's rocking chair
      { flash: "lantern-bright", sfx: "flare", hotspot: { x: 40, y: 2, w: 20, h: 28 }, aboveReveal: true, focus: { x: 36, y: 0, w: 28, h: 34 } }, // hanging lantern
    ],
  },
  {
    id: 8,
    text: {
      zh: "小兔给小猫一块月饼。",
      en: "Little Rabbit gives a piece of the mooncake to Mr. Cat.",
    },
    secondaryText: THANKS_1,
    background: bg(8),
    layers: [layer(8, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 1,
      counting: true,
      hotspot: { x: 36, y: 65, w: 26, h: 32 }, // 小兔 + the plate of wedges, left side
    },
    extras: [
      // aboveReveal + focus keep both taps visible after the give. Focus for
      // cat-tail is the tail only, clear of the piece 小猫 is now holding.
      { flash: "cat-tail", sfx: "purr", hotspot: { x: 55, y: 62, w: 15, h: 28 }, aboveReveal: true, focus: { x: 58, y: 66, w: 12, h: 24 } }, // 小猫's tail, a callback to book 1
      { flash: "toy-wiggle", sfx: "squeak", hotspot: { x: 26, y: 68, w: 16, h: 22 }, aboveReveal: true, focus: { x: 26, y: 66, w: 14, h: 22 } }, // a toy by the porch
      // Derived by tools/make-moon-glow.py, same as page 6's. This moon's halo
      // is big, so the focus is too; it stays above the cat's reveal (y 55+).
      { flash: "window-moon", sfx: "chime", hotspot: { x: 66, y: 2, w: 22, h: 30 }, aboveReveal: true, focus: { x: 60, y: 0, w: 34, h: 44 } }, // moon, upper-right
    ],
  },
  {
    id: 9,
    text: {
      zh: "小兔带着最后一块月饼回家。",
      en: "Little Rabbit goes home with the last piece of mooncake.",
    },
    background: bg(9),
    layers: [layer(9, "scene-open", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "creak",
      to: "scene-open",
      // Re-measured against the actual art: the old box (y:14,h:60) was
      // centred on the roof above the door, not the door itself — a toddler
      // tapping the visible door/rabbit mostly missed high, only catching
      // the box's lower edge. Now centred on the door + the rabbit
      // standing in front of it.
      hotspot: { x: 38, y: 40, w: 32, h: 44 }, // the front door
    },
    // Only one extra here — "window-bright" (a second window flickering
    // brighter) was dropped after 4 generation attempts across 3 different
    // techniques all came back visually identical to the source plate.
    extras: [
      // aboveReveal + focus: the moon's glow, without reverting the door/family
      // reveal below it (the reason this used to sit under `scene-open`).
      { flash: "window-moon", sfx: "chime", hotspot: { x: 57, y: 2, w: 21, h: 24 }, aboveReveal: true, focus: { x: 45, y: 0, w: 50, h: 42 } }, // moon, upper-right
    ],
  },
  {
    id: 10,
    text: {
      zh: "小兔回到家，和爸爸妈妈分最后一块月饼。",
      en: "Little Rabbit is home — she shares the last piece with Mom and Dad.",
    },
    secondaryText: REUNION,
    background: bg(10),
    layers: [layer(10, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      // Not a `give` — Little Rabbit keeps the last quarter on her own plate
      // and they share it together; the tap just reveals the family's hug.
      kind: "swap",
      sfx: "warm-chime",
      to: "scene-given",
      hotspot: { x: 44, y: 50, w: 18, h: 22 }, // the last wedge on the plate
    },
    extras: [
      // window-moon stays below the hug reveal on purpose: Mom's and Dad's ears
      // cross that window in `scene-given`, so no region of it is safe to revert.
      { flash: "window-moon", sfx: "chime", hotspot: { x: 52, y: 10, w: 20, h: 32 } }, // moon through the window
      { flash: "candle-flare", sfx: "flare", hotspot: { x: 19, y: 42, w: 14, h: 20 }, aboveReveal: true, focus: { x: 14, y: 36, w: 16, h: 28 } }, // table candle
    ],
  },
  {
    id: 11,
    text: { zh: "一起看月亮。", en: "Let's look at the moon together." },
    secondaryText: ITS_A_RABBIT,
    background: bg(11),
    // Simplified from `twinkle` (an isolated rabbit-glow sprite) to `swap`,
    // the same full-frame edit-pass technique used everywhere else this book.
    layers: [layer(11, "jade-rabbit", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "magic",
      to: "jade-rabbit",
      hotspot: { x: 38, y: 6, w: 30, h: 34 }, // the big full moon
    },
    // No extras here — protects the reveal as the page's one payoff (PRD §6.1).
  },
  {
    id: 12,
    text: { zh: "中秋节快乐，晚安！", en: "Happy Mooncake Festival. Good night!" },
    background: bg(12),
    layers: [layer(12, "scene-off", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "lullaby",
      to: "scene-off",
      hotspot: { x: 22, y: 22, w: 18, h: 40 }, // the glowing rabbit lantern, on the stool at left
    },
    // blanket-wiggle stays below the lights-off reveal on purpose: `scene-off`
    // dims the whole frame and 小兔 is asleep, so reverting any region of it to
    // the awake resting frame would break the goodnight moment. The moon is the
    // exception: it has an asleep-state flash (`window-moon-off`, derived from
    // `scene-off` by tools/make-moon-glow.py) that only touches the moon.
    extras: [
      // The old hotspot (62,3,20x31) covered just the window's upper-left; the
      // window is x 65-88%, y 6-49% with the moon at (77%, 25%).
      { flash: "window-moon", flashAfter: "window-moon-off", sfx: "chime", hotspot: { x: 65, y: 5, w: 24, h: 45 }, aboveReveal: true, focus: { x: 62, y: 0, w: 30, h: 56 } }, // moon, last appearance
      { flash: "blanket-wiggle", sfx: "whump", hotspot: { x: 35, y: 40, w: 45, h: 50 } }, // 小兔 settling in
    ],
  },
];

export const LAST_PAGE_INDEX = PAGES.length; // step 0 = title card, 1..12 = pages
