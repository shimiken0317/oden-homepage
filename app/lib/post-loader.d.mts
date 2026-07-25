import type { Post } from "./post-types";

export const postFrontmatterSchema: import("zod").ZodType;
export function parsePostSource(sourcePath: string, source: string): Post;
export function validatePostSources(sources: Record<string, string>): Post[];
export function selectPublishedPosts(posts: Post[]): Post[];
