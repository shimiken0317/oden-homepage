export type PostStatus = "draft" | "published";
export type PostCategory =
  | "筋トレ"
  | "ランニング"
  | "投資"
  | "プログラミング"
  | "AI"
  | "日記"
  | "ガジェット"
  | "読書";
export type PostCategorySlug =
  | "training"
  | "running"
  | "investing"
  | "code"
  | "ai"
  | "diary"
  | "gadgets"
  | "books";

export type PostFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  categorySlug: PostCategorySlug;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: PostStatus;
  featured: boolean;
  author: string;
  readingTime?: number;
};

export type Post = PostFrontmatter & {
  body: string;
  sourcePath: string;
  readingTime: number;
  tone: number;
};

export type PostSummary = Omit<Post, "body" | "sourcePath">;

export type SearchPostSummary = PostSummary & {
  searchText: string;
};
