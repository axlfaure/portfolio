"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/cn";

/** Cadence de l'avance automatique. */
const CADENCE = 5200;

/** Répit accordé après un geste, avant que l'avance reprenne la main. */
const REPIT = 12000;

const REQUETE = "(prefers-reduced-motion: reduce)";

/**
 * Le réglage système « réduire les animations », lu comme une source externe.
 * Un `setState` posé dans un effet déclencherait un rendu en cascade.
 */
function useReglageCalme(): boolean {
  return useSyncExternalStore(
    (surChangement) => {
      const media = window.matchMedia(REQUETE);
      media.addEventListener("change", surChangement);
      return () => media.removeEventListener("change", surChangement);
    },
    () => window.matchMedia(REQUETE).matches,
    () => false,
  );
}

/**
 * Carrousel des avis, pour les écrans étroits.
 *
 * Les deux bandes défilantes de la version large ne tiennent pas sur un
 * téléphone : deux cartes glissent en sens inverse dans une fenêtre de 300 px,
 * on ne lit ni l'une ni l'autre. Ici une seule carte à la fois, qu'on fait
 * glisser au doigt.
 *
 * Le défilement est celui du navigateur, avec accroche : le geste garde son
 * inertie, sa vitesse et son rebond natifs, ce qu'aucune reprise en JavaScript
 * n'égale. Le code ne fait que lire la position pour allumer la bonne pastille,
 * et proposer une avance automatique.
 *
 * Cette avance s'efface devant l'utilisateur : tout geste lui coupe la parole
 * pour douze secondes. Rien n'est plus agaçant qu'un carrousel qui reprend la
 * main au milieu d'une lecture. Elle ne démarre pas du tout si le système
 * demande de réduire les animations.
 */
export function ReviewsCarousel({ items }: { items: ReactNode[] }) {
  const [actif, setActif] = useState(0);
  const [hauteur, setHauteur] = useState<number | undefined>(undefined);
  const piste = useRef<HTMLDivElement>(null);
  const repit = useRef(0);
  const calme = useReglageCalme();

  /*
   * `useCallback` n'est pas ici une optimisation : il déclare que cette
   * fonction est un gestionnaire d'évènement. Sans lui, le compilateur React
   * la lit comme du code de rendu et refuse l'appel à `Date.now`, qui n'y
   * aurait effectivement rien à faire.
   */
  const aller = useCallback((i: number) => {
    const el = piste.current;
    if (!el) return;
    repit.current = Date.now() + REPIT;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;

    const onScroll = () => {
      if (el.clientWidth === 0) return;
      setActif(Math.round(el.scrollLeft / el.clientWidth));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * La piste épouse la hauteur de la carte affichée.
   *
   * Les avis vont du simple au double : figer la hauteur sur le plus long
   * ouvrirait trois cents pixels de vide sous les plus courts. La transition
   * rend le changement lisible plutôt que brutal.
   *
   * La mesure passe par un `ResizeObserver`, qui se déclenche dès qu'on
   * observe : la hauteur est donc posée depuis son rappel et non depuis le
   * corps de l'effet, où un `setState` provoquerait un rendu en cascade. Il
   * rattrape au passage le reflux des polices, qui change la hauteur du texte
   * après le premier rendu.
   */
  useEffect(() => {
    const carte = piste.current?.children[actif] as HTMLElement | undefined;
    if (!carte) return;

    const observateur = new ResizeObserver(() => setHauteur(carte.offsetHeight));
    observateur.observe(carte);
    return () => observateur.disconnect();
  }, [actif]);

  useEffect(() => {
    if (calme || items.length < 2) return;

    const minuteur = window.setInterval(() => {
      if (Date.now() < repit.current) return;
      const el = piste.current;
      if (!el || el.clientWidth === 0) return;
      const suivant =
        (Math.round(el.scrollLeft / el.clientWidth) + 1) % items.length;
      el.scrollTo({ left: suivant * el.clientWidth, behavior: "smooth" });
    }, CADENCE);

    return () => window.clearInterval(minuteur);
  }, [calme, items.length]);

  return (
    <div>
      {/*
       * `overscroll-x-contain` empêche le geste de remonter à la page une fois
       * la dernière carte atteinte, ce qui déclencherait le retour arrière du
       * navigateur sur certains téléphones.
       */}
      <div
        ref={piste}
        style={{ height: hauteur }}
        onPointerDown={() => {
          repit.current = Date.now() + REPIT;
        }}
        /* `items-start` : sans lui les cartes s'étirent sur la hauteur de la
           plus longue, et un grand vide s'ouvre sous les citations courtes. */
        className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain transition-[height] duration-400 ease-site motion-reduce:transition-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((carte, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: l'ordre des avis est
            // fixe et la liste n'est ni triée ni filtrée après le rendu.
            key={i}
            className="w-full shrink-0 snap-center"
          >
            {carte}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2.5">
        {items.map((_, i) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: même raison.
            key={i}
            type="button"
            onClick={() => aller(i)}
            aria-label={`Avis ${i + 1} sur ${items.length}`}
            aria-current={i === actif}
            /* Cible de 24 px au doigt pour une pastille de 7 : le point visible
               n'a pas à dicter la surface touchable. */
            className="grid h-6 w-6 place-items-center"
          >
            <span
              className={cn(
                "block h-[7px] rounded-full transition-[width,background-color] duration-300 ease-site motion-reduce:transition-none",
                i === actif ? "w-5 bg-ink" : "w-[7px] bg-line-2",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
