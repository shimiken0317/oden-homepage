import fs from "node:fs";
import path from "node:path";
import { projectRoot } from "./catalog-lib.mjs";

const allowedOptions = new Set(["source", "id", "title", "description"]);

function parseOptions(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`不明な引数です: ${token}`);
    const [name, inlineValue] = token.slice(2).split("=", 2);
    if (!allowedOptions.has(name)) throw new Error(`不明なオプションです: --${name}`);
    const value = inlineValue ?? argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`--${name} の値が必要です`);
    options[name] = value;
    if (inlineValue === undefined) index += 1;
  }
  return options;
}

function requireSingleLine(value, name) {
  if (!value?.trim()) throw new Error(`--${name} は必須です`);
  if (/[\r\n]/.test(value)) throw new Error(`--${name} は1行で入力してください`);
  return value.trim();
}

function localDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

try {
  const options = parseOptions(process.argv.slice(2));
  const source = requireSingleLine(options.source, "source");
  const id = requireSingleLine(options.id, "id");
  const title = requireSingleLine(options.title, "title");
  const description = options.description
    ? requireSingleLine(options.description, "description")
    : title;

  if (path.basename(source) !== source || source === "." || source === "..") {
    throw new Error("--sourceにはillustration-inbox内のファイル名だけを指定してください");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error("--idは小文字英数字とハイフンで入力してください");
  }

  const inboxDirectory = path.resolve(projectRoot, ".private/illustration-inbox");
  const requestsDirectory = path.resolve(projectRoot, ".private/illustration-requests");
  const reviewDirectory = path.resolve(projectRoot, ".private/illustration-review");
  const sourceFile = path.resolve(inboxDirectory, source);
  const requestFile = path.resolve(requestsDirectory, `${id}.md`);

  for (const directory of [inboxDirectory, requestsDirectory, reviewDirectory]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) {
    throw new Error(`原画が見つかりません: .private/illustration-inbox/${source}`);
  }
  if (fs.existsSync(requestFile)) {
    throw new Error(`依頼書は既に存在します。上書きしません: .private/illustration-requests/${id}.md`);
  }

  const request = `# おでんちゃん イラスト生成依頼書

## 基本情報

- 依頼ID: ${id}
- 作成日: ${localDate()}
- タイトル: ${title}
- 説明: ${description}
- 非公開原画: \`.private/illustration-inbox/${source}\`
- スタイルガイド: \`docs/character-style-guide.md\`
- 生成依頼テンプレート: \`docs/illustration-generation-prompt.md\`

## 最優先指示

- 彼女が彼氏をイメージして描いた原画を最優先する。
- おでんちゃんを一般的なマスコットとして再解釈しない。
- 構図、人数、表情、動作、具の順番、小物を勝手に変更しない。
- 手描き感、素朴さ、柔らかい色、一生懸命な雰囲気を残す。
- 判断できない点は推測せず、下の確認事項へ記載する。

## 人間が記入する指定

- 人数: TODO
- 構図: TODO（原画どおり／変更点を具体的に記載）
- 表情: TODO
- 動作: TODO
- 小物: TODO
- 記事テーマ: TODO
- 想定配置: TODO
- 画像比率: TODO

## 確認事項

- [ ] TODO: 原画から判断できない箇所を列挙する
- [ ] TODO: 彼女の回答を記録する
- [ ] TODO: 外部サービスへ原画を渡してよいか二人で確認する

## 出力仕様

- 背景透過PNG
- sRGB
- Web記事向け
- 縮小表示しても表情が読める
- 画像端でキャラクターや小物を切らない
- 不要な文字、ロゴ、署名、透かしを追加しない
- 出力先: \`.private/illustration-review/${id}-candidate-01.png\`

## 承認状態

**未承認。生成結果を公開用素材として扱わないこと。**

- [ ] 彼女が確認した
- [ ] 彼氏が確認した
- [ ] スタイルガイドの承認チェックリストを満たした
- [ ] 公開用素材への登録を二人とも承認した
`;

  fs.writeFileSync(requestFile, request, { encoding: "utf8", flag: "wx" });
  console.log(`依頼書を作成しました: .private/illustration-requests/${id}.md`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
