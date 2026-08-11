import { type Guide, guidePath } from "@/lib/guide";
import { AUTHOR, OG_IMAGE, SITE_URL, type Locale } from "@/lib/site";

/*
 * The guide, said to a machine.
 *
 * `TechArticle` and not `HowTo`: HowTo lost its rich result in 2023, so what is
 * left of it is a promise search engines no longer keep, in exchange for having
 * to restate every step as data. This says what the page honestly is — a piece
 * of documentation, about a piece of software, in one language, last revised on
 * a known day.
 */

type GuideSchemaProps = {
  guide: Guide;
  locale: Locale;
};

export function GuideSchema({ guide, locale }: GuideSchemaProps) {
  const url = new URL(guidePath(guide, locale), SITE_URL).href;

  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title[locale],
    description: guide.description[locale],
    image: [new URL(OG_IMAGE.url, SITE_URL).href],
    inLanguage: locale,
    dateModified: guide.updated,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Organization", name: "Sonarche", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: { "@type": "SoftwareApplication", name: "Sonarche", softwareVersion: guide.appVersion },
    url,
    isAccessibleForFree: true,
  };

  /* See components/layout/StructuredData for why this is the one right use of
     the escape hatch, and why `<` is replaced all the same. */
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
