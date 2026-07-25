import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePageView } from "../../../components/article-page-view";
import { getPostForLocalPreview, getPublishedPosts } from "../../../lib/posts";

export const metadata: Metadata = {
  title: "記事プレビュー",
  robots: { index: false, follow: false },
};

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostForLocalPreview(slug);
  if (!post) notFound();
  return <ArticlePageView post={post} publishedPosts={getPublishedPosts()} />;
}
