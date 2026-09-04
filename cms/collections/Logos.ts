import type { CollectionConfig } from "payload";
import { orderField, slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/**
 * Logos clients du bandeau du hero.
 *
 * Ils étaient codés en dur dans `lib/site.ts` : c'est la seule des cinq
 * collections qui n'existait pas déjà comme contenu. Le cadrage compte autant
 * que le fichier — tous les logos ont été normalisés sur une zone optique
 * commune pour qu'aucun n'écrase les autres dans le bandeau.
 */
export const Logos: CollectionConfig = {
  slug: "logos",
  labels: { singular: "Logo client", plural: "Logos clients" },
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["image", "name", "order"],
    group: "Accueil",
    description: "Bandeau défilant du haut de page.",
  },
  hooks: revalidate(() => [HOME]),
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true, label: "Nom du client" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo",
      admin: {
        description:
          "Fond transparent de préférence. Le bandeau les affiche en niveaux de gris, sur une zone de 3/2.",
      },
    },
    orderField,
    slugField("Identifiant technique, sans effet sur les URLs."),
  ],
};
