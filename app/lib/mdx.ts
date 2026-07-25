import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";

export type MarkdownNode = {
  type: string;
  value?: string;
  url?: string;
  alt?: string;
  lang?: string | null;
  depth?: number;
  ordered?: boolean;
  start?: number | null;
  align?: Array<"left" | "right" | "center" | null>;
  children?: MarkdownNode[];
};

export type MdxHeading = {
  id: string;
  text: string;
  level: number;
};

export type ParsedMdx = {
  root: MarkdownNode;
  headings: MdxHeading[];
  headingIds: Map<MarkdownNode, string>;
};

export function getNodeText(node: MarkdownNode): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(getNodeText).join("");
}

function headingId(text: string) {
  const normalized = text
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "section";
}

export function parseMdx(source: string): ParsedMdx {
  const root = unified().use(remarkParse).use(remarkGfm).parse(source) as MarkdownNode;
  const headings: MdxHeading[] = [];
  const headingIds = new Map<MarkdownNode, string>();
  const usedIds = new Map<string, number>();

  for (const node of root.children ?? []) {
    if (node.type !== "heading" || !node.depth) continue;
    const text = getNodeText(node);
    const baseId = headingId(text);
    const occurrence = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, occurrence + 1);
    const id = occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`;
    headingIds.set(node, id);
    if (node.depth === 2 || node.depth === 3) {
      headings.push({ id, text, level: node.depth });
    }
  }

  return { root, headings, headingIds };
}

export function getMdxHeadings(source: string) {
  return parseMdx(source).headings;
}
