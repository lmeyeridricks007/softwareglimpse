/**
 * Detection thresholds for SEO opportunity engines.
 * Tunable heuristics — not live GSC defaults.
 */
export const seoThresholds = {
  /** Minimum impressions before most opportunity detectors fire. */
  minImpressions: 100,
  /** Minimum clicks in the prior period to evaluate content decay. */
  minClicksForDecay: 20,
  /** Average position band considered "striking distance". */
  strikingDistance: { min: 4, max: 20 },
  /** Prior→current click drop % that flags content-decay. */
  decayClickDropPct: 25,
  /** Prior→current impression growth % that flags growth. */
  growthImpressionPct: 40,
  /** Min impressions per overlapping page for cannibalization. */
  cannibalizationMinImpressionOverlap: 50,
  /** Absolute CTR gap vs baseline mid (fraction, e.g. 0.02 = 2pp). */
  lowCtrGapAbs: 0.02,
  /** Relative CTR vs baseline mid below which low-CTR fires (e.g. 0.6 = 60%). */
  lowCtrRatio: 0.6,
  /** Zero-click high-impression floor. */
  minImpressionsNoClick: 150,
} as const;

export type SeoThresholds = typeof seoThresholds;
