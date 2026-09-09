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
    slug: "offers-section",
    data: {
      eyebrow: "Travailler ensemble",
      titleStart: "Deux façons de",
      titleAccent: "travailler ensemble.",
      lead: "Ce qui coûte cher, ce n'est pas le visuel, c'est de le commander. Entre le devis, le bon de commande et la comptabilité, un flyer à 400 € prend plus de temps interne qu'il ne coûte. D'où deux formules, selon que le besoin revienne ou non.",
      offers: [
        {
          name: "One shot",
          kicker: "Au projet",
          pitch:
            "Un besoin, un devis, une livraison sous deux semaines. Vous validez avant que je commence, et le prix ne bouge plus ensuite.",
          terms: "Sur devis, à prix ferme",
          forWho:
            "Les structures sans équipe communication, et celles dont les besoins visuels restent occasionnels.",
          highlight: false,
          ctaLabel: "Chiffrer un besoin",
          items: [
            {
              lead: "Un premier échange",
              text: "avec vous, et avec l'ingénieur ou le chercheur dont vous voulez parler.",
            },
            { lead: "Deux allers-retours inclus", text: "dans chaque prestation." },
            { lead: "Les fichiers sources livrés,", text: "aux formats qui servent." },
            { lead: "Le conseil compris dans le prix,", text: "jamais facturé à part." },
            { lead: "Une livraison sous deux semaines,", text: "annoncée au devis." },
            {
              lead: "Déduite de Partner",
              text: "si vous passez à l'année dans les trois mois.",
            },
          ],
        },
        {
          name: "Partner",
          kicker: "Sur l'année",
          badge: "Quatre places",
          pitch:
            "Un budget défini une fois, une seule commande, et vous piochez dedans toute l'année. Vous n'achetez plus un visuel : vous achetez le fait de ne plus avoir à en acheter un par un.",
          terms: "Budget annuel, grille figée douze mois",
          forWho:
            "Les équipes communication dont les besoins reviennent, et qui veulent éditer le moins de commandes possible.",
          highlight: true,
          ctaLabel: "Voir si Partner vous convient",
          items: [
            {
              lead: "Une seule commande pour l'année,",
              text: "payée au fur et à mesure des prestations.",
            },
            {
              lead: "Une grille figée douze mois,",
              text: "de 10 à 20 % sous mes tarifs habituels.",
            },
            {
              lead: "Tous les leviers dans la même commande :",
              text: "print de salon, schémas scientifiques, newsletters, identité, sites, photo et vidéo.",
            },
            {
              lead: "Un seul interlocuteur,",
              text: "y compris quand je mobilise imprimeurs, photographes ou développeurs.",
            },
            {
              lead: "Le conseil inclus :",
              text: "où mettre l'effort, comment faire mieux avec moins.",
            },
            {
              lead: "Les délais tenus ou compensés :",
              text: "10 % de remise par jour ouvré de retard.",
            },
            {
              lead: "L'automatisation de vos supports,",
              text: "par des outils sur mesure, quand une tâche revient assez souvent pour valoir mieux que moi.",
            },
            {
              lead: "Une seule clause :",
              text: "consommer 60 % de la commande sur l'année. Le reste ne vous est pas facturé.",
            },
          ],
        },
      ],
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

  // --- Vérification -------------------------------------------------------
  //
  // Le seul fait que ce script rende la main ne prouvait rien : quand la mise
  // à jour du schéma était sautée, il se terminait sans erreur et laissait une
  // administration qui plantait sur une colonne absente. On interroge donc
  // chaque collection et chaque global une fois, ce qui est exactement ce que
  // fait l'administration à l'ouverture d'une page. Une table ou une colonne
  // manquante se signale ici, avec son nom, au lieu d'être découverte en
  // ligne.
  const casses = [];

  for (const collection of payload.config.collections ?? []) {
    try {
      await payload.find({ collection: collection.slug as never, limit: 1, depth: 0 });
    } catch (error) {
      casses.push(`collection « ${collection.slug} » : ${(error as Error).message.split("\n")[0]}`);
    }
  }

  for (const global of payload.config.globals ?? []) {
    try {
      await payload.findGlobal({ slug: global.slug as never, depth: 0 });
    } catch (error) {
      casses.push(`global « ${global.slug} » : ${(error as Error).message.split("\n")[0]}`);
    }
  }

  if (casses.length > 0) {
    console.error("\nLe schéma ne répond pas au code :");
    for (const ligne of casses) console.error(`  - ${ligne}`);
    process.exit(1);
  }

  console.log(
    `vérification : ${(payload.config.collections ?? []).length} collections et ${(payload.config.globals ?? []).length} globaux lisibles`,
  );

  console.log("\nLe portrait reste celui du dossier public tant qu'aucun");
  console.log("fichier n'est déposé dans le champ « Portrait ».");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
