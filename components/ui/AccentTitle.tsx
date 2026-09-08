import { typo, typoOpt } from "@/lib/typo";

/**
 * Titre de section, dont une partie passe en italique accentué.
 *
 * Le découpage vient du CMS, où le titre est saisi en trois champs : ce qui
 * précède l'accent, l'accent, et ce qui suit. C'est ce qui permet de rédiger
 * un titre sans écrire de balisage dans un formulaire.
 *
 * `end` reste vide dans la plupart des cas, l'accent tombant en fin de titre.
 * Quand il est rempli, l'espace qui le précède est ajouté ici : le laisser à
 * la saisie produirait des titres dont l'espacement dépend de la vigilance du
 * rédacteur.
 */
export function AccentTitle({
  start,
  accent,
  end,
}: {
  start: string;
  accent: string;
  end?: string;
}) {
  /*
   * Le texte passe par les règles typographiques françaises avant d'être
   * rendu : un titre de section se relit sur trois largeurs d'écran, et c'est
   * toujours là qu'un « à » finit seul en bout de ligne.
   */
  const fin = typoOpt(end);

  return (
    <>
      {typo(start)}{" "}
      <em className="accent hl hl--scroll">{typo(accent)}</em>
      {fin ? ` ${fin}` : null}
    </>
  );
}
