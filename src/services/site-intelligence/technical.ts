import type {
  ScoredComponent,
  TechnicalCheckInput,
  TechnicalFindingInput,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { clampScore, confidence, dim, weightedMean } from "./score-utils";
import {
  AREA_TO_TECHNICAL_DIMENSION,
  SEVERITY_DEDUCTION,
  TECHNICAL_DIMENSION_WEIGHTS,
} from "./weights";

function resolveDimension(finding: TechnicalFindingInput): string {
  if (
    finding.dimensionHint &&
    finding.dimensionHint in TECHNICAL_DIMENSION_WEIGHTS
  ) {
    return finding.dimensionHint;
  }
  return AREA_TO_TECHNICAL_DIMENSION[finding.area] ?? "indexability";
}

function dimensionScoreFromFindings(
  dimensionId: string,
  findings: TechnicalFindingInput[],
): { score: number; evidenceCount: number; reasons: string[] } {
  const relevant = findings.filter(
    (f) => resolveDimension(f) === dimensionId,
  );
  let deduction = 0;
  const bySev = { P0: 0, P1: 0, P2: 0, P3: 0 } as Record<
    keyof typeof SEVERITY_DEDUCTION,
    number
  >;
  for (const f of relevant) {
    bySev[f.severity] += SEVERITY_DEDUCTION[f.severity].per;
  }
  for (const sev of Object.keys(SEVERITY_DEDUCTION) as Array<
    keyof typeof SEVERITY_DEDUCTION
  >) {
    deduction += Math.min(SEVERITY_DEDUCTION[sev].cap, bySev[sev]);
  }
  const score = clampScore(100 - deduction);
  const reasons: string[] = [];
  if (relevant.length === 0) {
    reasons.push(`No open findings mapped to ${dimensionId}`);
  } else {
    reasons.push(
      `${relevant.length} finding(s) → deducted ${deduction} (capped by severity)`,
    );
  }
  return { score, evidenceCount: relevant.length, reasons };
}

/**
 * Technical SEO Health from existing SEO audit findings/checks.
 * Does not re-run agent checks.
 */
export function scoreTechnicalSeoHealth(input: {
  findings: TechnicalFindingInput[];
  checks: TechnicalCheckInput[];
}): ScoredComponent {
  const dimensions = Object.entries(TECHNICAL_DIMENSION_WEIGHTS).map(
    ([id, weight]) => {
      const { score, reasons } = dimensionScoreFromFindings(id, input.findings);
      const partialProbe =
        id === "status-redirects" ||
        id === "rendering-mobile" ||
        id === "performance-cwv";
      const skippedRelated = input.checks.filter(
        (c) =>
          c.status !== "completed" &&
          (c.id.includes(id.split("-")[0]!) ||
            (partialProbe &&
              /live|field-cwv|mobile-parity|status-codes|redirect/i.test(
                c.id,
              ))),
      );
      return dim(
        id,
        score,
        weight,
        reasons.join("; "),
        input.findings
          .filter((f) => resolveDimension(f) === id)
          .slice(0, 5)
          .map((f) => ({
            label: f.problem,
            sourceSystem: "seo-audit-agents",
            sourceId: f.id,
            present: true,
          })),
        skippedRelated.length > 0 || partialProbe,
      );
    },
  );

  const scoreRaw = weightedMean(dimensions);
  // Site-wide severity floor: isolated clean dimensions must not hide P0 breakage.
  const p0 = input.findings.filter((f) => f.severity === "P0").length;
  const p1 = input.findings.filter((f) => f.severity === "P1").length;
  let score = scoreRaw;
  if (p0 > 0) {
    score = Math.min(score, clampScore(45 - Math.min(20, (p0 - 1) * 8)));
  } else if (p1 >= 3) {
    score = Math.min(score, 65);
  } else if (p1 > 0) {
    score = Math.min(score, 78);
  }
  const completed = input.checks.filter((c) => c.status === "completed").length;
  const skipped = input.checks.filter((c) => c.status === "skipped").length;
  const failed = input.checks.filter((c) => c.status === "failed").length;
  const total = input.checks.length || 1;
  const skipRatio = (skipped + failed) / total;

  const reasons: string[] = [];
  if (input.findings.length === 0) {
    reasons.push("No open SEO audit findings in input snapshot");
  } else {
    reasons.push(`${input.findings.length} open SEO finding(s) applied`);
  }
  if (skipped > 0 || failed > 0) {
    reasons.push(
      `${skipped} check(s) skipped, ${failed} failed — do not claim clean technical SEO`,
    );
  }
  if (completed > 0) {
    reasons.push(`${completed}/${total} checks completed`);
  }

  const level =
    skipRatio >= 0.35 || failed > 0
      ? "low"
      : skipRatio >= 0.15
        ? "medium"
        : "high";

  return {
    id: "technical-seo-health",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions,
    confidence: confidence(level, reasons),
    evidence: input.findings.slice(0, 10).map((f) => ({
      label: `${f.severity}: ${f.problem}`,
      sourceSystem: "seo-audit-agents",
      sourceId: f.id,
    })),
    notes: [],
    strongerThan: [],
    weakerThan: [],
  };
}
