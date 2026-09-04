/**
 * Chargement des variables d'environnement pour les scripts en ligne de
 * commande.
 *
 * À importer **en premier**, avant `payload.config`. Les modules ES sont
 * évalués dans l'ordre des imports : `payload.config` lit `PAYLOAD_SECRET` au
 * moment de son évaluation, donc si le fichier était chargé plus bas dans le
 * script, la configuration aurait déjà été construite avec un secret vide.
 *
 * En local les variables viennent de `.env`. Sur un hébergeur qui ne propose
 * pas d'interface de variables d'environnement — Infomaniak, par exemple —
 * elles arrivent par le shell, avant la commande. On charge donc le fichier
 * s'il existe, sans en faire une condition.
 */
try {
  process.loadEnvFile(".env");
} catch {
  // Pas de fichier : les variables viennent déjà de l'environnement.
}

export {};
