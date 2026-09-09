/**
 * Le détail du comparatif des offres.
 *
 * Il vit dans le code et non dans Payload, contrairement aux trois colonnes de
 * la page d'accueil, et c'est délibéré. Un tableau comparatif tient à une
 * contrainte que rien ne rappelle à celui qui le remplit : chaque ligne doit
 * porter une valeur pour CHAQUE colonne, sinon la lecture en travers se
 * décale et le tableau ment. Saisi dans un formulaire, ça tient trois mois.
 *
 * Ici, le type l'impose : `valeurs` est un tuple de trois entrées, une par
 * offre, et il est impossible d'en oublier une. Les noms et les tarifs, eux,
 * continuent de venir de Payload : ce sont les seules données que l'accueil et
 * cette page ont en commun, et elles ne doivent surtout pas être écrites deux
 * fois.
 */

/**
 * La valeur d'une ligne pour une colonne.
 *
 * `true` et `false` couvrent le compris et le non compris. Une chaîne sert
 * quand la réponse n'est pas binaire, ce qui arrive souvent : « deux »,
 * « illimités », « sous 5 jours ». Une case vide n'existe pas, c'est tout
 * l'intérêt.
 */
export type Valeur = boolean | string;

export type LigneComparatif = {
  label: string;
  /** Réserve affichée au survol, quand l'engagement mérite une nuance. */
  note?: string;
  /** Une valeur par colonne, dans l'ordre des offres. */
  valeurs: [Valeur, Valeur, Valeur];
};

export type GroupeComparatif = {
  titre: string;
  lignes: LigneComparatif[];
};

export const COMPARATIF: GroupeComparatif[] = [
  {
    titre: "La relation",
    lignes: [
      {
        label: "Interlocuteur unique, du premier appel à la livraison",
        valeurs: [true, true, true],
      },
      {
        label: "Échange direct avec votre ingénieur ou chercheur",
        valeurs: [true, true, true],
      },
      {
        label: "Conseil compris dans le prix",
        note: "Les échanges et les arbitrages sur ce qu'il faut produire. Un audit ou un plan de communication écrit reste une prestation.",
        valeurs: [true, true, true],
      },
      {
        label: "Places ouvertes par an",
        valeurs: ["Sans limite", "Quatre", "Sur étude"],
      },
    ],
  },
  {
    titre: "Le budget et la commande",
    lignes: [
      { label: "Devis à prix ferme avant de commencer", valeurs: [true, true, true] },
      {
        label: "Nombre de commandes à éditer",
        note: "Le vrai coût d'un petit support n'est pas son prix, c'est le circuit interne qu'il déclenche.",
        valeurs: ["Une par prestation", "Une pour l'année", "Une par projet"],
      },
      {
        label: "Grille tarifaire figée douze mois",
        valeurs: [false, true, false],
      },
      {
        label: "Remise sur la grille",
        valeurs: ["Aucune", "10 à 20 %", "Selon le volume"],
      },
      {
        label: "Budget non consommé",
        note: "Seule clause du contrat annuel : consommer 60 % de la commande. Au-delà, ce qui reste n'est pas facturé.",
        valeurs: ["Sans objet", "Non facturé au-delà de 60 %", "Sans objet"],
      },
    ],
  },
  {
    titre: "La production",
    lignes: [
      {
        label: "Allers-retours compris par prestation",
        valeurs: ["Deux", "Deux", "Selon le périmètre"],
      },
      { label: "Fichiers sources livrés", valeurs: [true, true, true] },
      {
        label: "Cession d'usage pour votre activité",
        note: "La revente à un tiers et la cession d'une identité à une autre structure font l'objet d'un avenant.",
        valeurs: [true, true, true],
      },
      {
        label: "Délai de livraison courant",
        note: "Le délai court à réception des éléments complets : textes, logos, données.",
        valeurs: ["Deux semaines", "Sous 5 jours", "Fixé au cadrage"],
      },
      {
        label: "Retard compensé par une remise",
        note: "10 % de remise par jour ouvré de retard, dans la limite de 30 %.",
        valeurs: [false, true, true],
      },
    ],
  },
  {
    titre: "Ce qu'on peut produire",
    lignes: [
      {
        label: "Print : kakémonos, affiches, brochures, posters",
        valeurs: [true, true, true],
      },
      {
        label: "Visuels scientifiques et schémas de procédé",
        valeurs: [true, true, true],
      },
      { label: "Identité, sous-marque, charte graphique", valeurs: [true, true, true] },
      { label: "Site web et interfaces", valeurs: [true, true, true] },
      { label: "3D, motion design, photo et vidéo", valeurs: [true, true, true] },
      {
        label: "Stand de salon complet, jusqu'à la fabrication",
        valeurs: [false, true, true],
      },
      {
        label: "Outil métier sur mesure pour vos supports récurrents",
        note: "Ce que vous automatisez, vous ne me le commandez plus. C'est précisément pour ça que je le propose, et pourquoi il se chiffre à part.",
        valeurs: [false, true, true],
      },
    ],
  },
];
