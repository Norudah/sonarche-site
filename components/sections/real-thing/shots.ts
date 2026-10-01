/* The captures are the app's French UI on both pages for now; English ones go in public/shots/en/. */
export const SHOT_DIR = { en: "fr", fr: "fr" } as const;

/* The webp's intrinsic size, so the frame reserves its space. */
export const SHOT_SIZE = { width: 1600, height: 1040 };

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
