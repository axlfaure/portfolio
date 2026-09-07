import type { GlobalConfig } from "payload";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Section « À propos » de la page d'accueil.
 *
 * Un global et non une collection : il n'y en a qu'une, et une collection à
 * document unique oblige à traverser une liste d'un élément pour l'atteindre.
 *
 * Le titre est coupé en deux champs parce qu'il l'est aussi à l'écran : la
 * seconde moitié passe en italique accentué. Un seul champ obligerait à saisir
 * du balisage, ce qui n'a rien à faire dans un formulaire de rédaction.
 */
export const About: GlobalConfig = {
  slug: "about",
  label: "À propos",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "Le bloc portrait de la page d'accueil.",
  },
  hooks: revalidateGlobal([HOME]),
  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      defaultValue: "À propos",
      label: "Surtitre",
    },
    {
      type: "row",
      fields: [
        {
          name: "titleStart",
          type: "text",
          required: true,
          label: "Titre, début",
          admin: {
            width: "50%",
            description: "Affiché normalement.",
          },
        },
        {
          name: "titleAccent",
          type: "text",
          required: true,
          label: "Titre, fin accentuée",
          admin: {
            width: "50%",
            description: "Affiché en italique, dans la couleur d'accent.",
          },
        },
      ],
    },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
      label: "Portrait",
      admin: {
        description: "Cadre vertical, en 4/5. Prévoir 1200 × 1500 px.",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Texte",
      admin: {
        description: "Deux paragraphes suffisent : au-delà, le bloc déborde du portrait.",
      },
    },
    {
      name: "facts",
      type: "array",
      label: "Repères",
      maxRows: 4,
      labels: { singular: "Repère", plural: "Repères" },
      admin: {
        description:
          "Quatre au maximum : ils tiennent sur une ligne de quatre colonnes, et une cinquième casserait la rangée.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "value",
              type: "text",
              required: true,
              label: "Valeur",
              admin: { width: "40%", description: "Grenoble, 5 ans, +30…" },
            },
            {
              name: "label",
              type: "text",
              required: true,
              label: "Précision",
              admin: { width: "60%" },
            },
          ],
        },
      ],
    },
  ],
};
