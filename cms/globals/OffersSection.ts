import type { GlobalConfig } from "payload";
import { enTeteFields } from "../fields/section";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Section « Trois façons de travailler ensemble ».
 *
 * Un comparatif, pas trois argumentaires. La différence n'est pas cosmétique :
 * une comparaison ne fonctionne que si les colonnes présentent les MÊMES
 * critères, chacune disant lesquels elle comprend. Trois listes de contenus
 * différents, si bien écrites soient-elles, ne se comparent pas : elles se
 * lisent l'une après l'autre, et le lecteur repart sans avoir choisi.
 *
 * D'où la forme du formulaire. Les critères ne sont pas rangés dans chaque
 * offre, ce qui obligerait à recopier les mêmes libellés trois fois et
 * garantirait qu'ils finissent par diverger. Ils sont saisis une seule fois,
 * avec trois cases à cocher : le tableau s'édite comme un tableau. Les cases
 * suivent l'ordre des offres déclarées au-dessus.
 */
export const OffersSection: GlobalConfig = {
  slug: "offers-section",
  label: "Offres",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "Le comparatif des offres, entre les services et « à propos ».",
  },
  hooks: revalidateGlobal([HOME]),
  fields: [
    ...enTeteFields({ lead: true }),
    {
      name: "offers",
      type: "array",
      label: "Colonnes",
      minRows: 1,
      maxRows: 3,
      labels: { singular: "Offre", plural: "Offres" },
      admin: {
        description:
          "Trois au maximum : au-delà, les colonnes deviennent trop étroites pour que les critères restent lisibles. Placer la recommandée au milieu, c'est là que le regard se pose en premier.",
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
              admin: { width: "50%" },
            },
            {
              name: "badge",
              type: "text",
              label: "Pastille",
              admin: {
                width: "50%",
                description: "Facultative. Deux mots, sur une seule des trois.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "anchor",
              type: "text",
              required: true,
              label: "Repère",
              admin: {
                width: "40%",
                description:
                  "Le grand mot de la colonne : « 1 projet », « 12 mois », « Sur mesure ». L'unité qu'on achète, pas un prix.",
              },
            },
            {
              name: "anchorNote",
              type: "text",
              label: "Précision sous le repère",
              admin: {
                width: "60%",
                description: "Quatre mots, par exemple « livré en deux semaines ».",
              },
            },
          ],
        },
        {
          name: "pitch",
          type: "textarea",
          required: true,
          label: "À qui elle s'adresse",
          admin: {
            description:
              "Une phrase, deux au plus. C'est la seule prose de la colonne : devant trois offres, la question du lecteur est de savoir laquelle est la sienne, pas de lire un argumentaire.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "ctaLabel",
              type: "text",
              label: "Libellé du bouton",
              admin: {
                width: "70%",
                description:
                  "Le bouton ouvre l'agenda. Laissé vide, la colonne n'a pas de bouton.",
              },
            },
            {
              name: "highlight",
              type: "checkbox",
              label: "Mettre en avant",
              admin: {
                width: "30%",
                description: "Une seule des trois.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "features",
      type: "array",
      label: "Critères comparés",
      labels: { singular: "Critère", plural: "Critères" },
      admin: {
        description:
          "Une ligne par critère, cochée pour les colonnes qui la comprennent. Les cases suivent l'ordre des offres déclarées au-dessus. Ranger les critères communs aux trois en premier : le lecteur voit d'abord ce qu'il obtient dans tous les cas, puis ce qui distingue.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Critère",
          admin: { description: "Court. Il doit tenir sur une ou deux lignes en colonne étroite." },
        },
        {
          type: "row",
          fields: [
            {
              name: "in1",
              type: "checkbox",
              label: "1re colonne",
              admin: { width: "33%" },
            },
            {
              name: "in2",
              type: "checkbox",
              label: "2e colonne",
              admin: { width: "33%" },
            },
            {
              name: "in3",
              type: "checkbox",
              label: "3e colonne",
              admin: { width: "33%" },
            },
          ],
        },
      ],
    },
    {
      name: "footnote",
      type: "textarea",
      label: "Ligne de fin",
      admin: {
        description:
          "Sous le tableau. C'est là qu'on répond à l'objection que le tableau laisse entière : « je ne sais pas laquelle est la mienne ».",
      },
    },
  ],
};
