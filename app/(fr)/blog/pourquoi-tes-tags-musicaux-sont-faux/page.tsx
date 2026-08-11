import { PostPage } from "@/components/blog/PostPage";
import { WrongTagsFr } from "@/components/blog/posts/wrong-tags/fr";
import { postById, postMetadata } from "@/lib/blog";

const post = postById("wrong-tags");

export const metadata = postMetadata(post, "fr");

export default function Page() {
  return (
    <PostPage post={post} locale="fr">
      <WrongTagsFr />
    </PostPage>
  );
}
