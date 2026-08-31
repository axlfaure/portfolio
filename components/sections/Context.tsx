export function Context() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="h-px w-full bg-line" />

        <div className="flex flex-col items-center pt-12 text-center" data-reveal>
          <p className="eyebrow flex items-baseline gap-3">
            <span className="text-ink-2">01</span>
            <span>Le contexte</span>
          </p>

          <h2 className="h2 mt-6 max-w-[20ch]">
            Vous êtes seul, ou trop peu, à porter la communication de votre
            structure.
          </h2>

          <div className="mt-10 max-w-[38rem] space-y-6">
            <p className="text-muted text-balance">
              Vous couvrez l&apos;événementiel, le web, les réseaux, le print et
              parfois la presse. Personne en interne ne sait faire de création.
              Les experts veulent tout montrer et c&apos;est à vous de trancher.
              Les dates de salon, elles, ne bougent pas.
            </p>
            <p className="text-muted text-balance">
              Alors chaque projet recommence pareil : trouver un prestataire,
              lui réexpliquer votre métier, coordonner deux ou trois
              intervenants, et vérifier que la charte survit à
              l&apos;opération.
            </p>
          </div>

          <p className="mt-10 border-t border-line pt-8 text-[1.22rem] font-semibold leading-snug text-ink">
            Mon travail consiste à supprimer cette étape.
          </p>
        </div>
      </div>
    </section>
  );
}
