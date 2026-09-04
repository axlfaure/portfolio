import path from "node:path";
import { fileURLToPath } from "node:url";
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

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Chemin absolu de la base, ancré sur ce fichier.
 *
 * Un chemin relatif serait résolu depuis le répertoire courant du processus,
 * qui n'est pas le même selon qu'on lance le serveur de développement, le
 * build ou un script : le serveur ouvrait alors un fichier inexistant pendant
 * que le script de reprise écrivait dans le bon.
 */
const localDb = `file:${path.resolve(dirname, ".data/site.db").replace(/\\/g, "/")}`;

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
      beforeDashboard: ["@/cms/components/Dashboard#Dashboard"],
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
  typescript: { outputFile: path.resolve(dirname, "cms/payload-types.ts") },

  secret: process.env.PAYLOAD_SECRET || "",

  sharp,

  localization: false,
});
