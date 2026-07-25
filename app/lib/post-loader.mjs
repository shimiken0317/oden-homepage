import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const categoryPairs = {
  training: "筋トレ",
  running: "ランニング",
  investing: "投資",
  code: "プログラミング",
  ai: "AI",
  diary: "日記",
  gadgets: "ガジェット",
  books: "読書",
};

const isoDateSchema = z
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

export const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "titleは必須です"),
    slug: z
      .string()
      .trim()
      .min(1, "slugは必須です")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugは小文字英数字とハイフンで入力してください"),
    excerpt: z.string().trim().min(1, "excerptは必須です"),
    category: z.enum(Object.values(categoryPairs), {
      error: "定義済みのカテゴリー名を入力してください",
    }),
    categorySlug: z.enum(Object.keys(categoryPairs), {
      error: "定義済みのcategorySlugを入力してください",
    }),
    tags: z.array(z.string().trim().min(1, "空のタグは使用できません")).min(1, "tagsは1件以上必要です"),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema,
    status: z.enum(["draft", "published"]),
    featured: z.boolean(),
    author: z.string().trim().min(1, "authorは必須です"),
    readingTime: z.number().int().positive().optional(),
  })
  .strict()
  .superRefine((data, context) => {
    if (categoryPairs[data.categorySlug] !== data.category) {
      context.addIssue({
        code: "custom",
        path: ["category"],
        message: `categorySlug "${data.categorySlug}" に対応するカテゴリーは "${categoryPairs[data.categorySlug]}" です`,
      });
    }
    if (data.updatedAt < data.publishedAt) {
      context.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "updatedAtはpublishedAt以降の日付にしてください",
      });
    }
  });

function formatValidationIssues(issues) {
  return issues
    .map((issue) => {
      const location = issue.path.length > 0 ? issue.path.join(".") : "frontmatter";
      return `${location}: ${issue.message}`;
    })
    .join("; ");
}

function getTone(categorySlug) {
  const tones = {
    training: 0,
    running: 2,
    investing: 2,
    code: 1,
    ai: 1,
    diary: 3,
    gadgets: 3,
    books: 3,
  };
  return tones[categorySlug] ?? 0;
}

function estimateReadingTime(body) {
  const readableText = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, "");
  return Math.max(1, Math.ceil(readableText.length / 500));
}

export function parsePostSource(sourcePath, source) {
  let parsed;
  try {
    parsed = matter(source);
  } catch (error) {
    throw new Error(
      `[${sourcePath}] frontmatterを解析できません: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const result = postFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new Error(`[${sourcePath}] frontmatterが不正です: ${formatValidationIssues(result.error.issues)}`);
  }

  const filenameSlug = path.posix.basename(sourcePath.replaceAll("\\", "/"), ".mdx");
  if (filenameSlug !== result.data.slug) {
    throw new Error(
      `[${sourcePath}] ファイル名とslugが一致しません: ファイル名=${filenameSlug}, slug=${result.data.slug}`,
    );
  }

  const body = parsed.content.trim();
  if (!body) {
    throw new Error(`[${sourcePath}] 本文が空です`);
  }

  return {
    ...result.data,
    body,
    sourcePath,
    readingTime: result.data.readingTime ?? estimateReadingTime(body),
    tone: getTone(result.data.categorySlug),
  };
}

export function validatePostSources(sources) {
  const posts = Object.entries(sources)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([sourcePath, source]) => parsePostSource(sourcePath, source));

  const pathsBySlug = new Map();
  for (const post of posts) {
    const existingPath = pathsBySlug.get(post.slug);
    if (existingPath) {
      throw new Error(
        `slugが重複しています: "${post.slug}" (${existingPath}, ${post.sourcePath})`,
      );
    }
    pathsBySlug.set(post.slug, post.sourcePath);
  }

  return posts.sort((left, right) => {
    const byDate = right.publishedAt.localeCompare(left.publishedAt);
    return byDate !== 0 ? byDate : left.slug.localeCompare(right.slug);
  });
}

export function selectPublishedPosts(posts) {
  return posts.filter((post) => post.status === "published");
}
