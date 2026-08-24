import type { Pricing, Software } from "@/domain";
import { PricingSchema } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { normalizePricingInput } from "./build-snapshot";

export function resolveProductPricing(software: Software): {
  pricing: Pricing | null;
  verifiedAt: string | null;
} {
  const enrichment = loadEnrichment(software.slug);
  const candidates = [enrichment?.pricing, software.pricing];
  for (const raw of candidates) {
    if (raw == null) continue;
    const parsed = PricingSchema.safeParse(normalizePricingInput(raw));
    if (!parsed.success) continue;
    const verifiedAt =
      parsed.data.verifiedAt ??
      enrichment?.domainCheckedAt?.pricing ??
      software.pricingVerifiedAt ??
      null;
    return { pricing: parsed.data, verifiedAt };
  }
  return {
    pricing: null,
    verifiedAt:
      enrichment?.domainCheckedAt?.pricing ??
      software.pricingVerifiedAt ??
      null,
  };
}
