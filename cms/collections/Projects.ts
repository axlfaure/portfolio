import type { CollectionConfig } from "payload";
import { orderField, slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/**
 * Projets du portfolio.
 *
 * Trois jeux de visuels distincts, parce que le site les met en scène de trois
 * façons et qu'un seul champ obligerait à recadrer un même fichier pour des
 * cadres incompatibles :
 *
 * - `cover` alimente le bandeau défilant (portrait 2/3) et la grille de la page
 *   Projets (4/3). Un visuel, deux recadrages automatiques.
 * - `panels` compose le bento des cartes de la page d'accueil. Trois ou quatre
 *   visuels, dont l'ordre détermine la place : la grille alterne des cellules
 *   larges (~1,6) et presque carrées (~1,07), plus un bandeau (~2,7) en bas
 *   quand il n'y en a que trois.
 * - `gallery` alimente la page du projet, avec sa propre disposition.
 *
 * Aucun n'est obligatoire : un champ vide affiche un emplacement en pointillés
 * plutôt qu'un trou, ce qui permet de publier un projet avant d'avoir ses
 * visuels.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Projet", plural: "Projets" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["cover", "title", "client", "featured", "order"],
    group: "Contenu",
  },
  hooks: revalidate((doc) => [HOME, "/projets", `/projets/${doc.slug}`]),
  defaultSort: "order",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Fiche",
          fields: [
            { name: "client", type: "text", required: true, label: "Client" },
            {
              name: "title",
              type: "text",
              required: true,
              label: "Titre",
              admin: {
                description:
                  "Le résultat obtenu, pas la prestation. « Deux ans de production sans interruption » plutôt que « Supports print ».",
              },
            },
            {
              name: "short",
              type: "text",
              required: true,
              label: "Titre court",
              admin: { description: "Pour le bandeau défilant, où la place manque." },
            },
            {
              name: "teaser",
              type: "textarea",
              label: "Accroche",
              admin: {
                description:
                  "Une phrase, affichée sur les cartes. C'est souvent la seule chose qui sera lue.",
              },
            },
            {
              name: "disciplines",
              type: "array",
              label: "Disciplines",
              admin: {
                description: "Étiquettes des cartes, et filtres de la page Projets.",
                components: { RowLabel: "@/cms/components/RowLabels#ValueRowLabel" },
              },
              fields: [{ name: "value", type: "text", required: true, label: "Discipline" }],
            },
            {
              name: "tags",
              type: "text",
              label: "Disciplines condensées",
              admin: { description: "Version courte pour le bandeau défilant." },
            },
            {
              name: "year",
              type: "number",
              label: "Année",
              admin: { description: "Laissée vide, elle n'est affichée nulle part." },
            },
            {
              name: "kpis",
              type: "array",
              label: "Chiffres clés",
              maxRows: 3,
              admin: { components: { RowLabel: "@/cms/components/RowLabels#KpiRowLabel" } },
              fields: [
                { name: "value", type: "text", required: true, label: "Valeur" },
                { name: "label", type: "text", required: true, label: "Libellé" },
              ],
            },
            {
              name: "testimonial",
              type: "relationship",
              relationTo: "testimonials",
              label: "Témoignage associé",
              admin: { description: "Affiché dans la carte du projet sur la page d'accueil." },
            },
          ],
        },
        {
          label: "Visuels",
          fields: [
            {
              name: "cover",
              type: "upload",
              relationTo: "media",
              label: "Visuel principal",
              admin: {
                description:
                  "Bandeau défilant et grille de la page Projets. Recadré automatiquement en portrait et en 4/3.",
              },
            },
            {
              name: "panels",
              type: "array",
              label: "Bento de la page d'accueil",
              minRows: 0,
              maxRows: 4,
              admin: {
                description:
                  "L'ordre fixe la place. À quatre visuels : carrée, large, large, carrée. À trois : large, carrée, puis un bandeau pleine largeur. Chaque ligne repliée annonce sa case.",
                components: { RowLabel: "@/cms/components/RowLabels#PanelRowLabel" },
              },
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true, label: "Visuel" },
              ],
            },
            {
              name: "gallery",
              type: "array",
              label: "Galerie de la page projet",
              admin: {
                description: "Visuels de détail, sous le récit du projet.",
                components: { RowLabel: "@/cms/components/RowLabels#GalleryRowLabel" },
              },
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true, label: "Visuel" },
              ],
            },
          ],
        },
        {
          label: "Récit",
          fields: [
            {
              name: "body",
              type: "richText",
              label: "Contenu de la page projet",
              admin: {
                description:
                  "Structure attendue : un titre « Le contexte », puis un titre « Ce que j'ai fait ».",
              },
            },
          ],
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Afficher sur la page d'accueil",
      admin: {
        position: "sidebar",
        description: "Les projets cochés deviennent les cartes empilées de l'accueil.",
      },
    },
    orderField,
    slugField("Détermine l'URL : /projets/mon-identifiant"),
  ],
};
