import type { MetadataRoute } from "next";
import { getPosts, getProjects, getServices } from "@/lib/content";
import { site } from "@/lib/site";

/** Plan du site : pages fixes, services, projets et articles. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /**
   * Un horodatage Payload invalide ou absent ne doit pas sortir une adresse du
   * plan : on retombe sur la date du build, qui est au pire imprécise.
   */
  const date = (valeur: string | undefined) => {
    if (!valeur) return now;
    const d = new Date(valeur);
    return Number.isNaN(d.getTime()) ? now : d;
  };

  /*
   * Les pages fixes n'ont pas de date propre : leur contenu vient du code et
   * des globaux de Payload, et rien n'horodate leur dernière retouche. Elles
   * gardent donc la date du build, la seule honnête à leur sujet.
   *
   * `/mentions-legales` n'y figure pas, et c'est volontaire : la page porte
   * `robots: { index: false }`. Un plan du site est une liste d'adresses dont
   * on demande l'indexation, et y déclarer une page qu'on interdit d'indexer
   * est une contradiction, que Search Console remonte en « exclue par une
   * balise noindex ».
   */
  const fixed = [
    { url: site.url, priority: 1, lastModified: now },
    { url: `${site.url}/services`, priority: 0.9, lastModified: now },
    { url: `${site.url}/offres`, priority: 0.9, lastModified: now },
    { url: `${site.url}/projets`, priority: 0.8, lastModified: now },
    { url: `${site.url}/contact`, priority: 0.8, lastModified: now },
    { url: `${site.url}/blog`, priority: 0.7, lastModified: now },
  ];

  /*
   * Les documents, eux, portent la date de leur dernier enregistrement dans
   * Payload. L'annoncer plutôt que la date du build évite de déclarer à chaque
   * déploiement que les vingt-trois adresses ont changé le même jour : un
   * `lastmod` qui bouge sans raison finit par être ignoré en bloc.
   */
  const services = (await getServices()).map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    priority: 0.9,
    lastModified: date(service.updatedAt),
  }));

  const projects = (await getProjects()).map((project) => ({
    url: `${site.url}/projets/${project.slug}`,
    priority: 0.6,
    lastModified: date(project.updatedAt),
  }));

  const posts = (await getPosts()).map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    priority: 0.6,
    lastModified: date(post.updatedAt),
  }));

  return [...fixed, ...services, ...projects, ...posts].map((entry) => ({
    ...entry,
    changeFrequency: "monthly" as const,
  }));
}
