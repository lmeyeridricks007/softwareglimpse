#!/usr/bin/env node
/**
 * Shared Ecommerce onboarding runtime.
 * Adapted from pm-onboard-runtime.mjs for ecommerce-editorial v1.0.0.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");

export let VERIFIED_AT = "2026-08-17T12:00:00.000Z";
export let PUBLISHED_AT = "2026-08-17T00:00:00.000Z";
export let RELATED_GUIDE_PATHS = [
  "/categories/ecommerce/",
  "/best/ecommerce-software/",
];
export let BATCH_LABEL = "Ecommerce Wave-1";
export let JOB_TAG = "ecommerce-wave1";

export function configureEcomRuntime(opts = {}) {
  if (opts.verifiedAt) VERIFIED_AT = opts.verifiedAt;
  if (opts.publishedAt) PUBLISHED_AT = opts.publishedAt;
  if (opts.relatedGuidePaths) RELATED_GUIDE_PATHS = opts.relatedGuidePaths;
  if (opts.batchLabel) BATCH_LABEL = opts.batchLabel;
  if (opts.jobTag) JOB_TAG = opts.jobTag;
}

export const DOMAIN_CHECK_KEYS = [
  "identity",
  "pricing",
  "plans",
  "features",
  "product-positioning",
  "ai-capabilities",
  "integrations",
  "free-trial",
  "free-plan",
  "limits",
  "security-compliance",
];

export const ECOM_CRITERIA = [
  "ease-of-use",
  "storefront-commerce-fit",
  "catalog-orders-depth",
  "checkout-conversion",
  "integrations",
  "omnichannel-pos",
  "scalability",
  "value-for-money",
  "ai-capabilities",
];

export const ECOM_CRITERION_WEIGHTS = {
  "ease-of-use": 12,
  "storefront-commerce-fit": 15,
  "catalog-orders-depth": 14,
  "checkout-conversion": 12,
  integrations: 12,
  "omnichannel-pos": 10,
  scalability: 9,
  "value-for-money": 12,
  "ai-capabilities": 6,
};

export const ECOM_FEATURES = [
  "online-storefront",
  "product-catalog",
  "checkout-payments",
  "order-management",
  "inventory-management",
  "shipping-fulfillment",
  "pos-omnichannel",
  "marketplace-channels",
  "b2b-wholesale",
  "marketing-automation",
  "analytics-reporting",
  "ai-assistance",
  "dropshipping-sourcing",
  "app-extensions",
];

export function contactSalesPlan(slug, name, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: true,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

export function freePlan(slug = "free", name = "Free", extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: true,
    contactSales: false,
    hasFreeTrial: false,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "flat",
        amount: 0,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Per-seat plan quoted as monthly-equivalent on annual billing. */
export function planPerSeatAnnual(slug, name, monthlyPerSeat, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: monthlyPerSeat,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
        ...(extra.minimumSeats ? { minimumSeats: extra.minimumSeats } : {}),
        ...(extra.maximumSeats ? { maximumSeats: extra.maximumSeats } : {}),
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Per-seat plan on monthly (or concurrent-seat) billing — amount is monthly. */
export function planPerSeatMonthly(slug, name, monthlyPerSeat, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: monthlyPerSeat,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
        ...(extra.minimumSeats ? { minimumSeats: extra.minimumSeats } : {}),
        ...(extra.maximumSeats ? { maximumSeats: extra.maximumSeats } : {}),
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Flat platform / account plan quoted as monthly-equivalent on annual billing. */
export function planFlatAnnual(slug, name, monthly, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "flat",
        amount: monthly,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}


export function comparisonSlugPair(a, b) {
  return [a, b].sort().join("-vs-");
}

export function avgScore(scores) {
  return weightedScore(scores);
}

export function weightedScore(scores) {
  const total = ECOM_CRITERIA.reduce(
    (sum, criterion) => sum + scores[criterion] * ECOM_CRITERION_WEIGHTS[criterion],
    0,
  );
  return Math.round((total / 100) * 10) / 10;
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

export function featureAvailability(p, feature) {
  const raw = p.featureOverrides?.[feature] ?? "unknown";
  if (raw === "unsupported") return "not-supported";
  return raw;
}

export function planSlugs(p) {
  return p.enrichmentPlans.map((pl) => pl.slug);
}

export function buildSources(p) {
  const sources = [
    {
      id: `${p.slug}-product-official`,
      productSlug: p.slug,
      url: p.website,
      domain: p.domain,
      title: `${p.name} — Official Site`,
      publisher: p.company,
      sourceType: "official-product-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: [
        "identity",
        "features",
        "product-positioning",
        "ai-capabilities",
      ],
      confidence: "high",
      status: "active",
      notes: `First-party product positioning for ${p.name} (${BATCH_LABEL} onboarding 2026-08-17).`,
    },
    {
      id: `${p.slug}-pricing-official`,
      productSlug: p.slug,
      url: p.pricingUrl,
      domain: new URL(p.pricingUrl).hostname.replace(/^www\./, ""),
      title: `${p.name} Pricing`,
      publisher: p.company,
      sourceType: "official-pricing-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      confidence: "high",
      status: "active",
      notes: p.pricingNotes,
    },
  ];
  for (const extra of p.sourcesExtra ?? []) {
    sources.push({
      id: extra.id,
      productSlug: p.slug,
      url: extra.url,
      domain: new URL(extra.url).hostname.replace(/^www\./, ""),
      title: extra.title,
      publisher: p.company,
      sourceType: "official-product-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: extra.domains,
      confidence: "high",
      status: "active",
      notes: `First-party support source for ${p.name}.`,
    });
  }
  return sources;
}

export function buildPricingFixture(p) {
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)
# Label: fixture extract for FixtureFactExtractor — not a live HTML scrape dump.

CURRENCY: USD
PRICING_MODEL: ${p.pricingModel}
FREE_PLAN: ${p.hasFreePlan}
FREE_TRIAL: ${p.hasFreeTrial}
MEMBERSHIP_ROLE: ${p.membershipRole}
JOB_CLUSTER: ${p.jobCluster}

${p.fixturePlans.join("\n")}
`;
}

export function buildProductFixture(p) {
  const featureLines = ECOM_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? ["AI assistant: unknown"]).join("\n");
  const adjacent =
    p.membershipRole === "adjacent"
      ? `\nADJACENT: true\nADJACENT_NOTE: ${p.adjacentNote}\n`
      : "";
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}
MEMBERSHIP_ROLE: ${p.membershipRole}
JOB_CLUSTER: ${p.jobCluster}${adjacent}
${featureLines}

${ai}
`;
}

export function buildMedia(p) {
  return (p.officialVideos ?? []).map((v) => ({
    id: `media-${p.slug}-${v.videoId.toLowerCase()}`,
    productSlug: p.slug,
    productIds: [p.slug],
    type: "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    videoId: v.videoId,
    providerId: v.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
    title: v.title,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    channelName: v.channel,
    sourceOrganization: p.company,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: VERIFIED_AT,
    lastCheckedAt: VERIFIED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: v.features ?? [],
    requirementIds: [],
    useCaseIds: p.useCaseSlugs?.slice(0, 2) ?? [],
    industryIds: [],
    guideIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    workflowStageIds: [],
    reportedOutcomes: [],
    placements: ["features", "overview"],
    purpose: `Official ${p.name} product video for ${BATCH_LABEL} onboarding`,
    whatThisShows: Array.isArray(v.shows) ? v.shows : [v.shows].filter(Boolean),
    limitations: [],
    whatToNotice: [],
    status: "active",
  }));
}

export function parseAiLine(line) {
  const cleaned = line.replace(/^AI\s+/i, "").trim();
  const idx = cleaned.indexOf(":");
  const capability = (idx === -1 ? cleaned : cleaned.slice(0, idx)).trim();
  const availability = (idx === -1 ? "unknown" : cleaned.slice(idx + 1)).trim();
  return { capability, availability: availability || "unknown" };
}

export function primaryJobFeature(jobCluster) {
  const map = {
    "saas-platform": "online-storefront",
    "open-source-platform": "product-catalog",
    "omnichannel-pos": "pos-omnichannel",
    "dropshipping-sourcing": "dropshipping-sourcing",
    "website-builder": "online-storefront",
  };
  return map[jobCluster] ?? "online-storefront";
}

export function supportingFeatureForCriterion(criterionSlug, jobCluster) {
  const primary = primaryJobFeature(jobCluster);
  const map = {
    "ease-of-use": primary,
    "storefront-commerce-fit": primary,
    "catalog-orders-depth": "order-management",
    "checkout-conversion": "checkout-payments",
    integrations: "app-extensions",
    "omnichannel-pos": "pos-omnichannel",
    scalability: primary,
    "value-for-money": primary,
    "ai-capabilities": "ai-assistance",
  };
  return map[criterionSlug] ?? primary;
}

export function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = ECOM_FEATURES.map((featureSlug) => ({
    featureSlug,
    availability: featureAvailability(p, featureSlug),
    planSlugs: slugs,
    sourceIds: [`${p.slug}-product-official`],
  }));

  const pricing = {
    currency: "USD",
    model: p.pricingModel,
    hasFreePlan: p.hasFreePlan,
    hasFreeTrial: p.hasFreeTrial,
    plans: p.enrichmentPlans,
    notes: p.pricingNotes,
    verifiedAt: VERIFIED_AT,
    sourceIds: [`${p.slug}-pricing-official`],
  };
  if (p.startingPriceMonthly !== undefined) {
    pricing.startingPriceMonthly = p.startingPriceMonthly;
  }
  if (p.trialDays !== undefined) {
    pricing.trialDays = p.trialDays;
  }

  const domainCheckedAt = Object.fromEntries(
    DOMAIN_CHECK_KEYS.map((k) => [k, VERIFIED_AT]),
  );

  const limitationKinds = p.limitationKinds ?? [];
  const limitations = p.limitations.map((description, i) => ({
    kind: limitationKinds[i] ?? "other",
    description,
    sourceIds: [`${p.slug}-product-official`],
    isEditorial: false,
  }));

  const primaryTeamType = p.teamTypeSlugs?.[0] ?? "operations";
  const editorialFit = (p.businessSizeSlugs ?? []).map((businessSizeSlug) => {
    const strength =
      p.membershipRole === "adjacent"
        ? "weak"
        : businessSizeSlug === "solo"
          ? "moderate"
          : businessSizeSlug === "enterprise"
            ? p.jobCluster === "enterprise-hcm"
              ? "strong"
              : "moderate"
            : "strong";
    return {
      businessSizeSlug,
      teamTypeSlug: primaryTeamType,
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} ${primaryTeamType} teams in the ${p.jobCluster} job cluster, from first-party positioning and ${BATCH_LABEL} research${
        p.membershipRole === "adjacent"
          ? " (adjacent tool — not an HR peer for undifferentiated ranking)"
          : ""
      }.`,
      isEditorial: true,
    };
  });

  const notesParts = [
    `${BATCH_LABEL} onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
    `membershipRole=${p.membershipRole}. jobCluster=${p.jobCluster}.`,
  ];
  if (p.adjacentNote) notesParts.push(p.adjacentNote);

  return {
    productSlug: p.slug,
    shortDescription: p.shortDescription,
    featureSupport,
    aiCapabilities: (p.aiLines ?? []).map((line) => {
      const { capability, availability } = parseAiLine(line);
      return {
        capability,
        availability,
        sourceIds: [`${p.slug}-product-official`],
      };
    }),
    integrationSupport: (p.integrations ?? []).map((i) => ({
      integrationSlug: i.integrationSlug,
      kind: i.kind,
      sourceIds: [`${p.slug}-product-official`],
      ...(i.notes ? { notes: i.notes } : {}),
    })),
    vendorPositioning: [
      {
        claim: p.vendorPositioning,
        audienceHints: p.bestFor.slice(0, 3),
        sourceIds: [`${p.slug}-product-official`],
      },
    ],
    editorialFit,
    limitations,
    pricing,
    screenshots: [],
    media: buildMedia(p),
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: notesParts.join(" "),
    domainCheckedAt,
    updatedAt: VERIFIED_AT,
  };
}

export function factBase(p, id, domain, field, value, sourceId, excerpt, locator, confidence) {
  const evidence = {
    sourceId,
    excerpt: excerpt.slice(0, 280),
  };
  if (locator) evidence.locator = locator;
  return {
    id,
    productSlug: p.slug,
    domain,
    field,
    value,
    sourceIds: [sourceId],
    evidence: [evidence],
    extractedAt: VERIFIED_AT,
    normalizedAt: VERIFIED_AT,
    verifiedAt: VERIFIED_AT,
    approvedAt: VERIFIED_AT,
    confidence: confidence ?? "medium",
    status: "approved",
    isFixture: true,
    notes: `${BATCH_LABEL} first-party research extract`,
  };
}

export function buildFacts(p) {
  const productSrc = `${p.slug}-product-official`;
  const pricingSrc = `${p.slug}-pricing-official`;
  const facts = [
    factBase(
      p,
      `fact-${p.slug}-identity.shortDescription`,
      "identity",
      "identity.shortDescription",
      p.shortDescription,
      productSrc,
      p.shortDescription.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-positioning.vendorClaim`,
      "product-positioning",
      "positioning.vendorClaim",
      p.vendorPositioning,
      productSrc,
      p.vendorPositioning.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-positioning.jobCluster`,
      "product-positioning",
      "positioning.jobCluster",
      p.jobCluster,
      productSrc,
      `HR job cluster: ${p.jobCluster}`,
      "JOB_CLUSTER",
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.model`,
      "pricing",
      "pricing.model",
      p.pricingModel,
      pricingSrc,
      p.pricingNotes.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreePlan`,
      "pricing",
      "pricing.hasFreePlan",
      p.hasFreePlan,
      pricingSrc,
      `hasFreePlan=${p.hasFreePlan}`,
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreeTrial`,
      "pricing",
      "pricing.hasFreeTrial",
      p.hasFreeTrial,
      pricingSrc,
      `hasFreeTrial=${p.hasFreeTrial}${p.trialDays ? ` (${p.trialDays} days)` : ""}`,
    ),
  ];
  if (p.membershipRole === "adjacent") {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-positioning.membershipRole`,
        "product-positioning",
        "positioning.membershipRole",
        "adjacent",
        productSrc,
        p.adjacentNote.slice(0, 200),
        "ADJACENT",
      ),
    );
  }
  if (p.startingPriceMonthly !== undefined) {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-pricing.startingPriceMonthly`,
        "pricing",
        "pricing.startingPriceMonthly",
        p.startingPriceMonthly,
        pricingSrc,
        `Starting ~$${p.startingPriceMonthly}/month where published`,
        undefined,
        p.startingPriceConfidence,
      ),
    );
  }
  for (const plan of p.enrichmentPlans) {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-pricing.plans.${plan.slug}`,
        "plans",
        `pricing.plans.${plan.slug}`,
        plan,
        pricingSrc,
        `${plan.name}${plan.contactSales ? " (contact sales)" : ""}${plan.isFree ? " (free)" : ""}`,
        `PLAN ${plan.slug}`,
      ),
    );
  }
  for (const featureSlug of ECOM_FEATURES) {
    const availability = featureAvailability(p, featureSlug);
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-features.${featureSlug}`,
        "features",
        `features.${featureSlug}`,
        { featureSlug, availability },
        productSrc,
        `${featureSlug}=${availability}`,
        `FEATURE ${featureSlug}`,
      ),
    );
  }
  return facts;
}

export function buildCriterionAssessments(p) {
  return ECOM_CRITERIA.map((criterionSlug) => {
    const score = p.scores[criterionSlug];
    const featureSlug = supportingFeatureForCriterion(criterionSlug, p.jobCluster);
    const supportingFactIds = [
      `fact-${p.slug}-features.${featureSlug}`,
      `fact-${p.slug}-pricing.model`,
    ];
    if (criterionSlug === "value-for-money") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.hasFreePlan`;
      if (p.startingPriceMonthly !== undefined) {
        supportingFactIds.push(`fact-${p.slug}-pricing.startingPriceMonthly`);
      }
    }
    if (criterionSlug === "scalability") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.plans.${planSlugs(p)[0]}`;
      supportingFactIds.push(
        `fact-${p.slug}-pricing.plans.${planSlugs(p)[planSlugs(p).length - 1]}`,
      );
    }
    if (criterionSlug === "integrations") {
      supportingFactIds.push(`fact-${p.slug}-positioning.vendorClaim`);
    }
    if (criterionSlug === "omnichannel-pos") {
      supportingFactIds[0] = `fact-${p.slug}-features.pos-omnichannel`;
    }
    return {
      criterionSlug,
      score,
      rationale:
        p.scoreRationales?.[criterionSlug] ??
        `${criterionSlug} scored ${score}/10 from first-party research for ${p.name} — not hands-on lab tested.`,
      supportingFactIds,
      confidence: "medium",
      status: "approved",
      reviewedAt: VERIFIED_AT,
      reviewer: "editorial",
    };
  });
}

const OVERALL_RATIONALE =
  "Weighted average of the nine ecommerce editorial criteria using category weights (storefront/commerce fit 15, catalog/orders 14, ease 12, checkout 12, integrations 12, value 12, omnichannel/POS 10, scalability 9, AI 6), rounded to 1 decimal. Products are scored inside their job cluster — SaaS platforms, open-source carts, omnichannel POS bundles, and dropshipping sourcing apps are not forced into one undifferentiated ranking. Not a hands-on lab score; affiliate economics are excluded.";

export function buildAssessment(p) {
  const overallScore = weightedScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const adjacentBit =
    p.membershipRole === "adjacent"
      ? " Marked adjacent — not a storefront platform peer for undifferentiated ecommerce best-page ranking."
      : "";
  return {
    id: `assessment-${p.slug}-ecommerce-v1`,
    productSlug: p.slug,
    methodologySlug: "ecommerce-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose}${adjacentBit} Scores use the Ecommerce editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Subscription floors vs payment-processing spreads and GMV/overage fees",
      "App/extension TCO vs native feature depth",
      "Open-source/hosting flexibility vs SaaS operational simplicity",
      "Dropshipping product caps vs catalog automation depth",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes: `${BATCH_LABEL} batch. Approved on ecommerce-editorial v1.0.0. membershipRole=${p.membershipRole}. jobCluster=${p.jobCluster}. handsOnTesting=false. Affiliate economics excluded.${
      p.adjacentNote ? ` ${p.adjacentNote}` : ""
    }`,
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale: OVERALL_RATIONALE,
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          `${BATCH_LABEL} onboarding; approved HR criteria with category weights; handsOnTesting=false`,
        nextOverall: overallScore,
      },
    ],
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

const CLUSTER_LABELS = {
  "saas-platform": "a hosted SaaS ecommerce platform",
  "open-source-platform": "an open-source commerce platform (plugin/core + extensions)",
  "omnichannel-pos": "an omnichannel retail platform bundling online store and POS",
  "dropshipping-sourcing": "a dropshipping product sourcing and import automation app",
  "website-builder": "a website-first builder with integrated ecommerce",
};

export function buildReview(p) {
  const overallScore = weightedScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const researchSourceIds = [
    `${p.slug}-product-official`,
    `${p.slug}-pricing-official`,
    ...(p.sourcesExtra ?? []).map((s) => s.id),
  ];
  const comparisonSlugs = (p.alternativeSlugs ?? []).map((alt) =>
    comparisonSlugPair(p.slug, alt),
  );
  const roleLabel = CLUSTER_LABELS[p.jobCluster] ?? "HR, workforce & training software";

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-ecommerce-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as ${roleLabel} — ${p.shortDescription} This review uses SoftwareGlimpse’s Ecommerce methodology (ease of use, storefront/commerce fit, catalog & order depth, checkout conversion, integrations, omnichannel/POS, scalability, value, AI), scoring products inside their job cluster rather than against unrelated peers. It is based on first-party research, not hands-on lab testing.`,
    summary: p.whoShouldChoose,
    verdict: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives} Scores reflect first-party documentation as of 2026-08-17 — not hands-on product testing. Confirm current packaging, minimums and usage rates on the vendor site before purchase.`,
    overallScore,
    criterionAssessments,
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    pros: p.pros,
    cons: p.cons,
    keyFeatures: p.keyFeatures,
    limitations: p.limitations,
    pricingSummary: p.pricingSummary,
    whoShouldChoose: p.whoShouldChoose,
    whoShouldConsiderAlternatives: p.whoShouldConsiderAlternatives,
    alternativeSlugs: p.alternativeSlugs,
    comparisonSlugs,
    relatedGuidePaths: RELATED_GUIDE_PATHS,
    methodologySlug: "ecommerce-editorial",
    methodologyVersion: "1.0.0",
    researchSourceIds,
    factRefs: [
      {
        section: "pricing",
        factIds: [
          `fact-${p.slug}-pricing.model`,
          `fact-${p.slug}-pricing.hasFreePlan`,
          `fact-${p.slug}-pricing.hasFreeTrial`,
          ...(p.startingPriceMonthly !== undefined
            ? [`fact-${p.slug}-pricing.startingPriceMonthly`]
            : []),
          ...planSlugs(p).map((s) => `fact-${p.slug}-pricing.plans.${s}`),
        ],
      },
      {
        section: "overview",
        factIds: [
          `fact-${p.slug}-identity.shortDescription`,
          `fact-${p.slug}-positioning.vendorClaim`,
          `fact-${p.slug}-positioning.jobCluster`,
        ],
      },
      {
        section: "features",
        factIds: ECOM_FEATURES.map((f) => `fact-${p.slug}-features.${f}`),
      },
    ],
    faq: [
      {
        question: `Is ${p.name} ecommerce software?`,
        answer: `Yes. ${p.name} is evaluated as ${CLUSTER_LABELS[p.jobCluster] ?? "ecommerce software"}.`,
      },
      {
        question: `How is ${p.name} priced?`,
        answer: p.pricingSummary,
      },
      {
        question: `Does ${p.name} have a free plan or free trial?`,
        answer: `${p.hasFreePlan ? "Yes — a free plan is published." : "No free plan is published."} ${
          p.hasFreeTrial
            ? `A free trial is documented${p.trialDays ? ` (about ${p.trialDays} days)` : ""}.`
            : "No free trial is documented on the pricing page."
        } Confirm current terms with the vendor.`,
      },
      {
        question: `Did SoftwareGlimpse personally test ${p.name}?`,
        answer:
          "No. This review is based on first-party product and pricing research evidence, not hands-on product usage. Affiliate relationships never influence scores.",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: p.shortDescription,
      },
      {
        id: "best-for",
        heading: "Who it’s for",
        body: p.bestFor.map((b) => `• ${b}`).join("\n"),
      },
      {
        id: "features",
        heading: "Feature coverage",
        body: ECOM_FEATURES.map(
          (f) => `• ${f}: ${featureAvailability(p, f)}`,
        ).join("\n"),
      },
      {
        id: "pricing",
        heading: "Pricing",
        body: p.pricingSummary,
      },
      {
        id: "limitations",
        heading: "Limitations",
        body: p.limitations.map((l) => `• ${l}`).join("\n"),
      },
    ],
    confidence: "medium",
    handsOnTesting: false,
    contentVersion: 1,
    refreshNeeded: false,
    lastUpdatedAt: VERIFIED_AT,
    metadata: {
      status: "published",
      publishedAt: PUBLISHED_AT,
      updatedAt: VERIFIED_AT,
      reviewedAt: VERIFIED_AT,
      author: "author-lee-meyeridricks",
      researchStatus: "complete",
    },
    seo: {
      title: `${p.name} Review (2026) — Ecommerce`,
      description: `${p.name} HR, workforce & training review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
      canonicalPath: `/software/${p.slug}/`,
      indexable: true,
    },
  };
}

export function softSnippet(p) {
  const aliases = p.aliases?.length
    ? `\n    aliases: ${JSON.stringify(p.aliases)},`
    : "";
  const secondary = p.secondaryCategorySlugs?.length
    ? `\n    secondaryCategorySlugs: ${JSON.stringify(p.secondaryCategorySlugs)},`
    : "";
  return `  soft({
    id: "soft-${p.slug}",
    slug: "${p.slug}",
    name: "${p.name}",
    company: "${p.company}",
    website: "${p.website}",
    logo: { src: "/brands/${p.slug}.png", alt: "${p.name} logo" },
    shortDescription:
      ${JSON.stringify(p.softShortDescription)},${aliases}
    primaryCategorySlug: "ecommerce",${secondary}
    subcategorySlugs: ${JSON.stringify(p.subcategorySlugs ?? [])},
    useCaseSlugs: ${JSON.stringify(p.useCaseSlugs)},
    teamTypeSlugs: ${JSON.stringify(p.teamTypeSlugs)},
    businessSizeSlugs: ${JSON.stringify(p.businessSizeSlugs)},
    competitorSlugs: ${JSON.stringify(p.competitorSlugs)},
    alternativeSlugs: ${JSON.stringify(p.alternativeSlugs)},
    comparableSlugs: ${JSON.stringify(p.comparableSlugs)},
    metadata: {
      status: "published",
      publishedAt: "${PUBLISHED_AT}",
      researchStatus: "complete",
    },
  }),`;
}

export function writeProduct(p) {
  const researchDir = path.join(ROOT, "src/data/research", p.slug);
  const fixturesDir = path.join(researchDir, "fixtures");
  const publicDir = path.join(ROOT, "public/software", p.slug, "diagrams");
  fs.mkdirSync(fixturesDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  writeJson(path.join(researchDir, "sources.json"), buildSources(p));
  writeText(
    path.join(fixturesDir, `${p.slug}-pricing-fixture.txt`),
    buildPricingFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-fixture.txt`),
    buildProductFixture(p),
  );
  writeJson(path.join(researchDir, "enrichment.json"), buildEnrichment(p));
  writeJson(path.join(researchDir, "facts.json"), buildFacts(p));
  writeJson(path.join(researchDir, "conflicts.json"), []);
  writeJson(path.join(researchDir, "jobs.json"), [
    {
      id: `job-${p.slug}-${JOB_TAG}`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: `${BATCH_LABEL}; membershipRole=${p.membershipRole}; jobCluster=${p.jobCluster}`,
    },
  ]);
  writeJson(path.join(researchDir, "snapshots.json"), []);

  const assessment = buildAssessment(p);
  writeJson(
    path.join(ROOT, "src/data/editorial/assessments", `${p.slug}.json`),
    assessment,
  );
  writeJson(
    path.join(ROOT, "src/data/editorial/reviews", `${p.slug}.json`),
    buildReview(p),
  );

  console.log(
    `✓ ${p.slug}  overall=${assessment.overallScore}  role=${p.membershipRole}  cluster=${p.jobCluster}`,
  );
}


export function writeSeedSnippet(products, filename, headerComment) {
  const out = path.join(ROOT, "scripts", filename);
  const body = `${headerComment}

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
}

export function writeComparisonSpec(products, pairs, filename) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const spec = pairs
    .filter(([a, b]) => bySlug.has(a) && bySlug.has(b))
    .map(([a, b]) => {
      const pa = bySlug.get(a);
      const pb = bySlug.get(b);
      return {
        slug: comparisonSlugPair(a, b),
        a,
        b,
        labels: { a: pa.name, b: pb.name },
        scoresA: pa.scores,
        scoresB: pb.scores,
        overallA: weightedScore(pa.scores),
        overallB: weightedScore(pb.scores),
        startingPricing: {
          a: pa.startingPriceMonthly,
          b: pb.startingPriceMonthly,
        },
      };
    });
  // Also allow pairs where one product is external (existing catalogue) — skip missing from this batch
  writeJson(path.join(ROOT, "scripts", filename), spec);
  console.log(`✓ comparison specs → ${spec.length} pairs`);
}

export function writeVideoImportSpec(products, filename) {
  const videos = [];
  for (const p of products) {
    for (const v of p.officialVideos ?? []) {
      videos.push({
        product: p.slug,
        videoId: v.videoId,
        title: v.title,
        channel: v.channel,
        org: p.company,
        assetType: "official-product-video",
        shows: Array.isArray(v.shows) ? v.shows : [v.shows].filter(Boolean),
        features: v.features,
      });
    }
  }
  writeJson(path.join(ROOT, "scripts", filename), videos);
  console.log(`✓ video specs → ${videos.length} videos`);
}

export function runEcomBatch({
  products,
  pairs = [],
  seedSnippetFile,
  comparisonSpecFile,
  videoSpecFile,
  seedHeader,
}) {
  for (const p of products) writeProduct(p);
  writeSeedSnippet(products, seedSnippetFile, seedHeader);
  if (pairs.length && comparisonSpecFile) {
    writeComparisonSpec(products, pairs, comparisonSpecFile);
  }
  if (videoSpecFile) writeVideoImportSpec(products, videoSpecFile);
}
