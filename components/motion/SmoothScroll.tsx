"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis tient déjà compte du `scroll-margin-top` des sections (`scroll-mt-24`,
 * soit 96px, au-dessus des 80px de la nav). Un décalage supplémentaire ici
 * ferait descendre la cible deux fois trop bas.
 */
const NAV_OFFSET = 0;

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
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

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

      // stopPropagation est indispensable : sans lui le <Link> de Next
      // pousse la route et saute à l'ancre avant que Lenis n'anime.
      event.preventDefault();
      event.stopPropagation();
      lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET });
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
