import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Éléments d'une passe. Ils sont dupliqués pour la boucle. */
  items: ReactNode[];
  /** Durée d'un cycle complet, en secondes. */
  duration?: number;
  /** Espacement entre les éléments, en rem. */
  gap?: number;
  className?: string;
};

/**
 * Ticker horizontal infini, pur CSS.
 * Le second jeu est masqué aux lecteurs d'écran, la lecture se met
 * en pause au survol et au focus clavier.
 */
export function Ticker({ items, duration = 40, gap = 2.5, className }: Props) {
  return (
    <div
      className={cn("ticker overflow-hidden", className)}
      style={
        {
          "--ticker-duration": `${duration}s`,
          "--ticker-gap": `${gap}rem`,
        } as React.CSSProperties
      }
    >
      <div className="ticker-track">
        {items.map((item, i) => (
          <div key={`a-${i}`} className="shrink-0">
            {item}
          </div>
        ))}
        {items.map((item, i) => (
          <div key={`b-${i}`} className="shrink-0" aria-hidden="true" inert>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
