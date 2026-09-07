import Image from "next/image";
import { Avatar } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import { getFeaturedTestimonial, getProjects } from "@/lib/content";

/** Respiration pleine largeur. Contenu issu du témoignage marqué `featured`. */
export async function TestimonialBanner() {
  const featured = await getFeaturedTestimonial();
  if (!featured) return null;

  /*
   * Le visuel de fond vient du projet, pas du témoignage : c'est le projet qui
   * cite son client, la relation n'existe que dans ce sens. On la remonte ici
   * plutôt que d'ajouter un champ à remplir deux fois.
   *
   * La couverture d'abord, la première cellule du bento à défaut : un projet
   * peut n'avoir que l'une ou que l'autre.
   */
  const projet = (await getProjects()).find(
    (p) => p.testimonial === featured.slug,
  );
  const fond = projet?.cover ?? projet?.panels[0] ?? null;

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

        {/* Les deux halos clairs passent au-dessus du visuel : ils rouvrent le
            centre, là où tombe la citation. */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 58% at 24% 22%, rgba(255,255,255,.85), transparent 68%)," +
              "radial-gradient(50% 62% at 78% 76%, rgba(255,255,255,.7), transparent 70%)",
          }}
        />
      </span>

      <figure
        data-reveal
        className="container-site flex flex-col items-center py-[clamp(3.5rem,8vw,6rem)] text-center"
      >
        <Stars rating={featured.rating} size={16} />

        <blockquote className="mt-6 max-w-[54rem] text-[clamp(1.25rem,3vw,1.85rem)] font-semibold leading-[1.28] tracking-[-0.025em] text-ink text-balance">
          « {featured.quote} »
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
    </section>
  );
}
