import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { Project } from "@/lib/content";

/** Carte projet de la grille /projets. */
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <Link
      href={`/projets/${project.slug}`}
      data-reveal
      style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface p-3 shadow-e1 transition-[transform,box-shadow] duration-200 ease-site hover:-translate-y-0.5 hover:shadow-e2"
    >
      <Media
        src={project.cover}
        alt={`${project.client} — ${project.title}`}
        ratio="4 / 3"
        sizes="(min-width: 64rem) 21rem, (min-width: 40rem) 45vw, 92vw"
        className="rounded-[10px]"
      />

      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="meta truncate">{project.client}</p>
          {project.year && <p className="meta shrink-0">{project.year}</p>}
        </div>

        <h3 className="mt-2 text-[0.975rem] font-bold leading-snug tracking-[-0.02em] text-ink">
          {project.title}
        </h3>

        <p className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-[0.8rem] text-label">
          <span className="truncate">{project.tags}</span>
          <span
            aria-hidden="true"
            className="shrink-0 text-ink transition-transform duration-200 ease-site group-hover:translate-x-[3px]"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
