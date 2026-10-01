/* ld+json is not text content: React would escape its quotes into entities no parser reads back.
   The data is built from our own constants; `<` is escaped so nothing can close the script early. */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
