import type { CrmDecisionProfile, CrmDemoChecklistDraft } from "@/domain";
import {
  loadCrmDecisionProfile,
  loadSiDecisionProfile,
} from "@/services/decision-profile/persistence";
import { includedScenarios } from "./time";

export type CoverageBucket = {
  priority: "must-have" | "should-have" | "could-have";
  total: number;
  covered: number;
  pct: number;
};

export type UncoveredRequirement = {
  requirementId: string;
  priority: string;
  decision?: "add-to-demo" | "written-verification" | "exclude";
};

export type RequirementsCoverage = {
  buckets: CoverageBucket[];
  overallCovered: number;
  overallTotal: number;
  overallPct: number;
  uncovered: UncoveredRequirement[];
};

function mapProfilePriority(
  priority: CrmDecisionProfile["requirements"][number]["priority"],
): "must-have" | "should-have" | "could-have" | null {
  if (priority === "must-have") return "must-have";
  if (priority === "important") return "should-have";
  if (priority === "nice-to-have") return "could-have";
  return null;
}

export function computeRequirementsCoverage(
  draft: CrmDemoChecklistDraft,
  profile?: CrmDecisionProfile | null,
): RequirementsCoverage {
  const source = profile ?? loadCrmDecisionProfile() ?? loadSiDecisionProfile();
  const coveredIds = new Set(
    includedScenarios(draft).flatMap((s) => s.requirementIds),
  );
  const decisionMap = new Map(
    draft.coverageDecisions.map((d) => [d.requirementId, d.decision]),
  );

  const counts: Record<
    "must-have" | "should-have" | "could-have",
    { total: number; covered: number }
  > = {
    "must-have": { total: 0, covered: 0 },
    "should-have": { total: 0, covered: 0 },
    "could-have": { total: 0, covered: 0 },
  };

  const uncovered: UncoveredRequirement[] = [];

  for (const req of source?.requirements ?? []) {
    const bucket = mapProfilePriority(req.priority);
    if (!bucket) continue;
    counts[bucket].total += 1;
    const decision = decisionMap.get(req.id);
    const covered =
      coveredIds.has(req.id) ||
      decision === "written-verification" ||
      decision === "exclude";
    if (covered) counts[bucket].covered += 1;
    else {
      uncovered.push({
        requirementId: req.id,
        priority: req.priority,
        decision,
      });
    }
  }

  const buckets: CoverageBucket[] = (
    ["must-have", "should-have", "could-have"] as const
  ).map((priority) => {
    const { total, covered } = counts[priority];
    return {
      priority,
      total,
      covered,
      pct: total === 0 ? 100 : Math.round((covered / total) * 100),
    };
  });

  const overallTotal = buckets.reduce((s, b) => s + b.total, 0);
  const overallCovered = buckets.reduce((s, b) => s + b.covered, 0);

  return {
    buckets,
    overallCovered,
    overallTotal,
    overallPct:
      overallTotal === 0
        ? 100
        : Math.round((overallCovered / overallTotal) * 100),
    uncovered,
  };
}
