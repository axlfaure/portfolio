"use client";

import type { ReactNode } from "react";
import { openCalendly } from "@/lib/calendly";
import { cn } from "@/lib/cn";
import { availability } from "@/lib/site";
import { Dot } from "./Dot";

type Props = {
  /**
   * "full" = pilule avec portrait et deux lignes. "compact" = texte seul (nav).
   * "link" = lien souligné, pour une action secondaire isolée.
   * "solid" et "outline" = les deux poids d'un comparatif. Les colonnes non
   * recommandées gardent un vrai bouton plutôt qu'un lien, sans quoi deux
   * offres parfaitement valables passeraient pour des seconds choix ; la
   * hiérarchie se joue entre le plein et le contour.
   *
   * "inverse" = la même, en clair sur une carte sombre.
   *
   * Ces trois-là portent une flèche et non la pastille de disponibilité : dans
   * une colonne de tarif, un point vert se lit comme une marque de plus dans
   * la liste juste au-dessous, ce qu'il n'est pas.
   */
  variant?: "full" | "compact" | "link" | "solid" | "outline" | "inverse";
  /** Portrait d'Axel, injecté depuis un composant serveur. */
  avatar?: ReactNode;
  /** Libellé de la variante compacte. Le défaut convient partout ailleurs. */
  label?: string;
  className?: string;
};

/**
 * Bouton signature du site. Unique appel à l'action, présent dans le hero,
 * la navigation et la carte CTA finale.
 */
export function CtaButton({
  variant = "full",
  avatar,
  label = "Parlons de votre projet",
  className,
}: Props) {
  const base =
    "cta group inline-flex items-center rounded-full border border-line bg-surface " +
    "shadow-e1 hover:border-line-2 hover:shadow-e2";

  if (variant === "solid" || variant === "outline" || variant === "inverse") {
    return (
      <button
        type="button"
        onClick={openCalendly}
        className={cn(
          "group inline-flex h-11 items-center justify-center gap-2.5 rounded-full",
          "px-5 text-[0.875rem] font-semibold shadow-e1",
          "transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-e2",
          variant === "solid" && "bg-ink text-white hover:bg-ink-2",
          variant === "outline" &&
            "border border-line bg-surface text-ink hover:border-line-2",
          variant === "inverse" && "bg-white text-ink hover:bg-white/90",
          className,
        )}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 transition-transform duration-200 ease-site group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={openCalendly}
        /* py-3 et non py-1 : le lien reste une cible tactile, et 44 px est le
           minimum sous lequel un doigt manque sa cible une fois sur trois. */
        className={cn(
          "group inline-flex items-center gap-2 py-3 text-[0.9rem] font-semibold text-ink",
          "underline decoration-line-2 decoration-1 underline-offset-[6px]",
          "transition-colors duration-200 hover:decoration-ink",
          className,
        )}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 transition-transform duration-200 ease-site group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={openCalendly}
        className={cn(base, "h-11 gap-2.5 pl-4 pr-5", className)}
      >
        <Dot />
        <span className="text-[0.875rem] font-semibold text-ink">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCalendly}
      className={cn(base, "h-[4.25rem] gap-4 pl-2.5 pr-8 text-left", className)}
    >
      <span className="cta-avatar inline-flex shrink-0">{avatar}</span>
      <span className="flex flex-col leading-tight">
        <span className="cta-label block text-[1rem] font-bold text-ink">
          Parlons de votre projet
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[0.85rem] text-muted">
          <Dot />
          {availability.cta}
        </span>
      </span>
    </button>
  );
}
