import { Avatar } from "@/components/ui/Media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import { getTestimonials } from "@/lib/content";

export function Reviews() {
  const testimonials = getTestimonials();

  return (
    <section id="avis" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          index="05"
          eyebrow="Avis clients"
          meta={`${testimonials.length} témoignages`}
          title={<>Ce qu&apos;en disent les équipes que j&apos;accompagne.</>}
        />
      </div>

      <div className="mt-12">
        <Ticker
          duration={55}
          gap={1.25}
          items={testimonials.map((t) => (
            <figure
              key={t.slug}
              className="flex h-full w-[21rem] flex-col rounded-card border border-line bg-surface p-6"
            >
              <Stars rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avatar src={t.avatar} alt="" size={36} initials="··" />
                <span>
                  <span className="block text-[0.875rem] font-bold text-ink">
                    {t.name}
                  </span>
                  <span className="block text-[0.8rem] text-muted">
                    {t.role} · {t.org}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        />
      </div>
    </section>
  );
}
