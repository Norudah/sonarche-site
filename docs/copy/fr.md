# Landing copy — FR (validée)

Traduction validée par Romain le 2026-07-30. Miroir section par section de
`en.md` (la source de vérité). Deux règles non négociables :

- **Toute la page tutoie.** L'app elle-même tutoie ; la landing parle avec la
  même voix. Jamais de « vous ».
- **La tagline « From the stream into the Ark. » reste en ANGLAIS partout**
  (hero + footer). C'est la marque : on ne la traduit pas.

Micro-copy (cartes, lignes de tableau, chips, légendes) complétée le 2026-07-30
depuis `Sonarche Landing FR (web).dc.html` (dans le dépôt de l'app, sous
`docs/designs/landing/`). Attention : cette maquette-là
**vouvoie** — c'est la passe antérieure. Tous les blocs repris ont été
transposés au tutoiement ; ils attendent une relecture. Les chips d'étape, que
la maquette avait laissées en anglais, sont traduites ici.

## Hero

- Badge : `GRATUIT · OPEN SOURCE · HORS LIGNE`
- Wordmark : `SONARCHE`
- Tagline : `From the stream into the Ark.` (EN — voir règle ci-dessus)
- Subline : Une bibliothèque musicale qui t'appartient vraiment — chaque
  morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un
  moteur natif.
- CTA principal : le bouton de téléchargement — voir § Téléchargement
- CTA secondaire : `Voir comment ça marche ↓`
- Indice de scroll : `DÉFILER ↓`

## Pourquoi elle existe

- Kicker : `POURQUOI ELLE EXISTE`
- Titre : Ta musique doit survivre à toutes les apps.
- Corps, quatre lignes. Les italiques sont celles de la maquette : trois runs,
  pas quatre — la troisième ligne n'en porte aucune, et seule la fin de la
  deuxième passe au serif. Mêmes positions que l'EN.
  - Donne-lui _ses vrais noms_,
  - un port d'attache en _simples fichiers_,
  - et un lecteur à sa hauteur —
  - _pour toujours, hors ligne, à toi_.
- Chips : `fichiers simples` · `pas de cloud` · `aucun compte` ·
  `aucun ré-encodage`

## La traversée

- Kicker : `LA TRAVERSÉE`
- Titre : Un lien y entre. Une bibliothèque en sort.
- Sous-titre : Quatre gestes, une chaîne d'un seul tenant — et plus un clic
  après le premier.

### Étape 01 — Colle un lien

Un titre, un album, une playlist entière. Dépose-le dans l'app et le voyage
s'organise — une ligne par morceau, avant que rien ne soit embarqué.
Chips : `un morceau` · `un album` · `une playlist`
Note : Déjà dans la cale ? Il passe son tour, sans un mot.

### Étape 02 — Regarde la cargaison monter à bord

Les pastilles passent au vert une à une pendant que l'audio natif est hissé à
bord — intact, jamais ré-encodé — et rejoint la cale.
Chips : `yt-dlp` · `audio natif` · `aucun ré-encodage`
Note : Ferme la fenêtre en pleine manœuvre : la file reprendra exactement où
elle s'est arrêtée.

### Étape 03 — Empreinte et identification

ffmpeg et Chromaprint distillent l'audio lui-même en une empreinte acoustique.
AcoustID répond : c'est cet enregistrement-là, exactement — sans jamais
deviner d'après le titre.
Chips : `ffmpeg` · `Chromaprint` · `AcoustID`
Note : Pas de correspondance sûre ? L'app le dit et te laisse trancher — plutôt
que d'inventer un artiste.

### Étape 04 — Il reçoit son nom

Titre, artiste, album, genre, piste, année — et la vraie pochette. Tout est
écrit dans les tags du fichier lui-même, et jusque dans le dossier qui
l'abrite désormais.
Chips : `MusicBrainz` · `pochette` · `famille de genre`
Note : Dans les fichiers eux-mêmes — pas dans une base que seul Sonarche
saurait lire.

## L'ancienne méthode

- Kicker : `L'ANCIENNE MÉTHODE`
- Titre : L'ancienne méthode, tu la connais par cœur.
- Sous-titre : Cinq outils, quatre onglets, et un dossier Téléchargements qui
  ressemble à une scène de crime. Chaque étape perd quelque chose en route.

### Les cinq maillons de la chaîne

Chaque carte : libellé d'étape — outil — grief — coût.

1. `ONGLET 1` — **Un site de conversion** — Un lien à la fois, converti sur le
   serveur de quelqu'un d'autre. Tu attends dans une file, puis le navigateur
   dépose le fichier où bon lui semble. — _Lent, un morceau, ré-encodé._
2. `APP 1` — **Un téléchargeur en masse** — Il gère la playlist, au moins.
   Mais il remplit les tags avec le nom du fichier — ton artiste s'appelle
   « Unknown » et ton album est vide. — _Des tags devinés._
3. `APP 2` — **Un éditeur de tags** — Ouvrir chaque fichier. Retaper le titre,
   l'artiste, l'année, le numéro de piste. Multiplié par 80. — _Des heures de
   saisie._
4. `ONGLET 2` — **Une recherche d'images** — Chercher une pochette carrée qui
   ne soit pas une vignette filigranée, la recadrer, espérer qu'elle
   corresponde au bon pressage. — _La mauvaise pochette pour toujours._
5. `APP 3` — **Ton lecteur de musique** — Déplacer les fichiers, relancer
   l'analyse du dossier, puis découvrir trois doublons et un album coupé en
   deux. — _Une bibliothèque bancale quand même._

### La chute

- Titre punch : Sonarche fait les cinq. Dans une seule fenêtre.
- Corps punch : Donne-lui un lien et va vivre ta vie. L'audio rejoint la cale,
  se fait écouter, identifier, taguer, coiffer de sa vraie pochette, ranger dans
  le bon dossier — puis la lecture démarre, sur un moteur audio natif en Rust.
  Pas de relais, pas de ré-import, pas de deuxième app.
- Chips : `un lien en entrée` · `aucun ré-encodage` · `empreinte` ·
  `vraies métadonnées` · `vraie pochette` · `dossiers rangés` ·
  `lecture native`

## Les vrais noms

- Kicker : `LES VRAIS NOMS`
- Titre : Il ne lit pas le titre. Il écoute le morceau.
- Corps : La plupart des outils recopient le texte qui traînait avec le
  fichier. C'est comme ça qu'on se retrouve avec un artiste nommé « Official
  Audio ». Sonarche, lui, ne devine jamais : ffmpeg et Chromaprint
  transforment l'onde sonore elle-même en empreinte, AcoustID relie cette
  empreinte à un enregistrement précis, et MusicBrainz — vingt ans de
  discographie vérifiée par la communauté — rend son verdict : les faits, les
  vrais.
- Labels du comparatif : `GRATTÉ SUR LA PAGE` / _au jugé_ —
  `EMPREINTE → ACOUSTID → MUSICBRAINZ` — `IDENTIFIÉ PAR L'AUDIO` / _vérifié_

### Le comparatif, ligne par ligne

| Champ    | Gratté (au jugé)                                | Identifié (vérifié)            |
| -------- | ----------------------------------------------- | ------------------------------ |
| Titre    | `Ghost - Mary On A Cross (Official Audio) [HQ]` | Mary on a Cross                |
| Artiste  | inconnu — lu dans le nom du fichier             | Ghost                          |
| Album    | —                                               | Seven Inches of Satanic Panic  |
| Année    | 2022 (date du fichier)                          | 2019                           |
| Pochette | vignette intégrée, 16:9, bandes noires          | pochette officielle, 1400×1400 |

- Ligne pochette : Et la pochette arrive avec — la vraie, carrée, pas le
  quatrième résultat de Google Images.

## Zéro expertise requise

- Kicker : `ZÉRO EXPERTISE REQUISE`
- Titre : Tu n'as pas besoin de savoir ce qu'est un tag.
- Corps 1 : Tout ce qui peut être automatisé l'est déjà : une bibliothèque
  impeccable sans jamais ouvrir un éditeur de métadonnées. Et ce qui reste,
  l'app l'explique en mots simples plutôt qu'en champs vides.
- Corps 2 : Quand elle n'est pas d'accord avec toi, c'est toi qui gagnes. Ton
  disque préféré, c'est du thrash et pas du heavy metal ? Change-le. Un clic,
  zéro friction — et Sonarche te dit exactement ce qu'il a écrit, dans quels
  fichiers, avec des mots qui se passent de wiki.
- Repères (3 puces) :
  - Des réglages sensés à l'import — la plupart des albums n'attendent rien
    de toi.
  - Tout ce qui est incertain est signalé en langage clair, et le choix t'est
    posé noir sur blanc.
  - Chaque modification te dit quels fichiers elle a touchés, avant et après.
- Widget : `Genre — Ride the Lightning` · Heavy Metal → Thrash Metal ·
  « Ce qui vient de se passer » — Thrash Metal appartient à la famille Metal :
  l'album ne bouge pas de ta bibliothèque. Le nouveau genre est écrit dans les
  tags des 8 fichiers — rien d'autre ne change. · `Famille de genre : Metal ↳ dérivé`

## La cale est à toi

- Kicker : `LA CALE EST À TOI`
- Titre : Rien n'est verrouillé ici. Ce ne sont que des fichiers.
- Corps : Tout atterrit dans `Music/Sonarche/` — juste à côté du dossier que
  ton app actuelle utilise déjà. Les noms vivent dans les fichiers eux-mêmes,
  dans les standards de tags que tous les lecteurs lisent depuis vingt ans.
  Sonarche range ta musique et te la rend aussitôt — il ne la prend jamais en
  otage.

### L'arborescence

```
▾ Music
  ▾ Sonarche
    ▾ Ghost
      ▾ Seven Inches of Satanic Panic (2019)
        ♫ 01 Kiss the Go-Goat.opus
        ♫ 02 Mary on a Cross.opus
        ▣ cover.jpg
  ▸ TonAutreAppMusique
```

- Note : Déplace le dossier où tu veux : tout marche encore.

### Où elle peut aller

- **Un téléphone** — branche-le, dépose le dossier, terminé
- **Un disque dur** — ta sauvegarde est un copier-coller
- **Un autre lecteur** — les tags sont standard : il les lit
- **Une autre machine** — aucun compte, aucun ré-import, aucun service de
  synchro

- Chute : Et si Sonarche ne te plaît plus, ta bibliothèque part avec toi —
  taguée jusqu'au dernier morceau.

## Sous le pont

- Kicker : `SOUS LE PONT`
- Titre : Pas de magie. Des outils éprouvés, bien orchestrés.
- Corps : Rien ne t'oblige à t'y intéresser — mais tout est là, en mots
  simples, parce que tu mérites de savoir ce qui tourne sur ta machine.

### Trois cartes

- `LA COQUE` — **Tauri, pas un onglet de navigateur** — L'interface est
  construite avec des outils web modernes, pour être vraiment agréable à
  regarder et à utiliser — mais elle est livrée comme une vraie app de bureau,
  quelques mégaoctets, pas un navigateur embarqué qui dévore ta RAM.
- `LE MOTEUR` — **Du Rust en dessous** — Tout ce qui est lourd — la
  récupération, l'écriture des fichiers, la lecture audio — tourne en Rust.
  C'est la différence entre un lecteur qui hoquette et un lecteur qui ne
  bronche pas.
- `LA CAISSE À OUTILS` — **Un sidecar scellé** — beets et ses outils Python
  vivent à l'intérieur de l'app, dans leur propre runtime embarqué. Rien à
  installer, rien à mettre à jour, et rien qui puisse entrer en conflit avec
  ce qui est déjà sur ta machine.

### Nœuds du schéma

- Le flux — Une URL quelque part — un titre, un album, une playlist.
  (_le web ouvert_)
- `PYTHON EMBARQUÉ · SCELLÉ, LIVRÉ AVEC L'APP`
- yt-dlp — Hisse l'audio natif à bord — jamais de ré-encodage.
- ffmpeg + Chromaprint — Distille chaque morceau en empreinte acoustique.
- beets (_le chef d'orchestre_) — Dirige chaque appel, vérifie chaque tag,
  et range chaque morceau à sa place dans la bibliothèque.
- MusicBrainz — L'encyclopédie ouverte de la musique enregistrée — titres,
  albums, années.
- AcoustID — Relie l'empreinte à l'enregistrement exact.
- 📁 /sonarche — Après tout ça, ce n'est qu'un dossier de musique. Le tien.
  Ouvre-le, déplace-le, sauvegarde-le.

## Le pont

- Kicker : `LE PONT`
- Titre : Ta bibliothèque, tes règles.
- Corps : Albums, artistes, familles de genres — organisés par des métadonnées
  vérifiées, et qui se parcourent comme une vraie collection. Chaque champ
  reste modifiable, et un clic relance l'empreinte si une correspondance est
  fausse.
- Puces :
  - Modifie une fois — écrit dans tous les fichiers.
  - Tu vois d'un coup d'œil ce qui est complet : 7 champs sur 7, badges 100 %.
  - Les genres forment des familles — Metal, Électro, Jazz — chacune avec sa
    teinte.
- Widget (`Métadonnées — Oath`) : Titre `Oath` · Artiste `The Algorithm` ·
  Année `2021` · Genre `Progressive Metal` · Genre parent `Metal · dérivé` ·
  boutons `✦ Re-matcher` et `Modifier`.

## Le son du navire

- Kicker : `LE SON DU NAVIRE`
- Titre : Pas seulement le port — le son du navire lui-même.
- Corps : La dernière étape de l'ancienne méthode, c'était de déplacer les
  fichiers vers un autre lecteur. Sonarche est aussi le lecteur — un moteur
  audio natif en Rust : les morceaux démarrent au quart de tour, et ceux d'un
  même album s'enchaînent sans le moindre blanc.
- Lecteur : `Oath` · `The Algorithm` · `1:12` / `2:54`

## En vrai (screenshots)

- Kicker : `EN VRAI`
- Titre : Voici à quoi ressemble le pont.
- Compteur : `01 / 05`
- Bascule de thème : `Clair` · `Sombre` — libellé du groupe : Thème des
  captures

### Les cinq captures

1. `Album` — **Un album, entier** — Quatorze morceaux, quatorze jeux de tags
   complets, la bonne pochette — et ça joue depuis la même fenêtre.
2. `Genres` — **Les genres en arbre** — Metal contient Metalcore, Heavy Metal,
   Progressive Metal, Power Metal — et sait qu'il représente 32 % de
   l'étagère.
3. `Métadonnées` — **Rien n'est écrit dans ton dos** — Renomme un artiste et
   Sonarche demande lequel des treize autres morceaux doit suivre. Tu tranches
   avant que quoi que ce soit ne touche un fichier.
4. `Inspecteur` — **Sept champs sur sept** — L'inspecteur se glisse par-dessus
   la liste, pour corriger un morceau sans jamais perdre ta place.
5. `Entretien` — **Il tient sa propre liste de corrections** — Années
   manquantes, genres hors arbre, tracklists à trous — vingt choses à
   corriger, réunies sur un écran.

## Premier lancement

- Kicker : `PREMIER LANCEMENT`
- Titre : Ton système va hésiter. Une fois.
- Corps : Sonarche n'est signé ni par Apple ni par Microsoft — ce sont des
  certificats à l'année, pas des audits de sécurité, et ce projet a préféré la
  voie du code public. Le tout premier lancement te coûte donc un clic de
  plus, sur l'une comme sur l'autre plateforme.
- macOS : Gatekeeper affiche « Apple n'a pas pu vérifier que cette app ne
  contient pas de logiciel malveillant ». → `clic droit sur l'app → Ouvrir →
Ouvrir` — Ou si elle est déjà bloquée : Réglages Système → Confidentialité
  et sécurité → Ouvrir quand même.
- Windows : SmartScreen affiche « Windows a protégé votre ordinateur » et
  cache le bouton. → `Informations complémentaires → Exécuter quand même` —
  Ou avant d'ouvrir : clic droit sur le fichier → Propriétés → Débloquer.
- Chute : Ensuite, c'est ton app, tout simplement.

## CTA final & footer

- Titre : Gratuit. Open source. À toi.
- Corps : Pas d'abonnement, pas de cloud, pas de verrou. Le code est sur
  GitHub — lis-le, forke-le, monte à bord.
- CTA : le bouton de téléchargement — voir § Téléchargement. Le `GitHub ↗` du
  colophon, juste en dessous, garde le dépôt à un clic : le corps reste vrai.
- Footer : `Licence : MIT` · Usage personnel — respecte les conditions des
  services que tu utilises et le droit de ton pays. · `SONARCHE` ·
  par Romain Pierucci (@Norudah) · _From the stream into the Ark._ (EN) ·
  `GitHub ↗`
- Les deux liens du colophon qui mènent à GitHub — le profil et le dépôt —
  portent la marque GitHub, petite et à l'opacité du texte. Elle signale où va
  le lien ; ce n'est pas un bouton.
- La signature est une attribution, pas une biographie : une ligne, en bas, à
  la taille du colophon, et le nom renvoie au profil GitHub. Le produit est le
  sujet ; l'auteur est la signature. Elle n'apparaît pas sur la carte de
  partage.

## Téléchargement

Un seul composant, rendu comme CTA principal dans le hero puis dans le CTA
final. Il lit le système du visiteur et propose la version qui lui correspond.

macOS affiche **les deux** puces côte à côte plutôt que d'en choisir une. Ce
n'est pas de l'indécision : sur macOS, tous les navigateurs annoncent
`Intel Mac OS X` quelle que soit la puce, et la seule API qui dit vrai n'existe
que sur Chromium. Deviner, c'est offrir un échec silencieux et incompréhensible
à celui qu'on se trompe — la page demande donc, et la note dit où regarder.

Chaque bouton et chaque ligne du panneau porte la marque de sa plateforme — le
logo Pomme, le drapeau Windows. C'est la marque qui nomme la plateforme, et
c'est pourquoi la paire macOS n'a pas besoin d'intitulé au-dessus : le logo dit
`macOS`, le libellé dit quelle puce. Cet intitulé a existé, il a été coupé pour
cette raison.

- CTA neutre, avant que le système soit connu et si le JavaScript n'arrive
  jamais : `Télécharger Sonarche ↓`
- macOS, les deux boutons, chacun sous une Pomme : `Apple Silicon` · `Intel`
- Windows, un seul bouton, sous le drapeau : `Télécharger pour Windows ↓`
- Ligne meta sous les boutons, sur une seule ligne, les deux moitiés séparées
  par `·` :
  - Quel Mac : Tu ne sais pas ? Menu Pomme → À propos de ce Mac : `Puce` veut
    dire Apple Silicon.
  - Bascule : `Toutes les versions` / `Masquer les versions`
- Lignes du panneau : `macOS · Apple Silicon` · `macOS · Intel` · `Windows`
- Détail par ligne, une fois la release connue : `{taille} Mo`
- Ligne de version sous le panneau : `Version {n}` — absente tant que la
  release n'a pas répondu, jamais inventée.
- Lien de repli du panneau, toujours présent : `Toutes les versions sur GitHub ↗`

## Métadonnées (non visibles sur la page)

Ces trois chaînes ne sont lues que par un moteur de recherche ou par l'aperçu
d'un lien partagé. Elles ne s'affichent nulle part sur la page, mais ce sont
elles qu'on voit avant de cliquer, donc elles font partie de la copy.

- Titre de recherche (`<title>`) : `Sonarche — bibliothèque musicale open source et hors ligne`
  — la tagline n'y est pas : personne ne la tape dans une barre de recherche.
  Marque d'abord, puis ce que c'est, en français.
- Titre de marque (`og:title`, carte partagée) :
  `Sonarche — From the stream into the Ark.` — un lien partagé est lu par
  quelqu'un, pas comparé à une requête.
- Description (`meta description`, `og:description`) : la subline du hero,
  telle quelle, sans rien ajouter — 147 caractères, sous la coupure des
  ~155 d'un extrait Google.
