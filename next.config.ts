import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Sortie autonome, pour l'hébergement en conteneur.
   *
   * Next assemble alors dans `.next/standalone` un serveur complet avec les
   * seules dépendances qu'il utilise vraiment. C'est ce dossier que le
   * Dockerfile copie — sans cette option il n'existe pas, et l'image se
   * construisait sur du vide.
   */
  output: "standalone",

  experimental: {
    /**
     * Réduit la mémoire maximale utilisée par webpack pendant la compilation,
     * au prix de quelques secondes de plus.
     *
     * Nécessaire ici : l'hébergement mutualisé plafonne le tas de Node autour
     * de 480 Mo, et le build s'y arrêtait en « heap out of memory ». Sans
     * effet notable en local, où la mémoire n'est pas la contrainte.
     */
    webpackMemoryOptimizations: true,
  },
};

/**
 * `withPayload` câble l'administration dans l'application : il ajoute les alias
 * internes de Payload et écarte ses dépendances serveur du paquet envoyé au
 * navigateur. Sans cette enveloppe, le build échoue sur des modules Node
 * importés côté client.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
