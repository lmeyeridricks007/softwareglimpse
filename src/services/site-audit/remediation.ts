import type { AuditIssue, RemediationItem } from "@/domain";

const severityWeight: Record<string, number> = {
  critical: 100,
  high: 70,
  medium: 35,
  low: 15,
  info: 5,
};

/**
 * Remediation priority for fixing issues — NOT product recommendation ranking.
 */
export function buildRemediationPlan(issues: AuditIssue[]): RemediationItem[] {
  const open = issues.filter(
    (i) =>
      i.state !== "dismissed" &&
      i.state !== "resolved" &&
      i.remediationAction !== "none",
  );

  const scored = open.map((issue) => {
    let priority =
      severityWeight[issue.severity] ?? 10;
    const reasons: string[] = [`severity=${issue.severity}`];
    if (issue.trafficBoost) {
      priority += 25;
      reasons.push("+ high-traffic impact");
    }
    if (issue.commercialBoost) {
      priority += 15;
      reasons.push("+ commercial urgency (not editorial ranking)");
    }
    if (issue.level === "validity") {
      priority += 10;
      reasons.push("+ validity");
    }
    if (issue.remediationClass === "AUTO_SAFE") {
      priority += 5;
      reasons.push("+ auto-safe fix");
    }
    return {
      issue,
      priorityScore: priority,
      reasons,
    };
  });

  scored.sort((a, b) => b.priorityScore - a.priorityScore);

  return scored.map((s, idx) => ({
    rank: idx + 1,
    issueId: s.issue.id,
    action: s.issue.remediationAction,
    remediationClass: s.issue.remediationClass,
    title: s.issue.message,
    priorityScore: s.priorityScore,
    reasons: s.reasons,
  }));
}
