import fs from "node:fs";
import path from "node:path";
import type { CollectionConfig } from "payload";

/**
 * Dossier des fichiers téléversés.
 *
 * Surtout pas déduit de l'emplacement de ce fichier : webpack fige cette
 * valeur au moment de la compilation. Le site étant construit sur un poste
 * Windows puis exécuté sur un serveur Linux, le chemin gravé dans le build
 * désignait `C:/Users/...`, introuvable, et toute l'administration tombait au
 * démarrage.
 *
 * `MEDIA_DIR` fixe donc le chemin explicitement en production. À défaut, on
 * part du répertoire d'exécution, que `next start` place à la racine du
 * projet.
 */
const mediaDir = process.env.MEDIA_DIR
  ? path.resolve(process.env.MEDIA_DIR)
  : path.resolve(process.cwd(), "media");

/*
 * Le dossier est exclu du dépôt : Payload ne le crée pas, et un déploiement
 * neuf échouerait au premier téléversement. L'échec reste toléré — une
 * variable mal renseignée ne doit pas emporter toute l'administration au
 * démarrage, elle doit se manifester au moment d'un téléversement.
 */
try {
  fs.mkdirSync(mediaDir, { recursive: true });
} catch {
  // Chemin inaccessible : Payload le signalera lui-même à l'usage.
}

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
