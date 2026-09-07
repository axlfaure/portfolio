import type { Field, GlobalConfig } from "payload";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * En-tête de section, tel qu'il se répète sur la page d'accueil.
 *
 * Toutes les sections partagent la même forme : un surtitre, un titre dont la
 * fin passe en italique accentué, parfois une accroche. Les déclarer une par
 * une aurait produit huit variantes qui auraient divergé à la première
 * retouche ; les déclarer ici garantit que le formulaire est le même partout,
 * et qu'un changement de libellé se fait en un seul endroit.
 *
 * Le titre est coupé en deux champs parce qu'il l'est aussi à l'écran. Un
 * champ unique obligerait à saisir du balisage dans un formulaire de
 * rédaction, ce qui est le meilleur moyen de casser une page depuis l'admin.
 */
export function enTeteFields({ lead = false }: { lead?: boolean } = {}): Field[] {
  const champs: Field[] = [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      label: "Surtitre",
      admin: { description: "Le petit mot en capitales au-dessus du titre." },
    },
    {
      type: "row",
      fields: [
        {
          name: "titleStart",
          type: "text",
          required: true,
          label: "Titre, début",
          admin: { width: "50%", description: "Affiché normalement." },
        },
        {
          name: "titleAccent",
          type: "text",
          required: true,
          label: "Titre, partie accentuée",
          admin: {
            width: "50%",
            description: "Affiché en italique, dans la couleur d'accent.",
          },
        },
      ],
    },
    {
      name: "titleEnd",
      type: "text",
      label: "Titre, suite",
      admin: {
        description:
          "À remplir seulement si l'accent tombe au milieu du titre plutôt qu'à la fin. Laissé vide, le titre s'arrête sur la partie accentuée.",
      },
    },
  ];

  if (lead) {
    champs.push({
      name: "lead",
      type: "textarea",
      label: "Accroche",
      admin: { description: "Le paragraphe sous le titre. Deux à trois phrases." },
    });
  }

  return champs;
}

/**
 * Fabrique un global de section qui ne porte que son en-tête.
 *
 * Quatre sections de la page d'accueil sont dans ce cas : leur contenu vient
 * d'une collection, seuls les mots d'introduction leur appartiennent.
 */
export function sectionGlobal({
  slug,
  label,
  description,
  lead = false,
  extra = [],
}: {
  slug: string;
  label: string;
  description: string;
  lead?: boolean;
  /** Champs propres à une section, ajoutés après l'en-tête commun. */
  extra?: Field[];
}): GlobalConfig {
  return {
    slug,
    label,
    access: { read: () => true },
    admin: { group: "Textes de l'accueil", description },
    hooks: revalidateGlobal([HOME]),
    fields: [...enTeteFields({ lead }), ...extra],
  };
}
