import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Le pied de page rattrape ce que la navigation ne porte plus : « À propos »
 * et « FAQ » sont sortis de la barre pour lui garder cinq entrées, mais les
 * sections existent toujours et doivent rester atteignables et liables.
 */
const columns = [
  {
    title: "Le travail",
    links: [
      { href: "/projets", label: "Projets" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "En savoir plus",
    links: [
      { href: "/#a-propos", label: "À propos" },
      { href: "/#avis", label: "Avis clients" },
      { href: "/#faq", label: "Questions fréquentes" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "/#contact", label: "Prendre rendez-vous" },
      { href: `mailto:${site.email}`, label: site.email },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site py-[clamp(3rem,6vw,4.5rem)]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
              {site.name}
            </p>
            <p className="mt-2 max-w-[22rem] text-[0.9rem] leading-relaxed text-muted">
              {site.baseline}, basé à {site.city}. Identité, supports de salon,
              sites web et outils de production pour la recherche et
              l&apos;industrie.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="eyebrow mt-[clamp(2.5rem,5vw,3.5rem)] border-t border-line pt-7">
          {site.city} · Isère · Auvergne-Rhône-Alpes · Réponse sous 24 h
        </p>
      </div>
    </footer>
  );
}
