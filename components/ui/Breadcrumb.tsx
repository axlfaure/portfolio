import Link from "next/link";

type Crumb = { href: string; label: string };

/** Fil d'ariane des pages de détail. Le dernier segment n'est pas un lien. */
export function Breadcrumb({
  trail,
  current,
}: {
  trail: Crumb[];
  current: string;
}) {
  return (
    <nav aria-label="Fil d'ariane" className="eyebrow flex items-center gap-2">
      {trail.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <Link href={crumb.href} className="transition-colors hover:text-ink">
            {crumb.label}
          </Link>
          <span aria-hidden="true">/</span>
        </span>
      ))}
      <span className="truncate text-ink-2">{current}</span>
    </nav>
  );
}
