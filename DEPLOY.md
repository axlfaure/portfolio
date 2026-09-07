# Déploiement

Le site tourne sur un hébergement Node.js Infomaniak, à l'adresse
`portfolio.axelfaure.fr`.

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
| **Contenu** : textes, images, projets, tarifs | Axel seul | `portfolio.axelfaure.fr/admin` | Immédiat |
| **Code** : design, sections, comportements | Développement puis déploiement | `npm run deploy` | Après redémarrage |

Le contenu ne passe jamais par git. La base (`.data/site.db`) et les fichiers
téléversés (`media/`) vivent sur le disque du serveur et sont exclus du dépôt.
Un `git pull` ne peut donc pas les écraser.

Les pages sont pré-rendues à la compilation, mais chaque collection porte un
crochet de revalidation (`cms/hooks/revalidate.ts`) : enregistrer une fiche
régénère les pages concernées sans rebuild.

## Déployer une modification de code

```bash
npm run build
npm run deploy
```

Puis **Redémarrer** l'application depuis le Manager Infomaniak. C'est ce clic
qui met réellement le site à jour.

`npm run deploy` prépare l'archive, la transfère et l'installe, en une seule
connexion et donc une seule saisie du mot de passe.
L'ancien build y est conservé sous `.next.old`, et la nouvelle version n'est
mise en place qu'une fois l'extraction réussie : un transfert interrompu ne
peut pas laisser le site sans rien à servir.

## Revenir en arrière

```bash
npm run rollback
```

Échange `.next` et `.next.old` sur le serveur, sans rien recompiler ni
retransférer. Redémarrer ensuite depuis le Manager.

## Sauvegarder le contenu

```bash
npm run backup
```

Ramène la base et les fichiers téléversés dans `backups/<horodatage>/`. À
lancer après chaque session de rédaction : c'est la seule copie du contenu
saisi en ligne.

La commande sert aussi à travailler en local sur le contenu réel, en recopiant
la sauvegarde par-dessus `.data/` et `media/`. Le script affiche les deux
commandes à la fin.

## Première configuration

Copier `.env.deploy.example` en `.env.deploy` et renseigner l'identifiant de
connexion et le chemin du site. Les deux valeurs se lisent dans le Manager,
rubrique SSH.

Infomaniak n'accepte pas encore l'authentification par clé sur cet
hébergement : le mot de passe est demandé à chaque connexion, et `ssh-keygen`
ne sert donc à rien pour l'instant. Les scripts sont écrits en conséquence, une
seule connexion chacun, donc une seule saisie. Le jour où la clé arrivera, il
suffira de la déposer, rien à changer ici.

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
vrai contenu par une copie périmée. Le transfert ne va que dans un sens.

## Limites connues

Le build dépend du poste de développement : même code, machines différentes,
résultats potentiellement différents. Le remède serait de faire compiler
GitHub Actions.

Le vrai confort, pousser et voir le site à jour sans rien faire, demande un
hébergeur qui compile lui-même. Vercel le fait gratuitement à ce volume, mais
n'a pas de disque persistant : il faudrait passer la base en Postgres et les
médias sur un stockage objet. À mettre en regard de l'hébergement suisse, qui
n'est pas neutre selon les clients.
