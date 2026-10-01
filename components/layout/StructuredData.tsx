import { JsonLd } from "@/components/layout/JsonLd";
import { AUTHOR, BRAND_TITLE, GITHUB_URL, LOCALE_PATH, OG_IMAGE, absoluteUrl, type Locale } from "@/lib/site";

type StructuredDataProps = {
  locale: Locale;
  description: string;
};

/* Claims nothing the page does not show: no ratings, a genuine zero price. */
export function StructuredData({ locale, description }: StructuredDataProps) {
  return (
    <JsonLd
      data={{
        "@type": "SoftwareApplication",
        name: "Sonarche",
        alternateName: BRAND_TITLE,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "macOS, Windows",
        url: absoluteUrl(LOCALE_PATH[locale]),
        description,
        image: absoluteUrl(OG_IMAGE.url),
        inLanguage: locale,
        author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        codeRepository: GITHUB_URL,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      }}
    />
  );
}
