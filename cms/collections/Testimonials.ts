import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/** Avis clients : bandeau de la section Avis, et encart des cartes projet. */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Témoignage", plural: "Témoignages" },
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "org", "rating", "featured"],
    group: "Contenu",
  },
  hooks: revalidate(() => [HOME]),
  fields: [
    { name: "name", type: "text", required: true, label: "Prénom et nom" },
    { name: "role", type: "text", required: true, label: "Fonction" },
    { name: "org", type: "text", required: true, label: "Structure" },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Photo",
      admin: { description: "Portrait carré. Sans photo, les initiales prennent le relais." },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      label: "Note sur 5",
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
      label: "Citation",
      admin: { description: "Deux ou trois phrases. Les guillemets sont ajoutés par le site." },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Mettre en avant",
      admin: {
        position: "sidebar",
        description: "Le témoignage affiché en grand dans le bandeau de la page d'accueil.",
      },
    },
    slugField("Sert à relier un témoignage à un projet."),
  ],
};
