import type { ReactNode } from "react";

/**
 * Titre qui monte derrière un masque quand sa section entre dans le champ.
 * Le masque et le déclencheur vivent dans globals.css : ce composant ne fait
 * que poser les deux niveaux dont l'effet a besoin — le cadre qui rogne, et
 * la ligne qui se déplace à l'intérieur.
 *
 * Doit se trouver dans un conteneur portant `data-reveal`.
 */
export function Rise({ children }: { children: ReactNode }) {
  return (
    <span className="rise">
      <span>{children}</span>
    </span>
  );
}
