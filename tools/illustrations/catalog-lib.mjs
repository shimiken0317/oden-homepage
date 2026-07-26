import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { z } from "zod";

export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "実在する日付を入力してください");

const nonEmptyList = (name) =>
  z.array(z.string().trim().min(1, `${name}に空の値は使用できません`)).min(1, `${name}は1件以上必要です`);

export const illustrationSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "idは小文字英数字とハイフンで入力してください"),
    title: z.string().trim().min(1, "titleは必須です"),
    file: z
      .string()
      .trim()
      .regex(
        /^\/characters\/oden-chan\/illustrations\/[a-z0-9][a-z0-9-]*\.(?:webp|png|avif)$/i,
        "fileは承認済み素材フォルダー内のWebP、PNG、AVIFをルート相対パスで指定してください",
      ),
    status: z.enum(["approved", "deprecated"]),
    createdAt: isoDate,
    approvedAt: isoDate,
    source: z
      .object({
        type: z.enum([
          "wife-redraw",
          "generated-from-wife-original",
        ]),
      })
      .strict(),
    themes: nonEmptyList("themes"),
    emotions: nonEmptyList("emotions"),
    situations: nonEmptyList("situations"),
    tags: nonEmptyList("tags"),
    recommendedPlacements: nonEmptyList("recommendedPlacements"),
    alt: z.string().trim().min(1, "altは必須です"),
    notes: z.string().trim().min(1, "notesは必須です"),
  })
  .strict()
  .superRefine((asset, context) => {
    if (asset.approvedAt < asset.createdAt) {
      context.addIssue({
        code: "custom",
        path: ["approvedAt"],
        message: "approvedAtはcreatedAt以降の日付にしてください",
      });
    }
  });

function formatIssues(issues) {
  return issues
    .map((issue) => {
      const location = issue.path.length ? issue.path.join(".") : "metadata";
      const message =
        issue.code === "invalid_type" && issue.message.includes("received undefined")
          ? "必須項目です"
          : issue.message;
      return `${location}: ${message}`;
    })
    .join("; ");
}

function findFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...findFiles(entryPath, predicate));
    else if (entry.isFile() && predicate(entryPath)) files.push(entryPath);
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function publicUrlToFile(root, publicUrl) {
  const publicRoot = path.resolve(root, "public");
  const target = path.resolve(publicRoot, ...publicUrl.slice(1).split("/"));
  const relative = path.relative(publicRoot, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return undefined;
  return target;
}

function fileToPublicUrl(root, filename) {
  const relative = path.relative(path.resolve(root, "public"), filename);
  return `/${relative.split(path.sep).join("/")}`;
}

export function inspectCatalog({ root = projectRoot } = {}) {
  const catalogDirectory = path.resolve(root, "content/illustrations");
  const publicDirectory = path.resolve(root, "public/characters/oden-chan/illustrations");
  const yamlFiles = findFiles(catalogDirectory, (filename) => filename.endsWith(".yaml"));
  const publicImages = findFiles(publicDirectory, (filename) =>
    /\.(?:webp|png|avif)$/i.test(filename),
  );
  const errors = [];
  const assets = [];
  const sourceById = new Map();
  const referencedFiles = new Set();

  for (const yamlFile of yamlFiles) {
    const relativeSource = path.relative(root, yamlFile).split(path.sep).join("/");
    let data;
    try {
      const document = parseDocument(fs.readFileSync(yamlFile, "utf8"), { uniqueKeys: true });
      if (document.errors.length > 0) {
        throw new Error(document.errors.map((error) => error.message).join("; "));
      }
      data = document.toJS();
    } catch (error) {
      errors.push(`${relativeSource}: YAMLを解析できません: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    const result = illustrationSchema.safeParse(data);
    if (!result.success) {
      errors.push(`${relativeSource}: ${formatIssues(result.error.issues)}`);
      continue;
    }

    const asset = result.data;
    const expectedFilename = `${asset.id}.yaml`;
    if (path.basename(yamlFile) !== expectedFilename) {
      errors.push(`${relativeSource}: ファイル名はidに合わせて ${expectedFilename} にしてください`);
    }

    const previousSource = sourceById.get(asset.id);
    if (previousSource) {
      errors.push(`idが重複しています: "${asset.id}" (${previousSource}, ${relativeSource})`);
    } else {
      sourceById.set(asset.id, relativeSource);
    }

    if (JSON.stringify(asset).includes(".private")) {
      errors.push(`${relativeSource}: 非公開領域 .private の情報を公開台帳へ記載できません`);
    }

    const publicFile = publicUrlToFile(root, asset.file);
    if (!publicFile || !fs.existsSync(publicFile) || !fs.statSync(publicFile).isFile()) {
      errors.push(`${relativeSource}: 画像が存在しません: ${asset.file}`);
    } else {
      referencedFiles.add(path.resolve(publicFile));
    }

    assets.push({ ...asset, catalogFile: relativeSource });
  }

  for (const publicImage of publicImages) {
    if (!referencedFiles.has(path.resolve(publicImage))) {
      errors.push(
        `台帳に登録されていない公開画像があります: ${fileToPublicUrl(root, publicImage)}`,
      );
    }
  }

  return {
    assets: assets.sort((left, right) => left.id.localeCompare(right.id)),
    errors,
    yamlFiles,
    publicImages,
  };
}

export function assertValidCatalog(options) {
  const result = inspectCatalog(options);
  if (result.errors.length > 0) {
    throw new Error(`イラスト台帳の検証に失敗しました:\n- ${result.errors.join("\n- ")}`);
  }
  return result;
}
