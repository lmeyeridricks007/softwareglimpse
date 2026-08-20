import type { GuidePage } from "@/domain";
import {
  guideContentId,
  pricingContentId,
  softwareContentId,
  toolContentId,
} from "@/services/publishing/ids";
import { buildBlocksForKind } from "./blocks";
import {
  listCrmProductGuideSlugs,
  listEmProductGuideSlugs,
  listMarketingProductGuideSlugs,
  listBcProductGuideSlugs,
  listSiProductGuideSlugs,
  listHrProductGuideSlugs,
  listEcommerceProductGuideSlugs,
  listPmProductGuideSlugs,
  listAiProductGuideSlugs,
  listItProductGuideSlugs,
  loadProductGuideContext,
  type ProductGuideContext,
} from "./context";
import {
  CRM_PRODUCT_GUIDE_KINDS,
  CRM_PRODUCT_GUIDE_KIND_CONFIG,
  productGuideKindConfig,
  productGuideSlug,
  type CrmProductGuideKind,
} from "./kinds";

const PUBLISHED_AT = "2026-08-14T12:00:00.000Z";
/** Must be ≤ now — future timestamps are filtered out of getGuides(). */
const SI_PUBLISHED_AT = "2026-08-17T06:00:00.000Z";
const EM_PUBLISHED_AT = "2026-08-17T12:00:00.000Z";
const MARKETING_PUBLISHED_AT = "2026-08-17T15:00:00.000Z";
/** Soft-publish with category guides until editorial gate — must be ≤ now. */
const BC_PUBLISHED_AT = "2026-08-17T18:00:00.000Z";
const HR_PUBLISHED_AT = "2026-08-18T00:00:00.000Z";
const ECOM_PUBLISHED_AT = "2026-08-18T00:00:00.000Z";
const PM_PUBLISHED_AT = "2026-08-18T05:30:00.000Z";
const AI_IT_PUBLISHED_AT = "2026-08-18T12:00:00.000Z";
const AUTHOR = "author-lee-meyeridricks";

type CategoryJourneyPillars = {
  choose: string;
  evaluation?: string;
  pricing?: string;
  tco?: string;
  roi?: string;
  requirements?: string;
  testing?: string;
  categoryImplementation?: string;
  categoryMigration?: string;
  whatIs?: string;
};

/** Existing educational slugs only — never invent pages. */
const CATEGORY_JOURNEY_PILLARS: Record<string, CategoryJourneyPillars> = {
  crm: {
    choose: "how-to-choose-crm",
    evaluation: "crm-evaluation-guide",
    pricing: "crm-pricing-guide",
    tco: "crm-total-cost-guide",
    roi: "crm-roi-guide",
    requirements: "crm-requirements-guide",
    testing: "crm-testing",
    categoryImplementation: "crm-implementation",
    categoryMigration: "crm-data-migration",
  },
  "sales-intelligence": {
    choose: "how-to-choose-sales-intelligence",
    evaluation: "sales-intelligence-evaluation-guide",
    pricing: "sales-intelligence-pricing-guide",
    tco: "sales-intelligence-total-cost-guide",
    roi: "sales-intelligence-roi-guide",
    requirements: "sales-intelligence-requirements-guide",
    categoryImplementation: "sales-intelligence-implementation-guide",
    categoryMigration: "sales-intelligence-migration-guide",
  },
  "email-marketing": {
    choose: "how-to-choose-email-marketing",
    evaluation: "email-marketing-evaluation-guide",
    pricing: "email-marketing-pricing-guide",
    requirements: "email-marketing-requirements-guide",
    whatIs: "what-is-email-marketing",
  },
  marketing: {
    choose: "how-to-choose-marketing-software",
    evaluation: "marketing-software-evaluation-guide",
    pricing: "marketing-software-pricing-guide",
    requirements: "marketing-software-requirements-guide",
    whatIs: "what-is-marketing-software",
  },
  "business-communications": {
    choose: "how-to-choose-business-communications-software",
    evaluation: "business-communications-evaluation-guide",
    pricing: "business-communications-pricing-guide",
    requirements: "business-communications-requirements-guide",
    whatIs: "what-is-business-communications-software",
  },
  hr: {
    choose: "how-to-choose-hr-software",
    evaluation: "hr-evaluation-guide",
    pricing: "hr-pricing-guide",
    requirements: "hr-requirements-guide",
    whatIs: "what-is-hr-software",
  },
  ecommerce: {
    choose: "how-to-choose-ecommerce-software",
    pricing: "ecommerce-pricing-guide",
    whatIs: "what-is-ecommerce-software",
  },
  "project-management": {
    choose: "how-to-choose-project-management-software",
    evaluation: "project-management-evaluation-guide",
    pricing: "project-management-pricing-guide",
    requirements: "project-management-requirements-guide",
    whatIs: "what-is-project-management-software",
  },
  ai: {
    choose: "how-to-choose-ai-software",
    evaluation: "ai-evaluation-guide",
    pricing: "ai-pricing-guide",
    requirements: "ai-requirements-guide",
    whatIs: "what-is-ai-software",
  },
  "it-development": {
    choose: "how-to-choose-it-development-software",
    evaluation: "it-development-evaluation-guide",
    pricing: "it-development-pricing-guide",
    requirements: "it-development-requirements-guide",
    whatIs: "what-is-it-development-software",
  },
};

function uniqueSlugs(slugs: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of slugs) {
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out.slice(0, 6);
}

/**
 * Kind-directed pack journey: this product's next/previous sibling, then
 * stage-matched category pillars. Not "all four siblings + the same pillar set".
 */
function relatedGuideSlugsFor(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): string[] {
  const siblings = ctx.siblingSlugs;
  const pillars =
    CATEGORY_JOURNEY_PILLARS[ctx.categorySlug] ?? CATEGORY_JOURNEY_PILLARS.crm;

  if (kind === "worth-it") {
    return uniqueSlugs([
      siblings.plans,
      pillars.choose,
      pillars.evaluation,
      pillars.whatIs,
    ]);
  }
  if (kind === "plans") {
    return uniqueSlugs([
      siblings["worth-it"],
      pillars.pricing,
      pillars.tco,
      pillars.choose,
      pillars.roi,
    ]);
  }
  if (kind === "setup") {
    return uniqueSlugs([
      siblings.implementation,
      pillars.requirements,
      pillars.categoryImplementation,
    ]);
  }
  if (kind === "implementation") {
    return uniqueSlugs([
      siblings.setup,
      siblings.migration,
      pillars.categoryImplementation,
      pillars.testing,
    ]);
  }
  return uniqueSlugs([
    siblings.setup,
    siblings.implementation,
    pillars.requirements,
    pillars.categoryMigration,
  ]);
}

function nextActionFor(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuidePage["nextAction"] {
  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const label = cfg.nextActionLabel(ctx.productName);

  if (kind === "setup") {
    return {
      contentId: guideContentId(ctx.siblingSlugs.implementation),
      label,
    };
  }
  if (kind === "migration") {
    return {
      contentId: guideContentId(ctx.siblingSlugs.setup),
      label,
    };
  }
  if (kind === "plans") {
    if (ctx.categorySlug === "crm") {
      return {
        contentId: toolContentId("crm-cost-calculator"),
        label,
      };
    }
    return {
      contentId: pricingContentId(ctx.productSlug),
      label,
    };
  }
  if (kind === "worth-it") {
    if (ctx.categorySlug === "crm") {
      return {
        contentId: toolContentId("crm-finder"),
        label,
      };
    }
    if (ctx.categorySlug === "sales-intelligence") {
      return {
        contentId: toolContentId("sales-intelligence-finder"),
        label,
      };
    }
    return {
      contentId: softwareContentId(ctx.productSlug),
      label,
    };
  }
  return {
    contentId: softwareContentId(ctx.productSlug),
    label,
  };
}

function buildCrmSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: (typeof CRM_PRODUCT_GUIDE_KIND_CONFIG)[CrmProductGuideKind],
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
    supports.push({
      contentId: "content:tool:crm-cost-calculator",
      relationType: "explains-pricing",
      primary: false,
    });
  } else if (kind === "worth-it") {
    supports.push({
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    });
  } else {
    supports.push({
      contentId: "content:tool:crm-requirements-builder",
      relationType: "supports-anchor",
      primary: false,
    });
  }

  return supports;
}

function buildSiSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

function buildEmSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:email-marketing",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

function buildMarketingSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

function buildBcSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:business-communications",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildCrmProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "crm") return null;

  const cfg = CRM_PRODUCT_GUIDE_KIND_CONFIG[kind];
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["crm"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildCrmSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: PUBLISHED_AT,
      publishedAt: PUBLISHED_AT,
      reviewedAt: PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllCrmProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listCrmProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildCrmProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

export function buildSiProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "sales-intelligence") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["sales-intelligence"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildSiSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: SI_PUBLISHED_AT,
      publishedAt: SI_PUBLISHED_AT,
      reviewedAt: SI_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllSiProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listSiProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildSiProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

export function buildEmProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "email-marketing") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["email-marketing"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildEmSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: EM_PUBLISHED_AT,
      publishedAt: EM_PUBLISHED_AT,
      reviewedAt: EM_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllEmProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listEmProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildEmProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

export function buildMarketingProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "marketing") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["marketing"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildMarketingSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: MARKETING_PUBLISHED_AT,
      publishedAt: MARKETING_PUBLISHED_AT,
      reviewedAt: MARKETING_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllMarketingProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listMarketingProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildMarketingProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

export function buildBcProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "business-communications") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["business-communications"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildBcSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: BC_PUBLISHED_AT,
      publishedAt: BC_PUBLISHED_AT,
      reviewedAt: BC_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllBcProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listBcProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildBcProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

function buildHrSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:hr",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:best:hr-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildHrProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "hr") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["hr"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildHrSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: HR_PUBLISHED_AT,
      publishedAt: HR_PUBLISHED_AT,
      reviewedAt: HR_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllHrProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listHrProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildHrProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

function buildEcommerceSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:ecommerce",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:best:ecommerce-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildEcommerceProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "ecommerce") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["ecommerce"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildEcommerceSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: ECOM_PUBLISHED_AT,
      publishedAt: ECOM_PUBLISHED_AT,
      reviewedAt: ECOM_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllEcommerceProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listEcommerceProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildEcommerceProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

function buildPmSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:project-management",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:best:project-management-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildPmProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "project-management") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["project-management"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildPmSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: PM_PUBLISHED_AT,
      publishedAt: PM_PUBLISHED_AT,
      reviewedAt: PM_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllPmProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listPmProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildPmProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

function buildAiSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:ai",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:best:ai-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildAiProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "ai") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["ai"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildAiSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: AI_IT_PUBLISHED_AT,
      publishedAt: AI_IT_PUBLISHED_AT,
      reviewedAt: AI_IT_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllAiProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listAiProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildAiProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

function buildItSupports(
  productSlug: string,
  kind: CrmProductGuideKind,
  cfg: ReturnType<typeof productGuideKindConfig>,
): GuidePage["supports"] {
  const softId = softwareContentId(productSlug);
  const supports: GuidePage["supports"] = [
    {
      contentId: softId,
      relationType: cfg.relationType,
      primary: true,
    },
    {
      contentId: "content:category:it-development",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:best:it-development-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ];

  if (kind === "plans") {
    supports.push({
      contentId: pricingContentId(productSlug),
      relationType: "explains-pricing",
      primary: true,
    });
  }

  return supports;
}

export function buildItProductGuide(
  productSlug: string,
  kind: CrmProductGuideKind,
): GuidePage | null {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx || ctx.categorySlug !== "it-development") return null;

  const cfg = productGuideKindConfig(ctx.categorySlug, kind);
  const slug = productGuideSlug(productSlug, kind);
  const blocks = buildBlocksForKind(ctx, kind);

  return {
    id: `guide-${slug}`,
    slug,
    title: cfg.pageTitle(ctx.productName),
    summary: cfg.summary(ctx.productName),
    categorySlugs: ["it-development"],
    productSlugs: [productSlug],
    topicType: cfg.topicType,
    journeyStage: cfg.journeyStage,
    knowledgeAreaSlug: cfg.knowledgeAreaSlug,
    heroVisual: {
      src: ctx.heroSrc(kind),
      alt: cfg.heroAlt(ctx.productName),
    },
    supports: buildItSupports(productSlug, kind, cfg),
    nextAction: nextActionFor(ctx, kind),
    relatedGuideSlugs: relatedGuideSlugsFor(ctx, kind),
    blocks: blocks as GuidePage["blocks"],
    checklist: cfg.checklist.map((item, order) => ({ ...item, order })),
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: {
      status: "published",
      updatedAt: AI_IT_PUBLISHED_AT,
      publishedAt: AI_IT_PUBLISHED_AT,
      reviewedAt: AI_IT_PUBLISHED_AT,
      author: AUTHOR,
      researchStatus: "complete",
      seoStatus: "optimized",
    },
    seo: {
      title: cfg.seoTitle(ctx.productName),
      description: cfg.summary(ctx.productName).slice(0, 320),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export function buildAllItProductGuides(): GuidePage[] {
  const guides: GuidePage[] = [];
  for (const productSlug of listItProductGuideSlugs()) {
    for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
      const guide = buildItProductGuide(productSlug, kind);
      if (guide) guides.push(guide);
    }
  }
  return guides;
}

const PRODUCT_GUIDE_BUILDERS: Record<
  string,
  (productSlug: string, kind: CrmProductGuideKind) => GuidePage | null
> = {
  crm: buildCrmProductGuide,
  "sales-intelligence": buildSiProductGuide,
  "email-marketing": buildEmProductGuide,
  marketing: buildMarketingProductGuide,
  "business-communications": buildBcProductGuide,
  hr: buildHrProductGuide,
  ecommerce: buildEcommerceProductGuide,
  "project-management": buildPmProductGuide,
  ai: buildAiProductGuide,
  "it-development": buildItProductGuide,
};

/** Build the 5-kind product-guide pack for one slug without loading every category. */
export function buildProductGuidePackForSlug(productSlug: string): GuidePage[] {
  const ctx = loadProductGuideContext(productSlug);
  if (!ctx) return [];
  const build = PRODUCT_GUIDE_BUILDERS[ctx.categorySlug];
  if (!build) return [];
  const guides: GuidePage[] = [];
  for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
    const guide = build(productSlug, kind);
    if (guide) guides.push(guide);
  }
  return guides;
}

export {
  CRM_PRODUCT_GUIDE_KINDS,
  productGuideSlug,
  type CrmProductGuideKind,
} from "./kinds";
