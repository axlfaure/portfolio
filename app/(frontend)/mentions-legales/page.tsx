import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Mentions légales.
 *
 * Obligatoires pour tout site professionnel français : articles 6 III et 19 de
 * la loi pour la confiance dans l'économie numérique, complétés par le RGPD
 * pour la partie données personnelles.
 *
 * Le texte est écrit en dur plutôt que rangé dans le CMS. C'est une page qui
 * change une fois tous les trois ans, dont la moindre erreur engage, et dont
 * la structure n'a rien à faire dans un formulaire de rédaction. La mettre à
 * portée de clic dans l'administration inviterait à la retoucher sans relire
 * le reste.
 *
 * L'article sur la médiation de la consommation a été retiré : les
 * prestations s'adressent à des professionnels, et cette obligation ne pèse
 * que sur ceux qui contractent avec des consommateurs.
 */
export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergement, propriété intellectuelle et traitement des données personnelles du site d'Axel Faure.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

/** Date de la dernière révision, affichée en bas de page. */
const DERNIERE_MISE_A_JOUR = "8 septembre 2026";

/**
 * Identification de l'éditeur.
 *
 * L'adresse est écrite ici en clair plutôt que reprise de `site.email`, et
 * elle doit le rester même quand les deux coïncident, comme aujourd'hui. Une
 * mention légale engage juridiquement et doit donner un moyen de contact qui
 * fonctionne au moment où on la lit : la faire suivre automatiquement une
 * constante d'affichage, c'est accepter qu'elle devienne fausse le jour où
 * l'on annonce une adresse avant que la boîte existe.
 */
const EDITEUR = {
  formeJuridique: "Entreprise individuelle, régime de la micro-entreprise",
  siege: "42 quai de France, 38000 Grenoble",
  siret: "953 301 157 00038",
  tva: "Non applicable, article 293 B du code général des impôts",
  telephone: "06 48 78 39 70",
  courriel: "axelfaure64@gmail.com",
} as const;

function Section({
  numero,
  titre,
  children,
}: {
  numero: string;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`section-${numero}`}
      className="scroll-mt-28 border-t border-line pt-9"
      data-reveal
    >
      <div className="flex items-baseline gap-4">
        <span className="eyebrow num shrink-0 tabular-nums">{numero}</span>
        <h2 className="text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold leading-snug tracking-[-0.02em] text-ink">
          {titre}
        </h2>
      </div>

      <div className="mt-5 space-y-4 pl-0 text-[0.95rem] leading-relaxed text-ink-2 sm:pl-[3.1rem] [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

/** Ligne d'un bloc d'identification : intitulé à gauche, valeur à droite. */
function Ligne({
  intitule,
  children,
}: {
  intitule: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[0.85rem] font-semibold text-label">{intitule}</dt>
      <dd className="text-[0.95rem] text-ink-2">{children}</dd>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="container-site section">
      <header className="max-w-[42rem]" data-reveal>
        <p className="eyebrow">Informations légales</p>
        <h1 className="h1 mt-6">Mentions légales</h1>
        <p className="lead mt-6">
          Qui édite ce site, où il est hébergé, ce qu&apos;il fait des
          informations que vous y laissez, et ce que vous pouvez exiger à ce
          sujet.
        </p>
      </header>

      <div className="mt-[clamp(3rem,7vw,4.5rem)] max-w-[46rem] space-y-11">
        <Section numero="01" titre="Éditeur du site">
          <p>
            Le présent site est édité par {site.name}, exerçant en qualité de
            travailleur indépendant.
          </p>

          <dl className="mt-6 rounded-card border border-line bg-surface px-6 py-2">
            <Ligne intitule="Éditeur">{site.name}</Ligne>
            <Ligne intitule="Forme juridique">
              {EDITEUR.formeJuridique}
            </Ligne>
            <Ligne intitule="Siège">{EDITEUR.siege}</Ligne>
            <Ligne intitule="SIRET">
              <span className="num tabular-nums">{EDITEUR.siret}</span>
            </Ligne>
            <Ligne intitule="TVA">{EDITEUR.tva}</Ligne>
            <Ligne intitule="Courriel">
              <a href={`mailto:${EDITEUR.courriel}`}>{EDITEUR.courriel}</a>
            </Ligne>
            <Ligne intitule="Téléphone">
              <a href={`tel:+33${EDITEUR.telephone.replace(/\D/g, "").slice(1)}`}>
                {EDITEUR.telephone}
              </a>
            </Ligne>
            <Ligne intitule="Directeur de la publication">{site.name}</Ligne>
          </dl>
        </Section>

        <Section numero="02" titre="Hébergement">
          <p>
            Le site est hébergé par <strong>Infomaniak Network SA</strong>,
            société de droit suisse, Rue Eugène-Marziano 25, 1227 Les Acacias,
            Genève, Suisse. Téléphone : +41 22 820 35 44. Site :{" "}
            <a
              href="https://www.infomaniak.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              infomaniak.com
            </a>
            .
          </p>
          <p>
            Les données du site sont stockées dans les centres de données de
            l&apos;hébergeur, situés en Suisse.
          </p>
        </Section>

        <Section numero="03" titre="Propriété intellectuelle">
          <p>
            L&apos;ensemble du site, sa structure, ses textes, sa charte
            graphique et son code sont la propriété de {site.name}, sauf
            mention contraire. Toute reproduction ou représentation, totale ou
            partielle, sans autorisation écrite préalable est interdite.
          </p>
          <p>
            Les visuels présentés dans les études de cas illustrent des
            prestations réalisées pour les clients cités. Les marques, logos et
            contenus de ces clients restent leur propriété exclusive et sont
            reproduits ici à titre de référence professionnelle, avec leur
            accord.
          </p>
          <p>
            Si vous êtes titulaire de droits sur un élément publié ici et que sa
            présence vous pose difficulté, écrivez à{" "}
            <a href={`mailto:${EDITEUR.courriel}`}>{EDITEUR.courriel}</a> : il sera retiré
            sans délai.
          </p>
        </Section>

        <Section numero="04" titre="Données personnelles">
          <p>
            <strong>Responsable de traitement :</strong> {site.name},
            joignable à <a href={`mailto:${EDITEUR.courriel}`}>{EDITEUR.courriel}</a>.
          </p>
          <p>
            <strong>Ce qui est collecté.</strong> Le site ne comporte aucun
            formulaire de contact et n&apos;installe aucun outil de mesure
            d&apos;audience. Aucune donnée n&apos;est collectée par le simple
            fait de le consulter, au-delà des journaux techniques tenus par
            l&apos;hébergeur pour assurer la sécurité et la disponibilité du
            service.
          </p>
          <p>
            <strong>Prise de rendez-vous.</strong> Le bouton de prise de
            rendez-vous ouvre un module fourni par Calendly LLC. Si vous
            réservez un créneau, les informations que vous saisissez à cette
            occasion (nom, adresse électronique, objet de l&apos;échange) sont
            traitées par Calendly puis transmises à {site.name}. Elles ne
            servent qu&apos;à organiser et préparer l&apos;entretien, et ne sont
            jamais cédées. Base légale : votre demande, en vue de mesures
            précontractuelles. Conservation : trois ans à compter du dernier échange.
          </p>
          <p>
            <strong>Vos droits.</strong> Vous disposez d&apos;un droit
            d&apos;accès, de rectification, d&apos;effacement, de limitation et
            d&apos;opposition sur les données vous concernant. Il s&apos;exerce
            par simple courriel à{" "}
            <a href={`mailto:${EDITEUR.courriel}`}>{EDITEUR.courriel}</a>. Si la réponse
            apportée ne vous satisfait pas, vous pouvez saisir la{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noreferrer noopener"
            >
              CNIL
            </a>
            .
          </p>
        </Section>

        <Section numero="05" titre="Cookies et services tiers">
          <p>
            Le site ne dépose aucun cookie de mesure d&apos;audience, de
            publicité ou de suivi. Les polices de caractères sont servies depuis
            le site lui-même : leur affichage n&apos;entraîne aucune requête
            vers un serveur tiers.
          </p>
          <p>
            La vidéo d&apos;arrière-plan de la page d&apos;accueil est servie
            depuis ce site, et non par une plateforme extérieure : la consulter
            n&apos;adresse aucune requête à un tiers.
          </p>
          <p>
            Un seul service extérieur intervient. <strong>Calendly</strong>,
            pour la prise de rendez-vous : le module ne se charge qu&apos;au
            clic sur le bouton, et dépose alors ses propres cookies,
            nécessaires à son fonctionnement.
          </p>
        </Section>

        <Section numero="06" titre="Liens vers d'autres sites">
          <p>
            Le site peut renvoyer vers des sites tiers, notamment ceux des
            clients cités. {site.name} n&apos;exerce aucun contrôle sur leur
            contenu et décline toute responsabilité à leur égard.
          </p>
        </Section>

        <Section numero="07" titre="Droit applicable">
          <p>
            Les présentes mentions sont soumises au droit français. À défaut de
            règlement amiable, tout litige relatif à leur interprétation ou à
            leur exécution relève des tribunaux français compétents.
          </p>
        </Section>
      </div>

      <p
        className="mt-[clamp(3rem,6vw,4rem)] max-w-[46rem] border-t border-line pt-7 text-[0.9rem] text-muted"
        data-reveal
      >
        Dernière mise à jour : {DERNIERE_MISE_A_JOUR}. Une question sur cette
        page ?{" "}
        <Link
          href={`mailto:${EDITEUR.courriel}`}
          className="font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
        >
          Écrivez-moi
        </Link>
        .
      </p>
    </div>
  );
}
