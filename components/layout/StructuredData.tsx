import { AUTHOR, BRAND_TITLE, GITHUB_URL, LOCALE_PATH, OG_IMAGE, SITE_URL, type Locale } from "@/lib/site";

/*
 * What the page is, said in the one vocabulary a search engine parses literally.
 *
 * Everything else on this site describes Sonarche to a person. This describes it
 * to a machine: a free MultimediaApplication for macOS and Windows, MIT, with a
 * public repository. Google will not draw stars from it — that needs ratings,
 * and inventing ratings is not on the table — but it is what lets the page be
 * understood as an application rather than as an article about one.
 *
 * Rendered from the layout so both locales carry their own, each pointing at its
 * own url and declaring its own language. Nothing here may claim anything the
 * page does not: the description is the page's own meta description, the price
 * is genuinely zero, and the repository is the same constant every CTA uses.
 */

type StructuredDataProps = {
  locale: Locale;
  description: string;
};

export function StructuredData({ locale, description }: StructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sonarche",
    alternateName: BRAND_TITLE,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "macOS, Windows",
    url: new URL(LOCALE_PATH[locale], SITE_URL).href,
    description,
    image: new URL(OG_IMAGE.url, SITE_URL).href,
    inLanguage: locale,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    codeRepository: GITHUB_URL,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  /* The one place on this site where dangerouslySetInnerHTML is right: a
     ld+json block is not text content, and React would escape the quotes into
     entities that no parser reads back. The object is ours, built above from
     constants — nothing here comes from outside.
     `<` is escaped all the same: it is the only character that can end the
     script element early, and the cost of not having to trust that forever is
     one replace. */
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
