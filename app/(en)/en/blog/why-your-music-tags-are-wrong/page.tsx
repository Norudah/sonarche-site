import { PostPage } from "@/components/blog/PostPage";
import { WrongTagsEn } from "@/components/blog/posts/wrong-tags/en";
import { postById, postMetadata } from "@/lib/blog";

const post = postById("wrong-tags");

export const metadata = postMetadata(post, "en");

export default function Page() {
  return (
    <PostPage post={post} locale="en">
      <WrongTagsEn />
    </PostPage>
  );
}
