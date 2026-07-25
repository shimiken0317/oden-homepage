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
7. lint、typecheck、test、buildを実行する
8. 問題がなければ記事用ブランチへcommit・pushする
9. mainへmergeまたはpushしない

記事メモ：
（ここに題材、実体験、数値、感じたこと、伝えたい相手などを書く）
```

Codexの骨子は完成原稿ではありません。プレビューを夫婦のどちらかが読み、本人の言葉へ清書してから `status: "published"` に変更します。
