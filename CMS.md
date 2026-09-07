# Administration du site

Le contenu du site vit dans une base gérée par Payload. Le code ne contient
plus de texte éditorial : tout se modifie depuis l'interface.

## Démarrer

```bash
npm run dev
```

- Site : http://localhost:3000
- Administration : http://localhost:3000/admin

Au premier lancement, l'admin demande de créer un compte. C'est le seul compte
administrateur ; le mot de passe n'est stocké nulle part ailleurs.

## Ce qui se gère depuis l'admin

| Collection | Contenu |
|---|---|
| Projets | Portfolio complet, visuels du bento et de la page projet |
| Services | Les six pages service, tous leurs textes |
| Témoignages | Avis clients du bandeau et des cartes projet |
| Questions fréquentes | La FAQ de la page d'accueil |
| Articles | Le blog |
| Logos clients | Le bandeau défilant du haut de page |
| Boîte de réception | Les messages de la section « Le contexte » |
| Médias | Bibliothèque d'images commune |

| Global | Contenu |
|---|---|
| À propos | Le bloc portrait de la page d'accueil |

La mise en page reste dans le code. L'admin pilote les textes, les visuels,
l'ordre d'affichage et les mises en avant.

## Deux blocs amorcés une fois

La boîte de réception et le texte « À propos » vivaient dans le code. La
commande suivante les reprend en base :

```bash
npm run seed:sections
```

Elle n'écrit que si la destination est vide, donc la relancer ne peut rien
écraser. À ne pas confondre avec `npm run seed`, qui réécrit tout depuis les
anciens fichiers MDX et ne doit plus jamais tourner sur le serveur.

Sur le serveur, c'est aussi cette commande qui crée la table et le global
manquants : l'exécutable de production ne modifie pas le schéma de la base.

## Filtres de la page projets

Les filtres reprennent les six services, dans leur ordre. Un projet apparaît
sous un filtre parce que le service le cite dans son champ « Projets ». Un
projet qu'aucun service ne cite ne sort que sous « Tout » : c'est le signe
qu'il reste à rattacher.

## Visuels manquants

Un champ image vide n'est pas une erreur : le site affiche un emplacement en
pointillés à la place. On peut donc publier un projet avant d'avoir ses images,
et les ajouter plus tard sans toucher au code.

## Bento des cartes projet

Trois ou quatre visuels par projet, dans le champ « Bento de la page d'accueil ».
**L'ordre détermine la place**, et chaque cellule a une forme différente :

- à quatre visuels : presque carré, large, large, presque carré ;
- à trois visuels : large, presque carré, puis un bandeau pleine largeur.

Un visuel paysage va dans une cellule large, un visuel carré dans une cellule
presque carrée, une double page dans le bandeau.

## Publication

Les pages sont générées statiquement. Un crochet purge automatiquement le cache
des pages concernées à chaque enregistrement : la modification est visible sans
redéploiement.

## Base de données

SQLite, dans `.data/site.db`. Le fichier n'est pas versionné.
**Sauvegarde : copier ce fichier, plus le dossier `media/`.**

Le jour d'une mise en ligne sur un hébergeur sans disque persistant (Vercel),
il faudra passer à Postgres et à un stockage objet. Seules deux lignes de
`payload.config.ts` et le champ `upload` de `cms/collections/Media.ts` sont
concernés ; les collections et le site restent identiques.

## Reconstruire la base

```bash
npm run seed
```

Relit les fichiers MDX de `content/` et les réinjecte. Réentrant : relancer ne
duplique rien. Ces fichiers sont conservés comme archive de la reprise.

## Construction : webpack, pas Turbopack

`npm run build` passe volontairement par webpack (`next build --webpack`).

Turbopack échoue sur Linux avec `TurbopackInternalError: Failed to write app
endpoint`, causé par `pino`, le journaliseur de Payload : son
`transport.js` référence `worker.js` d'une façon que le traçage de Turbopack
interprète comme un dossier. Lire un fichier comme un répertoire renvoie
`EINVAL` sur Linux, et le build panique. Sur Windows la même opération est
tolérée, d'où un build vert en local et rouge sur le serveur.

Ce n'est pas contournable par la configuration : `pino` figure déjà dans la
liste d'exclusions par défaut de Next, avec un commentaire décrivant ce bug
précis dans leur propre source.

`npm run build:turbo` reste disponible pour tester si une version future de
Next corrige le problème.
