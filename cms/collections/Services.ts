import type { CollectionConfig } from "payload";
import { orderField, slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/** Les six pictogrammes de service dessinés dans `ServiceIcon`. */
const SERVICE_ICONS = ["identity", "print", "web", "automation", "motion", "photo"] as const;

/** Le jeu générique de `FeatureIcon`, pour les livrables. */
const FEATURE_ICONS = [
  "palette", "book", "kit", "file", "layers", "doc",
  "code", "chart", "box", "camera", "play", "check",
  "users", "exchange", "clock",
] as const;

const options = (values: readonly string[]) => values.map((value) => ({ label: value, value }));

/**
 * Pages de service.
 *
 * La mise en page est fixe et vit dans le code : le CMS ne pilote que les
 * textes, exactement comme demandé. Chaque champ correspond à un bloc visible
 * de la page, dans l'ordre où on le rencontre en lisant.
 *
 * `pricing` reste facultatif : sans fourchette renseignée, la page bascule
 * d'elle-même sur « sur devis » plutôt que d'afficher un montant inventé.
 */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tier", "order"],
    group: "Contenu",
  },
  hooks: revalidate((doc) => [HOME, "/services", `/services/${doc.slug}`]),
  defaultSort: "order",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identité",
          fields: [
            { name: "title", type: "text", required: true, label: "Nom du service" },
            {
              name: "heading",
              type: "text",
              required: true,
              label: "Titre de la page",
              admin: { description: "Le H1. C'est lui qui porte la requête visée." },
            },
            {
              name: "short",
              type: "text",
              required: true,
              label: "Description d'une ligne",
              admin: { description: "Sur la carte de la page d'accueil et dans le menu." },
            },
            {
              name: "tier",
              type: "select",
              required: true,
              defaultValue: "Cœur de métier",
              label: "Niveau",
              options: options(["Cœur de métier", "Complément"]),
            },
            {
              name: "icon",
              type: "select",
              required: true,
              defaultValue: "identity",
              label: "Pictogramme",
              options: options(SERVICE_ICONS),
            },
            {
              name: "lead",
              type: "textarea",
              required: true,
              label: "Chapô",
              admin: { description: "Le paragraphe sous le titre de la page." },
            },
            {
              name: "duration",
              type: "text",
              label: "Durée indicative",
              admin: { description: "Encart de tête, ligne « Délais »." },
            },
          ],
        },
        {
          label: "Contenu",
          fields: [
            {
              name: "forWho",
              type: "array",
              label: "Pour qui",
              admin: {
                description: "Affiché en liste à puces cochées.",
                components: { RowLabel: "@/cms/components/RowLabels#ValueRowLabel" },
              },
              fields: [{ name: "value", type: "text", required: true, label: "Profil" }],
            },
            {
              name: "deliverables",
              type: "array",
              label: "Livrables",
              admin: {
                description: "Grille bento avec un pictogramme par ligne.",
                components: { RowLabel: "@/cms/components/RowLabels#DeliverableRowLabel" },
              },
              fields: [
                { name: "name", type: "text", required: true, label: "Livrable" },
                {
                  name: "icon",
                  type: "select",
                  required: true,
                  defaultValue: "check",
                  label: "Pictogramme",
                  options: options([...SERVICE_ICONS, ...FEATURE_ICONS]),
                },
                { name: "detail", type: "text", required: true, label: "Précision" },
              ],
            },
            {
              name: "process",
              type: "array",
              label: "Déroulé",
              admin: {
                description: "Chronologie verticale, avec jauge de progression au défilement.",
                components: { RowLabel: "@/cms/components/RowLabels#StepRowLabel" },
              },
              fields: [
                { name: "step", type: "text", required: true, label: "Étape" },
                { name: "duration", type: "text", required: true, label: "Durée" },
                { name: "body", type: "textarea", required: true, label: "Description" },
              ],
            },
            {
              name: "engagements",
              type: "array",
              label: "Formats d'engagement",
              admin: { components: { RowLabel: "@/cms/components/RowLabels#EngagementRowLabel" } },
              fields: [
                { name: "name", type: "text", required: true, label: "Format" },
                { name: "best", type: "text", required: true, label: "Idéal pour" },
                {
                  name: "points",
                  type: "array",
                  label: "Avantages",
                  admin: { components: { RowLabel: "@/cms/components/RowLabels#ValueRowLabel" } },
                  fields: [{ name: "value", type: "text", required: true, label: "Avantage" }],
                },
              ],
            },
            {
              name: "faq",
              type: "array",
              label: "Questions propres au service",
              admin: { components: { RowLabel: "@/cms/components/RowLabels#QaRowLabel" } },
              fields: [
                { name: "q", type: "text", required: true, label: "Question" },
                { name: "a", type: "textarea", required: true, label: "Réponse" },
              ],
            },
            {
              name: "projects",
              type: "relationship",
              relationTo: "projects",
              hasMany: true,
              label: "Projets illustrant ce service",
            },
            { name: "body", type: "richText", label: "Mise en perspective" },
          ],
        },
        {
          label: "Tarifs et visuels",
          fields: [
            {
              name: "pricing",
              type: "group",
              label: "Fourchette",
              admin: {
                description:
                  "Laisser vide affiche « sur devis ». Ne rien inventer : un montant faux coûte plus cher qu'une absence de montant.",
              },
              fields: [
                { name: "from", type: "text", label: "À partir de" },
                { name: "range", type: "text", label: "Fourchette complète" },
              ],
            },
            { name: "contextImage", type: "upload", relationTo: "media", label: "Visuel du contexte" },
            { name: "visual", type: "upload", relationTo: "media", label: "Visuel des livrables" },
          ],
        },
        {
          label: "Référencement",
          fields: [
            { name: "metaTitle", type: "text", required: true, label: "Titre de l'onglet" },
            {
              name: "metaDescription",
              type: "textarea",
              required: true,
              label: "Description",
              admin: { description: "155 caractères environ. C'est le texte affiché sous le lien dans Google." },
            },
          ],
        },
      ],
    },
    orderField,
    slugField("Détermine l'URL : /services/mon-identifiant"),
  ],
};
