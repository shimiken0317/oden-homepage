import Link from "next/link";
import type { Post, PostSummary } from "../lib/posts";
import { getMdxHeadings } from "../lib/mdx";
import { ArticleCard } from "./article-card";
import { Breadcrumbs } from "./breadcrumbs";
import { FavoriteButton } from "./favorite-button";
import { MdxContent } from "./mdx-content";

export function ArticlePageView({
  post,
  publishedPosts,
}: {
  post: Post;
  publishedPosts: PostSummary[];
}) {
  const index = publishedPosts.findIndex((item) => item.slug === post.slug);
  const related = publishedPosts
    .filter(
      (item) =>
        item.slug !== post.slug &&
        (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))),
    )
    .slice(0, 2);
  const next =
    publishedPosts.length > 0
      ? publishedPosts[(Math.max(index, 0) + 1) % publishedPosts.length]
      : undefined;
  const headings = getMdxHeadings(post.body);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "おでんのページ" },
    mainEntityOfPage: `/articles/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
      />
      <div className="shell article-layout">
        <article className="article-main">
          <Breadcrumbs
            items={[
              { label: post.category, href: `/categories/${post.categorySlug}` },
              { label: post.title },
            ]}
          />
          <header className="article-header">
            <Link className="category-pill" href={`/categories/${post.categorySlug}`}>
              {post.category}
            </Link>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-byline">
              <div className="avatar">{post.author.slice(0, 1)}</div>
              <span>
                <strong>{post.author}</strong>
                <small>
                  公開 {post.publishedAt} ・ 更新 {post.updatedAt} ・ {post.readingTime}分
                </small>
              </span>
              <FavoriteButton slug={post.slug} />
            </div>
          </header>

          <div className={`article-cover tone-${post.tone}`}>
            <span>{post.category === "AI" ? "AI" : post.category.slice(0, 1)}</span>
            <small>ODEN&apos;S NOTE / {post.publishedAt.slice(0, 4)}</small>
          </div>

          <div className="article-content">
            <MdxContent source={post.body} />
            <div className="share-row">
              <span>この記事をシェア</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                X
              </a>
              <button type="button">リンクをコピー</button>
            </div>
          </div>
        </article>

        <aside className="toc">
          <span>このページの目次</span>
          {headings.map((heading) => (
            <a className={heading.level === 3 ? "toc-sub" : undefined} href={`#${heading.id}`} key={heading.id}>
              {heading.text}
            </a>
          ))}
          <hr />
          <FavoriteButton slug={post.slug} />
        </aside>
      </div>

      <section className="shell section">
        {next ? (
          <div className="next-article">
            <span>次に煮えた記事</span>
            <Link href={`/articles/${next.slug}`}>
              {next.title}
              <b>→</b>
            </Link>
          </div>
        ) : null}
        {related.length > 0 ? (
          <>
            <div className="section-head">
              <div>
                <p className="kicker">Related notes</p>
                <h2>あわせて読みたい</h2>
              </div>
            </div>
            <div className="article-grid related">
              {related.map((item, relatedIndex) => (
                <ArticleCard article={item} index={relatedIndex} key={item.slug} />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
