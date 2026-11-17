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
- Titre, seule ligne sous la tagline (le `h1` de la page ; le wordmark et la
  tagline ne sont pas des titres) : Colle un lien : Sonarche télécharge le
  morceau, le reconnaît à l'oreille, corrige ses tags et le range. Une seule ligne, exprès : le hero accroche, le badge
  dit open source, le `<title>` et la description disent Mac et Windows.
- CTA principal : le bouton de téléchargement — voir § Téléchargement
- CTA secondaire : `Comment ça marche ↓`
- Indice de scroll : `DÉFILER ↓`

## La traversée

- Kicker : `COMMENT ÇA MARCHE`
- Titre : Un lien entre. _Un morceau parfaitement tagué_ en sort.
- Sous-titre : Sonarche télécharge, identifie, tague et range chaque morceau :
  tu n'as presque rien à faire à part le regarder travailler.

### Étape 01 — Colle un lien

Un titre, un album, une playlist entière. Colle le lien dans l'application :
Sonarche télécharge tout, morceau par morceau.
Note : Déjà dans la cale ? Il passe son tour. Pas de duplication.

### Étape 02 — Regarde-le télécharger

Les pastilles passent au vert une à une : chaque morceau arrive dans sa
qualité audio d'origine, sans réencodage.
Note : Si tu fermes la fenêtre pendant l'opération, la suite sera reprise
automatiquement au prochain lancement : tu ne perds pas ta progression.

### Étape 03 — Empreinte et identification

ffmpeg et Chromaprint analysent l'audio directement et en extraient une
empreinte acoustique. AcoustID et MusicBrainz y reconnaissent l'enregistrement
exact, sans jamais deviner à partir du titre.
Note : Pas de correspondance sûre ? Sonarche t'informe et te laisse trancher
plutôt que d'inventer.

### Étape 04 — Tags, pochette et dossier rangé

Titre, artiste, album, genre, piste, année, et la vraie pochette : tout est
écrit dans les tags du fichier, qui est renommé et rangé dans le dossier de
son album.
Note : Dans les fichiers eux-mêmes, pas dans une base que seul Sonarche
saurait lire.
Étiquettes de la scène (celles qui volent jusqu'au fichier dans le dessin de
l'étape) : `Titre` · `Artiste` · `Album` · `Genre` · `Piste` · `Année`

## L'ancienne méthode

- Kicker : `TOUT EN UN`
- Titre : L'ancienne méthode, tu la connais par cœur.
- Sous-titre : Cinq outils, quatre onglets, et un dossier Téléchargements qui
  ressemble à une scène de crime. Chaque étape perd quelque chose en route.

### Les cinq maillons de la chaîne

Cinq colonnes : libellé d'étape, outil (barré), un petit dessin de ce qu'il
laisse derrière lui, coût. Une accolade réunit les cinq dans la carte résultat.

1. `ONGLET 1` · **Un site de conversion** · _Lent et un seul morceau à la fois._
2. `APP 1` · **Un téléchargeur en masse** · _Des tags devinés._
3. `APP 2` · **Un éditeur de tags** · _Des heures de saisies et de clics
   manuels._
4. `ONGLET 2` · **Une recherche d'images** · _Des rectangles, des carrés :
   c'est pas carré._
5. `APP 3` · **Ton lecteur de musique** · _Résultat ? Une bibliothèque
   bancale._

Dessins (contenu de démo, non traduit sauf les libellés) : le nom de fichier
`Ghost - Mary On A Cross (Official Audio) [HQ].mp3` · tags devinés
`Artiste : Unknown`, `Album :` (vide), `Année :` (vide) · `× 80` · doublons
`Mary On A Cross`, `Mary On A Cross (1)`, `Mary On A Cross (2)`,
`Mary On A Cross (Official Audio)`.

### La chute

- Titre punch : Sonarche fait les cinq. Dans une seule application.
- Carte résultat : `Mary on a Cross` · `Ghost` ·
  `Seven Inches of Satanic Panic · 2019`

## Les vrais noms

- Kicker : `TAGS AUTOMATIQUES`
- Titre : Il ne lit pas le titre. Il écoute le morceau.
- Accroche : Sonarche identifie chaque morceau à son empreinte audio et
  remplit ses tags tout seul. Il ne devine jamais.
- Lien sous l'accroche, vers l'article du journal sur les tags :
  `Pourquoi les tags sont si souvent faux →`
- Deux inspecteurs côte à côte, statiques. Libellé du panneau `PISTE`.
  - `GRATTÉ SUR LA PAGE` / _au jugé_ · `1 champ sur 7`
  - `IDENTIFIÉ PAR L'AUDIO` / _vérifié_ · `7 champs sur 7`

### Les champs de l'inspecteur

| Champ    | Gratté (au jugé)                                | Identifié (vérifié)           |
| -------- | ----------------------------------------------- | ----------------------------- |
| N° piste | —                                               | 2                             |
| Titre    | `Ghost - Mary On A Cross (Official Audio) [HQ]` | Mary on a Cross               |
| Artiste  | inconnu, lu dans le nom du fichier              | Ghost                         |
| Album    | —                                               | Seven Inches of Satanic Panic |
| Année    | 2022 (date du fichier)                          | 2019                          |
| Genre    | —                                               | Hard Rock                     |

- Ligne pochette : Et la pochette arrive avec. La vraie, carrée, pas le
  quatrième résultat de Google Images.

## Zéro expertise requise

- Kicker : `ÉDITEUR DE TAGS INTÉGRÉ`
- Titre : Tu n'as pas besoin de savoir ce qu'est un tag.
- Accroche : Tout ce qui peut être automatisé l'est déjà. Le reste, c'est toi
  qui décides.

### Les cartes

- Albums (se remplit jusqu'à `100 %`) : Des réglages intelligents à
  l'importation : la plupart des albums n'attendent rien de toi.
- Incertain (onglet `Métadonnées`, champs `Titre` · `Artiste` · `Année`,
  drapeau `Incertain`) : Tout ce qui est incertain est signalé clairement dans
  l'onglet Métadonnées : tu as le choix de t'en occuper ou non.
- Aides : Des aides disséminées un peu partout t'expliquent les termes
  compliqués.
  - `Artiste de l'album` · _album rangé sous Daft Punk_ · bulle : Celui qui
    signe l'album. Un invité sur un morceau ne le déplace pas.
  - `Famille de genre · calculée, ne compte pas` · `Électro` · bulle : Le
    grand genre du tien : French House range l'album sous Électro.
  - `Catégorie · ne compte pas dans la complétion` · `Musique` ·
    `Jeux vidéo` · `Films` · `Anime` · bulle : Musique, jeux vidéo, films…
    pour trier, sans toucher à la complétion.
- Re-match : Un clic relance l'empreinte si une correspondance est fausse.
  `Track 07` · `Artiste inconnu` · `Erreur` → `Creeping Death` ·
  `Metallica · Ride the Lightning` · `vérifié` · bouton `Re-matcher`.

### L'éditeur

- Kicker : `CUSTOMISE À TA SAUCE`
- Titre : Quand elle n'est pas d'accord avec toi, c'est toi qui gagnes.
- Fenêtre (libellés de l'app) : `ALBUM · MÉTADONNÉES` · `13 titres · 2013` ·
  `14 modifications sur 13 morceaux` · `Les 13 morceaux sont complets` ·
  `CE QUI VAUT POUR TOUT L'ALBUM` · `Album` · `Artiste de l'album` ·
  `Année` · `Genre` · `Catégorie` · `Famille de genre · Électro`
- Menu de genre : `ÉLECTRO` · `House` · `French House` · `Nu-Disco` ·
  `Synthpop`
- Catégories : `Musique` · `Jeux vidéo` · `Films` · `Séries`
- Colonnes : `N°` · `TITRE` · `ARTISTE` · `GENRE` · `TAGS`
- Popover : `ARTISTE · GET LUCKY` · Tu as changé « Daft Punk » en « Daft Punk
  feat. Pharrell Williams ». Lesquels des autres morceaux doivent suivre ? ·
  `Appliquer à 12 morceaux` · `Ne rien changer`
- Actions : `Re-matcher` · `Annuler` · `Enregistrer`

## En vrai (screenshots)

- Kicker : `L'APPLICATION`
- Titre : Voici Sonarche, écran par écran.
- Compteur : `01 / 05`
- Bascule de thème : `Clair` · `Sombre` — libellé du groupe : Thème des
  captures

### Les cinq captures

1. `Album` — **Un album, entier** — Quatorze morceaux, quatorze jeux de tags
   complets, la bonne pochette, et ça joue depuis la même fenêtre.
2. `Genres` — **Les genres en arbre** — Metal contient Metalcore, Heavy Metal,
   Progressive Metal, Power Metal, et sait qu'il représente 32 % de
   l'étagère.
3. `Métadonnées` — **Rien n'est écrit dans ton dos** — Renomme un artiste et
   Sonarche demande lequel des treize autres morceaux doit suivre. Tu tranches
   avant que quoi que ce soit ne touche un fichier.
4. `Inspecteur` — **Sept champs sur sept** — L'inspecteur se glisse par-dessus
   la liste, pour corriger un morceau sans jamais perdre ta place.
5. `Entretien` — **Il tient sa propre liste de corrections** — Années
   manquantes, genres hors arbre, tracklists à trous : vingt choses à
   corriger, réunies sur un écran.

Les titres sont des légendes, pas des descriptions ; l'`alt` de chaque capture
dit ce qu'elle montre :

1. Vue Album de Sonarche : la liste des morceaux, la pochette et le lecteur.
2. Vue Genres : l'arbre des genres et sous-genres, avec la part de chacun dans
   la bibliothèque.
3. L'éditeur de métadonnées qui demande quels morceaux doivent suivre le
   changement d'artiste.
4. L'inspecteur de piste ouvert par-dessus la liste, ses sept champs de tags
   remplis.
5. L'écran Entretien qui liste les années manquantes, les genres hors arbre et
   les albums incomplets.

## Hissez la grande voile

- Kicker : `LECTEUR AUDIO INTÉGRÉ`
- Titre : Sonarche range ta musique. _Il la joue aussi._
- Corps : Pas besoin d'un autre lecteur : Sonarche joue ta bibliothèque sur un
  moteur natif en Rust. Ça démarre au quart de tour, un album s'enchaîne sans
  un blanc, et les paroles synchronisées suivent la musique.
- Lecteur (la barre de l'app, sur une capture de la vue Album ; alt : L'app
  derrière le lecteur : la vue Album.)
  - Commandes : `Aléatoire` · `Précédent` · `Lecture` / `Pause` · `Suivant` ·
    `Répéter` · `Paroles` · `File d'attente`
  - Panneau file : `File d'attente` · `11 titres` · `EN LECTURE` · `À SUIVRE`
  - Panneau paroles : `Paroles` · `SYNCHRONISÉES`
  - Premier morceau : `Drunken Sailor` · `Traditionnel` (domaine public, d'où
    les paroles), puis `Carolina`, `Far and Away`, `Crazy Life`,
    `Apocalyptic Love`, `We Will Roam`, `Shots Fired` de Slash featuring
    Myles Kennedy and the Conspirators (l'album de la capture).

## Ton navire, ton équipage

- Kicker : `TES FICHIERS`
- Titre : Rien n'est verrouillé ici. Ce ne sont que des fichiers.
- Corps (sous le titre) : Tout atterrit dans `Music/Sonarche/`, rangé par
  artiste et par album, à côté de ton app actuelle. Les tags vivent dans les
  fichiers eux-mêmes : n'importe quel lecteur les lit.

### Le gestionnaire de fichiers

Le système du visiteur, dessiné de façon générique : un Explorateur
Windows 11 ou un Finder macOS en vue colonnes. Chemin
`Musique › Sonarche › Ghost › Prequelle (2018)`, morceaux `01 Ashes.m4a` …
`10 Life Eternal.m4a` et `cover.jpg` (du m4a : ce que l'app écrit ; elle ne
gère pas l'Opus), à côté de
`Seven Inches of Satanic Panic (2019)` et `TonAutreAppMusique`.

- Libellés Windows : `Ce PC` · `Musique` · `Accueil` · `Bureau` ·
  `Téléchargements` · `Clé USB (E:)` · colonnes `Nom` · `#` · `Titre` ·
  `Artistes ayant participé` · détails `Titre` · `Artistes ayant participé` ·
  `Album` · `Année` · `Genre` · barre d'état `11 éléments` ·
  `1 élément sélectionné` · barre d'outils `Nouveau` · `Trier` · `Afficher` ·
  `Détails` · `Rechercher dans : Prequelle`
- Libellés macOS : `Favoris` · `Emplacements` · `Récents` · `Applications` ·
  `Bureau` · `Téléchargements` · `Musique` · `Clé USB` · détails `Titre` ·
  `Artiste` · `Album` · `Année` · `Genre` · `Rechercher`
- Note : Déplace le dossier où tu veux : tout marche encore.

### Où elle peut aller

- **Un téléphone** — branche-le, dépose le dossier, terminé
- **Un disque dur** — ta sauvegarde est un copier-coller
- **Un autre lecteur** — les tags sont standard : il les lit
- **Une autre machine** — aucun compte, aucun ré-import ni synchronisation

- Chute : Et si Sonarche ne te plaît plus, ta bibliothèque part avec toi,
  taguée jusqu'au dernier morceau.

## Sous le pont

- Kicker : `SOUS LE CAPOT`
- Titre : Pas de magie : _beets, yt-dlp et MusicBrainz_, bien orchestrés.
- Corps : Rien ne t'oblige à t'y intéresser, mais tout est là si tu t'y
  intéresses, parce que tu mérites de savoir ce qui tourne sur ta machine. Si
  tu connais beets : Sonarche l'embarque, le configure et lui donne une
  interface.

### Trois cartes

- `LA COQUE` — **Tauri, pas un onglet de navigateur** — L'interface est
  construite avec des outils web modernes, pour être vraiment agréable à
  regarder et à utiliser, mais elle est livrée comme une vraie app de bureau,
  quelques mégaoctets, pas un navigateur embarqué qui dévore ta RAM.
- `LE MOTEUR` — **Du Rust en dessous** — Tout ce qui est lourd tourne en Rust : la
  récupération, l'écriture des fichiers, la lecture audio.
  C'est la différence entre un lecteur bugué, lent et un lecteur efficace,
  rapide, qui ne bronche pas.
- `LA CAISSE À OUTILS` — **Un sidecar scellé** — beets et ses outils Python
  vivent à l'intérieur de l'app, dans leur propre runtime embarqué. Rien à
  installer, rien à mettre à jour, et rien qui puisse entrer en conflit avec
  ce qui est déjà sur ta machine.

### Nœuds du schéma

- Téléchargement — Une URL quelque part : un titre, un album, une playlist.
  (_le web ouvert_)
- Importation — Ta bibliothèque actuelle, ce que tu as déjà : copié, jamais
  déplacé. (_hors ligne_)
- `PYTHON EMBARQUÉ · SCELLÉ, LIVRÉ AVEC L'APP`
- yt-dlp — Récupère l'audio original du lien, tel quel : jamais reconverti.
- ffmpeg + Chromaprint — Distille chaque morceau en empreinte acoustique.
- beets (_le chef d'orchestre_) — Dirige chaque appel, vérifie chaque tag,
  et range chaque morceau à sa place dans la bibliothèque.
- 📁 /sonarche — Ton dossier de musique. Le tien. Ouvre-le, déplace-le,
  sauvegarde-le.

#### Les services, groupés par ce qu'ils répondent

- `IDENTIFIER`
  - AcoustID — relie l'empreinte acoustique à l'enregistrement exact.
  - MusicBrainz — l'encyclopédie ouverte : titres, albums, années.
- `HABILLER`
  - Cover Art Archive — les pochettes.
  - Last.fm — les genres.
- `ACCOMPAGNER`
  - LRCLIB — les paroles synchronisées, celles qui suivent la musique.
  - lyrics.ovh — les paroles en secours, texte brut, quand LRCLIB n'a rien.
- Note sous la colonne : Ces services sont interrogés à la demande, jamais
  obligatoires. Tu n'as aucun compte à créer, aucune clé à coller : l'app
  s'annonce poliment et espace ses appels.

## FAQ

Entre Sous le capot et le CTA final. Des questions simples, dans les mots
qu'on tape ; le seul endroit où la page se compare à d'autres outils, et elle
reste juste.

- Kicker : `QUESTIONS FRÉQUENTES`
- Titre : Avant de _monter à bord._

1. **Sonarche est vraiment gratuit ?** Oui. C'est un logiciel open source sous
   licence MIT : pas de publicité, pas de version payante, pas d'abonnement.
2. **Sur quels systèmes ?** macOS, avec un seul fichier pour les Mac Apple
   Silicon et Intel, et Windows 10 ou 11 en 64 bits. Il n'y a pas de version
   Linux pour l'instant.
3. **Quels formats audio ?** À l'import et à la lecture : MP3, FLAC, M4A, AAC,
   OGG, WAV et AIFF. Les morceaux ajoutés depuis un lien arrivent en M4A, ou
   en MP3 si tu le choisis dans les réglages.
4. **Je peux importer ma bibliothèque existante ?** Oui. Montre-lui tes
   dossiers : Sonarche les copie, sans jamais déplacer les originaux, puis
   identifie et tague ce qu'il trouve.
5. **D'où vient la musique ?** De deux endroits : un lien que tu colles, dont
   Sonarche télécharge l'audio d'origine avec yt-dlp, ou les dossiers que tu as
   déjà sur ta machine.
6. **Il faut créer un compte ?** Non. Aucun compte, aucun cloud. Ta
   bibliothèque et le lecteur marchent hors ligne : internet ne sert qu'à
   télécharger et à identifier les morceaux.
7. **Quelle différence avec MusicBee, Picard ou beets ?** MusicBee range et
   joue ta musique, mais seulement sous Windows. Picard est un éditeur de tags
   très précis, qui te laisse choisir chaque édition à la main, sans
   bibliothèque ni lecteur. beets fait le même travail en ligne de commande.
   Sonarche embarque beets, choisit pour toi et fait toute la chaîne, du lien
   au lecteur.

## CTA final & footer

- Titre : Gratuit. Open source. À toi.
- Corps : Pas d'abonnement, pas de cloud, pas de verrou. Le code est sur
  GitHub : lis-le, forke-le, monte à bord.
- CTA : le bouton de téléchargement — voir § Téléchargement. Le `GitHub ↗` du
  colophon, juste en dessous, garde le dépôt à un clic : le corps reste vrai.
- Ligne d'aide (sous le CTA, renvoie au guide de premier lancement) : Besoin
  d'aide pour le premier lancement ? `Lire le guide →`
- Footer : `Licence : MIT` · Usage personnel. Respecte les conditions des
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

## Barre de navigation

Fixée en haut de la landing, elle glisse en place une fois le hero sorti de
l'écran, et repart quand on remonte jusqu'à lui.

- À gauche : la marque et `SONARCHE`, qui ramènent en haut de la page.
- Liens : `Guide` (dès qu'un guide est publié) · `Journal`
- Téléchargement, compact, sous la marque de la plateforme : `Télécharger ↓`
  (même fichier que le CTA principal).
- Langues : `FR · EN`, la langue courante dans l'accent.

## Téléchargement

Un seul composant, rendu comme CTA principal dans le hero puis dans le CTA
final. Il lit le système du visiteur et propose la version qui lui correspond.

macOS a un seul bouton, comme Windows. Le dmg est universel : le même fichier
tourne sur Apple Silicon et sur Intel, il n'y a donc plus de puce à demander.
(La page affichait les deux puces, parce que sur macOS tous les navigateurs
annoncent `Intel Mac OS X` quelle que soit la puce ; la version universelle a
supprimé la question.)

Chaque bouton et chaque ligne du panneau porte la marque de sa plateforme — le
logo Pomme, le drapeau Windows.

- CTA neutre, avant que le système soit connu et si le JavaScript n'arrive
  jamais : `Télécharger Sonarche ↓`
- macOS, un seul bouton, sous la Pomme : `Télécharger pour macOS ↓`
- Windows, un seul bouton, sous le drapeau : `Télécharger pour Windows ↓`
- Ligne meta sous le bouton : la bascule, `Toutes les versions` /
  `Masquer les versions`
- Lignes du panneau : `macOS · Apple Silicon et Intel` · `Windows`
- Détail par ligne, une fois la release connue : `{taille} Mo`
- Ligne de version sous le panneau : `Version {n}` — absente tant que la
  release n'a pas répondu, jamais inventée.
- Lien de repli du panneau, toujours présent : `Toutes les versions sur GitHub ↗`

## Métadonnées (non visibles sur la page)

Ces chaînes ne sont lues que par un moteur de recherche ou par l'aperçu
d'un lien partagé. Elles ne s'affichent nulle part sur la page, mais ce sont
elles qu'on voit avant de cliquer, donc elles font partie de la copy.

- Titre de recherche (`<title>`) :
  `Sonarche | Gestionnaire de bibliothèque musicale open source`
  — la tagline n'y est pas : personne ne la tape dans une barre de recherche.
  Marque d'abord, puis la catégorie, dans les mots qu'on cherche.
- Titre de partage (`og:title`, carte partagée) :
  `Sonarche : gestionnaire de bibliothèque musicale open source`. La tagline
  est sur l'image de la carte ; le titre dit ce qu'est le lien.
- Description (`meta description`, `og:description`) : Logiciel open source
  pour Mac et Windows : colle un lien, Sonarche télécharge le morceau,
  l'identifie à son empreinte audio, corrige ses tags et le joue.
  (153 caractères, sous la coupure des ~155 d'un extrait Google.)
- Description de la carte (`og:image:alt`), une seule pour tout le site
  puisqu'il n'y a qu'une carte, et elle décrit le dessin et non la page depuis
  laquelle on partage : Sonarche : l'arche flottant sur une mer dessinée en
  barres d'égaliseur, sous le mot SONARCHE et la devise
  « From the stream into the Ark. »
- Le séparateur de tous les `<title>` est une barre verticale, la convention
  web ordinaire. L'`og:title` recolle la marque et la tagline avec un
  deux-points plutôt qu'un tiret : un lien partagé se lit comme une phrase,
  il n'est pas comparé à une requête.

## Journal

Le blog, entré depuis la ligne de flottaison du footer et depuis nulle part
ailleurs : la landing est une narration au scroll, une liste d'articles au
milieu la couperait. Le corps des articles ne vit pas ici — un article est une
page écrite à la main, et son texte reste avec elle
(`components/blog/posts/<id>/fr.tsx`). Ce qui suit est le seul cadre partagé.

- Lien dans le footer de la landing : `Journal`
- Fil d'Ariane en tête du journal : `SONARCHE · Journal`
- Titre de l'index : `Le journal de bord`
- En construction, sous la ligne sous le titre : `EN CONSTRUCTION` ·
  Le journal s'étoffe au fil de l'eau. On le publie déjà, tel qu'il est.
- Ligne sous le titre : Des notes sur la musique qu'on possède : fichiers,
  métadonnées, formats, et ce qu'il faut pour qu'une bibliothèque survive aux
  applications qui la lisent.
- Titre de recherche de l'index (`<title>`, jamais affiché) :
  `Journal Sonarche | bibliothèque musicale, tags et métadonnées`
- En-tête de l'index : le libellé `Journal`, le titre et la ligne sous le
  titre, centrés sur des lignes de cahier.
- L'article le plus récent ouvre l'index en carte large, libellée `À la une` ;
  les autres suivent en cartes. Chaque carte porte son illustration, la date, le
  titre, la description et la durée de lecture.
- Carte sous les articles, vers le guide :
  - Libellé : `Tu cherches un mode d'emploi ?`
  - Corps : Le journal raconte, le guide montre. Les pas-à-pas de l'app sont
    dans le `guide →`
- Ligne de date d'un article, centrée au-dessus du titre :
  `Journal · {date} · {n} min de lecture`, et `Mis à jour le {date}` en plus
  quand le texte a vraiment été révisé. Sous la description :
  `par Romain Pierucci`.
- Carte avant la carte de fin, quand l'article a un guide qui va avec :
  `Le mettre en pratique · Guide`, puis le titre du guide et sa durée.
- Carte de fin d'article :
  - Titre : `Sonarche fait tout ça pour toi`
  - Corps : Une app de bureau qui identifie chaque morceau à l'oreille, le range
    dans des dossiers clairs que tu peux lire sans elle, et joue l'ensemble sur
    un moteur natif. Gratuite, open source, hors ligne.
  - Lien : `Découvrir Sonarche →`
- Pied du journal : la ligne de colophon de la landing, seule (§ CTA final & footer).

## Guide

Les pas-à-pas, à `/guide/`. Mis en page comme une documentation : un menu à
gauche liste chaque guide par thème, et le guide ouvert déplie ses sections
sous son titre. Le texte de chaque guide vit avec
lui (`components/guide/guides/<id>/fr.tsx`) ; ce qui suit est le cadre partagé.
Le lien du footer n'apparaît qu'une fois un guide publié — voir `draft` dans
lib/guide.ts.

- Lien dans le footer de la landing : `Guide`
- Fil d'Ariane en tête : `SONARCHE · Guide`
- Titre de l'index (carte de partage) : `Utiliser Sonarche`
- Titre affiché de l'index : `Que veux-tu faire ?`
- En construction, sous la ligne sous le titre : `EN CONSTRUCTION` ·
  Le guide grandit au fil des versions. On le publie déjà, tel qu'il est.
- Ligne sous le titre : Comment obtenir de chaque partie de l'app ce que tu en
  attends, un pas-à-pas à la fois. Écrit pour une version numérotée, et repris
  quand cette version bouge.
- Titre de recherche de l'index (`<title>`, jamais affiché) :
  `Guide Sonarche | installer, importer, taguer et écouter`
- Les quatre thèmes, dans cet ordre : `Démarrer` · `Ta bibliothèque` ·
  `Écouter` · `Réglages et entretien`
- Menu de gauche : `Accueil du guide`, puis chaque thème et ses guides. Plié
  sur mobile sous `Tous les guides`.
- Carte en tête de l'index, pour le premier guide :
  `Nouveau ici ? Commence par là`, puis le titre du guide, sa description et sa
  durée.
- Au-dessus des autres guides : `Tous les guides`
- Ligne au-dessus du titre d'un guide : le thème, puis `{n} min de lecture`, et
  la pastille `Brouillon` tant qu'il n'est pas publié.
- Fin d'un guide : `← Tuto précédent` et `Tuto suivant →`, chacun avec le
  titre du guide. Le dernier guide se ferme sur `Tous les guides →` à la place.
  Jamais un bouton de téléchargement : la personne qui lit un guide a déjà l'app.
- Ligne sous le guide et sous l'index : Un écran ne ressemble plus au guide ?
  `Signale-le sur GitHub ↗`
- Index vide : `Rien ici pour l'instant` / Les premiers pas-à-pas sont en cours
  d'écriture. En attendant, il y a de quoi lire dans le journal.

## Pages de lecture

Ce que le journal et le guide disent à l'identique. Leur cadre est le même
(`components/reading`) : même en-tête, même pied, même typographie.

- En-tête : la barre de navigation de la landing (§ Barre de navigation),
  collée en haut dès le départ, son lien de langue pointant vers cette page
  dans l'autre langue. La section courante est à l'encre.
- Pied : la ligne de colophon de la landing, seule : `SONARCHE` · signature ·
  _From the stream into the Ark._ · `Journal` · `Guide` · autre langue ·
  `GitHub ↗`, son lien de langue pointant vers cette page dans l'autre langue.
- Durée : `{n} min de lecture` · Révision : `Mis à jour le {date}`
