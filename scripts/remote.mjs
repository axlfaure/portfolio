import { execFileSync } from "node:child_process";

/**
 * Accès au serveur, partagé par `deploy`, `backup`, `sync` et `rollback`.
 *
 * Les commandes ont besoin des mêmes choses : la configuration, sa validation,
 * et une façon d'agir sur place. Les répéter dans chaque fichier ferait
 * diverger les garde-fous à la première retouche.
 */

/*
 * L'IPv4 est imposée. Le nom du serveur porte une adresse IPv6 sur laquelle la
 * connexion est coupée avant même l'échange de clés, alors que la même
 * connexion aboutit en IPv4. Sans cette option, ssh essaie l'IPv6 en premier
 * et échoue sur un message qui ne dit rien de la cause.
 */
const SSH_OPTIONS = ["-4"];

/**
 * Lit la configuration, la valide, et renvoie de quoi agir sur le serveur.
 * Interrompt le programme si quelque chose manque : mieux vaut un message
 * clair avant la connexion qu'une erreur du shell distant après.
 */
export function connect() {
  try {
    process.loadEnvFile(".env.deploy");
  } catch {
    // Absent : les variables peuvent aussi venir du shell.
  }

  const target = process.env.DEPLOY_SSH;
  const dir = process.env.DEPLOY_PATH;

  if (!target || !dir) {
    console.error("Configuration absente.");
    console.error("");
    console.error("Copiez .env.deploy.example en .env.deploy et renseignez :");
    console.error("  DEPLOY_SSH   identifiant de connexion, sous la forme utilisateur@serveur");
    console.error("  DEPLOY_PATH  chemin absolu du site sur le serveur");
    process.exit(1);
  }

  /*
   * Le chemin est inséré dans des commandes shell qui effacent des dossiers.
   * Une apostrophe les romprait, et un chemin vide ou réduit à la racine ferait
   * porter l'effacement ailleurs que sur le site.
   */
  if (dir.includes("'") || !dir.startsWith("/") || dir.length < 4) {
    console.error(`DEPLOY_PATH invalide : ${dir}`);
    console.error("Attendu : un chemin absolu, sans apostrophe.");
    process.exit(1);
  }

  return {
    dir,

    /**
     * Exécute une suite de commandes sur le serveur.
     *
     * `options` permet de détourner la sortie, ce dont la sauvegarde a besoin
     * pour recevoir une archive. L'entrée, elle, doit rester celle du terminal :
     * sous Windows, ssh ne parvient plus à lire le mot de passe dès qu'elle est
     * redirigée. L'invite s'affiche, la saisie se perd, et la commande échoue
     * sans le moindre message.
     */
    run(script, options = {}) {
      return execFileSync("ssh", [...SSH_OPTIONS, target, script], {
        stdio: "inherit",
        ...options,
      });
    },

    /**
     * Dépose un fichier à la racine du site.
     *
     * Une connexion distincte de `run`, donc une saisie de mot de passe de
     * plus. C'est le prix de la limitation ci-dessus : faire passer l'archive
     * par l'entrée standard de `run` économiserait cette saisie, mais empêche
     * justement de la fournir.
     */
    upload(file, name) {
      execFileSync("scp", [...SSH_OPTIONS, file, `${target}:${dir}/${name}`], {
        stdio: "inherit",
      });
    },
  };
}
