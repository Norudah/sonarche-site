import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Le corps de l'article, en français. Son pendant anglais est dans ./en.tsx —
 * les deux disent la même chose et ne sont pas la traduction mot à mot l'un de
 * l'autre : ce sont deux textes écrits pour deux lecteurs.
 *
 * Deux règles pour les espaces autour d'une balise en ligne, et elles ne sont
 * pas symétriques :
 *   - APRÈS la balise, `&#32;` — JSX rogne l'espace en tête d'un texte qui court
 *     sur plusieurs lignes, et Prettier réécrit `{" "}` en espace littéral dès
 *     qu'il tient sur la ligne.
 *   - AVANT la balise, `{" "}` — là c'est l'inverse : une entité en fin de ligne
 *     est décodée puis rognée avec le retour à la ligne, alors que `{" "}` en
 *     fin de ligne est justement ce que Prettier pose et conserve.
 * Dans les deux cas la faute est silencieuse : le mot se recolle à la balise,
 * sans erreur de compilation. Le contrôle est dans docs/CONTEXT.md.
 */

export function WrongTagsFr() {
  return (
    <>
      <Lead>
        Un fichier audio ne sait pas ce qu&apos;il contient. Il porte un titre, un artiste et une pochette parce que
        quelqu&apos;un, un jour, les a écrits dedans. Et ce quelqu&apos;un pouvait se tromper.
      </Lead>

      <p>
        C&apos;est la première chose à comprendre avant de passer un week-end à réparer une bibliothèque à la main : les
        métadonnées d&apos;un morceau ne sont pas une propriété du son. Ce sont des notes laissées à côté.
      </p>

      <H2>Ce qu&apos;il y a vraiment dans le fichier</H2>

      <p>
        Un MP3 n&apos;est pas qu&apos;un flux audio : il traîne un petit bloc de texte, le tag <code>ID3</code>, collé
        en tête ou en queue de fichier. Les autres formats ont leur équivalent : les commentaires Vorbis pour FLAC et
        Opus, les atomes <code>ilst</code>&#32;pour l&apos;AAC en conteneur MP4. Le principe ne change pas : des paires
        clé-valeur, plus une image.
      </p>

      <pre>
        <code>{`TITLE=Nocturne
ARTIST=Ensemble Vireo
ALBUM=Marées basses
DATE=2019
TRACKNUMBER=4`}</code>
      </pre>

      <p>
        Rien là-dedans n&apos;est vérifié, et rien ne relie ce texte au son qui suit. Tu peux écrire{" "}
        <em>Symphonie n° 9</em>&#32;sur trois minutes de silence : aucun lecteur ne protestera, aucun scanner ne le
        remarquera. L&apos;étiquette est sur la boîte, pas dans la boîte.
      </p>

      <Pull>Une bibliothèque musicale, c&apos;est un mur d&apos;étiquettes que personne n&apos;a jamais relues.</Pull>

      <H2>D&apos;où viennent les étiquettes</H2>

      <p>Elles ont presque toujours l&apos;une de ces quatre origines, et chacune a sa manière de mentir.</p>

      <ul>
        <li>
          <strong>Un CD extrait.</strong>&#32;Le logiciel calcule un identifiant à partir de la longueur des pistes et
          interroge une base : historiquement CDDB, aujourd&apos;hui MusicBrainz. Deux disques qui ont par hasard le
          même découpage donnent le même identifiant, et le mauvais album gagne.
        </li>
        <li>
          <strong>Le nom du fichier.</strong>&#32;Beaucoup d&apos;outils supposent <code>Artiste - Titre.mp3</code>
          &#32;et découpent au premier tiret. Un artiste dont le nom contient un tiret, un titre qui en contient un, un
          fichier nommé <code>01 - piste 01.mp3</code>, et la règle produit des ordures avec la même assurance.
        </li>
        <li>
          <strong>La page d&apos;où vient le fichier.</strong>&#32;Le titre d&apos;une page web n&apos;est pas un titre
          de morceau : c&apos;est une accroche. D&apos;où les <code>(Official Video)</code>, <code>HD</code>,{" "}
          <code>[Lyrics]</code>&#32;et majuscules hurlantes qui traversent toute une collection.
        </li>
        <li>
          <strong>Une main.</strong>&#32;La plus fiable des quatre, et celle qui ne passe pas à l&apos;échelle. Personne
          ne tague trois mille morceaux sans se lasser au bout de cinquante.
        </li>
      </ul>

      <H2>Les cinq façons dont ça casse</H2>

      <p>
        Les dégâts sont toujours les mêmes, quel que soit le point de départ. Si tu ouvres ta propre collection
        maintenant, tu en trouveras au moins trois.
      </p>

      <ul>
        <li>
          <strong>Le champ « artiste de l&apos;album ».</strong>&#32;Sur une compilation, chaque piste a son artiste,
          mais l&apos;album n&apos;en a qu&apos;un. Les outils qui ignorent <code>ALBUMARTIST</code>&#32;font exploser
          l&apos;album en dix-huit albums d&apos;une piste. C&apos;est la panne la plus courante de toutes.
        </li>
        <li>
          <strong>L&apos;encodage.</strong>&#32;ID3v2 admet plusieurs encodages de texte. Un tag écrit en latin-1 puis
          relu en UTF-8 donne <code>BjÃ¶rk</code>&#32;au lieu de <code>Björk</code>, et le fichier reste cassé
          jusqu&apos;à ce que quelqu&apos;un le retape.
        </li>
        <li>
          <strong>Les invités.</strong>&#32;<code>feat.</code>, <code>ft.</code>, <code>featuring</code>, entre
          parenthèses, après une virgule, dans le titre ou dans l&apos;artiste. Six écritures pour un même fait, et six
          artistes distincts dans la liste.
        </li>
        <li>
          <strong>Les rééditions.</strong>&#32;Remaster, édition anniversaire, réédition avec deux titres en plus : même
          album, dates et numéros de piste différents. Triée par année, ta discographie devient un mensonge.
        </li>
        <li>
          <strong>Les vides.</strong>&#32;Pas de date, pas de numéro de piste, pas de pochette. Un lecteur qui range par
          album affiche alors un ordre alphabétique, ce qui n&apos;est l&apos;ordre de personne.
        </li>
      </ul>

      <H2>Pourquoi chercher le titre ne répare rien</H2>

      <p>
        Le réflexe est d&apos;envoyer le texte du tag à une base de données et de prendre le premier résultat. Ça échoue
        exactement là où on a besoin que ça marche : quand le texte de départ est faux.
      </p>

      <p>
        Une recherche par texte hérite de l&apos;erreur qu&apos;elle est censée corriger. Elle ne distingue pas deux
        morceaux homonymes de deux groupes différents, ni un enregistrement studio de sa version live, ni un original de
        sa reprise. Pire : elle répond toujours quelque chose. Sur mille fichiers, ces réponses plausibles mais fausses
        sont invisibles, jusqu&apos;au jour où tu cherches un morceau et où il n&apos;est nulle part.
      </p>

      <H2>Une empreinte plutôt qu&apos;un nom</H2>

      <p>
        L&apos;autre approche part du son. Un outil comme{" "}
        <a href="https://acoustid.org/chromaprint" rel="noreferrer" target="_blank">
          Chromaprint
        </a>{" "}
        analyse les deux premières minutes du morceau, en tire l&apos;énergie répartie sur les douze demi-tons de la
        gamme, image après image, puis compresse cette suite en une empreinte compacte.
      </p>

      <pre>
        <code>{`$ fpcalc -length 120 morceau.mp3
FILE=morceau.mp3
DURATION=241
FINGERPRINT=AQADtEmiKFKSJIeS5Hkg5X...`}</code>
      </pre>

      <p>
        Cette empreinte décrit ce qu&apos;on entend, pas ce qu&apos;on a écrit. Elle survit au ré-encodage, au
        changement de débit, à une normalisation du volume, à quelques secondes de silence en tête. Le même
        enregistrement en FLAC et en AAC donne, aux arrondis près, la même signature.
      </p>

      <p>
        Il reste à savoir à quoi elle correspond.{" "}
        <a href="https://acoustid.org/" rel="noreferrer" target="_blank">
          AcoustID
        </a>{" "}
        tient ce registre : des millions d&apos;empreintes, chacune reliée à un enregistrement de{" "}
        <a href="https://musicbrainz.org/" rel="noreferrer" target="_blank">
          MusicBrainz
        </a>
        , l&apos;encyclopédie musicale ouverte. On y récupère un identifiant stable, et avec lui le titre exact,
        l&apos;artiste crédité, l&apos;album, l&apos;année de parution, la place dans le disque et la pochette.
      </p>

      <Pull>
        Ce n&apos;est plus une recherche, c&apos;est une reconnaissance : le fichier n&apos;a plus son mot à dire sur ce
        qu&apos;il prétend être.
      </Pull>

      <H2>Ce que l&apos;empreinte ne fait pas</H2>

      <p>Trois limites, à connaître avant de croire à la magie.</p>

      <ul>
        <li>
          <strong>Elle identifie un enregistrement, pas une œuvre.</strong>&#32;Un live, un remix, une session
          acoustique sont d&apos;autres enregistrements et reçoivent d&apos;autres identifiants. C&apos;est voulu, et
          c&apos;est justement ce qu&apos;une recherche par titre ne sait pas faire.
        </li>
        <li>
          <strong>Elle ne trouve que ce qui a déjà été soumis.</strong>&#32;Une autoproduction confidentielle,
          l&apos;enregistrement d&apos;un concert local, un morceau paru la veille : pas d&apos;empreinte dans la base,
          pas de réponse. La base est ouverte, on peut l&apos;alimenter.
        </li>
        <li>
          <strong>Elle ne juge pas.</strong>&#32;Le genre, l&apos;humeur, la note que tu mets à un disque ne sont dans
          aucun spectre. Ces champs-là resteront les tiens, et c&apos;est très bien.
        </li>
      </ul>

      <H2>Le faire soi-même</H2>

      <p>
        Rien de tout ça n&apos;est propriétaire. <code>fpcalc</code>&#32;vient avec Chromaprint, et{" "}
        <a href="https://beets.io/" rel="noreferrer" target="_blank">
          beets
        </a>{" "}
        est le gestionnaire de bibliothèque qui met l&apos;ensemble bout à bout : il calcule les empreintes, interroge
        AcoustID, propose la correspondance, écrit les tags et range les fichiers.
      </p>

      <pre>
        <code>{`$ pip install "beets[chroma]"
$ beet config -e        # ajouter chroma à la liste des plugins
$ beet import ~/Musique/à-ranger`}</code>
      </pre>

      <p>
        Compte une soirée pour la première configuration, et une certaine patience avec les cas que beets te demande de
        trancher toi-même. C&apos;est un excellent outil, écrit par des gens qui ont pensé à tout, mais il vit dans un
        terminal, et il faut vouloir y vivre aussi.
      </p>

      <H2>Ce qu&apos;on gagne</H2>

      <p>
        Des tags justes, ce n&apos;est pas de la maniaquerie. C&apos;est ce qui fait qu&apos;une collection reste
        lisible quand elle change de machine, de logiciel ou de décennie. Les fichiers, eux, ne se perdent pas : ce sont
        les catalogues qui se perdent. Un morceau correctement nommé et correctement rangé se retrouve avec{" "}
        <code>ls</code>, dix ans plus tard, sans l&apos;application qui l&apos;avait importé.
      </p>

      <p>
        C&apos;est la seule forme de possession qui compte pour une bibliothèque musicale : pouvoir l&apos;ouvrir sans
        rien demander à personne.
      </p>
    </>
  );
}
