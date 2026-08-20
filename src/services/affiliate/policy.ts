import type {
  CommercialCtaContext,
  CommercialCtaIntent,
  AffiliateDestinationType,
} from "@/domain";

/**
 * Central CTA fallback / preference policy.
 * Page agents must not invent their own fallback order.
 */

export const CTA_FALLBACK_ORDER = [
  "requested-promotion-destination",
  "preferred-context-destination",
  "intent-destination",
  "default-affiliate-destination",
  "any-active-affiliate-destination",
  "legacy-software-tracking-url",
  "partner-links-registry",
  "non-affiliate-official-url",
  "no-cta",
] as const;

export type CtaFallbackStep = (typeof CTA_FALLBACK_ORDER)[number];

/** Context → preferred destination type. */
export const CONTEXT_DESTINATION_PREFERENCE: Record<
  CommercialCtaContext,
  AffiliateDestinationType[]
> = {
  "software-review": ["trial", "signup", "homepage", "pricing"],
  "pricing-page": ["pricing", "trial", "signup", "homepage"],
  comparison: ["trial", "homepage", "pricing", "signup"],
  alternatives: ["trial", "homepage", "signup"],
  "best-page": ["trial", "homepage", "signup"],
  finder: ["trial", "homepage", "pricing", "signup"],
  calculator: ["pricing", "trial", "homepage"],
  "category-page": ["homepage", "trial"],
  other: ["homepage", "trial", "signup", "pricing"],
};

export const INTENT_DESTINATION_MAP: Record<
  CommercialCtaIntent,
  AffiliateDestinationType[]
> = {
  VISIT: ["homepage", "signup", "trial"],
  START_TRIAL: ["trial", "signup", "homepage"],
  VIEW_PRICING: ["pricing", "homepage"],
  GET_DEAL: ["offer", "trial", "signup", "homepage"],
  REQUEST_DEMO: ["demo", "contact-sales", "homepage"],
  SIGN_UP: ["signup", "trial", "homepage"],
  LEARN_MORE: ["homepage", "pricing"],
};

/** Allow official (non-affiliate) fallback when no active affiliate destination. */
export const ALLOW_OFFICIAL_FALLBACK = true;

/** Promotion freshness — shorter than general product research. */
export const PROMOTION_FRESHNESS_DAYS = 30;
export const PROMOTION_EXPIRING_SOON_DAYS = 7;
export const PROMOTION_STALE_AFTER_DAYS = 45;
