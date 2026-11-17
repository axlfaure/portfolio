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

  /**
   * Cinq adresses de l'ancien site WordPress restaient indexées et
   * répondaient 404 depuis la refonte, alors qu'elles occupent les
   * meilleures positions du site hors nom propre, de 4,5 à 7,7. Les
   * renvoyer rend ces impressions cliquables sans attendre un gain de
   * position : c'est le seul correctif de référencement dont l'effet ne
   * dépend pas du temps.
   *
   * `/contact` ne figure pas dans la liste. Elle vaut mieux qu'un renvoi :
   * elle a sa propre page, qui répond 200 et peut se classer.
   *
   * `statusCode: 301` plutôt que `permanent: true`, qui émet un 308. Google
   * traite les deux de la même façon, mais la décision écrite du côté
   * référencement porte sur un 301, et certains outils d'audit ne
   * reconnaissent que celui-là.
   *
   * Les adresses indexées portent une barre oblique finale. Next la retire
   * par une première redirection avant de consulter cette liste : le
   * visiteur passe donc par deux sauts, ce qui ne coûte rien.
   */
  async redirects() {
    return [
      {
        source: "/visuels-flyers",
        destination: "/services/supports-salon-print",
        statusCode: 301,
      },
      {
        source: "/dev",
        destination: "/services/site-web-interfaces",
        statusCode: 301,
      },
      { source: "/realisations-2", destination: "/projets", statusCode: 301 },
      { source: "/1596-2", destination: "/projets", statusCode: 301 },
    ];
  },
};

/**
 * `withPayload` câble l'administration dans l'application : il ajoute les alias
 * internes de Payload et écarte ses dépendances serveur du paquet envoyé au
 * navigateur. Sans cette enveloppe, le build échoue sur des modules Node
 * importés côté client.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
