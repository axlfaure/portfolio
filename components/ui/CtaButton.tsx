"use client";

import type { ReactNode } from "react";
import { openCalendly } from "@/lib/calendly";
import { cn } from "@/lib/cn";
import { availability } from "@/lib/site";
import { Dot } from "./Dot";

type Props = {
  /** "full" = pilule avec portrait et deux lignes. "compact" = texte seul (nav). */
  variant?: "full" | "compact";
  /** Portrait d'Axel, injecté depuis un composant serveur. */
  avatar?: ReactNode;
  className?: string;
};

/**
 * Bouton signature du site. Unique appel à l'action, présent dans le hero,
 * la navigation et la carte CTA finale.
 */
export function CtaButton({ variant = "full", avatar, className }: Props) {
  const base =
    "cta group inline-flex items-center rounded-full border border-line bg-surface " +
    "shadow-e1 hover:border-line-2 hover:shadow-e2";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={openCalendly}
        className={cn(base, "h-11 gap-2.5 pl-4 pr-5", className)}
      >
        <Dot />
        <span className="text-[0.875rem] font-semibold text-ink">
          Parlons de votre projet
        </span>
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
          {availability.label}
        </span>
      </span>
    </button>
  );
}
