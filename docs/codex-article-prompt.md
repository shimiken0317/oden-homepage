# Codex向け記事作成プロンプト

以下をCodexへ渡し、記事ごとの具体的なメモを末尾に追加して使います。

```text
C:\oden_homepage に「おでんのページ」の新しい記事を追加してください。

1. mainを直接変更せず、codex/article-＜slug＞という記事用ブランチを作る
2. content/templates/article-template.mdxを参考に、content/posts/＜slug＞.mdxを1ファイルだけ作る
3. frontmatterのstatusは必ずdraftにする
4. 私が伝えた実体験・数値・感想だけを使い、体験や事実を勝手に創作しない
5. 根拠や本人確認が必要な箇所は「TODO: 確認内容」と明記する
6. 既存のslug、URL、デザイン、コードには不要な変更を加えない
7. 下記の「イラスト選定ルール」に従い、必要な場合だけ承認済み素材を選ぶ
8. lint、typecheck、test、buildを実行する
9. 問題がなければ記事用ブランチへcommit・pushする
10. mainへmergeまたはpushしない

記事メモ：
（ここに題材、実体験、数値、感じたこと、伝えたい相手などを書く）
```

Codexの骨子は完成原稿ではありません。プレビューを二人のどちらかが読み、本人の言葉へ清書してから `status: "published"` に変更します。

## イラスト選定ルール

記事下書きを作るときは、次の順番を守ります。

1. `content/illustrations/*.yaml` または `pnpm illustration:list` で素材台帳を検索する。
2. `status: "approved"` の素材だけを候補にする。deprecated、原画、生成依頼書、承認待ち画像は使わない。
3. 記事全体のテーマだけでなく、挿入先の見出し、そこで表したい感情・状況と、台帳の `themes`、`emotions`、`situations`、`tags`、`recommendedPlacements` を照合する。
4. 挿絵は1記事につき最大3枚。同じ画像を1記事内で繰り返さない。
5. 文章の理解や雰囲気に役立つ場合だけ挿入し、装飾目的で無理に使わない。
6. 適切な素材がなければ画像なしにする。似ているだけの素材を代用しない。
7. 台帳にないIDや、存在しない画像パスを作らない。
8. MDXでは台帳の `file` と `alt` を使い、次の標準Markdown記法だけで挿入する。

```md
![台帳に登録された代替テキスト](/characters/oden-chan/illustrations/approved-file.webp)
```

9. JSX、import、JavaScript式を追加しない。
10. 適切な素材がなかった場合は、記事本文とは別に「不足素材案」として、必要なテーマ・表情・状況・想定配置を最後に提案する。原画や画像を自動生成・公開しない。
