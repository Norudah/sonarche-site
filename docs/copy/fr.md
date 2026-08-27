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
- Subline : Une bibliothèque musicale qui t'appartient vraiment : chaque
  morceau identifié à l'oreille, tes fichiers sur ta machine, avec les
  bonnes informations.
- CTA principal : le bouton de téléchargement — voir § Téléchargement
- CTA secondaire : `Comment ça marche ↓`
- Indice de scroll : `DÉFILER ↓`

## La traversée

- Kicker : `LA TRAVERSÉE`
- Titre : Un lien entre, et une bibliothèque naît.
- Sous-titre : Un processus en 4 étapes simples : tu n'as presque rien à
  faire à part regarder Sonarche travailler pour toi.

### Étape 01 — Colle un lien

Un titre, un album, une playlist entière sur internet. Colle le lien dans
l'application et le voyage commence.
Note : Déjà dans la cale ? Il passe son tour. Pas de duplication.

### Étape 02 — Regarde la cargaison monter à bord

L'interface te montre exactement ce qu'il se passe : la source a-t-elle été
récupérée ? Check. Le fichier est-il présent physiquement sur ton
ordinateur ? Check. A-t-on pu identifier le morceau correctement ? Check.
Les pastilles passent au vert une à une, tu sais exactement où regarder si
un problème est détecté.
Note : Si tu fermes la fenêtre pendant l'opération, la suite sera reprise
automatiquement au prochain lancement : tu ne perds pas ta progression.

### Étape 03 — Empreinte et identification

ffmpeg et Chromaprint analysent l'audio directement, et extraient une
empreinte acoustique. Cette empreinte, si elle est identifiée, sert de carte
d'identité au morceau associé. Elle peut alors être utilisée auprès
d'AcoustID, qui va permettre de certifier avec certitude que le morceau est
bien celui-ci, et non deviné par divers tags ou autre.
Note : Pas de correspondance sûre ? Sonarche t'informe et te laisse trancher
plutôt que d'inventer.

### Étape 04 — Informations et métadonnées

Titre, artiste, album, genre, piste, année. Et la vraie pochette. Tout est
écrit dans les tags et les métadonnées du fichier. Pas de nom bizarre ou de
convention : la source de vérité est dans les tags, et Sonarche s'en occupe
correctement. Et si tu n'es pas satisfait, ou que tu souhaites customiser à
ta sauce, Sonarche met à disposition un système accessible pour modifier en
quelques clics le genre d'une musique ou d'un artiste, pour que ta
bibliothèque corresponde vraiment à tes goûts et à ta propre façon de
t'organiser.
Note : Dans les fichiers eux-mêmes, pas dans une base que seul Sonarche
saurait lire. Sonarche reste libre et open source. Tes fichiers, ta décision.
Sonarche complète les fichiers au maximum : libre à toi de rester ou non
dans l'écosystème Sonarche.

## L'ancienne méthode

- Kicker : `L'ANCIENNE MÉTHODE`
- Titre : L'ancienne méthode, tu la connais par cœur.
- Sous-titre : Cinq outils, quatre onglets, et un dossier Téléchargements qui
  ressemble à une scène de crime. Chaque étape perd quelque chose en route.

### Les cinq maillons de la chaîne

Chaque carte : libellé d'étape — outil — grief — coût.

1. `ONGLET 1` — **Un site de conversion** — Un lien à la fois, converti sur le
   serveur de quelqu'un d'autre. Tu attends dans une file, puis le navigateur
   dépose le fichier où bon lui semble. — _Lent et un seul morceau à la fois._
2. `APP 1` — **Un téléchargeur en masse** — Il gère la playlist, au moins.
   Mais il remplit les tags avec le nom du fichier : ton artiste s'appelle
   « Unknown » et ton album est vide. — _Des tags devinés._
3. `APP 2` — **Un éditeur de tags** — Ouvrir chaque fichier. Retaper le titre,
   l'artiste, l'année, le numéro de piste. Multiplié par 80. — _Des heures de
   saisies et de clics manuels._
4. `ONGLET 2` — **Une recherche d'images** — Chercher une pochette carrée qui
   ne soit pas une vignette filigranée, la recadrer, espérer qu'elle
   corresponde au bon pressage. — _Des rectangles, des carrés : c'est pas
   carré._
5. `APP 3` — **Ton lecteur de musique** — Déplacer les fichiers, relancer
   l'analyse du dossier, puis découvrir trois doublons et un album coupé en
   deux. — _Résultat ? Une bibliothèque bancale._

### La chute

- Titre punch : Sonarche fait les cinq. Dans une seule application.
- Corps punch : Colle un lien et fais ta vie à côté. Sonarche s'occupe du
  reste : il télécharge ou importe tes musiques, les identifie, remplit les
  tags, donne une pochette d'album. Le tout dans ton dossier, sur ta machine.
  Rien n'est fermé, tu peux transférer ta bibliothèque ailleurs ou lire ta
  musique ici, sur un vrai lecteur audio écrit en Rust.

## Les vrais noms

- Kicker : `LES VRAIS NOMS`
- Titre : Il ne lit pas le titre. Il écoute le morceau.
- Corps : La plupart des outils recopient le texte qui traînait avec le
  fichier. C'est comme ça qu'on se retrouve avec un artiste nommé « Official
  Audio ». Sonarche, lui, ne devine jamais : ffmpeg et Chromaprint
  transforment l'onde sonore elle-même en empreinte, AcoustID relie cette
  empreinte à un enregistrement précis, et MusicBrainz rend son verdict à
  partir de vingt ans de discographie vérifiée par la communauté : les faits,
  les vrais.
- Labels du comparatif : `GRATTÉ SUR LA PAGE` / _au jugé_ —
  `EMPREINTE → ACOUSTID → MUSICBRAINZ` — `IDENTIFIÉ PAR L'AUDIO` / _vérifié_

### Le comparatif, ligne par ligne

| Champ    | Gratté (au jugé)                                | Identifié (vérifié)            |
| -------- | ----------------------------------------------- | ------------------------------ |
| Titre    | `Ghost - Mary On A Cross (Official Audio) [HQ]` | Mary on a Cross                |
| Artiste  | inconnu, lu dans le nom du fichier              | Ghost                          |
| Album    | —                                               | Seven Inches of Satanic Panic  |
| Année    | 2022 (date du fichier)                          | 2019                           |
| Pochette | vignette intégrée, 16:9, bandes noires          | pochette officielle, 1400×1400 |

- Ligne pochette : Et la pochette arrive avec. La vraie, carrée, pas le
  quatrième résultat de Google Images.

## Zéro expertise requise

- Kicker : `ZÉRO EXPERTISE REQUISE`
- Titre : Tu n'as pas besoin de savoir ce qu'est un tag.
- Corps 1 : Ou bien même les « métadonnées » ou tout autre nom technique.
  Tout ce qui peut être automatisé l'est déjà : une bibliothèque impeccable
  sans jamais ouvrir un éditeur de métadonnées ou de fichier. Pour le reste
  tu n'es pas perdu, des aides sont disséminées un peu partout dans
  l'application et t'expliquent les termes compliqués.
- Corps 2 : Quand elle n'est pas d'accord avec toi, c'est toi qui gagnes. Ton
  disque préféré, c'est du thrash et pas du heavy metal ? Change-le. Un clic,
  zéro friction.
- Repères (3 puces) :
  - Des réglages intelligents à l'importation : la plupart des albums
    n'attendent rien de toi.
  - Tout ce qui est incertain est signalé clairement dans l'onglet
    Métadonnées : tu as le choix de t'en occuper ou non.
  - Chaque modification te dit quels fichiers elle a touchés, avant et après.
- Widget : `Genre — Ride the Lightning` · Heavy Metal → Thrash Metal ·
  « Ce qui vient de se passer » — Thrash Metal appartient à la famille Metal :
  l'album ne bouge pas de ta bibliothèque. Le nouveau genre est écrit dans les
  tags des 8 fichiers, et rien d'autre ne change. ·
  `Famille de genre : Metal ↳ dérivé`

## Ton navire, ton équipage

- Kicker : `TON NAVIRE, TON ÉQUIPAGE`
- Titre : Rien n'est verrouillé ici. Ce ne sont que des fichiers.
- Corps : Tout atterrit dans `Music/Sonarche/`, juste à côté du dossier que
  ton app actuelle utilise déjà. Les noms vivent dans les fichiers eux-mêmes,
  dans les standards de tags que tous les lecteurs lisent depuis vingt ans.
  Sonarche range ta musique et te la rend aussitôt ; il ne la prend jamais en
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
- **Une autre machine** — aucun compte, aucun ré-import ni synchronisation

- Chute : Et si Sonarche ne te plaît plus, ta bibliothèque part avec toi,
  taguée jusqu'au dernier morceau.

## Sous le pont

- Kicker : `SOUS LE PONT`
- Titre : Pas de magie. Des outils éprouvés, bien orchestrés.
- Corps : Rien ne t'oblige à t'y intéresser, mais tout est là si tu t'y
  intéresses, parce que tu mérites de savoir ce qui tourne sur ta machine.

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

## Le pont

- Kicker : `LE PONT`
- Titre : Ta bibliothèque, tes règles.
- Corps : Albums, artistes, familles de genres, organisés par des métadonnées
  vérifiées et qui se parcourent comme une vraie collection. Chaque champ
  reste modifiable, et un clic relance l'empreinte si une correspondance est
  fausse.
- Puces :
  - Modifie une fois : écrit dans tous les fichiers.
  - Tu vois d'un coup d'œil ce qui est complet : 7 champs sur 7, badges 100 %.
  - Les genres forment des familles (Metal, Électro, Jazz), chacune avec sa
    teinte.
- Widget (`Métadonnées — Oath`) : Titre `Oath` · Artiste `The Algorithm` ·
  Année `2021` · Genre `Progressive Metal` · Genre parent `Metal · dérivé` ·
  boutons `✦ Re-matcher` et `Modifier`.

## Hissez la grande voile

- Kicker : `HISSEZ LA GRANDE VOILE` (exception volontaire au tutoiement :
  c'est une formule de commandement marin figée, iconique du registre pirate,
  pas une adresse au lecteur — voir CLAUDE.md § tutoiement)
- Titre : Pas seulement le port : le son du navire lui-même.
- Corps : La dernière étape de l'ancienne méthode, c'était de déplacer les
  fichiers vers un autre lecteur. Sonarche est aussi le lecteur, un moteur
  audio natif écrit en Rust : les morceaux démarrent au quart de tour, et
  ceux d'un même album s'enchaînent sans le moindre blanc.
- Lecteur : `Oath` · `The Algorithm` · `1:12` / `2:54`

## En vrai (screenshots)

- Kicker : `EN VRAI`
- Titre : Voici à quoi ressemble le pont.
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

## Premier lancement

- Kicker : `PREMIER LANCEMENT`
- Titre : Ton système va hésiter. Une fois.
- Corps : Sonarche n'est signé ni par Apple ni par Microsoft. Ce sont des
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
  GitHub : lis-le, forke-le, monte à bord.
- CTA : le bouton de téléchargement — voir § Téléchargement. Le `GitHub ↗` du
  colophon, juste en dessous, garde le dépôt à un clic : le corps reste vrai.
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

Ces chaînes ne sont lues que par un moteur de recherche ou par l'aperçu
d'un lien partagé. Elles ne s'affichent nulle part sur la page, mais ce sont
elles qu'on voit avant de cliquer, donc elles font partie de la copy.

- Titre de recherche (`<title>`) :
  `Sonarche | bibliothèque musicale open source et hors ligne`
  — la tagline n'y est pas : personne ne la tape dans une barre de recherche.
  Marque d'abord, puis ce que c'est, en français.
- Titre de marque (`og:title`, carte partagée) :
  `Sonarche — From the stream into the Ark.` — un lien partagé est lu par
  quelqu'un, pas comparé à une requête.
- Description (`meta description`, `og:description`) : la subline du hero,
  telle quelle, sans rien ajouter — 147 caractères, sous la coupure des
  ~155 d'un extrait Google.
- Description de la carte (`og:image:alt`), une seule pour tout le site
  puisqu'il n'y a qu'une carte, et elle décrit le dessin et non la page depuis
  laquelle on partage : Sonarche : l'arche flottant sur une mer dessinée en
  barres d'égaliseur, sous le mot SONARCHE et la devise
  « From the stream into the Ark. »
- Le séparateur de tous les `<title>` est une barre verticale, la convention
  web ordinaire, jamais un tiret. L'`og:title` garde le sien : un lien partagé
  se lit comme une phrase, il n'est pas comparé à une requête.

## Journal

Le blog, entré depuis la ligne de flottaison du footer et depuis nulle part
ailleurs : la landing est une narration au scroll, une liste d'articles au
milieu la couperait. Le corps des articles ne vit pas ici — un article est une
page écrite à la main, et son texte reste avec elle
(`components/blog/posts/<id>/fr.tsx`). Ce qui suit est le seul cadre partagé.

- Lien dans le footer de la landing : `Journal`
- Fil d'Ariane en tête du journal : `SONARCHE · Journal`
- Titre de l'index : `Le journal de bord`
- Ligne sous le titre : Des notes sur la musique qu'on possède : fichiers,
  métadonnées, formats, et ce qu'il faut pour qu'une bibliothèque survive aux
  applications qui la lisent.
- Titre de recherche de l'index (`<title>`, jamais affiché) :
  `Journal Sonarche | bibliothèque musicale, tags et métadonnées`
- Bouton d'une ligne de l'index : `Lire l'article →`
- Ligne de date d'un article : `{date} · {n} min de lecture`, et
  `Mis à jour le {date}` en plus quand le texte a vraiment été révisé.
- Carte de fin d'article :
  - Titre : `Sonarche fait tout ça pour toi`
  - Corps : Une app de bureau qui identifie chaque morceau à l'oreille, le range
    dans des dossiers clairs que tu peux lire sans elle, et joue l'ensemble sur
    un moteur natif. Gratuite, open source, hors ligne.
  - Lien : `Découvrir Sonarche →`
- Pied du journal : `← Retour au site` · `From the stream into the Ark.` ·
  `GitHub ↗`

## Guide

Les pas-à-pas, à `/guide/`. Même mise en page de lecture que le journal, index
différent : groupé par thème et non par date. Le texte de chaque guide vit avec
lui (`components/guide/guides/<id>/fr.tsx`) ; ce qui suit est le cadre partagé.
Le lien du footer n'apparaît qu'une fois un guide publié — voir `draft` dans
lib/guide.ts.

- Lien dans le footer de la landing : `Guide`
- Fil d'Ariane en tête : `SONARCHE · Guide`
- Titre de l'index : `Utiliser Sonarche`
- Ligne sous le titre : Comment obtenir de chaque partie de l'app ce que tu en
  attends, un pas-à-pas à la fois. Écrit pour une version numérotée, et repris
  quand cette version bouge.
- Titre de recherche de l'index (`<title>`, jamais affiché) :
  `Guide Sonarche | installer, importer, taguer et écouter`
- Les quatre thèmes, dans cet ordre : `Démarrer` · `Ta bibliothèque` ·
  `Écouter` · `Réglages et entretien`
- Ligne au-dessus du titre d'un guide : `Vérifié sur Sonarche {version}` ·
  `{n} min de lecture`, et la pastille `Brouillon` tant qu'il n'est pas publié.
- Bouton d'une ligne de l'index : `Lire le guide →`
- Carte de fin d'un guide : `Tous les guides →` — jamais un bouton de
  téléchargement : la personne qui lit un guide a déjà l'app.
- Index vide : `Rien ici pour l'instant` / Les premiers pas-à-pas sont en cours
  d'écriture. En attendant, il y a de quoi lire dans le journal.

## Pages de lecture

Ce que le journal et le guide disent à l'identique. Leur cadre est le même
(`components/reading`) : même en-tête, même pied, même typographie.

- En-tête : `SONARCHE` · `Journal` `Guide` — les deux sections toujours
  visibles, la courante en ink. Le guide n'y entre qu'une fois publié.
- Titre du sommaire, dans la carte de gauche et sur mobile plié : `Sommaire`
- Pied : `← Retour au site` · `From the stream into the Ark.` · `GitHub ↗`
- Durée : `{n} min de lecture` · Révision : `Mis à jour le {date}`
