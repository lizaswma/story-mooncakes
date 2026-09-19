import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ExtraTap, Hotspot, Page } from "../types";
import { useBook } from "../context/BookContext";
import { t } from "../i18n";
import {
  playCount,
  playNarration,
  playSfx,
  stopNarration,
} from "../audio/sound";
import { Layer } from "./Layer";

const pad = (n: number) => String(n).padStart(2, "0");

/** Feathered oval mask over a hotspot-shaped region (see ExtraTap.focus). */
function focusMask(f: Hotspot): CSSProperties {
  // Radii are 1.25x the half-extents so the oval still covers the rect's corners.
  const mask = `radial-gradient(ellipse ${(f.w / 2) * 1.25}% ${(f.h / 2) * 1.25}% at ${
    f.x + f.w / 2
  }% ${f.y + f.h / 2}%, #000 70%, transparent 100%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

/** One story page: background + stacked layers + one big tap target (PRD §6). */
export function PageView({ page }: { page: Page }) {
  const { language, showText } = useBook();
  const it = page.interaction;
  const extras = page.extras ?? [];

  const [opened, setOpened] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [twinkling, setTwinkling] = useState(false);
  const [dancing, setDancing] = useState(false);
  const [given, setGiven] = useState(false);
  const [stuck, setStuck] = useState(0);
  // Easter eggs + the repeatable dragon dance clear themselves on a timer so the
  // element can be tapped again right away.
  const [flashing, setFlashing] = useState<Record<string, boolean>>({});
  // Bumped on every tapExtra call so the spark below remounts (and its CSS
  // animation restarts) even when re-tapped before the previous hold has
  // expired — otherwise `flashing[x.flash]` is already `true`, the `hidden`
  // attribute never flips, and a quick second tap plays no animation at all.
  const [tapNonce, setTapNonce] = useState<Record<string, number>>({});
  // Same idea as tapNonce above, but for the main hotspot on kinds (`glow`,
  // `twinkle`) whose own effect is a slow ambient pulse layered on art that
  // may already read as "on" (page 3's lantern is drawn lit at rest) — so a
  // tap can register with nothing visible to prove it, especially with no
  // sfx yet. An instant spark on top gives an unmistakable "yes, that
  // worked" regardless of how subtle the ambient effect reads.
  const [mainTapNonce, setMainTapNonce] = useState(0);
  // Same fix again, for the dance encore: `dancing` stays `true` across a
  // re-tap made after the 900ms wiggle finishes but before the 1400ms hold
  // expires, so the `is-dancing` class never toggles off-and-on and the
  // animation never replays — that tap looked completely dead. Folding this
  // into the puppet layer's key forces a remount (and a fresh animation) on
  // every tap regardless of timing.
  const [danceNonce, setDanceNonce] = useState(0);
  const danceTimer = useRef<number>();
  // The banner fades back after a few seconds so it stops covering the art; a
  // tap on it (or a page turn) brings it back. Parent-facing text only.
  const [bannerDim, setBannerDim] = useState(false);

  // Pending timers (banner fade + per-easter-egg reset), cleared on unmount so a
  // page turn can't fire state updates on the old page.
  const bannerTimer = useRef<number>();
  const flashTimers = useRef<Record<string, number>>({});
  useEffect(
    () => () => {
      window.clearTimeout(bannerTimer.current);
      window.clearTimeout(danceTimer.current);
      Object.values(flashTimers.current).forEach(window.clearTimeout);
    },
    [],
  );

  // Narration auto-plays on page turn and whenever the language changes (PRD §4.1).
  useEffect(() => {
    playNarration(page.id, language);
    return () => stopNarration();
  }, [page.id, language]);

  // Reset + arm the banner auto-fade on every page turn.
  useEffect(() => {
    setBannerDim(false);
    window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBannerDim(true), 4200);
  }, [page.id]);

  function wakeBanner() {
    setBannerDim(false);
    window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBannerDim(true), 4200);
  }

  function handleTap() {
    playSfx(it.sfx);
    if (it.kind === "glow" || it.kind === "twinkle") setMainTapNonce((n) => n + 1);
    switch (it.kind) {
      case "swap":
        setOpened(true);
        break;
      case "glow":
        setGlowing(true);
        break;
      case "twinkle":
        setTwinkling(true);
        break;
      case "dance":
        setDancing(true);
        setDanceNonce((n) => n + 1);
        // Re-tapping restarts the encore rather than letting it cut short.
        window.clearTimeout(danceTimer.current);
        danceTimer.current = window.setTimeout(
          () => setDancing(false),
          it.hold ?? 1400,
        );
        break;
      case "give":
        setGiven(true);
        if (it.counting && it.remaining > 0) playCount(it.remaining, language);
        break;
      case "stick":
        setStuck((n) => {
          if (n >= it.count) return n;
          const next = n + 1;
          if (it.counting) playCount(next, language);
          return next;
        });
        break;
    }
  }

  function tapExtra(x: ExtraTap) {
    playSfx(x.sfx);
    setFlashing((f) => ({ ...f, [x.flash]: true }));
    setTapNonce((n) => ({ ...n, [x.flash]: (n[x.flash] ?? 0) + 1 }));
    // Re-tapping restarts the hold rather than letting an in-flight timer cut it short.
    window.clearTimeout(flashTimers.current[x.flash]);
    flashTimers.current[x.flash] = window.setTimeout(() => {
      setFlashing((f) => {
        const next = { ...f };
        delete next[x.flash];
        return next;
      });
      delete flashTimers.current[x.flash];
    }, x.hold ?? 900);
  }

  function layerClass(id: string): string {
    if (it.kind === "glow" && glowing && id === it.targetLayer)
      return "is-glowing";
    if (it.kind === "twinkle" && twinkling && id === it.targetLayer)
      return "is-twinkling";
    if (it.kind === "dance" && id === it.targetLayer)
      // "layer-puppet" always applies (not just while animating): the dragon
      // is a permanent foreground cutout, generated without any of the
      // extras' full-frame background flashes baked in, so it must always
      // paint above `.extra-flash` (z-index 3) or an easter-egg tap makes it
      // vanish for the flash's hold — it was otherwise unstyled and so sat
      // at the default stacking level, right behind the flash.
      return dancing ? "layer-puppet is-dancing" : "layer-puppet";
    return "";
  }

  const pageGlowing = it.kind === "glow" && glowing && !it.targetLayer;

  return (
    <div
      className={`page ${pageGlowing ? "is-glowing" : ""}`}
      data-open={opened || undefined}
    >
      <Layer asset={page.background} className="background" />

      {page.layers.map((l) => {
        if (it.kind === "swap" && l.id === it.from)
          return <Layer key={l.id} asset={l} hidden={opened} />;
        if (it.kind === "swap" && l.id === it.to)
          return <Layer key={l.id} asset={l} hidden={!opened} />;
        if (it.kind === "give" && l.id === it.to)
          return <Layer key={l.id} asset={l} hidden={!given} />;
        if (l.onOpen) return <Layer key={l.id} asset={l} hidden={!opened} />;
        const key =
          it.kind === "dance" && l.id === it.targetLayer
            ? `${l.id}-${danceNonce}`
            : l.id;
        return <Layer key={key} asset={l} className={layerClass(l.id)} />;
      })}

      {/* Easter-egg "reacted" frames: a full-frame variant of the plate cross-faded
          in for a moment on tap (PRD §6.1 "no dead taps"). */}
      {extras.map((x) => (
        <Layer
          key={x.flash}
          asset={{ id: x.flash, src: `/pages/${pad(page.id)}/${x.flash}.webp` }}
          className={`extra-flash ${x.aboveReveal ? "above-reveal" : ""}`}
          style={x.focus ? focusMask(x.focus) : undefined}
          hidden={!flashing[x.flash]}
        />
      ))}

      {/* Always-visible tap acknowledgment, confined to the extra's own small
          hotspot rect. The full-frame flash above must stay hidden behind an
          already-revealed "to"/"given" layer on most pages (reverting that
          reveal, even briefly, is the actual bug `aboveReveal` guards
          against — see ExtraTap in types.ts), which otherwise leaves a tap
          that fires sfx only, with nothing to see or feel yet since no sfx
          assets exist. This spark never touches the reveal, so it's safe to
          show every time, in any order, before or after the main tap. */}
      {extras.map((x) => (
        <div
          key={`spark-${x.flash}-${tapNonce[x.flash] ?? 0}`}
          className="tap-spark"
          style={{
            left: `${x.hotspot.x}%`,
            top: `${x.hotspot.y}%`,
            width: `${x.hotspot.w}%`,
            height: `${x.hotspot.h}%`,
          }}
          hidden={!flashing[x.flash]}
          aria-hidden="true"
        />
      ))}

      {(it.kind === "glow" || it.kind === "twinkle") && mainTapNonce > 0 && (
        <div
          key={`main-spark-${mainTapNonce}`}
          className="tap-spark"
          style={{
            left: `${it.hotspot.x}%`,
            top: `${it.hotspot.y}%`,
            width: `${it.hotspot.w}%`,
            height: `${it.hotspot.h}%`,
          }}
          aria-hidden="true"
        />
      )}

      {it.kind === "give" && given && it.counting && (
        // Countdown stops at 1 (pages 6-8) — page 10 keeps the last quarter with
        // 小兔 and is a `swap`, not a `give`, so `remaining` is never 0 here.
        <div className="give-badge">
          <b className="count-num">{it.remaining}</b>
        </div>
      )}

      {it.kind === "stick" && it.counting && (
        // The plate already shows the stickers on the floor — tapping just
        // counts them: a numeral pops over each in turn.
        <div className="count-row">
          {Array.from({ length: stuck }).map((_, i) => (
            <b className="count-num" key={i}>
              {i + 1}
            </b>
          ))}
        </div>
      )}
      {it.kind === "stick" && !it.counting && (
        <div className="sticker-bag">
          {it.stickers.slice(0, stuck).map((id, i) => (
            <span className="sticker" key={i}>
              <img src={`/stickers/${id}.webp`} alt="" draggable={false} />
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="hotspot"
        style={{
          left: `${it.hotspot.x}%`,
          top: `${it.hotspot.y}%`,
          width: `${it.hotspot.w}%`,
          height: `${it.hotspot.h}%`,
        }}
        onClick={handleTap}
        aria-label={t(page.text, language)}
      />

      {/* Easter-egg tap targets, above the main hotspot so they win on overlap. */}
      {extras.map((x) => (
        <button
          key={x.flash}
          type="button"
          className="hotspot extra-hotspot"
          style={{
            left: `${x.hotspot.x}%`,
            top: `${x.hotspot.y}%`,
            width: `${x.hotspot.w}%`,
            height: `${x.hotspot.h}%`,
          }}
          onClick={() => tapExtra(x)}
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}

      <button
        type="button"
        className={`text-banner ${bannerDim ? "is-dim" : ""} ${
          showText ? "" : "text-hidden"
        }`}
        onClick={() => {
          playNarration(page.id, language);
          wakeBanner();
        }}
        aria-label={
          (language === "zh" ? "再听一次：" : "Play again: ") +
          t(page.text, language)
        }
      >
        <span className="replay-icon" aria-hidden="true">
          ▶
        </span>
        {showText && (
          <span className="banner-text">
            <span className="sentence">{t(page.text, language)}</span>
            {page.secondaryText && (
              <span className="chant">{t(page.secondaryText, language)}</span>
            )}
          </span>
        )}
      </button>
    </div>
  );
}
