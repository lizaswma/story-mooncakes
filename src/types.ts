// Data model for the storybook. See PRD.md §5 (story) and §6 (interactivity).
// Carried over from story-halloween's model — Asset/Hotspot/ExtraTap/Page/TitleCard
// are unchanged; `swap`/`glow`/`twinkle` are reused as-is. This book adds `give`
// (the mirror of book 1's `stick` — removes a piece instead of collecting one) and
// `dance` (a repeatable in-place animation, for the page 5 dragon).

export type Language = "zh" | "en";

export type LocalizedText = Record<Language, string>;

export type Asset = {
  /** Stable id, also used as the placeholder label until real art exists. */
  id: string;
  /** Path under /public. */
  src: string;
  alt?: string;
  /** Extra class for positioning/animation. */
  className?: string;
  /** If true, this layer is hidden until the page's interaction "opens". */
  onOpen?: boolean;
};

/** A large, toddler-sized tap area over the art, in % of the stage. */
export type Hotspot = { x: number; y: number; w: number; h: number };

export type Interaction =
  | { kind: "twinkle"; sfx: string; hotspot: Hotspot; targetLayer: string }
  | { kind: "glow"; sfx: string; hotspot: Hotspot; targetLayer?: string }
  | {
      kind: "swap";
      sfx: string;
      hotspot: Hotspot;
      /** Layer shown before the tap. Omit for a plain reveal over the background. */
      from?: string;
      /** Layer shown after the tap. */
      to: string;
    }
  | {
      /**
       * Repeatable in-place animation — tap to (re)play it, forever. Used for the
       * page 5 dragon dance: every tap is a fresh little encore, not a one-time
       * reveal. `hold` (ms, default 1400) is how long the animation class stays on
       * before it's safe to retrigger.
       */
      kind: "dance";
      sfx: string;
      hotspot: Hotspot;
      targetLayer: string;
      hold?: number;
    }
  | {
      /**
       * The mirror of `stick`: the plate starts with pieces already on it and a
       * tap *removes* one, sending it to a recipient, rather than adding one to a
       * collection. Used for the mooncake-sharing pages (6, 7, 8, 10).
       */
      kind: "give";
      sfx: string;
      hotspot: Hotspot;
      /** Layer shown after the tap (the recipient holding the piece, plate down one). */
      to: string;
      /** Plate count remaining AFTER this tap — 3, 2, 1, or 0. */
      remaining: number;
      /** Speak the number and show a numeral badge (page 10's 0 shows a heart instead). */
      counting?: boolean;
      /** Page 10 only: the last piece travels to TWO recipients at once. */
      split?: boolean;
    }
  | {
      kind: "stick";
      sfx: string;
      hotspot: Hotspot;
      /** How many stickers land on the bag. */
      count: number;
      /** Sticker sprite ids, in order (files under /public/stickers/<id>.webp). */
      stickers: string[];
      /** Counting page: speak the number and show the numeral on each tap. */
      counting?: boolean;
    };

/**
 * An "easter-egg" tap: a secondary element a toddler is likely to poke at.
 * It never gates progress and is never "wrong". Tapping cross-fades in a
 * full-frame "reacted" variant of the plate (the moon brightens, the lantern
 * flares…) for a beat, plus a soft sound. Repeatable forever. PRD §6.1.
 */
export type ExtraTap = {
  hotspot: Hotspot;
  sfx: string;
  /** Full-frame variant layer id under /pages/NN/ (e.g. "moon-bright"). */
  flash: string;
  /** How long the variant stays up, ms (default 900). */
  hold?: number;
};

export type Page = {
  id: number;
  text: LocalizedText;
  /** e.g. the "thank you" line on the giving pages, or the reunion line on page 10. */
  secondaryText?: LocalizedText;
  background: Asset;
  layers: Asset[];
  interaction: Interaction;
  /** Secondary tappable elements (PRD §6 "no dead taps"). */
  extras?: ExtraTap[];
};

export type TitleCard = {
  series: LocalizedText;
  title: LocalizedText;
  start: LocalizedText;
  background: Asset;
  layers: Asset[];
};
