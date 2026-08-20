#!/usr/bin/env node
/**
 * Shared marketing onboarding runtime (from Wave-2 batch).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");
export const VERIFIED_AT = "2026-08-17T17:00:00.000Z";
export const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

export const RELATED_GUIDE_PATHS = [
  "/guides/how-to-choose-marketing-software/",
  "/categories/marketing/",
  "/best/marketing-software/",
];

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
];

/** Exact criterionSlug values from marketing editorialMethodology */
export const MKT_CRITERIA = [
  "ease-of-use",
  "campaign-content",
  "marketing-automation",
  "funnel-conversion",
  "analytics-attribution",
  "brand-monitoring",
  "integrations",
  "scalability",
  "value-for-money",
  "ai-capabilities",
];

export const MKT_FEATURES = [
  "social-scheduling",
  "content-calendar",
  "social-listening",
  "funnel-builder",
  "landing-pages",
  "marketing-automation",
  "forms-lead-capture",
  "analytics",
  "ads-management",
  "reputation-reviews",
  "webinars",
  "email-sms-channels",
  "team-collaboration",
  "ai-content-generation",
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

export function planFlat(slug, name, monthly, extra = {}) {
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
        currency: extra.currency ?? "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Per-unit / credit packs (e.g. Livestorm attendee credits). */
export function planPerUnit(slug, name, amountPerUnit, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: Boolean(extra.contactSales),
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: extra.contactSales
      ? []
      : [
          {
            kind: "per-unit",
            unit: extra.unit ?? "credit",
            amountPerUnit,
            currency: extra.currency ?? "USD",
            interval: extra.interval ?? "year",
            amountPeriod: extra.amountPeriod ?? "year",
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
  const vals = MKT_CRITERIA.map((c) => scores[c]);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
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
  // Schema uses not-supported (not "unsupported")
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
      notes: `First-party product positioning for ${p.name} (Marketing onboarding 2026-08-17).`,
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

function buildPricingFixture(p) {
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)
# Label: fixture extract for FixtureFactExtractor — not a live HTML scrape dump.

CURRENCY: ${p.currency ?? "USD"}
PRICING_MODEL: ${p.pricingModel}
FREE_PLAN: ${p.hasFreePlan}
FREE_TRIAL: ${p.hasFreeTrial}
${p.trialDays ? `TRIAL_DAYS: ${p.trialDays}` : ""}
${p.startingPriceMonthly !== undefined ? `STARTING_PRICE_MONTHLY: ${p.startingPriceMonthly}` : ""}

NOTES:
${p.pricingNotes}

PLANS:
${p.fixturePlans.map((line) => `- ${line}`).join("\n")}
`;
}

function buildProductFixture(p) {
  const featureLines = MKT_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? []).map((l) => `AI ${l}`).join("\n");
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}
MEMBERSHIP_ROLE: ${p.membershipRole}
PRIMARY_CATEGORY: marketing

${featureLines}

${ai}
`;
}

export function parseAiLine(line) {
  const cleaned = line.replace(/^AI\s+/i, "").trim();
  const idx = cleaned.indexOf(":");
  const capability = (idx === -1 ? cleaned : cleaned.slice(0, idx)).trim();
  const availability = (
    idx === -1 ? "unknown" : cleaned.slice(idx + 1)
  ).trim();
  return { capability, availability: availability || "unknown" };
}

export function supportingFeatureForCriterion(criterionSlug) {
  const map = {
    "ease-of-use": "content-calendar",
    "campaign-content": "social-scheduling",
    "marketing-automation": "marketing-automation",
    "funnel-conversion": "funnel-builder",
    "analytics-attribution": "analytics",
    "brand-monitoring": "social-listening",
    integrations: "team-collaboration",
    scalability: "marketing-automation",
    "value-for-money": "landing-pages",
    "ai-capabilities": "ai-content-generation",
  };
  return map[criterionSlug] ?? "marketing-automation";
}

export function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = MKT_FEATURES.map((featureSlug) => ({
    featureSlug,
    availability: featureAvailability(p, featureSlug),
    planSlugs: slugs,
    sourceIds: [`${p.slug}-product-official`],
  }));

  const pricing = {
    currency: p.currency ?? "USD",
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

  const editorialFit = (p.businessSizeSlugs ?? []).map((businessSizeSlug) => {
    const strength =
      businessSizeSlug === "mid-market"
        ? "moderate"
        : businessSizeSlug === "micro" || businessSizeSlug === "small-business"
          ? "strong"
          : "moderate";
    return {
      businessSizeSlug,
      teamTypeSlug: "marketing",
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} marketing teams from first-party positioning and Marketing onboarding research.`,
      isEditorial: true,
    };
  });

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
    media: [],
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: `Marketing onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false. membershipRole=${p.membershipRole}. primaryCategorySlug=marketing.`,
    domainCheckedAt,
    updatedAt: VERIFIED_AT,
  };
}

export function factBase(p, id, domain, field, value, sourceId, excerpt, locator) {
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
    confidence: "medium",
    status: "approved",
    isFixture: true,
    notes: "Marketing onboarding first-party research extract",
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
      `hasFreeTrial=${p.hasFreeTrial}`,
    ),
  ];
  if (p.startingPriceMonthly !== undefined) {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-pricing.startingPriceMonthly`,
        "pricing",
        "pricing.startingPriceMonthly",
        p.startingPriceMonthly,
        pricingSrc,
        `Starting ~$${p.startingPriceMonthly}/mo where published`,
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
  for (const featureSlug of MKT_FEATURES) {
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
  return MKT_CRITERIA.map((criterionSlug) => {
    const score = p.scores[criterionSlug];
    const featureSlug = supportingFeatureForCriterion(criterionSlug);
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
    if (criterionSlug === "integrations") {
      supportingFactIds[0] = `fact-${p.slug}-positioning.vendorClaim`;
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

export function buildAssessment(p) {
  const overallScore = avgScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  return {
    id: `assessment-${p.slug}-marketing-v1`,
    productSlug: p.slug,
    methodologySlug: "marketing-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose} Scores use the marketing-editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Specialist depth (listening vs scheduling vs funnels) vs all-in-one breadth",
      "Published entry price vs contact/profile/mention upgrade pressure",
      "Marketing automation / email depth vs pure ESP peers",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes: `Marketing onboarding batch. Approved on marketing-editorial v1.0.0. membershipRole=${p.membershipRole}. primaryCategorySlug=marketing. handsOnTesting=false. Affiliate economics excluded.`,
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale:
      "Equal-weight average of 10 marketing-editorial criteria, rounded to 1 decimal. Not a hands-on lab score. Specialist tools score low on non-core criteria by design.",
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          "Marketing onboarding; approved marketing criteria; handsOnTesting=false",
        nextOverall: overallScore,
      },
    ],
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

export function buildReview(p) {
  const overallScore = avgScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const researchSourceIds = [
    `${p.slug}-product-official`,
    `${p.slug}-pricing-official`,
    ...(p.sourcesExtra ?? []).map((s) => s.id),
  ];
  const comparisonSlugs = (p.alternativeSlugs ?? []).map((alt) =>
    comparisonSlugPair(p.slug, alt),
  );

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-marketing-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as Marketing & Growth software — ${p.shortDescription} This review uses SoftwareGlimpse’s marketing methodology (ease of use, campaign/content tools, marketing automation, funnel/conversion, analytics, brand monitoring, integrations, scalability, value, AI). It is based on first-party research, not hands-on lab testing.`,
    summary: p.whoShouldChoose,
    verdict: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives} Scores reflect first-party documentation as of 2026-08-17 — not hands-on product testing. Confirm current packaging on the vendor site before purchase.`,
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
    methodologySlug: "marketing-editorial",
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
        ],
      },
      {
        section: "overview",
        factIds: [
          `fact-${p.slug}-identity.shortDescription`,
          `fact-${p.slug}-positioning.vendorClaim`,
        ],
      },
    ],
    faq: [
      {
        question: `Is ${p.name} email marketing software?`,
        answer:
          p.secondaryCategorySlugs?.includes("email-marketing")
            ? `${p.name} is primarily Marketing & Growth software with meaningful email/SMS capability — email-marketing is a secondary membership, not the primary ESP category.`
            : `No. ${p.name} is evaluated as Marketing & Growth software. For core ESP/newsletter tools, see email-marketing category peers like GetResponse or AWeber.`,
      },
      {
        question: `How is ${p.name} priced?`,
        answer: p.pricingSummary,
      },
      {
        question: `Did SoftwareGlimpse personally test ${p.name}?`,
        answer:
          "No. This review is based on first-party product and pricing research evidence, not hands-on product usage.",
      },
      {
        question: `Who should choose ${p.name}?`,
        answer: p.whoShouldChoose,
      },
      {
        question: `What are the main limitations of ${p.name}?`,
        answer: p.limitations.slice(0, 3).join(" "),
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
        id: "pricing",
        heading: "Pricing",
        body: p.pricingSummary,
      },
      {
        id: "features",
        heading: "Key features",
        body: p.keyFeatures.map((f) => `• ${f}`).join("\n"),
      },
      {
        id: "limitations",
        heading: "Limitations",
        body: p.limitations.map((l) => `• ${l}`).join("\n"),
      },
      {
        id: "alternatives",
        heading: "Alternatives",
        body: p.whoShouldConsiderAlternatives,
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
      title: `${p.name} Review (2026) — Marketing & Growth`,
      description: `${p.name} marketing software review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
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
    primaryCategorySlug: "marketing",${secondary}
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
    path.join(fixturesDir, `${p.slug}-pricing-official.txt`),
    buildPricingFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-fixture.txt`),
    buildProductFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-official.txt`),
    buildProductFixture(p),
  );
  writeJson(path.join(researchDir, "enrichment.json"), buildEnrichment(p));
  writeJson(path.join(researchDir, "facts.json"), buildFacts(p));
  writeJson(path.join(researchDir, "conflicts.json"), []);
  writeJson(path.join(researchDir, "jobs.json"), [
    {
      id: `job-${p.slug}-marketing-wave2`,
      productSlug: p.slug,
      domains: [
        "identity",
        "pricing",
        "plans",
        "features",
        "integrations",
        "free-trial",
        "free-plan",
        "limits",
        "ai-capabilities",
        "product-positioning",
      ],
      status: "approved",
      createdAt: VERIFIED_AT,
      updatedAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      dryRun: false,
      allowFixtures: true,
      sourceIds: [
        `${p.slug}-product-official`,
        `${p.slug}-pricing-official`,
        ...(p.sourcesExtra ?? []).map((s) => s.id),
      ],
      snapshotIds: [],
      factIds: [],
      conflictIds: [],
      errors: [],
      notes: `Marketing onboarding batch; membershipRole=${p.membershipRole}; primaryCategorySlug=marketing`,
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
    `✓ ${p.slug}  overall=${assessment.overallScore}  role=${p.membershipRole}  secondary=${(p.secondaryCategorySlugs ?? []).join(",") || "-"}`,
  );
}

function writeSeedSnippet(products) {
  const out = path.join(ROOT, "scripts/_marketing-batch-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-marketing-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed.
// Prefer: node scripts/patch-software-seed-marketing.mjs

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
}

function writeVideoImportSpec(products) {
  const videos = [];
  for (const p of products) {
    for (const v of p.officialVideos ?? []) {
      if (v.videoId) {
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
      } else {
        videos.push({
          product: p.slug,
          title: v.title,
          url: v.url,
          notes: v.notes,
          org: p.company,
          assetType: "official-webinar-or-demo-page",
          status: "needs-video-id",
        });
      }
    }
  }
  writeJson(path.join(ROOT, "scripts/_marketing-batch-official-videos.json"), videos);
  console.log(`✓ video specs → ${videos.length} entries`);
}

function writeAffiliateHints(products) {
  const rows = products.map((p) => ({
    productSlug: p.slug,
    catalogueSourceId: p.catalogueSourceId ?? null,
    affiliateUrl: p.affiliateUrl ?? null,
    enable:
      Boolean(p.affiliateUrl) &&
      Boolean(p.catalogueSourceId),
  }));
  writeJson(path.join(ROOT, "scripts/_marketing-batch-affiliate-hints.json"), rows);
  console.log(
    `✓ affiliate hints → ${rows.filter((r) => r.enable).length}/${rows.length} with live URLs`,
  );
}


export function runMktBatch({ products, batchLabel, seedSnippetFile, videoSpecFile, jobTag }) {
  for (const p of products) {
    writeProduct(p);
    const jobsPath = path.join(ROOT, "src/data/research", p.slug, "jobs.json");
    fs.writeFileSync(
      jobsPath,
      JSON.stringify(
        [
          {
            id: `job-${p.slug}-${jobTag}`,
            productSlug: p.slug,
            status: "completed",
            createdAt: VERIFIED_AT,
            completedAt: VERIFIED_AT,
            notes: `${batchLabel}; membershipRole=${p.membershipRole}; primary=${p.primaryCategorySlug ?? "marketing"}`,
          },
        ],
        null,
        2,
      ) + "\n",
    );
  }
  const out = path.join(ROOT, "scripts", seedSnippetFile);
  const body = `// Auto-generated by ${batchLabel}
// Patch into src/data/seed/software.ts (append new soft entries).

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
  writeJson(path.join(ROOT, "scripts", videoSpecFile), []);
  const affiliateRows = products.map((p) => ({
    productSlug: p.slug,
    catalogueSourceId: p.catalogueSourceId ?? null,
    affiliateUrl: p.affiliateUrl ?? null,
    enable: Boolean(p.affiliateUrl) && Boolean(p.catalogueSourceId),
  }));
  writeJson(
    path.join(ROOT, "scripts", `_marketing-${jobTag}-affiliate-hints.json`),
    affiliateRows,
  );
  console.log(
    `✓ affiliate hints → ${affiliateRows.filter((r) => r.enable).length}/${affiliateRows.length} with live URLs`,
  );
  console.log("\nOverall scores:");
  for (const p of products) {
    console.log(`  ${p.slug}: ${avgScore(p.scores)}`);
  }
  console.log("\nDone marketing packs. No WP publish.");
}
