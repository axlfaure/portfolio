"use client";

import { useEffect } from "react";

/** Durée du ralentissement, et de la reprise. */
const DUREE = 520;

/**
 * Les bandes horizontales seulement.
 *
 * Les colonnes verticales du mur d'avis en sont exclues, et gardent leur arrêt
 * net en CSS. Elles sont trois, côte à côte, remplies de cartes de hauteurs
 * très inégales, et le ralenti y produisait plus de gêne que de confort : on
 * traverse une colonne pour en atteindre une autre, et chaque traversée
 * lançait une rampe. Une bande de logos, elle, est seule et large : on la
 * survole pour la regarder, pas pour aller ailleurs.
 */
const ZONES = ".ticker";

/**
 * Décélération et reprise des bandes défilantes au survol.
 *
 * `animation-play-state: paused` coupe net : la bande passe de sa vitesse de
 * croisière à l'arrêt en une image, et c'est ce coup de frein qu'on sent. La
 * propriété n'est pas animable, il n'y a donc pas de version CSS de ce qu'on
 * veut ici.
 *
 * La solution passe par l'API Web Animations, qui donne accès aux animations
 * CSS déjà en cours et à leur `playbackRate`. On le fait descendre de 1 à 0,
 * puis remonter, sur une courbe en accélération puis décélération. La bande ne
 * s'arrête pas, elle se pose.
 *
 * Le câblage est délégué au document plutôt qu'attaché à chaque bande : les
 * tickers apparaissent et disparaissent au fil des navigations, et une liste
 * relevée au montage serait fausse dès la première. `pointerover` et
 * `pointerout` remontent, contrairement à `pointerenter` et `pointerleave`,
 * d'où leur emploi ici, avec un test sur l'élément quitté pour ignorer les
 * déplacements internes à une même bande.
 *
 * Rien n'est câblé sur un appareil sans survol réel : au doigt, `pointerover`
 * se déclenche à la première touche et `pointerout` n'arrive pas toujours, ce
 * qui laisserait la bande arrêtée pour de bon.
 */
export function TickerEase() {
  useEffect(() => {
    const survol = window.matchMedia("(hover: hover)");
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!survol.matches || calme.matches) return;

    /* Une image en vol par bande : la seconde demande annule la première,
       sinon un aller-retour rapide de la souris fait courir deux rampes
       contradictoires sur la même piste. */
    const enVol = new WeakMap<Element, number>();

    const zoneDe = (cible: EventTarget | null) =>
      cible instanceof Element ? cible.closest(ZONES) : null;

    const viser = (zone: Element, cible: number) => {
      const piste = zone.firstElementChild;
      if (!piste) return;

      const animations = piste.getAnimations();
      if (animations.length === 0) return;

      const enCours = enVol.get(zone);
      if (enCours !== undefined) cancelAnimationFrame(enCours);

      const depart = animations[0].playbackRate;
      if (depart === cible) return;

      const debut = performance.now();

      const pas = (maintenant: number) => {
        const t = Math.min(1, (maintenant - debut) / DUREE);
        // Accélération puis décélération : le ralentissement s'amorce
        // doucement, creuse, puis s'éteint sans à-coup.
        const adouci = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const vitesse = depart + (cible - depart) * adouci;

        for (const animation of animations) animation.playbackRate = vitesse;

        if (t < 1) enVol.set(zone, requestAnimationFrame(pas));
        else enVol.delete(zone);
      };

      enVol.set(zone, requestAnimationFrame(pas));
    };

    /* Le survol seulement. Le focus clavier garde son arrêt net, en CSS : qui
       tabule dans une bande en mouvement veut l'immobiliser tout de suite pour
       atteindre un lien, pas la voir ralentir. Traiter les deux ici mettrait
       en plus les deux mécanismes en concurrence sur la même piste. */
    const entrer = (e: PointerEvent) => {
      const zone = zoneDe(e.target);
      if (!zone || zoneDe(e.relatedTarget) === zone) return;
      viser(zone, 0);
    };

    const sortir = (e: PointerEvent) => {
      const zone = zoneDe(e.target);
      if (!zone || zoneDe(e.relatedTarget) === zone) return;
      viser(zone, 1);
    };

    document.addEventListener("pointerover", entrer);
    document.addEventListener("pointerout", sortir);

    return () => {
      document.removeEventListener("pointerover", entrer);
      document.removeEventListener("pointerout", sortir);
    };
  }, []);

  return null;
}
