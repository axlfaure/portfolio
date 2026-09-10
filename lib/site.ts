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
  /*
   * L'adresse à laquelle le site est RÉELLEMENT servi, et rien d'autre.
   *
   * Elle ne sert pas qu'à l'affichage : elle fabrique les balises canoniques,
   * le sitemap, le robots.txt, les données structurées et l'adresse absolue de
   * la vignette de partage. Elle se met donc à jour dans la même séance que la
   * bascule d'hébergement, jamais avant, jamais après.
   *
   * Les deux sens de l'erreur ont été commis, et coûtent la même chose. En
   * avance, le site annonçait axelfaure.fr quand il était servi sur
   * portfolio.axelfaure.fr : Google recevait des canoniques vers du 404 et
   * LinkedIn cherchait une vignette inexistante. En retard, il a annoncé
   * portfolio.axelfaure.fr une fois le sous-domaine supprimé du DNS, ce qui
   * était pire encore : un nom qui ne résout plus, donc un sitemap entier
   * d'adresses mortes.
   *
   * Passée sur "https://axelfaure.fr" le 10 septembre 2026, jour où ce domaine
   * a commencé à servir ce site.
   */
  url: "https://axelfaure.fr",
  email: "axelfaure64@gmail.com",
  instagram: "https://www.instagram.com/axelfauredesign",
  linkedin: "https://www.linkedin.com/in/axel-faure/",
  calendlyUrl: "https://calendly.com/axelfaure64/30min",
  /** Portrait détouré, fond bleu conservé. */
  portrait: "/axel.png",
  /** Libellé sous la pile d'avatars du hero. La partie `strong` est en gras. */
  socialProof: { strong: "100%", rest: "de clients satisfaits" },
  /** Monogramme de la nav. Déposer le fichier pour remplacer le logotype texte. */
  logo: "/logo.png",
} as const;

/** Nombre de créneaux affichés dans la pilule et le bouton principal. */
export const availability = {
  /**
   * Pastille au-dessus du dernier appel à l'action.
   *
   * « Disponible » et non un décompte de places. Un chiffre affiché sur une
   * page statique se périme sans prévenir, et il se contredisait avec l'offre
   * Circuit, qui annonce quatre places à l'année : un visiteur lisait deux
   * comptes différents sur la même page.
   */
  label: "Disponible",
  /**
   * Ligne sous le bouton principal.
   *
   * Une invitation plutôt qu'un état : un décompte décrit une situation que le
   * visiteur n'a pas demandée. « Voir les disponibilités » dit ce que le clic
   * fait, et reste vrai.
   */
  cta: "Voir les disponibilités",
} as const;

/**
 * Fond vidéo du hero.
 *
 * `mode` est l'unique constante à changer pour repasser au test YouTube.
 * Le fichier local n'est pas qu'une commodité : YouTube refuse de démarrer
 * seul sur téléphone dès que le mode économie d'énergie est actif, alors
 * qu'une balise `<video muted playsInline>` est précisément l'exception que
 * iOS et Android autorisent. C'est ce qui permet au fond de vivre aussi sur
 * un écran étroit.
 *
 * Deux définitions plutôt qu'une. Sur un écran de 375 px, le lecteur est
 * agrandi à 1443 px de large pour couvrir la hauteur : une source de 1280 px
 * y suffit largement, et divise le poids par deux sur le réseau où il coûte
 * le plus cher.
 */
export const heroBackground = {
  mode: "local" as "youtube" | "local",
  youtubeId: "wyxxPTFfdi8",
  local: {
    mp4: "/hero/chrome.mp4",
    webm: "/hero/chrome.webm",
    mobileMp4: "/hero/chrome-mobile.mp4",
    mobileWebm: "/hero/chrome-mobile.webm",
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
  { href: "/offres", label: "Offres" },
  { href: "/blog", label: "Blog" },
] as const;
