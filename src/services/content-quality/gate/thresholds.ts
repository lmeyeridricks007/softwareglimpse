/**
 * Shared Content Quality Gate thresholds.
 * Never lower these to inflate indexed URL count.
 */
export const CONTENT_QUALITY_GATE_VERSION = "1.1.0";

/** Unique-content ratio floor for standard guides / comparisons. */
export const UNIQUE_RATIO_MIN = 0.35;

/** Higher bar for template-heavy factory packs and product explainers. */
export const UNIQUE_RATIO_MIN_TEMPLATE_HEAVY = 0.45;

/** Boilerplate share above this fails uniqueness (guide or comparison). */
export const BOILERPLATE_SHARE_MAX = 0.55;

/**
 * Dimensional quality floor for indexEligible when hard fails are clear.
 * Aligns with “good but improvable” band — not a word-count proxy.
 */
export const INDEX_QUALITY_SCORE_MIN = 70;

/** Soft substance signal — warning only, never a hard fail by itself. */
export const WORD_COUNT_SOFT_WARN = 250;
