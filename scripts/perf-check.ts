/**
 * Performance budget / regression checks (static + optional build artifacts).
 *
 * Usage:
 *   npm run perf:check
 *   npm run perf:check -- --strict   # treat warnings as failures
 *
 * Does NOT gate on Lighthouse scores (brittle). Prefers budget + antipattern checks.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  PERFORMANCE_BUDGETS,
  REPRESENTATIVE_ROUTES,
} from "../src/performance/budgets";

const strict = process.argv.includes("--strict");
type Issue = { level: "error" | "warn"; message: string };

function walkTsx(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsx(full, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(full);
  }
  return out;
}

function checkToolDynamicImports(): Issue[] {
  const issues: Issue[] = [];
  const toolsDir = path.join(process.cwd(), "src/app/(site)/tools");
  const pages = walkTsx(toolsDir).filter((f) => f.endsWith("page.tsx"));
  const heavy = [
    "crm-finder-app",
    "crm-tco-calculator-app",
    "crm-implementation-planner-app",
    "crm-migration-planner-app",
    "crm-vendor-scorecard-app",
    "crm-requirements-builder-app",
    "cost-calculator-app",
  ];
  for (const page of pages) {
    const src = readFileSync(page, "utf8");
    for (const needle of heavy) {
      if (src.includes(`/${needle}"`) || src.includes(`/${needle}'`)) {
        // Direct static import of heavy app — prefer Dynamic* helpers
        if (!src.includes("dynamic-tool-apps")) {
          issues.push({
            level: "error",
            message: `${path.relative(process.cwd(), page)} statically imports ${needle} — use @/components/tools/dynamic-tool-apps`,
          });
        }
      }
    }
  }
  return issues;
}

function checkNoYoutubeApiGlobal(): Issue[] {
  const issues: Issue[] = [];
  const files = walkTsx(path.join(process.cwd(), "src"));
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (
      src.includes("youtube.com/iframe_api") ||
      src.includes("YT.Player") ||
      src.includes("www.youtube.com/iframe_api")
    ) {
      issues.push({
        level: "error",
        message: `${path.relative(process.cwd(), file)} loads YouTube IFrame API globally`,
      });
    }
  }
  return issues;
}

function checkHeroSourceWeights(): Issue[] {
  const issues: Issue[] = [];
  const publicRoot = path.join(process.cwd(), "public");
  if (!existsSync(publicRoot)) return issues;

  const candidates = [
    "guides/what-is-crm-hero.webp",
    "guides/crm-implementation-hero.webp",
    "capabilities/pipeline-management-hero-v2.webp",
    "capabilities/workflow-automation-hero-v2.webp",
    "features/workflow-automation-hero.webp",
    "og/default.png",
  ];

  for (const rel of candidates) {
    const full = path.join(publicRoot, rel);
    if (!existsSync(full)) continue;
    const kb = statSync(full).size / 1024;
    const warn = PERFORMANCE_BUDGETS.content.heroSourceKbWarn;
    if (kb > warn) {
      issues.push({
        level: "warn",
        message: `Hero source ${rel} is ${kb.toFixed(0)}KB (warn > ${warn}KB) — run npm run perf:optimize-images`,
      });
    }
  }
  return issues;
}

function checkBudgetsDefined(): Issue[] {
  const issues: Issue[] = [];
  if (REPRESENTATIVE_ROUTES.length < 10) {
    issues.push({
      level: "error",
      message: "Representative route list incomplete",
    });
  }
  for (const family of Object.keys(PERFORMANCE_BUDGETS)) {
    const b = PERFORMANCE_BUDGETS[family as keyof typeof PERFORMANCE_BUDGETS];
    if (b.jsKbMax < b.jsKbWarn) {
      issues.push({
        level: "error",
        message: `Budget ${family}: jsKbMax < jsKbWarn`,
      });
    }
  }
  return issues;
}

function checkBuildClientChunks(): Issue[] {
  const issues: Issue[] = [];
  const nextDir = path.join(process.cwd(), ".next");
  if (!existsSync(nextDir)) {
    issues.push({
      level: "warn",
      message:
        "No .next build found — skip client chunk size checks (run next build)",
    });
    return issues;
  }

  // Soft scan: flag individual client chunks over 500KB gzip-uncompressed.
  const appDir = path.join(nextDir, "static", "chunks");
  if (!existsSync(appDir)) return issues;
  const large: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith(".js") && st.size > 500 * 1024) {
        large.push(
          `${path.relative(process.cwd(), full)} (${(st.size / 1024).toFixed(0)}KB)`,
        );
      }
    }
  };
  walk(appDir);
  for (const row of large.slice(0, 15)) {
    issues.push({
      level: "warn",
      message: `Large client chunk: ${row}`,
    });
  }
  return issues;
}

function main() {
  const issues: Issue[] = [
    ...checkBudgetsDefined(),
    ...checkToolDynamicImports(),
    ...checkNoYoutubeApiGlobal(),
    ...checkHeroSourceWeights(),
    ...checkBuildClientChunks(),
  ];

  for (const issue of issues) {
    const tag = issue.level.toUpperCase();
    console.log(`[${tag}] ${issue.message}`);
  }

  const errors = issues.filter((i) => i.level === "error").length;
  const warns = issues.filter((i) => i.level === "warn").length;
  console.log(
    `\nperf:check complete — ${errors} error(s), ${warns} warning(s). Routes covered: ${REPRESENTATIVE_ROUTES.length}`,
  );

  if (errors > 0 || (strict && warns > 0)) {
    process.exit(1);
  }
}

main();
