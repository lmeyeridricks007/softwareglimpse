import type { PriceChangeConfidence, PriceChangeKind } from "@/domain";

export type ClassifyPriceChangeInput = {
  kind: PriceChangeKind;
  percentageChange?: number | null;
  absoluteChange?: number | null;
  /** Vendor page / research merge with sourceIds and verifiedAt, no verify-live. */
  deterministicSource?: boolean;
  currencyChanged?: boolean;
  verifyLiveFlag?: boolean;
  structuralChange?: boolean;
  observationCountInSeries?: number;
  noteworthyOverride?: boolean;
};

export type ClassifiedPriceChange = {
  confidence: PriceChangeConfidence;
  requiresHumanVerification: boolean;
  validationNotes: string[];
  noteworthy: boolean;
};

const MAJOR_PCT = 15;
const MAJOR_ABS_USD = 10;

/**
 * Validation rules for monitor confidence.
 * Scraped or ambiguous diffs must not become CONFIRMED public claims.
 */
export function classifyPriceChangeConfidence(
  input: ClassifyPriceChangeInput,
): ClassifiedPriceChange {
  const notes: string[] = [];
  const pct = input.percentageChange;
  const abs = input.absoluteChange;

  const largeMove =
    (pct != null && Math.abs(pct) >= MAJOR_PCT) ||
    (abs != null && Math.abs(abs) >= MAJOR_ABS_USD);

  const alwaysReviewKinds = new Set<PriceChangeKind>([
    "free_plan_removed",
    "contact_sales_conversion",
    "billing_model_changed",
    "ai_addon_introduced",
    "ai_pricing_changed",
    "removed_plan",
  ]);

  const noteworthy =
    Boolean(input.noteworthyOverride) ||
    largeMove ||
    alwaysReviewKinds.has(input.kind) ||
    input.kind === "free_plan_added" ||
    input.kind === "new_plan";

  if (input.currencyChanged) {
    notes.push("Currency changed — requires human verification");
    return {
      confidence: "REQUIRES_REVIEW",
      requiresHumanVerification: true,
      validationNotes: notes,
      noteworthy: true,
    };
  }

  if (input.verifyLiveFlag) {
    notes.push("Pricing notes include verify-live — not CONFIRMED");
    return {
      confidence: "REQUIRES_REVIEW",
      requiresHumanVerification: true,
      validationNotes: notes,
      noteworthy,
    };
  }

  if (alwaysReviewKinds.has(input.kind) || input.structuralChange) {
    notes.push(
      `Structural / high-impact change (${input.kind}) requires human verification before public claims`,
    );
    return {
      confidence: "REQUIRES_REVIEW",
      requiresHumanVerification: true,
      validationNotes: notes,
      noteworthy: true,
    };
  }

  if (input.deterministicSource && !largeMove) {
    notes.push(
      "Deterministic verified list-price source with bounded numeric delta",
    );
    return {
      confidence: "CONFIRMED",
      requiresHumanVerification: false,
      validationNotes: notes,
      noteworthy,
    };
  }

  if (input.deterministicSource && largeMove) {
    notes.push(
      "Deterministic source but large move — human verification before publication",
    );
    return {
      confidence: "REQUIRES_REVIEW",
      requiresHumanVerification: true,
      validationNotes: notes,
      noteworthy: true,
    };
  }

  notes.push(
    "Material difference vs observations without highly deterministic verification",
  );
  return {
    confidence: "LIKELY",
    requiresHumanVerification: true,
    validationNotes: notes,
    noteworthy,
  };
}
