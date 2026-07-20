import { articles } from "../lib/articles";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oden-no-page.shimiken4123.chatgpt.site";
  const items = articles.map((article) => `<item><title><![CDATA[${article.title}]]></title><link>${base}/articles/${article.slug}</link><guid>${base}/articles/${article.slug}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description><![CDATA[${article.excerpt}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>おでんのページ</title><link>${base}</link><description>好きなことを、じっくり煮込む。</description><language>ja</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
