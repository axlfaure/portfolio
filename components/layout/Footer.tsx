import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Le pied de page rattrape ce que la navigation ne porte plus : « À propos »
 * et « FAQ » sont sortis de la barre pour lui garder cinq entrées, mais les
 * sections existent toujours et doivent rester atteignables et liables.
 */
type Lien = { href: string; label: string; externe?: boolean };

const columns: { title: string; links: Lien[] }[] = [
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
      { href: site.instagram, label: "Instagram", externe: true },
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
              <ul className="mt-4 space-y-0.5">
                {column.links.map((link) => {
                  const classes =
                    "inline-block py-1.5 text-[0.9rem] text-muted transition-colors duration-200 hover:text-ink";

                  // Un lien sortant ne passe pas par le routeur : Link
                  // préchargerait une route qui n'existe pas ici, et le
                  // couple target/rel doit être posé à la main.
                  return (
                    <li key={link.href}>
                      {link.externe ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={classes}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={classes}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
