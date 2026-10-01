import { BlogIndex, blogIndexMetadata } from "@/components/blog/BlogIndex";

export const metadata = blogIndexMetadata("fr");

export default function FrBlogIndex() {
  return <BlogIndex locale="fr" />;
}
