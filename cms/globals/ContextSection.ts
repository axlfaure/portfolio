import type { GlobalConfig } from "payload";
import { enTeteFields } from "../fields/section";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Section « Le contexte » : le constat posé avant toute proposition.
 *
 * Les trois tensions doivent répondre à ce que montre la boîte de réception à
 * côté : la multiplicité des expéditeurs, l'écart de langage, la pression de
 * l'échéance. Le texte et le visuel se répondent, sinon le visuel n'est qu'une
 * illustration.
 *
 * Les messages eux-mêmes se règlent dans la collection « Boîte de réception ».
 */
export const ContextSection: GlobalConfig = {
  slug: "context-section",
  label: "Constat",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "Le constat, à gauche de la boîte de réception.",
  },
  hooks: revalidateGlobal([HOME]),
  fields: [
    ...enTeteFields({ lead: true }),
    {
      name: "strains",
      type: "array",
      label: "Tensions",
      maxRows: 3,
      labels: { singular: "Tension", plural: "Tensions" },
      admin: {
        description:
          "Trois au maximum. Chacune doit se retrouver dans les messages affichés à côté : c'est ce qui fait tenir la démonstration.",
      },
      fields: [
        {
          name: "icon",
          type: "select",
          required: true,
          defaultValue: "users",
          label: "Pictogramme",
          options: [
            { label: "Personnes", value: "users" },
            { label: "Échange", value: "exchange" },
            { label: "Horloge", value: "clock" },
            { label: "Document", value: "doc" },
            { label: "Calques", value: "layers" },
            { label: "Graphique", value: "chart" },
          ],
        },
        {
          name: "lead",
          type: "text",
          required: true,
          label: "Amorce en gras",
          admin: { description: "Une phrase courte, qui nomme la tension." },
        },
        {
          name: "line",
          type: "textarea",
          required: true,
          label: "Suite",
          admin: { description: "Ce qui rend la tension concrète." },
        },
      ],
    },
  ],
};
