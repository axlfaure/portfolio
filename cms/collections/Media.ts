import type { CollectionConfig } from "payload";

/**
 * Bibliothèque de médias, unique pour tout le site.
 *
 * Les tailles générées correspondent aux emplacements réels : une vignette pour
 * l'admin, une largeur de cellule de bento, une largeur de carte, et une pleine
 * largeur pour les visuels de tête. `next/image` redimensionne encore derrière,
 * mais partir d'un fichier déjà proche de la cible évite de faire transiter un
 * original de 8 000 px pour l'afficher à 400.
 *
 * `alt` n'est pas obligatoire : un visuel purement décoratif doit pouvoir rester
 * muet pour les lecteurs d'écran, et un champ requis pousserait à le remplir
 * avec du bruit.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média", plural: "Médias" },
  access: { read: () => true },
  admin: { useAsTitle: "filename", group: "Bibliothèque" },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "video/*"],
    focalPoint: true,
    imageSizes: [
      { name: "thumb", width: 400, height: 300, position: "centre" },
      { name: "card", width: 900 },
      { name: "wide", width: 1600 },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texte alternatif",
      admin: {
        description:
          "Décrit l'image pour les lecteurs d'écran. À laisser vide si le visuel est purement décoratif.",
      },
    },
  ],
};
