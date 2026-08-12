import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Modifier les métadonnées d'un morceau, en français. Son pendant anglais est
 * dans ./en.tsx — les deux disent la même chose et ne sont pas la traduction
 * mot à mot l'un de l'autre.
 *
 * Pas de captures, c'est décidé. Les libellés cités sont ceux de Sonarche
 * 2.0.0 et sont à revérifier à chaque montée de version avant de remonter
 * `appVersion`.
 *
 * Espaces autour des balises en ligne : voir le commentaire en tête de
 * components/blog/posts/wrong-tags/fr.tsx — les deux règles, et pourquoi.
 */

export function EditTrackFr() {
  return (
    <>
      <Lead>
        Un morceau s&apos;édite dans un tiroir, le tiroir Piste, et ce que tu y enregistres est écrit dans le fichier
        lui-même : Sonarche n&apos;a pas de base de données à part, la bibliothèque et les tags sont la même chose.
        C&apos;est ce qui explique la prudence du panneau, et ce guide le prend de haut en bas.
      </Lead>

      <H2>Ouvrir le tiroir</H2>

      <p>Cinq chemins mènent au même endroit :</p>

      <ul>
        <li>
          Sur l&apos;étagère <strong>Morceaux</strong>, survole la ligne et clique le crayon, « Modifier les métadonnées
          ». Les actions de ligne sont visibles en permanence, en léger retrait, et passent à pleine opacité au survol :
          pas besoin de balayer la ligne pour les découvrir.
        </li>
        <li>Sur la page d&apos;un album, le même crayon, sur la ligne du morceau.</li>
        <li>Sur la page d&apos;une playlist, idem.</li>
        <li>En mode Inspection, un crayon plus discret, en toute fin de ligne.</li>
        <li>Sur la page Téléchargements, depuis la fiche d&apos;un téléchargement terminé.</li>
      </ul>

      <p>Le tiroir s&apos;ouvre à droite, et le reste de la page reste visible derrière.</p>

      <H2>Ce que le tiroir affiche</H2>

      <p>
        L&apos;en-tête d&apos;abord : la pochette de l&apos;album, le surtitre « Piste », le titre, puis « Artiste —
        Album ». La pochette est cliquable si le morceau appartient à un album, et ouvre alors{" "}
        <a href={guidePath(guideById("edit-album"), "fr")}>« Remplacer la pochette »</a>&#32;; sur un singleton, elle ne
        l&apos;est pas. Sur son coin, le disque de l&apos;artiste ouvre « Remplacer l&apos;image de l&apos;artiste ».
        C&apos;est aussi dans l&apos;en-tête que le badge « N modifications » apparaît dès la première frappe : il vit
        là, et pas près des boutons, pour que rien ne bouge sous ton curseur pendant que tu tapes.
      </p>

      <p>
        Vient ensuite le bandeau de complétion : « X champs sur 7 », la liste nommée de ce qui manque (« il manque
        Année, Genre »), et un lien « Voir l&apos;album › » qui ferme le tiroir et ouvre la page de l&apos;album. Le
        point est vert quand tout y est, ambre sinon. Les sept champs comptés sont Titre, Artiste, Artiste de
        l&apos;album, Album, Année, N° piste et Genre. La Catégorie et la Famille de genre ne comptent pas, et
        l&apos;interface l&apos;écrit à côté d&apos;elles : « ne compte pas dans la complétion », « calculée, ne compte
        pas ».
      </p>

      <p>Les champs, dans l&apos;ordre :</p>

      <ul>
        <li>
          <strong>N° piste</strong>&#32;et <strong>Titre</strong>, sur une ligne.
        </li>
        <li>
          <strong>Artiste</strong>, avec autocomplétion et une aide « L&apos;un range, l&apos;autre décrit ». Juste
          dessous, en petit et non modifiable : « album rangé sous X ». On y revient, c&apos;est le point le plus mal
          compris du panneau.
        </li>
        <li>
          <strong>Album</strong>, avec autocomplétion : les suggestions portent leur pochette. Si le morceau est une
          piste bonus adoptée, un encart le dit : « Piste bonus issue de “…”, rangée avec l&apos;album principal. »
        </li>
        <li>
          <strong>Année</strong>&#32;et <strong>Genre</strong>, sur une ligne, le Genre avec autocomplétion et aide.
        </li>
        <li>
          <strong>Famille de genre</strong>&#32;: un champ gris, plat, non éditable. C&apos;est un calcul dérivé du
          genre, pas une saisie.
        </li>
        <li>
          <strong>Catégorie</strong>&#32;: pas un champ texte, une rangée de chips : Musique, Jeux vidéo, Films, Séries,
          Anime, Dessins animés, Comédies musicales. Un clic sélectionne, un second clic sur la chip active
          désélectionne. Si MusicBrainz a typé la sortie comme bande originale et qu&apos;aucune catégorie n&apos;est
          posée, une ligne le souffle : « MusicBrainz indique une bande originale — choisis une catégorie. »
        </li>
      </ul>

      <p>
        Au pied du panneau : « Re-matcher » à gauche, « Annuler » (qui n&apos;apparaît que s&apos;il y a des
        modifications) et « Enregistrer » à droite. Au-dessus des boutons, une ligne de retour apparaît après une action
        : verte pour un enregistrement réussi, rouge pour un échec, grise pour « Aucune correspondance trouvée. »
      </p>

      <H2>Artiste et Artiste de l&apos;album</H2>

      <Pull>L&apos;un range, l&apos;autre décrit.</Pull>

      <p>
        C&apos;est le titre de l&apos;aide du champ Artiste, et c&apos;est la notion à retenir de tout ce guide. L&apos;
        <strong>Artiste de l&apos;album</strong>&#32;est le nom sous lequel l&apos;album est rangé : il regroupe les
        morceaux en un album et le fait apparaître dans la fiche de l&apos;artiste. On y met l&apos;artiste principal,
        même si certains morceaux ont des invités. L&apos;<strong>Artiste</strong>, lui, dit qui joue ce morceau-là,
        invités compris : c&apos;est ce que la lecture affiche et ce que la recherche interroge. L&apos;album reste
        rangé sous « X » même si un titre est joué par « X feat. … ».
      </p>

      <p>
        Et c&apos;est pour ça que « album rangé sous X » n&apos;est pas modifiable depuis le tiroir d&apos;un morceau.
        Ce n&apos;est pas un oubli : un album est regroupé par le couple artiste de l&apos;album et titre d&apos;album.
        Écrire ce champ depuis un seul morceau sortirait ce morceau dans un album à lui tout seul, et couperait le
        disque en deux sans rien dire. Pour renommer l&apos;artiste d&apos;un album, passe par{" "}
        <a href={guidePath(guideById("edit-album"), "fr")}>la modale de l&apos;album</a>, où le champ s&apos;applique à
        toutes les pistes d&apos;un coup.
      </p>

      <H2>L&apos;autocomplétion</H2>

      <p>
        Artiste, Album et Genre suggèrent pendant que tu tapes, et le vocabulaire, c&apos;est ta bibliothèque : tout
        artiste, titre d&apos;album et genre déjà stockés. Rien n&apos;est demandé au réseau. La liste montre au plus
        huit entrées, chacune avec un détail (l&apos;artiste pour un album, la famille pour un genre) et le nombre de
        morceaux qui la portent ; les albums affichent leur pochette. Si ce que tu tapes ne correspond à aucune entrée
        existante, une dernière ligne le dit explicitement : « Nouvelle valeur ». La liste répond donc toujours à la
        question qui compte : qu&apos;est-ce que ça va écrire ?
      </p>

      <p>
        Au clavier : ↓ et ↑ pour parcourir, Entrée pour choisir, Échap pour fermer la liste. Rien n&apos;est surligné
        par défaut, donc Entrée ne remplacera jamais silencieusement ce que tu viens de taper. Et c&apos;est cette liste
        qui empêche « AC/DC » et « ACDC » de devenir deux artistes : choisis une entrée existante plutôt que de retaper
        le nom.
      </p>

      <H2>Pendant l&apos;édition</H2>

      <p>
        Un champ modifié prend un liseré indigo à gauche, et son étiquette gagne une pastille « ↺ » suivie de
        l&apos;ancienne valeur : un clic la rétablit. C&apos;est la seule marque de modification. Un champ compté et
        vide est ambré, en bordure pointillée, avec un placeholder. Le compteur « N modifications » vit dans
        l&apos;en-tête.
      </p>

      <p>
        Ce qui compte comme une modification est calculé exactement comme l&apos;enregistrement : les espaces de bord
        sont ignorés, une année non numérique est ignorée, un champ entièrement vidé vaut « absent ». Le compteur ne
        peut donc jamais annoncer un changement que l&apos;enregistrement n&apos;écrirait pas.
      </p>

      <H2>Enregistrer</H2>

      <p>
        Le bouton « Enregistrer », ou <strong>⌘S / Ctrl+S</strong>&#32;pour enregistrer sans fermer. Seuls les champs
        modifiés partent : le reste n&apos;est pas réécrit. Côté disque, voilà ce qui se passe :
      </p>

      <ul>
        <li>Les tags sont écrits dans le fichier.</li>
        <li>
          Si tu as changé l&apos;Album, le fichier est déplacé dans l&apos;arborescence (Artiste de l&apos;album / Album
          / N° Titre) : la base et le disque ne doivent jamais se contredire. La pochette archivée en haute définition
          suit le déplacement.
        </li>
        <li>
          Le drapeau « Correspondance à vérifier » est levé si tu as corrigé Titre, Artiste, Artiste de l&apos;album ou
          Album : tu as tranché, la question est répondue.
        </li>
        <li>
          L&apos;app note que ce champ a été édité à la main, ce qui lui servira à ne pas l&apos;écraser plus tard.
        </li>
      </ul>

      <p>
        Une astuce que l&apos;interface n&apos;écrit nulle part : le genre accepte plusieurs valeurs séparées par un
        point-virgule, « Rock; Metal ».
      </p>

      <p>
        En cas d&apos;échec, le message est une garantie : « Aucun fichier n&apos;a été touché — tes modifications sont
        conservées. » Rien n&apos;est à moitié écrit, tu peux réessayer.
      </p>

      <H2>Fermer avec des modifications en attente</H2>

      <p>
        Les trois gestes de fermeture (la croix, un clic sur le fond, Échap) déclenchent la même garde : « Abandonner
        tes modifications ? », avec le compte de ce qui serait perdu. Trois issues : « Continuer l&apos;édition », «
        Abandonner » en rouge, et « Enregistrer » en bouton principal, parce que c&apos;est presque toujours la vraie
        réponse.
      </p>

      <H2>Re-matcher</H2>

      <p>
        « Re-matcher » relance l&apos;identification : Sonarche ré-interroge MusicBrainz à partir de l&apos;empreinte
        acoustique du fichier, l&apos;audio lui-même et pas son nom, puis réécrit tous les tags reconnus. Le bon moment,
        c&apos;est avant tes corrections manuelles, jamais après : un re-match qui passe derrière toi réécrit aussi ce
        que tu viens de corriger, et l&apos;aide de l&apos;app le dit mot pour mot.
      </p>

      <p>
        Par défaut, une confirmation s&apos;affiche (« Relancer l&apos;identification ? »), avec un interrupteur « Ne
        plus me demander », le même réglage que Paramètres → Métadonnées → « Confirmation avant un re-match ». Le bouton
        est éteint dans deux cas, et l&apos;infobulle dit lequel : des modifications sont en attente (le re-match les
        réécrirait), ou le morceau est rangé dans une collection (le ré-identifier le renverrait vers son album
        d&apos;origine).
      </p>

      <p>
        Le résultat tombe dans la ligne de retour : « Métadonnées mises à jour. » ou « Aucune correspondance trouvée. »,
        et le tiroir se met à jour tout seul avec les nouvelles valeurs. Un prérequis : une clef AcoustID configurée
        dans Paramètres → Clefs API, gratuite sur acoustid.org.{" "}
        <a href={guidePath(guideById("getting-started"), "fr")}>Le guide de mise en route</a>&#32;explique pourquoi elle
        vaut la minute qu&apos;elle coûte.
      </p>

      <H2>Les actions voisines, dans le menu ⋯</H2>

      <ul>
        <li>
          <strong>Ajouter à une playlist.</strong>
        </li>
        <li>
          <strong>Déplacer vers un album</strong>&#32;: refile le morceau ailleurs. Le fichier suit sur le disque, mais
          l&apos;artiste du morceau, son genre et son année ne changent pas. Tu peux viser un album existant ou créer
          une collection, et un toast propose « Annuler » juste après.
        </li>
        <li>
          <strong>Supprimer le morceau</strong>&#32;: retire de la bibliothèque et supprime le fichier du disque.
          Irréversible, et le dialogue est rouge pour cette raison.
        </li>
      </ul>

      <H2>Si quelque chose coince</H2>

      <ul>
        <li>
          <strong>« J&apos;ai tapé une année, rien ne s&apos;enregistre. »</strong>&#32;La valeur n&apos;est pas un
          nombre : saisis quatre chiffres, tout le reste est ignoré par sécurité.
        </li>
        <li>
          <strong>« Je vide l&apos;année ou le numéro de piste, ça revient à zéro. »</strong>&#32;Un champ entièrement
          vidé vaut « absent », que beets stocke comme 0. Comportement normal.
        </li>
        <li>
          <strong>« Mon album s&apos;est coupé en deux. »</strong>&#32;L&apos;artiste de l&apos;album diffère d&apos;une
          piste à l&apos;autre. Ouvre <a href={guidePath(guideById("edit-album"), "fr")}>la modale de l&apos;album</a>
          &#32;et harmonise « Artiste de l&apos;album ».
        </li>
        <li>
          <strong>« J&apos;ai deux fois le même artiste, AC/DC et ACDC. »</strong>&#32;Deux orthographes. Passe par la
          liste de suggestions plutôt que de retaper, et corrige l&apos;orthographe fautive sur toutes les pistes
          concernées.
        </li>
        <li>
          <strong>« Mon genre tombe dans Autres. »</strong>&#32;Le genre est valide mais l&apos;arbre ne le connaît pas.
          Écris un genre connu, ou va sur la page Genres et « Classer dans… » pour lui donner une famille.
        </li>
        <li>
          <strong>« La famille ne se modifie pas. »</strong>&#32;Elle est calculée à partir du genre : c&apos;est le
          genre qu&apos;on édite, jamais la famille.
        </li>
        <li>
          <strong>« Mes corrections ont disparu. »</strong>&#32;Un re-match est passé après. Refais la correction, et
          re-matche avant tes retouches la prochaine fois.
        </li>
        <li>
          <strong>« Le bouton Re-matcher est gris. »</strong>&#32;Des modifications sont en attente, ou le morceau est
          dans une collection. L&apos;infobulle dit lequel des deux.
        </li>
        <li>
          <strong>« Rien n&apos;a été enregistré. »</strong>&#32;L&apos;écriture du tag a échoué, fichier verrouillé ou
          en lecture seule par exemple. Le message garantit qu&apos;aucun fichier n&apos;a été touché : réessaie.
        </li>
        <li>
          <strong>« Le morceau porte le badge illisible. »</strong>&#32;Ses tags restent modifiables ; seule la lecture
          est impossible.
        </li>
      </ul>
    </>
  );
}
