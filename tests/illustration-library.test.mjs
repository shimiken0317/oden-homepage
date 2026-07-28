import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectCatalog, projectRoot } from "../tools/illustrations/catalog-lib.mjs";

function makeRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "oden-illustrations-"));
  fs.mkdirSync(path.join(root, "content/illustrations"), { recursive: true });
  fs.mkdirSync(path.join(root, "public/characters/oden-chan/illustrations"), {
    recursive: true,
  });
  t.after(() => fs.rmSync(root, { force: true, recursive: true }));
  return root;
}

function validYaml({ id = "training-effort", file = `${id}.webp`, omit = "" } = {}) {
  const fields = {
    id: `id: "${id}"`,
    title: 'title: "一生懸命トレーニングするおでんちゃん"',
    file: `file: "/characters/oden-chan/illustrations/${file}"`,
    status: 'status: "approved"',
    createdAt: 'createdAt: "2026-07-26"',
    approvedAt: 'approvedAt: "2026-07-26"',
    source: 'source:\n  type: "generated-from-partner-original"',
    themes: 'themes:\n  - "筋トレ"',
    emotions: 'emotions:\n  - "一生懸命"',
    situations: 'situations:\n  - "トレーニング中"',
    tags: 'tags:\n  - "ダンベル"',
    recommendedPlacements: 'recommendedPlacements:\n  - "筋トレ記事の見出し後"',
    alt: 'alt: "ダンベルを持って一生懸命トレーニングするおでんちゃん"',
    notes: 'notes: "二人で公開承認済み。"',
  };
  return Object.entries(fields)
    .filter(([name]) => name !== omit)
    .map(([, value]) => value)
    .join("\n");
}

test(".private全体がGit対象外で、追跡済みファイルもない", () => {
  execFileSync("git", ["check-ignore", "-q", ".private/illustration-inbox/example.png"], {
    cwd: projectRoot,
  });
  const tracked = execFileSync("git", ["ls-files", ".private"], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  assert.equal(tracked.trim(), "");
});

test("現在の承認済み台帳と公開素材ライブラリを検証できる", () => {
  const result = inspectCatalog();
  assert.deepEqual(result.errors, []);
  assert.ok(result.assets.some((asset) => asset.id === "happy-oden-chan"));
  assert.equal(result.assets.every((asset) => asset.status === "approved"), true);
  assert.equal(result.publicImages.length, result.assets.length);
});

test("正常な承認済み素材を読み込める", (t) => {
  const root = makeRoot(t);
  fs.writeFileSync(
    path.join(root, "content/illustrations/training-effort.yaml"),
    validYaml(),
  );
  fs.writeFileSync(
    path.join(root, "public/characters/oden-chan/illustrations/training-effort.webp"),
    "test-image",
  );

  const result = inspectCatalog({ root });
  assert.deepEqual(result.errors, []);
  assert.equal(result.assets[0]?.status, "approved");
});

test("id重複と必須項目不足を検出する", (t) => {
  const root = makeRoot(t);
  fs.writeFileSync(
    path.join(root, "content/illustrations/training-effort.yaml"),
    validYaml(),
  );
  fs.writeFileSync(
    path.join(root, "content/illustrations/duplicate.yaml"),
    validYaml(),
  );
  fs.writeFileSync(
    path.join(root, "content/illustrations/missing-alt.yaml"),
    validYaml({ id: "missing-alt", omit: "alt" }),
  );
  fs.writeFileSync(
    path.join(root, "public/characters/oden-chan/illustrations/training-effort.webp"),
    "test-image",
  );
  fs.writeFileSync(
    path.join(root, "public/characters/oden-chan/illustrations/missing-alt.webp"),
    "test-image",
  );

  const { errors } = inspectCatalog({ root });
  assert.match(errors.join("\n"), /idが重複しています/);
  assert.match(errors.join("\n"), /alt.*必須/);
});

test("存在しない台帳画像と未登録の公開画像を検出する", (t) => {
  const root = makeRoot(t);
  fs.writeFileSync(
    path.join(root, "content/illustrations/training-effort.yaml"),
    validYaml(),
  );
  fs.writeFileSync(
    path.join(root, "public/characters/oden-chan/illustrations/unapproved.webp"),
    "test-image",
  );

  const { errors } = inspectCatalog({ root });
  assert.match(errors.join("\n"), /画像が存在しません/);
  assert.match(errors.join("\n"), /台帳に登録されていない公開画像/);
});
