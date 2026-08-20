import type { AuditPageResult } from "../audit-report";

export type IntegrityFinding = {
  id: string;
  severity: "critical" | "warning";
  route: string;
  pageType: string;
  issue: string;
  /** When true, may fail CI under --strict-integrity */
  deterministic: boolean;
};

const PLACEHOLDER_RE =
  /\b(lorem ipsum|TODO:|FIXME:|TBD\b|placeholder text|\[insert |xxx{3,}|coming soon — draft)\b/i;

/**
 * Deterministic content-integrity checks (not subjective quality scores).
 * Hard-fail candidates only: empty published pages, placeholder copy,
 * broken/missing required entity identity.
 */
export function inspectContentIntegrity(
  results: AuditPageResult[],
): IntegrityFinding[] {
  const findings: IntegrityFinding[] = [];

  for (const r of results) {
    const a = r.assessment;
    const snapNotes = a.notes.join(" ");
    const gaps = [...a.criticalGaps, ...a.majorImprovements].join(" ");

    // Empty / stub published page
    if (
      a.overallScore <= 15 ||
      /empty body|no body|zero sections|missing title/i.test(gaps + snapNotes)
    ) {
      findings.push({
        id: `INT-EMPTY-${a.route}`,
        severity: "critical",
        route: a.route,
        pageType: a.pageType,
        issue: "Published page appears empty or critically incomplete.",
        deterministic: true,
      });
    }

    if (PLACEHOLDER_RE.test(gaps) || PLACEHOLDER_RE.test(snapNotes)) {
      findings.push({
        id: `INT-PLACEHOLDER-${a.route}`,
        severity: "critical",
        route: a.route,
        pageType: a.pageType,
        issue: "Published page contains placeholder / draft marker text.",
        deterministic: true,
      });
    }

    // Evidence-gated commercial claims without evidence (deterministic gate)
    const evidence = a.dimensions.find((d) => d.id === "evidence-source-quality");
    if (
      (a.pageType === "product-review" ||
        a.pageType === "best" ||
        a.pageType === "comparison") &&
      evidence &&
      evidence.score === 0 &&
      /required|gated|must have evidence/i.test(evidence.reason + gaps)
    ) {
      findings.push({
        id: `INT-EVIDENCE-${a.route}`,
        severity: "critical",
        route: a.route,
        pageType: a.pageType,
        issue:
          "Evidence-gated commercial page has zero evidence score — deterministic integrity risk.",
        deterministic: true,
      });
    }

    if (/broken entity|missing software slug|unresolved contentId/i.test(snapNotes)) {
      findings.push({
        id: `INT-ENTITY-${a.route}`,
        severity: "critical",
        route: a.route,
        pageType: a.pageType,
        issue: "Broken content entity reference detected.",
        deterministic: true,
      });
    }
  }

  return findings;
}
