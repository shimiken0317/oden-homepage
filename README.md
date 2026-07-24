# おでんのページ

「かわいいキャラクターと一緒に学ぶ」を、静かで読みやすいUIに落とし込んだ個人メディアです。Next.js App Router互換、React、TypeScript、Tailwind CSSで構成し、VercelまたはSitesへそのまま展開できます。

## サイト構成

- `/`：ヒーロー、最新記事、おすすめ、カテゴリー
- `/articles`、`/articles/[slug]`：一覧と記事本文
- `/categories`、`/categories/[slug]`：分類・絞り込み
- `/search`：タイトル・概要・カテゴリー・タグの即時全文検索
- `/about`、`/projects`、`/contact`、`not-found`
- `/rss.xml`、`/sitemap.xml`、`/robots.txt`

## ディレクトリ

```text
app/
  components/        共通UI（ヘッダー、カード、パンくず、お気に入り）
  lib/articles.ts    型付きコンテンツ索引（MDX導入時の境界）
  articles/          記事一覧・詳細
  categories/        カテゴリー一覧・詳細
  search/            クライアント検索
  about|projects|contact/
  rss.xml/           RSS Route Handler
  layout.tsx         共通メタデータとサイトシェル
  globals.css        デザイントークンとレスポンシブUI
public/characters/   おでんちゃんの原画素材
```

## 技術選定

- App Router + Server Components：記事本文を軽く配信し、検索やお気に入りだけをクライアント化。
- TypeScript：記事メタデータとUI境界を型で固定。
- Tailwind CSS 4：ビルド基盤を利用しつつ、ブランドトークンはCSS変数で一元管理。
- MDX移行境界：現在のサンプルは `app/lib/articles.ts`。本番運用では `content/posts/*.mdx` を Velite、Content Collections、または `next-mdx-remote` で同じ `Article` 型へ正規化する。
- 検索：現状は小規模向けインメモリ検索。数百〜数千記事では Pagefind（静的・低コスト）を第一候補、表記ゆれが重要ならOramaを採用。
- CMS：Git + MDXを標準運用にし、非エンジニア編集が必要になった時だけGitベースのTinaCMSまたはCloudCannonを追加。

## UI / デザインガイド

- 背景 `#fbfaf6`、本文 `#272522`、卵色 `#f2c96b`、こんにゃく灰 `#777875`。
- 本文は Noto Sans JP、見出しは Zen Maru Gothic。本文幅は760px、行間2.0前後。
- 8px基準の余白、角丸12〜24px、境界線中心。影はホバーと吹き出しだけ。
- おでんちゃんは妻が夫をイメージして描いた、サイトのブランドの中心。歓迎、記事案内、空状態、404で自然に登場する。
- AIによる再解釈ではなく原画を直接使用し、手描きの線・素朴な色・不器用ながら一生懸命な雰囲気を守る。
- ダークモード、キーボードフォーカス、`prefers-reduced-motion`、モバイルナビ対応。

## ワイヤーフレーム

```text
TOP:     Header → Hero(copy | mascot) → Pick up → Latest 4 → Categories → Recommended → Footer
ARTICLE: Breadcrumb → Title/meta → Cover → Content ← sticky TOC → Next → Related
SEARCH:  Breadcrumb → Search input → Result count → Cards / mascot empty state
```

## 主なコンポーネント

`SiteHeader`、`SiteFooter`、`ArticleCard`、`Breadcrumbs`、`FavoriteButton`、`SearchClient`。お気に入りとテーマはブラウザ内だけに保存し、アカウントやサーバー費用を不要にしています。

## 記事運用ロードマップ

1. MDXローダーとZodスキーマを追加し、`content/posts` から `Article` を生成。
2. Pagefindのビルド後インデックスとタグ複合フィルターを追加。
3. OGP画像の自動生成、人気記事をVercel Analyticsの集計へ接続。
4. 必要になった時点でGitベースCMS、コメント、ニュースレターを段階導入。

ローカル起動は `npm run dev`、本番確認は `npm run build` です。公開URLを使う場合は `NEXT_PUBLIC_SITE_URL` を設定してください。

## Cloudflare Workers deployment

- Cloudflare Workers Builds uses `pnpm run build` and `pnpm run deploy`.
- Set `NEXT_PUBLIC_SITE_URL` to the final production origin in the Cloudflare
  build environment. Do not commit the real production URL to the repository.
- The Worker uses the `ASSETS` static-assets binding and the `IMAGES` binding.
- Cloudflare Images transformations may incur usage charges. Review the current
  Cloudflare Images pricing and account limits before enabling production
  traffic.
