"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Décalage de la nav collante lors d'un saut d'ancre. */
const NAV_OFFSET = -88;

/**
 * Smooth scroll Lenis.
 *
 * Désactivé sous `prefers-reduced-motion` et sur pointeur grossier
 * (tactile), où le défilement natif est plus fluide et moins coûteux.
 * Intercepte aussi les liens d'ancre pour compenser la hauteur de la nav.
 */
export function SmoothScroll() {
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (calm || coarse) return;

    const lenis = new Lenis({ lerp: 0.09 });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET });
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
