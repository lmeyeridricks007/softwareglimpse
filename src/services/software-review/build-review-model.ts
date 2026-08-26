import type {
  Category,
  CurrencyCode,
  Methodology,
  Pricing,
  PricingPlan,
  ProductEditorialAssessment,
  ProductMedia,
  ProductResearchEnrichment,
  ProductReview,
  ProductScreenshot,
  ResearchSource,
  Software,
  UseCase,
} from "@/domain";
import { formatMoney, fromMajor } from "@/domain";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
  categoryFinderCtaLabel,
  categorySharedToolHref,
} from "@/data/config/tools/category-tool-meta";
import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategories,
  getUseCases,
} from "@/data";
import {
  getGuidesByProduct,
} from "@/data/repositories/guides";
import {
  getMethodologyBySlug,
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { selectProductVideos } from "@/services/product-media";
import { selectImplementationContextVideos } from "@/services/product-media/context-tab-media";
import {
  buildEvidenceCenterModel,
  type EvidenceCenterModel,
} from "@/services/software-review/evidence-center";
import {
  resolveAlternativeSlugs,
  resolveCompetitorSlugs,
} from "@/services/graph/resolve-relationships";
import { getSoftwareLinkGroups, publicAlternativesHref } from "@/services/relationships/software-links";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import { scoreLabel } from "@/services/editorial/score-labels";
import {
  buildDeepReviewLayer,
  type DeepReviewLayer,
} from "./build-deep-review";

const featureNameBySlug = new Map(
  canonicalFeaturesSeed.map((f) => [f.slug, f.name]),
);
const featureDescBySlug = new Map(
  canonicalFeaturesSeed.map((f) => [f.slug, f.description]),
);

export type ReviewPublicationState =
  | "draft"
  | "researching"
  | "provisional"
  | "editorial-review"
  | "published"
  | "stale";

export type ReviewNavItem = {
  id: string;
  label: string;
  icon?: string;
};

export type ReviewQuickFact = {
  label: string;
  value: string;
  icon?: "price" | "free" | "trial" | "deploy" | "best" | "size" | "company";
};

export type ReviewCriterion = {
  criterionSlug: string;
  name: string;
  score: number | null;
  rationale: string | null;
  showScore: boolean;
};

export type ReviewFeatureCard = {
  slug: string;
  name: string;
  description: string | null;
  availability: string;
  availabilityLabel: string;
  planLabel: string | null;
  editorialNote: string | null;
};

export type ReviewFeatureRow = {
  slug: string;
  name: string;
  available: "yes" | "limited" | "no" | "unknown";
  planLabel: string | null;
  take: string | null;
};

export type ReviewCompetitorCard = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  shortDescription: string | null;
  compareHref: string | null;
  reviewHref: string;
};

export type ReviewPricingCompareRow = {
  label: string;
  values: Array<string | null>;
};

export type ReviewUseCaseCard = {
  slug: string;
  name: string;
  description: string | null;
  href: string;
};

export type ReviewGuideCard = {
  href: string;
  title: string;
  summary: string | null;
  topicType: string;
  /** Guide hero art for cards — unique per guide when present. */
  image?: { src: string; alt: string } | null;
};

export type ReviewFaqItem = {
  question: string;
  answer: string;
};

export type SoftwareReviewModel = {
  software: Software;
  enrichment: ProductResearchEnrichment | null;
  assessment: ProductEditorialAssessment | null;
  review: ProductReview | null;
  methodology: Methodology | null;
  primaryCategory: Category | null;
  secondaryCategories: Category[];
  publicationState: ReviewPublicationState;
  scoresApproved: boolean;
  showPendingScoreCard: boolean;
  displayName: string;
  h1: string;
  tagline: string | null;
  categoryBadge: string | null;
  categoryChips: Array<{ name: string; href: string }>;
  overallScore: number | null;
  scoreLabelText: string | null;
  bestForPrimary: string | null;
  criteria: ReviewCriterion[];
  pendingCriteriaNames: string[];
  quickFacts: ReviewQuickFact[];
  heroFacts: ReviewQuickFact[];
  screenshots: ProductScreenshot[];
  /** Public-eligible official vendor videos for hub placements. */
  media: ProductMedia[];
  overviewVideos: ProductMedia[];
  featureVideos: ProductMedia[];
  evidenceVideos: ProductMedia[];
  implementationVideos: ProductMedia[];
  verdict: string | null;
  bottomLine: string | null;
  bestFor: string[];
  notIdealFor: string[];
  pros: string[];
  cons: string[];
  whyWeLike: string[];
  pullQuote: string | null;
  whyWeLikeSections: Array<{ id: string; heading: string; body: string }>;
  features: ReviewFeatureCard[];
  featureRows: ReviewFeatureRow[];
  pricing: Pricing | null;
  pricingNotes: string | null;
  pricingVerifiedAt: string | null;
  pricingPageHref: string | null;
  costCalculatorHref: string | null;
  planSelectorHref: string | null;
  highlightedPlanSlug: string | null;
  pricingCompareColumns: Array<{
    slug: string;
    name: string;
    isSubject: boolean;
  }>;
  pricingCompareRows: ReviewPricingCompareRow[];
  useCases: ReviewUseCaseCard[];
  notBestIf: string[];
  competitors: ReviewCompetitorCard[];
  comparisonLinks: Array<{ href: string; label: string }>;
  alternativesHref: string | null;
  integrations: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  thingsToKnow: Array<{ title: string; body: string }>;
  finderHref: string | null;
  finderLabel: string;
  research: {
    lastChecked: string | null;
    sourceCount: number;
    pricingChecked: string | null;
    featuresChecked: string | null;
    editorialStatus: string;
    methodologyVersion: string | null;
    methodologyHref: string;
    handsOnTesting: boolean;
    fixtureBased: boolean;
  };
  sources: Array<{
    id: string;
    title: string;
    url: string | null;
    checkedAt: string | null;
    kindLabel: string | null;
    sourceType: string | null;
  }>;
  evidenceCenter: EvidenceCenterModel;
  guides: ReviewGuideCard[];
  faq: ReviewFaqItem[];
  navItems: ReviewNavItem[];
  lastUpdated: string | null;
  deepReview: DeepReviewLayer;
};

function availabilityLabel(availability: string): string {
  switch (availability) {
    case "supported":
      return "Supported";
    case "limited":
      return "Limited";
    case "add-on":
      return "Add-on";
    case "higher-plan-only":
      return "Higher plan";
    case "not-supported":
      return "Not supported";
    default:
      return "Unknown";
  }
}

function availabilityFlag(
  availability: string,
): ReviewFeatureRow["available"] {
  if (availability === "supported") return "yes";
  if (availability === "limited" || availability === "add-on") return "limited";
  if (availability === "not-supported") return "no";
  return "unknown";
}

function publicList(items: string[] | undefined | null): string[] {
  return (items ?? [])
    .map((item) => publicCopy(item))
    .filter((item): item is string => Boolean(item));
}

function resolvePublicationState(input: {
  researchIncomplete: boolean;
  assessment: ProductEditorialAssessment | null;
  review: ProductReview | null;
  scoresApproved: boolean;
}): ReviewPublicationState {
  if (input.scoresApproved && input.review?.editorialStatus === "approved") {
    if (input.review.refreshNeeded) return "stale";
    return "published";
  }
  if (input.assessment?.status === "review-required") return "editorial-review";
  if (
    input.assessment?.status === "assessment-in-progress" ||
    input.review?.editorialStatus === "assessment-in-progress"
  ) {
    return "provisional";
  }
  if (input.researchIncomplete) return "researching";
  if (input.assessment || input.review) return "provisional";
  return "draft";
}

function planLabelFromSlugs(planSlugs: string[]): string | null {
  if (planSlugs.length === 0) return null;
  return planSlugs
    .map((slug) => slug.replace(/-/g, " "))
    .map((label) => label.charAt(0).toUpperCase() + label.slice(1))
    .join(", ");
}

function isQuoteOnlyPricing(pricing: Pricing): boolean {
  if (pricing.startingPriceMonthly != null) return false;
  if (pricing.model === "custom" || pricing.model === "custom-quote") return true;
  if (pricing.plans.length === 0) return false;
  return pricing.plans.every(
    (plan) => plan.contactSales || plan.rules.length === 0,
  );
}

function startingPriceLabel(pricing: Pricing | null): string | null {
  if (!pricing) return null;
  if (pricing.startingPriceMonthly != null) {
    const currency = (pricing.currency ?? "USD") as CurrencyCode;
    return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/month`;
  }
  if (isQuoteOnlyPricing(pricing)) return "Custom quote";
  return null;
}

function companySizeLabel(software: Software): string | null {
  if (software.businessSizeSlugs.length === 0) return null;
  const labels = software.businessSizeSlugs.map((slug) => {
    if (slug === "micro") return "Micro";
    if (slug === "small-business") return "SMB";
    if (slug === "mid-market") return "Mid-market";
    if (slug === "enterprise") return "Enterprise";
    return slug.replace(/-/g, " ");
  });
  return labels.join(" → ");
}

function compareHrefForPair(
  subjectSlug: string,
  otherSlug: string,
): string | null {
  const hit = getAllComparisonsUnfiltered().find((c) => {
    const set = new Set(c.productSlugs);
    return set.has(subjectSlug) && set.has(otherSlug);
  });
  return hit ? `/compare/${hit.slug}/` : null;
}

function alternativesCatalogueHref(productSlug: string): string | null {
  return publicAlternativesHref(productSlug);
}

function defaultFaq(input: {
  name: string;
  tagline: string | null;
  pricingLabel: string | null;
  hasFreePlan: boolean | null;
  bestFor: string[];
  competitors: ReviewCompetitorCard[];
}): ReviewFaqItem[] {
  const items: ReviewFaqItem[] = [];
  if (input.tagline) {
    items.push({
      question: `What is ${input.name}?`,
      answer: input.tagline,
    });
  }
  if (input.pricingLabel) {
    items.push({
      question: `How much does ${input.name} cost?`,
      answer: `${input.name} starts at ${input.pricingLabel} based on researched list pricing. Confirm current rates on the vendor site before buying.`,
    });
  }
  if (input.hasFreePlan != null) {
    items.push({
      question: `Does ${input.name} have a free plan?`,
      answer: input.hasFreePlan
        ? `Yes — researched product data indicates a free plan is available.`
        : `No free plan is indicated in our researched pricing data.`,
    });
  }
  if (input.bestFor[0]) {
    items.push({
      question: `What is ${input.name} best for?`,
      answer: `${input.name} is a strong fit for ${input.bestFor[0]}.`,
    });
  }
  if (input.competitors.length > 0) {
    items.push({
      question: `What are the best ${input.name} alternatives?`,
      answer: `Common alternatives include ${input.competitors
        .slice(0, 4)
        .map((c) => c.name)
        .join(", ")}. Compare side by side before deciding.`,
    });
  }
  return items;
}

function sanitizeSourceTitle(title: string): string | null {
  return publicCopy(title.replace(/\bfixture\b/gi, "product research"));
}

function sourceKindLabel(sourceType: string): string | null {
  if (sourceType === "fixture") return "Product research";
  if (sourceType === "vendor") return "Vendor source";
  if (sourceType === "docs") return "Documentation";
  if (sourceType === "pricing") return "Pricing source";
  return null;
}

export function buildSoftwareReviewModel(
  software: Software,
): SoftwareReviewModel {
  const enrichment = loadEnrichment(software.slug);
  const researchSources = loadManualSources(software.slug);
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const methodology = assessment?.methodologySlug
    ? getMethodologyBySlug(assessment.methodologySlug)
    : review?.methodologySlug
      ? getMethodologyBySlug(review.methodologySlug)
      : null;

  const categories = getCategories({ includeUnpublished: true });
  const primaryCategory =
    categories.find((c) => c.slug === software.primaryCategorySlug) ?? null;
  const secondaryCategories = software.secondaryCategorySlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c))
    .slice(0, 2);

  const pricing = (software.pricing ||
    (enrichment?.pricing as Pricing | undefined) ||
    null) as Pricing | null;

  const assessmentApproved = assessment?.status === "approved";
  const scoresApproved =
    assessmentApproved &&
    review?.editorialStatus === "approved" &&
    typeof (review.overallScore ?? assessment?.overallScore) === "number";

  const researchIncomplete =
    (!software.metadata.researchStatus ||
      software.metadata.researchStatus === "none") &&
    !enrichment;

  const publicationState = resolvePublicationState({
    researchIncomplete,
    assessment,
    review,
    scoresApproved,
  });

  const tagline = firstPublicCopy([
    review?.summary,
    review?.intro,
    enrichment?.shortDescription,
    software.shortDescription,
    software.description,
    enrichment?.vendorPositioning?.[0]?.claim,
  ]);

  const bestFor = publicList(
    review?.bestFor?.length
      ? review.bestFor
      : assessment?.bestFor?.length
        ? assessment.bestFor
        : software.bestFor,
  );
  const notIdealFor = publicList(
    review?.notIdealFor?.length
      ? review.notIdealFor
      : assessment?.notIdealFor?.length
        ? assessment.notIdealFor
        : software.notIdealFor,
  );

  const pros = publicList(
    review?.pros?.length
      ? review.pros
      : assessment?.strengths?.length
        ? assessment.strengths
        : software.pros,
  );
  const cons = publicList(
    review?.cons?.length
      ? review.cons
      : assessment?.weaknesses?.length
        ? assessment.weaknesses
        : software.cons,
  );

  const verdict = firstPublicCopy([
    review?.verdict,
    assessment?.verdict,
    software.verdict,
    assessment?.recommendation,
  ]);

  const bottomLine = firstPublicCopy([
    review?.pricingSummary,
    assessment?.recommendation,
  ]);

  const whyWeLikeSections = (review?.sections ?? [])
    .map((section) => {
      const body = publicCopy(section.body);
      const heading = publicCopy(section.heading);
      if (!body || !heading) return null;
      return { id: section.id, heading, body };
    })
    .filter(Boolean) as Array<{ id: string; heading: string; body: string }>;

  const whyWeLike = whyWeLikeSections.map((s) => s.body);
  if (whyWeLike.length === 0) {
    const intro = publicCopy(review?.intro);
    if (intro) whyWeLike.push(intro);
  }

  const criterionSource = review?.criterionAssessments?.length
    ? review.criterionAssessments
    : (assessment?.criterionAssessments ?? []);

  const criteria: ReviewCriterion[] = criterionSource.map((item) => {
    const criterion = methodology?.criteria.find(
      (c) => c.slug === item.criterionSlug,
    );
    return {
      criterionSlug: item.criterionSlug,
      name: criterion?.name ?? item.criterionSlug.replace(/-/g, " "),
      score: typeof item.score === "number" ? item.score : null,
      rationale: publicCopy(item.rationale),
      showScore: scoresApproved && typeof item.score === "number",
    };
  });

  const pendingCriteriaNames = scoresApproved
    ? []
    : criteria.length > 0
      ? criteria.map((c) => c.name)
      : (methodology?.criteria
          .slice()
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((c) => c.name) ?? []);

  const featureSupport = enrichment?.featureSupport ?? [];
  const features: ReviewFeatureCard[] = featureSupport.map((f) => ({
    slug: f.featureSlug,
    name:
      featureNameBySlug.get(f.featureSlug) ??
      f.featureSlug.replace(/-/g, " "),
    description:
      publicCopy(f.notes) ?? featureDescBySlug.get(f.featureSlug) ?? null,
    availability: f.availability,
    availabilityLabel: availabilityLabel(f.availability),
    planLabel: planLabelFromSlugs(f.planSlugs),
    editorialNote: publicCopy(f.notes),
  }));

  const featureRows: ReviewFeatureRow[] = features.map((f) => ({
    slug: f.slug,
    name: f.name,
    available: availabilityFlag(f.availability),
    planLabel: f.planLabel,
    take: f.editorialNote,
  }));

  const useCases: ReviewUseCaseCard[] = getUseCases()
    .filter((uc: UseCase) => software.useCaseSlugs.includes(uc.slug))
    .map((uc) => ({
      slug: uc.slug,
      name: uc.name,
      description: publicCopy(uc.shortDescription ?? uc.description),
      href: `/use-cases/${uc.slug}/`,
    }));

  const allSoftware = getAllSoftwareUnfiltered();
  const relatedSlugs = [
    ...new Set([
      ...resolveCompetitorSlugs(software.slug),
      ...resolveAlternativeSlugs(software.slug),
      ...software.competitorSlugs,
      ...software.alternativeSlugs,
    ]),
  ].filter((slug) => slug !== software.slug);

  const competitors: ReviewCompetitorCard[] = relatedSlugs
    .map((slug) => allSoftware.find((item) => item.slug === slug))
    .filter((item): item is Software => Boolean(item))
    .slice(0, 6)
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      logo: item.logo,
      shortDescription: publicCopy(item.shortDescription),
      compareHref: compareHrefForPair(software.slug, item.slug),
      reviewHref: `/software/${item.slug}/`,
    }));

  const linkGroups = getSoftwareLinkGroups(software);
  const comparisonLinks = linkGroups.comparisons.map((l) => ({
    href: l.href,
    label: l.label,
  }));

  const guidesFromLinks = linkGroups.guides.map((g) => ({
    href: g.href,
    title: g.label,
    summary: null as string | null,
    topicType: "guide",
    image: null as { src: string; alt: string } | null,
  }));
  const guidesFromProduct = getGuidesByProduct(software.slug).map((g) => ({
    href: `/guides/${g.slug}/`,
    title: g.title,
    summary: publicCopy(g.summary ?? g.seo.description),
    topicType: g.topicType ?? "guide",
    image: g.heroVisual
      ? { src: g.heroVisual.src, alt: g.heroVisual.alt }
      : null,
  }));
  const guideMap = new Map<string, ReviewGuideCard>();
  for (const g of [...guidesFromProduct, ...guidesFromLinks]) {
    if (!guideMap.has(g.href)) guideMap.set(g.href, g);
  }
  const guides = [...guideMap.values()]
    .sort((a, b) => {
      const order = [
        "setup",
        "implementation",
        "migration",
        "pricing-education",
        "selection",
      ];
      const ai = order.indexOf(a.topicType);
      const bi = order.indexOf(b.topicType);
      const ar = ai === -1 ? 99 : ai;
      const br = bi === -1 ? 99 : bi;
      if (ar !== br) return ar - br;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 12);

  const integrations = (enrichment?.integrationSupport ?? [])
    .map((item) => {
      const brand = allSoftware.find((s) => s.slug === item.integrationSlug);
      const knownLogos: Record<string, string> = {
        slack: "/brands/slack.png",
        zapier: "/brands/zapier.png",
        "microsoft-365": "/brands/microsoft-365.png",
        "google-workspace": "/brands/google-workspace.png",
        quickbooks: "/brands/quickbooks.png",
      };
      const logoSrc = brand?.logo?.src ?? knownLogos[item.integrationSlug];
      return {
        slug: item.integrationSlug,
        name:
          brand?.name ??
          item.integrationSlug
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" "),
        logo: logoSrc
          ? { src: logoSrc, alt: `${item.integrationSlug} logo` }
          : null,
      };
    })
    .slice(0, 12);

  const thingsToKnow: Array<{ title: string; body: string }> = [];
  for (const limitation of enrichment?.limitations ?? []) {
    const body = publicCopy(limitation.description);
    if (!body) continue;
    thingsToKnow.push({
      title: limitation.kind.replace(/-/g, " "),
      body,
    });
  }
  if (software.deploymentModels.length > 0) {
    thingsToKnow.push({
      title: "Deployment",
      body: `Available as ${software.deploymentModels
        .map((m) => m.replace(/-/g, " "))
        .join(", ")}.`,
    });
  }
  if (software.platforms.length > 0) {
    thingsToKnow.push({
      title: "Platforms",
      body: `Supports ${software.platforms.join(", ")}.`,
    });
  }

  const hasPricingPage = listCrmPricingSnapshots().some(
    (item) => item.productSlug === software.slug,
  );
  const pricingPageHref = hasPricingPage
    ? `/pricing/${software.slug}/`
    : pricing
      ? "#pricing"
      : null;

  const costCalculatorHref = categoryDecisionCostHref(
    software.primaryCategorySlug,
  );

  const planSelectorBase = categorySharedToolHref(
    software.primaryCategorySlug,
    "plan-selector",
  );
  const planSelectorHref =
    software.primaryCategorySlug === "crm" && planSelectorBase
      ? `${planSelectorBase}?vendor=${encodeURIComponent(software.slug)}`
      : planSelectorBase;

  const finderHref =
    categoryDecisionFinderHref(software.primaryCategorySlug) ?? null;
  const finderLabel = categoryFinderCtaLabel(software.primaryCategorySlug);

  const compareColumns = [
    { slug: software.slug, name: software.name, isSubject: true },
    ...competitors.slice(0, 4).map((c) => ({
      slug: c.slug,
      name: c.name,
      isSubject: false,
    })),
  ];

  const pricingForSlug = (slug: string): Pricing | null => {
    if (slug === software.slug) return pricing;
    const other = allSoftware.find((s) => s.slug === slug);
    if (!other) return null;
    const otherEnrichment = loadEnrichment(slug);
    return (other.pricing ||
      (otherEnrichment?.pricing as Pricing | undefined) ||
      null) as Pricing | null;
  };

  const pricingCompareRows: ReviewPricingCompareRow[] = [
    {
      label: "Starting price",
      values: compareColumns.map((col) =>
        startingPriceLabel(pricingForSlug(col.slug)),
      ),
    },
    {
      label: "Free plan",
      values: compareColumns.map((col) => {
        const p = pricingForSlug(col.slug);
        if (!p || p.hasFreePlan == null) return null;
        return p.hasFreePlan ? "Yes" : "No";
      }),
    },
    {
      label: "Free trial",
      values: compareColumns.map((col) => {
        const p = pricingForSlug(col.slug);
        if (!p || p.hasFreeTrial == null) return null;
        return p.hasFreeTrial ? "Yes" : "No";
      }),
    },
  ];

  const priceLabel = startingPriceLabel(pricing);
  const trialDays =
    pricing?.plans.find((plan) => typeof plan.trialDays === "number")
      ?.trialDays ?? null;
  const freeTrialLabel =
    pricing?.hasFreeTrial == null
      ? null
      : pricing.hasFreeTrial
        ? trialDays
          ? `${trialDays} days`
          : "Yes"
        : "No";

  const heroFacts: ReviewQuickFact[] = [
    priceLabel
      ? { label: "Starting price", value: priceLabel, icon: "price" }
      : null,
    pricing?.hasFreePlan != null
      ? {
          label: "Free plan",
          value: pricing.hasFreePlan ? "Yes" : "No",
          icon: "free",
        }
      : null,
    freeTrialLabel
      ? {
          label: "Free trial",
          value: freeTrialLabel,
          icon: "trial",
        }
      : null,
    bestFor[0] ? { label: "Best for", value: bestFor[0], icon: "best" } : null,
    software.deploymentModels[0]
      ? {
          label: "Deployment",
          value: software.deploymentModels[0].replace(/-/g, " "),
          icon: "deploy",
        }
      : null,
    companySizeLabel(software)
      ? {
          label: "Company size",
          value: companySizeLabel(software)!,
          icon: "size",
        }
      : null,
  ].filter(Boolean) as ReviewQuickFact[];

  const quickFacts: ReviewQuickFact[] = [
    ...heroFacts,
    software.company
      ? { label: "Company", value: software.company, icon: "company" }
      : null,
  ].filter(Boolean) as ReviewQuickFact[];

  const sources = researchSources
    .filter((s: ResearchSource) => s.status !== "rejected" && Boolean(s.title))
    .map((s) => ({
      id: s.id,
      title: sanitizeSourceTitle(s.title!) ?? "Product research source",
      url: s.url ?? null,
      checkedAt: s.lastCheckedAt ?? s.verifiedAt ?? s.retrievedAt ?? null,
      kindLabel: sourceKindLabel(s.sourceType),
      sourceType: s.sourceType,
    }));

  const faqFromReview = (review?.faq ?? [])
    .map((item) => {
      const question = publicCopy(item.question);
      const answer = publicCopy(item.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean) as ReviewFaqItem[];

  const faq =
    faqFromReview.length > 0
      ? faqFromReview
      : defaultFaq({
          name: software.name,
          tagline,
          pricingLabel: priceLabel,
          hasFreePlan: pricing?.hasFreePlan ?? null,
          bestFor,
          competitors,
        });

  const screenshots = enrichment?.screenshots ?? [];
  const media = enrichment?.media ?? [];
  const overviewVideos = selectProductVideos(media, {
    placement: "overview",
    preferSpecific: false,
    limit: 1,
  });
  const featureVideos = selectProductVideos(media, {
    placement: "features",
    preferSpecific: true,
    limit: 2,
    excludeIds: overviewVideos.map((v) => v.id),
  });
  const evidenceVideos = selectProductVideos(media, {
    placement: "evidence",
    preferSpecific: false,
    limit: 6,
  });
  const implementationVideos = selectImplementationContextVideos({
    media,
    overviewVideoIds: overviewVideos.map((v) => v.id),
    limit: 2,
  });

  const evidenceCenter = buildEvidenceCenterModel({
    sources,
    researchSources,
    screenshots,
    media,
    featureSupport: enrichment?.featureSupport ?? [],
    pricingPlanCount: pricing?.plans.length ?? 0,
    pricingVerifiedAt:
      software.pricingVerifiedAt ??
      enrichment?.domainCheckedAt?.pricing ??
      null,
    handsOnTesting: Boolean(
      assessment?.handsOnTesting || review?.handsOnTesting,
    ),
  });

  const categoryBadge = primaryCategory
    ? `${primaryCategory.name.replace(/ software$/i, "").toUpperCase()} SOFTWARE`
    : null;

  const categoryChips = [
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            href: `/categories/${primaryCategory.path.join("/")}/`,
          },
        ]
      : []),
    ...secondaryCategories.map((c) => ({
      name: c.name,
      href: `/categories/${c.path.join("/")}/`,
    })),
  ];

  const overallScore = scoresApproved
    ? ((review?.overallScore ?? assessment?.overallScore) as number)
    : null;

  const deepReview = buildDeepReviewLayer({
    software,
    enrichment,
    assessment,
    review,
    methodology,
    pricing,
    scoresApproved,
    bestFor,
    notIdealFor,
    pros,
  });

  const navItems: ReviewNavItem[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    ...(deepReview.detailedSections.length || deepReview.productExperience
      ? [{ id: "review", label: "Review", icon: "features" as const }]
      : []),
    ...(features.length
      ? [{ id: "features", label: "Features", icon: "features" as const }]
      : []),
    ...(pricing
      ? [{ id: "pricing", label: "Pricing", icon: "pricing" as const }]
      : []),
    ...(guides.length
      ? [{ id: "guides", label: "Guides", icon: "guides" as const }]
      : []),
    ...(useCases.length
      ? [{ id: "use-cases", label: "Use Cases", icon: "use-cases" as const }]
      : []),
    ...(competitors.length || deepReview.competitorDeepDives.length
      ? [
          {
            id: "alternatives",
            label: "Alternatives",
            icon: "alternatives" as const,
          },
        ]
      : []),
    { id: "evidence", label: "Evidence", icon: "methodology" },
    ...(methodology
      ? [
          {
            id: "methodology",
            label: "Methodology",
            icon: "methodology" as const,
          },
        ]
      : []),
    ...(faq.length ? [{ id: "faq", label: "FAQ", icon: "faq" as const }] : []),
  ];

  const highlightedPlanSlug =
    pricing?.plans?.find((p: PricingPlan) => p.highlighted)?.slug ?? null;

  const lastUpdated =
    [
      review?.lastUpdatedAt,
      assessment?.updatedAt,
      enrichment?.updatedAt,
      software.lastVerifiedAt,
    ]
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  const pullQuoteCandidate = whyWeLikeSections[0]?.body
    ? publicCopy(whyWeLikeSections[0].body)
    : null;

  const mergedWhyWeLike =
    whyWeLike.length > 0 ? whyWeLike : deepReview.whyWeLike;
  const mergedPullQuote =
    pullQuoteCandidate && pullQuoteCandidate.length <= 220
      ? pullQuoteCandidate
      : deepReview.keyTakeaway && deepReview.keyTakeaway.length <= 220
        ? deepReview.keyTakeaway
        : null;

  return {
    software,
    enrichment,
    assessment,
    review,
    methodology,
    primaryCategory,
    secondaryCategories,
    publicationState,
    scoresApproved,
    showPendingScoreCard: Boolean(assessment || review) && !scoresApproved,
    displayName: software.name,
    h1: publicCopy(review?.h1) ?? `${software.name} Review`,
    tagline,
    categoryBadge,
    categoryChips,
    overallScore,
    scoreLabelText: overallScore != null ? scoreLabel(overallScore) : null,
    bestForPrimary: bestFor[0] ?? null,
    criteria,
    pendingCriteriaNames,
    quickFacts,
    heroFacts,
    screenshots,
    media,
    overviewVideos,
    featureVideos,
    evidenceVideos,
    implementationVideos,
    verdict,
    bottomLine,
    bestFor,
    notIdealFor,
    pros,
    cons,
    whyWeLike: mergedWhyWeLike,
    pullQuote: mergedPullQuote,
    whyWeLikeSections,
    features,
    featureRows,
    pricing,
    pricingNotes:
      publicCopy(pricing?.notes) ??
      (pricing
        ? "Prices reflect researched list pricing. Confirm current rates on the vendor site before buying."
        : null),
    pricingVerifiedAt:
      software.pricingVerifiedAt ??
      enrichment?.domainCheckedAt?.pricing ??
      null,
    pricingPageHref,
    costCalculatorHref,
    planSelectorHref,
    highlightedPlanSlug,
    pricingCompareColumns: compareColumns,
    pricingCompareRows,
    useCases,
    notBestIf: notIdealFor.slice(0, 4),
    competitors,
    comparisonLinks,
    alternativesHref:
      linkGroups.alternatives[0]?.href ??
      alternativesCatalogueHref(software.slug),
    integrations,
    thingsToKnow,
    finderHref,
    finderLabel,
    research: {
      lastChecked: lastUpdated,
      sourceCount: sources.length,
      pricingChecked: enrichment?.domainCheckedAt?.pricing ?? null,
      featuresChecked: enrichment?.domainCheckedAt?.features ?? null,
      editorialStatus: scoresApproved
        ? "Approved"
        : assessment?.status === "review-required"
          ? "Editorial review"
          : assessment
            ? "In progress"
            : "Not started",
      methodologyVersion:
        assessment?.methodologyVersion ??
        review?.methodologyVersion ??
        methodology?.version ??
        null,
      methodologyHref: COMPANY_ROUTES.methodology,
      handsOnTesting: Boolean(
        review?.handsOnTesting || assessment?.handsOnTesting,
      ),
      fixtureBased: researchSources.some((s) => s.sourceType === "fixture"),
    },
    sources,
    evidenceCenter,
    guides,
    faq,
    navItems,
    lastUpdated,
    deepReview,
  };
}
