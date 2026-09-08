/**
 * Règles typographiques françaises appliquées au texte venu du CMS.
 *
 * Elles ne relèvent pas de la rédaction : personne ne saisit d'espace
 * insécable dans un formulaire, et un texte relu dix fois se retrouve quand
 * même avec un « à » seul en fin de ligne dès qu'on change la largeur de
 * l'écran. Le code s'en charge donc au rendu.
 *
 * Deux règles seulement, celles dont l'absence se voit :
 *
 * 1. Un mot d'une lettre reste collé à ce qui suit. « à », « y », mais aussi
 *    les élisions « l' » et « d' » qui ne se coupent jamais. C'est la veuve la
 *    plus fréquente sur téléphone, et la plus laide.
 * 2. Les signes doubles — deux-points, point-virgule, point d'exclamation et
 *    d'interrogation, guillemets français — portent une espace fine
 *    insécable. Sans elle, le « ? » d'une question de la FAQ peut ouvrir la
 *    ligne suivante, tout seul.
 *
 * Rien de plus. Lier tous les mots de deux lettres est la règle des
 * imprimeurs, mais sur une colonne de 340 px cela produit des lignes trop
 * courtes : le remède devient pire que le mal.
 */

/** Espace insécable ordinaire. */
const INSECABLE = " ";

/** Espace fine insécable, celle qui précède les signes doubles en français. */
const FINE = " ";

/**
 * Applique les règles à une chaîne.
 *
 * La fonction est idempotente : réappliquée à un texte déjà traité, elle le
 * laisse tel quel. Elle peut donc traverser plusieurs composants sans qu'on
 * ait à savoir lequel l'a déjà vue.
 */
export function typo(texte: string): string {
  return (
    texte
      // Un mot d'une lettre, en début de texte ou après une espace, se lie au
      // mot suivant. La classe exclut volontairement les chiffres : « 5 ans »
      // doit rester coupable, sinon les chiffres du hero débordent.
      .replace(/(^|[\s(«])([A-Za-zÀ-ÖØ-öø-ÿ]) +/g, `$1$2${INSECABLE}`)
      // Élisions : l', d', n', qu' ne se séparent jamais de leur mot.
      .replace(/([A-Za-zÀ-ÖØ-öø-ÿ]['’]) +/g, "$1")
      // Espace fine devant les signes doubles.
      .replace(/ +([;:!?])/g, `${FINE}$1`)
      // Guillemets français : fine à l'intérieur, rien à l'extérieur.
      .replace(/« +/g, `«${FINE}`)
      .replace(/ +»/g, `${FINE}»`)
  );
}

/**
 * Variante tolérante, pour les champs facultatifs du CMS.
 *
 * Un champ vide vaut `undefined` et non la chaîne vide : le composant appelant
 * teste souvent sa présence pour décider d'afficher une balise, et lui rendre
 * `""` inverserait ce test.
 */
export function typoOpt(texte: string): string;
export function typoOpt(texte: null | undefined): undefined;
export function typoOpt(texte: string | null | undefined): string | undefined;
export function typoOpt(texte: string | null | undefined): string | undefined {
  return typeof texte === "string" ? typo(texte) : undefined;
}
