import type { RequirementDetailProfile } from "@/domain";
import { requirementDepthPartA } from "./deep-part-a";
import { requirementDepthPartB } from "./deep-part-b";
import { requirementDepthPartC } from "./deep-part-c";

type Depth = Pick<
  RequirementDetailProfile,
  | "displayTitle"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "challenges"
  | "outcomes"
  | "acceptanceNeeds"
  | "workflowSteps"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "faq"
  | "useCaseLinks"
  | "primaryCapabilityHref"
  | "primaryCapabilitySlug"
  | "primaryCapabilityName"
  | "lastReviewedAt"
>;

/**
 * Curated CRM Requirements pillar (CRM-REQ-001…010).
 * Depth overlays hand-authored and graph-synthesized bases.
 */
export const CRM_REQUIREMENT_PILLAR_SLUGS = [
  "separate-sales-processes",
  "automate-lead-follow-up",
  "restrict-access-by-team",
  "forecast-revenue",
  "track-client-interactions",
  "customize-record-fields",
  "support-multiple-currencies",
  "integrate-with-email",
  "support-sso",
  "audit-user-activity",
] as const;

/**
 * Depth layers for CRM requirement detail pages (`/requirements/[slug]/`).
 * Educational / operational — no invented rankings, prices, or product endorsements.
 * Editorial gate approved 2026-08-14 (`seo.indexable: true`).
 */
export const requirementDepthBySlug: Record<string, Depth> = Object.fromEntries(
  Object.entries({
    ...requirementDepthPartA,
    ...requirementDepthPartB,
    ...requirementDepthPartC,
  }).map(([slug, depth]) => [
    slug,
    {
      ...depth,
      lastReviewedAt: depth.lastReviewedAt ?? "2026-08-14T00:00:00.000Z",
    },
  ]),
);
