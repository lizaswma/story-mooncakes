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
       * collection. Used for the mooncake-sharing pages (6, 7, 8) — the countdown
       * stops at 1; page 10 keeps the last quarter with 小兔 and is a plain `swap`
       * (a family hug), not a `give`.
       */
      kind: "give";
      sfx: string;
      hotspot: Hotspot;
      /** Layer shown after the tap (the recipient holding the piece, plate down one). */
      to: string;
      /** Plate count remaining AFTER this tap — 3, 2, or 1. */
      remaining: number;
      /** Speak the number and show a numeral badge. */
      counting?: boolean;
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
  /**
   * Extras are edits of the page's PRE-interaction resting background (see
   * PageView's `.extra-flash` z-index note), so by default they render
   * *below* the main interaction's "to"/"given" art once it's open — safe,
   * but the tap goes visually silent (sfx only) after that point. Set this
   * true for an extra whose brief revert-and-recover is harmless (nothing
   * story-critical gets hidden, e.g. a mooncake's cut style) to render it
   * *above* instead, so it still flashes after the main tap has fired.
   * Leave unset on any extra whose page reveals something the story needs
   * to stay visible (a door opening on family, a hug) — reverting that even
   * briefly is the actual bug this flag exists to avoid re-introducing.
   */
  aboveReveal?: boolean;
  /**
   * With `aboveReveal`: confine the flash to this region (% of the stage, same
   * shape as a hotspot), feathered at the edges, instead of showing the whole
   * frame. The flash is an edit of the PRE-interaction background, so a
   * full-frame flash above the reveal briefly reverts *everything* (page 1's
   * brightened moon, page 9's family...). Focused on just the part that
   * animates, the rest of the frame keeps the revealed art. Size it to the
   * animated element plus its motion (sparks, wobble), and keep it off
   * anything the main interaction changes.
   */
  focus?: Hotspot;
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
