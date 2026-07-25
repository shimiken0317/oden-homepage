import type { PostCategory, PostCategorySlug } from "./post-types";

export type Category = {
  name: PostCategory;
  slug: PostCategorySlug;
  mark: string;
  description: string;
};

export const categories: Category[] = [
  { name: "筋トレ", slug: "training", mark: "鍛", description: "無理なく、強くなる" },
  { name: "ランニング", slug: "running", mark: "走", description: "気持ちよく、遠くへ" },
  { name: "投資", slug: "investing", mark: "育", description: "長い目で、お金を育てる" },
  { name: "プログラミング", slug: "code", mark: "組", description: "つくって、ほどいて、学ぶ" },
  { name: "AI", slug: "ai", mark: "知", description: "新しい道具と仲良くなる" },
  { name: "日記", slug: "diary", mark: "日", description: "小さな気づきの記録" },
  { name: "ガジェット", slug: "gadgets", mark: "具", description: "暮らしに効く道具" },
  { name: "読書", slug: "books", mark: "読", description: "本から拾ったことば" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
