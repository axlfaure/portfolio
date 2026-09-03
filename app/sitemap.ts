import type { MetadataRoute } from "next";
import { getPosts, getProjects, getServices } from "@/lib/content";
import { site } from "@/lib/site";

/** Plan du site : pages fixes, services, projets et articles. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed = [
    { url: site.url, priority: 1 },
    { url: `${site.url}/services`, priority: 0.9 },
    { url: `${site.url}/projets`, priority: 0.8 },
    { url: `${site.url}/blog`, priority: 0.7 },
    { url: `${site.url}/mentions-legales`, priority: 0.2 },
  ];

  const services = getServices().map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    priority: 0.9,
  }));

  const projects = getProjects().map((project) => ({
    url: `${site.url}/projets/${project.slug}`,
    priority: 0.6,
  }));

  const posts = getPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    priority: 0.6,
  }));

  return [...fixed, ...services, ...projects, ...posts].map((entry) => ({
    ...entry,
    lastModified: now,
    changeFrequency: "monthly" as const,
  }));
}
