import fs from "node:fs";
import path from "node:path";
import type { QueryBenchmark } from "../competitive-benchmark/types";
import type { GapInputs } from "./load-inputs";
import type {
  CompetitiveAction,
  CompetitiveGapReport,
  GapFinding,
  GapType,
  QueryAction,
  QueryGap,
  Stance,
} from "./types";

const DIM_TO_GAP: Array<{
  gapType: GapType;
  keys: string[];
}> = [
  { gapType: "CONTENT_DEPTH_GAP", keys: ["content-depth"] },
  { gapType: "EVIDENCE_GAP", keys: ["evidence"] },
  { gapType: "MEDIA_GAP", keys: ["product-screenshots", "video"] },
  { gapType: "TOOL_GAP", keys: ["tools", "calculators"] },
  { gapType: "RESOURCE_GAP", keys: ["templates-resources"] },
  { gapType: "INTERNAL_LINK_GAP", keys: ["internal-links"] },
  { gapType: "FRESHNESS_GAP", keys: ["freshness"] },
  { gapType: "TRUST_GAP", keys: ["author-trust", "source-transparency"] },
  { gapType: "UX_GAP", keys: ["ux", "mobile"] },
  {
    gapType: "CONTENT_DIFFERENTIATION_GAP",
    keys: ["content-differentiation", "original-value"],
  },
];

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function meanKeys(
  dims: Record<string, number | null | undefined>,
  keys: string[],
): number | null {
  const vals = keys
    .map((k) => dims[k])
    .filter((n): n is number => typeof n === "number");
  return avg(vals);
}

function stanceFromDelta(delta: number | null, missing = false): Stance {
  if (missing) return "MISSING";
  if (delta == null) return "COMPARABLE";
  if (delta >= 12) return "STRONGER";
  if (delta <= -12) return "WEAKER";
  return "COMPARABLE";
}

function overallRowStrength(dims: Record<string, number | null>): number | null {
  const vals = Object.values(dims).filter((n): n is number => typeof n === "number");
  return avg(vals);
}

function normalizePath(p: string | null | undefined): string | null {
  if (!p) return null;
  let x = p.trim();
  if (!x.startsWith("/")) x = `/${x}`;
  if (!x.endsWith("/")) x = `${x}/`;
  return x;
}

function pageExists(
  scores: GapInputs["scores"],
  page: string | null,
): boolean {
  const p = normalizePath(page);
  if (!p) return false;
  if (scores) {
    if (
      scores.pages[p] ||
      scores.pages[p.replace(/\/$/, "")] ||
      scores.pages[`${p.replace(/\/$/, "")}/`]
    ) {
      return true;
    }
  }
  // Route may exist without a CQ score snapshot entry
  const rel = p.replace(/\/$/, "");
  const candidates = [
    path.join(process.cwd(), "src/app/(site)", rel, "page.tsx"),
    path.join(process.cwd(), "src/app", rel, "page.tsx"),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

function pageScore(
  scores: GapInputs["scores"],
  page: string | null,
): { score: number | null; band: string | null } {
  const p = normalizePath(page);
  if (!p || !scores) return { score: null, band: null };
  const hit =
    scores.pages[p] ??
    scores.pages[p.replace(/\/$/, "")] ??
    scores.pages[`${p.replace(/\/$/, "")}/`];
  if (!hit) return { score: null, band: null };
  return { score: hit.score, band: hit.band };
}

function chooseAction(input: {
  pageExists: boolean;
  quality: number | null;
  intentMatch: number | null;
  stance: Stance;
  sgStrength: number | null;
  compStrength: number | null;
  query: string;
  page: string | null;
}): QueryAction {
  if (!input.pageExists) return "create-new";

  // Wrong page association: hub uses a specific compare for broad "crm comparison"
  if (
    input.query === "crm comparison" &&
    input.page?.includes("hubspot-vs-pipedrive")
  ) {
    return "create-new";
  }
  if (
    input.query === "crm implementation" &&
    input.page?.includes("migration")
  ) {
    return "create-new";
  }

  if (input.stance === "STRONGER" && (input.quality == null || input.quality >= 80)) {
    return "no-action";
  }
  if (
    input.stance === "COMPARABLE" &&
    input.quality != null &&
    input.quality >= 85 &&
    (input.intentMatch == null || input.intentMatch >= 70)
  ) {
    return "no-action";
  }
  if (input.quality != null && input.quality < 80) return "improve-existing";
  if (input.stance === "WEAKER") return "improve-existing";
  if (input.intentMatch != null && input.intentMatch < 60) return "improve-existing";
  return "improve-existing";
}

function analyzeQuery(
  seed: GapInputs["seeds"][number],
  bench: QueryBenchmark | undefined,
  scores: GapInputs["scores"],
): QueryGap {
  const page = seed.associatedPage;
  const exists = pageExists(scores, page);
  const { score: qualityScore, band: qualityBand } = pageScore(scores, page);

  const sgRow = bench?.rows.find((r) => r.domain === "softwareglimpse.com");
  const compRows =
    bench?.rows.filter((r) => r.domain !== "softwareglimpse.com") ?? [];

  const intentMatchScore =
    (sgRow?.dimensions["search-intent-alignment"] as number | null | undefined) ??
    null;

  const sgBenchmarkStrength = sgRow
    ? overallRowStrength(sgRow.dimensions)
    : null;
  const competitorAvgStrength = avg(
    compRows
      .map((r) => overallRowStrength(r.dimensions))
      .filter((n): n is number => n != null),
  );

  const dimensionGaps: QueryGap["dimensionGaps"] = [];
  for (const map of DIM_TO_GAP) {
    const sg = sgRow ? meanKeys(sgRow.dimensions, map.keys) : null;
    const compVals = compRows
      .map((r) => meanKeys(r.dimensions, map.keys))
      .filter((n): n is number => n != null);
    const competitorAvg = avg(compVals);
    const delta =
      sg != null && competitorAvg != null ? sg - competitorAvg : null;
    dimensionGaps.push({
      gapType: map.gapType,
      stance: stanceFromDelta(delta, !exists),
      sg,
      competitorAvg,
      delta,
    });
  }

  let stance: Stance;
  if (!exists) stance = "MISSING";
  else if (
    sgBenchmarkStrength != null &&
    competitorAvgStrength != null
  ) {
    stance = stanceFromDelta(sgBenchmarkStrength - competitorAvgStrength);
  } else if (qualityScore != null && qualityScore >= 88) {
    stance = "STRONGER";
  } else if (qualityScore != null && qualityScore < 78) {
    stance = "WEAKER";
  } else {
    stance = "COMPARABLE";
  }

  const action = chooseAction({
    pageExists: exists,
    quality: qualityScore,
    intentMatch: intentMatchScore,
    stance,
    sgStrength: sgBenchmarkStrength,
    compStrength: competitorAvgStrength,
    query: seed.query,
    page,
  });

  const rationaleParts: string[] = [];
  if (!exists) {
    rationaleParts.push("No matching SoftwareGlimpse page in CQ inventory for this query seed");
  } else {
    rationaleParts.push(
      `Matching page ${page} (CQ ${qualityScore ?? "n/a"} ${qualityBand ?? ""})`.trim(),
    );
  }
  if (intentMatchScore != null) {
    rationaleParts.push(`Intent alignment proxy ${intentMatchScore}`);
  }
  if (sgBenchmarkStrength != null && competitorAvgStrength != null) {
    rationaleParts.push(
      `Benchmark strength SG ${sgBenchmarkStrength} vs competitor avg ${competitorAvgStrength}`,
    );
  }
  rationaleParts.push(`Recommended action: ${action}`);

  return {
    query: seed.query,
    intent: seed.intent,
    matchingPage: page,
    pageExists: exists,
    intentMatchScore,
    qualityScore,
    qualityBand,
    competitorAvgStrength,
    sgBenchmarkStrength,
    stance,
    action,
    rationale: rationaleParts.join(". "),
    dimensionGaps,
  };
}

function findingId(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

/**
 * Build competitive gap report. Never recommends feature-copy without user value.
 */
export function analyzeCompetitiveGaps(
  inputs: GapInputs,
  generatedAt: string,
): CompetitiveGapReport {
  const benchByQuery = new Map(
    (inputs.benchmark?.benchmarks ?? []).map((b) => [
      b.query.toLowerCase(),
      b,
    ]),
  );

  // Prefer seeds that appear in SERP with results OR have benchmark rows
  const serpWithHits = new Set(
    inputs.serp.byQuery
      .filter((q) => q.competitors.length > 0)
      .map((q) => q.query.toLowerCase()),
  );

  const queryGaps: QueryGap[] = [];
  for (const seed of inputs.seeds) {
    if (
      !serpWithHits.has(seed.query.toLowerCase()) &&
      !benchByQuery.has(seed.query.toLowerCase())
    ) {
      // Still include priority seeds with associated pages for coverage view
      if (
        ![
          "best crm software",
          "hubspot vs pipedrive",
          "crm migration",
          "crm evaluation checklist",
          "how to choose crm",
          "hubspot review",
          "crm comparison",
          "crm implementation",
          "crm for financial services",
        ].includes(seed.query)
      ) {
        continue;
      }
    }
    queryGaps.push(
      analyzeQuery(seed, benchByQuery.get(seed.query.toLowerCase()), inputs.scores),
    );
  }

  const advantages: GapFinding[] = [];
  const competitorStronger: GapFinding[] = [];
  const missingTopics: GapFinding[] = [];
  const weakPages: GapFinding[] = [];
  const missingTools: GapFinding[] = [];
  const missingResources: GapFinding[] = [];
  const missingMedia: GapFinding[] = [];
  const differentiation: GapFinding[] = [];

  let advN = 0;
  let weakN = 0;
  let missN = 0;

  for (const q of queryGaps) {
    if (q.stance === "STRONGER") {
      advN += 1;
      advantages.push({
        id: findingId("ADV", advN),
        gapType: "CONTENT_DIFFERENTIATION_GAP",
        stance: "STRONGER",
        title: `Stronger on “${q.query}”`,
        detail: q.rationale,
        query: q.query,
        sgPage: q.matchingPage,
        sgScore: q.sgBenchmarkStrength ?? q.qualityScore,
        competitorAvg: q.competitorAvgStrength,
        delta:
          q.sgBenchmarkStrength != null && q.competitorAvgStrength != null
            ? q.sgBenchmarkStrength - q.competitorAvgStrength
            : null,
        userValue:
          "Keep decision-criteria depth and avoid diluting with thinner marketplace-style list volume",
        priority: 40 + advN,
      });
    }

    if (q.stance === "MISSING" || q.action === "create-new") {
      missN += 1;
      missingTopics.push({
        id: findingId("MISS", missN),
        gapType: "QUERY_COVERAGE_GAP",
        stance: "MISSING",
        title: `Coverage gap for “${q.query}”`,
        detail: q.rationale,
        query: q.query,
        sgPage: q.matchingPage,
        userValue:
          "Users searching this query need a purpose-built page (or clear hub) — not a mismatched sibling URL",
        priority: 10 + missN,
      });
    }

    if (
      q.pageExists &&
      (q.stance === "WEAKER" ||
        (q.qualityScore != null && q.qualityScore < 82) ||
        q.action === "improve-existing")
    ) {
      weakN += 1;
      weakPages.push({
        id: findingId("WEAK", weakN),
        gapType: "CONTENT_DEPTH_GAP",
        stance: q.stance === "WEAKER" ? "WEAKER" : "COMPARABLE",
        title: `Strengthen ${q.matchingPage ?? q.query}`,
        detail: q.rationale,
        query: q.query,
        sgPage: q.matchingPage,
        sgScore: q.qualityScore,
        competitorAvg: q.competitorAvgStrength,
        userValue: "Improve decision usefulness on the existing URL before creating duplicates",
        priority: 20 + weakN,
      });
    }

    for (const d of q.dimensionGaps) {
      if (d.stance === "STRONGER" && d.delta != null && d.delta >= 12) {
        advN += 1;
        advantages.push({
          id: findingId("ADV", advN),
          gapType: d.gapType,
          stance: "STRONGER",
          title: `${d.gapType.replace(/_/g, " ")} advantage on “${q.query}”`,
          detail: `SG ${d.sg} vs competitor avg ${d.competitorAvg} (Δ ${d.delta})`,
          query: q.query,
          sgPage: q.matchingPage,
          sgScore: d.sg,
          competitorAvg: d.competitorAvg,
          delta: d.delta,
          userValue: userValueForGap(d.gapType, "STRONGER"),
          priority: 50 + advN,
        });
      }
      if (d.stance === "WEAKER" && d.delta != null && d.delta <= -12) {
        const finding: GapFinding = {
          id: findingId("COMP", competitorStronger.length + 1),
          gapType: d.gapType,
          stance: "WEAKER",
          title: `${d.gapType.replace(/_/g, " ")} — competitors ahead on “${q.query}”`,
          detail: `SG ${d.sg} vs competitor avg ${d.competitorAvg} (Δ ${d.delta})`,
          query: q.query,
          sgPage: q.matchingPage,
          sgScore: d.sg,
          competitorAvg: d.competitorAvg,
          delta: d.delta,
          userValue: userValueForGap(d.gapType, "WEAKER"),
          priority: 15 + competitorStronger.length,
        };

        // Feature vs value: reject "list more products" style media/depth copy
        if (d.gapType === "CONTENT_DEPTH_GAP" && q.query.includes("best")) {
          finding.rejectedFeatureCopy = true;
          finding.rejectedFeatureNote =
            "Do not expand to “Top 50 CRMs” merely because marketplaces list dozens — deepen criteria, trade-offs, and evidence for a curated set";
          finding.userValue =
            "Users need trustworthy shortlists with rationale, not maximum vendor count";
        }

        competitorStronger.push(finding);

        if (d.gapType === "TOOL_GAP" || d.gapType === "RESOURCE_GAP") {
          const bucket =
            d.gapType === "TOOL_GAP" ? missingTools : missingResources;
          bucket.push({
            ...finding,
            id: findingId(d.gapType === "TOOL_GAP" ? "TOOL" : "RES", bucket.length + 1),
            title:
              d.gapType === "TOOL_GAP"
                ? `Tool gap on “${q.query}”`
                : `Resource gap on “${q.query}”`,
          });
        }
        if (d.gapType === "MEDIA_GAP") {
          missingMedia.push({
            ...finding,
            id: findingId("MEDIA", missingMedia.length + 1),
            title: `Media gap on “${q.query}”`,
            rejectedFeatureCopy: true,
            rejectedFeatureNote:
              "Add screenshots/video only where they clarify product reality — not decorative stock parity",
          });
        }
        if (d.gapType === "CONTENT_DIFFERENTIATION_GAP") {
          differentiation.push({
            ...finding,
            id: findingId("DIFF", differentiation.length + 1),
            stance: "WEAKER",
            title: `Differentiation opportunity on “${q.query}”`,
          });
        }
      }
    }
  }

  // Map-driven missing tools/resources (user value aligned)
  for (const item of inputs.mapMissing) {
    if (/TOOL|ROI|Calculator|Builder|Assessment|Selector/i.test(item.id + item.title)) {
      missingTools.push({
        id: findingId("TOOL", missingTools.length + 1),
        gapType: "TOOL_GAP",
        stance: "MISSING",
        title: `Map-missing tool: ${item.title}`,
        detail: `${item.id} (${item.priority}) — not yet implemented`,
        sgPage: item.path ?? null,
        userValue:
          "Interactive decision aids reduce research friction when they encode real evaluation logic",
        priority: item.priority === "P0" ? 5 : item.priority === "P1" ? 8 : 25,
      });
    } else if (/RES|worksheet|checklist|RFP|UAT/i.test(item.id + item.title)) {
      missingResources.push({
        id: findingId("RES", missingResources.length + 1),
        gapType: "RESOURCE_GAP",
        stance: "MISSING",
        title: `Map-missing resource: ${item.title}`,
        detail: `${item.id} (${item.priority})`,
        sgPage: item.path ?? null,
        userValue: "Downloadable worksheets help buyers run a real evaluation process",
        priority: item.priority === "P1" ? 9 : 26,
      });
    } else {
      missingTopics.push({
        id: findingId("MISS", missingTopics.length + 1),
        gapType: "QUERY_COVERAGE_GAP",
        stance: "MISSING",
        title: `Map gap: ${item.title}`,
        detail: `${item.id} (${item.priority})`,
        sgPage: item.path ?? null,
        userValue: "Content map coverage closes journey holes buyers hit after SERP entry",
        priority: item.priority === "P0" ? 6 : 18,
      });
    }
  }

  for (const item of inputs.mapThin.slice(0, 12)) {
    if (weakPages.some((w) => w.sgPage && item.path && w.sgPage === item.path)) {
      continue;
    }
    weakPages.push({
      id: findingId("WEAK", weakPages.length + 1),
      gapType: "CONTENT_DEPTH_GAP",
      stance: "WEAKER",
      title: `Thin map row: ${item.title}`,
      detail: `${item.id} (${item.priority}) needs research depth`,
      sgPage: item.path ?? null,
      userValue: "Thin pages under-serve users who arrive with high commercial intent",
      priority: item.priority === "P0" ? 7 : 22,
    });
  }

  // Explicit differentiation opportunities (advantages to lean into)
  for (const q of queryGaps) {
    const toolGap = q.dimensionGaps.find((d) => d.gapType === "TOOL_GAP");
    const diffGap = q.dimensionGaps.find(
      (d) => d.gapType === "CONTENT_DIFFERENTIATION_GAP",
    );
    if (toolGap?.stance === "STRONGER" || diffGap?.stance === "STRONGER") {
      differentiation.push({
        id: findingId("DIFF", differentiation.length + 1),
        gapType: "CONTENT_DIFFERENTIATION_GAP",
        stance: "STRONGER",
        title: `Lean into decision-tool differentiation on “${q.query}”`,
        detail:
          "SoftwareGlimpse can win with planners/checklists/trade-off frameworks rather than marketplace volume",
        query: q.query,
        sgPage: q.matchingPage,
        userValue:
          "Buyers remember tools that help them decide — not longer vendor lists",
        rejectedFeatureCopy: true,
        rejectedFeatureNote:
          "Rejected: copying “Top 50 CRMs” / review-count theater from marketplaces",
        priority: 30,
      });
    }
  }

  // Deduplicate advantages by title
  const uniq = <T extends { title: string }>(arr: T[]): T[] => {
    const seen = new Set<string>();
    return arr.filter((x) => {
      if (seen.has(x.title)) return false;
      seen.add(x.title);
      return true;
    });
  };

  const reportBase = {
    advantages: uniq(advantages).sort((a, b) => a.priority - b.priority),
    competitorStronger: uniq(competitorStronger).sort(
      (a, b) => a.priority - b.priority,
    ),
    missingTopics: uniq(missingTopics).sort((a, b) => a.priority - b.priority),
    weakPages: uniq(weakPages).sort((a, b) => a.priority - b.priority),
    missingTools: uniq(missingTools).sort((a, b) => a.priority - b.priority),
    missingResources: uniq(missingResources).sort(
      (a, b) => a.priority - b.priority,
    ),
    missingMedia: uniq(missingMedia).sort((a, b) => a.priority - b.priority),
    differentiation: uniq(differentiation).sort(
      (a, b) => a.priority - b.priority,
    ),
  };

  const topActions = buildTopActions(reportBase, queryGaps);

  return {
    generatedAt,
    cluster: "crm",
    sources: inputs.sources,
    ...reportBase,
    queryGaps,
    topActions,
    notes: [
      "Gaps derived from Content Intelligence scores, SERP competitors, competitive benchmark, and CRM map coverage",
      "Stance is relative to sampled ranking pages — not a traffic or DA claim",
      inputs.benchmark
        ? `Benchmark mode: ${inputs.benchmark.observationMode}`
        : "Benchmark JSON missing — query dimension gaps limited",
    ],
    disclaimers: [
      "Do not copy competitor features without user-value rationale",
      "Curated depth beats list-volume theater for SoftwareGlimpse positioning",
      "No traffic, conversion, backlinks, or revenue claims",
    ],
  };
}

function userValueForGap(gapType: GapType, stance: Stance): string {
  const weaker: Record<GapType, string> = {
    CONTENT_DEPTH_GAP:
      "Add decision depth (criteria, trade-offs, scenarios) — not filler word count",
    EVIDENCE_GAP:
      "Cite primary pricing/docs and show methodology so buyers can trust claims",
    MEDIA_GAP:
      "Use product screenshots/video where they reduce ambiguity about UI/workflows",
    TOOL_GAP:
      "Ship interactive planners/calculators that encode evaluation logic users reuse",
    RESOURCE_GAP:
      "Provide checklists/templates buyers can take into vendor meetings",
    QUERY_COVERAGE_GAP: "Match the query with a purpose-built page",
    INTERNAL_LINK_GAP:
      "Connect journey stages so users can move from education → evaluation → choose",
    FRESHNESS_GAP: "Show visible update dates when pricing/features change",
    TRUST_GAP: "Surface authors, disclosures, and scoring methodology",
    UX_GAP: "Improve scannability and mobile readability of decision modules",
    CONTENT_DIFFERENTIATION_GAP:
      "Differentiate with decision frameworks — not marketplace mimicry",
  };
  if (stance === "STRONGER") {
    return "Protect and showcase this advantage in internal links and hub modules";
  }
  return weaker[gapType];
}

function buildTopActions(
  buckets: {
    advantages: GapFinding[];
    competitorStronger: GapFinding[];
    missingTopics: GapFinding[];
    weakPages: GapFinding[];
    missingTools: GapFinding[];
    missingResources: GapFinding[];
    missingMedia: GapFinding[];
    differentiation: GapFinding[];
  },
  queryGaps: QueryGap[],
): CompetitiveAction[] {
  const actions: CompetitiveAction[] = [];

  const push = (a: Omit<CompetitiveAction, "rank">) => {
    actions.push({ ...a, rank: actions.length + 1 });
  };

  for (const m of buckets.missingTopics.slice(0, 10)) {
    push({
      title: m.title,
      action: "create-new",
      gapType: m.gapType,
      query: m.query,
      page: m.sgPage,
      why: m.detail,
      userValue: m.userValue,
      notRecommended: m.rejectedFeatureNote,
    });
  }
  for (const t of buckets.missingTools.slice(0, 8)) {
    push({
      title: t.title,
      action: "add-tool",
      gapType: t.gapType,
      query: t.query,
      page: t.sgPage,
      why: t.detail,
      userValue: t.userValue,
    });
  }
  for (const r of buckets.missingResources.slice(0, 6)) {
    push({
      title: r.title,
      action: "add-resource",
      gapType: r.gapType,
      query: r.query,
      page: r.sgPage,
      why: r.detail,
      userValue: r.userValue,
    });
  }
  for (const w of buckets.weakPages.slice(0, 12)) {
    push({
      title: w.title,
      action: "improve-existing",
      gapType: w.gapType,
      query: w.query,
      page: w.sgPage,
      why: w.detail,
      userValue: w.userValue,
      notRecommended: w.rejectedFeatureNote,
    });
  }
  for (const m of buckets.missingMedia.slice(0, 5)) {
    push({
      title: m.title,
      action: "add-media",
      gapType: m.gapType,
      query: m.query,
      page: m.sgPage,
      why: m.detail,
      userValue: m.userValue,
      notRecommended: m.rejectedFeatureNote,
    });
  }
  for (const d of buckets.differentiation.slice(0, 6)) {
    push({
      title: d.title,
      action: d.stance === "STRONGER" ? "strengthen-advantage" : "differentiate",
      gapType: d.gapType,
      query: d.query,
      page: d.sgPage,
      why: d.detail,
      userValue: d.userValue,
      notRecommended: d.rejectedFeatureNote,
    });
  }
  for (const a of buckets.advantages.slice(0, 8)) {
    push({
      title: `Protect advantage: ${a.title}`,
      action: "strengthen-advantage",
      gapType: a.gapType,
      query: a.query,
      page: a.sgPage,
      why: a.detail,
      userValue: a.userValue,
    });
  }

  // Ensure query-level actions represented
  for (const q of queryGaps) {
    if (actions.length >= 50) break;
    if (q.action === "no-action") continue;
    if (actions.some((a) => a.query === q.query && a.page === q.matchingPage)) {
      continue;
    }
    push({
      title: `${q.action} for “${q.query}”`,
      action: q.action,
      gapType: "QUERY_COVERAGE_GAP",
      query: q.query,
      page: q.matchingPage,
      why: q.rationale,
      userValue: "Align page purpose with the query users actually search",
    });
  }

  return actions.slice(0, 50).map((a, i) => ({ ...a, rank: i + 1 }));
}
