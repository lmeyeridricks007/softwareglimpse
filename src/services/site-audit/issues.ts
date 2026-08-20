import {
  AuditIssueSchema,
  type AuditIssue,
  type AuditIssueType,
  type AuditLevel,
  type AuditSeverity,
} from "@/domain";
import {
  defaultRemediationByType,
  defaultSeverityByType,
} from "@/data/config/audit/rules";

export type IssueDraft = {
  type: AuditIssueType;
  message: string;
  level?: AuditLevel;
  severity?: AuditSeverity;
  evidence?: string;
  path?: string;
  section?: string;
  entityType?: string;
  entityId?: string;
  categorySlug?: string;
  productSlug?: string;
  contentId?: string;
  trafficBoost?: boolean;
  commercialBoost?: boolean;
};

function stableId(parts: Array<string | undefined>): string {
  return `audit:${parts
    .filter(Boolean)
    .map((p) =>
      String(p)
        .toLowerCase()
        .replace(/[^a-z0-9:_/-]+/g, "-")
        .replace(/-+/g, "-"),
    )
    .join(":")}`;
}

export function createIssue(draft: IssueDraft, now = new Date().toISOString()): AuditIssue {
  const rem = defaultRemediationByType[draft.type];
  const severity = draft.severity ?? defaultSeverityByType[draft.type];
  const level =
    draft.level ??
    (severity === "critical" || severity === "high"
      ? draft.type.includes("STALE") ||
        draft.type.includes("RESEARCH") ||
        draft.type.includes("PRICING")
        ? "readiness"
        : draft.type.includes("THIN") ||
            draft.type.includes("INCONSISTENT") ||
            draft.type.includes("GENERIC")
          ? "quality"
          : "validity"
      : "quality");

  return AuditIssueSchema.parse({
    id: stableId([
      draft.type,
      draft.contentId ?? draft.productSlug ?? draft.categorySlug ?? draft.entityId,
      draft.path,
      draft.section,
      draft.message.slice(0, 48),
    ]),
    type: draft.type,
    severity,
    level,
    message: draft.message,
    evidence: draft.evidence,
    path: draft.path,
    section: draft.section,
    entityType: draft.entityType,
    entityId: draft.entityId,
    categorySlug: draft.categorySlug,
    productSlug: draft.productSlug,
    contentId: draft.contentId,
    remediationAction: rem.action,
    remediationClass: rem.classification,
    state: "open",
    firstSeenAt: now,
    lastSeenAt: now,
    trafficBoost: draft.trafficBoost ?? false,
    commercialBoost: draft.commercialBoost ?? false,
  });
}

/**
 * Merge new detections into ledger: update lastSeenAt, reopen if needed,
 * auto-resolve issues not seen in this run (same scope prefix).
 */
export function reconcileIssues(input: {
  previous: AuditIssue[];
  detected: AuditIssue[];
  scopePrefix?: string;
  now?: string;
}): AuditIssue[] {
  const now = input.now ?? new Date().toISOString();
  const byId = new Map(input.previous.map((i) => [i.id, i]));
  const detectedIds = new Set(input.detected.map((i) => i.id));

  for (const d of input.detected) {
    const prev = byId.get(d.id);
    if (!prev) {
      byId.set(d.id, d);
      continue;
    }
    byId.set(d.id, {
      ...prev,
      ...d,
      firstSeenAt: prev.firstSeenAt,
      lastSeenAt: now,
      state:
        prev.state === "dismissed"
          ? "dismissed"
          : prev.state === "resolved"
            ? "reopened"
            : prev.state === "accepted" || prev.state === "in-progress"
              ? prev.state
              : "open",
      resolvedAt:
        prev.state === "resolved" && d.state !== "resolved"
          ? undefined
          : prev.resolvedAt,
    });
  }

  if (input.scopePrefix) {
    const siteWide = input.scopePrefix === "site";
    for (const [id, issue] of byId) {
      if (!detectedIds.has(id) && issue.state === "open") {
        const inScope =
          siteWide ||
          issue.id.includes(input.scopePrefix) ||
          issue.categorySlug === input.scopePrefix ||
          issue.productSlug === input.scopePrefix ||
          issue.contentId?.includes(input.scopePrefix);
        if (inScope) {
          byId.set(id, {
            ...issue,
            state: "resolved",
            resolvedAt: now,
            lastSeenAt: now,
          });
        }
      }
    }
  }

  return [...byId.values()];
}

export function partitionIssues(issues: AuditIssue[]): {
  blockers: AuditIssue[];
  warnings: AuditIssue[];
  opportunities: AuditIssue[];
} {
  const blockers = issues.filter(
    (i) =>
      (i.severity === "critical" || i.severity === "high") &&
      i.state !== "dismissed" &&
      i.state !== "resolved",
  );
  const warnings = issues.filter(
    (i) =>
      (i.severity === "medium" || i.severity === "low") &&
      i.state !== "dismissed" &&
      i.state !== "resolved",
  );
  const opportunities = issues.filter(
    (i) =>
      i.severity === "info" &&
      i.state !== "dismissed" &&
      i.state !== "resolved",
  );
  return { blockers, warnings, opportunities };
}

export function auditStatusFromIssues(
  issues: AuditIssue[],
): "pass" | "pass-with-warnings" | "fail" {
  const open = issues.filter(
    (i) => i.state !== "dismissed" && i.state !== "resolved",
  );
  if (open.some((i) => i.severity === "critical" || i.severity === "high")) {
    return "fail";
  }
  if (open.some((i) => i.severity === "medium" || i.severity === "low")) {
    return "pass-with-warnings";
  }
  return "pass";
}
