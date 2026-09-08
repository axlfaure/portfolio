import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Éléments d'une passe. Ils sont dupliqués pour boucler. */
  items: ReactNode[];
  /** Durée d'un cycle complet, en secondes. */
  duration?: number;
  /** Espacement vertical entre les cartes, en rem. */
  gap?: number;
  /** Défile vers le bas au lieu du haut. */
  reverse?: boolean;
  /** Colonne purement décorative : son contenu est déjà lu ailleurs. */
  decorative?: boolean;
  className?: string;
};

/**
 * Colonne défilante verticale, en CSS pur.
 *
 * Le pendant vertical de `Ticker`, et non une option de celui-ci : les deux ne
 * partagent que l'idée de boucle. L'un contraint la hauteur de ses éléments et
 * laisse courir leur largeur, l'autre fait l'inverse — c'est précisément ce
 * qu'on vient chercher ici. Une carte d'avis prend la hauteur de sa citation,
 * qui va du simple au quadruple, et la colonne s'arrange du reste.
 *
 * Le second jeu est un doublon d'affichage. Quand la colonne n'est pas la
 * première, tout son contenu l'est : les mêmes avis y reviennent dans un autre
 * ordre, et personne n'a envie de les entendre trois fois.
 */
export function TickerColumn({
  items,
  duration = 50,
  gap = 1.25,
  reverse = false,
  decorative = false,
  className,
}: Props) {
  return (
    <div
      className={cn("ticker-col", className)}
      style={
        {
          "--ticker-duration": `${duration}s`,
          "--ticker-gap": `${gap}rem`,
        } as React.CSSProperties
      }
      {...(decorative ? { "aria-hidden": true, inert: true } : {})}
    >
      <div
        className={cn(
          "ticker-col-track",
          reverse && "ticker-col-track--reverse",
        )}
      >
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: la liste est fixe et
          // n'est ni triée ni filtrée après le rendu.
          <div key={`a-${i}`}>{item}</div>
        ))}
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: même raison.
          <div key={`b-${i}`} aria-hidden="true" inert>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
