import {
  getAlternativesPages,
  getAudiences,
  getBestPages,
  getCapabilities,
  getComparisons,
  getIndustries,
  getResources,
  getSoftwareByCategory,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { listRequirementDetailParams } from "@/data/requirement-detail";
import { classifyQuery } from "@/services/seo/classify-query";
import { loadMapRegister, resolveRowRoute } from "@/services/content-quality/gaps/map-register";
import { loadAuditSnapshots } from "@/services/content-quality/loaders/inventory";
import type { QuerySeed } from "./types";

/** Bounded set for live/fixture SERP discovery (API cost). */
const MAX_SERP_DEFAULT = 28;

export type CrmQuerySeedCoverage = "serp" | "full";

function uniqueSeeds(seeds: QuerySeed[]): QuerySeed[] {
  const seen = new Set<string>();
  const out: QuerySeed[] = [];
  for (const s of seeds) {
    const key = s.query.trim().toLowerCase().replace(/\s+/g, " ");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ ...s, query: key });
  }
  return out;
}

function uniqueByPage(seeds: QuerySeed[]): QuerySeed[] {
  const seen = new Set<string>();
  const out: QuerySeed[] = [];
  for (const s of seeds) {
    const page = (s.associatedPage ?? "").replace(/\/$/, "").toLowerCase();
    if (page) {
      if (seen.has(page)) continue;
      seen.add(page);
    }
    out.push(s);
  }
  return out;
}

function intentFor(query: string): string {
  try {
    return classifyQuery(query).intent;
  } catch {
    return "unknown";
  }
}

function titleToQuery(title: string): string | null {
  const q = title
    .replace(/[|:–—].*$/, "")
    .replace(/\?/g, "")
    .trim()
    .toLowerCase();
  if (q.length < 6 || q.length > 90) return null;
  return q;
}

function push(
  seeds: QuerySeed[],
  query: string,
  page: string | null,
  source: string,
  intent?: string,
): void {
  seeds.push({
    query,
    intent: intent ?? intentFor(query),
    cluster: "crm",
    associatedPage: page,
    source,
  });
}

function buildPillarSeeds(): QuerySeed[] {
  const pillars: Array<{ query: string; page: string; source: string }> = [
    { query: "best crm software", page: "/best/crm-software/", source: "pillar" },
    { query: "crm software", page: "/categories/crm/", source: "category" },
    { query: "how to choose crm", page: "/guides/how-to-choose-crm/", source: "guide" },
    { query: "what is crm", page: "/guides/what-is-crm/", source: "guide" },
    { query: "crm comparison", page: "/compare/", source: "compare-hub" },
    {
      query: "crm evaluation checklist",
      page: "/resources/crm-evaluation-checklist/",
      source: "resource",
    },
    {
      query: "crm implementation",
      page: "/tools/crm-implementation-planner/",
      source: "tool",
    },
    {
      query: "crm migration",
      page: "/tools/crm-migration-planner/",
      source: "tool",
    },
    {
      query: "crm requirements",
      page: "/tools/crm-requirements-builder/",
      source: "tool",
    },
    {
      query: "crm for financial services",
      page: "/industries/financial-services/",
      source: "industry",
    },
    {
      query: "crm for small business",
      page: "/industries/small-business/",
      source: "industry",
    },
    {
      query: "crm workflow automation",
      page: "/capabilities/workflow-automation/",
      source: "capability",
    },
    {
      query: "crm pipeline management",
      page: "/use-cases/pipeline-management/",
      source: "use-case",
    },
    {
      query: "crm cost calculator",
      page: "/tools/crm-cost-calculator/",
      source: "tool",
    },
  ];
  const seeds: QuerySeed[] = [];
  for (const p of pillars) {
    push(seeds, p.query, p.page, p.source);
  }
  return seeds;
}

/**
 * Full CRM catalogue → one seed per published page (ranking opportunities).
 * Prefer page uniqueness so product/guide/comparison inventory is complete.
 */
export function buildFullCrmCatalogueSeeds(): QuerySeed[] {
  const seeds: QuerySeed[] = [...buildPillarSeeds()];

  // All CRM product review hubs
  for (const soft of getSoftwareByCategory("crm", { includeUnpublished: false })) {
    push(
      seeds,
      `${soft.name} review`,
      `/software/${soft.slug}/`,
      "product",
      "review",
    );
  }

  // All CRM guides (include soft-published — CQ evaluates them; ranking should too)
  const guides = getGuides({ includeUnpublished: true }).filter(
    (g) => g.categorySlugs?.includes("crm") || /crm/i.test(g.slug),
  );
  for (const g of guides) {
    const q = titleToQuery(g.title) ?? g.slug.replace(/-/g, " ");
    push(seeds, q, `/guides/${g.slug}/`, "guide-title");
  }

  // All published comparisons (CRM-first catalogue)
  for (const c of getComparisons({ includeUnpublished: false })) {
    const q =
      titleToQuery(c.title) ?? c.slug.replace(/-/g, " ");
    push(seeds, q, `/compare/${c.slug}/`, "comparison", "comparison");
  }

  // Alternatives
  for (const a of getAlternativesPages({ includeUnpublished: false })) {
    const q = titleToQuery(a.title) ?? `${a.slug.replace(/-/g, " ")} alternatives`;
    push(seeds, q, `/alternatives/${a.slug}/`, "alternatives");
  }

  // Best-of
  for (const b of getBestPages({ includeUnpublished: false })) {
    const q = titleToQuery(b.title) ?? `best ${b.slug.replace(/-/g, " ")}`;
    push(seeds, q, `/best/${b.slug}/`, "best");
  }

  // Resources
  for (const r of getResources({ includeUnpublished: false })) {
    const q =
      titleToQuery(r.name) ??
      titleToQuery(r.shortTitle ?? "") ??
      r.slug.replace(/-/g, " ");
    push(seeds, q, `/resources/${r.slug}/`, "resource", "tool-resource");
  }

  // Tools registry (CRM)
  for (const t of TOOLS_REGISTRY.filter(
    (x) =>
      x.href &&
      (x.categorySlugs.includes("crm") || /crm/i.test(x.slug)) &&
      x.status !== "coming-soon",
  )) {
    push(
      seeds,
      titleToQuery(t.name) ?? t.slug.replace(/-/g, " "),
      t.href!.endsWith("/") ? t.href! : `${t.href}/`,
      "tool",
      "tool-resource",
    );
  }

  // Industries / use cases / capabilities / audiences
  // Disambiguate shared slugs (e.g. contact-management) so uniqueSeeds cannot drop pages.
  for (const i of getIndustries({ includeUnpublished: false })) {
    push(
      seeds,
      `crm for ${i.slug.replace(/-/g, " ")}`,
      `/industries/${i.slug}/`,
      "industry",
    );
  }
  for (const u of getUseCases()) {
    push(
      seeds,
      `crm ${u.slug.replace(/-/g, " ")} use case`,
      `/use-cases/${u.slug}/`,
      "use-case",
    );
  }
  for (const c of getCapabilities()) {
    push(
      seeds,
      `crm ${c.slug.replace(/-/g, " ")} capability`,
      `/capabilities/${c.slug}/`,
      "capability",
    );
  }
  for (const a of getAudiences({ includeUnpublished: false })) {
    push(
      seeds,
      `crm for ${a.slug.replace(/-/g, " ")}`,
      `/for/${a.slug}/`,
      "audience",
    );
  }

  // Feature + requirement detail pages
  for (const f of listFeatureDetailParams()) {
    push(
      seeds,
      `crm ${f.slug.replace(/-/g, " ")} feature`,
      `/features/${f.slug}/`,
      "feature",
    );
  }
  for (const r of listRequirementDetailParams()) {
    push(
      seeds,
      `crm ${r.slug.replace(/-/g, " ")} requirement`,
      `/requirements/${r.slug}/`,
      "requirement",
    );
  }

  // Map P0 rows (supplement — may duplicate pages; uniqueByPage drops dups)
  try {
    const rows = loadMapRegister().filter(
      (r) =>
        /LIVE|EXISTING|THIN|PARTIAL/i.test(r.statusRaw) &&
        r.priority === "P0",
    );
    for (const row of rows) {
      const route = resolveRowRoute(row);
      // Skip template / directory placeholders (e.g. /software/[slug]/)
      if (!route || /\[[^\]]+\]/.test(route)) continue;
      if (
        route === "/software/" ||
        route === "/software" ||
        route === "/compare/" ||
        route === "/compare" ||
        route === "/tools/" ||
        route === "/tools" ||
        route === "/use-cases/" ||
        route === "/industries/" ||
        route === "/pricing/" ||
        route === "/pricing"
      ) {
        continue;
      }
      const q = row.title
        .replace(/\[.*?\]/g, "")
        .replace(/CRM/gi, "crm")
        .trim()
        .toLowerCase();
      if (q.length < 6 || q.length > 70) continue;
      if (/softwareglimpse|home$|^orient/i.test(q)) continue;
      push(seeds, q, route, `map:${row.id}`, row.intent || undefined);
    }
  } catch {
    /* map optional */
  }

  // Ensure every Content Quality CRM inventory route is represented
  try {
    for (const { snapshot } of loadAuditSnapshots("crm")) {
      const page = snapshot.route.endsWith("/")
        ? snapshot.route
        : `${snapshot.route}/`;
      if (/\[[^\]]+\]/.test(page)) continue;
      const q =
        titleToQuery(snapshot.title ?? "") ??
        page
          .replace(/^\/|\/$/g, "")
          .replace(/\//g, " ")
          .replace(/-/g, " ");
      if (!q || q.length < 4) continue;
      push(seeds, q, page, "cq-inventory");
    }
  } catch {
    /* CQ inventory optional */
  }

  // One seed per page. Do NOT uniqueSeeds first — shared query text across
  // feature/capability/use-case would drop pages from full catalogue coverage.
  return uniqueByPage(seeds.map((s) => ({
    ...s,
    query: s.query.trim().toLowerCase().replace(/\s+/g, " "),
  })));
}

/**
 * CRM topic/query seeds.
 *
 * - `coverage: "serp"` (default) — bounded set for SERP discovery APIs
 * - `coverage: "full"` — every CRM catalogue page for RankingOpportunityAgent
 */
export function buildCrmQuerySeeds(options?: {
  max?: number;
  coverage?: CrmQuerySeedCoverage;
}): QuerySeed[] {
  const coverage = options?.coverage ?? "serp";

  if (coverage === "full") {
    const full = buildFullCrmCatalogueSeeds();
    if (options?.max != null) return full.slice(0, options.max);
    return full;
  }

  const max = options?.max ?? MAX_SERP_DEFAULT;
  const seeds: QuerySeed[] = [...buildPillarSeeds()];

  // Sample of guides for SERP (full coverage is ranking-only)
  const guides = getGuides({ includeUnpublished: false })
    .filter((g) => g.categorySlugs?.includes("crm") || /crm/i.test(g.slug))
    .slice(0, 8);
  for (const g of guides) {
    const q = titleToQuery(g.title);
    if (!q) continue;
    push(seeds, q, `/guides/${g.slug}/`, "guide-title");
  }

  // All CRM products still included in SERP set when they fit under max —
  // prefer products over long-tail guides for discovery.
  const products = getSoftwareByCategory("crm", { includeUnpublished: false });
  for (const soft of products) {
    push(
      seeds,
      `${soft.name} review`,
      `/software/${soft.slug}/`,
      "product",
      "review",
    );
  }

  if (
    products.some((p) => p.slug === "hubspot") &&
    products.some((p) => p.slug === "pipedrive")
  ) {
    push(
      seeds,
      "hubspot vs pipedrive",
      "/compare/hubspot-vs-pipedrive/",
      "comparison",
      "comparison",
    );
  }

  const comps = getComparisons({ includeUnpublished: false }).slice(0, 2);
  for (const c of comps) {
    push(
      seeds,
      c.slug.replace(/-/g, " "),
      `/compare/${c.slug}/`,
      "comparison-slug",
      "comparison",
    );
  }

  return uniqueSeeds(seeds).slice(0, max);
}

export function formatCrmQuerySetMarkdown(
  seeds: QuerySeed[],
  generatedAt: string,
): string {
  const lines: string[] = [
    "# CRM Query Set — SERP Competitor Discovery",
    "",
    `**Generated:** ${generatedAt}`,
    "**Cluster:** CRM",
    "",
    "> Query seeds derived from SoftwareGlimpse content map, page titles, entities, guides, products, and comparisons.",
    "> This is **not** a hardcoded business-competitor list. Re-run periodically — SERPs change.",
    "",
    "> **Note:** SERP discovery uses a **bounded** seed set. Ranking opportunities use **full CRM catalogue coverage** via `buildCrmQuerySeeds({ coverage: \"full\" })`.",
    "",
    "| # | Query | Intent | Associated SoftwareGlimpse page | Source |",
    "| --- | --- | --- | --- | --- |",
  ];
  seeds.forEach((s, i) => {
    lines.push(
      `| ${i + 1} | ${s.query} | ${s.intent} | ${s.associatedPage ? `\`${s.associatedPage}\`` : "—"} | ${s.source} |`,
    );
  });
  lines.push("");
  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:serp-competitors -- --cluster crm");
  lines.push("npm run site:ranking-opportunities   # full CRM page coverage");
  lines.push("```");
  lines.push("");
  lines.push(
    "Do not treat old competitor snapshots as current. Prefer regenerating query set when the content map or catalogue changes materially.",
  );
  lines.push("");
  return lines.join("\n");
}
