import { postById, postPath } from "@/lib/blog";

import { H2, Lead } from "@/components/reading/Prose";

/*
 * Première mise en route, en français. Son pendant anglais est dans ./en.tsx.
 *
 * BROUILLON — voir `draft: true` dans lib/guide.ts. Ce qui manque avant de le
 * publier :
 *   1. CAPTURE — l'avertissement macOS, tel qu'il apparaît vraiment (Romain en
 *      a pris une le 2026-07-28, dans le repo de l'app).
 *   2. CAPTURE — Réglages Système › Confidentialité et sécurité, la ligne
 *      Sonarche et le bouton « Ouvrir quand même ».
 *   3. CAPTURE — le panneau de premier lancement, une fois l'environnement
 *      construit.
 *   4. Relire sur la version publiée du jour et remonter `appVersion`.
 * Les emplacements sont marqués ci-dessous par des commentaires CAPTURE.
 *
 * Espaces autour des balises en ligne : voir le commentaire en tête de
 * components/blog/posts/wrong-tags/fr.tsx — les deux règles, et pourquoi.
 */

export function GettingStartedFr() {
  return (
    <>
      <Lead>
        Sonarche est signée mais pas certifiée par Apple : cette validation-là demande un compte développeur payant.
        Résultat : macOS et Windows affichent un avertissement au premier lancement, une seule fois. Voici le chemin
        complet, de l&apos;installation à ta première bibliothèque.
      </Lead>

      <H2>Choisir le bon fichier</H2>

      <p>
        Tout est sur la page des versions, et il n&apos;y a qu&apos;un fichier à prendre selon la machine. Les{" "}
        <code>.tar.gz</code>&#32;et <code>.sig</code>&#32;posés à côté servent au mécanisme de mise à jour. Tu n&apos;en
        as pas besoin.
      </p>

      <ul>
        <li>
          <strong>Mac Apple Silicon (M1 à M4)</strong> : <code>Sonarche_x.y.z_aarch64.dmg</code>
        </li>
        <li>
          <strong>Mac Intel</strong> : <code>Sonarche_x.y.z_x64.dmg</code>
        </li>
        <li>
          <strong>Windows 10 ou 11, 64 bits</strong> : <code>Sonarche_x.y.z_x64-setup.exe</code>
        </li>
      </ul>

      <p>
        Tu ne sais pas quel Mac tu as ? Menu Pomme → À propos de ce Mac : si la ligne dit <em>Puce</em>, c&apos;est de
        l&apos;Apple Silicon. En ligne de commande, <code>uname -m</code>&#32;répond <code>arm64</code>&#32;ou{" "}
        <code>x86_64</code>. Windows sur ARM fait tourner la version x64 en émulation.
      </p>

      <H2>Passer l&apos;avertissement, sur macOS</H2>

      <p>
        Au premier lancement, macOS annonce qu&apos;il n&apos;a pas pu vérifier l&apos;application.{" "}
        <strong>Ne clique pas sur le bouton bleu</strong> : il propose de la mettre à la corbeille.
      </p>

      {/* CAPTURE 1 — le dialogue macOS, en pleine largeur de colonne. */}

      <ol>
        <li>Ouvre Sonarche. Au dialogue qui s&apos;affiche, clique sur « Terminé ».</li>
        <li>
          Va dans Réglages Système → Confidentialité et sécurité, puis descends jusqu&apos;à la section Sécurité : une
          ligne concernant Sonarche t&apos;y attend.
        </li>
        <li>Clique sur « Ouvrir quand même », authentifie-toi, puis confirme avec « Ouvrir ».</li>
      </ol>

      {/* CAPTURE 2 — Réglages Système, la ligne Sonarche et son bouton. */}

      <p>
        Cette ligne disparaît environ une heure après le lancement refusé. Si elle n&apos;est pas là, relance
        l&apos;application et retourne dans les réglages. Tu ne reverras pas cet écran : les mises à jour suivantes sont
        écrites par le mécanisme interne de l&apos;app, qui ne marque pas les fichiers comme téléchargés.
      </p>

      <H2>Passer l&apos;avertissement, sur Windows</H2>

      <p>
        SmartScreen affiche « Windows a protégé votre ordinateur », pour la même raison : l&apos;installateur n&apos;est
        pas signé par un certificat payant. Clique sur « Informations complémentaires », puis sur « Exécuter quand
        même&nbsp;». L&apos;installation se fait pour ton compte utilisateur uniquement, donc sans demande
        d&apos;élévation, ni à l&apos;installation, ni aux mises à jour.
      </p>

      <H2>Le premier lancement</H2>

      <p>
        L&apos;application s&apos;ouvre sur un court parcours qui construit son environnement : elle déballe le Python
        qu&apos;elle transporte, installe <code>yt-dlp</code>&#32;et <code>beets</code>&#32;dans un environnement
        virtuel qui lui appartient, et te demande une clé AcoustID. Compte une quinzaine de secondes. Aucun accès réseau
        n&apos;est nécessaire : les paquets voyagent dans le bundle.
      </p>

      <p>
        Ton Python système n&apos;est jamais touché, et rien n&apos;est installé ailleurs que dans le dossier de
        l&apos;application.
      </p>

      {/* CAPTURE 3 — le panneau de premier lancement, environnement construit. */}

      <H2>La clé AcoustID, et pourquoi la prendre</H2>

      <p>
        Elle est gratuite, elle se demande en une minute, et elle est facultative, mais sans elle, tes morceaux sont
        tagués à partir des indices disponibles au lieu d&apos;être identifiés par leur son. C&apos;est toute la
        différence entre un nom deviné et un nom reconnu, et{" "}
        <a href={postPath(postById("wrong-tags"), "fr")}>le journal raconte pourquoi</a>.
      </p>

      <p>
        Une fois saisie, la clé est rangée dans le trousseau du système, jamais dans un fichier de configuration, et
        elle ne réapparaît plus dans l&apos;interface.
      </p>

      <H2>Et ensuite</H2>

      <p>
        À partir de là, tu as deux entrées : pointer l&apos;application sur des dossiers que tu possèdes déjà, ou
        ajouter les morceaux un par un. Les deux passent par la même chaîne (empreinte, identification, tags, rangement)
        et aboutissent au même arbre de fichiers.
      </p>
    </>
  );
}
