/* eslint-disable @next/next/no-img-element */
import { Fragment, type ReactNode } from "react";
import { getNodeText, parseMdx, type MarkdownNode } from "../lib/mdx";
import { OdenChan } from "./oden-chan";

function safeLink(url = "") {
  if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) {
    return url;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

function safeImage(url = "") {
  return url.startsWith("/articles/") ? url : undefined;
}

function renderChildren(
  node: MarkdownNode,
  headingIds: Map<MarkdownNode, string>,
  keyPrefix: string,
): ReactNode[] {
  return (node.children ?? []).map((child, index) =>
    renderNode(child, headingIds, `${keyPrefix}-${index}`),
  );
}

function renderNode(
  node: MarkdownNode,
  headingIds: Map<MarkdownNode, string>,
  key: string,
): ReactNode {
  const children = renderChildren(node, headingIds, key);

  switch (node.type) {
    case "root":
      return <Fragment key={key}>{children}</Fragment>;
    case "text":
      return node.value ?? "";
    case "paragraph":
      return (
        <p className={key === "mdx-0" ? "lead" : undefined} key={key}>
          {children}
        </p>
      );
    case "heading": {
      const level = Math.min(Math.max(node.depth ?? 2, 1), 6);
      const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <Heading id={headingIds.get(node)} key={key}>
          {children}
        </Heading>
      );
    }
    case "strong":
      return <strong key={key}>{children}</strong>;
    case "emphasis":
      return <em key={key}>{children}</em>;
    case "delete":
      return <del key={key}>{children}</del>;
    case "break":
      return <br key={key} />;
    case "thematicBreak":
      return <hr key={key} />;
    case "inlineCode":
      return <code key={key}>{node.value ?? ""}</code>;
    case "code":
      return (
        <pre key={key}>
          <code className={node.lang ? `language-${node.lang}` : undefined}>{node.value ?? ""}</code>
        </pre>
      );
    case "list": {
      const List = node.ordered ? "ol" : "ul";
      return (
        <List key={key} start={node.ordered && node.start ? node.start : undefined}>
          {children}
        </List>
      );
    }
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote": {
      const text = getNodeText(node).trim();
      if (text.startsWith("[!ODEN]")) {
        return (
          <div className="oden-note" key={key}>
            <OdenChan label="記事をゆるく案内するおでんちゃん" />
            <p>
              <strong>おでんちゃんのひとこと</strong>
              {text.replace(/^\[!ODEN]\s*/, "")}
            </p>
          </div>
        );
      }
      return <blockquote key={key}>{children}</blockquote>;
    }
    case "link": {
      const href = safeLink(node.url);
      if (!href) return <span key={key}>{children}</span>;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          key={key}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    }
    case "image": {
      const src = safeImage(node.url);
      if (!src) {
        throw new Error(`記事画像は /articles/ 以下のパスで指定してください: ${node.url ?? "(未指定)"}`);
      }
      return (
        <figure key={key}>
          <img alt={node.alt ?? ""} decoding="async" loading="lazy" src={src} />
          {node.alt ? <figcaption>{node.alt}</figcaption> : null}
        </figure>
      );
    }
    case "table":
      return (
        <div className="mdx-table-wrap" key={key}>
          <table>
            {node.children?.[0] ? (
              <thead>
                <tr>
                  {(node.children[0].children ?? []).map((cell, cellIndex) => (
                    <th key={`${key}-head-${cellIndex}`}>
                      {renderChildren(cell, headingIds, `${key}-head-${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {(node.children ?? []).slice(1).map((row, rowIndex) => (
                <tr key={`${key}-row-${rowIndex}`}>
                  {(row.children ?? []).map((cell, cellIndex) => (
                    <td key={`${key}-row-${rowIndex}-${cellIndex}`}>
                      {renderChildren(cell, headingIds, `${key}-row-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{children}</tr>;
    case "tableCell":
      return <td key={key}>{children}</td>;
    case "html":
    case "mdxFlowExpression":
    case "mdxTextExpression":
    case "mdxJsxFlowElement":
    case "mdxJsxTextElement":
      throw new Error("記事内のHTML、JSX、JavaScript式は使用できません");
    default:
      throw new Error(`未対応のMarkdown構文です: ${node.type}`);
  }
}

export function MdxContent({ source }: { source: string }) {
  const parsed = parseMdx(source);
  return <>{renderNode(parsed.root, parsed.headingIds, "mdx")}</>;
}
