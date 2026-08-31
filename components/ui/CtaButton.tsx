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
    "group inline-flex items-center rounded-full border border-line bg-surface shadow-e1 " +
    "transition-[transform,box-shadow] duration-200 ease-site " +
    "hover:-translate-y-0.5 hover:shadow-e2 active:translate-y-0";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={openCalendly}
        className={cn(base, "gap-2 py-2 pl-3.5 pr-4", className)}
      >
        <Dot />
        <span className="text-[0.85rem] font-semibold text-ink">
          Parlons de votre projet
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCalendly}
      className={cn(base, "h-14 gap-3 pl-2 pr-6 text-left", className)}
    >
      {avatar}
      <span className="flex flex-col leading-tight">
        <span className="text-[0.95rem] font-bold text-ink">
          Parlons de votre projet
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[0.8rem] text-muted">
          <Dot />
          {availability.label}
        </span>
      </span>
    </button>
  );
}
