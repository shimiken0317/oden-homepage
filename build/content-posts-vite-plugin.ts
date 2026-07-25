import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { selectPublishedPosts, validatePostSources } from "../app/lib/post-loader.mjs";

const virtualModuleId = "virtual:oden-posts";
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

function readPostSources(postsDirectory: string) {
  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`記事ディレクトリが見つかりません: ${postsDirectory}`);
  }

  const sources: Record<string, string> = {};
  for (const filename of fs.readdirSync(postsDirectory).sort()) {
    if (!filename.endsWith(".mdx")) continue;
    const absolutePath = path.join(postsDirectory, filename);
    const sourcePath = `/content/posts/${filename}`;
    sources[sourcePath] = fs.readFileSync(absolutePath, "utf8");
  }
  return sources;
}

function invalidatePostsModule(server: ViteDevServer) {
  const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
  if (module) server.moduleGraph.invalidateModule(module);
  server.ws.send({ type: "full-reload" });
}

export function contentPosts(): Plugin {
  let config: ResolvedConfig;
  let postsDirectory = "";

  return {
    name: "oden:content-posts",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      postsDirectory = path.resolve(config.root, "content/posts");
    },
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : undefined;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return undefined;

      const sources = readPostSources(postsDirectory);
      for (const sourcePath of Object.keys(sources)) {
        this.addWatchFile(path.resolve(config.root, sourcePath.slice(1)));
      }

      const validatedPosts = validatePostSources(sources);
      const posts = config.command === "build" ? selectPublishedPosts(validatedPosts) : validatedPosts;
      return `export const posts = ${JSON.stringify(posts)};`;
    },
    configureServer(server) {
      server.watcher.add(postsDirectory);
      const refresh = (file: string) => {
        if (file.startsWith(postsDirectory) && file.endsWith(".mdx")) {
          invalidatePostsModule(server);
        }
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },
  };
}
