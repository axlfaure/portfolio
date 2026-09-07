import { execFileSync } from "node:child_process";

/**
 * Accès au serveur, partagé par `deploy`, `backup` et `rollback`.
 *
 * Les trois commandes ont besoin des mêmes choses : la configuration, sa
 * validation, et une façon d'exécuter un script sur place. Les répéter dans
 * chaque fichier ferait diverger les garde-fous à la première retouche.
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
     * `options` permet de brancher les flux : une archive poussée dans
     * l'entrée standard pour le déploiement, une archive lue sur la sortie
     * standard pour la sauvegarde. Le mot de passe, lui, est lu par ssh sur le
     * terminal et non sur ces flux : les deux ne se gênent pas.
     */
    run(script, options = {}) {
      return execFileSync("ssh", [...SSH_OPTIONS, target, script], {
        stdio: "inherit",
        ...options,
      });
    },
  };
}
