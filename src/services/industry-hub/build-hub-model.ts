import { cache } from "react";
import type {
  CurrencyCode,
  FeatureAvailability,
  Industry,
  IndustryHubProfile,
  IndustryResearchMaturity,
  Pricing,
  ProductMedia,
  Software,
} from "@/domain";
import { formatMoney, fromMajor, PricingSchema } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  getAllComparisonsUnfiltered,
  getAllIndustriesUnfiltered,
  getIndustryBySlug,
  getPrimarySoftwareByCategory,
  getSoftwareBySlug,
} from "@/data";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import {
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import { getIndustryHubProfile } from "@/data/industry-hub";
import { getIndustryCapabilityProfile } from "@/data/industry-capability";
import { getIndustryUseCaseProfile } from "@/data/industry-use-case";
import {
  hubPriorityCapabilitySlug,
  hubUseCaseSlug,
} from "@/data/crm-graph";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import { loadEnrichment } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import {
  compareProductCosts,
  deriveCostRangeSummary,
} from "@/services/pricing";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { resolveVisitCta } from "@/services/affiliate/resolve-visit-cta";
import {
  countIndustryVisualEvidence,
  selectIndustrySeeInActionCards,
  type IndustrySeeInActionCard,
} from "@/services/product-media/industry-page-media";
import { buildIndustryWorkflowExperience } from "@/services/industry-hub/build-workflow-experience";
import type { WorkflowExperienceModel } from "@/services/workflow-experience";
import {
  buildProductIndustryAssessment,
  selectProductIndustryAssessmentTargets,
  type ProductIndustryAssessment,
} from "@/services/product-industry-assessment";
import {
  buildIndustryCustomerStoryCards,
  type IndustryCustomerStoryCard,
} from "@/services/industry-customer-stories";
import {
  buildIndustryEvidenceExplorer,
  type EvidenceExplorerModel,
} from "@/services/evidence-explorer";

export type EvidenceCell = "supported" | "partial" | "unknown" | "not-supported";

export type IndustryHubNavItem = {
  id: string;
  label: string;
  icon?: string;
};

export type IndustryHubProductCard = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  positioning: string | null;
  bestFor: string | null;
  overallScore: number | null;
  pricingTeaser: string | null;
  pricingVerifiedAt: string | null;
  hasFreePlan: boolean | null;
  hasFreeTrial: boolean | null;
  capabilitySnapshot: Array<{
    featureSlug: string;
    featureName: string;
    href?: string | null;
    cell: EvidenceCell;
  }>;
  reviewHref: string;
  compareHref: string;
  visitHref: string;
  /** Informational only — never used in ranking. */
  hasOfficialIndustryDemo: boolean;
  hasOfficialIndustryMedia: boolean;
  officialVideoCount: number;
};

/** Resolved catalogue product + curated fit notes for an industry hub. */
export type IndustryHubProductFitCard = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  why: string;
  bestWhen: string;
  overallScore: number | null;
  reviewHref: string;
  compareHref: string;
};

export type IndustryHubModel = {
  industry: Industry;
  profile: IndustryHubProfile | null;
  maturity: IndustryResearchMaturity;
  confidenceMessage: string | null;
  showIndustryRankings: boolean;
  displayTitle: string;
  badgeLabel: string;
  tagline: string;
  overview: string;
  whoThisIsFor: string | null;
  whatMattersIntro: string;
  workedExample: string | null;
  workedExampleSecondary: string | null;
  categorySlug: string;
  shortLabel: string;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  catalogueHref: string;
  methodologyHref: string;
  glance: {
    primaryGoal: string | null;
    commonPriorities: string[];
    teamTypes: string[];
    researchedProductCount: number;
    lastReviewedAt: string | null;
  };
  challenges: IndustryHubProfile["challenges"];
  outcomes: IndustryHubProfile["outcomes"];
  capabilityNeeds: IndustryHubProfile["capabilityNeeds"];
  workflowSteps: IndustryHubProfile["workflowSteps"];
  /** Expandable workflow experience — workflow first, demos in drawer. */
  workflowExperience: WorkflowExperienceModel | null;
  heroVisual: IndustryHubProfile["heroVisual"];
  needsVisual: IndustryHubProfile["needsVisual"];
  workflowVisual: IndustryHubProfile["workflowVisual"];
  priorities: IndustryHubProfile["priorities"];
  useCases: IndustryHubProfile["useCases"];
  /** Curated catalogue shortlist with fit notes — empty when none authored. */
  productFitCards: IndustryHubProductFitCard[];
  productCards: IndustryHubProductCard[];
  compareRows: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
    pricingTeaser: string | null;
    pipeline: EvidenceCell;
    automation: EvidenceCell;
    reporting: EvidenceCell;
    integrations: EvidenceCell;
    positioning: string | null;
  }>;
  capabilityMatrix: {
    groups: Array<{
      id: string;
      title: string;
      rows: Array<{
        featureSlug: string;
        featureName: string;
        href?: string | null;
        cells: EvidenceCell[];
      }>;
    }>;
    products: Array<{ slug: string; name: string; logo?: { src: string; alt: string } | null }>;
  } | null;
  costPreview: {
    users: number;
    billing: "monthly" | "annual";
    lowestLabel: string | null;
    midpointLabel: string | null;
    highestLabel: string | null;
    lowestMinor: number | null;
    midpointMinor: number | null;
    highestMinor: number | null;
    currency: CurrencyCode | null;
    caption: string;
  } | null;
  buyingFramework: IndustryHubProfile["buyingFramework"];
  buyingGuideHref: string | null;
  implementationConsiderations: IndustryHubProfile["implementationConsiderations"];
  evaluationQuestions: IndustryHubProfile["evaluationQuestions"];
  securityDimensions: IndustryHubProfile["securityDimensions"];
  securityDisclaimer: string;
  comparisons: Array<{
    href: string;
    title: string;
    products: Array<{
      name: string;
      slug: string;
      logo?: { src: string; alt: string } | null;
    }>;
  }>;
  guides: Array<{
    href: string;
    title: string;
    summary: string | null;
    topicType: string;
    readTimeMinutes: number | null;
  }>;
  relatedIndustries: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
  }>;
  faq: IndustryHubProfile["faq"];
  researchPanel: {
    lastRefresh: string | null;
    evidenceCoverageLabel: string | null;
    researchedProductCount: number;
  };
  navItems: IndustryHubNavItem[];
  stats: Array<{
    label: string;
    href?: string;
    icon?: "products" | "updated" | "independent" | "methodology";
  }>;
  /** See CRM in this industry — omit UI when empty. */
  seeInIndustryCards: IndustrySeeInActionCard[];
  /**
   * Vendor-published customer stories — lower-page Real-world examples only.
   * Never placed in primary product ranking.
   */
  customerStories: IndustryCustomerStoryCard[];
  /** Product × Industry research modules (complete without video). */
  productIndustryAssessments: ProductIndustryAssessment[];
  /** @deprecated Prefer productIndustryAssessments */
  productIndustrySpotlights: ProductIndustryAssessment[];
  /** Side-by-side workflow compare (max 2 products). */
  workflowCompare: {
    left: IndustrySeeInActionCard | null;
    right: IndustrySeeInActionCard | null;
    interpretation: string;
  } | null;
  evidenceExplorer: EvidenceExplorerModel | null;
  screenshotFallback: Array<{
    id: string;
    productSlug: string;
    productName: string;
    src: string;
    alt: string;
    caption?: string;
  }>;
  visualEvidenceCounts: {
    industrySpecificDemos: number;
    generalWorkflowDemos: number;
    customerCaseStudies: number;
    screenshots: number;
  };
  methodologyNote: string;
};

function mapAvailability(value: FeatureAvailability | undefined): EvidenceCell {
  switch (value) {
    case "supported":
      return "supported";
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return "partial";
    case "not-supported":
      return "not-supported";
    default:
      return "unknown";
  }
}

function featureCell(productSlug: string, featureSlug: string): EvidenceCell {
  const enrichment = loadEnrichment(productSlug);
  const fromEnrichment = enrichment?.featureSupport.find(
    (f) => f.featureSlug === featureSlug,
  );
  if (fromEnrichment) return mapAvailability(fromEnrichment.availability);

  const software = getSoftwareBySlug(productSlug);
  const rating = software?.featureRatings.find(
    (r) => r.featureSlug === featureSlug,
  );
  if (!rating || rating.available == null) return "unknown";
  return rating.available ? "supported" : "not-supported";
}

function featureName(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

function resolveProductPricing(software: Software): {
  pricing: Pricing | null;
  verifiedAt: string | null;
} {
  const enrichment = loadEnrichment(software.slug);
  const candidates = [enrichment?.pricing, software.pricing];
  for (const raw of candidates) {
    if (raw == null) continue;
    const parsed = PricingSchema.safeParse(raw);
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

function pricingTeaser(software: Software): string | null {
  const { pricing, verifiedAt } = resolveProductPricing(software);
  if (!pricing || pricing.startingPriceMonthly == null || !verifiedAt) {
    return null;
  }
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/month`;
}

function freeFlags(software: Software): {
  hasFreePlan: boolean | null;
  hasFreeTrial: boolean | null;
} {
  const { pricing, verifiedAt } = resolveProductPricing(software);
  if (!pricing || !verifiedAt) {
    return { hasFreePlan: null, hasFreeTrial: null };
  }
  return {
    hasFreePlan:
      typeof pricing.hasFreePlan === "boolean" ? pricing.hasFreePlan : null,
    hasFreeTrial:
      typeof pricing.hasFreeTrial === "boolean" ? pricing.hasFreeTrial : null,
  };
}

function pricingVerifiedAt(software: Software): string | null {
  return resolveProductPricing(software).verifiedAt;
}

function positioningFromSoftware(software: Software): string | null {
  const useCase = software.useCaseSlugs[0];
  if (!useCase) return null;
  const labels: Record<string, string> = {
    "pipeline-management": "Pipeline",
    "lead-management": "Lead gen",
    "sales-automation": "Automation",
    "relationship-management": "Relationships",
    "contact-management": "Contacts",
    "sales-engagement": "Engagement",
    "email-outreach": "Outreach",
  };
  return labels[useCase] ?? null;
}

function productBestFor(software: Software): string | null {
  return firstPublicCopy([
    software.bestFor[0],
    loadAssessment(software.slug)?.bestFor?.[0],
    software.shortDescription,
  ]);
}

function approvedOverallScore(software: Software): number | null {
  const review = loadReview(software.slug);
  const assessment = loadAssessment(software.slug);
  const approved =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved" &&
    typeof (review.overallScore ?? assessment.overallScore) === "number";
  if (!approved) return null;
  return (review?.overallScore ?? assessment?.overallScore) as number;
}

function compareHrefForProduct(
  productSlug: string,
  comparisons: Array<{ slug: string; productSlugs: string[] }>,
): string {
  const match = comparisons.find((c) => c.productSlugs.includes(productSlug));
  if (match) return `/compare/${match.slug}/`;
  return `/compare/build/?a=${encodeURIComponent(productSlug)}`;
}

function deriveMaturity(industry: Industry): IndustryResearchMaturity {
  const status = industry.metadata.researchStatus;
  if (!status || status === "none") return "unresearched";
  if (status === "in-progress" || status === "stale") {
    return "research-in-progress";
  }
  // Dedicated industry rankings are not yet modeled — complete research
  // without industry rankings stays at "verified".
  if (industry.seo.indexable === true) return "verified";
  return "verified";
}

function confidenceMessage(
  maturity: IndustryResearchMaturity,
  industryName: string,
): string | null {
  switch (maturity) {
    case "unresearched":
      return `Industry-specific rankings for ${industryName} are not available yet. You can still compare CRM products using our broader CRM research.`;
    case "research-in-progress":
      return `Industry-specific rankings for ${industryName} are still being added. You can currently compare CRM products using our broader CRM research.`;
    case "verified":
      return null;
    case "editorially-approved":
      return null;
    default:
      return null;
  }
}

function defaultPriorities(industryName: string): IndustryHubProfile["priorities"] {
  return [
    {
      id: "relationships",
      title: "Client relationship management",
      description: `Maintain account and contact history relevant to ${industryName.toLowerCase()} workflows.`,
      icon: "users",
      capabilitySlug: hubPriorityCapabilitySlug("relationships"),
    },
    {
      id: "pipeline",
      title: "Pipeline & opportunity management",
      description: "Track opportunities, stages, ownership, and next actions.",
      icon: "funnel",
      capabilitySlug: hubPriorityCapabilitySlug("pipeline"),
    },
    {
      id: "automation",
      title: "Workflow automation",
      description: "Reduce repetitive administrative work and standardize processes.",
      icon: "zap",
      capabilitySlug: hubPriorityCapabilitySlug("automation"),
    },
    {
      id: "reporting",
      title: "Reporting & forecasting",
      description: "Understand pipeline health, activity, and expected outcomes.",
      icon: "chart",
      capabilitySlug: hubPriorityCapabilitySlug("reporting"),
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connect CRM with the rest of your software stack.",
      icon: "puzzle",
      capabilitySlug: hubPriorityCapabilitySlug("integrations"),
    },
    {
      id: "security",
      title: "Security & administration",
      description: "Evaluate permissions, controls, and administration needs.",
      icon: "shield",
      capabilitySlug: hubPriorityCapabilitySlug("security"),
    },
  ];
}

function defaultUseCases(): IndustryHubProfile["useCases"] {
  return [
    {
      id: "relationship",
      title: "Relationship-led teams",
      bestWhen: "Ongoing client context and follow-up are central.",
      icon: "handshake",
      useCaseSlug: hubUseCaseSlug("relationship"),
    },
    {
      id: "sales",
      title: "Pipeline-led sales teams",
      bestWhen: "Opportunity stages and sales activity are central.",
      icon: "funnel",
      useCaseSlug: hubUseCaseSlug("sales"),
    },
    {
      id: "volume",
      title: "High-volume lead handling",
      bestWhen: "Teams process large inbound or outbound prospect volumes.",
      icon: "users",
      useCaseSlug: hubUseCaseSlug("volume"),
    },
    {
      id: "complex",
      title: "Complex buying processes",
      bestWhen: "Multiple stages, stakeholders, and approvals are involved.",
      icon: "layers",
      useCaseSlug: hubUseCaseSlug("complex"),
    },
    {
      id: "growing",
      title: "Growing teams",
      bestWhen: "Ease of adoption and scalable processes matter most.",
      icon: "trending",
      useCaseSlug: hubUseCaseSlug("growing"),
    },
  ];
}

function defaultBuyingSteps(): IndustryHubProfile["buyingFramework"] {
  return [
    {
      step: 1,
      title: "Define your workflow",
      description: "Document how your team sells, serves, and follows up today.",
      href: "/use-cases/",
      ctaLabel: "Browse CRM use cases",
    },
    {
      step: 2,
      title: "Identify must-have capabilities",
      description: "Prioritize capabilities your team will use weekly.",
      href: "/tools/crm-requirements-builder/?start=1",
      ctaLabel: "Requirements Builder",
    },
    {
      step: 3,
      title: "Check integrations and administration",
      description: "Confirm stack fit, permissions, and ownership.",
      href: "/guides/how-to-choose-crm/",
      ctaLabel: "How to choose a CRM",
    },
    {
      step: 4,
      title: "Compare total cost",
      description: "Estimate seats, tiers, and add-ons from prices.",
      href: "/tools/crm-cost-calculator/",
      ctaLabel: "CRM Cost Calculator",
    },
    {
      step: 5,
      title: "Test shortlisted products",
      description: "Trial with real workflows before committing.",
      href: "/tools/crm-finder/",
      ctaLabel: "Start CRM Finder",
    },
  ];
}

function defaultFaq(industryName: string): IndustryHubProfile["faq"] {
  return [
    {
      question: `What is CRM software for ${industryName.toLowerCase()}?`,
      answer: `CRM software helps ${industryName.toLowerCase()} teams manage contacts, opportunities, and follow-ups in one place. Fit depends on workflow — not a single industry label.`,
    },
    {
      question: `What should ${industryName.toLowerCase()} teams look for in a CRM?`,
      answer:
        "Start with relationship context, pipeline visibility, automation, reporting, integrations, and administration controls. Verify security and compliance needs with vendors.",
    },
    {
      question: "How much does CRM software cost?",
      answer:
        "Pricing usually depends on seats, plan tiers, and add-ons. Use the CRM Cost Calculator for list-price estimates.",
    },
    {
      question: "How should I compare CRM platforms?",
      answer:
        "Compare on shared capabilities that match your workflow, then check pricing and implementation effort using comparisons and CRM Finder.",
    },
    {
      question: `Is there one best CRM for every ${industryName.toLowerCase()} organization?`,
      answer:
        "No. Needs differ by team and workflow. Industry-specific rankings publish only when dedicated research supports them.",
    },
    {
      question: "How does SoftwareGlimpse evaluate CRM software?",
      answer:
        "Capabilities and pricing are tied to recorded evidence. Affiliate relationships never determine rankings or recommendations.",
    },
  ];
}

function defaultSecurity(): {
  dimensions: IndustryHubProfile["securityDimensions"];
  disclaimer: string;
} {
  return {
    dimensions: [
      {
        id: "access",
        title: "Data access controls",
        description: "Who can see and change records.",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "permissions",
        title: "User permissions",
        description: "Role-based permissions and admin boundaries.",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "audit",
        title: "Auditability",
        description: "Visibility into changes and access over time.",
        requirementSlug: "audit-user-activity",
      },
      {
        id: "retention",
        title: "Data retention & export",
        description: "How data is retained, exported, and deleted.",
        requirementSlug: "retain-and-export-data",
      },
      {
        id: "sso",
        title: "Identity / SSO",
        description: "How users authenticate into the platform.",
        requirementSlug: "support-sso",
      },
      {
        id: "integration-security",
        title: "Integration security",
        description: "How connected systems exchange data.",
        requirementSlug: "manage-integrations",
      },
      {
        id: "residency",
        title: "Data residency",
        description: "Where customer data is stored and processed.",
        requirementSlug: "control-data-residency",
      },
      {
        id: "vendor-docs",
        title: "Vendor security documentation",
        description: "What the vendor publishes for security review.",
        requirementSlug: "review-vendor-security-docs",
      },
    ],
    disclaimer:
      "Requirements vary by organization, jurisdiction and regulatory environment. Verify regulatory and security requirements directly with shortlisted vendors. This section is educational and is not legal advice.",
  };
}

function buildCostPreview(users = 10): IndustryHubModel["costPreview"] {
  try {
    const snapshots = listCrmPricingSnapshots();
    const comparison = compareProductCosts(snapshots, {
      crmUsers: users,
      requiredFeatureSlugs: [],
      billingPreference: "monthly",
    });
    // Keep a single currency band — never FX-normalize mixed currencies.
    const usdOnly = comparison.results.filter((r) => r.currency === "USD");
    const range = deriveCostRangeSummary(
      usdOnly.length > 0 ? usdOnly : comparison.results,
    );
    if (!range) return null;
    // Prefer a meaningful spread (exclude free-only zeros when paid options exist).
    const paid = range.sorted.filter(
      (r) => r.monthlyEquivalent.amountMinor > 0,
    );
    const paidRange =
      paid.length >= 2
        ? deriveCostRangeSummary(paid)
        : range;
    if (!paidRange) return null;
    return {
      users,
      billing: "monthly",
      lowestLabel: formatMoney(paidRange.lowest.monthlyEquivalent),
      midpointLabel: formatMoney(paidRange.midpoint.monthlyEquivalent),
      highestLabel: formatMoney(paidRange.highest.monthlyEquivalent),
      lowestMinor: paidRange.lowest.monthlyEquivalent.amountMinor,
      midpointMinor: paidRange.midpoint.monthlyEquivalent.amountMinor,
      highestMinor: paidRange.highest.monthlyEquivalent.amountMinor,
      currency: paidRange.currency,
      caption:
        "Verified USD catalogue range for this team size — midpoint is the catalogue median, not a market average.",
    };
  } catch {
    return null;
  }
}

/**
 * Build the Industry Hub page model.
 * Product evidence always comes from catalogue / enrichment — never invented.
 */
export const buildIndustryHubModel = cache(function buildIndustryHubModel(
  industry: Industry,
): IndustryHubModel {
  const profile = getIndustryHubProfile(industry.slug);
  const categorySlug = profile?.categorySlug ?? "crm";
  const shortLabel = "CRM";
  const maturity = deriveMaturity(industry);
  const showIndustryRankings = maturity === "editorially-approved";

  const primaryProducts = [...getPrimarySoftwareByCategory(categorySlug)].sort(
    (a, b) => {
      const scoreA = approvedOverallScore(a) ?? 0;
      const scoreB = approvedOverallScore(b) ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    },
  );

  const allCategoryComparisons = getAllComparisonsUnfiltered().filter(
    (item) =>
      item.categorySlug === categorySlug &&
      (isPubliclyAvailable(item.metadata) ||
        item.outcomes.length > 0 ||
        item.metadata.researchStatus !== "none"),
  );

  const snapshotSlugs =
    profile?.snapshotFeatureSlugs?.length
      ? profile.snapshotFeatureSlugs
      : [
          "pipeline-management",
          "workflow-automation",
          "reporting",
          "integrations",
        ];

  const featuredProducts = primaryProducts.slice(0, 6);

  const mediaPool: ProductMedia[] = [];
  const screenshotFallback: IndustryHubModel["screenshotFallback"] = [];
  for (const product of primaryProducts.slice(0, 12)) {
    const enrichment = loadEnrichment(product.slug);
    if (enrichment?.media?.length) {
      mediaPool.push(...enrichment.media);
    }
    for (const shot of enrichment?.screenshots?.slice(0, 2) ?? []) {
      if (screenshotFallback.length >= 8) break;
      screenshotFallback.push({
        id: shot.id,
        productSlug: product.slug,
        productName: product.name,
        src: shot.src,
        alt: shot.alt,
        caption: shot.caption,
      });
    }
  }

  const useCaseIds = (profile?.useCases ?? [])
    .map((u) => u.useCaseSlug)
    .filter((s): s is string => Boolean(s));
  const capabilityIds = (profile?.priorities ?? [])
    .map((p) => p.capabilitySlug)
    .filter((s): s is string => Boolean(s));
  const workflowSteps = profile?.workflowSteps ?? [];

  const seeInIndustryCards = selectIndustrySeeInActionCards({
    mediaPool,
    products: featuredProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    ctx: {
      industrySlug: industry.slug,
      useCaseIds,
      capabilityIds,
      workflowStepIds: workflowSteps.map((s) => s.id),
      requireIndustryRelevance: true,
    },
    workflowSteps: workflowSteps.map((s) => ({ id: s.id, label: s.label })),
    limit: 4,
  });

  const customerStories = buildIndustryCustomerStoryCards({
    mediaPool,
    industrySlug: industry.slug,
    industryLabel: profile?.badgeLabel ?? industry.name,
    products: featuredProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    limit: 4,
  });

  const visualCounts = countIndustryVisualEvidence(seeInIndustryCards);
  visualCounts.customerCaseStudies = customerStories.length;

  const workflowExperience = buildIndustryWorkflowExperience({
    industrySlug: industry.slug,
    industryLabel: profile?.badgeLabel ?? industry.name,
    profile,
    products: featuredProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    seeInIndustryCards,
  });

  const mediaByProduct = new Map<string, IndustrySeeInActionCard[]>();
  for (const card of seeInIndustryCards) {
    const list = mediaByProduct.get(card.productSlug) ?? [];
    list.push(card);
    mediaByProduct.set(card.productSlug, list);
  }

  const productCards: IndustryHubProductCard[] = featuredProducts.map(
    (product) => {
      const flags = freeFlags(product);
      const productMedia = mediaPool.filter(
        (m) =>
          m.productSlug === product.slug &&
          (m.status === "published" ||
            m.status === "active" ||
            m.status === "embedding-disabled"),
      );
      const industryTagged = productMedia.filter((m) =>
        m.industryIds.includes(industry.slug),
      );
      const cardMedia = mediaByProduct.get(product.slug) ?? [];
      return {
        slug: product.slug,
        name: product.name,
        logo: product.logo,
        positioning: positioningFromSoftware(product),
        bestFor: productBestFor(product),
        overallScore: approvedOverallScore(product),
        pricingTeaser: pricingTeaser(product),
        pricingVerifiedAt: pricingVerifiedAt(product),
        hasFreePlan: flags.hasFreePlan,
        hasFreeTrial: flags.hasFreeTrial,
        capabilitySnapshot: snapshotSlugs.map((featureSlug) => ({
          featureSlug,
          featureName: featureName(featureSlug),
          href: resolveFeatureDetailHref(featureSlug),
          cell: featureCell(product.slug, featureSlug),
        })),
        reviewHref: `/software/${product.slug}/`,
        compareHref: compareHrefForProduct(product.slug, allCategoryComparisons),
        visitHref:
          resolveVisitCta(product.slug, "other")?.href ??
          product.website ??
          `/software/${product.slug}/`,
        hasOfficialIndustryDemo: cardMedia.some(
          (c) =>
            c.contextKind === "industry-specific" ||
            c.contextKind === "industry-edition",
        ),
        hasOfficialIndustryMedia: cardMedia.length > 0 || industryTagged.length > 0,
        officialVideoCount: productMedia.length,
      };
    },
  );

  const compareProducts = featuredProducts.slice(0, 5);
  const compareRows = compareProducts.map((product) => ({
    slug: product.slug,
    name: product.name,
    logo: product.logo,
    pricingTeaser: pricingTeaser(product),
    pipeline: featureCell(product.slug, "pipeline-management"),
    automation: (() => {
      const workflow = featureCell(product.slug, "workflow-automation");
      if (workflow !== "unknown") return workflow;
      return featureCell(product.slug, "sales-automation");
    })(),
    reporting: featureCell(product.slug, "reporting"),
    integrations: featureCell(product.slug, "integrations"),
    positioning: productBestFor(product) ?? positioningFromSoftware(product),
  }));

  const matrixProducts = featuredProducts.slice(0, 5);
  const capabilityGroups =
    profile?.capabilityGroups?.length
      ? profile.capabilityGroups
      : [
          {
            id: "customer",
            title: "Customer & relationship management",
            featureSlugs: ["contact-management", "lead-management", "email-sync"],
          },
          {
            id: "sales",
            title: "Sales workflow",
            featureSlugs: [
              "pipeline-management",
              "deal-management",
              "workflow-automation",
            ],
          },
          {
            id: "reporting",
            title: "Reporting",
            featureSlugs: ["reporting", "forecasting"],
          },
          {
            id: "platform",
            title: "Platform",
            featureSlugs: ["integrations", "custom-fields", "mobile-app"],
          },
        ];

  const groups = capabilityGroups
    .map((group) => {
      const rows = group.featureSlugs
        .map((featureSlug) => {
          const cells = matrixProducts.map((p) =>
            featureCell(p.slug, featureSlug),
          );
          // Keep rows that have at least one researched cell.
          if (cells.every((c) => c === "unknown")) return null;
          return {
            featureSlug,
            featureName: featureName(featureSlug),
            href: resolveFeatureDetailHref(featureSlug),
            cells,
          };
        })
        .filter(Boolean) as Array<{
        featureSlug: string;
        featureName: string;
        href?: string | null;
        cells: EvidenceCell[];
      }>;
      if (rows.length === 0) return null;
      return { id: group.id, title: group.title, rows };
    })
    .filter(Boolean) as NonNullable<IndustryHubModel["capabilityMatrix"]>["groups"];

  const capabilityMatrix =
    matrixProducts.length >= 2 && groups.length > 0
      ? {
          products: matrixProducts.map((p) => ({
            slug: p.slug,
            name: p.name,
            logo: p.logo,
          })),
          groups,
        }
      : null;

  const featuredComparisonSlugs = profile?.featuredComparisonSlugs ?? [];
  const comparisonsFromFeatured = featuredComparisonSlugs
    .map((slug) => allCategoryComparisons.find((c) => c.slug === slug))
    .filter(Boolean);
  const featuredIds = new Set(comparisonsFromFeatured.map((c) => c!.slug));
  const comparisonsSource = [
    ...comparisonsFromFeatured,
    ...allCategoryComparisons.filter((c) => !featuredIds.has(c.slug)),
  ];

  const comparisons = comparisonsSource.slice(0, 6).map((comparison) => {
    const products = comparison!.productSlugs.map((slug) => {
      const product = getSoftwareBySlug(slug);
      return {
        name: product?.name ?? slug,
        slug,
        logo: product?.logo,
      };
    });
    return {
      href: `/compare/${comparison!.slug}/`,
      title: comparison!.title,
      products,
    };
  });

  const categoryGuides = getGuidesByCategory(categorySlug)
    .filter((g) => isPubliclyAvailable(g.metadata))
    .map((g) => ({
      href: `/guides/${g.slug}/`,
      title: g.title,
      summary: publicCopy(g.summary),
      topicType: g.topicType,
      readTimeMinutes: null as number | null,
    }));

  const staticGuides = [
    {
      href: "/best/crm-software/",
      title: "Best CRM Software",
      summary: "CRM shortlists and evaluation approach.",
      topicType: "best",
      readTimeMinutes: null as number | null,
    },
    {
      href: "/guides/how-to-choose-crm/",
      title: "How to choose a CRM",
      summary: "Decision framework before you shortlist vendors.",
      topicType: "selection",
      readTimeMinutes: null,
    },
    {
      href: "/use-cases/",
      title: "CRM use cases",
      summary: "Explore CRM by workflow and team scenario.",
      topicType: "use-case",
      readTimeMinutes: null,
    },
    {
      href: "/for/",
      title: "CRM by business type",
      summary: "Fit by team shape — small business, startups, enterprise.",
      topicType: "audience",
      readTimeMinutes: null,
    },
  ];

  const featuredGuideHrefs = profile?.featuredGuideHrefs ?? [];
  const guidePool = [...categoryGuides, ...staticGuides];
  const guides =
    featuredGuideHrefs.length > 0
      ? featuredGuideHrefs
          .map((href) => guidePool.find((g) => g.href === href))
          .filter(Boolean)
          .concat(
            guidePool.filter((g) => !featuredGuideHrefs.includes(g.href)),
          )
          .slice(0, 5) as IndustryHubModel["guides"]
      : guidePool.slice(0, 5);

  const allIndustries = getAllIndustriesUnfiltered().filter((ind) =>
    isPubliclyAvailable(ind.metadata),
  );
  const preferredRelated = (profile?.relatedIndustrySlugs ?? [])
    .map((slug) => getIndustryBySlug(slug, { includeUnpublished: true }))
    .filter((ind): ind is Industry => ind != null && ind.slug !== industry.slug);

  const relatedIndustries = (
    preferredRelated.length > 0
      ? [
          ...preferredRelated,
          ...allIndustries.filter(
            (ind) =>
              ind.slug !== industry.slug &&
              !preferredRelated.some((p) => p.slug === ind.slug),
          ),
        ]
      : allIndustries.filter((ind) => ind.slug !== industry.slug)
  )
    .slice(0, 6)
    .map((ind) => ({
      slug: ind.slug,
      name: ind.name,
      description: ind.shortDescription ?? null,
      href: `/industries/${ind.slug}/`,
    }));

  const lastReviewedCandidates = [
    profile?.lastReviewedAt,
    industry.metadata.updatedAt,
    industry.metadata.reviewedAt,
    industry.metadata.publishedAt,
    ...primaryProducts.map((s) => s.lastVerifiedAt),
  ].filter(Boolean) as string[];
  const lastReviewedAt = lastReviewedCandidates.sort().at(-1) ?? null;

  const priorities = (
    profile?.priorities?.length
      ? profile.priorities
      : defaultPriorities(industry.name)
  ).map((item) => {
    const capabilityHref =
      item.capabilitySlug &&
      getIndustryCapabilityProfile(industry.slug, item.capabilitySlug)
        ? `/industries/${industry.slug}/capabilities/${item.capabilitySlug}/`
        : null;
    const href = capabilityHref ?? item.href ?? null;
    // Never keep hash / self-anchor hrefs as if they were detail pages.
    const safeHref =
      href && !href.includes("#") && href.startsWith("/") ? href : undefined;
    return {
      ...item,
      href: safeHref,
    };
  });
  const useCases = (
    profile?.useCases?.length ? profile.useCases : defaultUseCases()
  ).map((item) => {
    const detailHref =
      item.useCaseSlug &&
      getIndustryUseCaseProfile(industry.slug, item.useCaseSlug)
        ? `/industries/${industry.slug}/use-cases/${item.useCaseSlug}/`
        : null;
    const href = detailHref ?? item.href ?? null;
    const safeHref =
      href && !href.includes("#") && href.startsWith("/") ? href : undefined;
    return {
      ...item,
      href: safeHref,
    };
  });
  const buyingFramework = (
    profile?.buyingFramework?.length
      ? profile.buyingFramework
      : defaultBuyingSteps()
  ).map((step) => {
    const href = step.href ?? null;
    const safeHref =
      href && !href.includes("#") && href.startsWith("/") ? href : undefined;
    return { ...step, href: safeHref };
  });
  const security = defaultSecurity();
  const securityDimensions = (
    profile?.securityDimensions?.length
      ? profile.securityDimensions
      : security.dimensions
  ).map((item) => {
    const requirementSlug =
      item.requirementSlug ??
      security.dimensions.find((d) => d.id === item.id)?.requirementSlug;
    const detailHref = requirementSlug
      ? resolveRequirementDetailHref(requirementSlug)
      : null;
    const href = detailHref ?? item.href ?? null;
    const safeHref =
      href && !href.includes("#") && href.startsWith("/") ? href : undefined;
    return {
      ...item,
      requirementSlug,
      href: safeHref,
    };
  });
  const implementationConsiderations =
    profile?.implementationConsiderations?.length
      ? profile.implementationConsiderations
      : [
          {
            id: "migration",
            title: "Data migration",
            description: "What customer and account information needs to move?",
            icon: "database",
          },
          {
            id: "integrations",
            title: "Integrations",
            description: "Which systems must connect to the CRM?",
            icon: "puzzle",
          },
          {
            id: "adoption",
            title: "User adoption",
            description: "How will teams use the CRM day-to-day?",
            icon: "users",
          },
          {
            id: "admin",
            title: "Administration",
            description: "Who owns configuration, permissions, and data quality?",
            icon: "settings",
          },
        ];
  const evaluationQuestions =
    profile?.evaluationQuestions?.length
      ? profile.evaluationQuestions
      : [
          {
            question: "How does your CRM manage account and contact relationships?",
          },
          {
            question: "What permission and access-control options are available?",
          },
          {
            question: "What reporting and forecasting capabilities are included?",
          },
          {
            question: "Which integrations are available for our existing stack?",
          },
          { question: "How is customer data exported or migrated?" },
          {
            question: "What administration is required as the team grows?",
          },
          { question: "What does implementation typically involve?" },
          {
            question: "What functionality requires higher-priced plans?",
          },
        ];

  const faq = profile?.faq?.length ? profile.faq : defaultFaq(industry.name);

  const displayTitle =
    profile?.displayTitle ?? `CRM software for ${industry.name}`;
  const badgeLabel = profile?.badgeLabel ?? industry.name;
  const tagline =
    profile?.tagline ??
    `Compare CRM platforms for ${industry.name.toLowerCase()} teams based on workflow fit, relationships, and sales process needs.`;
  const overview =
    profile?.overview ??
    industry.description ??
    industry.shortDescription ??
    `Explore CRM options for ${industry.name} using capabilities and pricing.`;
  const whatMattersIntro =
    profile?.whatMattersIntro ??
    `CRM requirements vary across ${industry.name.toLowerCase()} organizations. Evaluate workflow requirements rather than choosing only by popularity.`;

  const finderHref = profile?.finderHref ?? "/tools/crm-finder/";
  const calculatorHref =
    profile?.calculatorHref ?? "/tools/crm-cost-calculator/";
  const compareHref = profile?.compareHref ?? "/compare/";
  const catalogueHref = profile?.catalogueHref ?? `/categories/${categorySlug}/`;
  const methodologyHref =
    profile?.methodologyHref ?? COMPANY_ROUTES.methodology;

  const withEvidence = primaryProducts.filter((p) => {
    const en = loadEnrichment(p.slug);
    return (en?.featureSupport?.length ?? 0) > 0 || Boolean(p.pricingVerifiedAt);
  }).length;

  const costPreview = buildCostPreview(10);

  const productFitCards: IndustryHubProductFitCard[] = (
    profile?.productFitGuidance ?? []
  )
    .map((fit) => {
      const software = getSoftwareBySlug(fit.productSlug, {
        includeUnpublished: true,
      });
      if (!software) return null;
      return {
        slug: software.slug,
        name: software.name,
        logo: software.logo,
        why: fit.why,
        bestWhen: fit.bestWhen,
        overallScore: approvedOverallScore(software),
        reviewHref: `/software/${software.slug}/`,
        compareHref: compareHrefForProduct(
          software.slug,
          allCategoryComparisons,
        ),
      } satisfies IndustryHubProductFitCard;
    })
    .filter((c): c is IndustryHubProductFitCard => c != null);

  const navItems: IndustryHubNavItem[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    ...(profile?.challenges?.length
      ? [{ id: "challenges", label: "Challenges", icon: "alert" as const }]
      : []),
    ...(profile?.challenges?.length || profile?.outcomes?.length
      ? [{ id: "how-crm-helps", label: "How CRM helps", icon: "check" as const }]
      : []),
    { id: "what-matters", label: "What matters", icon: "features" },
    ...(profile?.capabilityNeeds?.length
      ? [{ id: "needs", label: "Must-haves", icon: "list" as const }]
      : []),
    ...(profile?.workflowSteps?.length
      ? [{ id: "workflow", label: "Workflow", icon: "workflow" as const }]
      : []),
    { id: "use-cases", label: "Use cases", icon: "use-cases" },
    ...(productFitCards.length > 0
      ? [{ id: "product-fit", label: "CRM fit", icon: "star" as const }]
      : []),
    { id: "software", label: "CRM software", icon: "star" },
    ...(seeInIndustryCards.length > 0 || screenshotFallback.length > 0
      ? [{ id: "see-in-industry", label: "See CRM in action", icon: "play" as const }]
      : []),
    { id: "compare", label: "Compare", icon: "comparisons" },
    { id: "finder", label: "Finder", icon: "tools" },
    ...(capabilityMatrix
      ? [{ id: "capabilities", label: "Capabilities", icon: "puzzle" as const }]
      : []),
    { id: "costs", label: "Costs", icon: "pricing" },
    { id: "how-to-choose", label: "How to choose", icon: "choose" },
    ...(customerStories.length > 0
      ? [
          {
            id: "real-world-examples",
            label: "Real-world examples",
            icon: "play" as const,
          },
        ]
      : []),
    ...(seeInIndustryCards.length === 0 && screenshotFallback.length > 0
      ? [{ id: "industry-evidence", label: "Evidence", icon: "evidence" as const }]
      : []),
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  const stats: IndustryHubModel["stats"] = [
    {
      label: `${primaryProducts.length} catalogue CRM ${
        primaryProducts.length === 1 ? "product" : "products"
      }`,
      icon: "products",
    },
    ...(lastReviewedAt
      ? [
          {
            label: `Updated ${lastReviewedAt.slice(0, 10)}`,
            icon: "updated" as const,
          },
        ]
      : []),
    {
      label: "Independent editorial process",
      icon: "independent",
      href: LEGAL_ROUTES.editorialIndependence,
    },
  ];

  // When see-in already shows official videos, skip a second evidence explorer
  // that would embed the same players again (large RSC payload + hydration).
  const evidenceExplorer =
    seeInIndustryCards.length === 0 && screenshotFallback.length > 0
      ? buildIndustryEvidenceExplorer({
          industryName: industry.name,
          industrySlug: industry.slug,
          products: featuredProducts.map((p) => ({
            slug: p.slug,
            name: p.name,
            logo: p.logo,
          })),
          buyerQuestions: (profile?.priorities ?? []).map((p) => ({
            id: p.id,
            name: p.title,
          })),
          useCases: (profile?.useCases ?? []).map((u) => ({
            id: u.useCaseSlug ?? u.id,
            name: u.title,
          })),
          capabilities: capabilityIds.map((id) => ({
            id,
            name: featureName(id),
          })),
          requirements: [
            ...new Set(
              (profile?.securityDimensions ?? [])
                .map((d) => d.requirementSlug)
                .filter((s): s is string => Boolean(s)),
            ),
          ].map((id) => ({ id, name: featureName(id) })),
          screenshots: screenshotFallback,
          videos: [],
        })
      : null;

  const useCaseLinks = (profile?.useCases ?? [])
    .map((u) => {
      const slug = u.useCaseSlug;
      if (!slug) return null;
      return {
        id: slug,
        label: u.title,
        href: `/industries/${industry.slug}/use-cases/${slug}/`,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const capabilityLinks = (profile?.priorities ?? [])
    .map((p) => {
      const slug = p.capabilitySlug;
      if (!slug) return null;
      return {
        id: slug,
        label: p.title,
        href: `/industries/${industry.slug}/capabilities/${slug}/`,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const requirementLinks = (() => {
    const seen = new Set<string>();
    const links: Array<{ id: string; label: string; href: string | null }> = [];
    for (const d of profile?.securityDimensions ?? []) {
      const slug = d.requirementSlug;
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      links.push({
        id: slug,
        label: d.title,
        href: resolveRequirementDetailHref(slug),
      });
    }
    return links;
  })();

  const assessmentTargets = selectProductIndustryAssessmentTargets({
    products: featuredProducts.map((p) => {
      const enrichment = loadEnrichment(p.slug);
      const featureSlugs = [
        ...new Set([
          ...(profile?.snapshotFeatureSlugs ?? []),
          ...capabilityIds,
        ]),
      ];
      const featureEvidenceCount = (enrichment?.featureSupport ?? []).filter(
        (f) =>
          featureSlugs.includes(f.featureSlug) &&
          (f.sourceIds?.length ?? 0) > 0,
      ).length;
      return {
        slug: p.slug,
        name: p.name,
        overallScore: approvedOverallScore(p),
        featureEvidenceCount,
      };
    }),
    mediaByProduct,
    limit: 3,
  });

  const productIndustryAssessments: ProductIndustryAssessment[] =
    assessmentTargets.map((slug) => {
      const product = featuredProducts.find((p) => p.slug === slug)!;
      const card = productCards.find((p) => p.slug === slug);
      const enrichment = loadEnrichment(slug);
      const featureSlugs = [
        ...new Set([
          ...(profile?.snapshotFeatureSlugs ?? []),
          ...capabilityIds,
        ]),
      ];
      const featureEvidenceCount = (enrichment?.featureSupport ?? []).filter(
        (f) =>
          featureSlugs.includes(f.featureSlug) &&
          (f.sourceIds?.length ?? 0) > 0,
      ).length;

      // Demos live in #see-in-industry once — assessments stay text-led to avoid
      // embedding the same OfficialProductVideo N extra times per page.
      const evidenceHref =
        seeInIndustryCards.length > 0 || screenshotFallback.length > 0
          ? "#see-in-industry"
          : "#software";

      return buildProductIndustryAssessment({
        productSlug: product.slug,
        productName: product.name,
        logo: product.logo,
        industrySlug: industry.slug,
        industryLabel: badgeLabel,
        overallScore: approvedOverallScore(product),
        positioning: card?.positioning ?? null,
        bestFor: card?.bestFor ?? null,
        reviewHref: `/software/${product.slug}/`,
        compareHref:
          card?.compareHref ??
          compareHrefForProduct(product.slug, allCategoryComparisons),
        evidenceHref,
        useCases: useCaseLinks.slice(0, 4),
        capabilities: capabilityLinks.slice(0, 5),
        requirements: requirementLinks.slice(0, 5),
        mediaCard: null,
        featureEvidenceCount,
        screenshotCount: enrichment?.screenshots?.length ?? 0,
        documentationHintCount: featureEvidenceCount,
      });
    });

  // Side-by-side compare reused the first two see-in cards — omit to avoid
  // duplicate players (see-in section is the canonical demo surface).
  const workflowCompare: IndustryHubModel["workflowCompare"] = null;

  return {
    industry,
    profile,
    maturity,
    confidenceMessage: confidenceMessage(maturity, industry.name),
    showIndustryRankings,
    displayTitle,
    badgeLabel,
    tagline,
    overview,
    whoThisIsFor: profile?.whoThisIsFor ?? null,
    whatMattersIntro,
    workedExample: profile?.workedExample ?? null,
    workedExampleSecondary: profile?.workedExampleSecondary ?? null,
    categorySlug,
    shortLabel,
    finderHref,
    calculatorHref,
    compareHref,
    catalogueHref,
    methodologyHref,
    glance: {
      primaryGoal: profile?.glance?.primaryGoal ?? null,
      commonPriorities: profile?.glance?.commonPriorities ?? [],
      teamTypes: profile?.glance?.teamTypes ?? [],
      researchedProductCount: primaryProducts.length,
      lastReviewedAt,
    },
    challenges: profile?.challenges ?? [],
    outcomes: profile?.outcomes ?? [],
    capabilityNeeds: profile?.capabilityNeeds ?? [],
    workflowSteps: profile?.workflowSteps ?? [],
    workflowExperience,
    heroVisual: profile?.heroVisual,
    needsVisual: profile?.needsVisual,
    workflowVisual: profile?.workflowVisual,
    priorities,
    useCases,
    productFitCards,
    productCards,
    compareRows,
    capabilityMatrix,
    costPreview,
    buyingFramework,
    buyingGuideHref: profile?.buyingGuideHref ?? "/guides/how-to-choose-crm/",
    implementationConsiderations,
    evaluationQuestions,
    securityDimensions,
    securityDisclaimer:
      profile?.securityDisclaimer ?? security.disclaimer,
    comparisons,
    guides,
    relatedIndustries,
    faq,
    researchPanel: {
      lastRefresh: lastReviewedAt,
      evidenceCoverageLabel:
        primaryProducts.length > 0
          ? `${withEvidence} of ${primaryProducts.length} CRM products have feature or pricing evidence on record`
          : null,
      researchedProductCount: primaryProducts.length,
    },
    navItems,
    stats,
    seeInIndustryCards,
    customerStories,
    productIndustryAssessments,
    productIndustrySpotlights: productIndustryAssessments,
    workflowCompare,
    evidenceExplorer,
    screenshotFallback:
      seeInIndustryCards.length === 0 ? screenshotFallback : [],
    visualEvidenceCounts: {
      ...visualCounts,
      screenshots: screenshotFallback.length,
    },
    methodologyNote:
      "Official vendor videos illustrate industry workflow context. They do not change product rankings, industry fit, regulatory compliance conclusions, or pricing assessments. Vendor-published customer stories are not independent proof of typical outcomes.",
  };
});
