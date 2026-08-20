import type {
  CrmReadinessSession,
  ReadinessAnswerValue,
  ReadinessAssessmentVersion,
  ReadinessCompanySize,
  ReadinessContext,
  ReadinessDimensionLevel,
  ReadinessLevel,
  ReadinessOrgComplexity,
  ReadinessSalesComplexity,
} from "@/domain";
import {
  getQuestionById,
  type AnswerOption,
  type ReadinessQuestionDef,
} from "./catalog";
import {
  CRM_READINESS_CATALOG,
  type ReadinessCatalogPack,
} from "./catalog-pack";

export type DimensionScoreResult = {
  dimensionId: string;
  score: number;
  level: ReadinessDimensionLevel;
  answeredCount: number;
  questionCount: number;
  uncertainCount: number;
  drivers: ScoreDriver[];
};

export type ScoreDriver = {
  questionId: string;
  label: string;
  points: number;
  kind: "positive" | "partial" | "negative" | "uncertain";
};

export type AssessCrmReadinessResult = {
  assessmentVersion: ReadinessAssessmentVersion;
  selectionScore: number;
  implementationScore: number;
  overallScore: number;
  overallLevel: ReadinessLevel;
  orgComplexity: ReadinessOrgComplexity;
  dimensions: DimensionScoreResult[];
  visibleQuestionIds: string[];
  answeredQuestionIds: string[];
  uncertainQuestionIds: string[];
  completionRatio: number;
};

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function deriveOrgComplexity(
  context: ReadinessContext,
): ReadinessOrgComplexity {
  const size = context.companySize;
  const users = context.crmUsers ?? 0;
  const complexity = context.salesComplexity;
  const integrations = context.expectedIntegrations ?? 0;

  if (
    size === "1000+" ||
    size === "201-1000" ||
    users >= 100 ||
    complexity === "complex" ||
    integrations >= 6
  ) {
    return "enterprise";
  }

  if (
    size === "51-200" ||
    (size === "11-50" && (users >= 15 || complexity === "moderate")) ||
    integrations >= 3
  ) {
    return "mid";
  }

  return "small";
}

export function complexityAllowsQuestion(
  question: ReadinessQuestionDef,
  orgComplexity: ReadinessOrgComplexity,
): boolean {
  if (!question.minComplexity || question.minComplexity === "all") return true;
  const order: ReadinessOrgComplexity[] = ["small", "mid", "enterprise"];
  const need = question.minComplexity as ReadinessOrgComplexity;
  return order.indexOf(orgComplexity) >= order.indexOf(need);
}

function answerMatches(
  value: ReadinessAnswerValue | undefined,
  equalsAny: string[],
): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) {
    return value.some((v) => equalsAny.includes(v));
  }
  if (typeof value === "string") {
    return equalsAny.includes(value);
  }
  if (typeof value === "boolean") {
    return equalsAny.includes(value ? "yes" : "no");
  }
  return equalsAny.includes(String(value));
}

export function isQuestionVisible(
  question: ReadinessQuestionDef,
  answers: Record<string, { value: ReadinessAnswerValue }>,
  orgComplexity: ReadinessOrgComplexity,
): boolean {
  if (!complexityAllowsQuestion(question, orgComplexity)) return false;
  if (!question.conditions?.length) return true;
  return question.conditions.every((c) =>
    answerMatches(answers[c.questionId]?.value, c.equalsAny),
  );
}

export function getVisibleQuestions(
  session: Pick<CrmReadinessSession, "answers" | "context">,
  catalog: ReadinessCatalogPack = CRM_READINESS_CATALOG,
): ReadinessQuestionDef[] {
  const orgComplexity = deriveOrgComplexity(session.context);
  const answerMap = session.answers;
  return catalog.questions.filter((q) =>
    isQuestionVisible(q, answerMap, orgComplexity),
  );
}

function resolveOption(
  question: ReadinessQuestionDef,
  value: ReadinessAnswerValue,
): { points: number; uncertain: boolean; optionIds: string[] } {
  if (value == null) return { points: 0, uncertain: false, optionIds: [] };

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { points: 0, uncertain: false, optionIds: [] };
    }
    const opts = value
      .map((id) => question.options.find((o) => o.id === id))
      .filter((o): o is AnswerOption => Boolean(o));
    if (opts.length === 0) {
      return { points: 0, uncertain: false, optionIds: value };
    }
    // Multi-select: average of selected option points; "unclear/none/not-sure" dominate down.
    const hasWeak = opts.some((o) =>
      ["unclear", "none", "none-known", "not-sure"].includes(o.id),
    );
    if (hasWeak && opts.length === 1) {
      const only = opts[0]!;
      return {
        points: only.points,
        uncertain: Boolean(only.uncertain),
        optionIds: value,
      };
    }
    const filtered = opts.filter(
      (o) => !["unclear", "none", "none-known"].includes(o.id),
    );
    const use = filtered.length > 0 ? filtered : opts;
    const avg =
      use.reduce((sum, o) => sum + o.points, 0) / Math.max(use.length, 1);
    const uncertain = use.some((o) => o.uncertain);
    return { points: avg, uncertain, optionIds: value };
  }

  if (typeof value === "string") {
    const opt = question.options.find((o) => o.id === value);
    if (!opt) return { points: 0, uncertain: false, optionIds: [value] };
    return {
      points: opt.points,
      uncertain: Boolean(opt.uncertain),
      optionIds: [value],
    };
  }

  return { points: 0, uncertain: false, optionIds: [] };
}

function driverKind(
  points: number,
  uncertain: boolean,
): ScoreDriver["kind"] {
  if (uncertain) return "uncertain";
  if (points >= 80) return "positive";
  if (points >= 50) return "partial";
  return "negative";
}

export function dimensionLevel(score: number): ReadinessDimensionLevel {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  if (score >= 45) return "needs-work";
  return "at-risk";
}

export function overallLevelFromScores(
  selectionScore: number,
  implementationScore: number,
  criticalBlockerCount: number,
): ReadinessLevel {
  // Critical blockers cap the status even if averages look healthy.
  const blended = selectionScore * 0.55 + implementationScore * 0.45;
  if (criticalBlockerCount >= 2 && blended < 85) {
    return blended >= 60
      ? "preparation-required"
      : "foundations-not-ready";
  }
  if (criticalBlockerCount === 1 && blended >= 75) {
    return "ready-for-structured-discovery";
  }
  if (blended < 40) return "foundations-not-ready";
  if (blended < 60) return "preparation-required";
  if (blended < 75) return "ready-for-structured-discovery";
  if (blended < 90) return "ready-for-selection";
  return "strongly-prepared";
}

export const READINESS_LEVEL_LABELS: Record<ReadinessLevel, string> = {
  "foundations-not-ready": "Foundations not ready",
  "preparation-required": "Preparation required",
  "ready-for-structured-discovery": "Ready for structured discovery",
  "ready-for-selection": "Ready for selection",
  "strongly-prepared": "Strongly prepared",
};

export const DIMENSION_LEVEL_LABELS: Record<ReadinessDimensionLevel, string> =
  {
    strong: "Strong",
    good: "Good",
    "needs-work": "Needs work",
    "at-risk": "At risk",
  };

export function scoreBandLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 45) return "Needs attention";
  return "At risk";
}

/**
 * Pure, deterministic scoring for a readiness session.
 * Does not mutate session. Historical results should use frozen lastResult.
 * Pass an SI catalog pack for sales-intelligence assessments.
 */
export function assessCrmReadiness(
  session: Pick<CrmReadinessSession, "answers" | "context">,
  options: {
    criticalBlockerCount?: number;
    catalog?: ReadinessCatalogPack;
  } = {},
): AssessCrmReadinessResult {
  const catalog = options.catalog ?? CRM_READINESS_CATALOG;
  const orgComplexity = deriveOrgComplexity(session.context);
  const visible = getVisibleQuestions(session, catalog);
  const visibleIds = visible.map((q) => q.id);
  const answeredIds: string[] = [];
  const uncertainIds: string[] = [];

  const dimensions: DimensionScoreResult[] = catalog.dimensions.map(
    (dim) => {
      const questions = visible.filter((q) => q.dimensionId === dim.id);
      let weightedSel = 0;
      let weightSel = 0;
      let weightedImpl = 0;
      let weightImpl = 0;
      const drivers: ScoreDriver[] = [];
      let answeredCount = 0;
      let uncertainCount = 0;

      for (const q of questions) {
        const answer = session.answers[q.id];
        if (answer == null || answer.value == null) continue;
        if (Array.isArray(answer.value) && answer.value.length === 0) continue;

        answeredCount += 1;
        answeredIds.push(q.id);
        const resolved = resolveOption(q, answer.value);
        if (resolved.uncertain) {
          uncertainCount += 1;
          uncertainIds.push(q.id);
        }

        const points = resolved.points;
        weightedSel += points * q.selectionWeight;
        weightSel += q.selectionWeight;
        weightedImpl += points * q.implementationWeight;
        weightImpl += q.implementationWeight;

        drivers.push({
          questionId: q.id,
          label: q.prompt,
          points: clampScore(points),
          kind: driverKind(points, resolved.uncertain),
        });
      }

      // Dimension score blends selection + implementation question weights
      // equally at dimension level; aggregates re-weight by dimension.
      const dimSel = weightSel > 0 ? weightedSel / weightSel : 0;
      const dimImpl = weightImpl > 0 ? weightedImpl / weightImpl : 0;
      const score =
        weightSel + weightImpl > 0
          ? (dimSel * weightSel + dimImpl * weightImpl) /
            (weightSel + weightImpl)
          : 0;

      return {
        dimensionId: dim.id,
        score: clampScore(score),
        level: dimensionLevel(score),
        answeredCount,
        questionCount: questions.length,
        uncertainCount,
        drivers: drivers.sort((a, b) => a.points - b.points),
      };
    },
  );

  let selNum = 0;
  let selDen = 0;
  let implNum = 0;
  let implDen = 0;

  for (const dim of catalog.dimensions) {
    const result = dimensions.find((d) => d.dimensionId === dim.id)!;
    if (result.answeredCount === 0) continue;
    selNum += result.score * dim.selectionWeight;
    selDen += dim.selectionWeight;
    implNum += result.score * dim.implementationWeight;
    implDen += dim.implementationWeight;
  }

  const selectionScore = clampScore(selDen > 0 ? selNum / selDen : 0);
  const implementationScore = clampScore(implDen > 0 ? implNum / implDen : 0);
  const overallScore = clampScore(
    selectionScore * 0.55 + implementationScore * 0.45,
  );

  const uniqueAnswered = [...new Set(answeredIds)];
  const completionRatio =
    visibleIds.length > 0 ? uniqueAnswered.length / visibleIds.length : 0;

  return {
    assessmentVersion: catalog.assessmentVersion,
    selectionScore,
    implementationScore,
    overallScore,
    overallLevel: overallLevelFromScores(
      selectionScore,
      implementationScore,
      options.criticalBlockerCount ?? 0,
    ),
    orgComplexity,
    dimensions,
    visibleQuestionIds: visibleIds,
    answeredQuestionIds: uniqueAnswered,
    uncertainQuestionIds: [...new Set(uncertainIds)],
    completionRatio,
  };
}

export function isCriticalAnswer(
  questionId: string,
  value: ReadinessAnswerValue,
  catalog: ReadinessCatalogPack = CRM_READINESS_CATALOG,
): boolean {
  const q = catalog.getQuestionById(questionId) ?? getQuestionById(questionId);
  if (!q?.criticalWhen?.length) return false;
  return answerMatches(value, q.criticalWhen);
}

export function estimateMinutesRemaining(
  session: Pick<CrmReadinessSession, "answers" | "context" | "currentDimensionIndex">,
  catalog: ReadinessCatalogPack = CRM_READINESS_CATALOG,
): number {
  const orgComplexity = deriveOrgComplexity(session.context);
  let remaining = 0;
  for (let i = session.currentDimensionIndex; i < catalog.dimensions.length; i++) {
    const dim = catalog.dimensions[i]!;
    const questions = catalog.questions.filter(
      (q) =>
        q.dimensionId === dim.id &&
        isQuestionVisible(q, session.answers, orgComplexity),
    );
    const unanswered = questions.filter((q) => {
      const a = session.answers[q.id];
      if (a == null || a.value == null) return true;
      if (Array.isArray(a.value) && a.value.length === 0) return true;
      return false;
    });
    if (unanswered.length === 0) continue;
    remaining +=
      dim.estimatedMinutes * (unanswered.length / Math.max(questions.length, 1));
  }
  return Math.max(1, Math.ceil(remaining));
}

export function companySizeLabel(size?: ReadinessCompanySize): string {
  if (!size) return "—";
  return `${size} employees`;
}

export function salesComplexityLabel(
  value?: ReadinessSalesComplexity,
): string {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
