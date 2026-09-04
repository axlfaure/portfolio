import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { revalidate } from "../hooks/revalidate";

/** Articles du blog. */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Article", plural: "Articles" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["cover", "title", "category", "date"],
    group: "Contenu",
  },
  hooks: revalidate((doc) => ["/blog", `/blog/${doc.slug}`]),
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", required: true, label: "Titre" },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      label: "Résumé",
      admin: { description: "Deux lignes sur la carte, tronquées au-delà." },
    },
    { name: "category", type: "text", required: true, label: "Catégorie" },
    { name: "date", type: "date", required: true, label: "Date de publication" },
    {
      name: "readingTime",
      type: "text",
      label: "Temps de lecture",
      admin: { description: "Par exemple « 6 min »." },
    },
    { name: "cover", type: "upload", relationTo: "media", label: "Visuel de couverture" },
    {
      name: "related",
      type: "relationship",
      relationTo: "services",
      label: "Service associé",
      admin: { description: "Ajoute un lien vers la page service en fin d'article." },
    },
    { name: "body", type: "richText", required: true, label: "Article" },
    slugField("Détermine l'URL : /blog/mon-identifiant"),
  ],
};
