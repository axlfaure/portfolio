import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Branding, supports salon et print, sites web et outils métier pour des structures de la recherche, de l'innovation et de l'industrie.",
};

export default function ProjetsPage() {
  const projects = getProjects();

  return (
    <>
      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          index="—"
          eyebrow="Tous les projets"
          meta={`${projects.length} réalisations`}
          title="Les innovations que j'ai aidées à se faire comprendre."
          lead="Recherche, micro-électronique, industrie et technologie. Des identités, des supports de salon, des interfaces et des outils de production."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      <FinalCta />
    </>
  );
}
