import type { Metadata } from "next";
import { Context } from "@/components/sections/Context";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Offers } from "@/components/sections/Offers";
import { Projects } from "@/components/sections/Projects";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { TestimonialBanner } from "@/components/sections/TestimonialBanner";
import { site } from "@/lib/site";

/**
 * L'accueil n'avait aucune métadonnée propre : il héritait entièrement de la
 * mise en page racine, qui ne déclare pas de canonique. Sans canonique, et
 * tant que `www.axelfaure.fr` répond 200 comme l'apex, Google choisit seul
 * laquelle des deux adresses indexer, et c'est la version `www` qu'il avait
 * retenue pour cette route.
 *
 * Ce bloc ne remplace ni le titre ni la description : les métadonnées de page
 * fusionnent avec celles de la racine, et seul ce qui est redéclaré ici est
 * remplacé.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Données structurées de l'accueil.
 *
 * Les pages service décrivent chacune une prestation ; aucune page ne décrivait
 * l'entreprise elle-même. C'est ce nœud qui dit à Google de quelle ville on
 * parle et jusqu'où on travaille, deux informations que 459 impressions
 * portant la mention « grenoble » réclamaient sans les trouver.
 *
 * Il ne remplace pas la fiche d'établissement Google : rien dans le code ne
 * fait entrer dans le pack local. Il rend seulement cohérent ce que le site
 * déclare de lui-même.
 *
 * Aucune note moyenne ici, même si les témoignages sont réels : un
 * `aggregateRating` demande des avis publiés sur la page, comptés et
 * vérifiables. Inventer la mesure se paie d'une sanction manuelle.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}#studio`,
  name: site.brand,
  alternateName: site.name,
  description: site.baseline,
  url: site.url,
  image: `${site.url}${site.logo}`,
  email: site.email,
  telephone: "+33648783970",
  founder: { "@type": "Person", name: site.name },
  address: {
    "@type": "PostalAddress",
    streetAddress: "42 quai de France",
    postalCode: "38000",
    addressLocality: site.city,
    addressRegion: "Auvergne-Rhône-Alpes",
    addressCountry: "FR",
  },
  areaServed: [
    { "@type": "City", name: "Grenoble" },
    { "@type": "AdministrativeArea", name: "Isère" },
    { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
  ],
  sameAs: [site.linkedin, site.instagram],
};

export default function HomePage() {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD généré côté serveur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <Context />
      <Projects />
      <TestimonialBanner />
      <Services />
      <Offers />
      <About />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
