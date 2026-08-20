import type { EditorialBrief, Pricing } from "@/domain";
import { EditorialBriefSchema, PricingSchema } from "@/domain";
import { loadAssessment } from "@/data/editorial/store";
import { loadEnrichment, loadFacts } from "@/data/research/store";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { getSoftwareRelationshipLinks } from "@/services/relationships/software-links";

const DEFAULT_PROHIBITED = [
  "Invented statistics or market-share percentages",
  "Unsourced dollar amounts or seat counts",
  "Affiliate-driven ranking claims",
];

const HANDS_ON_PROHIBITED = [
  "we tested",
  "we tried",
  "hands-on testing",
  "in our testing",
  "we used it for",
  "our team used",
  "after using it",
];

function claimFromFact(value: unknown, field: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return `${field}: ${String(value)}`;
  }
  if (value && typeof value === "object") {
    try {
      return `${field}: ${JSON.stringify(value)}`;
    } catch {
      return field;
    }
  }
  return field;
}

function approvedNumbersFromPricing(
  pricing: Pricing | undefined,
  factIds: string[],
): EditorialBrief["approvedNumbers"] {
  if (!pricing) return [];
  const numbers: EditorialBrief["approvedNumbers"] = [];
  const pricingFactId = factIds[0];

  if (pricing.startingPriceMonthly != null) {
    numbers.push({
      kind: "starting-price-monthly",
      value: pricing.startingPriceMonthly,
      factId: pricingFactId,
    });
  }
  if (pricing.hasFreePlan != null) {
    numbers.push({
      kind: "has-free-plan",
      value: pricing.hasFreePlan ? "true" : "false",
      factId: pricingFactId,
    });
  }
  if (pricing.hasFreeTrial != null) {
    numbers.push({
      kind: "has-free-trial",
      value: pricing.hasFreeTrial ? "true" : "false",
      factId: pricingFactId,
    });
  }

  for (const plan of pricing.plans) {
    for (const rule of plan.rules) {
      if (rule.kind === "per-seat") {
        numbers.push({
          kind: `plan.${plan.slug}.per-seat`,
          value: rule.amountPerSeat,
          factId: pricingFactId,
        });
      } else if (rule.kind === "flat") {
        numbers.push({
          kind: `plan.${plan.slug}.flat`,
          value: rule.amount,
          factId: pricingFactId,
        });
      }
    }
  }

  return numbers;
}

/**
 * Build a software-review editorial brief from approved research facts,
 * optional assessment, and relationship-driven internal links.
 */
export function buildSoftwareReviewBrief(productSlug: string): EditorialBrief {
  const software = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  const facts = loadFacts(productSlug).filter(
    (f) => f.status === "approved" || f.status === "verified",
  );
  const assessment = loadAssessment(productSlug);
  const enrichment = loadEnrichment(productSlug);

  const briefFacts = facts.map((f) => ({
    id: f.id,
    domain: f.domain,
    claim: claimFromFact(f.value, f.field),
    value: f.value,
  }));

  const links = software
    ? getSoftwareRelationshipLinks(software).map((link) => ({
        href: link.href,
        label: link.label,
        reason: link.relationship,
      }))
    : [];

  const handsOn = assessment?.handsOnTesting === true;
  const prohibitedClaims = [
    ...DEFAULT_PROHIBITED,
    ...(handsOn ? [] : HANDS_ON_PROHIBITED),
  ];

  const pricingParsed = enrichment?.pricing
    ? PricingSchema.safeParse(enrichment.pricing)
    : null;
  const structuredPricing =
    pricingParsed?.success === true
      ? pricingParsed.data
      : software?.pricing;

  const pricingFactIds = facts
    .filter((f) => f.domain === "pricing" || f.domain === "plans")
    .map((f) => f.id);

  const approvedNumbers = approvedNumbersFromPricing(
    structuredPricing,
    pricingFactIds,
  );

  const name = software?.name ?? productSlug;

  return EditorialBriefSchema.parse({
    id: `brief-software-review-${productSlug}`,
    pageType: "software-review",
    targetIntent: `Evaluate ${name} for CRM buyers with evidence-backed editorial judgment.`,
    primaryKeyword: `${name} review`,
    productSlug,
    productSlugs: [productSlug],
    audience: "Sales and RevOps buyers evaluating CRM software",
    requiredSections: [
      "summary",
      "verdict",
      "pros-cons",
      "key-features",
      "pricing",
      "who-should-choose",
      "alternatives",
      "faq",
    ],
    facts: briefFacts,
    editorialAssessments: assessment?.criterionAssessments ?? [],
    allowedComparisons: software?.comparableSlugs ?? [],
    allowedAlternatives: software?.alternativeSlugs ?? [],
    internalLinks: links,
    prohibitedClaims,
    approvedNumbers,
    handsOnTestingAllowed: handsOn,
    methodologyVersion: assessment?.methodologyVersion,
    toneNotes: [
      'Use "Based on our evaluation of..." — never invent hands-on claims unless allowed.',
      "Do not invent numbers; only use approvedNumbers and brief facts.",
      "Affiliate relationships must not influence wording or ranking claims.",
    ],
  });
}
