import { Avatar } from "@/components/ui/Media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import type { Testimonial } from "@/lib/content";
import { getTestimonials } from "@/lib/content";

function Card({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full w-[21rem] flex-col rounded-card border border-line bg-surface p-6">
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
  // Seconde rangée dans l'ordre inverse : avec un défilement opposé, les deux
  // bandes ne présentent jamais la même carte au même endroit.
  const second = [...testimonials].reverse();

  return (
    <section id="avis" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow="Avis clients"
          title={
            <>
              Ce qu&apos;en disent{" "}
              <em className="accent hl hl--scroll">
                les équipes que j&apos;accompagne.
              </em>
            </>
          }
        />
      </div>

      <div className="mt-12 flex flex-col gap-5">
        <Ticker
          duration={55}
          gap={1.25}
          items={testimonials.map((t) => (
            <Card key={t.slug} testimonial={t} />
          ))}
        />
        <Ticker
          duration={65}
          gap={1.25}
          reverse
          items={second.map((t) => (
            <Card key={t.slug} testimonial={t} />
          ))}
        />
      </div>
    </section>
  );
}
