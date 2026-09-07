import { Avatar } from "@/components/ui/Media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import type { Testimonial } from "@/lib/content";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ReviewsCarousel } from "@/components/ui/ReviewsCarousel";
import { cn } from "@/lib/cn";
import { getReviewsSection, getTestimonials } from "@/lib/content";

function Card({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className: string;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col rounded-card border border-line bg-surface p-6",
        className,
      )}
    >
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
        « {testimonial.quote} »
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar src={testimonial.avatar} alt="" size={36} initials="··" />
        <span>
          <span className="block text-[0.875rem] font-bold text-ink">
            {testimonial.name}
          </span>
          <span className="block text-[0.8rem] text-muted">
            {testimonial.role} · {testimonial.org}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export async function Reviews() {
  const testimonials = await getTestimonials();
  const tete = await getReviewsSection();
  // Seconde rangée dans l'ordre inverse : avec un défilement opposé, les deux
  // bandes ne présentent jamais la même carte au même endroit.
  const second = [...testimonials].reverse();

  return (
    <section id="avis" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow={tete?.eyebrow ?? "Avis clients"}
          title={
            <AccentTitle
              start={tete?.titleStart ?? "Ce qu'en disent"}
              accent={tete?.titleAccent ?? "les équipes que j'accompagne."}
              end={tete?.titleEnd}
            />
          }
        />
      </div>

      {/* Sous 48rem, un carrousel : deux bandes qui glissent en sens inverse
          dans une fenêtre de 300 px ne se lisent ni l'une ni l'autre. */}
      <div className="container-site mt-12 md:hidden">
        <ReviewsCarousel
          items={testimonials.map((t) => (
            <Card key={t.slug} testimonial={t} className="w-full" />
          ))}
        />
      </div>

      <div className="mt-12 hidden flex-col gap-5 md:flex">
        <Ticker
          duration={55}
          gap={1.25}
          items={testimonials.map((t) => (
            <Card
              key={t.slug}
              testimonial={t}
              className="h-full w-[26rem] lg:w-[30rem]"
            />
          ))}
        />
        <Ticker
          duration={65}
          gap={1.25}
          reverse
          items={second.map((t) => (
            <Card
              key={t.slug}
              testimonial={t}
              className="h-full w-[26rem] lg:w-[30rem]"
            />
          ))}
        />
      </div>
    </section>
  );
}
