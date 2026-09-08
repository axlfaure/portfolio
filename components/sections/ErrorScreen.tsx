import type { ReactNode } from "react";

/**
 * Écran d'erreur du site public, partagé par le 404 et la panne serveur.
 *
 * Une page d'erreur est presque toujours traitée comme un cul-de-sac. C'est
 * pourtant l'une des rares pages qu'un visiteur lit en entier, faute d'autre
 * chose à faire : elle mérite la même écriture que le reste, et surtout des
 * sorties. D'où la reprise du geste de marque du site, le trait tracé sous
 * l'accent en italique, et trois chemins plutôt qu'un lien vers l'accueil.
 *
 * Le code d'erreur est posé en très grand derrière le titre, dans la police à
 * chasse fixe des chiffres. Il est décoratif : `aria-hidden`, doublé par le
 * surtitre qui, lui, se lit.
 *
 * Aucun état, aucun effet : le composant traverse donc sans bruit la frontière
 * serveur / client, ce dont `error.tsx` a besoin puisque Next impose qu'il
 * soit un composant client.
 */
export function ErrorScreen({
  code,
  eyebrow,
  titleStart,
  titleAccent,
  lead,
  actions,
  footnote,
  animerAccent = true,
  plein = false,
}: {
  /** Affiché en grand derrière le titre. Deux ou trois caractères. */
  code: string;
  eyebrow: string;
  titleStart: string;
  /** Passe en italique accentué, souligné du trait tracé. */
  titleAccent: string;
  lead: ReactNode;
  actions: ReactNode;
  footnote?: ReactNode;
  /**
   * Faut-il tracer le trait sous l'accent, ou le poser d'emblée ?
   *
   * `global-not-found` rend son document hors de la mise en page du site, et
   * l'animation y reste en pause à zéro : le trait ne se dessine jamais.
   * Mesuré, pas supposé — la même page servie par le groupe public la joue
   * jusqu'au bout. Un trait absent étant pire qu'un trait immobile, cette
   * page-là le pose sans animation.
   */
  animerAccent?: boolean;
  /**
   * Occuper toute la fenêtre.
   *
   * Réservé à la page servie hors de la mise en page du site : elle n'a ni
   * en-tête ni pied de page, et le dégradé du fond s'arrêtait net au milieu
   * de l'écran, en travers. Ailleurs, le pied de page ferme la composition.
   */
  plein?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center overflow-hidden ${plein ? "min-h-dvh" : "min-h-[68vh]"}`}
    >
      {/* Le fond dérivant du hero, repris tel quel : c'est ce qui rattache
          la page au reste du site avant même qu'on ait lu une ligne. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="hero-blob hero-blob-a" />
        <span className="hero-blob hero-blob-b" />
        <span className="hero-blob hero-blob-c" />
      </div>

      {/* Le code en très grand, calé à droite et débordant du cadre.
          Derrière le titre il passait pour une bavure ; à côté, il devient
          ce qu'il est, une pièce de composition. Il disparaît sous 64rem,
          où il n'y a plus de place pour deux colonnes. */}
      <span
        aria-hidden="true"
        className="num pointer-events-none absolute -right-[0.08em] top-1/2 hidden -translate-y-1/2 select-none font-mono text-[clamp(12rem,22vw,20rem)] font-bold leading-[0.8] text-line-2 opacity-70 lg:block"
      >
        {code}
      </span>

      <div className="container-site relative w-full section">
        <div className="relative max-w-[46rem]">
          <div className="relative">
            <p className="eyebrow">{eyebrow}</p>

            <h1 className="h1 mt-6 max-w-[16ch]">
              {titleStart}{" "}
              <em
                className={`accent hl${animerAccent ? " hl--draw" : ""}`}
                style={{ "--hl-delay": "420ms" } as React.CSSProperties}
              >
                {titleAccent}
              </em>
            </h1>

            <p className="lead mt-6 max-w-[42ch]">{lead}</p>

            <div className="mt-10 flex flex-wrap gap-3">{actions}</div>

            {footnote && (
              <p className="mt-12 border-t border-line pt-7 text-[0.9rem] text-muted">
                {footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
