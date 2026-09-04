import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";

/**
 * Dossier des fichiers téléversés, en chemin absolu ancré sur ce fichier.
 *
 * Un chemin relatif est résolu depuis le répertoire courant du processus, qui
 * n'est pas le même selon la façon dont le serveur est lancé : les fichiers
 * étaient écrits dans le projet et cherchés un dossier au-dessus. Les
 * visuels remontaient alors en 500, et `next/image` répondait « la ressource
 * demandée n'est pas une image valide » — une erreur qui ne dit rien du vrai
 * problème. Même piège que pour l'URL de la base.
 */
const mediaDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../media",
);

// Même raison que pour la base : le dossier est exclu du dépôt, Payload ne
// le crée pas, et un déploiement neuf échouerait au premier téléversement.
fs.mkdirSync(mediaDir, { recursive: true });

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
    staticDir: mediaDir,
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
