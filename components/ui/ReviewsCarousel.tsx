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

/** Silence à observer avant de considérer que le défilement est retombé. */
const REPOS = 140;

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
 * Pas réel d'une carte à la suivante.
 *
 * Mesuré entre deux cartes, jamais déduit de la largeur du conteneur : la
 * gouttière s'ajoute à chaque pas, et l'ignorer décale la position un peu plus
 * à chaque avance jusqu'à immobiliser la piste entre deux cartes.
 */
function pas(piste: HTMLElement): number {
  const cartes = piste.children;
  if (cartes.length > 1) {
    const a = (cartes[0] as HTMLElement).offsetLeft;
    const b = (cartes[1] as HTMLElement).offsetLeft;
    if (b > a) return b - a;
  }
  return piste.clientWidth || 1;
}

/**
 * Carrousel des avis, pour les écrans étroits.
 *
 * Les deux bandes défilantes de la version large ne tiennent pas sur un
 * téléphone : deux cartes glissent en sens inverse dans une fenêtre de 300 px,
 * on ne lit ni l'une ni l'autre. Ici une seule carte à la fois, qu'on fait
 * glisser au doigt.
 *
 * Le défilement est celui du navigateur, avec aimantation : le geste garde son
 * inertie et son rebond natifs, ce qu'aucune reprise en JavaScript n'égale. Le
 * code ne fait que lire la position pour allumer la bonne pastille, et proposer
 * une avance automatique.
 *
 * Cette avance s'efface devant l'utilisateur : tout geste lui coupe la parole
 * pour douze secondes. Elle ne démarre pas du tout si le système demande de
 * réduire les animations.
 */
export function ReviewsCarousel({ items }: { items: ReactNode[] }) {
  const [actif, setActif] = useState(0);
  const [pose, setPose] = useState(0);
  const piste = useRef<HTMLDivElement>(null);
  const repit = useRef(0);
  const calme = useReglageCalme();

  /*
   * `useCallback` n'est pas ici une optimisation : il déclare que cette
   * fonction est un gestionnaire d'évènement. Sans lui, le compilateur React
   * la lit comme du code de rendu et refuse l'appel à `Date.now`.
   */
  const aller = useCallback((i: number) => {
    const el = piste.current;
    if (!el) return;
    repit.current = Date.now() + REPIT;
    el.scrollTo({ left: i * pas(el), behavior: "smooth" });
  }, []);

  /*
   * Deux index, et c'est volontaire.
   *
   * `actif` suit le doigt : il allume la bonne pastille pendant le geste.
   * `pose` n'est mis à jour qu'une fois le défilement retombé, et c'est lui
   * seul qui commande la hauteur. Redimensionner un conteneur pendant qu'on
   * le fait défiler perturbe l'aimantation du navigateur, et la piste
   * s'immobilisait entre deux cartes.
   */
  useEffect(() => {
    const el = piste.current;
    if (!el) return;

    let repos: number | undefined;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / pas(el));
      setActif(i);
      window.clearTimeout(repos);
      repos = window.setTimeout(() => setPose(i), REPOS);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(repos);
    };
  }, []);

  /*
   * La hauteur de la piste épouse la carte posée. Les avis vont du simple au
   * double : la figer sur le plus long ouvrirait trois cents pixels de vide
   * sous les plus courts.
   *
   * La mesure passe par un `ResizeObserver`, qui se déclenche dès qu'on
   * observe : la hauteur est donc posée depuis son rappel et non depuis le
   * corps de l'effet. Il rattrape au passage le reflux des polices.
   */
  const [hauteur, setHauteur] = useState<number | undefined>(undefined);

  useEffect(() => {
    const carte = piste.current?.children[pose] as HTMLElement | undefined;
    if (!carte) return;

    const observateur = new ResizeObserver(() => setHauteur(carte.offsetHeight));
    observateur.observe(carte);
    return () => observateur.disconnect();
  }, [pose]);

  useEffect(() => {
    if (calme || items.length < 2) return;

    const minuteur = window.setInterval(() => {
      if (Date.now() < repit.current) return;
      const el = piste.current;
      if (!el) return;
      const p = pas(el);
      const suivant = (Math.round(el.scrollLeft / p) + 1) % items.length;
      el.scrollTo({ left: suivant * p, behavior: "smooth" });
    }, CADENCE);

    return () => window.clearInterval(minuteur);
  }, [calme, items.length]);

  return (
    <div>
      {/*
       * `overscroll-x-contain` empêche le geste de remonter à la page une fois
       * la dernière carte atteinte, ce qui déclencherait le retour arrière du
       * navigateur sur certains téléphones.
       *
       * `snap-start` plutôt que `snap-center` : les cartes occupent toute la
       * largeur, les deux reviennent au même, mais l'alignement au bord se
       * calcule sans ambiguïté quand une gouttière sépare les cartes.
       */}
      <div
        ref={piste}
        style={{ height: hauteur }}
        onPointerDown={() => {
          repit.current = Date.now() + REPIT;
        }}
        className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain transition-[height] duration-300 ease-site motion-reduce:transition-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((carte, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: l'ordre des avis est
            // fixe et la liste n'est ni triée ni filtrée après le rendu.
            key={i}
            className="w-full shrink-0 snap-start"
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
