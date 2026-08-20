import {
  coerceAiCapabilityKind,
  coerceFeatureAvailability,
  type ProductResearchEnrichment,
  type ResearchFact,
  type Software,
} from "@/domain";
import { ResearchSourceSchema, SoftwareSchema } from "@/domain";
import { buildPricingEnvelope } from "./normalize";
import { nowIso } from "./utils";

export type MergeOptions = {
  /** Fixture facts never overwrite canonical pricing unless explicitly allowed. */
  allowFixtureMerge?: boolean;
  /** Unapproved/normalized-only facts cannot overwrite verified data. */
  requireApproved?: boolean;
};

export type MergeResult = {
  software: Software;
  enrichment: ProductResearchEnrichment;
  appliedFactIds: string[];
  skipped: Array<{ factId: string; reason: string }>;
};

/**
 * Controlled merge of approved research facts into enrichment + software patch.
 */
export function mergeApprovedFacts(input: {
  software: Software;
  facts: ResearchFact[];
  existingEnrichment?: ProductResearchEnrichment;
  options?: MergeOptions;
}): MergeResult {
  const requireApproved = input.options?.requireApproved ?? true;
  const allowFixtureMerge = input.options?.allowFixtureMerge ?? false;
  const skipped: MergeResult["skipped"] = [];
  const applied: string[] = [];

  const usable = input.facts.filter((fact) => {
    if (requireApproved && fact.status !== "approved" && fact.status !== "verified") {
      skipped.push({ factId: fact.id, reason: "not-approved" });
      return false;
    }
    if (fact.isFixture && !allowFixtureMerge) {
      skipped.push({ factId: fact.id, reason: "fixture-blocked" });
      return false;
    }
    if (fact.status === "conflict" || fact.status === "rejected") {
      skipped.push({ factId: fact.id, reason: `status-${fact.status}` });
      return false;
    }
    return true;
  });

  const enrichment: ProductResearchEnrichment = {
    productSlug: input.software.slug,
    shortDescription: input.existingEnrichment?.shortDescription,
    featureSupport: [...(input.existingEnrichment?.featureSupport ?? [])],
    integrationSupport: [
      ...(input.existingEnrichment?.integrationSupport ?? []),
    ],
    aiCapabilities: [...(input.existingEnrichment?.aiCapabilities ?? [])],
    vendorPositioning: [...(input.existingEnrichment?.vendorPositioning ?? [])],
    editorialFit: [...(input.existingEnrichment?.editorialFit ?? [])],
    limitations: [...(input.existingEnrichment?.limitations ?? [])],
    pricing: input.existingEnrichment?.pricing,
    screenshots: [...(input.existingEnrichment?.screenshots ?? [])],
    media: [...(input.existingEnrichment?.media ?? [])],
    domainCheckedAt: { ...(input.existingEnrichment?.domainCheckedAt ?? {}) },
    sourceIds: [...(input.existingEnrichment?.sourceIds ?? [])],
    updatedAt: nowIso(),
    notes: input.existingEnrichment?.notes,
  };

  let nextSoftware: Software = { ...input.software };

  for (const fact of usable) {
    applied.push(fact.id);
    enrichment.sourceIds = [
      ...new Set([...enrichment.sourceIds, ...fact.sourceIds]),
    ];
    enrichment.domainCheckedAt[fact.domain] = fact.verifiedAt || fact.extractedAt;

    if (fact.field === "identity.shortDescription") {
      enrichment.shortDescription = String(fact.value);
      nextSoftware = {
        ...nextSoftware,
        shortDescription: String(fact.value),
      };
    }

    if (fact.field === "positioning.vendorClaim") {
      enrichment.vendorPositioning.push({
        claim: String(fact.value),
        audienceHints: [],
        sourceIds: fact.sourceIds,
      });
    }

    if (fact.field.startsWith("features.")) {
      const value = fact.value as {
        featureSlug: string;
        availability:
          | "supported"
          | "limited"
          | "add-on"
          | "higher-plan-only"
          | "not-supported"
          | "unknown";
        planSlugs?: string[];
        sourceIds?: string[];
      };
      enrichment.featureSupport = enrichment.featureSupport.filter(
        (item) => item.featureSlug !== value.featureSlug,
      );
      enrichment.featureSupport.push({
        featureSlug: value.featureSlug,
        availability: coerceFeatureAvailability(value.availability),
        planSlugs: value.planSlugs ?? [],
        sourceIds: value.sourceIds ?? fact.sourceIds,
      });
    }

    if (fact.field.startsWith("ai.")) {
      const value = fact.value as {
        capability:
          | "email-generation"
          | "lead-scoring"
          | "summaries"
          | "assistant"
          | "forecasting"
          | "automation"
          | "recommendations"
          | "transcription"
          | "other";
        availability:
          | "supported"
          | "limited"
          | "add-on"
          | "higher-plan-only"
          | "not-supported"
          | "unknown";
        sourceIds?: string[];
      };
      enrichment.aiCapabilities = enrichment.aiCapabilities.filter(
        (item) => item.capability !== value.capability,
      );
      enrichment.aiCapabilities.push({
        capability: coerceAiCapabilityKind(value.capability),
        availability: coerceFeatureAvailability(value.availability),
        sourceIds: value.sourceIds ?? fact.sourceIds,
      });
    }
  }

  const pricingFacts = usable.filter(
    (f) =>
      f.field.startsWith("pricing.") ||
      f.domain === "plans" ||
      f.domain === "pricing" ||
      f.domain === "free-plan" ||
      f.domain === "free-trial",
  );

  if (pricingFacts.length > 0) {
    const envelope = buildPricingEnvelope(pricingFacts);
    enrichment.pricing = envelope;

    // Only write into canonical software.pricing when not fixture-blocked
    if (allowFixtureMerge || !pricingFacts.some((f) => f.isFixture)) {
      nextSoftware = {
        ...nextSoftware,
        pricing: {
          currency: envelope.currency as "USD",
          model: (envelope.model as Software["pricing"] extends infer P
            ? P extends { model: infer M }
              ? M
              : never
            : never) || "subscription",
          hasFreePlan: envelope.hasFreePlan,
          hasFreeTrial: envelope.hasFreeTrial,
          startingPriceMonthly: envelope.startingPriceMonthly,
          plans: envelope.plans.map((plan) => ({
            id: plan.id,
            slug: plan.slug,
            name: plan.name,
            isFree: plan.isFree,
            contactSales: plan.contactSales,
            rules: plan.rules.map((rule) => {
              if (rule.kind === "per-seat") {
                return {
                  kind: "per-seat" as const,
                  amountPerSeat: rule.amountPerSeat,
                  currency: rule.currency as "USD",
                  interval: rule.interval,
                  amountPeriod: rule.amountPeriod,
                  minimumSeats: rule.minimumSeats,
                };
              }
              if (rule.kind === "per-unit") {
                return {
                  kind: "per-unit" as const,
                  unit: (rule.unit as "credit") || "other",
                  amountPerUnit: rule.amountPerUnit,
                  currency: rule.currency as "USD",
                  interval: rule.interval,
                  amountPeriod: rule.amountPeriod,
                };
              }
              return {
                kind: "flat" as const,
                amount: rule.amount,
                currency: rule.currency as "USD",
                interval: rule.interval,
                amountPeriod: rule.amountPeriod,
              };
            }),
          })),
          notes: envelope.notes,
          sourceIds: envelope.sourceIds,
          verifiedAt: nowIso(),
        },
        pricingVerifiedAt: nowIso(),
      };
    }
  }

  nextSoftware = {
    ...nextSoftware,
    sources: [
      ...nextSoftware.sources,
      ...enrichment.sourceIds.map((id) =>
        ResearchSourceSchema.parse({
          id,
          sourceType: "fixture",
          authority: "fixture",
          status: "active",
          fieldsSupported: [],
          domains: [],
        }),
      ),
    ].filter(
      (source, index, arr) =>
        arr.findIndex((item) => item.id === source.id) === index,
    ),
    lastResearchedAt: nowIso(),
    lastVerifiedAt: nowIso(),
    metadata: {
      ...nextSoftware.metadata,
      researchStatus:
        applied.length > 0 ? "in-progress" : nextSoftware.metadata.researchStatus,
      updatedAt: nowIso(),
    },
  };

  const parsed = SoftwareSchema.parse(nextSoftware);

  return {
    software: parsed,
    enrichment,
    appliedFactIds: applied,
    skipped,
  };
}

/**
 * Guard: verified/approved facts must not be overwritten by lower-confidence candidates.
 */
export function canOverwriteFact(
  existing: ResearchFact | undefined,
  incoming: ResearchFact,
): boolean {
  if (!existing) return true;
  if (existing.status === "verified" || existing.status === "approved") {
    if (incoming.status !== "verified" && incoming.status !== "approved") {
      return false;
    }
    const rank = { low: 1, medium: 2, high: 3 } as const;
    if (rank[incoming.confidence] < rank[existing.confidence]) {
      return false;
    }
  }
  if (existing.isFixture === false && incoming.isFixture === true) {
    return false;
  }
  return true;
}
