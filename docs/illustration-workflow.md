# おでんちゃん イラスト制作・承認・再利用フロー

原画、生成依頼、承認待ち画像と、公開済み素材を明確に分離するための手順です。画像生成そのものはこのリポジトリのツールでは行いません。

## 保存場所

```text
.private/
├─ illustration-inbox/       妻の非公開原画
├─ illustration-requests/    画像生成依頼書
└─ illustration-review/      生成後の承認待ち画像

content/illustrations/        承認済み素材のYAML台帳
public/characters/oden-chan/illustrations/
                              承認済みの公開画像だけ
```

`.private/` 全体は `.gitignore` で除外されています。原画、依頼途中のファイル、承認待ち画像はcommit・push・Cloudflare deployの対象になりません。

## 1. 原画を受け取る

1. 妻の原画を `.private/illustration-inbox/` に保存します。
2. ファイル名には人名、メールアドレス、撮影場所などの個人情報を入れません。
3. 元ファイルは加工・上書きせず保存します。向き修正やトリミングが必要なら別ファイルにします。
4. 外部の画像生成サービスへ渡す前に、利用規約と原画の取り扱いを夫婦で確認します。

## 2. 生成依頼書を作る

```powershell
pnpm illustration:create-request `
  --source "2026-07-26-training.jpg" `
  --id "training-not-going-well" `
  --title "筋トレが思うようにいかず悩むおでんちゃん"
```

必要なら `--description "補足説明"` も指定できます。

ツールは次を確認します。

- 指定原画が `.private/illustration-inbox/` に実在すること。
- `id` が英小文字・数字・ハイフンだけであること。
- 同じIDの依頼書を上書きしないこと。

作成先は `.private/illustration-requests/<id>.md` です。確認事項を夫婦で埋めてから、[illustration-generation-prompt.md](illustration-generation-prompt.md) と一緒に人間が画像生成サービスへ渡します。

## 3. 生成候補を確認する

1. 生成候補は `.private/illustration-review/` にだけ保存します。
2. ファイル名は `<id>-candidate-01.png` のように候補番号を付けます。
3. [character-style-guide.md](character-style-guide.md) の承認チェックリストを夫婦で確認します。
4. 一方でも違和感がある場合は未承認のままにし、修正点を依頼書へ追記します。
5. 承認前に候補を `public/` や記事へコピーしません。

## 4. 承認済み素材を登録する

登録は自動化していません。人間が承認を確認した後だけ、次を手作業で行います。

1. 承認画像をWeb用に書き出します。WebPを第一候補とし、必要ならPNGを使います。
2. `public/characters/oden-chan/illustrations/<id>.webp` にコピーします。
3. `content/illustrations/illustration-template.yaml.example` をコピーします。
4. `content/illustrations/<id>.yaml` として、実際の情報を入力します。
5. `file` を `/characters/oden-chan/illustrations/<id>.webp` にします。
6. `status: "approved"`、承認日、alt、用途、タグを入力します。
7. `pnpm illustration:validate` を実行します。
8. 夫婦の最終確認後、公開画像とYAMLを同じcommitへ含めます。

承認取り消しや置き換えが必要になった場合に備え、台帳は `status: "deprecated"` も受け付けます。deprecated素材は記事用候補一覧へ表示されません。既存記事から外したことを確認してから画像削除を検討します。

### 台帳仕様

各 `content/illustrations/<id>.yaml` は次の項目を持ちます。

| 項目 | 内容 |
| --- | --- |
| `id` | 英小文字・数字・ハイフンの一意な素材ID。YAMLファイル名と一致させる |
| `title` | 人間が見て分かる素材名 |
| `file` | `/characters/oden-chan/illustrations/` 以下の実在する公開画像 |
| `status` | 使用可能な `approved`、または使用停止中の `deprecated` |
| `createdAt` | 制作日。`YYYY-MM-DD` |
| `approvedAt` | 夫婦の承認日。`YYYY-MM-DD` |
| `source.type` | `generated-from-wife-original` または、妻が公開用に描き直した `wife-redraw` |
| `themes` | 記事全体の題材 |
| `emotions` | おでんちゃんが表している感情 |
| `situations` | 描かれている具体的な状況 |
| `tags` | 小物、動作、補助的な検索語 |
| `recommendedPlacements` | 記事冒頭、特定見出し後、空状態などの推奨位置 |
| `alt` | 画像の内容を説明する代替テキスト |
| `notes` | 承認範囲、注意事項、使い分け |

すべて必須です。配列項目も最低1件を入力します。原画そのものを示すsource typeは用意していません。非公開の生原画を公開台帳へ登録しないためです。

## 5. 素材を探す

承認済み素材をすべて表示：

```powershell
pnpm illustration:list
```

テーマなどで絞り込み：

```powershell
pnpm illustration:list --theme "筋トレ" --emotion "困っている"
pnpm illustration:list --tag "ダンベル"
pnpm illustration:list --placement "記事冒頭"
```

一致する素材がない場合、ツールは0件と表示します。存在しないパスを作ったり、近そうな画像を無理に選んだりしません。

## 6. MDX記事へ挿入する

標準のMarkdown画像記法を使います。

```md
![ダンベルを持って一生懸命トレーニングするおでんちゃん](/characters/oden-chan/illustrations/training-effort.webp)
```

- altは台帳の `alt` と一致させます。
- 台帳が `approved` の素材だけを使います。
- JSX、import、JavaScript式は使用しません。
- 1記事3枚まで。同じ画像を1記事内で繰り返しません。
- 適切な素材がなければ画像なしにします。

## 7. 定期確認

`pnpm illustration:validate` は次をエラーとして検出します。

- YAMLの必須項目不足、日付・status・パスの不正。
- id重複。
- 台帳にあるが存在しない画像。
- 台帳へ登録されていない公開画像。
- `.private` のパスや情報が台帳へ混入した状態。

Gitへ追加する前に、`git status --ignored --short .private` で非公開領域が無視されていることも確認します。
