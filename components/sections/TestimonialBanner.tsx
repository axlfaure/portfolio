import { Avatar } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import { getFeaturedTestimonial } from "@/lib/content";

/** Respiration pleine largeur. Contenu issu du témoignage marqué `featured`. */
export function TestimonialBanner() {
  const featured = getFeaturedTestimonial();
  if (!featured) return null;

  return (
    <section className="relative isolate overflow-hidden bg-sunk">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 58% at 24% 22%, rgba(255,255,255,.85), transparent 68%)," +
            "radial-gradient(50% 62% at 78% 76%, rgba(255,255,255,.7), transparent 70%)",
        }}
      />

      <figure
        data-reveal
        className="container-site flex flex-col items-center py-[clamp(3.5rem,8vw,6rem)] text-center"
      >
        <Stars rating={featured.rating} size={16} />

        <blockquote className="mt-6 max-w-[42rem] text-[clamp(1.25rem,3vw,1.85rem)] font-semibold leading-[1.28] tracking-[-0.025em] text-ink text-balance">
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
