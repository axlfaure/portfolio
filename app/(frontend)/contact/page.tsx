import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/lib/site";

/**
 * Cette page existe pour une raison mesurée, pas par convention.
 *
 * `/contact/` est une adresse de l'ancien site WordPress. Elle reste indexée,
 * pèse 14 impressions à la position 7,71, la meilleure du site hors nom
 * propre, et répondait 404 depuis la refonte : quelqu'un qui cherchait à
 * écrire recevait une erreur. Un renvoi vers l'ancre de l'accueil aurait
 * suffi au visiteur, mais une page qui répond 200 peut se classer pour
 * elle-même, ce qu'une redirection ne fait jamais.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire, appeler ou réserver trente minutes avec Axel Faure, designer graphique tech et industrie à Grenoble. Réponse sous 24 heures.",
  alternates: { canonical: "/contact" },
};

/** Ligne de coordonnée : intitulé à gauche, valeur à droite. */
function Ligne({
  intitule,
  children,
}: {
  intitule: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[0.85rem] font-semibold text-label">{intitule}</dt>
      <dd className="text-[0.95rem] text-ink-2 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </dd>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          as="h1"
          eyebrow="Contact"
          title={
            <>
              Un interlocuteur,{" "}
              <em className="accent hl hl--scroll">pas un formulaire.</em>
            </>
          }
          lead="Le plus court est de prendre trente minutes : vous décrivez votre contexte, je vous dis ce que je reprendrais en priorité. Visio ou téléphone, réponse sous 24 heures."
        />

        <dl
          className="mt-[clamp(2.5rem,6vw,3.5rem)] max-w-[46rem] rounded-card border border-line bg-surface px-6 py-2"
          data-reveal
        >
          <Ligne intitule="Courriel">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </Ligne>
          <Ligne intitule="Téléphone">
            <a href="tel:+33648783970" className="num tabular-nums">
              06 48 78 39 70
            </a>
          </Ligne>
          <Ligne intitule="Atelier">42 quai de France, 38000 Grenoble</Ligne>
          <Ligne intitule="Secteur">
            {site.city}, Isère et Auvergne-Rhône-Alpes, et à distance partout
            ailleurs
          </Ligne>
          <Ligne intitule="Réseaux">
            <a href={site.linkedin} rel="me noreferrer" target="_blank">
              LinkedIn
            </a>
            {" · "}
            <a href={site.instagram} rel="me noreferrer" target="_blank">
              Instagram
            </a>
          </Ligne>
        </dl>
      </div>

      <FinalCta />
    </>
  );
}
