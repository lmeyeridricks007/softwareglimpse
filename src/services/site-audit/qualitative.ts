/**
 * Optional qualitative editorial-audit-agent.
 * Runs ONLY after deterministic evidence; default sample = none.
 * Deterministic generation provider — no live LLM required.
 */
import type { AuditIssue } from "@/domain";
import { createIssue } from "./issues";
import {
  genericAiPhrases,
  handsOnPatterns,
} from "@/data/config/audit/rules";

export type QualitativeAuditInput = {
  contentId: string;
  pageType: string;
  body: string;
  methodology?: string;
  deterministicIssues: AuditIssue[];
  styleGuideRef?: string;
};

export function runQualitativeEditorialAudit(
  input: QualitativeAuditInput,
  now = new Date().toISOString(),
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  // Only escalate when deterministic layer already saw signals OR body matches patterns
  const hasDeterministicWeakness = input.deterministicIssues.some(
    (i) =>
      i.type === "THIN_CONTENT" ||
      i.type === "GENERIC_AI_PROSE" ||
      i.severity === "medium",
  );

  if (!hasDeterministicWeakness && input.body.length < 200) {
    return issues;
  }

  for (const p of genericAiPhrases) {
    if (p.test(input.body)) {
      issues.push(
        createIssue(
          {
            type: "GENERIC_AI_PROSE",
            level: "quality",
            severity: "low",
            message: `Qualitative: generic phrasing on ${input.contentId}`,
            contentId: input.contentId,
            evidence: p.source,
            section: "qualitative",
          },
          now,
        ),
      );
      break;
    }
  }

  for (const p of handsOnPatterns) {
    if (p.test(input.body)) {
      issues.push(
        createIssue(
          {
            type: "FAKE_TESTING_CLAIM",
            level: "quality",
            severity: "critical",
            message: `Qualitative: testing claim without metadata on ${input.contentId}`,
            contentId: input.contentId,
            evidence: p.source,
          },
          now,
        ),
      );
      break;
    }
  }

  // Decision usefulness heuristic
  const hasTradeoff =
    /trade-?off|not ideal|depends|however|whereas/i.test(input.body);
  const hasVerdict = /best for|choose|recommend|verdict/i.test(input.body);
  if (input.pageType === "software" && (!hasTradeoff || !hasVerdict)) {
    issues.push(
      createIssue(
        {
          type: "THIN_CONTENT",
          level: "quality",
          severity: "medium",
          message: `Qualitative: weak decision usefulness on ${input.contentId}`,
          contentId: input.contentId,
          evidence: `tradeoff=${hasTradeoff} verdict=${hasVerdict}`,
        },
        now,
      ),
    );
  }

  return issues;
}
