"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Met en retrait les cartes de projet qui ne sont pas encore arrivées.
 *
 * Le problème : la carte suivante monte depuis le bas de l'écran pendant qu'on
 * lit encore la précédente. Comme chaque projet a son visuel, et que ces
 * visuels n'ont ni les mêmes couleurs ni la même densité, deux images sans
 * rapport se disputent l'attention à chaque défilement.
 *
 * La règle est simple, et c'est ce qui la rend lisible : **une carte est en
 * pleine lumière dès qu'elle a atteint sa position d'arrêt**. Avant, elle
 * s'efface. Les cartes déjà dépassées restent nettes : on n'en voit qu'une
 * tranche d'un centimètre, et c'est elle qui donne à la pile son épaisseur.
 *
 * Le retrait passe par un voile couleur papier posé sur la carte, et non par
 * son opacité. Les cartes se chevauchent : une carte translucide laisserait
 * voir celle du dessous par transparence, et deux mises en page superposées
 * donnent une bouillie, pas une profondeur. Le voile, lui, éloigne la carte
 * dans le fond de la page sans rien révéler derrière.
 *
 * La valeur suit la position plutôt qu'un minuteur. Une transition déclenchée
 * à l'arrivée se jouerait après le geste, avec un temps de retard ; là, le
 * voile se lève à la vitesse du doigt.
 */

/** Voile maximal, quand la carte est encore loin de sa place. */
const VOILE_MAX = 0.7;

/** Distance de fondu, en part de la hauteur de fenêtre. */
const COURSE = 0.5;

export function StackFocus() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cartes = [
      ...document.querySelectorAll<HTMLElement>("[data-stack-zone] .stack-card"),
    ];
    if (cartes.length === 0) return;

    let demande = 0;

    const peindre = () => {
      demande = 0;
      const course = window.innerHeight * COURSE;

      for (const carte of cartes) {
        /*
         * La position d'arrêt est le `top` que la carte tient une fois collée.
         * Elle est portée par la feuille de style et varie selon la largeur,
         * donc on la relit plutôt que de la recalculer.
         */
        const arret = Number.parseFloat(getComputedStyle(carte).top) || 0;
        const reste = carte.getBoundingClientRect().top - arret;

        // Négatif ou nul : la carte est arrivée, ou déjà dépassée.
        const part = reste <= 0 ? 0 : Math.min(1, reste / course);
        const voile = (part * VOILE_MAX).toFixed(3);

        if (carte.dataset.voile !== voile) {
          carte.dataset.voile = voile;
          carte.style.setProperty("--stack-voile", voile);
        }
      }
    };

    const surGeste = () => {
      // Une seule peinture par image : le défilement émet bien plus souvent
      // que l'écran ne se rafraîchit.
      if (demande === 0) demande = requestAnimationFrame(peindre);
    };

    /*
     * `requestAnimationFrame` est suspendu sur un onglet en arrière-plan. Un
     * geste amorcé avant de changer d'onglet laisserait donc les voiles à
     * leur dernière valeur peinte. On repeint au retour, sans attendre le
     * prochain défilement.
     */
    const auRetour = () => {
      if (document.visibilityState === "visible") peindre();
    };

    peindre();
    window.addEventListener("scroll", surGeste, { passive: true });
    window.addEventListener("resize", surGeste);
    document.addEventListener("visibilitychange", auRetour);

    return () => {
      if (demande !== 0) cancelAnimationFrame(demande);
      window.removeEventListener("scroll", surGeste);
      window.removeEventListener("resize", surGeste);
      document.removeEventListener("visibilitychange", auRetour);
      for (const carte of cartes) {
        carte.style.removeProperty("--stack-voile");
        delete carte.dataset.voile;
      }
    };
  }, [pathname]);

  return null;
}
