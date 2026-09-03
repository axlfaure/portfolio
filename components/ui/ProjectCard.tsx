import Link from "next/link";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { Media } from "@/components/ui/Media";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Carte projet.
 *
 * Le visuel porte la carte : pas de cadre autour, le texte vit en dessous.
 * Le zoom du survol se joue sur l'image à l'intérieur d'un conteneur qui
 * rogne — sinon les angles arrondis grandiraient avec elle.
 */
export function ProjectCard({
  project,
  index = 0,
  className,
}: {
  project: Project;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/projets/${project.slug}`}
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties
      }
      className={cn("group flex flex-col", className)}
    >
      <div className="relative overflow-hidden rounded-project bg-sunk">
        <Media
          src={project.cover}
          alt={`${project.client} — ${project.title}`}
          ratio="4 / 3"
          sizes="(min-width: 64rem) 21rem, (min-width: 40rem) 45vw, 92vw"
          className="transition-transform duration-[620ms] ease-expo group-hover:scale-[1.04]"
        />

        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink opacity-0 shadow-e1 -translate-y-1 transition-[opacity,translate] duration-300 ease-expo group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowDiag size={15} />
        </span>
      </div>

      <p className="meta mt-4">{project.client}</p>

      <h3 className="mt-1.5 text-[1.02rem] font-bold leading-snug tracking-[-0.02em] text-ink">
        {project.short}
      </h3>

      {project.disciplines.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.disciplines.map((d) => (
            <li
              key={d}
              className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] font-medium text-label"
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
