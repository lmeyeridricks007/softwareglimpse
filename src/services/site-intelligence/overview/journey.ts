import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import type { ContentScoreSnapshot } from "./sources";

export type JourneyStageStatus = "strong" | "adequate" | "weak" | "missing";

export type JourneyStageAssessment = {
  id: string;
  label: string;
  status: JourneyStageStatus;
  evidence: string[];
};

function hasTool(slug: string, status: "available" | "partial" = "available"): boolean {
  return TOOLS_REGISTRY.some(
    (t) => t.slug === slug && (status === "partial" ? t.status !== "coming-soon" : t.status === "available"),
  );
}

function avgForRoutes(
  scores: ContentScoreSnapshot | null,
  pred: (route: string, pageType: string) => boolean,
): number | null {
  if (!scores) return null;
  const vals: number[] = [];
  for (const [route, row] of Object.entries(scores.pages)) {
    if (pred(route, row.pageType)) vals.push(row.score);
  }
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function statusFromScore(
  score: number | null,
  floorStrong = 85,
  floorAdequate = 70,
): JourneyStageStatus {
  if (score == null) return "missing";
  if (score >= floorStrong) return "strong";
  if (score >= floorAdequate) return "adequate";
  return "weak";
}

/**
 * Buyer-journey assessment from tools registry + CQ scores + map signals.
 * Evidence-only — does not invent missing stages as Strong.
 */
export function assessUserJourney(input: {
  scores: ContentScoreSnapshot | null;
  mapMissingIds: string[];
  mapThinIds: string[];
  resourcesLive?: number;
}): JourneyStageAssessment[] {
  const learnAvg = avgForRoutes(
    input.scores,
    (route, type) =>
      type === "guide" ||
      type === "article" ||
      /what-is-crm|how-crm-works|do-i-need/i.test(route),
  );
  const chooseAvg = avgForRoutes(
    input.scores,
    (route, type) =>
      type === "best" ||
      /how-to-choose|requirements-guide|evaluation-guide|pricing-guide/i.test(
        route,
      ),
  );
  const productAvg = avgForRoutes(
    input.scores,
    (_r, type) => type === "product-review",
  );
  const compareAvg = avgForRoutes(
    input.scores,
    (_r, type) => type === "comparison",
  );
  const industryAvg = avgForRoutes(
    input.scores,
    (_r, type) => type === "industry",
  );
  const implAvg = avgForRoutes(
    input.scores,
    (route, type) =>
      type === "product-guide" ||
      type === "implementation-guide" ||
      /implementation|migration|setup/i.test(route),
  );

  const missing = new Set(input.mapMissingIds);
  const thin = new Set(input.mapThinIds);

  return [
    {
      id: "discover",
      label: "Discover",
      status: statusFromScore(learnAvg),
      evidence: [
        learnAvg != null
          ? `Learn/guide CQ avg ${learnAvg}`
          : "No learn/guide CQ scores in snapshot",
      ],
    },
    {
      id: "understand",
      label: "Understand",
      status: statusFromScore(learnAvg),
      evidence: [
        learnAvg != null
          ? `Fundamentals CQ avg ${learnAvg}`
          : "Fundamentals scores missing",
      ],
    },
    {
      id: "define-requirements",
      label: "Define requirements",
      status: hasTool("crm-requirements-builder")
        ? chooseAvg != null && chooseAvg >= 80
          ? "strong"
          : "adequate"
        : "weak",
      evidence: [
        hasTool("crm-requirements-builder")
          ? "CRM Requirements Builder available"
          : "Requirements builder missing",
        chooseAvg != null ? `Choose-stage CQ avg ${chooseAvg}` : "No choose CQ",
      ],
    },
    {
      id: "find-software",
      label: "Find software",
      status: hasTool("crm-finder")
        ? productAvg != null && productAvg >= 85
          ? "strong"
          : "adequate"
        : "weak",
      evidence: [
        hasTool("crm-finder") ? "CRM Finder available" : "Finder missing",
        productAvg != null
          ? `Product review CQ avg ${productAvg}`
          : "No product CQ",
      ],
    },
    {
      id: "compare",
      label: "Compare",
      status:
        compareAvg != null && compareAvg >= 85
          ? "strong"
          : statusFromScore(compareAvg),
      evidence: [
        compareAvg != null
          ? `Comparison CQ avg ${compareAvg}`
          : "No comparison CQ",
        missing.has("CRM-CMP-003")
          ? "Multi-product compare still MISSING on map"
          : "Multi-product compare not flagged missing",
      ],
    },
    {
      id: "evaluate",
      label: "Evaluate",
      status: hasTool("crm-vendor-scorecard")
        ? thin.has("CRM-BUY-001")
          ? "adequate"
          : "strong"
        : "weak",
      evidence: [
        hasTool("crm-vendor-scorecard")
          ? "CRM Vendor Scorecard available"
          : "Scorecard missing",
        thin.has("CRM-BUY-001")
          ? "Best CRM still thin/research on map (CRM-BUY-001)"
          : "Best CRM not flagged thin",
      ],
    },
    {
      id: "calculate-cost",
      label: "Calculate cost",
      status:
        hasTool("crm-cost-calculator") && hasTool("crm-tco-calculator")
          ? "strong"
          : hasTool("crm-cost-calculator")
            ? "adequate"
            : "missing",
      evidence: [
        hasTool("crm-cost-calculator")
          ? "CRM Cost Calculator available"
          : "Cost calculator missing",
        hasTool("crm-tco-calculator")
          ? "CRM TCO Calculator available"
          : "TCO calculator missing",
      ],
    },
    {
      id: "decide",
      label: "Decide",
      status:
        (input.resourcesLive ?? 0) >= 10 && hasTool("crm-vendor-scorecard")
          ? thin.has("CRM-BUY-001")
            ? "adequate"
            : "strong"
          : "weak",
      evidence: [
        `${input.resourcesLive ?? 0} resources live (resource audit)`,
        thin.has("CRM-BUY-001")
          ? "Commercial Best pillar still research-gated"
          : "Best pillar not thin-flagged",
      ],
    },
    {
      id: "implement",
      label: "Implement",
      status: hasTool("crm-implementation-planner")
        ? statusFromScore(implAvg, 85, 75)
        : "weak",
      evidence: [
        hasTool("crm-implementation-planner")
          ? "CRM Implementation Planner available"
          : "Implementation planner missing",
        implAvg != null
          ? `Implementation/setup CQ avg ${implAvg}`
          : "No implementation CQ",
      ],
    },
    {
      id: "migrate",
      label: "Migrate",
      status: hasTool("crm-migration-planner")
        ? statusFromScore(implAvg, 85, 75)
        : missing.has("CRM-TOOL-015")
          ? "weak"
          : "adequate",
      evidence: [
        hasTool("crm-migration-planner")
          ? "CRM Migration Planner available"
          : "Migration planner missing",
        missing.has("CRM-TOOL-015")
          ? "Migration Cost Calculator NOT-YET-IMPLEMENTED"
          : "Migration cost calculator not flagged missing",
      ],
    },
    {
      id: "optimize",
      label: "Optimize",
      status: missing.has("CRM-TOOL-016")
        ? "missing"
        : industryAvg != null
          ? "adequate"
          : "weak",
      evidence: [
        missing.has("CRM-TOOL-016")
          ? "CRM Adoption / Health Assessment NOT-YET-IMPLEMENTED"
          : "Adoption assessment not flagged missing",
        industryAvg != null
          ? `Industry CQ avg ${industryAvg}`
          : "Limited optimize-stage inventory",
      ],
    },
  ];
}
