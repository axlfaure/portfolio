import Image from "next/image";
import { Avatar } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import { getFeaturedTestimonial } from "@/lib/content";
import { estImage, estVideo } from "@/lib/fichiers";
import { typo } from "@/lib/typo";

/**
 * Dégradé de masque du fond : il le fait naître et mourir dans la couleur de
 * la section plutôt que de le couper net sur les bords. Partagé par l'image et
 * la vidéo, qui doivent se superposer exactement.
 */
const VOILE =
  "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)";

/** Respiration pleine largeur. Contenu issu du témoignage marqué `featured`. */
export async function TestimonialBanner() {
  const featured = await getFeaturedTestimonial();
  if (!featured) return null;

  /*
   * Le fond est un choix, jamais un repli.
   *
   * Il retombait auparavant sur la couverture du projet lié quand le champ
   * était vide. L'intention était bonne — ne jamais laisser la bande nue —
   * mais une couverture est cadrée pour une vignette, pas pour une bande
   * pleine largeur derrière du texte, et le résultat s'imposait sans avoir
   * été voulu. Rien n'est désormais affiché qui n'ait été déposé pour cet
   * emplacement.
   *
   * Les deux champs sont filtrés par la nature du fichier, pas seulement par
   * sa présence : une vidéo déposée dans le champ d'image finissait sinon
   * dans une balise `img`, qui n'affichait qu'un cadre vide.
   */
  const fond = estImage(featured.background) ? featured.background : null;
  const video = estVideo(featured.backgroundVideo)
    ? featured.backgroundVideo
    : null;

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
            style={{ maskImage: VOILE }}
          />
        )}

        {/*
         * La vidéo se pose par-dessus l'image, qui reste dessous.
         *
         * Deux services d'un seul geste : l'image tient lieu d'affiche le
         * temps que la vidéo arrive, et elle reprend seule la main sous
         * « réduire les animations », la classe `motion-reduce:hidden`
         * escamotant la vidéo sans qu'une ligne de JavaScript soit nécessaire.
         *
         * Muette, en lecture intégrée et en boucle : c'est l'exception que
         * iOS et Android autorisent à démarrer sans geste de l'utilisateur.
         */}
        {video && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-[0.13] [filter:grayscale(1)] motion-reduce:hidden"
            style={{ maskImage: VOILE }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={fond ?? undefined}
            tabIndex={-1}
          >
            <source src={video} />
          </video>
        )}

        {/* Les deux halos clairs passent au-dessus du visuel : ils dégagent le
            fond là où se pose le texte, désormais sur toute la largeur. */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 64% at 30% 26%, rgba(255,255,255,.85), transparent 70%)," +
              "radial-gradient(58% 66% at 72% 78%, rgba(255,255,255,.72), transparent 72%)",
          }}
        />
      </span>

      {/* Toute la largeur du conteneur, et tout aligné sur son bord gauche :
          la citation se lit comme un paragraphe, en drapeau, plutôt que comme
          une inscription centrée. */}
      <div className="container-site py-[clamp(3.5rem,8vw,6rem)]">
        <figure
          data-reveal
          className="flex w-full flex-col items-start text-left"
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
