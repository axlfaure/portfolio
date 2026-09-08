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
 * Les valeurs entre crochets sont celles qu'il reste à renseigner : elles se
 * voient à l'écran, précisément pour qu'on ne les oublie pas.
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

/** Ce qui reste à compléter. Rendu visible pour ne pas rester en attente. */
function ARemplir({ children }: { children: string }) {
  return (
    <span className="rounded-[4px] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
      [{children}]
    </span>
  );
}

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
              <ARemplir>
                statut exact : entreprise individuelle, micro-entreprise, EURL,
                SASU…
              </ARemplir>
            </Ligne>
            <Ligne intitule="Siège">
              <ARemplir>adresse postale complète</ARemplir>
            </Ligne>
            <Ligne intitule="SIRET">
              <ARemplir>numéro SIRET à 14 chiffres</ARemplir>
            </Ligne>
            <Ligne intitule="TVA intracommunautaire">
              <ARemplir>
                numéro de TVA, ou « non applicable, article 293 B du CGI » si
                vous relevez de la franchise en base
              </ARemplir>
            </Ligne>
            <Ligne intitule="Courriel">
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </Ligne>
            <Ligne intitule="Téléphone">
              <ARemplir>numéro, ou retirer cette ligne</ARemplir>
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
            <a href={`mailto:${site.email}`}>{site.email}</a> : il sera retiré
            sans délai.
          </p>
        </Section>

        <Section numero="04" titre="Données personnelles">
          <p>
            <strong>Responsable de traitement :</strong> {site.name},
            joignable à <a href={`mailto:${site.email}`}>{site.email}</a>.
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
            précontractuelles. Conservation :{" "}
            <ARemplir>durée retenue, par exemple trois ans</ARemplir> à compter
            du dernier échange.
          </p>
          <p>
            <strong>Vos droits.</strong> Vous disposez d&apos;un droit
            d&apos;accès, de rectification, d&apos;effacement, de limitation et
            d&apos;opposition sur les données vous concernant. Il s&apos;exerce
            par simple courriel à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>. Si la réponse
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
          <p>Deux services extérieurs interviennent, et seulement eux :</p>
          <ul className="ml-5 list-disc space-y-2 marker:text-line-2">
            <li>
              <strong>YouTube</strong>, pour la vidéo d&apos;arrière-plan de la
              page d&apos;accueil. Le lecteur est chargé depuis le domaine sans
              cookie de Google, qui ne dépose pas de traceur tant que la vidéo
              n&apos;est pas lue.
            </li>
            <li>
              <strong>Calendly</strong>, pour la prise de rendez-vous. Le module
              ne se charge qu&apos;au clic sur le bouton, et dépose alors ses
              propres cookies, nécessaires à son fonctionnement.
            </li>
          </ul>
        </Section>

        <Section numero="06" titre="Liens vers d'autres sites">
          <p>
            Le site peut renvoyer vers des sites tiers, notamment ceux des
            clients cités. {site.name} n&apos;exerce aucun contrôle sur leur
            contenu et décline toute responsabilité à leur égard.
          </p>
        </Section>

        <Section numero="07" titre="Médiation de la consommation">
          <p>
            Les prestations proposées s&apos;adressent à des professionnels.
            Dans l&apos;hypothèse d&apos;un contrat conclu avec un
            consommateur, celui-ci peut recourir gratuitement à un médiateur de
            la consommation :{" "}
            <ARemplir>
              nom et adresse du médiateur auprès duquel vous adhérez, ou
              supprimer cette section si vous ne contractez jamais avec des
              particuliers
            </ARemplir>
            .
          </p>
        </Section>

        <Section numero="08" titre="Droit applicable">
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
          href={`mailto:${site.email}`}
          className="font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
        >
          Écrivez-moi
        </Link>
        .
      </p>
    </div>
  );
}
