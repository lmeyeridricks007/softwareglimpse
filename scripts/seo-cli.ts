#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse SEO intelligence CLI
 *
 * Usage:
 *   npm run seo -- sync --fixture
 *   npm run seo -- status
 *   npm run seo -- opportunities
 *   npm run seo -- opportunities --type comparison-opportunity
 *   npm run seo -- page -- /software/pipedrive/
 *   npm run seo -- page -- content:software:pipedrive
 *   npm run seo -- query -- "best crm software"
 *   npm run seo -- query -- "pipedrive vs close"
 *   npm run seo -- gaps -- crm
 *   npm run seo -- gaps -- pipedrive
 *   npm run seo -- links -- crm
 *   npm run seo -- quick-wins
 *   npm run seo -- validate
 *
 * Fixtures are SYNTHETIC — not live SoftwareGlimpse Search Console data.
 */
import { seoThresholds } from "@/data/config/seo/thresholds";
import { getCategoryBySlug, getSoftwareBySlug } from "@/data";
import {
  loadFixtureSnapshot,
  listOpportunities,
  listSnapshots,
  loadSnapshot,
  upsertOpportunity,
} from "@/data/seo/store";
import type {
  SearchPerformanceRow,
  SearchSnapshot,
  SeoOpportunity,
} from "@/domain";
import { parseContentId, SeoOpportunityTypeSchema } from "@/domain";
import { buildContentRegistry } from "@/services/publishing/server";
import { pathForContent } from "@/services/publishing";
import {
  buildCategoryGapReport,
  buildPageReport,
  buildProductGapReport,
  buildQueryReport,
  buildStatusReport,
  detectAllOpportunities,
  FixtureSearchPerformanceProvider,
  opportunityIdForComparison,
  resolveSearchUrl,
} from "@/services/seo";
import { syncSearchPerformance } from "@/services/seo/server";

type Args = {
  command: string;
  type?: string;
  fixture: boolean;
  positional: string[];
};

const CURRENT_FIXTURE = "synthetic-28d-current.json";
const PREVIOUS_FIXTURE = "synthetic-28d-previous.json";
const CURRENT_LABEL = "28d-current";
const PREVIOUS_LABEL = "28d-previous";

function usage(exitCode = 1): never {
  console.error(`SoftwareGlimpse SEO intelligence CLI

Commands:
  sync --fixture
  status
  opportunities [--type <SeoOpportunityType>]
  page -- </path/ or content:type:slug>
  query -- "<search query>"
  gaps -- <product-or-category-slug>
  links -- <product-or-category-slug>
  quick-wins
  validate

Aliases (via package.json): seo:sync, seo:status, seo:opportunities,
  seo:page, seo:query, seo:gaps, seo:gsc-links, seo:quick-wins, seo:validate

Note: Fixture mode is SYNTHETIC — not live SoftwareGlimpse GSC data.
Opportunities never auto-publish pages. Commercial boosts affect content
priority only — never product recommendation rankings.
`);
  process.exit(exitCode);
}

function parseArgs(argv: string[]): Args {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    usage(0);
  }

  const command = argv[0]!;
  const rest = argv.slice(1);
  const positional: string[] = [];
  let type: string | undefined;
  let fixture = false;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--") {
      continue;
    }
    if (arg === "--fixture") {
      fixture = true;
      continue;
    }
    if (arg === "--type") {
      type = rest[++i];
      continue;
    }
    if (arg.startsWith("--type=")) {
      type = arg.slice("--type=".length);
      continue;
    }
    if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      usage();
    }
    positional.push(arg);
  }

  return { command, type, fixture, positional };
}

function pad(value: string, width: number): string {
  return value.padEnd(width).slice(0, width);
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtPos(n: number): string {
  return n.toFixed(1);
}

function sumRows(rows: SearchPerformanceRow[]): {
  clicks: number;
  impressions: number;
  ctr: number;
} {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
  };
}

function findSnapshotByLabel(rangeLabel: string): SearchSnapshot | null {
  const meta = listSnapshots().find((m) => m.rangeLabel === rangeLabel);
  if (!meta) return null;
  return loadSnapshot(meta.id);
}

function loadPerformanceWindows(): {
  current: SearchSnapshot;
  previous: SearchSnapshot | null;
  source: "store" | "fixture";
} {
  const currentStored = findSnapshotByLabel(CURRENT_LABEL);
  const previousStored = findSnapshotByLabel(PREVIOUS_LABEL);

  if (currentStored) {
    return {
      current: currentStored,
      previous: previousStored,
      source: "store",
    };
  }

  return {
    current: loadFixtureSnapshot(CURRENT_FIXTURE),
    previous: loadFixtureSnapshot(PREVIOUS_FIXTURE),
    source: "fixture",
  };
}

function detectFreshOpportunities(): SeoOpportunity[] {
  const { current, previous } = loadPerformanceWindows();
  const registry = buildContentRegistry();
  return detectAllOpportunities({
    currentRows: current.rows,
    previousRows: previous?.rows,
    registry,
    nowIso: current.meta.retrievedAt,
  });
}

/**
 * Prefer freshly detected opportunities (authoritative for fixtures).
 * Fall back to stored opportunities if detection returns empty but store has data.
 */
function getOpportunities(): SeoOpportunity[] {
  const detected = detectFreshOpportunities();
  if (detected.length > 0) return detected;
  const stored = listOpportunities();
  return stored.sort((a, b) => b.priorityScore - a.priorityScore);
}

function resolvePageInput(input: string): string {
  if (input.startsWith("content:")) {
    const parsed = parseContentId(input);
    return pathForContent(parsed.type, parsed.slug);
  }
  if (input.startsWith("/") || input.startsWith("http")) {
    return resolveSearchUrl(input).normalizedPath;
  }
  // Bare slug → software page
  return pathForContent("software", input);
}

function printOpportunity(o: SeoOpportunity, index?: number): void {
  const prefix = index != null ? `${index + 1}. ` : "";
  console.log(
    `${prefix}[${o.priorityScore}] ${o.type}  ${o.id}`,
  );
  console.log(`   status=${o.status}  confidence=${o.confidence}`);
  if (o.query) console.log(`   query: ${o.query}`);
  if (o.contentId) console.log(`   content: ${o.contentId}`);
  if (o.productSlugs.length) {
    console.log(`   products: ${o.productSlugs.join(", ")}`);
  }
  if (o.categorySlugs.length) {
    console.log(`   categories: ${o.categorySlugs.join(", ")}`);
  }
  const ev = o.evidence;
  const metrics: string[] = [];
  if (ev.impressions != null) metrics.push(`impr=${ev.impressions}`);
  if (ev.clicks != null) metrics.push(`clicks=${ev.clicks}`);
  if (ev.ctr != null) metrics.push(`ctr=${fmtPct(ev.ctr)}`);
  if (ev.position != null) metrics.push(`pos=${fmtPos(ev.position)}`);
  if (metrics.length) console.log(`   evidence: ${metrics.join("  ")}`);
  for (const note of ev.notes.slice(0, 3)) {
    console.log(`   note: ${note}`);
  }
  for (const reason of o.reasons.slice(0, 3)) {
    console.log(`   reason: ${reason}`);
  }
  for (const action of o.recommendedActions.slice(0, 3)) {
    console.log(
      `   action: [${action.effort}/${action.risk}] ${action.type} — ${action.description}`,
    );
  }
  console.log("");
}

async function cmdSync(fixture: boolean): Promise<void> {
  if (!fixture) {
    console.error("Only fixture sync is supported today. Use: sync --fixture");
    process.exit(1);
  }

  const currentFixture = loadFixtureSnapshot(CURRENT_FIXTURE);
  const previousFixture = loadFixtureSnapshot(PREVIOUS_FIXTURE);

  console.log("SYNTHETIC fixture sync — not live SoftwareGlimpse GSC data\n");

  const currentMeta = await syncSearchPerformance({
    provider: new FixtureSearchPerformanceProvider(CURRENT_FIXTURE),
    range: currentFixture.rows[0]?.dateRange ?? {
      startDate: "2026-07-17",
      endDate: "2026-08-13",
    },
    rangeLabel: CURRENT_LABEL,
    synthetic: true,
    label: currentFixture.label,
  });

  const previousMeta = await syncSearchPerformance({
    provider: new FixtureSearchPerformanceProvider(PREVIOUS_FIXTURE),
    range: previousFixture.rows[0]?.dateRange ?? {
      startDate: "2026-06-19",
      endDate: "2026-07-16",
    },
    rangeLabel: PREVIOUS_LABEL,
    synthetic: true,
    label: previousFixture.label,
  });

  console.log(`Synced current:  ${currentMeta.id}  (${currentFixture.rows.length} rows)`);
  console.log(`Synced previous: ${previousMeta.id}  (${previousFixture.rows.length} rows)`);

  const opportunities = detectAllOpportunities({
    currentRows: currentFixture.rows,
    previousRows: previousFixture.rows,
    registry: buildContentRegistry(),
    nowIso: currentFixture.meta.retrievedAt,
  });

  for (const opp of opportunities) {
    upsertOpportunity(opp);
  }

  console.log(`Upserted ${opportunities.length} opportunities (idempotent by id).`);
  console.log("\nDone. Run: npm run seo -- status");
}

function cmdStatus(): void {
  const { current, previous, source } = loadPerformanceWindows();
  const opportunities = getOpportunities();
  const totals = sumRows(current.rows);
  const prior = previous ? sumRows(previous.rows) : null;
  const report = buildStatusReport(opportunities, current.meta.retrievedAt);

  console.log("SEO status (28d)");
  console.log("─".repeat(56));
  if (current.synthetic || current.meta.source === "fixture") {
    console.log(
      "DATA: SYNTHETIC fixtures — not live SoftwareGlimpse Search Console",
    );
  }
  console.log(`Source: ${source}  snapshot=${current.meta.id}`);
  console.log(
    `Range:  ${current.meta.rangeLabel} through ${current.meta.dataThroughDate}`,
  );
  console.log(
    `Rows:   ${current.rows.length}  clicks=${totals.clicks}  impressions=${totals.impressions}  ctr=${fmtPct(totals.ctr)}`,
  );
  if (prior && previous) {
    const clickDelta =
      prior.clicks > 0
        ? (((totals.clicks - prior.clicks) / prior.clicks) * 100).toFixed(1)
        : "n/a";
    console.log(
      `Prior:  ${previous.meta.rangeLabel}  clicks=${prior.clicks}  impressions=${prior.impressions}  (Δclicks ${clickDelta}%)`,
    );
  }

  console.log("\nOpportunities");
  console.log(`Total: ${report.total}`);
  const byType = Object.entries(report.byType).sort((a, b) => b[1] - a[1]);
  for (const [type, count] of byType) {
    console.log(`  ${pad(type, 32)}${count}`);
  }
  if (byType.length === 0) {
    console.log("  (none — run sync --fixture first, or detection found no signals)");
  }

  console.log("\nTop by score");
  for (const t of report.top.slice(0, 5)) {
    console.log(`  [${t.priorityScore}] ${t.type}  ${t.id}`);
  }
}

function cmdOpportunities(typeFilter?: string): void {
  let opportunities = getOpportunities();
  if (typeFilter) {
    const parsed = SeoOpportunityTypeSchema.safeParse(typeFilter);
    if (!parsed.success) {
      console.error(
        `Unknown opportunity type: ${typeFilter}\nValid: ${SeoOpportunityTypeSchema.options.join(", ")}`,
      );
      process.exit(1);
    }
    opportunities = opportunities.filter((o) => o.type === parsed.data);
  }

  console.log(
    `Opportunities (${opportunities.length})${typeFilter ? ` type=${typeFilter}` : ""}`,
  );
  console.log("SYNTHETIC fixture-backed detection — not live GSC\n");

  if (opportunities.length === 0) {
    console.log("(none)");
    return;
  }

  opportunities.forEach((o, i) => printOpportunity(o, i));
}

function cmdPage(input?: string): void {
  if (!input) {
    console.error("Usage: page -- </path/ or content:type:slug>");
    process.exit(1);
  }
  const { current } = loadPerformanceWindows();
  const opportunities = getOpportunities();
  const pageRef = resolvePageInput(input);
  const report = buildPageReport(pageRef, current.rows, opportunities);

  console.log(`Page report: ${report.normalizedPath}`);
  if (report.contentId) console.log(`Content id: ${report.contentId}`);
  console.log(
    `Performance: clicks=${report.clicks}  impressions=${report.impressions}  ctr=${fmtPct(report.ctr)}  pos=${fmtPos(report.position)}`,
  );
  console.log("\nTop queries");
  if (report.topQueries.length === 0) {
    console.log("  (none in current window)");
  }
  for (const q of report.topQueries) {
    console.log(
      `  ${pad(q.query, 36)} clicks=${q.clicks}  impr=${q.impressions}`,
    );
  }
  console.log(`\nRelated opportunities (${report.relatedOpportunities.length})`);
  for (const o of report.relatedOpportunities.slice(0, 10)) {
    printOpportunity(o);
  }
}

function cmdQuery(query?: string): void {
  if (!query) {
    console.error('Usage: query -- "search phrase"');
    process.exit(1);
  }
  const { current } = loadPerformanceWindows();
  const opportunities = getOpportunities();
  const report = buildQueryReport(query, current.rows, opportunities);

  console.log(`Query report: "${report.query}"`);
  console.log(`Normalized: ${report.normalized}`);
  console.log(`Intent: ${report.intent}  cluster=${report.clusterKey}`);
  console.log(
    `Metrics: clicks=${report.clicks}  impressions=${report.impressions}  ctr=${fmtPct(report.ctr)}  pos=${fmtPos(report.position)}`,
  );
  console.log("\nPages");
  if (report.pages.length === 0) {
    console.log("  (no ranking pages in window — possible content gap)");
  }
  for (const p of report.pages) {
    console.log(`  ${pad(p.path, 40)} impr=${p.impressions}`);
  }
  console.log(`\nRelated opportunities (${report.relatedOpportunities.length})`);
  for (const o of report.relatedOpportunities) {
    printOpportunity(o);
  }
  if (
    report.pages.length === 0 &&
    report.relatedOpportunities.length === 0 &&
    report.intent === "comparison"
  ) {
    console.log(
      "Hint: comparison intent with no page — check comparison-opportunity / missing-content detectors.",
    );
  }
}

function cmdGaps(slug?: string): void {
  if (!slug) {
    console.error("Usage: gaps -- <product-or-category-slug>");
    process.exit(1);
  }
  const opportunities = getOpportunities();
  const software = getSoftwareBySlug(slug);
  const category = getCategoryBySlug(slug);

  if (software && !category) {
    const report = buildProductGapReport(slug, opportunities);
    printGap(report);
    return;
  }
  if (category && !software) {
    const report = buildCategoryGapReport(slug, opportunities);
    printGap(report);
    return;
  }
  if (software && category) {
    // Prefer product when both exist (unlikely for same slug).
    printGap(buildProductGapReport(slug, opportunities));
    return;
  }

  // Heuristic: try product first, then category-shaped filter.
  if (slug === "crm" || slug.includes("/")) {
    printGap(buildCategoryGapReport(slug, opportunities));
  } else {
    printGap(buildProductGapReport(slug, opportunities));
  }
}

function printGap(report: {
  scope: string;
  slug: string;
  opportunities: SeoOpportunity[];
  missingTypes: string[];
}): void {
  console.log(`Gap report (${report.scope}): ${report.slug}`);
  console.log(`Related opportunities: ${report.opportunities.length}`);
  console.log(
    `Gap types present: ${report.missingTypes.length ? report.missingTypes.join(", ") : "(none)"}`,
  );
  console.log("");
  for (const o of report.opportunities) {
    printOpportunity(o);
  }
}

function cmdLinks(slug?: string): void {
  if (!slug) {
    console.error("Usage: links -- <product-or-category-slug>");
    process.exit(1);
  }
  const opportunities = getOpportunities().filter(
    (o) =>
      o.type === "internal-link-opportunity" &&
      (o.productSlugs.includes(slug) ||
        o.categorySlugs.includes(slug) ||
        o.contentId?.includes(`:${slug}`) ||
        o.evidence.pages.some((p) => p.includes(`/${slug}/`)) ||
        o.reasons.some((r) => r.toLowerCase().includes(slug))),
  );

  console.log(`Internal link suggestions for "${slug}" (${opportunities.length})`);
  console.log("");
  if (opportunities.length === 0) {
    console.log("(none detected in current window)");
    return;
  }
  for (const o of opportunities) {
    printOpportunity(o);
  }
}

function cmdQuickWins(): void {
  const opportunities = getOpportunities().filter((o) => {
    const smallEffort = o.recommendedActions.some((a) => a.effort === "small");
    return smallEffort && o.priorityScore >= 40;
  });

  console.log(`Quick wins (small effort, score ≥ 40): ${opportunities.length}`);
  console.log("");
  if (opportunities.length === 0) {
    console.log("(none)");
    return;
  }
  for (const o of opportunities) {
    printOpportunity(o);
  }
}

function cmdValidate(): void {
  const issues: Array<{ severity: "error" | "warn"; message: string }> = [];

  let current: SearchSnapshot;
  let previous: SearchSnapshot;
  try {
    current = loadFixtureSnapshot(CURRENT_FIXTURE);
    previous = loadFixtureSnapshot(PREVIOUS_FIXTURE);
  } catch (err) {
    console.error(`ERROR fixture load: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  if (!current.synthetic) {
    issues.push({
      severity: "error",
      message: "Current fixture must set synthetic: true",
    });
  }
  if (!previous.synthetic) {
    issues.push({
      severity: "error",
      message: "Previous fixture must set synthetic: true",
    });
  }
  if (current.meta.source !== "fixture" || previous.meta.source !== "fixture") {
    issues.push({
      severity: "error",
      message: "Fixture meta.source must be 'fixture'",
    });
  }

  const registry = buildContentRegistry();
  const runA = detectAllOpportunities({
    currentRows: current.rows,
    previousRows: previous.rows,
    registry,
    nowIso: current.meta.retrievedAt,
  });
  const runB = detectAllOpportunities({
    currentRows: current.rows,
    previousRows: previous.rows,
    registry,
    nowIso: current.meta.retrievedAt,
  });

  const idsA = runA.map((o) => o.id).sort();
  const idsB = runB.map((o) => o.id).sort();
  if (idsA.join("\n") !== idsB.join("\n")) {
    issues.push({
      severity: "error",
      message: "Opportunity ids are not stable across identical detection runs",
    });
  }

  const expectedComparisonId = opportunityIdForComparison(["pipedrive", "close"]);
  if (!runA.some((o) => o.id === expectedComparisonId || o.type === "comparison-opportunity")) {
    issues.push({
      severity: "warn",
      message: `Expected comparison opportunity for pipedrive vs close (id ${expectedComparisonId})`,
    });
  }

  const noiseOpps = runA.filter(
    (o) =>
      o.query?.includes("xyz obscure noise") ||
      o.evidence.notes.some((n) => n.includes("xyz obscure noise")),
  );
  if (noiseOpps.length > 0) {
    issues.push({
      severity: "error",
      message: `Tiny-sample noise query created ${noiseOpps.length} opportunity(ies) — minImpressions=${seoThresholds.minImpressions}`,
    });
  }

  const tinyRows = current.rows.filter(
    (r) => (r.impressions ?? 0) < seoThresholds.minImpressions,
  );
  for (const row of tinyRows) {
    const matched = runA.filter(
      (o) =>
        o.query === row.query &&
        (o.type === "striking-distance" ||
          o.type === "high-impression-low-ctr" ||
          o.type === "high-impression-no-click"),
    );
    if (matched.length > 0) {
      issues.push({
        severity: "error",
        message: `Opportunity from below-threshold sample: query="${row.query}" impr=${row.impressions}`,
      });
    }
  }

  console.log("SEO intelligence validate");
  console.log("─".repeat(56));
  console.log(
    `Fixtures: current=${current.rows.length} rows, previous=${previous.rows.length} rows`,
  );
  console.log(`Detections: ${runA.length} opportunities (stable ids: ${idsA.length === idsB.length ? "ok" : "FAIL"})`);
  console.log(`Noise guard: minImpressions=${seoThresholds.minImpressions}`);

  for (const issue of issues) {
    console.log(`${issue.severity.toUpperCase()} ${issue.message}`);
  }

  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    console.error(`\nValidation failed with ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(
    `\nValidation passed (${issues.filter((i) => i.severity === "warn").length} warning(s)).`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "sync":
      await cmdSync(args.fixture);
      break;
    case "status":
      cmdStatus();
      break;
    case "opportunities":
      cmdOpportunities(args.type);
      break;
    case "page":
      cmdPage(args.positional[0]);
      break;
    case "query":
      cmdQuery(args.positional[0]);
      break;
    case "gaps":
      cmdGaps(args.positional[0]);
      break;
    case "links":
      cmdLinks(args.positional[0]);
      break;
    case "quick-wins":
      cmdQuickWins();
      break;
    case "validate":
      cmdValidate();
      break;
    default:
      console.error(`Unknown command: ${args.command}`);
      usage();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
