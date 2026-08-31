import { CtaButton } from "@/components/ui/CtaButton";
import { Avatar } from "@/components/ui/Media";
import { Pill } from "@/components/ui/Pill";
import { CornerTicks } from "@/components/ui/SectionHeader";
import { availability, site } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="contact" className="section scroll-mt-24">
      <div className="container-site flex justify-center">
        <div
          data-reveal
          className="relative isolate w-full max-w-[52rem] overflow-hidden rounded-cta border border-line bg-surface px-6 py-[clamp(2.75rem,6vw,4rem)] text-center shadow-e2 sm:px-12">
          <span
            aria-hidden="true"
            className="grid-trame hero-grid pointer-events-none absolute inset-0 -z-10"
          />
          <CornerTicks className="absolute inset-0 z-10" />

          <Pill dot>{availability.label}</Pill>

          <h2 className="h2 mt-7">Parlons de votre projet.</h2>

          <p className="lead mx-auto mt-5 max-w-[38rem] text-balance">
            Trente minutes pour comprendre votre contexte et vous dire ce que je
            reprendrais en priorité. Visio ou téléphone, réponse sous 24 heures.
          </p>

          <div className="mt-9 flex justify-center">
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
          </div>

          <p className="eyebrow mt-10 border-t border-line pt-6">
            {site.city} · Isère · Réponse sous 24 h
          </p>
        </div>
      </div>
    </section>
  );
}
