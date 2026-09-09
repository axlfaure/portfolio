import { site } from "@/lib/site";

/**
 * Les deux comptes publics, en pictogrammes.
 *
 * Des marques dessinées au trait et non les logos officiels en aplat : posés
 * à côté des pictogrammes du reste du site, deux logos pleins auraient été les
 * seules formes remplies de la page, et se seraient lus comme des boutons.
 * Ils gardent la graisse de trait et le rayon des autres icônes, c'est ce qui
 * les fait appartenir à la même famille.
 *
 * Le nom du réseau est porté par `aria-label` : un pictogramme seul est muet
 * pour un lecteur d'écran, et « lien » est tout ce qu'il annoncerait.
 */
const RESEAUX = [
  { nom: "Instagram", href: site.instagram, dessin: <Instagram /> },
  { nom: "LinkedIn", href: site.linkedin, dessin: <LinkedIn /> },
];

export function SocialLinks() {
  return (
    <ul className="mt-6 flex items-center gap-2">
      {RESEAUX.map((reseau) => (
        <li key={reseau.nom}>
          <a
            href={reseau.href}
            target="_blank"
            rel="noreferrer"
            aria-label={reseau.nom}
            className="grid h-11 w-11 place-items-center rounded-[12px] border border-line bg-surface text-muted transition-colors duration-200 hover:border-accent-line hover:bg-accent-soft hover:text-accent-deep"
          >
            {reseau.dessin}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Instagram() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      {/* Le point de l'objectif : rempli, c'est la seule façon de le voir à
          dix-huit pixels. */}
      <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedIn() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <path d="M7.6 10.4v6.1" />
      <path d="M7.6 7.6v.02" />
      <path d="M11.4 16.5v-6.1" />
      <path d="M11.4 13.2a2.9 2.9 0 0 1 5.8 0v3.3" />
    </svg>
  );
}
