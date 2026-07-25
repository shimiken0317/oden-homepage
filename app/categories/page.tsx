import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { getAllCategories, getPublishedPosts } from "../lib/posts";
export const metadata: Metadata = { title: "カテゴリー" };
export default function CategoriesPage() { const articles=getPublishedPosts(); const categories=getAllCategories(); return <div className="shell page-wrap"><Breadcrumbs items={[{label:"カテゴリー"}]} /><div className="page-title"><p className="kicker">Explore topics</p><h1>カテゴリー</h1><p>知りたいことを、具ごとに分けました。</p></div><div className="category-grid large">{categories.map((category, index) => { const count = articles.filter(a => a.categorySlug === category.slug).length; return <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}><span className={`category-mark tone-${index % 4}`}>{category.mark}</span><span><strong>{category.name}</strong><small>{category.description} ・ {count}記事</small></span><span className="arrow">↗</span></Link> })}</div></div>; }
