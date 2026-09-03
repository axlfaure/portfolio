import type { CollectionConfig } from "payload";
import { orderField, slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/** Questions fréquentes de la page d'accueil, et données structurées FAQPage. */
export const Faq: CollectionConfig = {
  slug: "faq",
  labels: { singular: "Question", plural: "Questions fréquentes" },
  access: { read: () => true },
  admin: { useAsTitle: "question", defaultColumns: ["question", "order"], group: "Contenu" },
  hooks: revalidate(() => [HOME]),
  defaultSort: "order",
  fields: [
    { name: "question", type: "text", required: true, label: "Question" },
    {
      name: "answer",
      type: "richText",
      required: true,
      label: "Réponse",
      admin: {
        description:
          "Reprise telle quelle dans les données structurées lues par Google : répondre directement, sans préambule.",
      },
    },
    orderField,
    slugField("Utilisé comme ancre."),
  ],
};
