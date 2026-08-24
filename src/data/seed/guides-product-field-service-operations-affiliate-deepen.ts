import {
  TIER_18_SCHEDULED_GUIDE_SLUGS,
  tier18ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T17:30:00.000Z";

const TIER_18_FSO_AFFILIATE_SLUGS = ["contractor-foreman"] as const;
const TIER_18_FSO_EDITORIAL_ANCHOR_SLUGS = ["servicem8"] as const;

/** Tier 18 field-service-operations launch — affiliate what-is (contractor-foreman). */
export const fieldServiceOperationsAffiliateDeepenProductGuides =
  TIER_18_FSO_AFFILIATE_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier18ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );

/** Tier 18 editorial anchor what-is (servicem8 — affiliate URL pending). */
export const fieldServiceOperationsEditorialAnchorProductGuides =
  TIER_18_FSO_EDITORIAL_ANCHOR_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier18ProductWhatIsScheduledAt(productSlug),
      variant: "editorial-anchor",
      stamp: STAMP,
    }),
  );

export const fieldServiceOperationsProductGuides = [
  ...fieldServiceOperationsAffiliateDeepenProductGuides,
  ...fieldServiceOperationsEditorialAnchorProductGuides,
];

export { TIER_18_SCHEDULED_GUIDE_SLUGS };
