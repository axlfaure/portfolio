/**
 * Contenu de la home qui n'a pas vocation à vivre en MDX :
 * il n'y a rien à ajouter ni à réordonner ici sans toucher au design.
 *
 * Projets, témoignages et FAQ sont dans `content/` — voir lib/content.ts.
 */

/** Noms clients du ticker du hero. Le composant accepte des images dès les autorisations obtenues. */
export const clientNames = [
  "CEA",
  "CEA-Leti",
  "FAMES",
  "Vinci Facilities",
  "Éco-innovation",
  "Quemera",
  "Alpes Ressources",
  "CEA Startups",
];

export const heroStats = [
  { value: "70+", label: "projets livrés" },
  { value: "30+", label: "structures accompagnées" },
  { value: "97,5 %", label: "de satisfaction" },
  { value: "5 ans", label: "dans la tech et l'industrie" },
] as const;

export type Service = {
  title: string;
  description: string;
  tier: "Cœur de métier" | "Complément";
  icon: "identity" | "print" | "web" | "automation" | "motion" | "photo";
};

export const services: Service[] = [
  {
    title: "Branding & identité",
    description:
      "Logo, charte graphique, système visuel qui tient dans la durée.",
    tier: "Cœur de métier",
    icon: "identity",
  },
  {
    title: "Supports salon & print",
    description:
      "Stands, kakémonos, brochures : visibles face aux géants du secteur.",
    tier: "Cœur de métier",
    icon: "print",
  },
  {
    title: "Site web & interfaces",
    description:
      "Vitrines et interfaces qui reflètent la précision de votre travail.",
    tier: "Cœur de métier",
    icon: "web",
  },
  {
    title: "Automatisation de supports",
    description:
      "Des systèmes qui produisent vos contenus à volume, sans repartir de zéro.",
    tier: "Complément",
    icon: "automation",
  },
  {
    title: "3D & motion design",
    description: "Rendre visible ce qui, jusqu'ici, ne se voyait pas.",
    tier: "Complément",
    icon: "motion",
  },
  {
    title: "Photo & vidéo",
    description:
      "Portraits d'équipe, reportage labo, contenus qui donnent un visage à votre technologie.",
    tier: "Complément",
    icon: "photo",
  },
];

export const results = [
  {
    client: "CEA Startups",
    title: "Portfolio annuel automatisé",
    body: "Produit à la main sous InDesign, il mobilisait deux semaines par édition et plafonnait la capacité. J'ai conçu la solution, le modèle de données et le gabarit, puis piloté le développement.",
    kpi: "10 min",
    kpiLabel:
      "contre deux semaines. 40 à 80 structures traitées par édition, 50 heures gagnées.",
  },
  {
    client: "CEA-Leti · FAMES",
    title: "Deux ans de production continue",
    body: "Une chargée de communication seule sur un projet européen, sans ressource créative interne, avec des échéances permanentes. Je produis ses supports depuis deux ans.",
    kpi: "< 5 jours",
    kpiLabel:
      "de délai sur la grande majorité des demandes. Contrat reconduit deux années de suite.",
  },
  {
    client: "CEA Éco-innovation",
    title: "Un outil métier enfin lisible",
    body: "Les monteurs de projets devaient évaluer l'impact environnemental de leurs dossiers sans passer par un tableur illisible. J'ai cadré le besoin, conçu l'interface et coordonné le développement.",
    kpi: "1 outil",
    kpiLabel:
      "déployé et utilisé, sur un sujet que plusieurs équipes n'avaient pas réussi à formaliser.",
  },
] as const;
