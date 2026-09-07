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
  return (
    <>
      {start}{" "}
      <em className="accent hl hl--scroll">{accent}</em>
      {end ? ` ${end}` : null}
    </>
  );
}
