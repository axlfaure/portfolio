"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CtaButton } from "@/components/ui/CtaButton";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/cn";
import type { NavService } from "@/lib/nav";
import { navLinks, site } from "@/lib/site";

/** Durée de la sortie. Le panneau reste monté le temps de l'animation. */
const EXIT_MS = 260;

/**
 * Menu plein écran sous 56rem.
 *
 * Le panneau est rendu dans `document.body` par un portail, et non à sa place
 * dans l'arbre. L'en-tête applique `backdrop-filter` dès que la page défile,
 * or un filtre d'arrière-plan crée un bloc conteneur pour les descendants en
 * `position: fixed` : le panneau se calait alors sur l'en-tête de 80 px au lieu
 * du navigateur, et se réduisait à une bande de 88 px. Comme sur un téléphone
 * on défile toujours avant d'ouvrir le menu, il paraissait simplement mort.
 *
 * Le portail met le panneau hors de portée de ce piège, et de tout `transform`
 * ou `filter` qu'un parent pourrait recevoir plus tard.
 *
 * `monte` porte la présence dans l'arbre, `shown` l'état de l'animation. Les
 * deux ne bougent que depuis des gestionnaires d'évènements : un `setState`
 * posé dans le corps d'un effet déclencherait une cascade de rendus, ce que le
 * compilateur React refuse à juste titre.
 */
export function MobileMenu({ services }: { services: NavService[] }) {
  const [monte, setMonte] = useState(false);
  const [shown, setShown] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sortie = useRef<number | undefined>(undefined);

  const open = useCallback(() => {
    window.clearTimeout(sortie.current);
    setMonte(true);
    // Peint d'abord dans son état de départ, le panneau a quelque chose à
    // parcourir. Sans ce délai, la transition démarre déjà terminée.
    requestAnimationFrame(() => setShown(true));
  }, []);

  const close = useCallback(() => {
    setShown(false);
    sortie.current = window.setTimeout(() => {
      setMonte(false);
      // Le focus ne revient qu'une fois le panneau parti : le rendre pendant
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
       * Piège à focus. Sans lui, la tabulation sort du panneau et parcourt en
       * aveugle la page masquée derrière, qui reste dans l'arbre.
       */
      const cibles = panelRef.current?.querySelectorAll<HTMLElement>(
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
     * L'appel à l'action du bas ouvre la modale de rendez-vous, qui se placerait
     * derrière ce panneau et resterait invisible. On referme donc sur le même
     * évènement plutôt que d'intercepter le clic : le bouton garde son rôle, et
     * la règle vaut d'où qu'il soit déclenché.
     */
    const onCalendly = () => close();

    // Retour arrière du navigateur : la page change sous un panneau qui, lui,
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

  const panneau = (
    <div
      id="menu-mobile"
      ref={panelRef}
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-paper nav:hidden",
        "transition-[opacity,translate] ease-expo motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
      style={{ transitionDuration: shown ? "320ms" : `${EXIT_MS}ms` }}
    >
      {/* Barre reprenant la hauteur et les marges de l'en-tête : le panneau se
          pose exactement dessus, la croix tombe là où était le burger. */}
      <div className="container-site flex h-20 shrink-0 items-center justify-between gap-6">
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

      {/* Seule cette zone défile : la barre du haut et l'appel à l'action du
          bas restent atteignables au pouce quel que soit le nombre de liens. */}
      <div className="container-site min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
        <nav aria-label="Navigation mobile" className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="border-b border-line py-4 text-[1.6rem] font-bold tracking-[-0.03em] text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="eyebrow mt-9">Services</p>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-card border border-line bg-line">
          {services.map((service) => (
            <li key={service.slug} className="bg-surface">
              <Link
                href={`/services/${service.slug}`}
                onClick={close}
                className="flex min-h-[3.25rem] items-center gap-3 px-3.5 py-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-paper text-ink-2">
                  <ServiceIcon name={service.icon} />
                </span>
                <span className="text-[0.92rem] font-semibold text-ink">
                  {service.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-site shrink-0 border-t border-line bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <CtaButton variant="compact" className="w-full justify-center" />
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
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface shadow-e1"
      >
        <span aria-hidden="true" className="relative block h-[9px] w-[18px]">
          <span className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-ink" />
          <span className="absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-ink" />
        </span>
      </button>

      {/* Le portail n'est monté qu'après un geste de l'utilisateur : `document`
          existe forcément à ce moment, et le rendu serveur n'en voit rien. */}
      {monte && createPortal(panneau, document.body)}
    </div>
  );
}
