import { ALL_CHECKS } from "./engine";
import { listAuditResults, loadIssueLedger } from "@/data/audit/store";
import { AuditIssueTypeSchema, AuditSeveritySchema } from "@/domain";

export type AuditValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
};

export function validateSiteAudit(): {
  ok: boolean;
  issues: AuditValidationIssue[];
  checkCount: number;
} {
  const issues: AuditValidationIssue[] = [];
  const ids = new Set<string>();
  for (const check of ALL_CHECKS) {
    if (ids.has(check.id)) {
      issues.push({
        code: "duplicate_check_id",
        severity: "error",
        message: `Duplicate audit check id: ${check.id}`,
      });
    }
    ids.add(check.id);
  }

  if (ALL_CHECKS.length < 10) {
    issues.push({
      code: "too_few_checks",
      severity: "error",
      message: `Expected substantive check registry, found ${ALL_CHECKS.length}`,
    });
  }

  for (const issue of loadIssueLedger()) {
    if (!AuditIssueTypeSchema.safeParse(issue.type).success) {
      issues.push({
        code: "invalid_issue_type",
        severity: "error",
        message: `Invalid issue type in ledger: ${issue.type}`,
      });
    }
    if (!AuditSeveritySchema.safeParse(issue.severity).success) {
      issues.push({
        code: "invalid_severity",
        severity: "error",
        message: `Invalid severity: ${issue.severity}`,
      });
    }
  }

  const results = listAuditResults();
  for (const r of results.slice(0, 20)) {
    if (!r.health?.formula) {
      issues.push({
        code: "opaque_health",
        severity: "warning",
        message: `Audit ${r.id} health missing transparent formula`,
      });
    }
  }

  return {
    ok: !issues.some((i) => i.severity === "error"),
    issues,
    checkCount: ALL_CHECKS.length,
  };
}
