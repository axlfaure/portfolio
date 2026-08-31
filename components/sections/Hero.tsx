import Link from "next/link";
import { Counter } from "@/components/ui/Counter";
import { CtaButton } from "@/components/ui/CtaButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { Avatar } from "@/components/ui/Media";
import { Pill } from "@/components/ui/Pill";
import { CornerTicks } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import { getTestimonials } from "@/lib/content";
import { clientNames, heroStats } from "@/lib/data";
import { site } from "@/lib/site";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackground />

      <div className="container-site pb-[clamp(3.5rem,8vw,5.5rem)] pt-[clamp(3.5rem,8vw,6rem)]">
        <div data-hero-step="1">
          <Pill dot>{site.baseline}</Pill>
        </div>

        <h1 className="h1 mt-9 text-balance" data-hero-step="2">
          Votre expertise est complexe.
          <span className="block">
            Votre communication ne devrait pas l&apos;être.
          </span>
        </h1>

        <p className="lead mt-7 max-w-[44ch]" data-hero-step="3">
          Je développe la communication des structures innovantes en créant des
          visuels cohérents et adaptés à leur écosystème.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center gap-3"
          data-hero-step="4"
        >
          <CtaButton
            avatar={
              <Avatar
                src={site.portrait}
                alt="Portrait d'Axel Faure"
                size={40}
                initials="AF"
              />
            }
          />
          <GhostButton href="/projets" size="lg">
            Voir les réalisations
          </GhostButton>
        </div>

        <SocialProof />
        <Stats />
      </div>

      <div className="pb-[clamp(3.5rem,8vw,5.5rem)]" data-hero-step="6">
        <Ticker
          duration={40}
          gap={4}
          items={clientNames.map((name) => (
            <span
              key={name}
              className="whitespace-nowrap text-[1.05rem] font-semibold tracking-[-0.01em] text-label"
            >
              {name}
            </span>
          ))}
        />
      </div>
    </section>
  );
}

/**
 * Preuve sociale sous les boutons : visages clients, notation, et le
 * chiffre qui compte. Renvoie vers la section Avis.
 */
function SocialProof() {
  const testimonials = getTestimonials();

  return (
    <Link
      href="#avis"
      className="group mt-10 inline-flex flex-col gap-3"
      data-hero-step="5"
    >
      <span className="flex items-center gap-4">
        <span className="flex -space-x-2.5">
          {testimonials.slice(0, 4).map((t) => (
            <Avatar
              key={t.slug}
              src={t.avatar}
              alt=""
              size={36}
              initials="·"
              className="ring-2 ring-paper"
            />
          ))}
        </span>
        <Stars rating={5} size={16} />
      </span>

      <span className="eyebrow transition-colors duration-200 group-hover:text-ink">
        {site.socialProof}
      </span>
    </Link>
  );
}

/** Bandeau des quatre chiffres. */
function Stats() {
  return (
    <div
      data-hero-step="5"
      className="relative mt-[clamp(3rem,6vw,4.5rem)] overflow-hidden rounded-card border border-line bg-surface shadow-e1"
    >
      <CornerTicks className="absolute inset-0 z-10" />

      <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col bg-surface px-5 py-6 md:px-6 md:py-7"
          >
            <dt className="text-[clamp(1.75rem,3.6vw,2.35rem)] font-bold leading-none text-ink">
              <Counter value={stat.value} />
            </dt>
            <dd className="mt-2.5 text-[0.85rem] leading-snug text-muted">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
