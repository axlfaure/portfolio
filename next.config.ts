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
};

/**
 * `withPayload` câble l'administration dans l'application : il ajoute les alias
 * internes de Payload et écarte ses dépendances serveur du paquet envoyé au
 * navigateur. Sans cette enveloppe, le build échoue sur des modules Node
 * importés côté client.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
