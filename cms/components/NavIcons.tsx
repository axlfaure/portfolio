/**
 * Pictogrammes de la barre latérale de l'administration.
 *
 * Posés en CSS plutôt qu'en remplaçant la navigation de Payload. Le composant
 * `Nav` est remplaçable, mais il faudrait alors réécrire les groupes, l'état
 * actif, le repli mobile et la déconnexion, pour n'ajouter qu'une image devant
 * chaque libellé. Une feuille de style tient dans un fichier et ne peut rien
 * casser d'autre que son propre décor.
 *
 * Les tracés sont posés en `mask-image` et non en fond : ils prennent ainsi la
 * couleur du texte, donc l'état actif et le survol, sans avoir à décliner
 * chaque icône en plusieurs teintes.
 *
 * Le sélecteur vise la fin de l'adresse, pas une classe : `/globals/hero` ne
 * bougera pas, alors que les classes internes de Payload appartiennent à
 * Payload.
 */

const TRACES: Record<string, string> = {
  // Sections de la page d'accueil, dans l'ordre de la page.
  "globals/hero": "M12 3l1.8 5.4 5.4 1.8-5.4 1.8L12 17.4l-1.8-5.4L4.8 10.2l5.4-1.8z",
  "globals/context-section": "M3 6h18v12H3z M3 7l9 6 9-6",
  "globals/projects-section": "M3 4h7v7H3z M14 4h7v4h-7z M14 11h7v9h-7z M3 14h7v6H3z",
  "globals/services-section": "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  "globals/about": "M12 12a4 4 0 100-8 4 4 0 000 8z M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6",
  "globals/reviews-section":
    "M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3L3 9.5l6.4-.6z",
  "globals/faq-section":
    "M12 21a9 9 0 100-18 9 9 0 000 18z M9.6 9.2a2.5 2.5 0 114.9.6c0 1.7-2.5 2-2.5 3.6 M12 17h.01",
  "globals/final-cta": "M4 12h14 M13 6l6 6-6 6",

  // Contenus qui se répètent.
  "collections/projects": "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  "collections/services": "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  "collections/testimonials":
    "M10 7H5.5A1.5 1.5 0 004 8.5v3A1.5 1.5 0 005.5 13H8c0 2-1 3.2-3 4 M20 7h-4.5A1.5 1.5 0 0014 8.5v3a1.5 1.5 0 001.5 1.5H18c0 2-1 3.2-3 4",
  "collections/faq":
    "M12 21a9 9 0 100-18 9 9 0 000 18z M9.6 9.2a2.5 2.5 0 114.9.6c0 1.7-2.5 2-2.5 3.6 M12 17h.01",
  "collections/posts": "M4 20l4.5-1L19 8.5 15.5 5 5 15.5z M14.5 6l3.5 3.5",
  "collections/mails": "M3 13h5l1 3h6l1-3h5 M5 5h14l2 8v6H3v-6z",

  // Bibliothèque.
  "collections/logos": "M12 3l7.5 3.5v5c0 4.3-3.1 7.7-7.5 9.5-4.4-1.8-7.5-5.2-7.5-9.5v-5z",
  "collections/media": "M3 5h18v14H3z M8.5 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5L5 19",
  "collections/users":
    "M10 12a4 4 0 100-8 4 4 0 000 8z M2 20c0-3.3 3.6-6 8-6s8 2.7 8 6 M17.5 5.2a3 3 0 010 5.6",
};

/** Un tracé, emballé en image utilisable comme masque. */
function masque(d: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Sélecteur des seuls liens qui portent une icône, sous forme de liste. */
const CIBLES = Object.keys(TRACES)
  .map((chemin) => `.nav__link[href$="/${chemin}"]`)
  .join(",\n");

/*
 * Le bloc commun est restreint à ces liens. Le poser sur `.nav__link` tout
 * court afficherait un carré plein devant tout lien futur dont l'icône n'aurait
 * pas encore été dessinée.
 */
const CSS = `
${CIBLES.split(",\n")
  .map((s) => `${s}::before`)
  .join(",\n")} {
  content: "";
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  margin-inline-end: 9px;
  background-color: currentColor;
  opacity: .5;
  mask: var(--ic) center / contain no-repeat;
  -webkit-mask: var(--ic) center / contain no-repeat;
}

${CIBLES.split(",\n")
  .map((s) => `${s}.active::before,\n${s}:hover::before`)
  .join(",\n")} { opacity: 1; }

${Object.entries(TRACES)
  .map(([chemin, d]) => `.nav__link[href$="/${chemin}"] { --ic: ${masque(d)}; }`)
  .join("\n")}
`;

export function NavIcons() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: feuille de style
  // construite ici même, sans aucune entrée extérieure.
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
