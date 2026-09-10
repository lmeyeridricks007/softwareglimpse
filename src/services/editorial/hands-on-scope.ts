/**
 * Human / HANDS_ON verification is intentionally out of scope for the
 * current SoftwareGlimpse remediation phase.
 *
 * Keep evidence honesty: never claim we tested, used, or hands-on reviewed
 * a product unless a genuine completed ProductTestSession exists.
 * Do not treat HANDS_ON remaining 0 as a growth, promotion, or improvement gate.
 */
export const HANDS_ON_SCOPE = "NOT_CURRENT_SCOPE" as const;

export type HandsOnScope = typeof HANDS_ON_SCOPE;

/** Public / dashboard reporting: count stays 0, scope is explicit. */
export const HANDS_ON_SCOPE_LABEL = `0 / ${HANDS_ON_SCOPE}`;

export const HANDS_ON_SCOPE_NOTE =
  "HANDS_ON is 0 / NOT_CURRENT_SCOPE for the current remediation phase (future enhancement). DATA_VERIFIED structured facts, vendor primary sources, documented pricing, reputable secondary research, original SoftwareGlimpse datasets, and labelled editorial analysis are sufficient. Missing hands-on tests must not block page improvement or promotion.";

/** DATA_VERIFIED coverage that counts as on-track for the current evidence pillar. */
export const DATA_VERIFIED_EVIDENCE_ON_TRACK = 150;
