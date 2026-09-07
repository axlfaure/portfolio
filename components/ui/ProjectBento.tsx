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
/*
 * Les classes sont écrites en entier, jamais composées : Tailwind lit le code
 * source pour savoir quelles règles produire, et ne verrait pas une classe
 * assemblée à l'exécution.
 *
 * Sous 48rem, le bento se réduit à son premier visuel, sur toute la largeur.
 * À quatre cellules dans une carte de 297 px, la plus étroite tombe à 113 px :
 * une maquette de brochure y est illisible quelle que soit sa définition. Le
 * bento est une composition d'écran large, pas une grille universelle.
 */
const LAYOUTS: Record<number, string[]> = {
  1: ["col-span-5"],
  2: ["col-span-5 md:col-span-2", "hidden md:block md:col-span-3"],
  3: [
    "col-span-5 md:col-span-3",
    "hidden md:block md:col-span-2",
    "hidden md:block md:col-span-5",
  ],
  4: [
    "col-span-5 md:col-span-2",
    "hidden md:block md:col-span-3",
    "hidden md:block md:col-span-3",
    "hidden md:block md:col-span-2",
  ],
};

/** Part de la largeur du bento, une fois passé le palier des 48rem. */
const PARTS_LARGES: Record<number, number[]> = {
  1: [1],
  2: [0.4, 0.6],
  3: [0.6, 0.4, 1],
  4: [0.4, 0.6, 0.6, 0.4],
};

/**
 * Largeur réelle du bento, par palier.
 *
 * Mesurée sur la maquette, pas estimée : 508 px dans une carte projet sur un
 * écran de 1425, d'où les 32rem. Une version précédente déclarait 18rem, soit
 * 288 px, et le navigateur servait alors une image de 384 px dans une cellule
 * qui en réclamait 1016 sur un écran retina.
 */
/**
 * Marge pour le recadrage.
 *
 * `sizes` décrit la largeur de la case, mais `object-cover` agrandit l'image
 * jusqu'à la remplir avant de la rogner. Une source en 16/9 posée dans une case
 * presque carrée doit être agrandie de près de 90 % : le navigateur, lui,
 * n'aura choisi qu'une image à la largeur de la case, et c'est cet
 * agrandissement qui se voit.
 *
 * Le facteur couvre le pire cas réaliste, une source panoramique dans la case
 * la plus étroite. Il coûte des octets, et c'est un arbitrage assumé : ces
 * visuels sont le produit, pas la décoration.
 */
const MARGE_RECADRAGE = 2;

const CONTENEUR = [
  { condition: "(min-width: 56rem)", largeur: "32rem" },
  { condition: "(min-width: 48rem)", largeur: "46vw" },
  { condition: null, largeur: "80vw" },
];

/**
 * Construit le `sizes` d'une cellule.
 *
 * C'est le cœur de la netteté : `sizes` sert au navigateur à choisir dans le
 * jeu de sources, et une valeur trop basse lui fait retenir une image trop
 * petite, qu'il étire ensuite sans rien dire.
 *
 * La part ne vaut que pour les paliers où le bento est déployé. Sous 48rem il
 * n'y a plus qu'une cellule, qui occupe toute la largeur.
 */
function sizesPour(part: number): string {
  return CONTENEUR.map(({ condition, largeur }) => {
    const p = (condition ? part : 1) * MARGE_RECADRAGE;
    return condition
      ? `${condition} calc(${largeur} * ${p})`
      : `calc(${largeur} * ${p})`;
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
        shown.length > 2 ? "grid-rows-1 md:grid-rows-2" : "grid-rows-1",
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
            sizes={sizesPour((PARTS_LARGES[shown.length] ?? PARTS_LARGES[4])[i] ?? 1)}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
