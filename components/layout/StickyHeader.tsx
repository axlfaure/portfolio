"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Hauteur en dessous de laquelle l'en-tête reste toujours visible.
 *
 * Sans ce seuil, le moindre défilement au sommet de la page ferait disparaître
 * la barre au moment précis où le visiteur cherche encore à s'orienter.
 */
const TOUJOURS_VISIBLE = 140;

/**
 * Course minimale avant de changer d'avis.
 *
 * Le défilement par inertie des téléphones renvoie des variations d'un ou deux
 * pixels dans les deux sens : sans ce filtre, la barre clignoterait.
 */
const SEUIL = 6;

/**
 * En-tête collant.
 *
 * Transparent au-dessus du hero, translucide dès que la page défile, pour
 * rester lisible sur le contenu.
 *
 * Sur téléphone il s'escamote aussi vers le haut quand on descend, et revient
 * dès qu'on remonte : sur un écran de 812 px, 80 px de barre permanente
 * mangeaient un dixième de la surface de lecture. Le comportement s'arrête à
 * 56rem, où la place ne manque plus.
 *
 * Exception : la zone des cartes empilées, marquée `data-stack-zone`. Les
 * cartes s'y collent au sommet de l'écran, et une barre qui reviendrait au
 * premier geste vers le haut recouvrirait le titre de la carte en cours. Elle
 * reste donc escamotée tant que cette zone n'est pas repassée sous le sommet.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [cache, setCache] = useState(false);
  const dernier = useRef(0);

  useEffect(() => {
    dernier.current = window.scrollY;

    /** Sommes-nous à l'intérieur d'une pile de cartes collées ? */
    const dansLaPile = () => {
      const zone = document.querySelector<HTMLElement>("[data-stack-zone]");
      if (!zone) return false;
      const { top, bottom } = zone.getBoundingClientRect();
      // Entrée dépassée par le haut, sortie pas encore atteinte.
      return top < 0 && bottom > 0;
    };

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      const course = y - dernier.current;
      if (Math.abs(course) < SEUIL) return;
      dernier.current = y;

      if (y <= TOUJOURS_VISIBLE) {
        setCache(false);
        return;
      }

      setCache(course > 0 || dansLaPile());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[translate,background-color,border-color] duration-[420ms] ease-expo motion-reduce:transition-none",
        scrolled
          ? "border-b border-line bg-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] backdrop-blur-[14px]"
          : "border-b border-transparent bg-transparent",
        /*
         * `translate` et non `transform` : c'est la propriété que Tailwind
         * écrit pour `-translate-y-full`, et une transition posée sur
         * `transform` n'anime alors rien du tout. La barre sautait d'un coup.
         *
         * `nav:translate-y-0` annule l'escamotage au-dessus de 56rem : la
         * règle de la barre visible y prime, quel que soit l'état enregistré.
         */
        cache ? "-translate-y-full nav:translate-y-0" : "translate-y-0",
      )}
    >
      {children}
    </header>
  );
}
