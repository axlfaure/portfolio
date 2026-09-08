import type { ReactNode } from "react";

/**
 * Étiquette de comparaison, temporaire.
 *
 * Sert à distinguer deux versions d'une même section pendant qu'on choisit.
 * Ce fichier et ses appels disparaissent une fois la décision prise.
 */
export function Etiquette({ children }: { children: ReactNode }) {
  return (
    <div className="container-site pt-[clamp(2.5rem,5vw,3.5rem)]">
      <p className="eyebrow text-accent">{children}</p>
    </div>
  );
}
