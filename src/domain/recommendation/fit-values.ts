import type { FeatureAvailability, FitLevel } from "@/domain/schemas";

/**
 * Central numeric mappings for deterministic recommendation scoring.
 * Keep all FitLevel / availability / integration kind → score conversions here.
 */

export const FIT_LEVEL_SCORE: Record<FitLevel, number | null> = {
  strong: 1,
  good: 0.8,
  moderate: 0.6,
  weak: 0.3,
  "not-suitable": 0,
  unknown: null,
};

export const FEATURE_AVAILABILITY_SCORE: Record<
  FeatureAvailability,
  number | null
> = {
  supported: 1,
  "higher-plan-only": 0.75,
  "add-on": 0.65,
  limited: 0.5,
  "not-supported": 0,
  unknown: null,
};

export type IntegrationKindScoreKey =
  | "native"
  | "official-connector"
  | "third-party"
  | "zapier-style"
  | "api-only"
  | "unsupported"
  | "unknown";

export const INTEGRATION_KIND_SCORE: Record<
  IntegrationKindScoreKey,
  number | null
> = {
  native: 1,
  "official-connector": 0.85,
  "third-party": 0.6,
  "zapier-style": 0.55,
  "api-only": 0.4,
  unsupported: 0,
  unknown: null,
};

export function fitLevelToScore(level: FitLevel | undefined): number | null {
  if (!level) return null;
  return FIT_LEVEL_SCORE[level];
}

export function featureAvailabilityToScore(
  availability: FeatureAvailability | undefined,
): number | null {
  if (!availability) return null;
  return FEATURE_AVAILABILITY_SCORE[availability];
}

export function integrationKindToScore(
  kind: IntegrationKindScoreKey | undefined,
): number | null {
  if (!kind) return null;
  return INTEGRATION_KIND_SCORE[kind];
}
