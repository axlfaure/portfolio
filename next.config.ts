import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Pas de `output: "standalone"` ici.
   *
   * Cette option assemble un serveur autonome dans `.next/standalone`, ce dont
   * le Dockerfile a besoin — mais Next 16 refuse alors de démarrer par
   * `next start`, qui est la commande d'exécution du site Node.js chez
   * l'hébergeur. Les deux modes s'excluent.
   *
   * Le déploiement se faisant aujourd'hui par dépôt git et `next start`, c'est
   * ce mode qui prime. Si le site repassait un jour en conteneur, il faudrait
   * rétablir `output: "standalone"` et changer la commande d'exécution en
   * `node .next/standalone/server.js`.
   */

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
