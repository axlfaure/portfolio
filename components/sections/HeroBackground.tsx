"use client";

import { useEffect, useState } from "react";
import { heroBackground } from "@/lib/site";

/**
 * Fond du hero : une seule source, interchangeable via `heroBackground.mode`
 * dans lib/site.ts.
 *
 * - "youtube" : test temporaire, iframe youtube-nocookie, jamais chargée sur mobile.
 * - "local"   : cible de production, /public/hero/chrome.mp4 + .webm.
 *
 * Dans tous les cas un fallback en dégradés CSS animés prend le relais :
 * sur mobile, sous prefers-reduced-motion, et si la source est absente ou bloquée.
 */
export function HeroBackground() {
  const [canPlay, setCanPlay] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 48rem)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCanPlay(wide.matches && !calm.matches);
    sync();
    wide.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  const showMedia = canPlay && !failed;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-surface"
    >
      {/* Fallback : toujours rendu, masqué dès que la vidéo prend le relais. */}
      {!showMedia && (
        <>
          <span className="hero-blob hero-blob-a" />
          <span className="hero-blob hero-blob-b" />
          <span className="hero-blob hero-blob-c" />
        </>
      )}

      {/* Trame de grille, sous la vidéo. */}
      <span className="hero-grid grid-trame absolute inset-0" />

      {showMedia && (
        <div className="hero-media absolute inset-0">
          {heroBackground.mode === "youtube" ? (
            <iframe
              className="hero-yt"
              src={`https://www.youtube-nocookie.com/embed/${heroBackground.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${heroBackground.youtubeId}&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&playsinline=1&iv_load_policy=3`}
              title=""
              tabIndex={-1}
              aria-hidden="true"
              allow="autoplay; encrypted-media"
              onError={() => setFailed(true)}
            />
          ) : (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroBackground.local.poster}
              tabIndex={-1}
              aria-hidden="true"
              onError={() => setFailed(true)}
            >
              <source src={heroBackground.local.webm} type="video/webm" />
              <source src={heroBackground.local.mp4} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Voile blanc : garantit la lisibilité du texte par-dessus. */}
      <span className="hero-veil absolute inset-0" />
    </div>
  );
}
