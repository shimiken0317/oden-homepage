import Link from "next/link";
import { ArticleCard } from "./components/article-card";
import { OdenChan } from "./components/oden-chan";
import { categories, articles } from "./lib/articles";

export default function Home() {
  const latest = articles.slice(0, 4);
  const featured = articles.find((article) => article.featured) ?? articles[0];

  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Oden&apos;s small knowledge base</p>
          <h1>好きなことを、<br /><span>じっくり煮込む。</span></h1>
          <p className="hero-lead">筋トレ、投資、プログラミング、夫婦の日々。<br />おでんちゃんと一緒に、暮らしの知識をひとつずつ。</p>
          <div className="hero-actions">
            <Link className="button primary" href="/articles">記事を読みにいく <span>→</span></Link>
            <Link className="button ghost" href="/about">このサイトについて</Link>
          </div>
        </div>
        <div className="hero-mascot">
          <div className="speech">こんにちは！<br /><strong>今日は何を読む？</strong></div>
          <span className="spark one">✦</span><span className="spark two">✦</span>
          <OdenChan
            priority
            sizes="(max-width: 680px) 350px, 430px"
            label="手を振って迎える、妻が夫をイメージして描いたおでんちゃん"
          />
        </div>
      </section>

      <section className="quick-strip">
        <div className="shell quick-inner"><span>まずはここから</span><Link href={`/articles/${featured.slug}`}>{featured.title}</Link><span className="quick-meta">{featured.readingTime} min read　→</span></div>
      </section>

      <section className="section shell">
        <div className="section-head"><div><p className="kicker">Latest notes</p><h2>新しく煮えた記事</h2></div><Link href="/articles">すべての記事 <span>→</span></Link></div>
        <div className="article-grid">{latest.map((article, index) => <ArticleCard article={article} key={article.slug} index={index} />)}</div>
      </section>

      <section className="section shell category-section">
        <div className="section-head"><div><p className="kicker">Explore by topic</p><h2>今日は、どの具にする？</h2></div></div>
        <div className="category-grid">{categories.map((category, index) => (
          <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}>
            <span className={`category-mark tone-${index % 4}`}>{category.mark}</span>
            <span><strong>{category.name}</strong><small>{category.description}</small></span><span className="arrow">↗</span>
          </Link>
        ))}</div>
      </section>

      <section className="section shell">
        <div className="feature-panel">
          <div><p className="kicker">Recommended</p><h2>迷ったら、まずはこの一杯から。</h2><p>夫婦の失敗や遠回りも、あとから誰かの近道になる。今月のおでんちゃんおすすめ記事です。</p><Link className="text-link" href={`/articles/${featured.slug}`}>おすすめを読む →</Link></div>
          <div className="quote-card"><span>“</span><p>{featured.excerpt}</p><small>{featured.category} ・ {featured.readingTime}分で読めます</small></div>
        </div>
      </section>
    </>
  );
}
