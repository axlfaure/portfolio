"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Side = {
  src: string;
  /** Libellé du badge posé sur l'image. */
  label: string;
  /** Description lue par les lecteurs d'écran. */
  alt: string;
};

/**
 * Comparateur avant / après à séparation glissante.
 *
 * EN RÉSERVE — écrit pour la section « Le contexte », mis de côté le temps
 * de trancher la question de confidentialité du visuel client. Prêt à
 * l'emploi : deux images de même cadrage, et il fonctionne. Les fichiers
 * préparés attendent dans `assets/comparatif/`, volontairement hors de
 * `public/` — tout ce qui s'y trouve est servi publiquement, même sans lien.
 *
 * La poignée est un `<input type="range">` étendu à toute la surface : on
 * récupère ainsi le glisser à la souris, le tactile, le clavier (flèches,
 * Origine, Fin) et l'annonce aux lecteurs d'écran sans réimplémenter quoi
 * que ce soit. Le curseur natif est masqué, seul le trait dessiné se voit.
 *
 * L'image « après » occupe tout le cadre ; l'image « avant » est posée par
 * dessus et rognée en `clip-path`, ce qui reste composité pendant le glissé.
 */
export function BeforeAfter({
  before,
  after,
  ratio = "3 / 2",
  className,
  sizes = "(min-width: 64rem) 44rem, 92vw",
}: {
  before: Side;
  after: Side;
  ratio?: string;
  className?: string;
  sizes?: string;
}) {
  const [pos, setPos] = useState(52);
  const id = useId();
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <figure className={cn("group/ba", className)}>
      <div
        ref={frameRef}
        className="relative select-none overflow-hidden rounded-project border border-line bg-sunk"
        style={{ aspectRatio: ratio }}
      >
        {/* Après : le fond, toujours entier. */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={false}
        />

        {/* Avant : posé dessus, rogné à la position de la séparation. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>

        {/* Séparation et poignée, purement décoratives : la commande réelle
            est le champ ci-dessous. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(16,17,20,0.18)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface shadow-e2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink"
            >
              <path d="m9.5 8-4 4 4 4M14.5 8l4 4-4 4" />
            </svg>
          </span>
        </div>

        {/* Badges : celui de gauche disparaît quand la séparation le dépasse,
            sinon il flotterait au-dessus de l'image qu'il ne désigne plus. */}
        <span
          className={cn(
            "pointer-events-none absolute left-3 top-3 rounded-full border border-line bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink backdrop-blur-[6px] transition-opacity duration-200",
            pos < 22 && "opacity-0",
          )}
        >
          {before.label}
        </span>
        <span
          className={cn(
            "pointer-events-none absolute right-3 top-3 rounded-full border border-line bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink backdrop-blur-[6px] transition-opacity duration-200",
            pos > 78 && "opacity-0",
          )}
        >
          {after.label}
        </span>

        <label htmlFor={id} className="sr-only">
          Comparer les deux versions du visuel
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${Math.round(pos)} % de la version « ${before.label} » visible`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      <figcaption className="mt-4 flex items-start gap-2.5 text-[0.85rem] leading-snug text-label">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-px shrink-0"
        >
          <path d="M8 5 4 12l4 7M16 5l4 7-4 7" />
        </svg>
        Faites glisser la séparation pour comparer.
      </figcaption>
    </figure>
  );
}
