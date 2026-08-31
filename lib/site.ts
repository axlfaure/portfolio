/**
 * Configuration centrale du site.
 * Les valeurs susceptibles de changer sans toucher au code des composants
 * vivent ici : source du fond du hero, disponibilité, URL Calendly.
 */

export const site = {
  name: "Axel Faure",
  brand: "Axel Faure · studio",
  baseline: "Studio créatif tech & industrie",
  city: "Grenoble",
  url: "https://axelfaure.fr",
  email: "contact@axelfaure.fr",
  calendlyUrl: "https://calendly.com/axelfaure/30min",
  /** Portrait détouré, fond bleu conservé. */
  portrait: "/axel.png",
  /** Libellé sous la pile d'avatars du hero. */
  socialProof: "30+ structures accompagnées",
} as const;

/** Nombre de créneaux affichés dans la pilule et le bouton principal. */
export const availability = {
  slots: 3,
  label: "3 places disponibles",
} as const;

/**
 * Fond vidéo du hero.
 * `mode` est l'unique constante à changer pour passer du test YouTube
 * au fichier local de production.
 */
export const heroBackground = {
  mode: "youtube" as "youtube" | "local",
  youtubeId: "wyxxPTFfdi8",
  local: {
    mp4: "/hero/chrome.mp4",
    webm: "/hero/chrome.webm",
    poster: "/hero/chrome.jpg",
  },
} as const;

export const navLinks = [
  { href: "/#projets", label: "Projets" },
  { href: "/#services", label: "Services" },
  { href: "/#resultats", label: "Résultats" },
  { href: "/#avis", label: "Avis" },
  { href: "/#faq", label: "FAQ" },
] as const;
