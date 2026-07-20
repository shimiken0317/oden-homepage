export type Article = {
  slug: string; title: string; excerpt: string; category: string; categorySlug: string;
  tags: string[]; publishedAt: string; updatedAt: string; readingTime: number; featured?: boolean; tone: number;
};

export const categories = [
  { name: "筋トレ", slug: "training", mark: "鍛", description: "無理なく、強くなる" },
  { name: "ランニング", slug: "running", mark: "走", description: "気持ちよく、遠くへ" },
  { name: "投資", slug: "investing", mark: "育", description: "長い目で、お金を育てる" },
  { name: "プログラミング", slug: "code", mark: "組", description: "つくって、ほどいて、学ぶ" },
  { name: "AI", slug: "ai", mark: "知", description: "新しい道具と仲良くなる" },
  { name: "日記", slug: "diary", mark: "日", description: "小さな気づきの記録" },
  { name: "ガジェット", slug: "gadgets", mark: "具", description: "暮らしに効く道具" },
  { name: "読書", slug: "books", mark: "読", description: "本から拾ったことば" },
];

export const articles: Article[] = [
  { slug: "training-menu-for-beginners", title: "筋トレ初心者が週3回を続けるための、がんばりすぎないメニュー", excerpt: "結果を急ぐほど、メニューは複雑になりがち。続く強度と小さな記録から組み立てます。", category: "筋トレ", categorySlug: "training", tags: ["初心者", "習慣化", "自宅トレ"], publishedAt: "2026-07-18", updatedAt: "2026-07-20", readingTime: 7, featured: true, tone: 0 },
  { slug: "ai-notes-workflow", title: "AIと一緒にメモを育てる。毎日15分の小さな知識整理", excerpt: "思いつきを消費せず、あとで使える知識へ。AIを編集者として使うシンプルな流れ。", category: "AI", categorySlug: "ai", tags: ["生成AI", "ノート術"], publishedAt: "2026-07-14", updatedAt: "2026-07-14", readingTime: 5, tone: 1 },
  { slug: "running-slow-is-fine", title: "ゆっくり走る日が、いちばん遠くへ連れていってくれる", excerpt: "速さを追わないランニングが、体力と気持ちにどう効いたかを記録しました。", category: "ランニング", categorySlug: "running", tags: ["LSD", "継続"], publishedAt: "2026-07-10", updatedAt: "2026-07-11", readingTime: 4, tone: 2 },
  { slug: "desk-gadgets-2026", title: "作業のじゃまをしない、静かなデスク道具を3つだけ", excerpt: "派手な機能より、毎日触れて気持ちいいこと。半年使い続けた道具を選びました。", category: "ガジェット", categorySlug: "gadgets", tags: ["デスク", "レビュー"], publishedAt: "2026-07-06", updatedAt: "2026-07-06", readingTime: 6, tone: 3 },
  { slug: "nextjs-content-design", title: "記事が増えても迷子にならない、Next.jsのコンテンツ設計", excerpt: "数百記事を見据え、MDX、型、検索インデックスの境界を整理します。", category: "プログラミング", categorySlug: "code", tags: ["Next.js", "MDX", "設計"], publishedAt: "2026-06-29", updatedAt: "2026-07-02", readingTime: 9, tone: 1 },
  { slug: "index-investing-first-year", title: "積立投資を始めた一年目に、やらなくてよかったこと", excerpt: "相場を読むことより、生活を崩さないルールづくりに集中した一年の振り返り。", category: "投資", categorySlug: "investing", tags: ["インデックス", "積立"], publishedAt: "2026-06-20", updatedAt: "2026-06-20", readingTime: 8, tone: 2 },
];

export function getArticle(slug: string) { return articles.find((article) => article.slug === slug); }
