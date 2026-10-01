import { JsonLd } from "@/components/layout/JsonLd";
import { absoluteUrl, type Locale } from "@/lib/site";

export type Crumb = {
  name: string;
  path: string;
};

/** Lets a result page show `sonarche.org › Journal › post` instead of the bare URL. */
export function Breadcrumb({ locale, trail }: { locale: Locale; trail: Crumb[] }) {
  return (
    <JsonLd
      data={{
        "@type": "BreadcrumbList",
        inLanguage: locale,
        itemListElement: trail.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      }}
    />
  );
}
