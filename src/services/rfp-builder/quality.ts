import type { RfpRequirement } from "@/domain";
import { VAGUE_REQUIREMENT_PATTERNS } from "./constants";

export type RequirementQualityIssue = {
  requirementId: string;
  kind: "vague" | "missing-acceptance" | "missing-evidence" | "duplicate";
  message: string;
  suggestion?: string;
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function detectVagueRequirement(
  text: string,
): { reason: string; suggestion: string } | null {
  for (const entry of VAGUE_REQUIREMENT_PATTERNS) {
    if (entry.pattern.test(text)) {
      return { reason: entry.reason, suggestion: entry.suggestion };
    }
  }
  return null;
}

export function analyzeRequirementsQuality(
  requirements: RfpRequirement[],
): RequirementQualityIssue[] {
  const issues: RequirementQualityIssue[] = [];
  const seen = new Map<string, string>();

  for (const req of requirements) {
    if (req.priority === "out-of-scope") continue;

    const vague = detectVagueRequirement(req.requirement);
    if (vague) {
      issues.push({
        requirementId: req.id,
        kind: "vague",
        message: `${req.id}: ${vague.reason}`,
        suggestion: vague.suggestion,
      });
    }

    if (
      req.priority === "must-have" &&
      !req.acceptanceCriterion.trim()
    ) {
      issues.push({
        requirementId: req.id,
        kind: "missing-acceptance",
        message: `${req.id} is a must-have without acceptance criteria.`,
      });
    }

    if (
      req.priority === "must-have" &&
      req.mandatory &&
      !req.evidenceRequested.trim()
    ) {
      issues.push({
        requirementId: req.id,
        kind: "missing-evidence",
        message: `${req.id} is mandatory but does not specify evidence expectations.`,
      });
    }

    const key = normalizeText(req.requirement);
    if (key.length > 12) {
      const prior = seen.get(key);
      if (prior) {
        issues.push({
          requirementId: req.id,
          kind: "duplicate",
          message: `${prior} and ${req.id} appear to request the same outcome.`,
        });
      } else {
        seen.set(key, req.id);
      }
    }
  }

  return issues;
}

export function countByPriority(requirements: RfpRequirement[]) {
  const counts = {
    total: 0,
    mustHave: 0,
    shouldHave: 0,
    couldHave: 0,
    future: 0,
    outOfScope: 0,
  };
  for (const req of requirements) {
    counts.total += 1;
    if (req.priority === "must-have") counts.mustHave += 1;
    else if (req.priority === "should-have") counts.shouldHave += 1;
    else if (req.priority === "could-have") counts.couldHave += 1;
    else if (req.priority === "future") counts.future += 1;
    else if (req.priority === "out-of-scope") counts.outOfScope += 1;
  }
  return counts;
}
