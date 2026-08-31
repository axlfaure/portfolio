"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Un seul observateur pour toute la page : il révèle les éléments portant
 * `data-reveal`, une fois chacun. Les composants serveur restent des
 * composants serveur — ils posent juste un attribut.
 *
 * Seuil 4 %, marge basse de -6 %, conformément au brief.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    if (nodes.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const node of nodes) node.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -6% 0px" },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
