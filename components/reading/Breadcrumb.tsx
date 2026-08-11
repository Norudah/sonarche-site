import { SITE_URL, type Locale } from "@/lib/site";

/*
 * The trail the header already draws, said to a machine.
 *
 * A reading page sits two levels down and shows it — `SONARCHE · Journal` above
 * the title — but a result page has no way to know that from the URL alone, so
 * it prints the bare address instead of the path. This is the one block that
 * turns it back into `sonarche.org › Journal › the post`.
 *
 * It claims nothing the page does not: every name here is the label rendered in
 * the header, and every url is a page that exists in this locale.
 */

export type Crumb = {
  name: string;
  /** Site-relative, with its trailing slash, exactly as everywhere else. */
  path: string;
};

export function Breadcrumb({ locale, trail }: { locale: Locale; trail: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, SITE_URL).href,
    })),
  };

  /* See components/layout/StructuredData for why this is the one right use of
     the escape hatch, and why `<` is replaced all the same. */
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
