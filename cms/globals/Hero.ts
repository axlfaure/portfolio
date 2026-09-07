import type { GlobalConfig } from "payload";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Haut de la page d'accueil.
 *
 * Le titre est un tableau de lignes plutôt qu'un champ de texte : chacune est
 * animée séparément, et l'accent y est souligné d'un trait tracé au
 * chargement. Une ligne se découpe en trois morceaux, le mot accentué pouvant
 * tomber au milieu comme à la fin.
 *
 * Deux lignes au maximum. Au-delà, le titre passe sous la ligne de flottaison
 * sur un téléphone, et l'appel à l'action avec lui.
 */
export const Hero: GlobalConfig = {
  slug: "hero",
  label: "Hero",
  access: { read: () => true },
  admin: {
    group: "Page d'accueil",
    description: "Le premier écran : titre, accroche, chiffres, boutons.",
  },
  hooks: revalidateGlobal([HOME]),
  fields: [
    {
      name: "lines",
      type: "array",
      label: "Titre",
      minRows: 1,
      maxRows: 2,
      labels: { singular: "Ligne", plural: "Lignes" },
      admin: {
        description:
          "Une entrée par ligne du titre. Deux au maximum : une troisième pousserait le bouton sous la ligne de flottaison sur téléphone.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "before", type: "text", label: "Avant l'accent", admin: { width: "33%" } },
            {
              name: "accent",
              type: "text",
              required: true,
              label: "Accent",
              admin: { width: "34%", description: "Souligné d'un trait tracé." },
            },
            { name: "after", type: "text", label: "Après l'accent", admin: { width: "33%" } },
          ],
        },
      ],
    },
    {
      name: "lead",
      type: "textarea",
      required: true,
      label: "Accroche",
      admin: { description: "Le paragraphe sous le titre. Deux à trois phrases." },
    },
    {
      type: "row",
      fields: [
        {
          name: "linkLabel",
          type: "text",
          required: true,
          defaultValue: "Voir les réalisations",
          label: "Lien secondaire",
          admin: { width: "50%" },
        },
        {
          name: "linkHref",
          type: "text",
          required: true,
          defaultValue: "/projets",
          label: "Destination",
          admin: { width: "50%", description: "Un chemin du site, comme /projets." },
        },
      ],
    },
    {
      name: "socialProof",
      type: "group",
      label: "Preuve sociale",
      admin: { description: "La ligne sous les visages, au-dessus du titre." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "strong",
              type: "text",
              required: true,
              label: "En gras",
              admin: { width: "35%" },
            },
            {
              name: "rest",
              type: "text",
              required: true,
              label: "Suite",
              admin: { width: "65%" },
            },
          ],
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Chiffres",
      maxRows: 4,
      labels: { singular: "Chiffre", plural: "Chiffres" },
      admin: {
        description:
          "Quatre au maximum : ils tiennent sur une rangée. Ces chiffres sont des affirmations publiques, ils doivent pouvoir être justifiés si un prospect les relève.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", required: true, label: "Valeur", admin: { width: "35%" } },
            { name: "label", type: "text", required: true, label: "Précision", admin: { width: "65%" } },
          ],
        },
      ],
    },
  ],
};
