import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { const base=process.env.NEXT_PUBLIC_SITE_URL ?? "https://oden-no-page.shimiken4123.chatgpt.site"; return {rules:{userAgent:"*",allow:"/",disallow:["/search"]},sitemap:`${base}/sitemap.xml`}; }
