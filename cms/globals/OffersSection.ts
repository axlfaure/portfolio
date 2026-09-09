import type { GlobalConfig } from "payload";
import { enTeteFields } from "../fields/section";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Section « Deux façons de travailler ensemble ».
 *
 * Elle expose les deux offres, Substrat au projet et Circuit sur l'année. Son
 * contenu vit ici et non dans le code parce que c'est la partie du site qui
 * bougera le plus : un tarif, une clause, un engagement de délai se retouchent
 * après un rendez-vous, pas après un déploiement.
 *
 * Deux offres au maximum : la mise en page est une grille de deux colonnes, et
 * une troisième carte s'écraserait sans que rien ne prévienne. Le jour où il en
 * faudra une de plus, c'est la grille qu'il faudra reprendre d'abord.
 */
export const OffersSection: GlobalConfig = {
  slug: "offers-section",
  label: "Offres",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "Les deux façons de travailler ensemble, entre les services et « à propos ».",
  },
  hooks: revalidateGlobal([HOME]),
  fields: [
    ...enTeteFields({ lead: true }),
    {
      name: "offers",
      type: "array",
      label: "Offres",
      minRows: 1,
      maxRows: 2,
      labels: { singular: "Offre", plural: "Offres" },
      admin: {
        description:
          "Deux au maximum. L'ordre est celui de l'affichage : la plus engageante en second, c'est là que le regard finit.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Nom",
              admin: { width: "40%", description: "Substrat, Circuit." },
            },
            {
              name: "kicker",
              type: "text",
              required: true,
              label: "Sous-titre",
              admin: { width: "30%", description: "« Au projet », « Sur l'année »." },
            },
            {
              name: "badge",
              type: "text",
              label: "Pastille",
              admin: {
                width: "30%",
                description: "Facultative. Trois mots au plus, sinon elle passe à la ligne.",
              },
            },
          ],
        },
        {
          name: "pitch",
          type: "textarea",
          required: true,
          label: "Promesse",
          admin: {
            description:
              "Deux phrases, pas plus. Les deux offres se lisent côte à côte : une promesse deux fois plus longue que l'autre décale toute la carte et rend la comparaison impossible.",
          },
        },
        {
          name: "terms",
          type: "text",
          label: "Repère d'engagement",
          admin: {
            description:
              "La pastille sous la promesse. Ce qu'on achète, en quatre mots : « Sur devis, à prix ferme », « Budget annuel, grille figée douze mois ».",
          },
        },
        {
          name: "forWho",
          type: "textarea",
          label: "Pour qui",
          admin: {
            description:
              "Encadré, à mi-carte. C'est la ligne qui fait le travail : devant deux offres, la seule question du lecteur est de savoir laquelle est la sienne.",
          },
        },
        {
          name: "highlight",
          type: "checkbox",
          label: "Mettre en avant",
          admin: {
            description:
              "Pose la carte sur fond blanc avec une ombre et un filet d'accent. À ne cocher que sur une seule des deux : deux cartes mises en avant, c'est aucune.",
          },
        },
        {
          name: "items",
          type: "array",
          label: "Ce que je propose",
          labels: { singular: "Ligne", plural: "Lignes" },
          admin: {
            description:
              "L'amorce est en gras, la suite en gris. Mettre l'information dans l'amorce : c'est la seule partie qu'on lit en diagonale.",
          },
          fields: [
            {
              name: "lead",
              type: "text",
              required: true,
              label: "Amorce en gras",
            },
            {
              name: "text",
              type: "textarea",
              label: "Suite",
              admin: { description: "Facultative. Ce qui précise l'amorce." },
            },
          ],
        },
        {
          name: "ctaLabel",
          type: "text",
          label: "Libellé du bouton",
          admin: {
            description:
              "Le bouton ouvre l'agenda, comme partout ailleurs sur le site. Laissé vide, il n'y a pas de bouton sur cette carte.",
          },
        },
      ],
    },
  ],
};
