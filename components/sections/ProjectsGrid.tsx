"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

const ALL = "Tout";

export type GridItem = {
  slug: string;
  disciplines: string[];
  /** Carte déjà rendue côté serveur. */
  card: ReactNode;
};

/**
 * Grille projets filtrable par discipline.
 *
 * Les cartes arrivent déjà rendues : `ProjectCard` lit le disque pour savoir
 * si un visuel existe, elle ne peut donc pas être importée depuis un
 * composant client. Ici on ne fait que choisir lesquelles afficher.
 *
 * Le filtre est purement client, sur des projets tous présents dans le HTML
 * statique : rien à recharger, et Google les indexe en entier.
 */
export function ProjectsGrid({ items }: { items: GridItem[] }) {
  const [active, setActive] = useState(ALL);

  const disciplines = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const d of item.disciplines) {
        counts.set(d, (counts.get(d) ?? 0) + 1);
      }
    }
    // Les disciplines les plus représentées d'abord : le filtre le plus
    // utile doit tomber sous le curseur en premier.
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
      .map(([name]) => name);
  }, [items]);

  const shown = useMemo(
    () =>
      active === ALL
        ? items
        : items.filter((item) => item.disciplines.includes(active)),
    [items, active],
  );

  return (
    <>
      <div
        className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-8"
        data-reveal
      >
        {[ALL, ...disciplines].map((name) => {
          const current = name === active;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={current}
              onClick={() => setActive(name)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-[background-color,border-color,color] duration-200",
                current
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-line-2 hover:text-ink",
              )}
            >
              {name}
              {name === ALL && (
                <span className="ml-2 font-mono text-[0.75rem] opacity-60">
                  {items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* La clé change avec le filtre : les cartes se remontent, donc
          l'animation d'entrée rejoue au lieu d'un remplacement sec. */}
      <div
        key={active}
        className="mt-10 grid gap-x-5 gap-y-11 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((item) => (
          <div key={item.slug} className="contents">
            {item.card}
          </div>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {shown.length} projet{shown.length > 1 ? "s" : ""} affiché
        {shown.length > 1 ? "s" : ""}.
      </p>
    </>
  );
}
