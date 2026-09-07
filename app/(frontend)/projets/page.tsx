import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjects, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Branding, supports salon et print, sites web et outils métier pour des structures de la recherche, de l'innovation et de l'industrie.",
  alternates: { canonical: "/projets" },
};

export default async function ProjetsPage() {
  /*
   * Familles de filtrage : les services, dans l'ordre où ils sont rangés dans
   * l'administration. Ce sont eux qui citent leurs projets, la relation existe
   * donc déjà et se tient à jour toute seule.
   *
   * Seuls les services qui citent au moins un projet deviennent un filtre : un
   * bouton qui ne renvoie rien est pire qu'un bouton absent.
   */
  const services = await getServices();
  const parProjet = new Map<string, string[]>();
  for (const service of services) {
    for (const slug of service.projects) {
      parProjet.set(slug, [...(parProjet.get(slug) ?? []), service.title]);
    }
  }
  const familles = services
    .filter((service) => service.projects.length > 0)
    .map((service) => service.title);

  // Les cartes sont rendues ici : elles vérifient sur disque la présence
  // des visuels, ce que la grille cliente ne peut pas faire.
  const items = (await getProjects()).map((project, i) => ({
    slug: project.slug,
    familles: parProjet.get(project.slug) ?? [],
    card: <ProjectCard project={project} index={i} />,
  }));

  return (
    <>
      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          eyebrow="Tous les projets"
          title={
            <>
              Les innovations que j&apos;ai aidées à{" "}
              <em className="accent hl hl--scroll">se faire comprendre.</em>
            </>
          }
          lead="Recherche, micro-électronique, industrie et technologie. Des identités, des supports de salon, des interfaces et des outils de production."
        />

        <ProjectsGrid items={items} familles={familles} />
      </div>

      <FinalCta />
    </>
  );
}
