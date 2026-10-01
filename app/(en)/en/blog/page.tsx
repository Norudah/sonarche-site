import { BlogIndex, blogIndexMetadata } from "@/components/blog/BlogIndex";

export const metadata = blogIndexMetadata("en");

export default function EnBlogIndex() {
  return <BlogIndex locale="en" />;
}
