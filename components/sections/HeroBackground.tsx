"use client";

import { useEffect, useRef, useState } from "react";
import { heroBackground } from "@/lib/site";

type YtPlayer = {
  playVideo: () => void;
  mute: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: Record<string, unknown>,
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Charge l'API IFrame de YouTube une seule fois pour toute la page. */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

/**
 * Fond du hero : une seule source, interchangeable via `heroBackground.mode`
 * dans lib/site.ts.
 *
 * - "youtube" : test temporaire. Le lecteur est **construit par l'API**, pas
 *   attaché à une iframe existante : c'est la seule façon d'obtenir à la fois
 *   `controls: 0` respecté (sinon le lecteur affiche ses boutons au centre)
 *   et une relance fiable en fin de vidéo (`loop` seul s'arrête après une passe).
 * - "local"   : cible de production, /public/hero/chrome.mp4 + .webm.
 *
 * Un fallback en dégradés CSS animés prend le relais sur mobile, sous
 * `prefers-reduced-motion`, et si la source est absente.
 */
export function HeroBackground() {
  const [canPlay, setCanPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

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
  const isYouTube = heroBackground.mode === "youtube";

  // Un fichier local est prêt dès qu'il est monté ; YouTube a besoin d'un
  // délai fixe, le temps que ses contrôles de démarrage disparaissent.
  const revealed = showMedia && (!isYouTube || ytReady);

  useEffect(() => {
    if (!showMedia || !isYouTube) return;
    const timer = window.setTimeout(() => setYtReady(true), 2800);
    return () => window.clearTimeout(timer);
  }, [showMedia, isYouTube]);

  useEffect(() => {
    if (!showMedia || !isYouTube || !mountRef.current) return;
    let cancelled = false;
    let player: YtPlayer | undefined;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return;

      player = new window.YT.Player(mountRef.current, {
        videoId: heroBackground.youtubeId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e: { target: YtPlayer }) => {
            e.target.mute();
            e.target.playVideo();
          },
          // `loop` s'arrête après une passe : on relance à chaque fin.
          onStateChange: (e: { data: number; target: YtPlayer }) => {
            if (e.data === 0) e.target.playVideo();
          },
          onError: () => setFailed(true),
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy?.();
    };
  }, [showMedia, isYouTube]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-surface"
    >
      {(!showMedia || !revealed) && (
        <>
          <span className="hero-blob hero-blob-a" />
          <span className="hero-blob hero-blob-b" />
          <span className="hero-blob hero-blob-c" />
        </>
      )}

      {showMedia && (
        <div
          className="hero-media absolute inset-0"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 800ms var(--ease-site)",
          }}
        >
          {isYouTube ? (
            <div className="hero-player absolute inset-0">
              <div ref={mountRef} />
            </div>
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
              onError={() => setFailed(true)}
            >
              <source src={heroBackground.local.webm} type="video/webm" />
              <source src={heroBackground.local.mp4} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Dégradé blanc repris de la maquette Figma (linéaire, -107°). */}
      <span className="hero-veil absolute inset-0" />
    </div>
  );
}
