import type { GlobalConfig } from "payload";
import { enTeteFields } from "../fields/section";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Section « Trois façons de travailler ensemble ».
 *
 * Trois colonnes de tarif, dans la forme éprouvée : nom, une ligne pour dire à
 * qui elle s'adresse, un montant en grand, un bouton, puis ce qui est compris.
 *
 * Deux règles gouvernent le contenu, et elles vont contre l'instinct.
 *
 * On ne répète pas les avantages. Une version précédente affichait les mêmes
 * neuf critères dans les trois colonnes, cochés ou barrés : la section devenait
 * un mur, et le lecteur relisait trois fois la même chose pour trouver les deux
 * lignes qui changeaient. Les colonnes suivantes reprennent donc la première
 * d'une phrase, « tout One shot, plus », et ne listent que ce qu'elles ajoutent.
 *
 * Les libellés sont des étiquettes, pas des phrases. « Devis à prix ferme »,
 * pas « Un devis à prix ferme avant de commencer ». Personne ne lit une liste
 * de tarifs, on la balaie, et une ligne qui passe sur deux lignes casse le
 * balayage.
 */
export const OffersSection: GlobalConfig = {
  slug: "offers-section",
  label: "Offres",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "Les trois formules, entre les services et « à propos ».",
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
          "Trois au maximum. La recommandée au milieu : c'est là que le regard se pose en premier.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "icon",
              type: "select",
              required: true,
              defaultValue: "doc",
              label: "Pictogramme",
              admin: { width: "25%" },
              options: [
                { label: "Document", value: "doc" },
                { label: "Échange", value: "exchange" },
                { label: "Calques", value: "layers" },
                { label: "Horloge", value: "clock" },
                { label: "Personnes", value: "users" },
                { label: "Boîte", value: "box" },
              ],
            },
            {
              name: "name",
              type: "text",
              required: true,
              label: "Nom",
              admin: { width: "40%" },
            },
            {
              name: "badge",
              type: "text",
              label: "Pastille",
              admin: {
                width: "35%",
                description: "Facultative, sur une seule des trois.",
              },
            },
          ],
        },
        {
          name: "tagline",
          type: "text",
          required: true,
          label: "À qui elle s'adresse",
          admin: {
            description:
              "UNE ligne, huit mots au plus. C'est la seule prose de la colonne, et elle répond à la seule question du lecteur : est-ce la mienne ?",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "pricePrefix",
              type: "text",
              label: "Avant le montant",
              admin: {
                width: "33%",
                description: "En petit au-dessus : « à partir de ». Facultatif.",
              },
            },
            {
              name: "price",
              type: "text",
              required: true,
              label: "Montant",
              admin: {
                width: "34%",
                description:
                  "Court, il est affiché en très grands caractères et ne doit pas passer à la ligne : « 300 € », « Sur devis ».",
              },
            },
            {
              name: "priceUnit",
              type: "text",
              label: "Unité",
              admin: {
                width: "33%",
                description: "En petit sous le montant : « la prestation ».",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "trend",
              type: "text",
              label: "Gain",
              admin: {
                width: "100%",
                description:
                  "Facultatif. Pastille à flèche montante sous le montant : « 20 % moins cher ».",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "ctaLabel",
              type: "text",
              label: "Libellé du bouton",
              admin: { width: "70%" },
            },
            {
              name: "highlight",
              type: "checkbox",
              label: "Mettre en avant",
              admin: { width: "30%", description: "Une seule des trois." },
            },
          ],
        },
        {
          name: "items",
          type: "array",
          label: "Ce que la colonne ajoute",
          labels: { singular: "Ligne", plural: "Lignes" },
          admin: {
            description:
              "Cinq ou six, pas davantage. Des étiquettes de trois à cinq mots, jamais des phrases : au-delà, la ligne passe sur deux niveaux et la liste cesse de se balayer. Sur les colonnes suivantes, ouvrir par « Tout One shot » plutôt que de répéter les mêmes avantages.",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              label: "Libellé",
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
          "Sous les colonnes. C'est là qu'on répond à l'objection que trois offres laissent entière : « je ne sais pas laquelle est la mienne ».",
      },
    },
  ],
};
