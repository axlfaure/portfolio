import { sectionGlobal } from "../fields/section";

/**
 * Sections de la page d'accueil qui ne portent que leurs mots d'introduction.
 *
 * Leur contenu vient d'une collection — projets, services, témoignages,
 * questions — et seul l'en-tête leur appartient. Elles sont donc déclarées
 * d'un seul geste, à partir de la même fabrique : quatre formulaires
 * rigoureusement identiques, impossibles à faire diverger.
 */

export const ProjectsSection = sectionGlobal({
  slug: "projects-section",
  label: "Projets",
  description: "L'introduction au-dessus des cartes empilées, et la bande qui les referme.",
  lead: true,
  extra: [
    {
      name: "band",
      type: "group",
      label: "Bande de fin",
      admin: {
        description:
          "La phrase posée sur les visuels défilants, juste avant le bouton vers tous les projets.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "titleStart",
              type: "text",
              label: "Début",
              admin: { width: "60%" },
            },
            {
              name: "titleAccent",
              type: "text",
              label: "Fin accentuée",
              admin: { width: "40%" },
            },
          ],
        },
      ],
    },
  ],
});

export const ServicesSection = sectionGlobal({
  slug: "services-section",
  label: "Services",
  description: "L'introduction au-dessus de la grille des six services.",
});

export const ReviewsSection = sectionGlobal({
  slug: "reviews-section",
  label: "Avis",
  description: "L'introduction au-dessus des bandes de témoignages.",
});

export const FaqSection = sectionGlobal({
  slug: "faq-section",
  label: "FAQ",
  description: "L'introduction à côté des questions fréquentes.",
});
