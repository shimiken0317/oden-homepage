import Link from "next/link";
import type { PostSummary } from "../lib/posts";

export function ArticleCard({ article, index = 0 }: { article: PostSummary; index?: number }) {
  return <article className="article-card">
    <Link href={`/articles/${article.slug}`} className={`card-visual tone-${article.tone}`}>
      <span className="visual-number">0{index + 1}</span><span className="visual-mark">{article.category === "AI" ? "AI" : article.category.slice(0, 1)}</span><span className="visual-line" />
    </Link>
    <div className="card-body"><div className="card-meta"><Link href={`/categories/${article.categorySlug}`}>{article.category}</Link><span>{article.publishedAt.replaceAll("-", ".")}</span></div><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><div className="card-foot"><span>{article.readingTime} min read</span><Link href={`/articles/${article.slug}`} aria-label={`${article.title}を読む`}>↗</Link></div></div>
  </article>;
}
