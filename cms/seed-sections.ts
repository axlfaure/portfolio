import "./env";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import { getPayload } from "payload";
import { MAILS_PAR_DEFAUT } from "../lib/inbox";
import config from "../payload.config";

/**
 * Reprise dans la base des deux blocs restés codés en dur : les messages de la
 * boîte de réception, et le texte de la section « À propos ».
 *
 * Script à usage unique, mais sans danger à relancer : il n'écrit que si la
 * destination est vide. Un contenu déjà retouché dans l'administration ne peut
 * donc pas être écrasé, contrairement à `npm run seed` qui, lui, réécrit tout
 * depuis les anciens fichiers MDX et ne doit plus jamais tourner en ligne.
 *
 * Il rend un second service sur le serveur : c'est lui qui met le schéma de la
 * base à niveau, tables et colonnes nouvelles comprises. L'exécutable de
 * production ne le fait pas de lui-même, alors que ce script, lancé par tsx,
 * ouvre Payload en mode développement et applique les écarts. C'est donc la
 * commande à passer après tout déploiement qui touche aux collections.
 *
 * Usage : `npm run seed:sections`
 */

/** Texte d'origine de la section, tel qu'il était écrit dans le composant. */
const A_PROPOS = {
  eyebrow: "À propos",
  titleStart: "Vous parlez directement à",
  titleAccent: "la personne qui produit.",
  body: `Je ne prétends pas être ingénieur. En revanche je sais poser les questions qui font sortir l'essentiel, et arbitrer entre ce qui doit être montré et ce qui peut attendre. C'est ce que je fais depuis cinq ans avec des chercheurs et des ingénieurs.

Pas d'équipe à briefer, pas d'intermédiaire à qui réexpliquer votre métier. C'est ce qui permet de tenir des délais courts sans que la cohérence en pâtisse, et de vous dire non quand un délai n'est pas tenable, plutôt que de livrer en retard.`,
  facts: [
    { value: "Grenoble", label: "Isère, Auvergne-Rhône-Alpes" },
    { value: "5 ans", label: "dans la tech et l'industrie" },
    { value: "+30", label: "structures accompagnées" },
    { value: "24 h", label: "de délai de réponse" },
  ],
};


/**
 * Contenu d'origine des sections de la page d'accueil, repris tel qu'il était
 * écrit dans les composants. Une entrée est reconnue comme déjà remplie par la
 * présence de son titre : un global jamais enregistré renvoie ses valeurs par
 * défaut, donc un titre vide.
 */
const SECTIONS: { slug: string; data: Record<string, unknown> }[] = [
  {
    slug: "hero",
    data: {
      lines: [
        { before: "Votre", accent: "expertise", after: "est complexe." },
        { before: "Votre communication", accent: "ne devrait pas l'être.", after: "" },
      ],
      lead: "Studio créatif spécialisé tech & industrie, basé à Grenoble. Je développe la communication des structures innovantes en créant des visuels cohérents et adaptés à leur écosystème.",
      linkLabel: "Voir les réalisations",
      linkHref: "/projets",
      socialProof: {
        badge: "+30",
        strong: "100%",
        rest: "de clients satisfaits",
      },
      stats: [
        { value: "70+", label: "projets livrés" },
        { value: "30+", label: "structures accompagnées" },
        { value: "100%", label: "de satisfaction" },
        { value: "+5 ans", label: "dans la tech et l'industrie" },
      ],
    },
  },
  {
    slug: "context-section",
    data: {
      eyebrow: "Le contexte",
      titleStart: "Vous êtes",
      titleAccent: "seul, ou trop peu,",
      titleEnd: "à porter la communication de votre structure.",
      lead: "Vous couvrez l'événementiel, le web, les réseaux, le print et parfois la presse. Personne en interne ne sait faire de création : tout finit par remonter à vous.",
      strains: [
        {
          icon: "users",
          lead: "Tout converge vers vous.",
          line: "Un imprimeur, un studio, un organisateur et trois chercheurs qui écrivent le même matin, pour un seul salon.",
        },
        {
          icon: "exchange",
          lead: "Personne ne parle le même langage.",
          line: "Les experts veulent tout montrer, les prestataires ne comprennent pas la techno. Entre les deux, c'est vous qui traduisez.",
        },
        {
          icon: "clock",
          lead: "La date du salon ne bouge pas.",
          line: "Le budget se resserre, les fichiers arrivent mal nommés, et il faut livrer quand même.",
        },
      ],
    },
  },
  {
    slug: "projects-section",
    data: {
      eyebrow: "Projets",
      titleStart: "Vos innovations méritent d'être",
      titleAccent: "comprises à leur juste valeur.",
      lead: "Trop souvent, les meilleures innovations perdent face à ceux qui savent mieux se présenter. Je transforme la complexité de votre R&D en une image limpide, qui inspire confiance dès le premier regard.",
      band: { titleStart: "Le reste du travail est", titleAccent: "juste là." },
    },
  },
  {
    slug: "services-section",
    data: {
      eyebrow: "Services",
      titleStart: "Six leviers.",
      titleAccent: "Un seul interlocuteur.",
    },
  },
  {
    slug: "reviews-section",
    data: {
      eyebrow: "Avis clients",
      titleStart: "Ce qu'en disent",
      titleAccent: "les équipes que j'accompagne.",
    },
  },
  {
    slug: "faq-section",
    data: {
      eyebrow: "FAQ",
      titleStart: "Ce que vous vous",
      titleAccent: "demandez déjà.",
    },
  },
  {
    slug: "final-cta",
    data: {
      titleStart: "Parlons de",
      titleAccent: "votre projet.",
      lead: "Trente minutes pour comprendre votre contexte et vous dire ce que je reprendrais en priorité. Visio ou téléphone, réponse sous 24 heures.",
      footnote: "Grenoble · Isère · Réponse sous 24 h",
    },
  },
];

async function main() {
  const payload = await getPayload({ config });

  // --- Boîte de réception -------------------------------------------------
  const existants = await payload.find({
    collection: "mails",
    limit: 1,
    depth: 0,
  });

  if (existants.totalDocs > 0) {
    console.log(`boîte de réception : ${existants.totalDocs} message(s) déjà en base, rien à faire`);
  } else {
    for (const [i, mail] of MAILS_PAR_DEFAUT.entries()) {
      await payload.create({
        collection: "mails",
        data: {
          slug: `message-${i + 1}`,
          from: mail.from,
          initials: mail.initials,
          subject: mail.subject,
          preview: mail.preview,
          time: mail.time,
          file: mail.file ?? null,
          me: mail.me ?? false,
          order: i + 1,
        },
      });
    }
    console.log(`boîte de réception : ${MAILS_PAR_DEFAUT.length} messages créés`);
  }

  // --- À propos -----------------------------------------------------------
  const actuel = await payload.findGlobal({ slug: "about", depth: 0 });

  if (actuel?.titleStart) {
    console.log("à propos : déjà renseigné, rien à faire");
  } else {
    const editorConfig = await editorConfigFactory.default({
      config: payload.config,
    });

    await payload.updateGlobal({
      slug: "about",
      data: {
        eyebrow: A_PROPOS.eyebrow,
        titleStart: A_PROPOS.titleStart,
        titleAccent: A_PROPOS.titleAccent,
        body: await convertMarkdownToLexical({
          editorConfig,
          markdown: A_PROPOS.body,
        }),
        facts: A_PROPOS.facts,
      },
    });
    console.log("à propos : texte d'origine repris en base");
  }

  // --- Sections de la page d'accueil --------------------------------------
  let sections = 0;
  for (const { slug, data } of SECTIONS) {
    const actuel = (await payload.findGlobal({
      slug: slug as Parameters<typeof payload.findGlobal>[0]["slug"],
      depth: 0,
    })) as unknown as Record<string, unknown> | null;

    // Le hero n'a pas de titre en un seul champ : c'est son tableau de lignes
    // qui dit s'il a déjà été enregistré.
    const rempli =
      slug === "hero"
        ? Array.isArray(actuel?.lines) && actuel.lines.length > 0
        : Boolean(actuel?.titleStart);

    if (rempli) continue;

    await payload.updateGlobal({
      slug: slug as Parameters<typeof payload.updateGlobal>[0]["slug"],
      data: data as never,
    });
    sections += 1;
  }
  console.log(
    sections > 0
      ? `sections d'accueil : ${sections} reprises en base`
      : "sections d'accueil : déjà renseignées, rien à faire",
  );

  console.log("\nLe portrait reste celui du dossier public tant qu'aucun");
  console.log("fichier n'est déposé dans le champ « Portrait ».");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
