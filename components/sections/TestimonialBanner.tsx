import Image from "next/image";
import { Avatar } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import { getFeaturedTestimonial, getProjects } from "@/lib/content";
import { typo } from "@/lib/typo";

/** Respiration pleine largeur. Contenu issu du témoignage marqué `featured`. */
export async function TestimonialBanner() {
  const featured = await getFeaturedTestimonial();
  if (!featured) return null;

  /*
   * Le fond se choisit dans le témoignage, et retombe sur le projet à défaut.
   *
   * L'image du projet convient rarement telle quelle : une couverture est
   * cadrée pour une vignette, pas pour une bande pleine largeur derrière du
   * texte. Le champ dédié permet d'en poser une pensée pour cet emplacement,
   * sans perdre le repli automatique quand il est vide.
   *
   * Côté projet, la couverture d'abord, la première cellule du bento
   * ensuite : un projet peut n'avoir que l'une ou que l'autre.
   */
  const projet = (await getProjects()).find(
    (p) => p.testimonial === featured.slug,
  );
  const fond = featured.background ?? projet?.cover ?? projet?.panels[0] ?? null;

  return (
    <section className="relative isolate overflow-hidden bg-sunk">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/*
         * Le visuel reste sous la barre des 15 % d'opacité, en niveaux de gris.
         * Au-delà, ses aplats colorés se mettent à concurrencer la citation :
         * ce fond doit se deviner, pas se regarder. Le dégradé de masque le
         * fait naître et mourir dans le fond de la section plutôt que de le
         * couper net sur les bords.
         */}
        {fond && (
          <Image
            src={fond}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.13] [filter:grayscale(1)]"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
            }}
          />
        )}

        {/* Les deux halos clairs passent au-dessus du visuel : ils dégagent le
            fond là où se pose le texte. Ils ont suivi la citation vers la
            droite, sans quoi ils éclairaient une zone vide et laissaient
            l'image concurrencer la lecture. */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 62% at 64% 26%, rgba(255,255,255,.85), transparent 68%)," +
              "radial-gradient(54% 66% at 84% 78%, rgba(255,255,255,.72), transparent 70%)",
          }}
        />
      </span>

      {/*
       * Le bloc se range à droite du conteneur, et tout s'aligne à son bord
       * gauche : la citation se lit alors comme un paragraphe, en drapeau,
       * plutôt que comme une inscription centrée.
       *
       * Sur écran étroit il reprend toute la largeur : décaler un bloc à
       * droite dans une colonne de 330 px ne décale rien du tout.
       */}
      <div className="container-site flex justify-end py-[clamp(3.5rem,8vw,6rem)]">
        <figure
          data-reveal
          className="flex w-full flex-col items-start text-left md:w-[68%] lg:w-[60%]"
        >
          <Stars rating={featured.rating} size={16} />

          {/*
           * Ni largeur maximale ni `text-balance` : le texte occupe toute la
           * colonne et ses lignes se coupent où la mesure l'impose.
           *
           * `text-pretty` le remplace et ne fait pas la même chose : là où
           * `balance` égalise toutes les lignes, celui-ci se contente
           * d'empêcher qu'un mot seul termine le paragraphe. Le drapeau est
           * conservé, la ligne orpheline évitée. À retirer d'un mot si tu
           * préfères la coupe strictement naturelle.
           *
           * Les guillemets sont passés dans la chaîne plutôt que posés dans
           * le balisage : les règles typographiques ne voient que du texte, et
           * c'est ainsi que le chevron fermant reste collé au dernier mot. Il
           * tombait sinon seul sur sa ligne, dix-sept pixels de large.
           *
           * La taille monte de 1,1 à 1,4 rem entre le téléphone et 1280 px,
           * puis se fige : au-delà, une citation qui continue de grossir
           * repasserait devant le titre de section qui la précède.
           */}
          <blockquote className="mt-6 w-full text-pretty text-[clamp(1.1rem,0.9rem+0.65vw,1.4rem)] font-semibold leading-[1.5] tracking-[-0.012em] text-ink">
            {typo(`« ${featured.quote} »`)}
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-3">
            <Avatar src={featured.avatar} alt="" size={44} initials="··" />
            <span className="text-left">
              <span className="block text-[0.9rem] font-bold text-ink">
                {featured.name}
              </span>
              <span className="block text-[0.85rem] text-muted">
                {featured.role} · {featured.org}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
