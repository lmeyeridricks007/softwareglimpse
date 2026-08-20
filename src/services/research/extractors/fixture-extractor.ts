import type { ResearchFact, ResearchSnapshot } from "@/domain";
import { nowIso } from "../utils";

export type ExtractionRequest = {
  productSlug: string;
  domains: string[];
};

export interface FactExtractor {
  extract(
    snapshot: ResearchSnapshot,
    request: ExtractionRequest,
  ): Promise<ResearchFact[]>;
}

/**
 * Deterministic fixture extractor — parses marked KEY: value lines and sections.
 * Not an LLM. AI extractors can implement FactExtractor later.
 */
export class FixtureFactExtractor implements FactExtractor {
  async extract(
    snapshot: ResearchSnapshot,
    request: ExtractionRequest,
  ): Promise<ResearchFact[]> {
    const facts: ResearchFact[] = [];
    const text = snapshot.extractedText;
    const extractedAt = nowIso();
    const base = {
      productSlug: request.productSlug,
      sourceIds: [snapshot.sourceId],
      extractedAt,
      confidence: "medium" as const,
      status: "extracted" as const,
      isFixture: snapshot.isFixture,
    };

    const shortDescription = matchField(text, "SHORT_DESCRIPTION");
    if (shortDescription && request.domains.includes("identity")) {
      facts.push({
        id: factId(request.productSlug, "identity.shortDescription", snapshot.sourceId),
        ...base,
        domain: "identity",
        field: "identity.shortDescription",
        value: shortDescription,
        evidence: [
          {
            sourceId: snapshot.sourceId,
            excerpt: clip(shortDescription),
            locator: "SHORT_DESCRIPTION",
          },
        ],
      });
    }

    const vendorClaim = matchField(text, "VENDOR_POSITIONING");
    if (vendorClaim && request.domains.includes("product-positioning")) {
      facts.push({
        id: factId(request.productSlug, "positioning.claim", snapshot.sourceId),
        ...base,
        domain: "product-positioning",
        field: "positioning.vendorClaim",
        value: vendorClaim,
        evidence: [
          {
            sourceId: snapshot.sourceId,
            excerpt: clip(vendorClaim),
            locator: "VENDOR_POSITIONING",
          },
        ],
      });
    }

    if (
      request.domains.includes("pricing") ||
      request.domains.includes("plans")
    ) {
      const plans = parsePlans(text);
      for (const plan of plans) {
        facts.push({
          id: factId(
            request.productSlug,
            `pricing.plans.${plan.slug}`,
            snapshot.sourceId,
          ),
          ...base,
          domain: "plans",
          field: `pricing.plans.${plan.slug}`,
          value: plan,
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: clip(
                `${plan.name} ${plan.amountPerSeat ?? plan.amount ?? ""} ${plan.currency}`,
              ),
              locator: `PLAN ${plan.slug}`,
            },
          ],
        });
      }

      const currency = matchField(text, "CURRENCY");
      if (currency) {
        facts.push({
          id: factId(request.productSlug, "pricing.currency", snapshot.sourceId),
          ...base,
          domain: "pricing",
          field: "pricing.currency",
          value: currency,
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: currency,
              locator: "CURRENCY",
            },
          ],
        });
      }

      const hasFreeTrial = matchField(text, "FREE_TRIAL");
      if (hasFreeTrial) {
        facts.push({
          id: factId(request.productSlug, "pricing.hasFreeTrial", snapshot.sourceId),
          ...base,
          domain: "free-trial",
          field: "pricing.hasFreeTrial",
          value: hasFreeTrial.toLowerCase() === "true",
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: `FREE_TRIAL: ${hasFreeTrial}`,
              locator: "FREE_TRIAL",
            },
          ],
        });
      }

      const hasFreePlan = matchField(text, "FREE_PLAN");
      if (hasFreePlan) {
        facts.push({
          id: factId(request.productSlug, "pricing.hasFreePlan", snapshot.sourceId),
          ...base,
          domain: "free-plan",
          field: "pricing.hasFreePlan",
          value: hasFreePlan.toLowerCase() === "true",
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: `FREE_PLAN: ${hasFreePlan}`,
              locator: "FREE_PLAN",
            },
          ],
        });
      }

      const model = matchField(text, "PRICING_MODEL");
      if (model) {
        facts.push({
          id: factId(request.productSlug, "pricing.model", snapshot.sourceId),
          ...base,
          domain: "pricing",
          field: "pricing.model",
          value: model,
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: model,
              locator: "PRICING_MODEL",
            },
          ],
        });
      }
    }

    if (request.domains.includes("features")) {
      for (const feature of parseFeatures(text)) {
        facts.push({
          id: factId(
            request.productSlug,
            `features.${feature.featureSlug}`,
            snapshot.sourceId,
          ),
          ...base,
          domain: "features",
          field: `features.${feature.featureSlug}`,
          value: feature,
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: clip(
                `${feature.featureSlug}=${feature.availability}`,
              ),
              locator: `FEATURE ${feature.featureSlug}`,
            },
          ],
        });
      }
    }

    if (request.domains.includes("ai-capabilities")) {
      for (const capability of parseAi(text)) {
        facts.push({
          id: factId(
            request.productSlug,
            `ai.${capability.capability}`,
            snapshot.sourceId,
          ),
          ...base,
          domain: "ai-capabilities",
          field: `ai.${capability.capability}`,
          value: capability,
          evidence: [
            {
              sourceId: snapshot.sourceId,
              excerpt: clip(`${capability.capability}=${capability.availability}`),
              locator: `AI ${capability.capability}`,
            },
          ],
        });
      }
    }

    return facts;
  }
}

function matchField(text: string, key: string): string | undefined {
  const match = new RegExp(`^${key}:\\s*(.+)$`, "mi").exec(text);
  return match?.[1]?.trim();
}

function parsePlans(text: string) {
  const plans: Array<{
    slug: string;
    name: string;
    currency: string;
    amountPerSeat?: number;
    amount?: number;
    interval: "month" | "year";
    billingInterval: "month" | "annual";
    unit?: string;
    minimumSeats?: number;
    isFree?: boolean;
    contactSales?: boolean;
  }> = [];

  const regex =
    /^PLAN\s+([a-z0-9-]+):\s*name=([^;]+);\s*(.*)$/gim;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const slug = match[1];
    const name = match[2].trim();
    const rest = match[3];
    const props = Object.fromEntries(
      rest.split(";").map((part) => {
        const [k, v] = part.split("=").map((s) => s.trim());
        return [k, v];
      }),
    );

    plans.push({
      slug,
      name,
      currency: props.currency || "USD",
      amountPerSeat: props.amountPerSeat
        ? Number(props.amountPerSeat)
        : undefined,
      amount: props.amount ? Number(props.amount) : undefined,
      interval: props.interval === "year" ? "year" : "month",
      billingInterval:
        props.billingInterval === "annual" ? "annual" : "month",
      unit: props.unit,
      minimumSeats: props.minimumSeats
        ? Number(props.minimumSeats)
        : undefined,
      isFree: props.isFree === "true",
      contactSales: props.contactSales === "true",
    });
  }

  return plans;
}

function parseFeatures(text: string) {
  const features: Array<{
    featureSlug: string;
    availability: string;
  }> = [];
  const regex = /^FEATURE\s+([a-z0-9-]+):\s*([a-z-]+)\s*$/gim;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    features.push({
      featureSlug: match[1],
      availability: match[2],
    });
  }
  return features;
}

function parseAi(text: string) {
  const items: Array<{ capability: string; availability: string }> = [];
  const regex = /^AI\s+([a-z0-9-]+):\s*([a-z-]+)\s*$/gim;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    items.push({ capability: match[1], availability: match[2] });
  }
  return items;
}

function factId(product: string, field: string, sourceId: string): string {
  return `fact-${product}-${field.replace(/[^a-z0-9.-]/gi, "-")}-${sourceId}`;
}

function clip(value: string, max = 180): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
