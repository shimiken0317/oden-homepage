import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "../../components/article-card";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { getAllCategories, getCategoryBySlug, getPostsByCategory } from "../../lib/posts";
export function generateStaticParams() { return getAllCategories().map(({slug}) => ({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> { const {slug}=await params; const category=getCategoryBySlug(slug); return category ? {title: category.name, description: category.description, alternates:{canonical:`/categories/${slug}`}} : {}; }
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const category=getCategoryBySlug(slug); if(!category) notFound(); const filtered=getPostsByCategory(slug); return <div className="shell page-wrap"><Breadcrumbs items={[{label:"カテゴリー",href:"/categories"},{label:category.name}]} /><div className="page-title category-title"><span className="category-mark tone-0">{category.mark}</span><div><p className="kicker">Topic</p><h1>{category.name}</h1><p>{category.description}。少しずつ積み上げた記録です。</p></div></div>{filtered.length ? <div className="article-grid listing">{filtered.map((a,i)=><ArticleCard article={a} index={i} key={a.slug}/>)}</div> : <p>まだ記事を煮込んでいます。</p>}</div>; }
