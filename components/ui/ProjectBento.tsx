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

/**
 * Part de la largeur du bento occupée par une cellule, gouttières comprises.
 *
 * C'est le cœur de la netteté. `sizes` sert au navigateur à choisir dans le
 * jeu de sources : une valeur trop basse et il retient une image trop petite,
 * qu'il étire ensuite sans rien dire. Une seule valeur pour toutes les
 * cellules ne peut pas convenir, puisqu'elles vont du simple au double.
 */
const PARTS: Record<string, number> = {
  "col-span-5": 1,
  "col-span-3": 0.6,
  "col-span-2": 0.4,
};

/**
 * Largeur réelle du bento, par palier.
 *
 * Mesurée sur la maquette, pas estimée : 508 px dans une carte projet sur un
 * écran de 1425, d'où les 32rem. Une version précédente déclarait 18rem, soit
 * 288 px, et le navigateur servait alors une image de 384 px dans une cellule
 * qui en réclamait 1016 sur un écran retina.
 */
const CONTENEUR = [
  { condition: "(min-width: 56rem)", largeur: "32rem" },
  { condition: "(min-width: 48rem)", largeur: "46vw" },
  { condition: null, largeur: "80vw" },
];

/** Construit le `sizes` d'une cellule à partir de sa part du bento. */
function sizesPour(part: number): string {
  return CONTENEUR.map(({ condition, largeur }) => {
    const valeur = part === 1 ? largeur : `calc(${largeur} * ${part})`;
    return condition ? `${condition} ${valeur}` : valeur;
  }).join(", ");
}

export function ProjectBento({
  panels,
  alt,
  className,
}: {
  panels: string[];
  /** Décrit l'ensemble ; les cellules sont décoratives et restent muettes. */
  alt: string;
  className?: string;
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
          {/* Qualité 90 : ce sont des maquettes, avec du texte fin et des
              aplats que la compression par défaut marque visiblement. */}
          <Image
            src={src}
            alt=""
            fill
            quality={90}
            sizes={sizesPour(PARTS[spans[i]] ?? 1)}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
