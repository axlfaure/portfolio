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
  /** Libellé sous la pile d'avatars du hero. La partie `strong` est en gras. */
  socialProof: { strong: "100%", rest: "de clients satisfaits" },
  /** Monogramme de la nav. Déposer le fichier pour remplacer le logotype texte. */
  logo: "/logo.png",
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

/** Visages clients de la preuve sociale du hero. */
export const clientFaces = [
  "/temoignages/client-1.jpg",
  "/temoignages/client-2.jpg",
  "/temoignages/client-3.jpg",
  "/temoignages/client-4.jpg",
  "/temoignages/client-5.jpg",
  "/temoignages/client-6.jpg",
] as const;

/** Logos clients du ticker du hero. */
export const clientLogos = [
  { name: "FAMES", src: "/logos/fames.png" },
  { name: "SEVES", src: "/logos/seves.png" },
  { name: "Nobrain", src: "/logos/nobrain.png" },
  { name: "Alpes Ressources", src: "/logos/alpes-ressources.png" },
  { name: "Quemera", src: "/logos/quemera.png" },
  { name: "Aides et Soins", src: "/logos/aides-et-soins.png" },
  { name: "Vinci Facilities", src: "/logos/vinci.png" },
  { name: "CEA-Leti", src: "/logos/cea-leti.png" },
  { name: "France 2030", src: "/logos/france-2030.png" },
  { name: "Magellan", src: "/logos/magellan.png" },
  { name: "Vinay", src: "/logos/vinay.png" },
  { name: "Comité des fêtes", src: "/logos/comite-des-fetes.png" },
] as const;

/** `menu` déclenche le panneau déroulant de la nav de bureau. */
export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services", menu: "services" },
  { href: "/blog", label: "Blog" },
  { href: "/#avis", label: "Avis" },
] as const;
