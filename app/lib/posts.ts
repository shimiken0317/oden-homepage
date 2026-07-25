import { categories, getCategoryBySlug } from "./categories";
import type { Post, PostSummary, SearchPostSummary } from "./post-types";
import { posts as bundledPosts } from "virtual:oden-posts";

const allPosts = bundledPosts as Post[];

function toSummary(post: Post): PostSummary {
  const summary: Partial<Post> = { ...post };
  delete summary.body;
  delete summary.sourcePath;
  return summary as PostSummary;
}

function bodyToSearchText(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPublishedPosts(): PostSummary[] {
  return allPosts.filter((post) => post.status === "published").map(toSummary);
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.status === "published" && post.slug === slug);
}

export function getPostForLocalPreview(slug: string): Post | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  return allPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): PostSummary[] {
  return getPublishedPosts().filter((post) => post.categorySlug === categorySlug);
}

export function getAllCategories() {
  return categories;
}

export function getAllTags() {
  return [...new Set(getPublishedPosts().flatMap((post) => post.tags))].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
}

export function getSearchPosts(): SearchPostSummary[] {
  return allPosts
    .filter((post) => post.status === "published")
    .map((post) => ({ ...toSummary(post), searchText: bodyToSearchText(post.body) }));
}

export { getCategoryBySlug };
export type { Post, PostSummary, SearchPostSummary } from "./post-types";
