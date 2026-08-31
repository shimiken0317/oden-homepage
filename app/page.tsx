import Link from "next/link";
import { OdenChan } from "./components/oden-chan";
import { getAllCategories, getPublishedPosts } from "./lib/posts";

export default function Home() {
  const articles = getPublishedPosts();
  const categories = getAllCategories();
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const sideNotes = articles.filter((article) => article.slug !== featured.slug).slice(0, 2);
  const fieldNotes = articles.filter((article) => article.slug !== featured.slug && !sideNotes.some((note) => note.slug === article.slug)).slice(0, 4);

  return <div className="essay-home">
    <section className="essay-opening shell">
      <div className="essay-masthead"><p>おでんのページ　第一号</p><p>暮らしの途中で拾った、小さな学びの記録</p></div>
      <div className="essay-hero-grid">
        <div className="essay-hero-copy">
          <p className="essay-kicker">ふたりの知識庫</p>
          <h1>好きなことを、<br/><em>じっくり煮込む。</em></h1>
          <p className="essay-intro">筋トレ、投資、プログラミング、そして二人の日々。うまくいったことだけでなく、遠回りした時間も、あとから読める言葉にして残します。</p>
          <div className="essay-hero-links"><Link href="/articles">すべての記事を見る</Link><Link href="/about">この場所について</Link></div>
        </div>
        <div className="essay-hero-art">
          <span className="essay-pencil-note">今日は、どこから読もう。</span><div className="essay-sun" aria-hidden="true"/>
          <OdenChan priority sizes="(max-width: 680px) 310px, 430px" label="手を振って学びを案内する、彼女が彼氏をイメージして描いたおでんちゃん"/>
          <p className="essay-caption">案内役：おでんちゃん</p>
        </div>
      </div>
    </section>

    <section className="essay-stories shell" aria-labelledby="latest-heading">
      <header className="essay-section-title"><span>01</span><div><p>今、読んでほしいもの</p><h2 id="latest-heading">新しく煮えた記事</h2></div></header>
      <div className="essay-story-layout">
        <article className="essay-lead-story">
          <Link className={`essay-lead-visual tone-${featured.tone}`} href={`/articles/${featured.slug}`}><span>FEATURED NOTE</span><strong>{featured.category === "AI" ? "AI" : featured.category.slice(0, 1)}</strong><i aria-hidden="true"/></Link>
          <div className="essay-lead-copy"><p>{featured.category}　／　{featured.publishedAt.replaceAll("-", ".")}</p><h3><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h3><p>{featured.excerpt}</p><Link className="essay-read-link" href={`/articles/${featured.slug}`}>続きを読む <span>↗</span></Link></div>
        </article>
        <aside className="essay-side-stories" aria-label="新着記事">{sideNotes.map((article,index)=><article className="essay-side-story" key={article.slug}><div><span>0{index+2}</span><span>{article.category}</span></div><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><Link href={`/articles/${article.slug}`}>記事へ　→</Link></article>)}</aside>
      </div>
    </section>

    <section className="essay-field-section"><div className="shell">
      <header className="essay-section-title light"><span>02</span><div><p>日々の断片</p><h2>小さなフィールドノート</h2></div></header>
      <div className="essay-field-grid">{fieldNotes.map((article,index)=><article className="essay-field-note" key={article.slug}><p><span>NO. {String(index+1).padStart(2,"0")}</span><span>{article.readingTime}分</span></p><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><small>{article.category}　{article.publishedAt.replaceAll("-", ".")}</small></article>)}</div>
    </div></section>

    <section className="essay-index shell" aria-labelledby="topic-heading">
      <header className="essay-section-title"><span>03</span><div><p>記録の棚</p><h2 id="topic-heading">今日は、どの具にする？</h2></div></header>
      <div className="essay-topic-list">{categories.map((category,index)=><Link href={`/categories/${category.slug}`} key={category.slug}><span>{String(index+1).padStart(2,"0")}</span><strong>{category.name}</strong><small>{category.description}</small><i>↗</i></Link>)}</div>
      <div className="essay-closing-note"><p>うまくいかない日も、<br/>じっくり煮込めば味になる。</p><Link href="/about">二人とおでんちゃんの話　→</Link></div>
    </section>
  </div>;
}
