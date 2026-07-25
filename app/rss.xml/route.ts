import { getPublishedPosts } from "../lib/posts";
import { getSiteUrl } from "../lib/site-url";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const base = getSiteUrl();
  const articles = getPublishedPosts();
  const items = articles.map((article) => {
    const articleUrl = `${base}/articles/${article.slug}`;
    return `<item><title>${cdata(article.title)}</title><link>${escapeXml(articleUrl)}</link><guid>${escapeXml(articleUrl)}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description>${cdata(article.excerpt)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>おでんのページ</title><link>${escapeXml(base)}</link><description>好きなことを、じっくり煮込む。</description><language>ja</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
