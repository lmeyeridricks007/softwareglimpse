import type { AuditCheckId, AuditFinding, AuditSeverity } from "./types";

export function makeFinding(input: {
  check: AuditCheckId;
  severity: AuditSeverity;
  subject: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
}): AuditFinding {
  const slug = input.subject
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return {
    id: `${input.check}:${slug}:${input.severity}`,
    check: input.check,
    severity: input.severity,
    subject: input.subject,
    problem: input.problem,
    evidence: input.evidence,
    recommendedAction: input.recommendedAction,
  };
}
