"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Un seul observateur pour toute la page : il révèle les éléments portant
 * `data-reveal`, une fois chacun. Les composants serveur restent des
 * composants serveur — ils posent juste un attribut.
 *
 * Un MutationObserver prend en charge les éléments ajoutés après le montage,
 * comme la grille projets quand on change de filtre : sans lui, ces cartes
 * resteraient invisibles, révélées par personne.
 *
 * Seuil 4 %, marge basse de -6 %, conformément au brief.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (node: HTMLElement) => node.classList.add("is-in");

    if (calm) {
      const show = () => {
        for (const node of document.querySelectorAll<HTMLElement>(
          "[data-reveal]:not(.is-in)",
        )) {
          reveal(node);
        }
      };
      show();
      const mutations = new MutationObserver(show);
      mutations.observe(document.body, { childList: true, subtree: true });
      return () => mutations.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -6% 0px" },
    );

    const track = () => {
      for (const node of document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.is-in)",
      )) {
        observer.observe(node);
      }
    };

    track();

    const mutations = new MutationObserver(track);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
