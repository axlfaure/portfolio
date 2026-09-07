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

  console.log("\nLe portrait reste celui du dossier public tant qu'aucun");
  console.log("fichier n'est déposé dans le champ « Portrait ».");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
