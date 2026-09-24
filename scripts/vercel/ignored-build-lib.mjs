/**
 * SoftwareGlimpse ignored-build classifier.
 *
 * Vercel ignoreCommand exit codes (official vercel.json docs):
 *   0 = skip / cancel the deployment
 *   1 = proceed with the build
 *
 * Fail-open: if the git range cannot be resolved, or any changed file is not
 * provably documentation/audit-only, proceed with the build.
 *
 * Do not use a blanket git pathspec that excludes every markdown file or all of docs.
 * Production content lives in src/, data/, config/, and public/ — including
 * JSON/CSV the site reads at build (for example data/seo/link-injections.json).
 * Root content/ is Medium/guest distribution copy, not the Next.js compile graph.
 */

export const EXIT_SKIP = 0;
export const EXIT_BUILD = 1;

const ALWAYS_BUILD_FILES = new Set([
  ".npmrc",
  ".nvmrc",
  ".vercelignore",
  "eslint.config.js",
  "eslint.config.mjs",
  "instrumentation.ts",
  "middleware.ts",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "pnpm-lock.yaml",
  "postcss.config.js",
  "postcss.config.mjs",
  "tailwind.config.js",
  "tailwind.config.ts",
  "tsconfig.build.json",
  "tsconfig.json",
  "vercel.json",
  "vercel.ts",
  "vitest.config.mts",
  "vitest.config.ts",
  "yarn.lock",
]);

const ALWAYS_BUILD_PREFIXES = [
  "src/",
  "public/",
  "scripts/",
  "config/",
  "data/",
];

const SKIP_PREFIXES = [
  ".cursor/",
  ".github/",
  "content/",
  "docs/",
  "reports/",
  "tmp/",
];

const SKIP_FILES = new Set([
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  "AGENTS.md",
  "CHANGELOG.md",
  "CLAUDE.md",
  "LICENSE",
  "LICENSE.md",
  "README.md",
]);

const SKIP_EXTENSIONS = new Set([".md", ".mdc", ".markdown", ".txt"]);

/**
 * @param {string} raw
 * @returns {string}
 */
export function normalizeRepoPath(raw) {
  return String(raw || "")
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/^"/, "")
    .replace(/"$/, "");
}

/**
 * @param {string} file
 * @returns {boolean}
 */
export function isAlwaysBuildPath(file) {
  const p = normalizeRepoPath(file);
  if (!p) return false;
  if (ALWAYS_BUILD_FILES.has(p)) return true;
  if (p === "middleware.ts" || p === "src/middleware.ts") return true;
  return ALWAYS_BUILD_PREFIXES.some(
    (prefix) => p === prefix.slice(0, -1) || p.startsWith(prefix),
  );
}

/**
 * True when this path cannot affect the production Next.js application.
 * @param {string} file
 * @returns {boolean}
 */
export function isIgnorablePath(file) {
  const p = normalizeRepoPath(file);
  if (!p) return true;
  if (isAlwaysBuildPath(p)) return false;

  if (SKIP_FILES.has(p)) return true;
  if (
    SKIP_PREFIXES.some(
      (prefix) => p === prefix.slice(0, -1) || p.startsWith(prefix),
    )
  ) {
    return true;
  }

  const base = p.split("/").pop() || p;
  const dot = base.lastIndexOf(".");
  const ext = dot >= 0 ? base.slice(dot).toLowerCase() : "";
  if (SKIP_EXTENSIONS.has(ext)) return true;

  return false;
}

/**
 * @param {string[]} files
 * @returns {{ skip: boolean, ignorable: string[], affecting: string[] }}
 */
export function classifyChangedFiles(files) {
  const ignorable = [];
  const affecting = [];
  for (const file of files) {
    const p = normalizeRepoPath(file);
    if (!p) continue;
    if (isIgnorablePath(p)) ignorable.push(p);
    else affecting.push(p);
  }
  return {
    skip:
      affecting.length === 0 &&
      (ignorable.length > 0 || files.length === 0),
    ignorable,
    affecting,
  };
}

/**
 * @param {{ skip: boolean }} decision
 * @returns {number}
 */
export function exitCodeForDecision(decision) {
  return decision.skip ? EXIT_SKIP : EXIT_BUILD;
}
