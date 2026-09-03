import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Branding, supports salon et print, sites web et outils métier pour des structures de la recherche, de l'innovation et de l'industrie.",
  alternates: { canonical: "/projets" },
};

export default async function ProjetsPage() {
  // Les cartes sont rendues ici : elles vérifient sur disque la présence
  // des visuels, ce que la grille cliente ne peut pas faire.
  const items = (await getProjects()).map((project, i) => ({
    slug: project.slug,
    disciplines: project.disciplines,
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

        <ProjectsGrid items={items} />
      </div>

      <FinalCta />
    </>
  );
}
