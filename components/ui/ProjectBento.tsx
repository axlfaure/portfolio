import Image from "next/image";
import { cn } from "@/lib/cn";
import { hasAsset } from "./Media";

/**
 * Grille bento des visuels d'un projet.
 *
 * Montée en CSS plutôt qu'aplatie dans un seul PNG : chaque panneau est servi à
 * la taille réellement affichée, la composition se recompose au lieu d'être
 * recadrée, et les arrondis suivent les jetons du site. Un mockup unique de
 * 6 Mo devenait par ailleurs illisible dès qu'un cadre changeait de ratio.
 *
 * Le conteneur tient un 4/3, celui de l'emplacement dans les cartes projet.
 * Cinq colonnes plutôt que deux : c'est ce qui permet des cellules de largeurs
 * inégales, alternées d'une rangée à l'autre. Une grille 2×2 régulière n'est
 * pas un bento, c'est un damier.
 *
 * Les ratios qui en découlent, gouttières comprises, guident le choix des
 * visuels : une cellule sur trois colonnes fait environ 1,6 (paysage franc),
 * une cellule sur deux colonnes environ 1,07 (presque carré), et la cellule
 * pleine largeur environ 2,7 (bandeau, pour une double page).
 */
const LAYOUTS: Record<number, string[]> = {
  1: ["col-span-5"],
  2: ["col-span-2", "col-span-3"],
  3: ["col-span-3", "col-span-2", "col-span-5"],
  4: ["col-span-2", "col-span-3", "col-span-3", "col-span-2"],
};

export function ProjectBento({
  panels,
  alt,
  className,
  sizes = "(min-width: 56rem) 18rem, 46vw",
}: {
  panels: string[];
  /** Décrit l'ensemble ; les cellules sont décoratives et restent muettes. */
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const ready = panels.filter((src) => hasAsset(src));
  if (ready.length === 0) return null;

  const shown = ready.slice(0, 4);
  const spans = LAYOUTS[shown.length] ?? LAYOUTS[4];

  return (
    <div
      className={cn(
        "grid aspect-[4/3] w-full grid-cols-5 gap-2.5",
        shown.length > 2 ? "grid-rows-2" : "grid-rows-1",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      {shown.map((src, i) => (
        <div
          key={src}
          className={cn(
            "relative overflow-hidden rounded-[10px] bg-sunk",
            spans[i],
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
