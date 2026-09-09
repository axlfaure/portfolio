# Polices des vignettes de partage

Deux fichiers, et une seule raison d'être : `ImageResponse`, qui dessine les
vignettes Open Graph, ne sait charger que des polices présentes sur le disque,
et ne lit pas le WOFF2. Les polices du site, elles, sont téléchargées au build
par `next/font`, qui n'expose aucun chemin de fichier.

- `PlusJakartaSans-Bold.ttf` — Plus Jakarta Sans, Tokotype
- `InstrumentSerif-Italic.ttf` — Instrument Serif, Rodrigo Fuenzalida & Jordan Egstad

Les deux sont sous **SIL Open Font License 1.1**, qui autorise la
redistribution avec le projet. Texte de la licence :
<https://openfontlicense.org>

Ces fichiers ne sont pas servis au navigateur : ils sont lus au build par
`lib/og.tsx`, et rien d'autre.
