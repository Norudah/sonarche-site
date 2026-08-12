import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Modifier un album entier, en français. Son pendant anglais est dans ./en.tsx
 * — les deux disent la même chose et ne sont pas la traduction mot à mot l'un
 * de l'autre.
 *
 * Pas de captures, c'est décidé. Les libellés cités sont ceux de Sonarche
 * 2.0.0 et sont à revérifier à chaque montée de version avant de remonter
 * `appVersion`.
 *
 * Espaces autour des balises en ligne : voir le commentaire en tête de
 * components/blog/posts/wrong-tags/fr.tsx — les deux règles, et pourquoi.
 */

export function EditAlbumFr() {
  return (
    <>
      <Lead>
        Corriger un disque piste par piste dans le tiroir, c&apos;est long, et c&apos;est le mauvais outil : la plupart
        des corrections valent pour tout l&apos;album. La modale « Album · métadonnées » est faite pour ça. Elle se lit
        de gauche à droite, le disque puis ses pistes, et tout part dans un seul « Enregistrer ».
      </Lead>

      <H2>Ouvrir la modale</H2>

      <p>
        Deux chemins : le bouton « Modifier » sur la page de l&apos;album, à droite des boutons de lecture, ou le crayon
        qui apparaît au survol d&apos;une pochette, sur l&apos;étagère Albums comme dans la discographie d&apos;un
        artiste, un genre ou une catégorie. C&apos;est une modale quasi plein écran, pas un tiroir : il faut la place
        pour la fiche du disque et toute la tracklist.
      </p>

      <p>
        L&apos;en-tête reprend les codes du{" "}
        <a href={guidePath(guideById("edit-track"), "fr")}>tiroir d&apos;un morceau</a>&#32;: pochette cliquable (vers «
        Remplacer la pochette »), disque de l&apos;artiste (vers « Remplacer l&apos;image de l&apos;artiste »), surtitre
        « Album · métadonnées », titre, et le badge de modifications.
      </p>

      <H2>Un badge à deux nombres</H2>

      <p>
        Le badge dit par exemple « 3 modifications sur 2 morceaux », et les deux nombres ne mesurent pas la même chose :
        trois tags touchés, deux fichiers qui seront réécrits. Changer le genre d&apos;un album de vingt-neuf pistes
        compte pour une modification, pas vingt-neuf. Le badge répond à « qu&apos;est-ce que j&apos;ai changé ? » et à «
        qu&apos;est-ce qui va être écrit ? » d&apos;un même souffle.
      </p>

      <H2>L&apos;anneau de complétion</H2>

      <p>
        En haut de la colonne de gauche, un anneau affiche le rapport brut, « 24/29 », vert s&apos;il est plein, ambre
        sinon, avec la phrase en clair : « 24 des 29 morceaux sont complets ». Pas de pourcentage.
      </p>

      <Pull>Un rapport se vérifie, une note se subit.</Pull>

      <p>En dessous, tout est cliquable :</p>

      <ul>
        <li>« Ne montrer que les N morceaux incomplets » filtre la tracklist.</li>
        <li>
          Une chip par champ troué, « Année · 5 à remplir », « Genre · 12 à remplir », les plus troués d&apos;abord. Un
          clic filtre la tracklist sur exactement ces pistes, un second clic retire le filtre.
        </li>
        <li>Une ligne « Au complet : Titre, Artiste, Album. » : ce que tu n&apos;as plus à vérifier.</li>
      </ul>

      <p>
        Quand un filtre est actif, un bandeau ambre au-dessus de la tracklist le rappelle, « Filtre : … · 5 sur 29 »,
        avec « Retirer le filtre ».
      </p>

      <H2>Album ou Collection</H2>

      <p>
        Sous l&apos;anneau, un interrupteur à deux segments, « Nature de la fiche », choisit ce que Sonarche doit
        attendre de ce disque. <strong>Album</strong>&#32;: un disque paru, avec sa tracklist ; Sonarche signale les
        pistes qui manquent et propose de l&apos;identifier sur MusicBrainz. <strong>Collection</strong>&#32;: ta propre
        sélection de morceaux ; aucune tracklist à respecter, plus de pistes manquantes signalées, et l&apos;alignement
        la laisse tranquille.
      </p>

      <p>
        Trois choses à savoir sur cet interrupteur, parce qu&apos;il ne ressemble à rien d&apos;autre dans la modale :
      </p>

      <ul>
        <li>
          C&apos;est le seul contrôle qui s&apos;applique immédiatement, sans passer par « Enregistrer » : ce n&apos;est
          pas un tag écrit dans les fichiers, c&apos;est la façon dont Sonarche doit lire la fiche.
        </li>
        <li>
          Il n&apos;apparaît pas si le groupe de pistes n&apos;a pas de vraie fiche album derrière : un tas de
          singletons n&apos;est la « nature » de rien.
        </li>
        <li>Passer en Collection éteint le re-match, de la fiche comme de ses morceaux.</li>
      </ul>

      <H2>Les champs communs</H2>

      <p>
        La section « Ce qui vaut pour tout l&apos;album » annonce sa portée dans son propre en-tête : « écrit sur N
        morceaux ». On y trouve Album, Artiste de l&apos;album (avec la même aide « L&apos;un range, l&apos;autre décrit
        » que dans le tiroir, illustrée ici avec ton propre artiste), Année, Genre, puis la Famille de genre, calculée
        et grise, et la Catégorie, en chips.
      </p>

      <p>
        Le point technique qui compte : les valeurs mixtes. Si les pistes ne s&apos;accordent pas sur un champ, le champ
        s&apos;affiche en bordure pointillée avec un placeholder du type « 4 valeurs », et une phrase sous Année et
        Genre explique la règle : laisse vide pour n&apos;y toucher à rien, ou écris une valeur pour l&apos;imposer aux
        N morceaux. Autrement dit, inspecter un album à moitié taggué ne peut jamais l&apos;aplatir : un champ mixte
        laissé vide n&apos;écrit rien.
      </p>

      <p>
        Genre et Année ont un statut particulier : ils existent aussi en colonne dans la tracklist. Le champ commun est
        une lecture des lignes. Si tu y écris, ça s&apos;écrit sur toutes les lignes ; si tu modifies une ligne, le
        champ commun se met à jour, et repasse en « mixte » si les lignes divergent. Les deux ne peuvent jamais se
        contredire. Et comme dans le tiroir, chaque champ commun modifié porte sa pastille « ↺ » avec l&apos;ancienne
        valeur.
      </p>

      <H2>La tracklist</H2>

      <p>
        La colonne de droite ouvre sur « 29 morceaux », puis une ligne qui résume la paire artiste / artiste de
        l&apos;album : « Rangé sous X — la colonne Artiste dit qui joue chaque titre. » Les colonnes : N°, Titre,
        Artiste, Année, Genre, et un point d&apos;état en fin de ligne, vert pour un morceau complet, ambre sinon.
      </p>

      <ul>
        <li>
          Chaque cellule est éditable : au repos c&apos;est un bouton, au clic ou au clavier elle devient un vrai champ.
          La raison est technique et assumée : une tracklist de quatre-vingts titres ne peut pas monter trois cents
          champs de saisie vivants.
        </li>
        <li>Une cellule vide dit ce qui manque, en ambre : « à renseigner », « à saisir ». Jamais un blanc muet.</li>
        <li>
          Artiste et Genre ont l&apos;autocomplétion, avec les mêmes règles que dans{" "}
          <a href={guidePath(guideById("edit-track"), "fr")}>le tiroir</a>&#32;: ta bibliothèque comme vocabulaire, huit
          entrées au plus, la ligne « Nouvelle valeur » quand tu inventes.
        </li>
        <li>Une cellule modifiée prend le liseré indigo, et sa ligne est légèrement teintée.</li>
        <li>
          Ce qui n&apos;est pas éditable ici : l&apos;album, l&apos;artiste de l&apos;album, la catégorie. Ils sont
          communs, donc à gauche.
        </li>
      </ul>

      <H2>Les propositions à trancher</H2>

      <p>
        C&apos;est la mécanique propre à la modale, et la plus utile. Quand tu modifies un genre ou un artiste sur une
        ligne, l&apos;app remarque que d&apos;autres lignes portaient la même ancienne valeur, et propose, sans rien
        écrire, d&apos;étendre la correction. La carte apparaît contre la ligne concernée et reste affichée tant que tu
        n&apos;as pas tranché ; cliquer ailleurs ne la fait pas disparaître. Elle prend trois formes :
      </p>

      <ul>
        <li>
          <strong>Le genre.</strong>&#32;Surtitre « Genre · titre de la piste », la transition d&apos;ancienne à
          nouvelle valeur, puis « 12 autres morceaux portent encore “Pop”. » Trois réponses : « Appliquer aux 12
          morceaux en “Pop” » en bouton principal, « Aux 29 morceaux » quand ça va plus loin que les porteurs de
          l&apos;ancienne valeur, « Ce morceau seul ».
        </li>
        <li>
          <strong>L&apos;artiste.</strong>&#32;« Tu as changé “X” en “Y”. Quels autres morceaux suivent ? », puis une
          liste à cocher des pistes candidates, chacune avec l&apos;artiste qu&apos;elle porte aujourd&apos;hui : la
          raison de la laisser tranquille. Tout est coché par défaut, le cas type étant une faute d&apos;orthographe.
          Boutons : « Appliquer à N morceaux », « Ne rien changer ».
        </li>
        <li>
          <strong>Remplir l&apos;artiste de l&apos;album.</strong>&#32;Même liste à cocher, mais seules les lignes vides
          sont cochées : recopier l&apos;artiste de l&apos;album par-dessus un vrai featuring est exactement ce que
          cette action ne doit jamais faire.
        </li>
      </ul>

      <p>
        Pour naviguer : une ligne qui attend ta réponse porte un point indigo dans la gouttière de gauche, un clic
        rouvre sa carte, et une pastille « N propositions à trancher », en haut à droite de la tracklist, ramène à la
        première, utile si la ligne concernée est plus bas ou filtrée. Échap ferme d&apos;abord la proposition ouverte,
        et seulement ensuite la modale. Enfin, répondre à une proposition n&apos;écrit rien sur le disque : ça alimente
        le même brouillon que le reste, et tout part au même « Enregistrer ». Retaper une autre valeur repropose : la
        proposition est identifiée par le mouvement d&apos;une valeur vers une autre, pas par la ligne.
      </p>

      <H2>Renuméroter, et copier l&apos;artiste de l&apos;album</H2>

      <p>Deux pastilles rondes en haut à droite de la tracklist, icône seule, libellé au survol :</p>

      <ul>
        <li>
          <strong>Renuméroter</strong>&#32;réécrit les numéros de piste de 1 à N, dans l&apos;ordre affiché.
          S&apos;applique au brouillon : ça se voit dans la colonne N°, et ça part avec l&apos;enregistrement.
        </li>
        <li>
          <strong>Copier l&apos;artiste de l&apos;album</strong>&#32;propose d&apos;écrire l&apos;artiste de
          l&apos;album sur les morceaux : tu choisis lesquels, et les featurings ne sont pas cochés. Ce bouton
          n&apos;écrit jamais directement, il ouvre la liste à cocher décrite plus haut. Il est désactivé si toutes les
          pistes portent déjà l&apos;artiste de l&apos;album, ou s&apos;il n&apos;y en a pas.
        </li>
      </ul>

      <H2>Remplacer la pochette</H2>

      <p>
        La modale de pochette s&apos;ouvre depuis la pochette de l&apos;en-tête, depuis la notice ambre de pochette
        provisoire, ou depuis le tiroir d&apos;un morceau de l&apos;album. Elle est construite en avant / après : à
        gauche « Actuelle », la pochette d&apos;aujourd&apos;hui, son poids, et « Incrustée dans N morceaux » ; à droite
        « Nouvelle », avec toutes les sources : parcourir un fichier (JPEG, PNG ou WebP), glisser-déposer, coller (⌘V /
        Ctrl+V) une image ou une adresse d&apos;image, un lien saisi dans un champ dépliable, et les propositions en
        ligne de la Cover Art Archive, d&apos;après l&apos;identification MusicBrainz de l&apos;album. Rien n&apos;est
        demandé au réseau tant que tu ne cliques pas « Chercher des propositions ».
      </p>

      <p>
        Une pochette est carrée, donc un recadrage suit : tu déplaces le cadre et tu zoomes. Si le cadre déborde de
        l&apos;image, un avertissement bloque la validation : la pochette ne serait pas carrée, rezoome jusqu&apos;à ce
        qu&apos;il tienne dedans.
      </p>

      <p>Ce que le remplacement écrit, l&apos;aide de la modale le détaille :</p>

      <ul>
        <li>
          L&apos;image est incrustée dans chaque fichier de l&apos;album, plafonnée à 500×500 px : c&apos;est ainsi que
          les autres lecteurs l&apos;affichent, et c&apos;est ce qui évite d&apos;ajouter plusieurs Mo par morceau.
        </li>
        <li>
          Ton image complète n&apos;est pas perdue : elle est archivée une fois à côté de l&apos;album, dans « cover-hq
          ».
        </li>
        <li>
          Le poids résultant est estimé avant d&apos;écrire quoi que ce soit, et une image de moins de 500 px est
          signalée : utilisée telle quelle, mais elle pourra paraître floue.
        </li>
      </ul>

      <p>
        La notice de pochette provisoire, au passage : quand la pochette est la miniature d&apos;une vidéo et pas une
        vraie jaquette, un encart ambre le dit et propose directement « Remplacer la pochette ». C&apos;est le cas
        typique d&apos;un album forcé sans parution MusicBrainz derrière ; commence par les propositions en ligne.
      </p>

      <H2>Enregistrer</H2>

      <p>
        « Enregistrer », ou <strong>⌘S / Ctrl+S</strong>. Un seul lot pour tout : champs communs, lignes, propositions
        appliquées. Une piste que rien ne touche n&apos;est pas réécrite. Le retour est le même que dans le tiroir : «
        29 morceaux mis à jour. » en vert, ou l&apos;échec avec « Aucun fichier n&apos;a été touché — tes modifications
        sont conservées. » et un bouton « Réessayer ». La garde de sortie est la même aussi : Continuer l&apos;édition,
        Abandonner, Enregistrer.
      </p>

      <p>
        Un effet de bord à connaître : renommer l&apos;album ou son artiste déplace les dossiers sur le disque, et si tu
        renommes l&apos;artiste de l&apos;album, son image suit le renommage. La page de l&apos;album suit toute seule
        le nouveau nom : elle ne se ferme pas, et ne dit pas « album introuvable ». Le bouton Retour, en revanche, ne
        reviendra pas sur l&apos;ancien nom.
      </p>

      <H2>Re-matcher un album</H2>

      <p>
        Même principe que pour un morceau, mais piste par piste, séquentiellement. Pendant l&apos;opération, une barre
        de progression et son compte, « 12 / 29 morceaux · 9 identifiés », avec un bouton « Stopper ». L&apos;arrêt est
        honnête : le morceau en cours se termine, les suivants ne sont pas lancés, et le bilan le dit, « Re-match
        interrompu — 12/29 morceaux traités, 9 identifiés. »
      </p>

      <p>
        Le bouton est éteint si des modifications sont en attente, ou si la fiche est une Collection, et le pied de
        modale écrit alors la raison en toutes lettres. La confirmation par défaut prévient de ce qui sera réécrit, tous
        les tags reconnus, y compris ceux corrigés à la main, avec le même « Ne plus me demander » que dans le tiroir.
        Le résultat tient en une ligne : « 27/29 pistes identifiées ».
      </p>

      <H2>Les autres actions, dans le menu ⋯ du hero</H2>

      <ul>
        <li>
          <strong>Ajouter à une playlist</strong>, tout l&apos;album.
        </li>
        <li>
          <strong>Ajouter des morceaux</strong>&#32;: la moitié « tirer » du rangement. Depuis ton album, va chercher
          des titres ailleurs dans la bibliothèque ; les morceaux choisis quittent leur album pour celui-ci.
        </li>
        <li>
          <strong>Déplacer vers un album</strong>&#32;: la moitié « pousser ». Tout l&apos;album rejoint un autre :
          c&apos;est comme ça que deux albums deviennent un, et qu&apos;une collection absorbe une sortie.
        </li>
        <li>
          <strong>Supprimer l&apos;album</strong>&#32;: retire les morceaux et les fichiers. Irréversible, et bloqué si
          un téléchargement est en route vers cet album : attends la fin du téléchargement, ou arrête-le depuis
          Téléchargements, pour pouvoir le supprimer.
        </li>
      </ul>

      <H2>Si quelque chose coince</H2>

      <ul>
        <li>
          <strong>« Le champ Genre est vide alors que mes pistes ont un genre. »</strong>&#32;Les pistes ne
          s&apos;accordent pas : le champ est mixte, son placeholder dit « N valeurs ». Le laisser vide ne touche à rien
          ; écrire une valeur l&apos;impose à tout l&apos;album.
        </li>
        <li>
          <strong>« J&apos;ai peur d&apos;écraser des genres différents. »</strong>&#32;Un champ mixte laissé vide
          n&apos;écrit rien. C&apos;est la règle, tu peux inspecter sans risque.
        </li>
        <li>
          <strong>« L&apos;album est coupé en deux fiches. »</strong>&#32;Artiste de l&apos;album ou titre d&apos;album
          différents selon les pistes. Ouvre les deux fiches et harmonise, ou fusionne avec « Déplacer vers un album ».
        </li>
        <li>
          <strong>« Les featurings ont été écrasés. »</strong>&#32;Un « appliquer à tous » trop rapide. Le remplissage
          de l&apos;artiste de l&apos;album ne coche jamais une ligne qui porte déjà un autre artiste ; dans une
          proposition de renommage, c&apos;est à toi de décocher les lignes qui ne suivent pas. Répare ligne à ligne, ou
          depuis <a href={guidePath(guideById("edit-track"), "fr")}>le tiroir</a>.
        </li>
        <li>
          <strong>« L&apos;album réclame des pistes que je n&apos;ai pas, ou que je ne veux pas. »</strong>&#32;La fiche
          est un Album, donc une tracklist est attendue. Passe la Nature de la fiche en Collection.
        </li>
        <li>
          <strong>« Re-matcher est gris. »</strong>&#32;Modifications en attente, ou Collection. Le pied de modale écrit
          la raison.
        </li>
        <li>
          <strong>« La pochette est une image de vidéo. »</strong>&#32;Album forcé sans parution MusicBrainz. La notice
          ambre mène à « Remplacer la pochette » ; cherche d&apos;abord dans les propositions en ligne.
        </li>
        <li>
          <strong>« Les numéros de piste sont dans le désordre. »</strong>&#32;Tags absents ou faux. Vérifie
          l&apos;ordre affiché, puis Renuméroter.
        </li>
        <li>
          <strong>« Après renommage, la page a changé d&apos;adresse. »</strong>&#32;Le dossier a été déplacé sur le
          disque. Normal : la page suit, et le bouton Retour ne revient pas sur l&apos;ancien nom.
        </li>
      </ul>
    </>
  );
}
