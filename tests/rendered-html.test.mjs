import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("トップページがブランド情報とともにサーバーレンダリングされる", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>おでんのページ<\/title>/);
  assert.match(html, /好きなことを、/);
  assert.match(html, /じっくり煮込む。/);
  assert.match(html, /おでんちゃん/);
  assert.doesNotMatch(html, /codex-preview|Starter Project|react-loading-skeleton/);
});

test("公開用メタデータと使い捨てプレビューの除去を確認する", async () => {
  const [layout, siteUrl, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/site-url.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /title:\s*\{ default: "おでんのページ"/);
  assert.match(layout, /getSiteUrl\(\)/);
  assert.match(layout, /oden-sketch-sheet\.png/);
  assert.match(siteUrl, /process\.env\.NEXT_PUBLIC_SITE_URL/);
  assert.match(siteUrl, /http:\/\/localhost:3000/);
  assert.doesNotMatch(siteUrl, /chatgpt\.site/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

const existingSlugs = [
  "happy-oden-chan-doodle",
  "workout-log-2026-07-25",
  "training-menu-for-beginners",
  "ai-notes-workflow",
  "running-slow-is-fine",
  "desk-gadgets-2026",
  "nextjs-content-design",
  "index-investing-first-year",
];

test("既存の記事URLとMDX本文が維持される", async () => {
  for (const slug of existingSlugs) {
    const response = await render(`/articles/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assert.match(html, new RegExp(`/articles/${slug}`));
    assert.match(html, /article-content/);
  }
});

test("draftはトップ、記事一覧、検索、RSS、sitemapに含まれない", async () => {
  for (const path of ["/", "/articles", "/search", "/rss.xml", "/sitemap.xml"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const body = await response.text();
    assert.doesNotMatch(body, /draft-example|DRAFT_CONTENT_MUST_NOT_SHIP_7F3A9C/, path);
  }

  for (const path of ["/articles/draft-example", "/articles/preview/draft-example"]) {
    const response = await render(path);
    assert.equal(response.status, 404, path);
  }
});

test("published記事だけがRSSとsitemapに含まれる", async () => {
  const [rssResponse, sitemapResponse] = await Promise.all([
    render("/rss.xml"),
    render("/sitemap.xml"),
  ]);
  const [rss, sitemap] = await Promise.all([rssResponse.text(), sitemapResponse.text()]);
  assert.match(rss, /workout-log-2026-07-25/);
  assert.match(sitemap, /workout-log-2026-07-25/);
  assert.doesNotMatch(rss, /draft-example/);
  assert.doesNotMatch(sitemap, /draft-example/);
});
