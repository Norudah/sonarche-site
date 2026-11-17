import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § FAQ. */

type Entry = { question: string; answer: string };

export type FaqCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  entries: Entry[];
};

export const faqCopy: Record<Locale, FaqCopy> = {
  en: {
    kicker: "FREQUENTLY ASKED",
    headingBefore: "Before you",
    headingEmphasis: "come aboard.",
    entries: [
      {
        question: "Is Sonarche really free?",
        answer: "Yes. It's open-source software under the MIT license: no ads, no paid tier, no subscription.",
      },
      {
        question: "Which systems does it run on?",
        answer:
          "macOS, with one file for Apple Silicon and Intel Macs, and 64-bit Windows 10 or 11. There is no Linux build for now.",
      },
      {
        question: "Which audio formats does it handle?",
        answer:
          "For import and playback: MP3, FLAC, M4A, AAC, OGG, WAV and AIFF. Tracks added from a link arrive as M4A, or as MP3 if you pick it in the settings.",
      },
      {
        question: "Can I import the library I already have?",
        answer:
          "Yes. Point it at your folders: Sonarche copies them, never moving the originals, then identifies and tags what it finds.",
      },
      {
        question: "Where does the music come from?",
        answer:
          "From two places: a link you paste, whose original audio Sonarche downloads with yt-dlp, or the folders already on your machine.",
      },
      {
        question: "Do I need an account?",
        answer:
          "No. No account, no cloud. Your library and the player work offline: the internet is only used to download and identify tracks.",
      },
      {
        question: "How is it different from MusicBee, Picard or beets?",
        answer:
          "MusicBee files and plays your music, but only on Windows. Picard is a precise tag editor that lets you pick every release by hand, with no library or player. beets does the same work from the command line. Sonarche ships beets, makes the choices for you, and covers the whole chain, from the link to the player.",
      },
    ],
  },
  fr: {
    kicker: "QUESTIONS FRÉQUENTES",
    headingBefore: "Avant de",
    headingEmphasis: "monter à bord.",
    entries: [
      {
        question: "Sonarche est vraiment gratuit ?",
        answer:
          "Oui. C'est un logiciel open source sous licence MIT : pas de publicité, pas de version payante, pas d'abonnement.",
      },
      {
        question: "Sur quels systèmes ?",
        answer:
          "macOS, avec un seul fichier pour les Mac Apple Silicon et Intel, et Windows 10 ou 11 en 64 bits. Il n'y a pas de version Linux pour l'instant.",
      },
      {
        question: "Quels formats audio ?",
        answer:
          "À l'import et à la lecture : MP3, FLAC, M4A, AAC, OGG, WAV et AIFF. Les morceaux ajoutés depuis un lien arrivent en M4A, ou en MP3 si tu le choisis dans les réglages.",
      },
      {
        question: "Je peux importer ma bibliothèque existante ?",
        answer:
          "Oui. Montre-lui tes dossiers : Sonarche les copie, sans jamais déplacer les originaux, puis identifie et tague ce qu'il trouve.",
      },
      {
        question: "D'où vient la musique ?",
        answer:
          "De deux endroits : un lien que tu colles, dont Sonarche télécharge l'audio d'origine avec yt-dlp, ou les dossiers que tu as déjà sur ta machine.",
      },
      {
        question: "Il faut créer un compte ?",
        answer:
          "Non. Aucun compte, aucun cloud. Ta bibliothèque et le lecteur marchent hors ligne : internet ne sert qu'à télécharger et à identifier les morceaux.",
      },
      {
        question: "Quelle différence avec MusicBee, Picard ou beets ?",
        answer:
          "MusicBee range et joue ta musique, mais seulement sous Windows. Picard est un éditeur de tags très précis, qui te laisse choisir chaque édition à la main, sans bibliothèque ni lecteur. beets fait le même travail en ligne de commande. Sonarche embarque beets, choisit pour toi et fait toute la chaîne, du lien au lecteur.",
      },
    ],
  },
};
