import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Manifeste d'application.
 *
 * Sans lui, « Ajouter à l'écran d'accueil » sur Android fabrique une vignette
 * à partir d'une capture de la page et l'étiquette avec le titre complet de
 * l'onglet. Le manifeste lui donne le monogramme, un nom court, et la couleur
 * de fond qui évite le flash blanc à l'ouverture.
 *
 * L'icône `maskable` est un second tirage du même dessin, dessiné plus petit
 * dans son cadre : Android rogne l'icône à la forme du lanceur, qui peut aller
 * jusqu'au cercle inscrit, et un monogramme cadré au plus juste y perdrait ses
 * extrémités.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.baseline}`,
    short_name: site.name,
    description: site.baseline,
    start_url: "/",
    display: "standalone",
    lang: "fr",
    background_color: "#F3F3F4",
    theme_color: "#F3F3F4",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icone-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
