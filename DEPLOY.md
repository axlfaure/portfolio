# Déploiement

Le site tourne sur un hébergement Node.js Infomaniak, à l'adresse
`axelfaure.fr`.

## Mode d'emploi

Tout part d'une idée simple : il y a **deux endroits**, et chacun fait autorité
sur une chose.

- **Ton ordinateur** fait autorité sur le **code**. C'est là qu'on modifie le
  site.
- **Le serveur** fait autorité sur le **contenu**. C'est là que tu écris dans
  Payload.

Les commandes ne font que faire circuler l'un ou l'autre dans le bon sens.

### Les trois commandes

| Commande | Ce qu'elle fait | Sens |
|---|---|---|
| `npm run sync` | Descend le contenu du serveur vers ton ordinateur | serveur → toi |
| `npm run build` | Fabrique le site : fige chaque page en HTML | sur ton ordinateur |
| `npm run deploy` | Envoie le site fabriqué au serveur | toi → serveur |

Le point qui explique tout le reste : **`build` fige le contenu dans les
pages**, et il lit la base de ton ordinateur, pas celle du serveur. Une base
locale en retard produit un site qui affiche l'ancien contenu, et `deploy` le
pousse par-dessus le bon.

D'où la règle : **`sync` avant `build`, dès que tu as touché à Payload en
ligne.**

### Quand arrêter le serveur de développement

| | Arrêter ? | Pourquoi |
|---|---|---|
| `sync` | **Oui, obligatoire** | Il remplace le fichier de base de données, et Windows refuse tant qu'un programme le tient ouvert. |
| `build` | **Oui** | Les deux écrivent dans le même dossier `.next`. Tu risquerais d'expédier un mélange. |
| `deploy` | Non | Il ne fait que lire ce que `build` a produit et l'envoyer. |

En pratique : tu l'arrêtes, tu lances `sync` et `build`, tu le rallumes quand
tu veux.

### Les deux séquences

**Tu as écrit dans Payload en ligne** — nouveau témoignage, texte modifié,
image déposée :

```bash
npm run sync
npm run build
npm run deploy
```

**Tu n'as touché à rien dans Payload**, ce sont seulement des modifications de
code :

```bash
npm run build
npm run deploy
```

Dans le doute, fais le `sync`. Il ne peut rien casser : il sauvegarde avant de
remplacer, et il refuse d'installer une sauvegarde qu'il n'a pas produite
lui-même.

### Faut-il lancer le build soi-même ?

**Oui, toujours.** Un build lancé pendant le développement ne sert qu'à
vérifier que le code compile ; il est fabriqué avec la base de la machine qui
l'a lancé, qui n'est pas forcément à jour de ce que tu as écrit en ligne.

Le seul cas où l'on peut s'en passer : un build vient d'être fait et rien n'a
changé dans Payload depuis.

### L'ordre complet

1. Arrêter le serveur de développement
2. `npm run sync` si tu as touché à Payload
3. `npm run build`
4. `npm run deploy`
5. Arrêter l'application dans le Manager Infomaniak
6. Le `db:sync` en SSH **seulement si le message est apparu** (voir plus bas)
7. Redémarrer l'application

## Le principe

Pousser sur GitHub ne met pas le site à jour. Deux raisons :

**Le serveur ne sait pas compiler.** L'hébergement mutualisé plafonne à un
gigaoctet de mémoire, et Next avec l'administration Payload n'y entre pas : le
build s'y arrête en « heap out of memory ». On compile donc sur le poste de
développement, et le serveur ne fait plus que servir.

**Node charge son code au démarrage.** Remplacer les fichiers pendant que
l'application tourne ne change rien tant qu'elle n'a pas redémarré.

Le dépôt sert à versionner le code. Le build compilé, lui, voyage par ssh,
hors du dépôt : c'est un binaire, et git en conserverait chaque version pour
toujours sans qu'on puisse la relire ni la comparer.

## Deux circuits séparés

| | Qui | Comment | Effet |
|---|---|---|---|
| **Contenu** : textes, images, projets, tarifs | Axel seul | `axelfaure.fr/admin` | Immédiat |
| **Code** : design, sections, comportements | Développement puis déploiement | `npm run sync` puis `build` et `deploy` | Après redémarrage |

Le contenu ne passe jamais par git. La base (`.data/site.db`) et les fichiers
téléversés (`media/`) vivent sur le disque du serveur et sont exclus du dépôt.
Un `git pull` ne peut donc pas les écraser.

Les pages sont pré-rendues à la compilation, mais chaque collection porte un
crochet de revalidation (`cms/hooks/revalidate.ts`) : enregistrer une fiche
régénère les pages concernées sans rebuild.

## Ce que fait `npm run deploy`

Il enchaîne quatre choses, dans cet ordre :

1. **Un `git pull --ff-only` sur le serveur.** Les sources d'abord, puisque
   c'est d'elles que le build a été compilé. Tout ce que le site sert n'est pas
   dans `.next` : `public` est lu sur le disque à chaque requête, et les
   scripts d'administration s'exécutent depuis les sources. Faire voyager ces
   fichiers dans l'archive a été essayé et abandonné — déposés par-dessus la
   copie de travail, ils devenaient des fichiers que git ne suivait pas, et le
   `git pull` suivant refusait de les écraser. Si le pull échoue, rien n'est
   installé et le site continue de servir la version en place.
2. **L'archive du build**, préparée, transférée, installée. L'ancien build est
   conservé sous `.next.old`, et la nouvelle version n'est mise en place
   qu'une fois l'extraction réussie : un transfert interrompu ne peut pas
   laisser le site sans rien à servir.
3. **Un avertissement si `cms/` a changé.** Un champ nouveau veut dire une
   colonne nouvelle, donc une mise à niveau de la base :

   ```
   ATTENTION : le dossier cms a changé, lancez 'npm run db:sync' avant de redémarrer.
   ```

   Si ce message n'apparaît pas, il n'y a rien à faire en SSH.
4. **Une alerte si le dossier `media` est vide.** Les fichiers téléversés ne
   sont ni dans le dépôt ni dans le build : leur disparition passerait
   inaperçue jusqu'à ce qu'on ouvre une page projet.

Le mot de passe est demandé deux fois : ssh ne sait plus le lire sous Windows
dès que son entrée standard est redirigée, ce qui interdit de faire passer
l'archive par la même connexion que la commande d'installation.

## Mettre la base à niveau

```bash
cd "$DEPLOY_PATH" && npm run db:sync
```

Le chemin est celui de `DEPLOY_PATH` dans `.env.deploy`. Attention : chez
Infomaniak le dossier du site porte le nom du domaine, et un changement de
domaine principal peut donc le renommer. Vérifier avec `ls /srv/customer/sites`
avant de supposer.

À lancer sur le serveur, application arrêtée, **quand le déploiement l'a
demandé**. La commande ajoute les tables et colonnes qu'un champ nouveau
réclame, puis vérifie son travail en lisant chaque collection et chaque global
une fois. Elle doit finir par :

```
vérification : 14 collections et 8 globaux lisibles
```

Elle force `NODE_ENV=development` le temps du sous-processus, et ce n'est pas
un détail : l'adaptateur SQLite de Payload garde ce test en dur dans son
fichier de connexion.

```js
if (process.env.NODE_ENV !== 'production' && …) await pushDevSchema(this)
```

Sur le serveur, où la variable vaut `production`, la mise à jour était donc
purement sautée, sans le moindre message. Déclarer `push: true` dans la
configuration n'y changerait rien, le test sur l'environnement passe avant.

## Revenir en arrière

```bash
npm run rollback
```

Échange `.next` et `.next.old` sur le serveur, sans rien recompiler ni
retransférer. Redémarrer ensuite depuis le Manager.

Seul le build est concerné : les fichiers statiques et les sources viennent du
dépôt. Si la version fautive tenait à une source, c'est un `git checkout` qu'il
faut, pas cette commande.

## Sauvegarder le contenu

```bash
npm run backup
```

Ramène la base et les fichiers téléversés dans `backups/<horodatage>/`. **À
lancer après chaque session de téléversement** : c'est la seule copie du
contenu saisi en ligne, et un fichier déposé depuis la dernière sauvegarde
n'existe nulle part ailleurs.

`npm run sync` fait la sauvegarde et l'installation en une fois. Il exige un
dossier **nouveau** : si la récupération échoue, il s'arrête sans rien toucher
plutôt que d'installer la sauvegarde de la veille en annonçant que tout va
bien.

### Renvoyer les fichiers vers le serveur

```bash
npm run media:restore
```

Le seul script qui écrive du contenu vers le haut, et uniquement pour réparer.
L'installation est **additive** : l'archive se déplie par-dessus l'existant,
rien n'est effacé, et la relancer ne peut pas aggraver une situation déjà
mauvaise. Il ne peut pas rendre un fichier téléversé après la dernière
sauvegarde : celui-là n'a jamais existé ailleurs que sur le serveur.

## Première configuration

Copier `.env.deploy.example` en `.env.deploy` et renseigner l'identifiant de
connexion et le chemin du site. Les deux valeurs se lisent dans le Manager,
rubrique SSH.

Les scripts imposent l'IPv4. Le nom du serveur porte aussi une adresse IPv6,
sur laquelle la connexion est coupée avant l'échange de clés, avec un message
qui ne dit rien de la cause.

Infomaniak n'accepte pas encore l'authentification par clé sur cet
hébergement : le mot de passe est demandé à chaque connexion, et `ssh-keygen`
ne sert donc à rien pour l'instant. Les scripts ouvrent en conséquence le
minimum de connexions : une pour la sauvegarde, deux pour le déploiement. Le
jour où la clé arrivera, il suffira de la déposer, rien à changer ici.

## Sur le serveur

Un fichier `.env` à la racine du site, jamais versionné :

```
PAYLOAD_SECRET=…
DATABASE_URI=file:/chemin/absolu/du/site/.data/site.db
MEDIA_DIR=/chemin/absolu/du/site/media
```

`PAYLOAD_SECRET` chiffre les sessions de l'administration. Le changer
déconnecte tout le monde, sans perte de données.

`DATABASE_URI` et `MEDIA_DIR` existent parce que webpack fige les chemins à la
compilation : sans elles, un build fait sous Windows emporterait
`C:/Users/...` sur un serveur Linux, et l'administration tomberait au
démarrage.

## À ne pas faire

**Ne pas relancer `npm run seed` sur le serveur.** Le script réécrit chaque
fiche à partir des anciens fichiers MDX. Il écraserait le contenu saisi depuis.
Il a fait son travail une fois.

**Ne pas remonter une base locale vers le serveur.** Ce serait remplacer le
vrai contenu par une copie périmée. Le transfert ne va que dans un sens, sauf
`media:restore`, qui ne touche qu'aux fichiers et n'efface rien.

**Ne pas compiler sans avoir synchronisé** après une session dans Payload. Le
site déployé afficherait l'état d'avant.

## Limites connues

Le build dépend du poste de développement : même code, machines différentes,
résultats potentiellement différents. Le remède serait de faire compiler
GitHub Actions.

Le vrai confort, pousser et voir le site à jour sans rien faire, demande un
hébergeur qui compile lui-même. Vercel le fait gratuitement à ce volume, mais
n'a pas de disque persistant : il faudrait passer la base en Postgres et les
médias sur un stockage objet. À mettre en regard de l'hébergement suisse, qui
n'est pas neutre selon les clients.
