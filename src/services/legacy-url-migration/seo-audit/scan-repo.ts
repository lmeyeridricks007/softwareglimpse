import fs from "node:fs";
import path from "node:path";
import { normalizeMigrationPath } from "../normalize";

export type RepoHit = {
  file: string;
  line: number;
  match: string;
  kind: "absolute_host" | "legacy_path" | "wp_media" | "attachment" | "amp_query";
};

const SKIP_DIR = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  "docs",
  "config",
]);

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
  ".mdx",
  ".json",
  ".css",
  ".html",
]);

/** Paths that are valid on the new site — not treated as legacy when found alone. */
const NEW_IA_PREFIXES = [
  "/software/",
  "/compare/",
  "/guides/",
  "/best/",
  "/categories/",
  "/features/",
  "/use-cases/",
  "/capabilities/",
  "/requirements/",
  "/resources/",
  "/tools/",
  "/for/",
  "/industries/",
  "/pricing/",
  "/alternatives/",
  "/company/",
  "/legal/",
  "/og/",
  "/search/",
  "/newsletter/",
];

function isLikelyNewPath(p: string): boolean {
  const n = normalizeMigrationPath(p);
  if (n === "/") return true;
  return NEW_IA_PREFIXES.some((prefix) => n.startsWith(prefix));
}

function walkFiles(root: string, out: string[]): void {
  if (!fs.existsSync(root)) return;
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const ent of entries) {
    if (SKIP_DIR.has(ent.name)) continue;
    const full = path.join(root, ent.name);
    if (ent.isDirectory()) {
      walkFiles(full, out);
      continue;
    }
    const ext = path.extname(ent.name).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    if (full.includes(`${path.sep}legacy-url-migration${path.sep}`)) continue;
    if (full.endsWith(".test.ts") || full.endsWith(".test.tsx")) continue;
    // Migration seed ledger intentionally lists legacy sources — not a stale link.
    if (full.endsWith(`${path.sep}seed${path.sep}migration.ts`)) continue;
    // Link-health alias allowlist intentionally names redirect sources.
    if (full.endsWith(`${path.sep}internal-linking${path.sep}health.ts`)) continue;
    out.push(full);
  }
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scan application source for hardcoded legacy host URLs, WP media, and
 * paths that match configured redirect sources.
 */
export function scanRepoForLegacyReferences(opts: {
  redirectSources: Set<string>;
  roots?: string[];
}): RepoHit[] {
  const roots = opts.roots ?? [
    path.join(process.cwd(), "src", "app"),
    path.join(process.cwd(), "src", "components"),
    path.join(process.cwd(), "src", "data"),
    path.join(process.cwd(), "src", "services"),
    path.join(process.cwd(), "public"),
  ];
  const files: string[] = [];
  for (const root of roots) walkFiles(root, files);

  const hits: RepoHit[] = [];
  const hostRe =
    /https?:\/\/(?:www\.)?softwareglimpse\.com(\/[^\s"'`)>\]]*)/gi;
  const wpMediaRe = /\/wp-content\/uploads\/[^\s"'`)>\]]*/gi;
  const attachmentRe = /[?&]attachment_id=\d+/gi;
  const ampRe = /[?&]amp(?:=1)?(?:&|$)/gi;

  const redirectList = [...opts.redirectSources].filter((s) => s !== "/");
  const pathAlts = redirectList.map((source) => {
    const bare = source.replace(/\/$/, "");
    return `${escapeRe(bare)}/?`;
  });
  const legacyPathRe =
    pathAlts.length > 0
      ? new RegExp(`['"\`](${pathAlts.join("|")})['"\`]`, "g")
      : null;

  for (const file of files) {
    let text: string;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = text.split("\n");
    const rel = path.relative(process.cwd(), file);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const lineNo = i + 1;

      for (const m of line.matchAll(hostRe)) {
        const rawMatch = m[0];
        // Ignore placeholders / ellipsis examples in UI copy
        if (/\.\.\.|…/.test(rawMatch)) continue;
        const pathname = m[1] ?? "/";
        const normalized = normalizeMigrationPath(pathname.split("?")[0] ?? "/");
        if (isLikelyNewPath(normalized) && !opts.redirectSources.has(normalized)) {
          continue;
        }
        hits.push({
          file: rel,
          line: lineNo,
          match: rawMatch,
          kind: "absolute_host",
        });
      }

      for (const m of line.matchAll(wpMediaRe)) {
        hits.push({
          file: rel,
          line: lineNo,
          match: m[0],
          kind: "wp_media",
        });
      }

      for (const m of line.matchAll(attachmentRe)) {
        hits.push({
          file: rel,
          line: lineNo,
          match: m[0],
          kind: "attachment",
        });
      }

      for (const m of line.matchAll(ampRe)) {
        hits.push({
          file: rel,
          line: lineNo,
          match: m[0],
          kind: "amp_query",
        });
      }

      if (legacyPathRe) {
        legacyPathRe.lastIndex = 0;
        for (const m of line.matchAll(legacyPathRe)) {
          hits.push({
            file: rel,
            line: lineNo,
            match: normalizeMigrationPath(m[1] ?? m[0]),
            kind: "legacy_path",
          });
        }
      }
    }
  }

  return hits;
}
