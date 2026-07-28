# 二人での記事更新手順

記事は `content/posts` の中で、1記事につき1つのMDXファイルとして管理します。MDXは、先頭の基本情報（frontmatter）と、その下のMarkdown本文でできています。TypeScriptやReactを編集する必要はありません。

## A. 新しい記事を書く

1. `content/templates/article-template.mdx` をコピーし、`content/posts` に置きます。
2. ファイル名を英小文字・数字・ハイフンで決めます。例：`morning-running-log.mdx`
3. 先頭のfrontmatterを入力します。`slug` はファイル名から `.mdx` を除いた文字と同じにします。
4. 最初は必ず `status: "draft"` で保存します。
5. Markdownで本文を編集します。Codexが作った骨子に、本人の体験や言葉を加えて清書します。
6. `pnpm dev` を実行し、`http://localhost:3000/articles/preview/記事のslug` で下書きを確認します。通常の記事一覧にはdraftは出ません。
7. 公開準備ができたら `status: "published"` に変更し、`updatedAt` も確認します。
8. レビュー済みの変更をmainへ反映すると、Cloudflareの自動デプロイ後に公開されます。

カテゴリー名とslugの組み合わせは次のいずれかを使います。

| category | categorySlug |
| --- | --- |
| 筋トレ | training |
| ランニング | running |
| 投資 | investing |
| プログラミング | code |
| AI | ai |
| 日記 | diary |
| ガジェット | gadgets |
| 読書 | books |

## B. 既存記事を修正する

1. `content/posts` から対象のMDXを開きます。
2. 本文やfrontmatterを修正します。
3. `updatedAt` を修正日（`YYYY-MM-DD`）へ更新します。
4. commit・pushし、mainへ反映すると自動公開されます。公開済み記事の `slug` は変えません。

## C. 画像を追加する

記事固有の写真や図の場合：

1. `public/articles/記事slug/` フォルダーを作り、画像を置きます。
2. MDXでは `![画像の説明](/articles/記事slug/画像.webp)` のように参照します。
3. 大きすぎるPNGは避け、写真は適切な寸法へ縮小したWebPなどを推奨します。

おでんちゃんの挿絵の場合：

1. `pnpm illustration:list` または `content/illustrations/*.yaml` で承認済み素材を探します。
2. `status: "approved"` の素材だけを使います。
3. 台帳の `file` と `alt` を使い、`![代替テキスト](/characters/oden-chan/illustrations/画像.webp)` と書きます。
4. 適切な素材がなければ画像なしにし、不足素材を提案します。

画像のパスは安全のため `/articles/` または承認済みおでんちゃん素材フォルダーで始まるものだけが許可されています。説明文は読み上げにも使われるため、画像の内容が分かる言葉にします。詳しい承認手順は [illustration-workflow.md](illustration-workflow.md) を参照してください。

## D. やってはいけないこと

- 公開後のslugを不用意に変えない（URLが変わります）。
- 同じslugを複数の記事に使わない。
- frontmatterの必須項目を消さない。
- `.env` や `.env.local`、APIキーなどの秘密情報をcommitしない。
- mainへ下書きを直接pushしない。記事用ブランチでレビューします。
- MDXへHTML、JSX、JavaScript式を書かない。
- `.private` の原画・依頼書・承認待ち画像を記事から参照しない。
- 未承認画像を `public/` へコピーしない。

frontmatterに誤りがあると、ビルド時に対象ファイル名と原因が表示されます。エラーを無視せず、該当する項目を直してください。
