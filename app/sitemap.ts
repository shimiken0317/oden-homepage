import type { MetadataRoute } from "next";
import { articles, categories } from "./lib/articles";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oden-no-page.example.com";
export default function sitemap(): MetadataRoute.Sitemap { const fixed=["","/articles","/categories","/about","/projects","/contact"].map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:path===""?1:0.7})); return [...fixed,...articles.map(a=>({url:`${base}/articles/${a.slug}`,lastModified:new Date(a.updatedAt),changeFrequency:"monthly" as const,priority:0.8})),...categories.map(c=>({url:`${base}/categories/${c.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:0.6}))]; }
