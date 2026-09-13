import { useEffect, useRef, useState } from "react";
import type { ExtraTap, Page } from "../types";
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
    if (it.kind === "dance" && dancing && id === it.targetLayer)
      return "is-dancing";
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
        return <Layer key={l.id} asset={l} className={layerClass(l.id)} />;
      })}

      {/* Easter-egg "reacted" frames: a full-frame variant of the plate cross-faded
          in for a moment on tap (PRD §6.1 "no dead taps"). */}
      {extras.map((x) => (
        <Layer
          key={x.flash}
          asset={{ id: x.flash, src: `/pages/${pad(page.id)}/${x.flash}.webp` }}
          className="extra-flash"
          hidden={!flashing[x.flash]}
        />
      ))}

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
