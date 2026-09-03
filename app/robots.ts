import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Ce fichier doit vivre à la racine de `app/`, pas dans un groupe de routes :
 * Next n'y détecte pas la convention et `/robots.txt` répondait 404.
 *
 * L'administration et l'API sont exclues de l'indexation. Ce n'est pas une
 * protection — elles restent accessibles, et c'est l'authentification qui les
 * garde — mais rien ne justifie qu'elles apparaissent dans un moteur.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
