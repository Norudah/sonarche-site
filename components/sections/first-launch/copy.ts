import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § First launch / Premier lancement. */

export type PlatformNote = {
  label: string;
  /** What the OS puts on screen, quoted. */
  says: string;
  /** The way through, set in mono because it is a sequence of clicks. */
  fix: string;
  /** The other way, for someone who already hit Cancel. */
  fallback: string;
};

export type FirstLaunchCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  platforms: PlatformNote[];
  closer: string;
};

export const firstLaunchCopy: Record<Locale, FirstLaunchCopy> = {
  en: {
    kicker: "FIRST LAUNCH",
    headingBefore: "Your system will hesitate.",
    headingEmphasis: "Once.",
    body: "Sonarche isn't signed by Apple or Microsoft. Those are yearly certificate fees, not security audits, and this project chose the code-is-public route instead. So the very first launch costs you one extra click, on either platform.",
    platforms: [
      {
        label: "MACOS",
        says: "Gatekeeper says « Apple could not verify that this app is free of malware ».",
        fix: "right-click the app → Open → Open",
        fallback: "Or once it's blocked: System Settings → Privacy & Security → Open Anyway.",
      },
      {
        label: "WINDOWS",
        says: "SmartScreen says « Windows protected your PC » and hides the button.",
        fix: "More info → Run anyway",
        fallback: "Or before opening: right-click the file → Properties → Unblock.",
      },
    ],
    closer: "After that, it's just your app.",
  },
  fr: {
    kicker: "PREMIER LANCEMENT",
    headingBefore: "Ton système va hésiter.",
    headingEmphasis: "Une fois.",
    body: "Sonarche n'est signé ni par Apple ni par Microsoft. Ce sont des certificats à l'année, pas des audits de sécurité, et ce projet a préféré la voie du code public. Le tout premier lancement te coûte donc un clic de plus, sur l'une comme sur l'autre plateforme.",
    platforms: [
      {
        label: "MACOS",
        says: "Gatekeeper affiche « Apple n'a pas pu vérifier que cette app ne contient pas de logiciel malveillant ».",
        fix: "clic droit sur l'app → Ouvrir → Ouvrir",
        fallback: "Ou si elle est déjà bloquée : Réglages Système → Confidentialité et sécurité → Ouvrir quand même.",
      },
      {
        label: "WINDOWS",
        says: "SmartScreen affiche « Windows a protégé votre ordinateur » et cache le bouton.",
        fix: "Informations complémentaires → Exécuter quand même",
        fallback: "Ou avant d'ouvrir : clic droit sur le fichier → Propriétés → Débloquer.",
      },
    ],
    closer: "Ensuite, c'est ton app, tout simplement.",
  },
};
