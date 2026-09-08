import { Context } from "@/components/sections/Context";
import { Etiquette } from "@/components/sections/Etiquette";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Parcours } from "@/components/sections/Parcours";
import { Projects } from "@/components/sections/Projects";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { TestimonialBanner } from "@/components/sections/TestimonialBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Context />
      <Projects />
      <TestimonialBanner />
      <Services />

      {/* ----------------------------------------------------------------
          COMPARAISON TEMPORAIRE — deux versions de la section « spécialiste ».
          Une fois le choix fait, garder une seule des deux et retirer les
          étiquettes ainsi que Etiquette.tsx.
          ---------------------------------------------------------------- */}
      <Etiquette>Version A — la démonstration par le brief</Etiquette>
      <Expertise />
      <Etiquette>Version B — le parcours d&apos;une idée</Etiquette>
      <Parcours />

      <About />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
