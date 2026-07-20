import type { Metadata } from "next";
import { ArticleCard } from "../components/article-card";
import { Breadcrumbs } from "../components/breadcrumbs";
import { articles, categories } from "../lib/articles";
import Link from "next/link";
export const metadata: Metadata = { title: "記事一覧", description: "おでんのページの記事を新しい順に紹介します。", alternates: { canonical: "/articles" } };
export default function ArticlesPage() { return <div className="shell page-wrap"><Breadcrumbs items={[{ label: "記事" }]} /><div className="page-title"><p className="kicker">All notes</p><h1>記事を読む</h1><p>気になる具から、つまんでいってください。</p></div><div className="filter-row"><Link className="filter active" href="/articles">すべて <b>{articles.length}</b></Link>{categories.slice(0,5).map(c => <Link className="filter" href={`/categories/${c.slug}`} key={c.slug}>{c.name}</Link>)}<Link className="filter search-filter" href="/search">⌕ 記事を検索</Link></div><div className="article-grid listing">{articles.map((article, i) => <ArticleCard article={article} index={i} key={article.slug} />)}</div></div>; }
