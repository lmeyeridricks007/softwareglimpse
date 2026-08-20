/**
 * Full CRM cluster keyword → page target inventory.
 * Generated from buildCrmQuerySeeds({ coverage: "full" }).
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildCrmQuerySeeds,
  type CrmQuerySeedCoverage,
} from "../serp-competitors/query-seeds";
import type { QuerySeed } from "../serp-competitors/types";

const OUT_DIR = path.join(process.cwd(), "docs", "site-intelligence");
const LATEST_PATH = path.join(OUT_DIR, "CRM-KEYWORD-TARGETS.md");
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");
const JSON_PATH = path.join(OUT_DIR, "crm-keyword-targets-latest.json");

function pageTypeFromPath(page: string | null): string {
  if (!page) return "unmapped";
  if (/\[[^\]]+\]/.test(page)) return "other";
  if (page === "/software/" || page === "/software") return "other";
  if (page.startsWith("/software/")) return "product-review";
  if (page.startsWith("/guides/")) return "guide";
  if (page === "/compare/" || page === "/compare") return "comparison";
  if (page.startsWith("/compare/")) return "comparison";
  if (page.startsWith("/alternatives/")) return "alternatives";
  if (page.startsWith("/best/")) return "best";
  if (page.startsWith("/resources/")) return "resource";
  if (page.startsWith("/tools/")) return "tool";
  if (page.startsWith("/industries/")) return "industry";
  if (page.startsWith("/use-cases/")) return "use-case";
  if (page.startsWith("/capabilities/")) return "capability";
  if (page.startsWith("/features/")) return "feature";
  if (page.startsWith("/requirements/")) return "requirement";
  if (page.startsWith("/for/")) return "audience";
  if (page.startsWith("/categories/")) return "category";
  return "other";
}

const TYPE_ORDER = [
  "category",
  "best",
  "product-review",
  "comparison",
  "alternatives",
  "guide",
  "tool",
  "resource",
  "industry",
  "use-case",
  "capability",
  "feature",
  "requirement",
  "audience",
  "other",
  "unmapped",
] as const;

export function formatCrmKeywordTargetsMarkdown(input: {
  seeds: QuerySeed[];
  generatedAt: string;
}): string {
  const { seeds, generatedAt } = input;
  const byType = new Map<string, QuerySeed[]>();
  for (const s of seeds) {
    const t = pageTypeFromPath(s.associatedPage);
    const list = byType.get(t) ?? [];
    list.push(s);
    byType.set(t, list);
  }

  const lines: string[] = [];
  lines.push("# CRM Cluster Keyword Targets");
  lines.push("");
  lines.push(`**Generated:** ${generatedAt}`);
  lines.push(`**Cluster:** CRM`);
  lines.push(`**Coverage:** full catalogue — ${seeds.length} keyword → page pairs`);
  lines.push("");
  lines.push(
    "> Authoritative inventory of **keywords / query targets** the CRM cluster maps to SoftwareGlimpse pages.",
  );
  lines.push(
    "> Derived from live catalogue entities (products, guides, comparisons, tools, resources, hubs). **Not** a claim of current Google rankings.",
  );
  lines.push("");
  lines.push("## Summary by page type");
  lines.push("");
  lines.push("| Page type | Keywords |");
  lines.push("| --- | ---: |");
  for (const t of TYPE_ORDER) {
    const n = byType.get(t)?.length ?? 0;
    if (n === 0) continue;
    lines.push(`| ${t} | ${n} |`);
  }
  lines.push(`| **Total** | **${seeds.length}** |`);
  lines.push("");

  lines.push("## Full keyword list");
  lines.push("");
  lines.push(
    "One primary target keyword per page (unique by route). Re-run after catalogue changes.",
  );
  lines.push("");

  for (const t of TYPE_ORDER) {
    const list = byType.get(t);
    if (!list?.length) continue;
    list.sort((a, b) => a.query.localeCompare(b.query));
    lines.push(`### ${t} (${list.length})`);
    lines.push("");
    lines.push("| # | Keyword / query | Target page | Seed source | Intent |");
    lines.push("| ---: | --- | --- | --- | --- |");
    list.forEach((s, i) => {
      lines.push(
        `| ${i + 1} | ${s.query} | ${s.associatedPage ? `\`${s.associatedPage}\`` : "—"} | ${s.source} | ${s.intent} |`,
      );
    });
    lines.push("");
  }

  lines.push("## Product review keywords (all CRM software hubs)");
  lines.push("");
  const products = (byType.get("product-review") ?? []).slice().sort((a, b) =>
    a.query.localeCompare(b.query),
  );
  if (!products.length) {
    lines.push("_No product review targets._");
    lines.push("");
  } else {
    lines.push("| Keyword | Page |");
    lines.push("| --- | --- |");
    for (const s of products) {
      lines.push(`| ${s.query} | \`${s.associatedPage}\` |`);
    }
    lines.push("");
  }

  lines.push("## How this relates to other reports");
  lines.push("");
  lines.push(
    "| Report | Role |",
  );
  lines.push("| --- | --- |");
  lines.push(
    "| This file (`CRM-KEYWORD-TARGETS.md`) | Full CRM keyword → page inventory |",
  );
  lines.push(
    "| `competitors/CRM-QUERY-SET.md` | **Bounded** SERP discovery seed set (API cost) |",
  );
  lines.push(
    "| `RANKING-OPPORTUNITIES-LATEST.md` | Relative opportunity / feasibility for these targets |",
  );
  lines.push(
    "| `pages/*-ranking-readiness.md` | Per-page readiness for one route |",
  );
  lines.push("");

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:crm-keywords");
  lines.push("```");
  lines.push("");
  lines.push(
    "Also refreshed when running `npm run site:ranking-opportunities` (writes this inventory alongside the opportunity report).",
  );
  lines.push("");

  return lines.join("\n");
}

export function writeCrmKeywordTargets(opts?: {
  generatedAt?: string;
  write?: boolean;
  archive?: boolean;
  coverage?: CrmQuerySeedCoverage;
}): {
  generatedAt: string;
  seedCount: number;
  markdown: string;
  paths: { latest?: string; archive?: string; json?: string };
} {
  const generatedAt = opts?.generatedAt ?? new Date().toISOString();
  const write = opts?.write !== false;
  const seeds = buildCrmQuerySeeds({
    coverage: opts?.coverage ?? "full",
  });
  const markdown = formatCrmKeywordTargetsMarkdown({ seeds, generatedAt });
  const paths: { latest?: string; archive?: string; json?: string } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);

    fs.writeFileSync(
      JSON_PATH,
      JSON.stringify(
        {
          generatedAt,
          cluster: "crm",
          coverage: "full",
          count: seeds.length,
          targets: seeds.map((s) => ({
            query: s.query,
            page: s.associatedPage,
            intent: s.intent,
            source: s.source,
            pageType: pageTypeFromPath(s.associatedPage),
          })),
        },
        null,
        2,
      ),
      "utf8",
    );
    paths.json = path.relative(process.cwd(), JSON_PATH);

    if (opts?.archive !== false) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(ARCHIVE_DIR, `${day}-crm-keyword-targets.md`);
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return { generatedAt, seedCount: seeds.length, markdown, paths };
}
