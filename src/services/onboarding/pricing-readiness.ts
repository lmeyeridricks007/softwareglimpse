import type { PricingReadinessStatus, Software } from "@/domain";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { loadEnrichment } from "@/data/research/store";

type LoosePlan = {
  name?: string;
  contactSales?: boolean;
  rules?: Array<{ kind?: string }>;
};

/**
 * Pricing readiness for onboarding — does not invent calculator support.
 */
export function assessPricingReadiness(product: Software): {
  status: PricingReadinessStatus;
  detectedModel?: string;
  notes: string[];
} {
  const override = getCategoryOnboardingOverride(product.primaryCategorySlug);
  const enrichment = loadEnrichment(product.slug);

  const productPlans = product.pricing?.plans ?? [];
  const enrichmentPricing = enrichment?.pricing as
    | { plans?: LoosePlan[]; verifiedAt?: string; model?: string }
    | undefined;
  const enrichmentPlans = enrichmentPricing?.plans ?? [];
  const plans = productPlans.length ? productPlans : enrichmentPlans;

  if (!product.pricing && !enrichmentPricing) {
    return {
      status: "INSUFFICIENT_RESEARCH",
      notes: ["No verified pricing on product or enrichment"],
    };
  }

  if (plans.length === 0) {
    return {
      status: "INSUFFICIENT_RESEARCH",
      notes: ["Pricing object present but no plans"],
    };
  }

  let detectedModel = "flat";
  const hasPerSeat = plans.some((p) =>
    (p.rules ?? []).some((r) => r.kind === "per-seat"),
  );
  const hasTiered = plans.some((p) =>
    (p.rules ?? []).some(
      (r) => r.kind === "tiered" || r.kind === "per-unit",
    ),
  );
  const hasCustom =
    product.pricing?.model === "custom" ||
    enrichmentPricing?.model === "custom" ||
    plans.some(
      (p) =>
        Boolean((p as LoosePlan).contactSales) ||
        (p.name?.toLowerCase().includes("custom") ?? false),
    );

  if (hasCustom && !hasPerSeat && !hasTiered) detectedModel = "custom";
  else if (hasPerSeat) detectedModel = "per-seat";
  else if (hasTiered) detectedModel = "contact-tiers";
  else if (product.pricing?.model === "usage") detectedModel = "usage";
  else detectedModel = "flat";

  const supported = override.pricingModelsSupported as readonly string[];
  if (detectedModel === "custom") {
    return {
      status: "CUSTOM_QUOTE",
      detectedModel,
      notes: ["Custom quote pricing — calculator may not apply"],
    };
  }

  if (!supported.includes(detectedModel) && !supported.includes("hybrid")) {
    return {
      status: "UNSUPPORTED_MODEL",
      detectedModel,
      notes: [
        `Detected model "${detectedModel}" not in category supported list`,
        "Do not hack into existing calculator — create pricing-engine enhancement requirement",
      ],
    };
  }

  const verified = Boolean(
    product.pricingVerifiedAt ||
      product.pricing?.verifiedAt ||
      enrichmentPricing?.verifiedAt,
  );
  if (!verified) {
    return {
      status: "PARTIAL",
      detectedModel,
      notes: ["Pricing present but not marked verified"],
    };
  }

  return {
    status: "FULL",
    detectedModel,
    notes: ["Verified pricing available for category-supported model"],
  };
}
