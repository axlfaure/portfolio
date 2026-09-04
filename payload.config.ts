import fs from "node:fs";
import path from "node:path";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Faq } from "./cms/collections/Faq";
import { Logos } from "./cms/collections/Logos";
import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Projects } from "./cms/collections/Projects";
import { Services } from "./cms/collections/Services";
import { Testimonials } from "./cms/collections/Testimonials";
import { Users } from "./cms/collections/Users";


/**
 * Emplacement de la base.
 *
 * Surtout pas déduit de l'emplacement de ce fichier : webpack fige cette
 * valeur au moment de la compilation, et un build fait sur un poste puis
 * exécuté sur un serveur emporterait le chemin du poste.
 *
 * `DATABASE_URI` a donc le dernier mot. À défaut, on part du répertoire
 * d'exécution, que `next start` place à la racine du projet.
 */
const dataDir = path.resolve(process.cwd(), ".data");

/*
 * SQLite crée le fichier de base, jamais le dossier qui le contient. Or `.data`
 * est exclu du dépôt : sur un serveur fraîchement cloné il est absent, et la
 * connexion échoue en SQLITE_CANTOPEN — une erreur qui ne dit pas qu'il ne
 * manque qu'un répertoire. L'échec de création reste toléré : il ne doit pas
 * emporter toute l'application au démarrage.
 */
try {
  fs.mkdirSync(dataDir, { recursive: true });
} catch {
  // Chemin inaccessible : la connexion échouera plus loin, avec son message.
}

const localDb = `file:${path.join(dataDir, "site.db").replace(/\\/g, "/")}`;

/**
 * Configuration Payload.
 *
 * Le choix de la base est volontairement isolé sur une seule ligne. SQLite
 * permet de travailler sans dépendre d'un service distant : le fichier vit dans
 * `.data/`, il se sauvegarde en le copiant, et il n'y a rien à provisionner.
 *
 * Le jour du déploiement, deux cas :
 * - hébergement classique (VPS, Docker) : SQLite tient très bien pour un site
 *   à un seul rédacteur, rien à changer ;
 * - Vercel ou tout hébergeur au système de fichiers éphémère : SQLite devient
 *   inutilisable, il faut passer à `@payloadcms/db-postgres` et à un stockage
 *   objet pour les médias. Seules cette ligne et `Media.upload` bougent, les
 *   collections et le site restent identiques.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · Administration Axel Faure" },

    // Le site est en clair uniquement ; alterner entre les deux à chaque
    // aller-retour entre l'édition et le rendu fatigue pour rien.
    theme: "light",

    components: {
      graphics: {
        Icon: "@/cms/components/Brand#Icon",
        Logo: "@/cms/components/Brand#Logo",
      },
      views: {
        // Remplacement complet : le tableau de bord d'origine rejouait la
        // navigation de gauche en grandes cartes, sans rien ajouter.
        dashboard: { Component: "@/cms/components/Dashboard#Dashboard" },
      },
    },
  },

  collections: [Projects, Services, Testimonials, Faq, Posts, Logos, Media, Users],

  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || localDb },
  }),

  editor: lexicalEditor(),

  // Interface en français : les libellés des champs le sont déjà, laisser la
  // coque en anglais ferait un mélange que personne n'a envie d'administrer.
  i18n: { supportedLanguages: { fr }, fallbackLanguage: "fr" },

  // Rend les types de la base disponibles côté site, régénérés à chaque
  // démarrage : le contenu et le code ne peuvent pas diverger en silence.
  typescript: {
    outputFile: path.resolve(process.cwd(), "cms/payload-types.ts"),
  },

  secret: process.env.PAYLOAD_SECRET || "",

  sharp,

  localization: false,
});
