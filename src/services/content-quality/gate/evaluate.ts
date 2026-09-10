import type {
  ContentQualityAssessment,
  ContentQualityDimensionId,
  PageQualitySnapshot,
} from "@/domain/schemas/content-quality";
import { evaluatePageQuality } from "../evaluate";
import { GATE_DIMENSION_META } from "./dimensions";
import { collectHardFails } from "./hard-fails";
import { getGateProfile } from "./profiles";
import {
  CONTENT_QUALITY_GATE_VERSION,
  WORD_COUNT_SOFT_WARN,
} from "./thresholds";
import type {
  ContentQualityGateResult,
  GateDimensionId,
  GateDimensionResult,
  GateIssue,
  GatePageType,
} from "./types";
import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";

/** Map gate dimensions → content-quality dimension ids (for scoring). */
const DIMENSION_MAP: Record<GateDimensionId, ContentQualityDimensionId[]> = {
  searchIntentFit: ["user-intent-fit"],
  uniqueValue: ["original-value"],
  dataCompleteness: ["content-completeness"],
  decisionSupport: ["decision-support", "actionability"],
  evidenceQuality: ["evidence-source-quality", "trust-transparency"],
  freshness: ["research-freshness"],
  internalDiscoverability: ["internal-linking", "journey-next-step"],
  contentSpecificity: ["subject-depth", "page-type-specific"],
  technicalSEO: ["structure-readability"],
  duplicationRisk: ["content-differentiation"],
};

function dimScore100(
  assessment: ContentQualityAssessment,
  ids: ContentQualityDimensionId[],
): { score: number; reasons: string[]; evidence: string[]; gap?: string } {
  const dims = assessment.dimensions.filter((d) => ids.includes(d.id));
  if (!dims.length) {
    return { score: 40, reasons: ["No mapped signals"], evidence: [] };
  }
  const avg =
    dims.reduce((s, d) => s + d.score, 0) / dims.length; // 0–5
  const score = Math.round((avg / 5) * 100);
  return {
    score,
    reasons: dims.map((d) => d.reason),
    evidence: dims.flatMap((d) =>
      d.evidence.map((e) => e.detail || e.label).filter(Boolean),
    ) as string[],
    gap: dims.find((d) => d.gap)?.gap,
  };
}

function weightedScore(
  dimensions: GateDimensionResult[],
): number {
  const totalW = dimensions.reduce((s, d) => s + d.weight, 0);
  if (totalW <= 0) return 0;
  return Math.round(
    dimensions.reduce((s, d) => s + d.score * d.weight, 0) / totalW,
  );
}

export type EvaluateGateInput = {
  pageType: GatePageType;
  path: string;
  slug: string;
  title: string;
  snapshot: PageQualitySnapshot;
  lifecycleState?: ContentLifecycleState;
  /** Type-specific index gates (guide/comparison substance). */
  typeIndexGatesOk?: boolean;
  typeIndexGateDetail?: string[];
  hardFailExtras?: {
    lifecycleRetired?: boolean;
    invalidRelationship?: boolean;
    nearDuplicateOf?: string;
    emptyGenerated?: boolean;
    unsupportedClaimCount?: number;
    canonicalOk?: boolean;
    routeResolvable?: boolean;
  };
  /** Soft word-count for warning only. */
  wordCount?: number;
  evaluatedAt?: string;
};

/**
 * Full Content Quality Gate evaluation for one page.
 */
export function evaluateContentQualityGate(
  input: EvaluateGateInput,
): ContentQualityGateResult {
  const profile = getGateProfile(input.pageType);
  const evaluatedAt = input.evaluatedAt ?? new Date().toISOString();

  // Ensure snapshot pageType matches dimensional profile
  const snap: PageQualitySnapshot = {
    ...input.snapshot,
    pageType: profile.qualityPageType,
    route: input.snapshot.route || input.path,
    title: input.snapshot.title || input.title,
  };

  const assessment = evaluatePageQuality(snap, { evaluatedAt });

  const dimensions: GateDimensionResult[] = [];
  for (const id of Object.keys(profile.weights) as GateDimensionId[]) {
    const mapped = DIMENSION_MAP[id];
    const scored = dimScore100(assessment, mapped);
    // duplicationRisk: high differentiation score = low risk → invert display
    const score = scored.score;
    if (id === "duplicationRisk") {
      // content-differentiation high means low duplication risk → keep as "health"
      // so higher is better (low risk). No invert needed if source already scores uniqueness.
    }
    const meta = GATE_DIMENSION_META[id];
    dimensions.push({
      id,
      label: meta.label,
      score,
      weight: profile.weights[id],
      explanation: `${meta.explanation} ${scored.reasons[0] ?? ""}`.trim(),
      evidence: scored.evidence.slice(0, 6),
      gap: scored.gap,
    });
  }

  const qualityScore = weightedScore(dimensions);

  const failures = collectHardFails({
    pageType: input.pageType,
    path: input.path,
    title: input.title,
    snapshot: snap,
    ...input.hardFailExtras,
  });

  const warnings: GateIssue[] = [];
  if (
    input.wordCount != null &&
    input.wordCount < WORD_COUNT_SOFT_WARN
  ) {
    warnings.push({
      code: "soft_thin_word_count",
      message: `Word count ${input.wordCount} is below soft guidance (${WORD_COUNT_SOFT_WARN}) — not a hard fail; improve usefulness instead of padding`,
      dimension: "contentSpecificity",
    });
  }
  for (const d of dimensions) {
    if (d.score < 50 && d.gap) {
      warnings.push({
        code: `weak_${d.id}`,
        message: d.gap,
        dimension: d.id,
      });
    }
  }
  for (const detail of input.typeIndexGateDetail ?? []) {
    if (!failures.some((f) => f.message.includes(detail))) {
      warnings.push({
        code: "type_index_gate",
        message: detail,
      });
    }
  }

  const requiredImprovements: string[] = [];
  for (const f of failures) {
    requiredImprovements.push(f.message);
  }
  if (input.typeIndexGatesOk === false) {
    for (const d of input.typeIndexGateDetail ?? []) {
      requiredImprovements.push(`Pass index gate: ${d}`);
    }
  }
  for (const d of dimensions) {
    if (d.score < 40 && d.gap) {
      requiredImprovements.push(`[${d.label}] ${d.gap}`);
    }
  }

  const recommendedImprovements: string[] = [
    ...assessment.quickWins,
    ...assessment.majorImprovements.slice(0, 8),
  ];
  for (const d of dimensions) {
    if (d.score >= 40 && d.score < 70 && d.gap) {
      recommendedImprovements.push(`[${d.label}] ${d.gap}`);
    }
  }

  const lifecycleStateRaw = input.lifecycleState ?? "IMPROVE";
  const typeOk = input.typeIndexGatesOk !== false;
  const indexEligible =
    failures.length === 0 &&
    typeOk &&
    qualityScore >= profile.minIndexScore &&
    lifecycleStateRaw !== "RETIRED";

  // Never report INDEXABLE while hard-failing — demote reporting state to IMPROVE
  // so gate history / dashboards stay honest (FR-007). Seed/seo flags unchanged here.
  const lifecycleState =
    failures.length > 0 && lifecycleStateRaw === "INDEXABLE"
      ? "IMPROVE"
      : lifecycleStateRaw;

  return {
    version: CONTENT_QUALITY_GATE_VERSION,
    pageType: input.pageType,
    path: input.path,
    slug: input.slug,
    title: input.title,
    qualityScore,
    dimensions,
    failures,
    warnings: warnings.slice(0, 20),
    requiredImprovements: [...new Set(requiredImprovements)].slice(0, 15),
    recommendedImprovements: [...new Set(recommendedImprovements)].slice(
      0,
      15,
    ),
    lifecycleState,
    indexEligible,
    evaluatedAt,
    mappedQualityDimensions: assessment.dimensions.map((d) => d.id),
  };
}
