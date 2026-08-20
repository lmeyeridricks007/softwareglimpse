import {
  EditorialDraftSchema,
  ProductEditorialAssessmentSchema,
  ProductReviewSchema,
  type EditorialDraft,
  type ProductEditorialAssessment,
  type ProductReview,
} from "@/domain";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
} from "@/data/repositories/catalog";
import {
  listAllDrafts,
  listAssessments,
  loadReview,
} from "@/data/editorial/store";

export type EditorialValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
  target?: string;
};

export type EditorialValidationReport = {
  ok: boolean;
  issues: EditorialValidationIssue[];
};

const UNSUPPORTED_CLAIM_PATTERNS: RegExp[] = [
  /\bwe tested\b/i,
  /\bhands[- ]on tested\b/i,
  /\bour testing (shows|found|confirmed)\b/i,
  /\blive price(s)? (is|are|guarantee)\b/i,
  /\bguaranteed cheapest\b/i,
];

const PRICE_NUMBER_PATTERN = /(?:\$|USD\s*)\d+(?:\.\d+)?|\b\d+\s*(?:\/\s*mo|per month)\b/i;

export function validateEditorialRepository(): EditorialValidationReport {
  const issues: EditorialValidationIssue[] = [];

  for (const assessment of listAssessments()) {
    validateAssessment(assessment, issues);
    const review = loadReview(assessment.productSlug);
    if (review) validateReview(review, assessment, issues);
  }

  for (const draft of listAllDrafts()) {
    validateDraft(draft, issues);
  }

  validateComparisonSeeds(issues);
  validateAlternativesSeeds(issues);
  validateBestSeeds(issues);

  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

function validateAssessment(
  assessment: ProductEditorialAssessment,
  issues: EditorialValidationIssue[],
): void {
  const parsed = ProductEditorialAssessmentSchema.safeParse(assessment);
  if (!parsed.success) {
    issues.push({
      code: "assessment-schema",
      severity: "error",
      target: assessment.productSlug,
      message: parsed.error.message,
    });
    return;
  }

  if (assessment.handsOnTesting) {
    issues.push({
      code: "hands-on-flag",
      severity: "warning",
      target: assessment.productSlug,
      message: "handsOnTesting=true requires documented testing notes before publish.",
    });
  }

  if (assessment.status === "approved" && assessment.confidence === "low") {
    issues.push({
      code: "approved-low-confidence",
      severity: "error",
      target: assessment.productSlug,
      message: "Approved assessments cannot remain low confidence.",
    });
  }

  for (const criterion of assessment.criterionAssessments) {
    if (!criterion.rationale.trim()) {
      issues.push({
        code: "criterion-missing-rationale",
        severity: "error",
        target: assessment.productSlug,
        message: `Criterion ${criterion.criterionSlug} missing rationale.`,
      });
    }
  }

  scanProhibitedClaims(
    [
      assessment.verdict,
      assessment.recommendation,
      assessment.editorialNotes,
      assessment.testingNotes,
      ...assessment.strengths,
      ...assessment.weaknesses,
    ],
    assessment.productSlug,
    issues,
  );
}

function validateReview(
  review: ProductReview,
  assessment: ProductEditorialAssessment,
  issues: EditorialValidationIssue[],
): void {
  const parsed = ProductReviewSchema.safeParse(review);
  if (!parsed.success) {
    issues.push({
      code: "review-schema",
      severity: "error",
      target: review.productSlug,
      message: parsed.error.message,
    });
    return;
  }

  if (review.seo.indexable && review.editorialStatus !== "approved") {
    issues.push({
      code: "indexable-unapproved-review",
      severity: "error",
      target: review.productSlug,
      message: "Review cannot be indexable unless editorialStatus is approved.",
    });
  }

  if (
    review.overallScore != null &&
    review.editorialStatus !== "approved" &&
    assessment.status !== "approved"
  ) {
    issues.push({
      code: "unapproved-public-score",
      severity: "warning",
      target: review.productSlug,
      message:
        "overallScore present on unapproved review — UI must hide score until approved.",
    });
  }

  if (review.handsOnTesting && !assessment.handsOnTesting) {
    issues.push({
      code: "hands-on-mismatch",
      severity: "error",
      target: review.productSlug,
      message: "Review claims hands-on testing but assessment does not.",
    });
  }

  scanProhibitedClaims(
    [review.intro, review.summary, review.verdict, review.pricingSummary],
    review.productSlug,
    issues,
  );
}

function validateDraft(
  draft: EditorialDraft,
  issues: EditorialValidationIssue[],
): void {
  const parsed = EditorialDraftSchema.safeParse(draft);
  if (!parsed.success) {
    issues.push({
      code: "draft-schema",
      severity: "error",
      target: draft.id,
      message: parsed.error.message,
    });
    return;
  }

  const bodies = [
    draft.summary,
    draft.verdict,
    ...draft.sections.map((section) => section.body),
    ...draft.faq.map((item) => item.answer),
  ];
  scanProhibitedClaims(bodies, draft.id, issues);

  for (const body of bodies) {
    if (body && PRICE_NUMBER_PATTERN.test(body)) {
      issues.push({
        code: "unsupported-number",
        severity: "warning",
        target: draft.id,
        message:
          "Draft contains price-like numbers without approvedNumbers gate — verify before publish.",
      });
    }
  }
}

function validateComparisonSeeds(issues: EditorialValidationIssue[]): void {
  for (const comparison of getAllComparisonsUnfiltered()) {
    if (comparison.seo.indexable && comparison.editorialStatus !== "approved") {
      issues.push({
        code: "indexable-unapproved-comparison",
        severity: "error",
        target: comparison.slug,
        message: "Comparison indexable without approved editorialStatus.",
      });
    }

    if (
      comparison.overallWinnerKind === undefined &&
      comparison.outcomes.length > 0
    ) {
      issues.push({
        code: "missing-overall-winner-kind",
        severity: "warning",
        target: comparison.slug,
        message: "Outcomes exist but overallWinnerKind is unset (prefer depends/tie).",
      });
    }

    scanProhibitedClaims(
      [comparison.verdict, comparison.summary, comparison.pricingNotes],
      comparison.slug,
      issues,
    );
  }
}

function validateAlternativesSeeds(issues: EditorialValidationIssue[]): void {
  for (const page of getAllAlternativesUnfiltered()) {
    if (page.seo.indexable && page.editorialStatus !== "approved") {
      issues.push({
        code: "indexable-unapproved-alternatives",
        severity: "error",
        target: page.slug,
        message: "Alternatives page indexable without approved editorialStatus.",
      });
    }

    for (const entry of page.alternatives) {
      if (
        entry.reason &&
        (!entry.betterWhen.length || !entry.worseWhen.length || !entry.keyTradeoff)
      ) {
        issues.push({
          code: "incomplete-alternative-structure",
          severity: "warning",
          target: `${page.slug}:${entry.targetSlug}`,
          message:
            "Reasoned alternative should include betterWhen, worseWhen, and keyTradeoff.",
        });
      }
    }
  }
}

function validateBestSeeds(issues: EditorialValidationIssue[]): void {
  for (const page of getAllBestPagesUnfiltered()) {
    if (page.seo.indexable && page.editorialStatus !== "approved") {
      issues.push({
        code: "indexable-unapproved-best",
        severity: "error",
        target: page.slug,
        message: "Best page indexable without approved editorialStatus.",
      });
    }

    for (const rec of page.recommendations) {
      if (rec.badge?.toLowerCase() === "best overall" && !rec.approved) {
        issues.push({
          code: "unapproved-best-overall-badge",
          severity: "error",
          target: `${page.slug}:${rec.productSlug}`,
          message: '"Best overall" badge requires approved:true.',
        });
      }
    }

    if (page.metadata.researchStatus === "complete" && page.editorialStatus !== "approved") {
      issues.push({
        code: "research-complete-unapproved-best",
        severity: "warning",
        target: page.slug,
        message: "researchStatus complete while editorial still unapproved.",
      });
    }
  }
}

function scanProhibitedClaims(
  values: Array<string | undefined | null>,
  target: string,
  issues: EditorialValidationIssue[],
): void {
  for (const value of values) {
    if (!value) continue;
    for (const pattern of UNSUPPORTED_CLAIM_PATTERNS) {
      if (pattern.test(value)) {
        issues.push({
          code: "prohibited-claim",
          severity: "error",
          target,
          message: `Prohibited claim matched ${pattern}: "${value.slice(0, 80)}"`,
        });
      }
    }
  }
}
