import type {
  AffiliateDestination,
  AffiliateDestinationType,
  AffiliateProgramme,
  CommercialCtaContext,
  CommercialCtaIntent,
  CommercialCtaResolveInput,
  Promotion,
  Software,
} from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { getPartnerAffiliateUrl } from "@/data/affiliates/source/partner-links";
import {
  getAffiliateDestination,
  getAffiliateProgramme,
  listDestinationsForProduct,
  listProgrammesForProduct,
  listPromotionsForProduct,
} from "@/data/affiliates/store";
import {
  ALLOW_OFFICIAL_FALLBACK,
  CONTEXT_DESTINATION_PREFERENCE,
  INTENT_DESTINATION_MAP,
  type CtaFallbackStep,
} from "./policy";
import {
  buildPromotionLabel,
  buildPromotionSubtext,
  defaultCtaLabel,
  derivePromotionEffectiveStatus,
  isPromotionPubliclyActive,
  selectPrimaryPromotion,
} from "./promotions";
import { validateAffiliateUrl } from "./url-validation";

export type ResolvedPromotionPresentation = {
  id: string;
  headline: string;
  subtext: string | null;
  promoCode: string | null;
  codeRequired: boolean;
  expiresAt: string | null;
  promotionType: Promotion["promotionType"];
  scope: Promotion["scope"];
  terms: string[];
};

export type ResolvedCommercialCta = {
  available: boolean;
  productSlug: string;
  productName: string;
  affiliate: boolean;
  disclosureRequired: boolean;
  label: string;
  intent: CommercialCtaIntent;
  context: CommercialCtaContext;
  /** First-party go path — backward-compatible redirect only; do not use in new page markup. */
  goPath: string | null;
  /** External destination — preferred href for CTAs (direct affiliate / official URL). */
  externalUrl: string | null;
  destination: {
    id: string | null;
    type: AffiliateDestinationType | "official" | "none";
    url: string | null;
  };
  programme: {
    id: string | null;
    name: string | null;
    network: string | null;
    status: string | null;
  };
  promotion: ResolvedPromotionPresentation | null;
  rel: string[];
  fallbackStep: CtaFallbackStep;
  reason?: string;
};

function nowFromInput(input: CommercialCtaResolveInput): Date {
  return input.now ? new Date(input.now) : new Date();
}

function pickDestinationByTypes(
  destinations: AffiliateDestination[],
  types: AffiliateDestinationType[],
): AffiliateDestination | undefined {
  const active = destinations.filter((d) => d.status === "active");
  for (const type of types) {
    const match = active.find((d) => d.destinationType === type);
    if (match) return match;
  }
  return undefined;
}

function activeProgrammeFor(
  productSlug: string,
  programmeId?: string,
): AffiliateProgramme | undefined {
  if (programmeId) {
    const p = getAffiliateProgramme(programmeId);
    if (p && p.status === "active") return p;
    return undefined;
  }
  return listProgrammesForProduct(productSlug).find((p) => p.status === "active");
}

function applyOptionalParams(
  url: string,
  campaign?: string,
  subId?: string,
  campaignParam?: string,
  subIdParam?: string,
): string {
  try {
    const parsed = new URL(url);
    if (campaign && campaignParam) {
      parsed.searchParams.set(campaignParam, campaign);
    }
    if (subId && subIdParam) {
      parsed.searchParams.set(subIdParam, subId);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function goPathFor(
  productSlug: string,
  destinationType: AffiliateDestinationType | "official" | "none",
): string {
  if (destinationType === "none" || destinationType === "official") {
    return `/go/${productSlug}`;
  }
  return `/go/${productSlug}/${destinationType}`;
}

function intentFromContext(
  context: CommercialCtaContext,
  hasPromotion: boolean,
): CommercialCtaIntent {
  if (hasPromotion) return "GET_DEAL";
  switch (context) {
    case "pricing-page":
    case "calculator":
      return "VIEW_PRICING";
    case "software-review":
    case "finder":
    case "comparison":
    case "alternatives":
    case "best-page":
      return "START_TRIAL";
    default:
      return "VISIT";
  }
}

/**
 * Central commercial CTA resolver.
 * Editorial ranking / Finder scoring must run BEFORE this and must ignore affiliate economics.
 */
export function resolveCommercialCta(
  input: CommercialCtaResolveInput,
  softwareOverride?: Software | null,
): ResolvedCommercialCta {
  const productSlug = input.productSlug;
  const software =
    softwareOverride ??
    getSoftwareBySlug(productSlug, { includeUnpublished: true });
  const productName = software?.name ?? productSlug;
  const now = nowFromInput(input);
  const context = input.context ?? "other";

  const empty = (
    reason: string,
    fallbackStep: CtaFallbackStep = "no-cta",
  ): ResolvedCommercialCta => ({
    available: false,
    productSlug,
    productName,
    affiliate: false,
    disclosureRequired: false,
    label: defaultCtaLabel(productName, input.intent ?? "VISIT", false),
    intent: input.intent ?? "VISIT",
    context,
    goPath: null,
    externalUrl: null,
    destination: { id: null, type: "none", url: null },
    programme: { id: null, name: null, network: null, status: null },
    promotion: null,
    rel: ["noopener", "noreferrer"],
    fallbackStep,
    reason,
  });

  if (!software) {
    return empty("UNKNOWN_PRODUCT");
  }

  const promotions = listPromotionsForProduct(productSlug);
  let promotion: Promotion | null = null;
  if (input.promotionId) {
    const requested = promotions.find((p) => p.id === input.promotionId);
    if (requested && isPromotionPubliclyActive(requested, now)) {
      promotion = requested;
    }
  }
  if (!promotion) {
    promotion = selectPrimaryPromotion(promotions, now);
  }

  const intent =
    input.intent ?? intentFromContext(context, Boolean(promotion));

  const destinations = listDestinationsForProduct(productSlug);
  let chosen: AffiliateDestination | undefined;
  let fallbackStep: CtaFallbackStep = "no-cta";

  // 1. Promotion-specific destination
  if (promotion?.destinationId) {
    const dest = getAffiliateDestination(promotion.destinationId);
    const programme = dest
      ? activeProgrammeFor(productSlug, dest.programmeId)
      : undefined;
    if (dest && dest.status === "active" && programme) {
      chosen = dest;
      fallbackStep = "requested-promotion-destination";
    }
  }

  // 2. Preferred context destination
  if (!chosen) {
    const prefs =
      input.preferredDestinationType != null
        ? [input.preferredDestinationType]
        : CONTEXT_DESTINATION_PREFERENCE[context];
    const match = pickDestinationByTypes(destinations, prefs);
    const programme = match
      ? activeProgrammeFor(productSlug, match.programmeId)
      : undefined;
    if (match && programme) {
      chosen = match;
      fallbackStep = "preferred-context-destination";
    }
  }

  // 3. Intent destination
  if (!chosen) {
    const match = pickDestinationByTypes(
      destinations,
      INTENT_DESTINATION_MAP[intent],
    );
    const programme = match
      ? activeProgrammeFor(productSlug, match.programmeId)
      : undefined;
    if (match && programme) {
      chosen = match;
      fallbackStep = "intent-destination";
    }
  }

  // 4. Default affiliate destination
  if (!chosen) {
    const def = destinations.find(
      (d) => d.isDefault && d.status === "active",
    );
    const programme = def
      ? activeProgrammeFor(productSlug, def.programmeId)
      : undefined;
    if (def && programme) {
      chosen = def;
      fallbackStep = "default-affiliate-destination";
    }
  }

  // 5. Any active destination with active programme
  if (!chosen) {
    const any = destinations.find((d) => {
      if (d.status !== "active") return false;
      return Boolean(activeProgrammeFor(productSlug, d.programmeId));
    });
    if (any) {
      chosen = any;
      fallbackStep = "any-active-affiliate-destination";
    }
  }

  // 6. Legacy Software.affiliate.trackingUrl
  if (
    !chosen &&
    software.affiliate.enabled &&
    software.affiliate.trackingUrl
  ) {
    const validated = validateAffiliateUrl(software.affiliate.trackingUrl);
    if (validated.ok) {
      const href = applyOptionalParams(
        validated.url,
        input.campaign,
        input.subId,
        software.affiliate.campaignParam,
        software.affiliate.subIdParam,
      );
      const promoPresentation = promotion
        ? toPromoPresentation(promotion)
        : null;
      return {
        available: true,
        productSlug,
        productName,
        affiliate: true,
        disclosureRequired: software.affiliate.disclosureRequired,
        label: defaultCtaLabel(productName, intent, Boolean(promotion)),
        intent,
        context,
        goPath: goPathFor(productSlug, "homepage"),
        externalUrl: href,
        destination: {
          id: null,
          type: "homepage",
          url: href,
        },
        programme: {
          id: software.affiliate.programmeId ?? null,
          name: software.affiliate.program ?? null,
          network: software.affiliate.network,
          status: "active",
        },
        promotion: promoPresentation,
        rel: ["sponsored", "noopener", "noreferrer"],
        fallbackStep: "legacy-software-tracking-url",
      };
    }
  }

  // 6b. Canonical partner-links registry (source of truth for programme URLs)
  if (!chosen) {
    const partnerUrl = getPartnerAffiliateUrl(productSlug);
    if (partnerUrl) {
      const validated = validateAffiliateUrl(partnerUrl);
      if (validated.ok) {
        const href = applyOptionalParams(
          validated.url,
          input.campaign,
          input.subId,
          software.affiliate.campaignParam,
          software.affiliate.subIdParam,
        );
        return {
          available: true,
          productSlug,
          productName,
          affiliate: true,
          disclosureRequired: true,
          label: defaultCtaLabel(productName, intent, Boolean(promotion)),
          intent,
          context,
          goPath: goPathFor(productSlug, "homepage"),
          externalUrl: href,
          destination: {
            id: null,
            type: "homepage",
            url: href,
          },
          programme: {
            id: software.affiliate.programmeId ?? null,
            name: software.affiliate.program ?? null,
            network: software.affiliate.network,
            status: "active",
          },
          promotion: promotion ? toPromoPresentation(promotion) : null,
          rel: ["sponsored", "noopener", "noreferrer"],
          fallbackStep: "partner-links-registry",
        };
      }
    }
  }

  if (chosen) {
    const programme = activeProgrammeFor(productSlug, chosen.programmeId)!;
    const validated = validateAffiliateUrl(chosen.url);
    if (!validated.ok) {
      // fall through to official
    } else {
      const href = applyOptionalParams(
        validated.url,
        input.campaign,
        input.subId,
        software.affiliate.campaignParam,
        software.affiliate.subIdParam,
      );
      return {
        available: true,
        productSlug,
        productName,
        affiliate: true,
        disclosureRequired: true,
        label: defaultCtaLabel(productName, intent, Boolean(promotion)),
        intent,
        context,
        goPath: goPathFor(productSlug, chosen.destinationType),
        externalUrl: href,
        destination: {
          id: chosen.id,
          type: chosen.destinationType,
          url: href,
        },
        programme: {
          id: programme.id,
          name: programme.name,
          network: programme.network,
          status: programme.status,
        },
        promotion: promotion ? toPromoPresentation(promotion) : null,
        rel: ["sponsored", "noopener", "noreferrer"],
        fallbackStep,
      };
    }
  }

  // 7. Non-affiliate official URL
  if (ALLOW_OFFICIAL_FALLBACK) {
    const official =
      software.affiliate.destinationUrl || software.website || null;
    if (official) {
      const validated = validateAffiliateUrl(official);
      if (validated.ok) {
        return {
          available: true,
          productSlug,
          productName,
          affiliate: false,
          disclosureRequired: false,
          label: defaultCtaLabel(productName, "VISIT", false),
          intent: "VISIT",
          context,
          goPath: goPathFor(productSlug, "official"),
          externalUrl: validated.url,
          destination: {
            id: null,
            type: "official",
            url: validated.url,
          },
          programme: {
            id: null,
            name: null,
            network: software.affiliate.network,
            status: null,
          },
          promotion: null,
          rel: ["noopener", "noreferrer"],
          fallbackStep: "non-affiliate-official-url",
        };
      }
    }
  }

  return empty("NO_DESTINATION", "no-cta");
}

function toPromoPresentation(
  promotion: Promotion,
): ResolvedPromotionPresentation {
  return {
    id: promotion.id,
    headline: buildPromotionLabel(promotion),
    subtext: buildPromotionSubtext(promotion),
    promoCode: promotion.promoCode ?? null,
    codeRequired: promotion.codeRequired,
    expiresAt: promotion.noExpiry ? null : (promotion.endsAt ?? null),
    promotionType: promotion.promotionType,
    scope: promotion.scope,
    terms: promotion.terms,
  };
}

/** Surfaces that should revalidate when affiliate/promotion data changes. */
export function affiliateAffectedTags(productSlug: string): string[] {
  return [
    `affiliate:${productSlug}`,
    `software:${productSlug}`,
    `pricing:${productSlug}`,
    `alternatives:${productSlug}`,
    `domain:affiliate`,
    `tool:crm-finder`,
    `tool:crm-cost-calculator`,
  ];
}

export function promotionEffectiveNote(
  promotion: Promotion,
  now: Date = new Date(),
): string {
  return derivePromotionEffectiveStatus(promotion, now);
}
