import { Context } from "@/components/sections/Context";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Results } from "@/components/sections/Results";
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
      <Results />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
