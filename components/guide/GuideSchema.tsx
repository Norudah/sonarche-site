import { JsonLd } from "@/components/layout/JsonLd";
import { type Guide, guidePath } from "@/lib/guide";
import { AUTHOR, OG_IMAGE, SITE_URL, absoluteUrl, type Locale } from "@/lib/site";

/* TechArticle, not HowTo: HowTo lost its rich result in 2023. */
export function GuideSchema({ guide, locale }: { guide: Guide; locale: Locale }) {
  const url = absoluteUrl(guidePath(guide, locale));

  return (
    <JsonLd
      data={{
        "@type": "TechArticle",
        headline: guide.title[locale],
        description: guide.description[locale],
        image: [absoluteUrl(OG_IMAGE.url)],
        inLanguage: locale,
        dateModified: guide.updated,
        author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
        publisher: { "@type": "Organization", name: "Sonarche", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        about: { "@type": "SoftwareApplication", name: "Sonarche", softwareVersion: guide.appVersion },
        url,
        isAccessibleForFree: true,
      }}
    />
  );
}
