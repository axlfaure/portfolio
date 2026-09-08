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
    defaultColumns: ["avatar", "name", "org", "rating", "featured"],
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
      label: "Citation",
      admin: {
        description:
          "Deux ou trois phrases. Les guillemets sont ajoutés par le site. Laisser vide pour une simple note : le client reste rattaché à son projet, avec ses étoiles, mais n'apparaît pas dans le mur d'avis. Écrire une citation l'y fait entrer aussitôt.",
      },
    },
    {
      name: "background",
      type: "upload",
      relationTo: "media",
      label: "Image de fond du bandeau",
      admin: {
        description:
          "Ne sert que pour le témoignage mis en avant. Affichée très en transparence et en niveaux de gris derrière la citation : choisir une image ample, sans détail à lire. Facultative : sans elle, le bandeau reste sur son fond uni, ou sur la seule vidéo si vous en avez déposé une.",
        condition: (data) => Boolean(data?.featured),
      },
    },
    {
      name: "backgroundVideo",
      type: "upload",
      relationTo: "media",
      label: "Vidéo de fond du bandeau",
      admin: {
        description:
          "Se pose au-dessus de l'image quand les deux sont présentes ; l'image lui sert alors d'affiche pendant le chargement, et la remplace si le visiteur a demandé moins d'animations. Muette et rejouée en boucle : une courte séquence de matière, sans sujet ni coupe franche. Deux mégaoctets suffisent, elle est affichée à 13 % d'opacité.",
        condition: (data) => Boolean(data?.featured),
      },
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
