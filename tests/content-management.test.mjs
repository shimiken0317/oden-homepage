import assert from "node:assert/strict";
import test from "node:test";
import {
  parsePostSource,
  selectPublishedPosts,
  validatePostSources,
} from "../app/lib/post-loader.mjs";

function source(overrides = {}) {
  const values = {
    title: "テスト記事",
    slug: "test-post",
    excerpt: "テスト記事の概要です。",
    category: "筋トレ",
    categorySlug: "training",
    tags: ["テスト"],
    publishedAt: "2026-07-26",
    updatedAt: "2026-07-26",
    status: "published",
    featured: false,
    author: "おでんちゃん",
    ...overrides,
  };

  return `---
title: "${values.title}"
slug: "${values.slug}"
excerpt: "${values.excerpt}"
category: "${values.category}"
categorySlug: "${values.categorySlug}"
tags:
${values.tags.map((tag) => `  - "${tag}"`).join("\n")}
publishedAt: "${values.publishedAt}"
updatedAt: "${values.updatedAt}"
status: "${values.status}"
featured: ${values.featured}
author: "${values.author}"
---

## 見出し

正常な本文です。`;
}

test("正常なMDX記事とfrontmatterを読み込める", () => {
  const post = parsePostSource("/content/posts/test-post.mdx", source());
  assert.equal(post.slug, "test-post");
  assert.equal(post.status, "published");
  assert.match(post.body, /正常な本文/);
  assert.ok(post.readingTime >= 1);
});

test("公開一覧にはpublishedだけが含まれdraftは含まれない", () => {
  const posts = validatePostSources({
    "/content/posts/test-post.mdx": source(),
    "/content/posts/draft-post.mdx": source({ slug: "draft-post", status: "draft" }),
  });
  const published = selectPublishedPosts(posts);
  assert.deepEqual(published.map((post) => post.slug), ["test-post"]);
});

test("slugの重複をファイル名付きで検出する", () => {
  assert.throws(
    () =>
      validatePostSources({
        "/content/posts/test-post.mdx": source(),
        "/content/posts/nested/test-post.mdx": source(),
      }),
    /slugが重複しています.*test-post\.mdx/s,
  );
});

test("必須frontmatter不足をファイル名と原因付きで検出する", () => {
  const invalid = source().replace('author: "おでんちゃん"\n', "");
  assert.throws(
    () => parsePostSource("/content/posts/test-post.mdx", invalid),
    /\[\/content\/posts\/test-post\.mdx].*author/s,
  );
});
