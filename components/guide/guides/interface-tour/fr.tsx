import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Visite de l'interface, en français. Son pendant anglais est dans ./en.tsx —
 * les deux disent la même chose et ne sont pas la traduction mot à mot l'un de
 * l'autre.
 *
 * Pas de captures, c'est décidé. Les libellés cités sont ceux de Sonarche
 * 2.0.0 et sont à revérifier à chaque montée de version avant de remonter
 * `appVersion`.
 *
 * Espaces autour des balises en ligne : voir le commentaire en tête de
 * components/blog/posts/wrong-tags/fr.tsx — les deux règles, et pourquoi.
 */

export function InterfaceTourFr() {
  return (
    <>
      <Lead>
        Sonarche tient dans une fenêtre qui ne change jamais de structure : la navigation à gauche, trois contrôles en
        haut, la page au centre, la lecture en bas. Ce guide fait le tour de ces quatre zones, explique le code couleur
        qui revient partout, et répond aux questions que l&apos;interface pose les premiers jours.
      </Lead>

      <H2>Quatre zones, une seule qui défile</H2>

      <ul>
        <li>
          <strong>La barre latérale</strong>, à gauche, en largeur fixe : la navigation.
        </li>
        <li>
          <strong>La top bar</strong>, au-dessus du contenu : trois contrôles, jamais du contenu de page. Sur macOS,
          c&apos;est aussi la bande qu&apos;on attrape pour déplacer la fenêtre, l&apos;app n&apos;ayant pas de barre de
          titre native.
        </li>
        <li>
          <strong>La page</strong>, la seule zone qui défile.
        </li>
        <li>
          <strong>La barre de lecture</strong>, en bas, pleine largeur, présente sur toutes les pages, Paramètres
          compris.
        </li>
      </ul>

      <p>
        Que la page soit seule à défiler a une conséquence utile : quand tu descends dans une étagère, sa barre de
        travail (les filtres et la recherche) se colle en haut du cadre, et les en-têtes de colonne comme le lecteur ne
        bougent jamais. La liste peut faire trois mille lignes, les contrôles restent sous la main.
      </p>

      <H2>La barre latérale</H2>

      <p>En haut, le logo et le nom. Dessous, trois sections.</p>

      <p>
        <strong>Explorer</strong>, c&apos;est comment la musique entre, et ce qui lui est arrivé :
      </p>

      <ul>
        <li>
          <strong>Téléchargements</strong>, la page d&apos;accueil au lancement : coller un lien.
        </li>
        <li>
          <strong>Importer</strong>&#32;: amener une musique déjà sur ton disque.
        </li>
        <li>
          <strong>Historique</strong>&#32;: tout ce qui est entré, du plus récent au plus ancien, téléchargements et
          imports confondus.
        </li>
        <li>
          <strong>Métadonnées</strong>&#32;: le poste de tri, ce qu&apos;il reste à compléter. L&apos;entrée porte une
          pastille ambrée avec le nombre de titres et d&apos;albums à compléter, plafonnée à « 99+ » et désactivable
          dans Paramètres → Métadonnées.
        </li>
      </ul>

      <p>
        <strong>Arche</strong>, c&apos;est la bibliothèque, rangée sur cinq étagères : Morceaux, Albums, Artistes,
        Genres et Catégories. On les détaille plus bas.
      </p>

      <p>
        <strong>Playlists</strong>, enfin : la page « Toutes les playlists » toujours en tête, « Favoris » (la liste de
        l&apos;app) toujours en deuxième, puis les huit playlists les plus récemment modifiées, chacune avec son icône
        ou son image. Au-delà de huit, elles vivent sur la page index : la barre latérale reste une navigation, pas un
        annuaire. Le + dans l&apos;en-tête de section crée une playlist et t&apos;emmène dedans.
      </p>

      <p>
        Un cas particulier : dans les Paramètres, toute la barre latérale bascule, et le menu de navigation laisse place
        aux catégories de réglages. C&apos;est le seul indice visuel que tu as changé de contexte.
      </p>

      <H2>La top bar</H2>

      <ul>
        <li>
          À gauche, la bascule <strong>Écoute / Inspection</strong>, qu&apos;on appelle la loupe. Elle a sa section
          juste en dessous.
        </li>
        <li>
          À droite, le <strong>?</strong>&#32;ouvre ce guide dans ton navigateur, dans la langue de l&apos;app.
        </li>
        <li>
          À côté, l&apos;<strong>engrenage</strong>&#32;entre dans les Paramètres. Une fois dedans, il devient une
          croix, et il te ramène exactement à la page d&apos;où tu venais.
        </li>
      </ul>

      <H2>La bascule Écoute / Inspection</H2>

      <p>
        La loupe n&apos;apparaît que sur les pages dont le corps est une liste de morceaux : Morceaux, la page d&apos;un
        album, une playlist, et les pages artiste, genre ou catégorie quand elles sont en vue « Morceaux ». Sur un mur
        de pochettes, elle n&apos;aurait rien à changer, donc elle disparaît. Si tu la cherches et qu&apos;elle
        n&apos;est pas là, c&apos;est que la page en cours n&apos;est pas une liste.
      </p>

      <p>
        En mode Inspection, le pilulier passe en ambre : la couleur du bouton est un échantillon de la pièce dans
        laquelle il fait entrer. Même liste, autre table :
      </p>

      <ul>
        <li>
          Les pochettes miniatures disparaissent et les lignes se resserrent : environ trois fois plus de morceaux à
          l&apos;écran.
        </li>
        <li>
          Les colonnes passent de #, Titre, Artiste, Album, Genre, Durée à N°, Titre, Artiste, Album,{" "}
          <strong>Année</strong>, Genre, <strong>Famille</strong>, <strong>Catégorie</strong>, Durée, plus une colonne
          d&apos;alertes.
        </li>
        <li>
          Les cellules vides que la page Métadonnées surveille encore s&apos;allument en ambre, avec une infobulle qui
          dit pourquoi.
        </li>
        <li>
          Un genre que l&apos;arbre ne connaît pas est souligné en pointillé ambre : la valeur est bonne, c&apos;est le
          classement qui n&apos;a pas de case. L&apos;infobulle le dit en toutes lettres : rien ne manque, mais ce titre
          tombe dans « Autres ».
        </li>
        <li>
          Deux pictogrammes ferment la ligne : un triangle pour une correspondance à vérifier, des feuilles pour un
          morceau en double.
        </li>
        <li>
          Au survol, un seul crayon : celui qui ouvre{" "}
          <a href={guidePath(guideById("edit-track"), "fr")}>le tiroir d&apos;édition du morceau</a>.
        </li>
      </ul>

      <p>
        La bascule est globale et persistante : elle survit à l&apos;ouverture d&apos;un album et au retour. Tu la
        refermes quand le tri est fini, pas à chaque page.
      </p>

      <H2>Le code couleur</H2>

      <p>Quatre couleurs reviennent partout, et chacune n&apos;a qu&apos;un sens :</p>

      <ul>
        <li>
          <strong>Ambre</strong>&#32;: un trou, quelque chose à compléter. Jamais une faute, jamais un score. C&apos;est
          la couleur des cellules vides en inspection, des pastilles de la page Métadonnées, des points de tracklist, du
          filtre « À corriger ».
        </li>
        <li>
          <strong>Indigo</strong>, l&apos;accent : la navigation, la sélection, et la modification en attente. Le liseré
          à gauche d&apos;un champ modifié et le badge « N modifications » sont indigo.
        </li>
        <li>
          <strong>Vert</strong>&#32;: complet, ou enregistré.
        </li>
        <li>
          <strong>Rouge</strong>&#32;: destructif. Supprimer, et rien d&apos;autre.
        </li>
      </ul>

      <p>
        Et une absence voulue : sur une étagère de pochettes, rien n&apos;est noté. Pas de badge « 62 % » sur les
        covers. Le jugement sur les métadonnées ne vit que là où tu vas les corriger : en inspection, dans les panneaux
        d&apos;édition, sur la page Métadonnées. Le reste du temps, la bibliothèque est une bibliothèque, pas un
        bulletin.
      </p>

      <H2>La barre de lecture</H2>

      <p>
        De gauche à droite : le morceau en cours, le transport, la barre de progression, puis le cœur, les paroles, la
        file d&apos;attente et le volume. Tout le bloc du morceau en cours est cliquable : la pochette et le titre
        mènent à la page de l&apos;album, le sous-titre à celle de l&apos;artiste. Pendant la lecture, un égaliseur
        animé se superpose à la pochette ; hors lecture, la barre dit « Aucune lecture ».
      </p>

      <p>
        Le transport aligne aléatoire, précédent, lecture, suivant et répétition. La répétition a trois états : éteinte,
        toute la file, un seul morceau (l&apos;icône porte alors un « 1 »). Aléatoire et répétition s&apos;allument en
        accent quand elles sont actives, et la barre de progression se clique pour se déplacer dans le morceau.
      </p>

      <Pull>Le contexte de lecture, c&apos;est ce que tu regardes.</Pull>

      <p>
        Lancer un morceau depuis une liste filtrée met cette liste filtrée en file d&apos;attente, pas toute la
        bibliothèque. Filtre une étagère sur une décennie, lance le premier titre : la file, c&apos;est ces morceaux-là.
        La file d&apos;attente affiche l&apos;ordre réellement joué, donc l&apos;ordre mélangé quand l&apos;aléatoire
        est actif : le morceau en cours épinglé sous « En lecture », la suite sous « À suivre », et un clic saute au
        morceau.
      </p>

      <p>
        Les paroles, elles, suivent le playhead ligne à ligne quand elles sont synchronisées. Si tu scrolles à la main,
        le panneau arrête de suivre pendant six secondes, puis reprend.
      </p>

      <H2>L&apos;anatomie d&apos;une page</H2>

      <p>Toutes les pages d&apos;exploration partagent le même squelette, de Morceaux à la page d&apos;une playlist.</p>

      <p>
        Le hero d&apos;abord : fil d&apos;Ariane, surtitre (Album, Collection, Artiste, Genre…), titre, ligne de méta
        (année, nombre de morceaux, durée, formats), chips de genre, puis les actions. Deux boutons ronds,{" "}
        <strong>Lecture</strong>&#32;et <strong>Aléatoire</strong>&#32;; un bouton <strong>Modifier</strong>&#32;; un
        menu <strong>⋯</strong>&#32;« Plus d&apos;actions ». La règle de forme est constante : rond, ça joue ;
        rectangle, ça gère.
      </p>

      <p>
        La barre de travail ensuite, collante en haut du cadre : jusqu&apos;à deux pilules de facette (Famille,
        Catégorie) qui n&apos;apparaissent que s&apos;il y a au moins deux valeurs à choisir, un bouton{" "}
        <strong>Filtres</strong>&#32;(décennie, « À corriger »…) teinté quand des filtres y sont actifs, les chips des
        filtres posés (indigo pour la navigation, ambre pour la correction ; un clic sur la chip la retire), un compteur
        « X sur Y » quand un filtre réduit la liste, et la recherche, calée à droite.
      </p>

      <p>
        Le corps enfin : une table, ou une grille de cartes. Le tri se fait en cliquant l&apos;en-tête de colonne, et le
        troisième clic revient à l&apos;ordre d&apos;origine. Double-clic sur une ligne : lecture.
      </p>

      <p>
        Sur les pages d&apos;un artiste, d&apos;un genre ou d&apos;une catégorie, un switch de vue passe de «
        Discographie » ou « Albums & artistes » à « Morceaux ». Ce mode-là est dans l&apos;URL, donc il survit à
        l&apos;aller-retour.
      </p>

      <H2>Les cinq étagères</H2>

      <ul>
        <li>
          <strong>Morceaux</strong>&#32;: toute la bibliothèque, virtualisée : une liste de plusieurs milliers de titres
          reste fluide. Deux badges à connaître : « illisible » quand Sonarche ne sait pas décoder le format, « Invité »
          quand le morceau est crédité sur l&apos;album de quelqu&apos;un d&apos;autre. Un genre absent s&apos;affiche
          en chip ambrée.
        </li>
        <li>
          <strong>Albums</strong>&#32;: le mur de pochettes. Au survol d&apos;une carte, un crayon ouvre{" "}
          <a href={guidePath(guideById("edit-album"), "fr")}>la modale de métadonnées de l&apos;album</a>&#32;et un
          bouton lance la lecture ; le reste de la carte mène à la page de l&apos;album.
        </li>
        <li>
          <strong>Artistes</strong>&#32;: une pastille ronde par artiste. L&apos;image est la tienne, celle que tu
          choisis, pas une pochette d&apos;album.
        </li>
        <li>
          <strong>Genres</strong>&#32;: des cartes par famille, une famille regroupant des genres proches, avec la part
          de bibliothèque, les sous-genres, et « Autres » pour ce que l&apos;arbre ne connaît pas. Depuis la page
          d&apos;un genre, « Classer dans… » range ce genre dans la famille de ton choix, et « Rangement d&apos;origine
          » revient en arrière.
        </li>
        <li>
          <strong>Catégories</strong>&#32;: le contexte, orthogonal au genre : Musique, Jeux vidéo, Films, Séries,
          Anime, Dessins animés, Comédies musicales. Vide au début : la catégorie s&apos;attribue depuis l&apos;édition
          d&apos;un morceau ou d&apos;un album.
        </li>
      </ul>

      <p>
        Les playlists, elles, sont tes listes : réordonnables au glisser-déposer, avec une image ou une icône de ton
        choix. « Favoris » est celle que l&apos;app tient pour toi, alimentée par le cœur.
      </p>

      <H2>Le côté Explorer, en bref</H2>

      <ul>
        <li>
          <strong>Téléchargements</strong>&#32;: un champ pour coller un lien. Quand il est reconnu, une question
          (récupérer l&apos;album entier, ou ce titre uniquement) et un panneau d&apos;Options : album de destination
          (automatique, existant ou nouveau) et catégorie. En dessous, le déroulé de ce qui est en cours : Récupération,
          Rangement, Identification, avec un verdict par ligne.
        </li>
        <li>
          <strong>Importer</strong>&#32;: choisir un dossier. Sonarche l&apos;analyse (nombre de pistes, poids, fichiers
          illisibles) et affiche ce qui va se passer avant de rien faire. L&apos;import copie, il ne déplace pas : tes
          fichiers d&apos;origine ne bougent pas, et les tags existants sont conservés tels quels, sans recherche en
          ligne. À la fin, la page propose l&apos;alignement : une identification MusicBrainz album par album, à partir
          des tags, qui comble année, genre et pochette manquants.
        </li>
        <li>
          <strong>Historique</strong>&#32;: la trace de tout ce qui est entré.
        </li>
        <li>
          <strong>Métadonnées</strong>&#32;: le poste de tri. Un compte de ce qu&apos;il reste à compléter, puis une
          file de lignes de correction : Correspondance à vérifier, Morceaux en double, Année manquante… Chaque ligne
          ouvre l&apos;étagère filtrée sur exactement ces titres, la loupe déjà allumée. Chaque ligne offre aussi «
          C&apos;est voulu » : la constatation est acceptée et sort du compte partout, de façon annulable. Cette page
          mérite son propre guide ; retiens juste qu&apos;elle est le point d&apos;entrée naturel du nettoyage.
        </li>
      </ul>

      <p>
        Les Paramètres, pour finir, tiennent en sept catégories : Apparence (thème clair, nuit ou système, langue, mot
        de bienvenue, revoir la visite guidée), Ajouts, Métadonnées, Clefs API, Limitations appels API, Bibliothèque et
        Mises à jour.
      </p>

      <H2>Raccourcis et gestes</H2>

      <ul>
        <li>Double-clic sur une ligne : lecture.</li>
        <li>
          <strong>⌘S / Ctrl+S</strong>&#32;dans un panneau d&apos;édition : enregistrer sans fermer.
        </li>
        <li>
          <strong>Échap</strong>&#32;: fermer le panneau, avec une garde si des modifications sont en attente.
        </li>
        <li>
          <strong>⌘V / Ctrl+V</strong>&#32;dans une modale d&apos;image : coller une image, ou une adresse d&apos;image.
        </li>
        <li>Glisser-déposer un fichier image dans une modale d&apos;image.</li>
        <li>Glisser une ligne de playlist pour la réordonner.</li>
        <li>↑ et ↓ puis Entrée dans un champ à suggestions.</li>
      </ul>

      <H2>Les questions qui reviennent</H2>

      <ul>
        <li>
          <strong>« Pourquoi il n&apos;y a pas de page pour un morceau ? »</strong>&#32;Il n&apos;y en a pas : un
          morceau s&apos;ouvre dans un tiroir, et tous les chemins convergent vers l&apos;album.
        </li>
        <li>
          <strong>« La bascule Écoute / Inspection a disparu. »</strong>&#32;Normal : la page en cours n&apos;est pas
          une liste de morceaux.
        </li>
        <li>
          <strong>« Ma pochette est la miniature d&apos;une vidéo. »</strong>&#32;C&apos;est une pochette provisoire, et{" "}
          <a href={guidePath(guideById("edit-album"), "fr")}>le guide de l&apos;album</a>&#32;explique comment la
          remplacer.
        </li>
        <li>
          <strong>« Un morceau est marqué illisible. »</strong>&#32;Le fichier est bien dans l&apos;arche, avec ses tags
          et sa place dans l&apos;album ; Sonarche ne sait juste pas décoder ce format-là. C&apos;est délibéré : rien
          n&apos;est refusé à l&apos;import.
        </li>
      </ul>
    </>
  );
}
