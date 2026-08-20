/**
 * Inspect SoftwareGlimpse research corpora for citation-ready dimensions.
 * Counts are computed from on-disk enrichment files — never invented.
 */

import fs from "node:fs";
import path from "node:path";
import type { DataInventoryItem } from "./types";

export type ResearchCorpusSnapshot = {
  productCount: number;
  planCount: number;
  featureSupportRows: number;
  availabilityMix: Record<string, number>;
  topGatedFeatures: Array<{ featureSlug: string; count: number }>;
  aiCapabilityRows: number;
  hasFreePlan: number;
  hasFreeTrial: number;
  pricingVerified: number;
  editorialAssessmentCount: number;
  scannedAt: string;
};

function researchRoot(): string {
  return path.join(process.cwd(), "src", "data", "research");
}

/**
 * Live scan of enrichment.json files under src/data/research.
 */
export function scanResearchCorpus(
  scannedAt = new Date().toISOString(),
): ResearchCorpusSnapshot {
  const root = researchRoot();
  const dirs = fs.existsSync(root)
    ? fs
        .readdirSync(root)
        .filter((d) =>
          fs.existsSync(path.join(root, d, "enrichment.json")),
        )
    : [];

  let planCount = 0;
  let featureSupportRows = 0;
  let aiCapabilityRows = 0;
  let hasFreePlan = 0;
  let hasFreeTrial = 0;
  let pricingVerified = 0;
  const availabilityMix: Record<string, number> = {};
  const gated: Record<string, number> = {};

  for (const d of dirs) {
    const raw = fs.readFileSync(
      path.join(root, d, "enrichment.json"),
      "utf8",
    );
    const e = JSON.parse(raw) as {
      pricing?: {
        plans?: unknown[];
        hasFreePlan?: boolean;
        hasFreeTrial?: boolean;
        verifiedAt?: string;
      };
      featureSupport?: Array<{
        featureSlug?: string;
        availability?: string;
      }>;
      aiCapabilities?: unknown[];
    };

    planCount += e.pricing?.plans?.length ?? 0;
    if (e.pricing?.hasFreePlan) hasFreePlan += 1;
    if (e.pricing?.hasFreeTrial) hasFreeTrial += 1;
    if (e.pricing?.verifiedAt) pricingVerified += 1;

    for (const row of e.featureSupport ?? []) {
      featureSupportRows += 1;
      const a = row.availability ?? "unknown";
      availabilityMix[a] = (availabilityMix[a] ?? 0) + 1;
      if (a === "higher-plan-only" && row.featureSlug) {
        gated[row.featureSlug] = (gated[row.featureSlug] ?? 0) + 1;
      }
    }
    aiCapabilityRows += e.aiCapabilities?.length ?? 0;
  }

  const assessmentsDir = path.join(
    process.cwd(),
    "src",
    "data",
    "editorial",
    "assessments",
  );
  const editorialAssessmentCount = fs.existsSync(assessmentsDir)
    ? fs.readdirSync(assessmentsDir).filter((f) => f.endsWith(".json")).length
    : 0;

  const topGatedFeatures = Object.entries(gated)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([featureSlug, count]) => ({ featureSlug, count }));

  return {
    productCount: dirs.length,
    planCount,
    featureSupportRows,
    availabilityMix,
    topGatedFeatures,
    aiCapabilityRows,
    hasFreePlan,
    hasFreeTrial,
    pricingVerified,
    editorialAssessmentCount,
    scannedAt,
  };
}

export function buildDataInventory(
  corpus: ResearchCorpusSnapshot,
): DataInventoryItem[] {
  const gatedSummary =
    corpus.topGatedFeatures.length > 0
      ? corpus.topGatedFeatures
          .slice(0, 5)
          .map((g) => `${g.featureSlug} (${g.count})`)
          .join(", ")
      : "none detected";

  return [
    {
      id: "pricing-enrichment",
      label: "CRM list pricing & plan rules",
      pathOrSource: "src/data/research/*/enrichment.json → pricing",
      dimensions: [
        "plans",
        "per-seat / flat / tiered rules",
        "billing period",
        "currency",
        "free plan / trial flags",
        "verifiedAt",
      ],
      approximateScale: `${corpus.productCount} products · ${corpus.planCount} plans · ${corpus.pricingVerified} with pricing.verifiedAt · free plan ${corpus.hasFreePlan}/${corpus.productCount} · free trial ${corpus.hasFreeTrial}/${corpus.productCount}`,
      citeableAs:
        "Dated SoftwareGlimpse researched set: list prices, team-cost recomputes via pricing engine, free/trial prevalence — with methodology and as-of dates.",
      notCiteableAs:
        "Market-wide average buyer spend, negotiated discounts, renewal uplift, or longitudinal price history (not stored).",
    },
    {
      id: "feature-gating",
      label: "Feature availability / plan gating matrix",
      pathOrSource: "enrichment.featureSupport + src/data/seed/features.ts",
      dimensions: [
        "availability (supported | limited | higher-plan-only | add-on | not-supported | unknown)",
        "planSlugs",
        "featureSlug",
        "sourceIds",
      ],
      approximateScale: `${corpus.featureSupportRows} rows · mix ${JSON.stringify(corpus.availabilityMix)} · top higher-plan-only: ${gatedSummary}`,
      citeableAs:
        "Share of researched CRMs where specific features are plan-gated or limited — sourced feature matrix, not survey.",
      notCiteableAs:
        "Buyer preference rankings or 'most wanted features' without a survey corpus.",
    },
    {
      id: "ai-capabilities",
      label: "CRM AI capability labels",
      pathOrSource: "enrichment.aiCapabilities",
      dimensions: ["capability type", "availability", "notes", "sourceIds"],
      approximateScale: `${corpus.aiCapabilityRows} capability rows across ${corpus.productCount} products`,
      citeableAs:
        "Which researched CRMs list which AI capability types as supported / limited / gated — availability comparison only.",
      notCiteableAs:
        "AI accuracy, ROI, adoption rates, or agent outcome benchmarks (not measured).",
    },
    {
      id: "editorial-scorecards",
      label: "Editorial vendor assessments",
      pathOrSource:
        "src/data/editorial/assessments/*.json + src/data/seed/crm-methodology.ts",
      dimensions: [
        "overall score",
        "10 methodology criteria",
        "criterionAssessments",
        "handsOnTesting flag",
      ],
      approximateScale: `${corpus.editorialAssessmentCount} assessment files`,
      citeableAs:
        "SoftwareGlimpse desk-research score distributions with full methodology disclosure (not hands-on lab).",
      notCiteableAs:
        "User-review star averages (G2-style), lab-verified performance, or affiliate-influenced rankings.",
    },
    {
      id: "pricing-engine",
      label: "Team-size cost calculator engine",
      pathOrSource:
        "src/services/pricing/* + /tools/crm-cost-calculator/ + fixtures",
      dimensions: [
        "seat count",
        "required features",
        "billing period",
        "eligibility",
        "feature coverage vs plans",
      ],
      approximateScale:
        "Recomputable scenarios (e.g. 5 / 25 / 50 seats) from published plan rules",
      citeableAs:
        "Modeled list costs at stated team sizes under SG pricing rules — interactive + downloadable tables.",
      notCiteableAs: "Observed customer invoices or true TCO without user inputs.",
    },
    {
      id: "implementation-migration-models",
      label: "Implementation & migration planning models",
      pathOrSource:
        "src/services/implementation-planner/* + /tools/crm-*-planner/",
      dimensions: [
        "complexity drivers",
        "phases",
        "risks",
        "migration objects / field maps",
      ],
      approximateScale: "Deterministic planning heuristics — not outcome corpus",
      citeableAs:
        "Transparent methodology for how SG scores planning complexity (educational).",
      notCiteableAs:
        "Empirical 'average CRM migration takes X weeks' without primary research.",
    },
    {
      id: "requirements-ontology",
      label: "Buyer requirements & CRM graph",
      pathOrSource:
        "src/data/crm-graph/* + requirement-detail + seed dimensions",
      dimensions: [
        "requirements",
        "capabilities",
        "use cases",
        "feature links",
      ],
      approximateScale: "Structured ontology (framework citation)",
      citeableAs:
        "Publishable buyer-requirement framework and feature mapping as educational taxonomy.",
      notCiteableAs: "Prevalence of requirements across real buyers (no survey).",
    },
    {
      id: "industry-fs",
      label: "Financial services CRM requirements depth",
      pathOrSource: "src/data/industry-hub/financial-services.ts + FS guides",
      dimensions: [
        "security dimensions",
        "capability groups",
        "priorities",
        "FAQ",
      ],
      approximateScale: "Deep hub for one industry; others mostly stubs",
      citeableAs:
        "FS CRM security / requirements checklist research with clear educational framing.",
      notCiteableAs:
        "Cross-industry prevalence stats or '% of banks requiring X'.",
    },
    {
      id: "evidence-media",
      label: "Sourced facts, sources, product media",
      pathOrSource: "facts.json / sources.json / enrichment media",
      dimensions: ["facts", "source URLs", "screenshots", "official videos"],
      approximateScale: "Hundreds of sourced facts + media across enrichments",
      citeableAs:
        "Supporting evidence for product claims with source attribution.",
      notCiteableAs: "Standalone market statistics detached from sources.",
    },
  ];
}
