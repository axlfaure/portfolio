import type { Metadata } from "next";
import { ComparatifOffres } from "@/components/sections/ComparatifOffres";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getOffersSection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Offres",
  description:
    "Trois façons de travailler ensemble : au projet, à l'année ou sur mesure. Le détail de ce que comprend chacune, ligne par ligne.",
  alternates: { canonical: "/offres" },
};

export default async function OffresPage() {
  const section = await getOffersSection();

  return (
    <>
      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          as="h1"
          eyebrow="Offres"
          title={
            <>
              Le détail,{" "}
              <em className="accent hl hl--scroll">ligne par ligne.</em>
            </>
          }
          lead="Trois façons de travailler ensemble. Ce tableau dit exactement ce que comprend chacune, y compris ce qu'elle ne comprend pas."
        />

        <ComparatifOffres offres={section?.offers ?? []} />
      </div>

      <FinalCta />
    </>
  );
}
