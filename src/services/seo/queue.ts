import {
  ContentQueueItemSchema,
  SeoOpportunitySchema,
  type ContentQueueItem,
  type SeoOpportunity,
} from "@/domain";
import {
  loadOpportunity,
  saveOpportunity,
  saveQueueItem,
} from "@/data/seo/store";

function queueIdForOpportunity(opportunityId: string): string {
  return `queue:${opportunityId}`;
}

/**
 * Accept an opportunity into the editorial content queue.
 * Does NOT create or publish public pages.
 */
export function acceptOpportunity(
  id: string,
  opts?: { nowIso?: string },
): { opportunity: SeoOpportunity; queueItem: ContentQueueItem } {
  const existing = loadOpportunity(id);
  if (!existing) {
    throw new Error(`Opportunity not found: ${id}`);
  }
  const nowIso = opts?.nowIso ?? new Date().toISOString();
  const opportunity = SeoOpportunitySchema.parse({
    ...existing,
    status: "queued",
    lastDetectedAt: nowIso,
  });
  saveOpportunity(opportunity);

  const brief = buildEditorialBriefCandidate(opportunity);
  const queueItem = ContentQueueItemSchema.parse({
    id: queueIdForOpportunity(id),
    opportunityId: id,
    status: "queued",
    suggestedPageType: brief.suggestedPageType,
    productSlugs: opportunity.productSlugs,
    categorySlugs: opportunity.categorySlugs,
    primaryKeyword: opportunity.query,
    briefHint: brief.summary,
    queuedAt: nowIso,
    notes: [
      "Queued from SEO opportunity — does not auto-publish",
      ...brief.requiredSections.map((s) => `section:${s}`),
    ],
  });
  saveQueueItem(queueItem);
  return { opportunity, queueItem };
}

export function dismissOpportunity(
  id: string,
  reason: string,
  opts?: { nowIso?: string },
): SeoOpportunity {
  const existing = loadOpportunity(id);
  if (!existing) {
    throw new Error(`Opportunity not found: ${id}`);
  }
  const opportunity = SeoOpportunitySchema.parse({
    ...existing,
    status: "dismissed",
    dismissedReason: reason,
    lastDetectedAt: opts?.nowIso ?? new Date().toISOString(),
  });
  saveOpportunity(opportunity);
  return opportunity;
}

export type EditorialBriefCandidate = {
  opportunityId: string;
  suggestedPageType:
    | "software-review"
    | "comparison"
    | "alternatives"
    | "best"
    | "pricing"
    | "guide"
    | "other";
  targetIntent: string;
  primaryKeyword?: string;
  productSlugs: string[];
  categorySlugs: string[];
  requiredSections: string[];
  summary: string;
  prohibitedClaims: string[];
};

/**
 * Structured brief-shaped object for editorial handoff.
 * Conceptual integration only — does not write published content.
 */
export function buildEditorialBriefCandidate(
  opportunity: SeoOpportunity,
): EditorialBriefCandidate {
  const type = opportunity.type;
  let suggestedPageType: EditorialBriefCandidate["suggestedPageType"] = "other";
  let requiredSections: string[] = ["introduction", "key-considerations"];

  if (type === "comparison-opportunity" || type === "query-page-mismatch") {
    if (opportunity.productSlugs.length >= 2) {
      suggestedPageType = "comparison";
      requiredSections = [
        "summary",
        "criterion-table",
        "who-should-choose",
        "pricing-caveats",
      ];
    } else if (opportunity.query?.toLowerCase().includes("pricing")) {
      suggestedPageType = "pricing";
      requiredSections = ["plan-overview", "total-cost-notes", "caveats"];
    }
  } else if (type === "pricing-opportunity") {
    suggestedPageType = "pricing";
    requiredSections = ["plan-overview", "total-cost-notes", "caveats"];
  } else if (type === "alternatives-opportunity") {
    suggestedPageType = "alternatives";
    requiredSections = ["when-to-switch", "alternative-cards", "tradeoffs"];
  } else if (type === "missing-content" || type === "use-case-opportunity") {
    suggestedPageType = opportunity.categorySlugs.length ? "best" : "guide";
    requiredSections = ["methodology", "candidates", "how-we-chose"];
  } else if (
    type === "high-impression-low-ctr" ||
    type === "striking-distance" ||
    type === "content-decay"
  ) {
    suggestedPageType = "software-review";
    requiredSections = ["refresh-summary", "strengthen-weak-sections"];
  }

  return {
    opportunityId: opportunity.id,
    suggestedPageType,
    targetIntent: type,
    primaryKeyword: opportunity.query,
    productSlugs: opportunity.productSlugs,
    categorySlugs: opportunity.categorySlugs,
    requiredSections,
    summary: opportunity.reasons[0] ?? `SEO opportunity ${opportunity.id}`,
    prohibitedClaims: [
      "Do not invent live Search Console metrics",
      "Do not auto-publish from this brief",
      "Affiliate signals must not determine product ranking claims",
    ],
  };
}
