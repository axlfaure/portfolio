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

Le groupe **Page d'accueil** liste les sections dans l'ordre où elles
défilent, chacune avec son pictogramme :

| Section | Contenu |
|---|---|
| Hero | Titre, accroche, chiffres, boutons du premier écran |
| Constat | Le texte à gauche de la boîte de réception |
| Projets | L'introduction des cartes empilées, et la bande de fin |
| Services | L'introduction de la grille des six services |
| À propos | Le bloc portrait |
| Avis | L'introduction des bandes de témoignages |
| FAQ | L'introduction des questions fréquentes |
| Appel final | La carte de contact, reprise en bas de toutes les pages |

La section « Témoignage » n'y figure pas : elle n'a aucun texte propre, tout
vient du témoignage marqué comme mis en avant.

La mise en page reste dans le code. L'admin pilote les textes, les visuels,
l'ordre d'affichage et les mises en avant.

## Mettre la base au niveau du code

Une seule commande, à passer sur le serveur après tout déploiement qui touche
aux collections :

```bash
npm run db:sync
```

Elle met le schéma à jour, puis reprend en base les blocs qui vivaient encore
dans le code. Elle n'écrit que si la destination est vide : la relancer ne peut
rien écraser. À ne pas confondre avec `npm run seed`, qui réécrit tout depuis
les anciens fichiers MDX et ne doit plus jamais tourner sur le serveur.

Elle rattrape aussi le seul défaut connu de la mise à jour de schéma de
Payload, qui recrée parfois un index sans l'avoir supprimé d'abord et s'arrête
en chemin. La commande supprime l'index en cause et réessaie ; un index n'étant
qu'un chemin d'accès, aucune donnée n'est touchée.

## Visuels des cartes projet

Chaque projet choisit son mode d'affichage sur la page d'accueil : bento de
visuels, vidéo, ou comparatif avant/après. Les champs du formulaire suivent le
choix.

La vidéo doit rester légère : elle démarre seule sur la page d'accueil, donc
sur le forfait mobile du visiteur. Viser six secondes et moins de 4 Mo, en MP4.
Prévoir une image d'attente : c'est elle qui s'affiche pour les visiteurs dont
le système demande de réduire les animations.

Le comparatif attend deux visuels au cadrage identique. C'est le même point de
vue qui doit se retrouver de part et d'autre de la poignée, sinon la
comparaison ne veut rien dire.

## Dossiers de la bibliothèque

Les médias se rangent en dossiers. Rien n'est imposé : les fichiers déjà en
place restent à la racine tant qu'on ne les déplace pas.

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
