import Link from "next/link";
import type { Article } from "../lib/articles";
import { ArticleCard } from "./article-card";
import { Breadcrumbs } from "./breadcrumbs";
import { FavoriteButton } from "./favorite-button";
import { OdenChan } from "./oden-chan";

type WorkoutLogArticleProps = {
  article: Article;
  next: Article;
  related: Article[];
};

export function WorkoutLogArticle({ article, next, related }: WorkoutLogArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: "おでん" },
    publisher: { "@type": "Organization", name: "おでんのページ" },
    mainEntityOfPage: `/articles/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell article-layout">
        <article className="article-main">
          <Breadcrumbs
            items={[
              { label: article.category, href: `/categories/${article.categorySlug}` },
              { label: article.title },
            ]}
          />
          <header className="article-header">
            <Link className="category-pill" href={`/categories/${article.categorySlug}`}>
              {article.category}
            </Link>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="article-byline">
              <div className="avatar">お</div>
              <span>
                <strong>おでん</strong>
                <small>
                  公開 {article.publishedAt} ・ 更新 {article.updatedAt} ・ {article.readingTime}分
                </small>
              </span>
              <FavoriteButton slug={article.slug} />
            </div>
          </header>

          <div className={`article-cover tone-${article.tone}`}>
            <span>筋</span>
            <small>ODEN&apos;S NOTE / {article.publishedAt.slice(0, 4)}</small>
          </div>

          <div className="article-content">
            <p className="lead">
              今日は全体的に身体が重く、最初から軽快さはありませんでした。それでも、予定していたセットを最後までやり切れた日の記録です。
            </p>

            <h2 id="menu">今日のメニュー</h2>
            <ol>
              <li>
                <strong>スクワット</strong>
                <p>100kg・5回 × 2セット</p>
              </li>
              <li>
                <strong>ハーフデッドリフト</strong>
                <p>110kg・5回 × 2セット</p>
              </li>
              <li>
                <strong>懸垂</strong>
                <p>自重・5回 × 3セット</p>
              </li>
            </ol>

            <h2 id="feeling">身体が重い中でも粘れた</h2>
            <p>
              ウォームアップの段階から身体の重さを感じました。動きが気持ちよくはまる日ではありませんでしたが、一本ずつ集中して、最後のセットまで粘れたのはよかったです。
            </p>
            <div className="oden-note">
              <OdenChan label="筋トレの記録を一緒に振り返るおでんちゃん" />
              <p>
                <strong>おでんちゃんのひとこと</strong>
                重い日にも積み上げた2セットと3セットは、ちゃんと次につながるよ。
              </p>
            </div>

            <h2 id="squat">スクワット110kgはまだ厳しい</h2>
            <p>
              100kgは5回を2セットまとめられました。ただ、次の110kgはまだ安定して扱える感覚ではありません。焦って重量を上げるより、まずは100kgでフォームと深さをそろえ、余裕を少しずつ増やしていきます。
            </p>

            <blockquote>
              調子がよくない日でも、最後までやり切れたことを今日の成果にする。
            </blockquote>

            <h2 id="next">次回へ</h2>
            <p>
              110kgを急がず、100kgを確実に積み重ねます。身体が重い日の感覚も記録に残し、次回のコンディションやアップの組み方と比べていきます。
            </p>

            <div className="share-row">
              <span>この記事をシェア</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
              <button>リンクをコピー</button>
            </div>
          </div>
        </article>

        <aside className="toc">
          <span>このページの目次</span>
          <a href="#menu">今日のメニュー</a>
          <a href="#feeling">身体が重い中でも粘れた</a>
          <a href="#squat">スクワット110kg</a>
          <a href="#next">次回へ</a>
          <hr />
          <FavoriteButton slug={article.slug} />
        </aside>
      </div>

      <section className="shell section">
        <div className="next-article">
          <span>次に煮えた記事</span>
          <Link href={`/articles/${next.slug}`}>
            {next.title}
            <b>→</b>
          </Link>
        </div>
        {related.length > 0 && (
          <>
            <div className="section-head">
              <div>
                <p className="kicker">Related notes</p>
                <h2>あわせて読みたい</h2>
              </div>
            </div>
            <div className="article-grid related">
              {related.map((item, index) => (
                <ArticleCard article={item} index={index} key={item.slug} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
