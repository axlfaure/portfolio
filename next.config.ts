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

  images: {
    /**
     * Next n'accepte que les qualités déclarées ici, et n'en autorise que 75
     * par défaut. Les visuels de projet sont des maquettes : elles portent du
     * texte fin et des aplats, deux choses que la compression à 75 abîme
     * visiblement. 90 leur est réservé, le reste du site garde 75.
     */
    qualities: [75, 90],
  },

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

    /**
     * Sert `app/global-not-found.tsx` aux adresses qui ne correspondent à
     * aucune route. Sans ce drapeau, elles reçoivent l'écran noir anglophone
     * de Next : le site a deux mises en page racines, l'une publique et
     * l'une pour l'administration, et Next n'a donc pas de racine commune où
     * poser un 404. C'est exactement le cas que cette option couvre.
     */
    globalNotFound: true,
  },
};

/**
 * `withPayload` câble l'administration dans l'application : il ajoute les alias
 * internes de Payload et écarte ses dépendances serveur du paquet envoyé au
 * navigateur. Sans cette enveloppe, le build échoue sur des modules Node
 * importés côté client.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
