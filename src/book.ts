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
const REUNION = { zh: "分完啦，一家团圆。", en: "All shared — together as one family." };
const ITS_A_RABBIT = { zh: "那是兔子！", en: "That's a rabbit!" };

// Hotspots are % of the stage {x,y = top-left, w,h}. No approved art yet (M0) —
// these are rough placeholders, centred on where each element is *described* to
// sit; re-measure once real plates exist, same as story-halloween's workflow.
export const PAGES: Page[] = [
  {
    id: 1,
    text: { zh: "中秋节到了！", en: "It's the Mooncake Festival!" },
    background: bg(1),
    layers: [layer(1, "moon")],
    interaction: {
      kind: "twinkle",
      sfx: "chime",
      targetLayer: "moon",
      hotspot: { x: 58, y: 4, w: 26, h: 30 }, // moon, upper-right
    },
    extras: [
      { flash: "window-peek", sfx: "hush", hotspot: { x: 14, y: 52, w: 18, h: 24 } }, // a lit window below
    ],
  },
  {
    id: 2,
    text: { zh: "小兔做兔子灯。", en: "Little Rabbit makes a rabbit lantern." },
    background: bg(2),
    layers: [layer(2, "scene-decorated", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "rustle",
      to: "scene-decorated",
      hotspot: { x: 36, y: 30, w: 28, h: 40 }, // the blank lantern on the table
    },
    extras: [
      { flash: "scraps-flutter", sfx: "rustle", hotspot: { x: 8, y: 60, w: 20, h: 22 } }, // basket of paper scraps
      { flash: "stool-wobble", sfx: "tap", hotspot: { x: 70, y: 70, w: 16, h: 18 } }, // the little stool
    ],
  },
  {
    id: 3,
    text: { zh: "小兔提起灯笼。", en: "Little Rabbit lights the lantern." },
    background: bg(3),
    layers: [layer(3, "lantern-lit")],
    interaction: {
      kind: "glow",
      sfx: "sparkle",
      targetLayer: "lantern-lit",
      hotspot: { x: 30, y: 20, w: 30, h: 50 }, // the lantern, held up
    },
    // Quiet single-beat page — no extras (PRD §6.1).
  },
  {
    id: 4,
    text: { zh: "月饼切成四块。", en: "The mooncake is cut into four pieces." },
    background: bg(4),
    layers: [layer(4, "scene-cut", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "slice",
      to: "scene-cut",
      hotspot: { x: 40, y: 44, w: 26, h: 30 }, // the whole mooncake + knife
    },
    extras: [
      { flash: "teapot-steam", sfx: "whistle", hotspot: { x: 74, y: 36, w: 16, h: 22 } }, // teapot, right
      { flash: "window-moon", sfx: "chime", hotspot: { x: 6, y: 6, w: 18, h: 22 } }, // window + moon, left
    ],
  },
  {
    id: 5,
    text: { zh: "小兔看舞龙。", en: "Little Rabbit watches the dragon dance." },
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
      { flash: "tree-leaves", sfx: "rustle", hotspot: { x: 4, y: 18, w: 20, h: 46 } }, // autumn tree, left
      { flash: "window-moon", sfx: "chime", hotspot: { x: 80, y: 4, w: 16, h: 20 } }, // moon, upper-right
    ],
  },
  {
    id: 6,
    text: { zh: "小兔给奶奶一块。", en: "Little Rabbit gives Grandma a piece." },
    secondaryText: THANKS_3,
    background: bg(6),
    layers: [layer(6, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 3,
      counting: true,
      hotspot: { x: 44, y: 50, w: 18, h: 22 }, // the wedge, mid-offer
    },
    extras: [
      { flash: "plant-sway", sfx: "rustle", hotspot: { x: 8, y: 58, w: 16, h: 28 } }, // potted plant by 奶奶's door
    ],
  },
  {
    id: 7,
    text: { zh: "小兔给爷爷一块。", en: "Little Rabbit gives Grandpa a piece." },
    secondaryText: THANKS_2,
    background: bg(7),
    layers: [layer(7, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 2,
      counting: true,
      hotspot: { x: 44, y: 50, w: 18, h: 22 },
    },
    extras: [
      { flash: "chair-rock", sfx: "creak", hotspot: { x: 74, y: 56, w: 18, h: 26 } }, // 爷爷's rocking chair
      { flash: "lantern-bright", sfx: "flare", hotspot: { x: 6, y: 10, w: 14, h: 30 } }, // hanging lantern
    ],
  },
  {
    id: 8,
    text: { zh: "小兔给小猫一块。", en: "Little Rabbit gives a piece to Mr. Cat." },
    secondaryText: THANKS_1,
    background: bg(8),
    layers: [layer(8, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "hum",
      to: "scene-given",
      remaining: 1,
      counting: true,
      hotspot: { x: 44, y: 50, w: 18, h: 22 },
    },
    extras: [
      { flash: "cat-tail", sfx: "purr", hotspot: { x: 66, y: 46, w: 14, h: 26 } }, // 小猫's tail, a callback to book 1
      { flash: "toy-wiggle", sfx: "squeak", hotspot: { x: 10, y: 68, w: 14, h: 18 } }, // a toy by the porch
    ],
  },
  {
    id: 9,
    text: { zh: "小兔回家啦。", en: "Little Rabbit goes home." },
    background: bg(9),
    layers: [layer(9, "scene-open", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "swap",
      sfx: "creak",
      to: "scene-open",
      hotspot: { x: 46, y: 14, w: 28, h: 60 }, // the front door
    },
    extras: [
      { flash: "window-bright", sfx: "chime", hotspot: { x: 10, y: 20, w: 20, h: 30 } }, // warm-lit window
      { flash: "window-moon", sfx: "chime", hotspot: { x: 78, y: 4, w: 16, h: 20 } }, // moon, upper-right
    ],
  },
  {
    id: 10,
    text: {
      zh: "和爸妈分最后一块。",
      en: "Little Rabbit shares the last piece with Mom and Dad.",
    },
    secondaryText: REUNION,
    background: bg(10),
    layers: [layer(10, "scene-given", { className: "swap-to", ext: "webp" })],
    interaction: {
      kind: "give",
      sfx: "warm-chime",
      to: "scene-given",
      remaining: 0,
      counting: true,
      split: true,
      hotspot: { x: 44, y: 50, w: 18, h: 22 }, // the last wedge on the plate
    },
    extras: [
      { flash: "window-moon", sfx: "chime", hotspot: { x: 72, y: 6, w: 18, h: 22 } }, // moon through the window
      { flash: "candle-flare", sfx: "flare", hotspot: { x: 20, y: 40, w: 10, h: 16 } }, // table candle
    ],
  },
  {
    id: 11,
    text: { zh: "一起看月亮。", en: "Let's look at the moon together." },
    secondaryText: ITS_A_RABBIT,
    background: bg(11),
    layers: [layer(11, "jade-rabbit")],
    interaction: {
      kind: "twinkle",
      sfx: "magic",
      targetLayer: "jade-rabbit",
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
      hotspot: { x: 66, y: 30, w: 16, h: 28 }, // the lantern on the nightstand
    },
    extras: [
      { flash: "window-moon", sfx: "chime", hotspot: { x: 74, y: 2, w: 22, h: 28 } }, // moon, last appearance
      { flash: "blanket-wiggle", sfx: "whump", hotspot: { x: 40, y: 70, w: 24, h: 20 } }, // 小兔 settling in
    ],
  },
];

export const LAST_PAGE_INDEX = PAGES.length; // step 0 = title card, 1..12 = pages
