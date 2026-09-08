"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CtaButton } from "@/components/ui/CtaButton";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/lib/site";

/** Durée de la sortie. Le tiroir reste monté le temps de l'animation. */
const EXIT_MS = 260;

/**
 * Tiroir de navigation sous 56rem.
 *
 * Il est rendu dans `document.body` par un portail, et non à sa place dans
 * l'arbre. L'en-tête applique `backdrop-filter` puis, depuis qu'il s'escamote,
 * un `transform` : l'un comme l'autre créent un bloc conteneur pour les
 * descendants en `position: fixed`. Le panneau se calait alors sur l'en-tête de
 * 80 px au lieu du navigateur et se réduisait à une bande de 88 px. Le portail
 * le met hors de portée des deux.
 *
 * Il ne reprend que les sections du site. Les six services y figuraient aussi,
 * ce qui faisait défiler le tiroir pour atteindre l'appel à l'action : la page
 * Services les présente déjà, et mieux.
 *
 * `monte` porte la présence dans l'arbre, `shown` l'état de l'animation. Les
 * deux ne bougent que depuis des gestionnaires d'évènements : un `setState`
 * posé dans le corps d'un effet déclencherait une cascade de rendus.
 */
export function MobileMenu() {
  const [monte, setMonte] = useState(false);
  const [shown, setShown] = useState(false);

  const tiroirRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sortie = useRef<number | undefined>(undefined);

  const open = useCallback(() => {
    window.clearTimeout(sortie.current);
    setMonte(true);

    /*
     * Peint d'abord dans son état de départ, le tiroir a quelque chose à
     * parcourir : sans ce report, la transition démarre déjà terminée.
     *
     * Le doublon n'est pas une précaution de trop. Le navigateur suspend
     * `requestAnimationFrame` sur une page qui n'est pas peinte, et le tiroir
     * resterait alors monté, capturant le focus, mais invisible hors de
     * l'écran. Le minuteur, lui, continue de tourner : il ouvre sans animation
     * plutôt que de ne pas ouvrir du tout.
     */
    const demarrer = () => setShown(true);
    requestAnimationFrame(demarrer);
    window.setTimeout(demarrer, 60);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    sortie.current = window.setTimeout(() => {
      setMonte(false);
      // Le focus ne revient qu'une fois le tiroir parti : le rendre pendant
      // l'animation ferait sauter la page vers le haut.
      burgerRef.current?.focus();
    }, EXIT_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(sortie.current), []);

  useEffect(() => {
    if (!monte) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      /*
       * Piège à focus. Sans lui, la tabulation sort du tiroir et parcourt en
       * aveugle la page masquée derrière, qui reste dans l'arbre. La recherche
       * est bornée au tiroir : le fond est un bouton, il ne doit pas entrer
       * dans le cycle.
       */
      const cibles = tiroirRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!cibles || cibles.length === 0) return;
      const premier = cibles[0];
      const dernier = cibles[cibles.length - 1];

      if (event.shiftKey && document.activeElement === premier) {
        event.preventDefault();
        dernier.focus();
      } else if (!event.shiftKey && document.activeElement === dernier) {
        event.preventDefault();
        premier.focus();
      }
    };

    /*
     * L'appel à l'action ouvre la modale de rendez-vous, qui se placerait
     * derrière ce tiroir et resterait invisible. On referme donc sur le même
     * évènement plutôt que d'intercepter le clic : le bouton garde son rôle, et
     * la règle vaut d'où qu'il soit déclenché.
     */
    const onCalendly = () => close();

    // Retour arrière du navigateur : la page change sous un tiroir qui, lui,
    // resterait ouvert par-dessus.
    const onPop = () => close();

    document.addEventListener("keydown", onKey);
    window.addEventListener("calendly:open", onCalendly);
    window.addEventListener("popstate", onPop);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("calendly:open", onCalendly);
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = "";
    };
  }, [monte, close]);

  const tiroir = (
    <div className="fixed inset-0 z-[80] nav:hidden">
      {/* Le fond ferme au toucher. Le bouton dédié reste la sortie annoncée aux
          lecteurs d'écran, ce fond n'étant qu'un raccourci au doigt. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className={cn(
          "absolute inset-0 cursor-default bg-ink/30 transition-opacity ease-site motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: shown ? "320ms" : `${EXIT_MS}ms` }}
      />

      <div
        id="menu-mobile"
        ref={tiroirRef}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(21rem,86vw)] flex-col border-l border-line bg-paper shadow-e2",
          "transition-transform ease-expo motion-reduce:transition-none",
          shown ? "translate-x-0" : "translate-x-full",
        )}
        style={{ transitionDuration: shown ? "360ms" : `${EXIT_MS}ms` }}
      >
        {/* Barre reprenant la hauteur de l'en-tête : la croix tombe très
            exactement là où était le burger. */}
        <div className="flex h-20 shrink-0 items-center justify-between gap-4 pl-5 pr-[var(--gutter)]">
          <span className="text-[0.95rem] font-bold tracking-[-0.02em] text-ink">
            {site.name}
          </span>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fermer le menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-e1"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Navigation mobile"
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="border-b border-line py-4 text-[1.35rem] font-bold tracking-[-0.03em] text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0 border-t border-line bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <CtaButton variant="compact" className="w-full justify-center" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="nav:hidden">
      <button
        ref={burgerRef}
        type="button"
        aria-expanded={monte}
        aria-controls="menu-mobile"
        aria-label="Ouvrir le menu"
        onClick={open}
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-e1 transition-transform duration-200 ease-site active:scale-95 motion-reduce:transition-none"
      >
        {/*
         * Le pictogramme « menu » de Lucide, repris à l'identique : trois
         * lignes de 4 à 20, aux ordonnées 6, 12 et 18.
         *
         * Il était jusqu'ici composé de trois <span> de 1,5 px. Sur un écran
         * dont le rapport de pixels n'est pas entier, une bordure d'un pixel
         * et demi tombe entre deux pixels physiques : le navigateur la répartit
         * comme il peut, et les trois barres ressortent d'épaisseurs et de
         * gris différents. Un trait SVG à bouts ronds, lui, est rendu par le
         * même moteur que le reste des icônes du site et reste net.
         *
         * Même gabarit que le bouton de fermeture et que les icônes de
         * service : cadre de 24, tracé à 18, trait de 1,6, bouts ronds.
         */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      {/* Le portail n'est monté qu'après un geste de l'utilisateur : `document`
          existe forcément à ce moment, et le rendu serveur n'en voit rien. */}
      {monte && createPortal(tiroir, document.body)}
    </div>
  );
}
