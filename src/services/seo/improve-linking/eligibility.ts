import type { BatchPageRef, LinkingEligibility } from "./types";

/** Meaningful quality lift — not noise from re-runs. */
export const MIN_QUALITY_DELTA = 3;

/**
 * Configurable absolute quality floor for stronger inbound linking.
 * Override with SG_LINK_MIN_QUALITY (0–100).
 */
export function minQualityScore(): number {
  const raw = process.env.SG_LINK_MIN_QUALITY;
  if (raw === undefined || raw === "") return 70;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 70;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Stronger inbound linking is only for pages that improved (or are
 * already promote-ready), clear the quality floor, and carry real
 * buyer value — never mass-link weak orphans.
 */
export function assessLinkingEligibility(
  page: BatchPageRef,
): LinkingEligibility {
  const reasons: string[] = [];
  if (page.stillBlocked) {
    return {
      path: page.path,
      eligible: false,
      qualityImproved: false,
      userValue: false,
      reasons: ["still_blocked"],
    };
  }

  const floor = minQualityScore();
  const before = page.beforeQuality ?? 0;
  const after = page.afterQuality ?? before;
  const delta = after - before;
  const promoteReady =
    page.lifecycleState === "INDEXABLE_READY" ||
    page.lifecycleState === "INDEXABLE";

  const qualityImproved =
    Boolean(page.materiallyImproved) ||
    delta >= MIN_QUALITY_DELTA ||
    promoteReady;

  if (!qualityImproved) {
    reasons.push("quality_not_improved_meaningfully");
  }

  const meetsQualityFloor = after >= floor;
  if (!meetsQualityFloor) {
    reasons.push(`below_min_quality_${floor}`);
  }

  const meaningfulContent =
    (page.uniqueValueCount ?? 0) > 0 ||
    Boolean(page.materiallyImproved) ||
    after >= floor;

  if (!meaningfulContent) {
    reasons.push("insufficient_meaningful_content");
  }

  const userValue =
    meaningfulContent ||
    promoteReady ||
    (page.uniqueValueCount ?? 0) > 0;

  if (!userValue) {
    reasons.push("insufficient_user_value");
  }

  const eligible =
    qualityImproved && meetsQualityFloor && meaningfulContent && userValue;
  if (eligible) reasons.push("eligible_for_contextual_inbound");

  return {
    path: page.path,
    eligible,
    qualityImproved,
    userValue,
    reasons,
  };
}
