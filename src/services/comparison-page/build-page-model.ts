import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getComparisonCriteria,
  getComparisonsForProduct,
} from "@/data";
import {
  getGuidesByCategory,
  getGuidesByProduct,
} from "@/data/repositories/guides";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { isEntityIndexable } from "@/domain/quality-gates";
import type {
  Comparison,
  ComparisonWinnerKind,
  CurrencyCode,
  PricingPlan,
  Software,
} from "@/domain";
import {
  crmRequirementsFromCalculatorInput,
  formatMoney,
  fromMajor,
} from "@/domain";
import { calculateProductCost } from "@/services/pricing";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import type { ProductScreenshot } from "@/components/software/product-screenshot-gallery";
import {
  buyerFacingOutcomeLabel,
  comparisonPublicCopy,
  firstComparisonPublicCopy,
} from "./public-copy";
import type { ComparisonPageTabId } from "./tabs";
import type {
  ComparisonCriterionRow,
  ComparisonFeatureRow,
  ComparisonPageModel,
  ComparisonPageProduct,
  QualitativeStrength,
} from "./types";

export type {
  ComparisonCriterionRow,
  ComparisonFeatureRow,
  ComparisonPageModel,
  ComparisonPageProduct,
  QualitativeStrength,
} from "./types";


const CRM_FEATURE_GROUPS: Array<{ group: string; slugs: string[] }> = [
  {
    group: "Core CRM",
    slugs: [
      "contact-management",
      "lead-management",
      "pipeline-management",
      "deal-management",
    ],
  },
  {
    group: "Sales engagement",
    slugs: [
      "email-sync",
      "email-tracking",
      "email-sequences",
      "call-functionality",
      "workflow-automation",
      "sales-automation",
      "lead-scoring",
    ],
  },
  {
    group: "Reporting",
    slugs: ["reporting", "forecasting"],
  },
  {
    group: "Platform",
    slugs: [
      "integrations",
      "custom-fields",
      "custom-pipelines",
      "mobile-app",
      "ai-assistance",
    ],
  },
];

const PM_FEATURE_GROUPS: Array<{ group: string; slugs: string[] }> = [
  {
    group: "Work planning",
    slugs: [
      "task-boards",
      "timeline-gantt",
      "workload-resources",
      "time-tracking",
    ],
  },
  {
    group: "Execution",
    slugs: ["automations-workflows", "docs-collaboration", "ai-assistance"],
  },
  {
    group: "Platform",
    slugs: ["integrations-ecosystem", "reporting-dashboards"],
  },
  {
    group: "Adjacent productivity",
    slugs: ["document-pdf", "remote-access", "desktop-workspace"],
  },
];

const EM_FEATURE_GROUPS: Array<{ group: string; slugs: string[] }> = [
  {
    group: "Campaigns",
    slugs: [
      "email-campaigns",
      "newsletter-builder",
      "email-templates",
      "drag-drop-editor",
      "landing-pages",
      "forms",
    ],
  },
  {
    group: "Automation & targeting",
    slugs: [
      "automation-workflows",
      "segmentation",
      "personalization",
      "ab-testing",
      "transactional-email",
    ],
  },
  {
    group: "Platform",
    slugs: [
      "analytics",
      "deliverability-tools",
      "ai-content-generation",
      "ai-assistance",
    ],
  },
];

const BC_FEATURE_GROUPS: Array<{ group: string; slugs: string[] }> = [
  {
    group: "Voice",
    slugs: ["cloud-phone", "call-routing", "call-recording", "power-dialer"],
  },
  {
    group: "Messaging",
    slugs: [
      "sms-messaging",
      "whatsapp-business",
      "shared-inbox",
      "team-messaging",
      "unified-inbox",
      "video-meetings",
    ],
  },
  {
    group: "Platform",
    slugs: ["crm-cti", "analytics-reporting", "ai-assistance"],
  },
];

const HR_FEATURE_GROUPS: Array<{ group: string; slugs: string[] }> = [
  {
    group: "Hiring",
    slugs: [
      "applicant-tracking",
      "career-site-job-boards",
      "interview-scheduling",
    ],
  },
  {
    group: "Workforce",
    slugs: [
      "workforce-scheduling",
      "frontline-comms",
      "time-attendance",
      "gps-geofence-clockin",
    ],
  },
  {
    group: "People & payroll",
    slugs: ["core-hris", "payroll-processing", "benefits-admin"],
  },
  {
    group: "Training",
    slugs: [
      "sop-knowledge-base",
      "employee-training-paths",
      "lms-course-commerce",
    ],
  },
  {
    group: "Platform",
    slugs: ["hris-integrations", "analytics-reporting", "ai-assistance"],
  },
];

const KEY_DIFF_SLUGS: Record<string, string[]> = {
  crm: [
    "pipeline-management",
    "email-capabilities",
    "sales-automation",
    "reporting",
    "value-for-money",
  ],
  hr: [
    "starting-pricing",
    "hiring-workflow",
    "core-hris",
    "payroll-processing",
    "scheduling-depth",
    "training-depth",
    "time-tracking-depth",
  ],
  "email-marketing": [
    "starting-pricing",
    "automation",
    "segmentation",
    "analytics",
    "templates",
  ],
  "project-management": [
    "starting-pricing",
    "seat-minimum",
    "timeline-gantt",
    "work-planning",
    "automations",
    "integrations",
    "reporting",
  ],
  "business-communications": [
    "starting-pricing",
    "whatsapp-business",
    "power-dialer",
    "routing",
    "crm-integrations",
  ],
  marketing: [
    "campaign-content",
    "marketing-automation",
    "funnel-conversion",
    "brand-monitoring",
    "value-for-money",
  ],
  "sales-intelligence": [
    "contact-data",
    "prospecting",
    "email-outreach",
    "integrations",
    "value-for-money",
  ],
};

function featureGroupsForCategory(
  categorySlug?: string,
): Array<{ group: string; slugs: string[] }> {
  switch (categorySlug) {
    case "hr":
      return HR_FEATURE_GROUPS;
    case "project-management":
      return PM_FEATURE_GROUPS;
    case "email-marketing":
      return EM_FEATURE_GROUPS;
    case "business-communications":
      return BC_FEATURE_GROUPS;
    default:
      return CRM_FEATURE_GROUPS;
  }
}

function categoryDiscovery(categorySlug?: string): {
  finderHref: string;
  finderLabel: string;
  costCalculatorHref: string;
  categoryLabel: string;
} {
  switch (categorySlug) {
    case "hr":
      return {
        finderHref: "/best/hr-software/",
        finderLabel: "Best HR software",
        costCalculatorHref: "/guides/hr-pricing-guide/",
        categoryLabel: "HR software",
      };
    case "email-marketing":
      return {
        finderHref: "/best/email-marketing-software/",
        finderLabel: "Best email marketing software",
        costCalculatorHref: "/tools/software-cost-calculator/",
        categoryLabel: "email marketing",
      };
    case "project-management":
      return {
        finderHref: "/best/project-management-software/",
        finderLabel: "Best project management software",
        costCalculatorHref: "/tools/software-cost-calculator/",
        categoryLabel: "project management",
      };
    case "business-communications":
      return {
        finderHref: "/best/business-communications-software/",
        finderLabel: "Best communications software",
        costCalculatorHref: "/tools/software-cost-calculator/",
        categoryLabel: "business communications",
      };
    case "sales-intelligence":
      return {
        finderHref: "/best/sales-intelligence-software/",
        finderLabel: "Best sales intelligence software",
        costCalculatorHref: "/tools/software-cost-calculator/",
        categoryLabel: "sales intelligence",
      };
    case "marketing":
      return {
        finderHref: "/best/marketing-software/",
        finderLabel: "Best marketing software",
        costCalculatorHref: "/tools/software-cost-calculator/",
        categoryLabel: "marketing",
      };
    case "crm":
    default:
      return {
        finderHref: "/tools/crm-finder/",
        finderLabel: "Find My CRM",
        costCalculatorHref: "/tools/crm-cost-calculator/",
        categoryLabel:
          categorySlug === "crm" ? "CRM" : humanizeSlug(categorySlug ?? "product"),
      };
  }
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const FEATURE_NAME_BY_SLUG = new Map(
  canonicalFeaturesSeed.map((f) => [f.slug, f.name]),
);

function featureDisplayName(slug: string): string {
  return FEATURE_NAME_BY_SLUG.get(slug) ?? humanizeSlug(slug);
}

function formatUpdated(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function approvedOverallScore(software: Software | undefined): {
  score: number | null;
  approved: boolean;
} {
  if (!software) return { score: null, approved: false };
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const score = review?.overallScore ?? assessment?.overallScore;
  const approved =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved" &&
    typeof score === "number";
  return { score: approved ? score! : null, approved };
}

function approvedCriterionScore(
  software: Software | undefined,
  criterionSlug: string,
): number | null {
  if (!software) return null;
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const approved =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved";
  if (!approved || !assessment) return null;
  const alias = CRITERION_SCORE_ALIASES[criterionSlug];
  const row =
    assessment.criterionAssessments?.find(
      (c) => c.criterionSlug === criterionSlug,
    ) ??
    (alias
      ? assessment.criterionAssessments?.find((c) => c.criterionSlug === alias)
      : undefined);
  return typeof row?.score === "number" ? row.score : null;
}

const CRITERION_SCORE_ALIASES: Record<string, string> = {
  "ai-features": "ai-capabilities",
  automations: "automation-workflows",
  "timeline-gantt": "work-planning",
};

function outcomeFromScores(
  criterionName: string,
  scoreA: number,
  scoreB: number,
  slugA: string,
  slugB: string,
  nameA: string,
  nameB: string,
): {
  winnerKind: ComparisonWinnerKind;
  winnerSlug: string | null;
  reason: string;
} {
  const delta = scoreA - scoreB;
  if (Math.abs(delta) <= 0.5) {
    return {
      winnerKind: "tie",
      winnerSlug: null,
      reason: `${nameA} and ${nameB} are close on ${criterionName.toLowerCase()} (${scoreA}/10 vs ${scoreB}/10) from approved product scores grounded in vendor documentation.`,
    };
  }
  const aLeads = delta > 0;
  return {
    winnerKind: aLeads ? "product-a" : "product-b",
    winnerSlug: aLeads ? slugA : slugB,
    reason: `${aLeads ? nameA : nameB} leads on ${criterionName.toLowerCase()} (${scoreA}/10 vs ${scoreB}/10) from approved product scores grounded in vendor documentation.`,
  };
}

function availabilityLabel(value: string | undefined): string {
  switch (value) {
    case "supported":
      return "Strong";
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return "Moderate";
    case "not-supported":
      return "Limited";
    default:
      return "Not evidenced";
  }
}

function strengthForProduct(
  kind: ComparisonWinnerKind | undefined,
  winnerSlug: string | null | undefined,
  productSlug: string,
  slugA: string,
  slugB: string,
): QualitativeStrength {
  if (!kind) return "unknown";
  if (kind === "tie") return "tie";
  if (kind === "depends") return "depends";
  const isWinner =
    winnerSlug === productSlug ||
    (kind === "product-a" && productSlug === slugA) ||
    (kind === "product-b" && productSlug === slugB);
  return isWinner ? "stronger" : "weaker";
}

function sanitizeScenarios(values: string[] | undefined): string[] {
  return (values ?? [])
    .map((v) => comparisonPublicCopy(v))
    .filter((v): v is string => Boolean(v))
    .slice(0, 4);
}

function buildProductSide(
  software: Software | undefined,
  slug: string,
  enrichmentScreenshots: ProductScreenshot[],
  enrichmentPricing: {
    startingPriceMonthly?: number | null;
    hasFreePlan?: boolean | null;
    hasFreeTrial?: boolean | null;
    currency?: string;
    verifiedAt?: string;
    plans?: Array<{ name?: string; priceMonthly?: number | null }>;
  } | null,
  comparisonBestFor: string[],
): ComparisonPageProduct {
  const name = software?.name ?? slug;
  const score = approvedOverallScore(software);
  const pricing = enrichmentPricing ?? software?.pricing;
  const currency = ((pricing as { currency?: string } | undefined)?.currency ??
    "USD") as CurrencyCode;
  const starting = (pricing as { startingPriceMonthly?: number | null } | undefined)
    ?.startingPriceMonthly;
  const hasFree = (pricing as { hasFreePlan?: boolean | null } | undefined)
    ?.hasFreePlan;
  const hasTrial = (pricing as { hasFreeTrial?: boolean | null } | undefined)
    ?.hasFreeTrial;

  return {
    slug,
    name,
    href: `/software/${slug}/`,
    logo: software?.logo,
    positioning:
      firstComparisonPublicCopy([
        software?.shortDescription,
        software?.description,
      ]) ?? undefined,
    bestFor: sanitizeScenarios(
      comparisonBestFor.length > 0 ? comparisonBestFor : software?.bestFor,
    ),
    notIdealFor: sanitizeScenarios(software?.notIdealFor),
    pros: sanitizeScenarios(software?.pros),
    cons: sanitizeScenarios(software?.cons),
    score: score.score,
    scoreApproved: score.approved,
    startingPriceLabel:
      starting != null
        ? `${formatMoney(fromMajor(starting, currency))}/user/mo`
        : undefined,
    freePlanLabel:
      hasFree === true
        ? "Free plan available"
        : hasFree === false
          ? "No free plan"
          : undefined,
    trialLabel:
      hasTrial === true
        ? "Free trial available"
        : hasTrial === false
          ? "No free trial evidenced"
          : undefined,
    pricingVerifiedAt: (pricing as { verifiedAt?: string } | undefined)
      ?.verifiedAt,
    screenshots: enrichmentScreenshots,
    visitLabel: `Visit ${name}`,
  };
}

function buildFaq(
  nameA: string,
  nameB: string,
  modelBits: {
    overallLabel: string;
    verdict?: string;
    winsA: ComparisonCriterionRow[];
    winsB: ComparisonCriterionRow[];
    criteria: ComparisonCriterionRow[];
    productA: ComparisonPageProduct;
    productB: ComparisonPageProduct;
    categoryLabel?: string;
  },
): Array<{ question: string; answer: string }> {
  const {
    overallLabel,
    verdict,
    winsA,
    winsB,
    criteria,
    productA,
    productB,
    categoryLabel,
  } = modelBits;
  const noun = categoryLabel ?? "product";
  const faq: Array<{ question: string; answer: string }> = [
    {
      question: `Is ${nameA} better than ${nameB}?`,
      answer:
        overallLabel === "No universal winner" || overallLabel === "Overall tie"
          ? verdict ??
            `Neither product is universally better. ${nameA} leads on ${winsA
              .slice(0, 3)
              .map((w) => w.name.toLowerCase())
              .join(", ") || "some criteria"}; ${nameB} leads on ${winsB
              .slice(0, 3)
              .map((w) => w.name.toLowerCase())
              .join(", ") || "others"}. Choose based on your priorities.`
          : verdict
            ? `${overallLabel}. ${verdict}`
            : overallLabel,
    },
  ];

  const ease = [...winsA, ...winsB].find((c) => c.slug === "ease-of-use");
  if (ease) {
    faq.push({
      question: "Which is easier to use?",
      answer: ease.label,
    });
  }

  if (productA.bestFor[0] || productB.bestFor[0]) {
    faq.push({
      question: `Which ${noun} fits which team?`,
      answer: [
        productA.bestFor[0] ? `${nameA}: ${productA.bestFor[0]}` : null,
        productB.bestFor[0] ? `${nameB}: ${productB.bestFor[0]}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  const highlightSlugs = [
    "sales-automation",
    "hiring-workflow",
    "core-hris",
    "payroll-processing",
    "scheduling-depth",
    "time-tracking-depth",
    "training-depth",
  ];
  for (const slug of highlightSlugs) {
    const row = criteria.find((c) => c.slug === slug);
    if (!row?.label) continue;
    faq.push({
      question: `Which is stronger for ${row.name.toLowerCase()}?`,
      answer: row.label,
    });
  }

  if (productA.freePlanLabel || productB.freePlanLabel) {
    faq.push({
      question: `Does ${nameA} or ${nameB} have a free plan?`,
      answer: `${nameA}: ${productA.freePlanLabel ?? "Not evidenced"}. ${nameB}: ${productB.freePlanLabel ?? "Not evidenced"}.`,
    });
  }

  if (productA.startingPriceLabel || productB.startingPriceLabel) {
    faq.push({
      question: `How does ${nameA} vs ${nameB} pricing compare?`,
      answer: [
        productA.startingPriceLabel
          ? `${nameA} starts from ${productA.startingPriceLabel}`
          : null,
        productB.startingPriceLabel
          ? `${nameB} starts from ${productB.startingPriceLabel}`
          : null,
        "Confirm live vendor pricing before purchasing.",
      ]
        .filter(Boolean)
        .join(". "),
    });
  }

  faq.push({
    question: "How did SoftwareGlimpse compare these products?",
    answer:
      "We map both products to the same category criteria, then evaluate trade-offs using verified product, pricing and feature evidence. Affiliate relationships never change outcomes.",
  });

  return faq.filter((f) => f.answer.trim().length > 0);
}

/**
 * Dual-path editorial verdicts stay “depends”. Never crown a lower
 * approved overall score as “stronger overall fit” just because it
 * won more off-cluster criterion rows (e.g. payroll on an ATS pair).
 */
export function resolveOverallWinnerKind(input: {
  stored?: ComparisonWinnerKind;
  winsA: number;
  winsB: number;
  scoreA: number | null;
  scoreB: number | null;
}): ComparisonWinnerKind {
  if (input.stored === "depends" || input.stored === "tie") {
    return input.stored;
  }

  const counted: ComparisonWinnerKind =
    input.winsA > input.winsB
      ? "product-a"
      : input.winsB > input.winsA
        ? "product-b"
        : input.winsA > 0 || input.winsB > 0
          ? "tie"
          : "depends";

  const kind: ComparisonWinnerKind =
    input.stored === "product-a" || input.stored === "product-b"
      ? input.stored
      : counted;

  if (
    kind === "product-a" &&
    input.scoreA != null &&
    input.scoreB != null &&
    input.scoreA < input.scoreB
  ) {
    return "depends";
  }
  if (
    kind === "product-b" &&
    input.scoreA != null &&
    input.scoreB != null &&
    input.scoreB < input.scoreA
  ) {
    return "depends";
  }
  return kind;
}

export function buildComparisonPageModel(
  comparison: Comparison,
): ComparisonPageModel | null {
  const [slugA, slugB] = comparison.productSlugs;
  if (!slugA || !slugB) return null;

  const productAEntity = getAllSoftwareUnfiltered().find((s) => s.slug === slugA);
  const productBEntity = getAllSoftwareUnfiltered().find((s) => s.slug === slugB);
  const enA = loadEnrichment(slugA);
  const enB = loadEnrichment(slugB);
  const sourcesA = loadManualSources(slugA);
  const sourcesB = loadManualSources(slugB);

  const nameA = productAEntity?.name ?? slugA;
  const nameB = productBEntity?.name ?? slugB;

  const criteriaBySlug = new Map(
    getComparisonCriteria(comparison.categorySlug).map((c) => [c.slug, c]),
  );
  const criteriaConfig =
    comparison.criterionSlugs.length > 0
      ? comparison.criterionSlugs
          .map((slug) => criteriaBySlug.get(slug))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
      : [...criteriaBySlug.values()].sort(
          (a, b) => a.displayOrder - b.displayOrder,
        );

  const criteria: ComparisonCriterionRow[] = criteriaConfig.map((criterion) => {
    const seeded = comparison.outcomes.find(
      (o) => o.criterionSlug === criterion.slug,
    );
    const scoreA = approvedCriterionScore(productAEntity, criterion.slug);
    const scoreB = approvedCriterionScore(productBEntity, criterion.slug);
    const synthesized =
      !seeded && scoreA != null && scoreB != null
        ? outcomeFromScores(
            criterion.name,
            scoreA,
            scoreB,
            slugA,
            slugB,
            nameA,
            nameB,
          )
        : null;
    const winnerKind = seeded?.winnerKind ?? synthesized?.winnerKind;
    const winnerSlug =
      seeded?.winnerSlug ?? synthesized?.winnerSlug ?? null;
    const reason = seeded?.reason ?? synthesized?.reason;
    const winnerName =
      winnerSlug === slugA
        ? nameA
        : winnerSlug === slugB
          ? nameB
          : winnerKind === "tie"
            ? "Tie"
            : winnerKind === "depends"
              ? null
              : null;

    return {
      slug: criterion.slug,
      name: criterion.name,
      description: criterion.description,
      winnerKind,
      winnerSlug,
      winnerName:
        winnerKind === "tie"
          ? "Tie"
          : winnerKind === "depends"
            ? "Depends"
            : winnerName,
      strengthA: strengthForProduct(
        winnerKind,
        winnerSlug,
        slugA,
        slugA,
        slugB,
      ),
      strengthB: strengthForProduct(
        winnerKind,
        winnerSlug,
        slugB,
        slugA,
        slugB,
      ),
      scoreA,
      scoreB,
      label: buyerFacingOutcomeLabel({
        criterionName: criterion.name,
        winnerKind,
        productName: winnerName,
        reason,
      }),
      evidenceSummary: comparisonPublicCopy(reason) ?? undefined,
      confidence: seeded?.confidence,
      researchStatus: seeded?.researchStatus ?? (synthesized ? "complete" : undefined),
      supportingFactIds: seeded?.supportingFactIds ?? [],
    };
  });

  const winsA = criteria.filter((c) => c.strengthA === "stronger");
  const winsB = criteria.filter((c) => c.strengthB === "stronger");
  const ties = criteria.filter((c) => c.strengthA === "tie");
  const depends = criteria.filter((c) => c.strengthA === "depends");

  const chooseA = comparison.bestFor.find((b) => b.productSlug === slugA);
  const chooseB = comparison.bestFor.find((b) => b.productSlug === slugB);

  const productA = buildProductSide(
    productAEntity,
    slugA,
    (enA?.screenshots ?? []) as ProductScreenshot[],
    enA?.pricing
      ? {
          startingPriceMonthly: (enA.pricing as { startingPriceMonthly?: number })
            .startingPriceMonthly,
          hasFreePlan: (enA.pricing as { hasFreePlan?: boolean }).hasFreePlan,
          hasFreeTrial: (enA.pricing as { hasFreeTrial?: boolean }).hasFreeTrial,
          currency: (enA.pricing as { currency?: string }).currency,
          verifiedAt: (enA.pricing as { verifiedAt?: string }).verifiedAt,
          plans: (
            enA.pricing as {
              plans?: Array<{ name?: string; priceMonthly?: number }>;
            }
          ).plans,
        }
      : null,
    chooseA?.scenarios ?? [],
  );
  const productB = buildProductSide(
    productBEntity,
    slugB,
    (enB?.screenshots ?? []) as ProductScreenshot[],
    enB?.pricing
      ? {
          startingPriceMonthly: (enB.pricing as { startingPriceMonthly?: number })
            .startingPriceMonthly,
          hasFreePlan: (enB.pricing as { hasFreePlan?: boolean }).hasFreePlan,
          hasFreeTrial: (enB.pricing as { hasFreeTrial?: boolean }).hasFreeTrial,
          currency: (enB.pricing as { currency?: string }).currency,
          verifiedAt: (enB.pricing as { verifiedAt?: string }).verifiedAt,
          plans: (
            enB.pricing as {
              plans?: Array<{ name?: string; priceMonthly?: number }>;
            }
          ).plans,
        }
      : null,
    chooseB?.scenarios ?? [],
  );

  // Derive buyer-facing pros/cons from criterion outcomes when product lists are empty.
  if (productA.pros.length === 0 && winsA.length > 0) {
    productA.pros = winsA.slice(0, 4).map((c) => `Stronger on ${c.name.toLowerCase()}`);
  }
  if (productB.pros.length === 0 && winsB.length > 0) {
    productB.pros = winsB.slice(0, 4).map((c) => `Stronger on ${c.name.toLowerCase()}`);
  }
  if (productA.cons.length === 0 && winsB.length > 0) {
    productA.cons = winsB
      .slice(0, 3)
      .map((c) => `Trails on ${c.name.toLowerCase()}`);
  }
  if (productB.cons.length === 0 && winsA.length > 0) {
    productB.cons = winsA
      .slice(0, 3)
      .map((c) => `Trails on ${c.name.toLowerCase()}`);
  }
  if (productA.bestFor.length === 0 && winsA.length > 0) {
    productA.bestFor = winsA
      .slice(0, 3)
      .map((c) => `Teams prioritizing ${c.name.toLowerCase()}`);
  }
  if (productB.bestFor.length === 0 && winsB.length > 0) {
    productB.bestFor = winsB
      .slice(0, 3)
      .map((c) => `Teams prioritizing ${c.name.toLowerCase()}`);
  }

  const overallKind = resolveOverallWinnerKind({
    stored: comparison.overallWinnerKind,
    winsA: winsA.length,
    winsB: winsB.length,
    scoreA: productA.scoreApproved ? productA.score : null,
    scoreB: productB.scoreApproved ? productB.score : null,
  });
  const overallLabel =
    overallKind === "tie"
      ? "Overall tie"
      : overallKind === "depends"
        ? "No universal winner"
        : overallKind === "product-a"
          ? `${nameA} is the stronger overall fit`
          : overallKind === "product-b"
            ? `${nameB} is the stronger overall fit`
            : "No universal winner";
  const namedWinner =
    overallKind === "product-a" || overallKind === "product-b";
  const verdictText = (() => {
    const raw = comparisonPublicCopy(comparison.verdict);
    if (!raw) {
      return `${overallLabel}. Choose based on which criteria matter most for your team.`;
    }
    if (namedWinner) {
      return raw.replace(/^No universal winner\.?\s*/i, "");
    }
    return raw;
  })();

  const decisionCards = [
    ...comparison.scenarioRecommendations
      .map((s, i) => {
        const title = comparisonPublicCopy(s.scenario);
        const explanation = comparisonPublicCopy(s.rationale);
        if (!title || !explanation) return null;
        const winnerSlug = s.preferredSlug ?? "";
        const winnerName =
          winnerSlug === slugA
            ? nameA
            : winnerSlug === slugB
              ? nameB
              : "Depends";
        return {
          id: `scenario-${i}`,
          title,
          winnerSlug: winnerSlug || slugA,
          winnerName,
          explanation,
        };
      })
      .filter(Boolean) as ComparisonPageModel["decisionCards"],
    ...winsA.slice(0, 3).map((c) => ({
      id: `win-a-${c.slug}`,
      title: `Best for ${c.name.toLowerCase()}`,
      winnerSlug: slugA,
      winnerName: nameA,
      explanation: c.label,
    })),
    ...winsB.slice(0, 3).map((c) => ({
      id: `win-b-${c.slug}`,
      title: `Best for ${c.name.toLowerCase()}`,
      winnerSlug: slugB,
      winnerName: nameB,
      explanation: c.label,
    })),
  ]
    .filter(
      (c, i, arr) =>
        c.title &&
        c.explanation &&
        arr.findIndex((x) => x.title === c.title && x.winnerSlug === c.winnerSlug) ===
          i,
    )
    .slice(0, 6);

  const preferredDiffSlugs = KEY_DIFF_SLUGS[comparison.categorySlug ?? ""] ?? [];
  const keyDiffRows = (
    preferredDiffSlugs.length
      ? preferredDiffSlugs
          .map((slug) => criteria.find((c) => c.slug === slug))
          .filter((row): row is ComparisonCriterionRow => Boolean(row))
      : criteria.filter(
          (c) => c.strengthA === "stronger" || c.strengthB === "stronger",
        )
  )
    .filter((row) => row.strengthA !== "unknown")
    .slice(0, 6);
  const keyDifferences = keyDiffRows.map((row) => {
    const evidence = row.evidenceSummary ?? row.label;
    const sideBody = (
      strength: ComparisonCriterionRow["strengthA"],
      otherName: string,
    ) => {
      if (strength === "stronger") return evidence;
      if (strength === "tie") return evidence || `Comparable to ${otherName}`;
      if (strength === "depends") {
        return evidence || "Depends on your priorities";
      }
      return `Trails ${otherName} on this criterion`;
    };
    return {
      id: row.slug,
      title: row.name,
      leftLabel: nameA,
      rightLabel: nameB,
      leftBody: sideBody(row.strengthA, nameB),
      rightBody: sideBody(row.strengthB, nameA),
      winnerName: row.winnerName,
    };
  });

  const featureMapA = new Map(
    (enA?.featureSupport ?? []).map((f) => [f.featureSlug, f]),
  );
  const featureMapB = new Map(
    (enB?.featureSupport ?? []).map((f) => [f.featureSlug, f]),
  );

  const toFeatureRow = (
    featureSlug: string,
    group: string,
  ): ComparisonFeatureRow | null => {
    const a = featureMapA.get(featureSlug);
    const b = featureMapB.get(featureSlug);
    if (!a && !b) return null;
    const avA = a?.availability ?? "unknown";
    const avB = b?.availability ?? "unknown";
    const rank = (v: string) =>
      v === "supported"
        ? 3
        : v === "limited" || v === "add-on" || v === "higher-plan-only"
          ? 2
          : v === "not-supported"
            ? 0
            : -1;
    const ra = rank(avA);
    const rb = rank(avB);
    let winnerKind: ComparisonFeatureRow["winnerKind"] = "unknown";
    let winnerName: string | null = null;
    if (ra >= 0 && rb >= 0) {
      if (ra === rb) {
        winnerKind = "tie";
        winnerName = "Tie";
      } else if (ra > rb) {
        winnerKind = "product-a";
        winnerName = nameA;
      } else {
        winnerKind = "product-b";
        winnerName = nameB;
      }
    }
    return {
      featureSlug,
      name: featureDisplayName(featureSlug),
      group,
      availabilityA: avA,
      availabilityB: avB,
      labelA: availabilityLabel(avA),
      labelB: availabilityLabel(avB),
      winnerKind,
      winnerName,
      notesA: comparisonPublicCopy(a?.notes) ?? undefined,
      notesB: comparisonPublicCopy(b?.notes) ?? undefined,
    };
  };

  const predefinedGroups = featureGroupsForCategory(comparison.categorySlug);
  const featureGroups = predefinedGroups
    .map(({ group, slugs }) => ({
      group,
      rows: slugs
        .map((slug) => toFeatureRow(slug, group))
        .filter(Boolean) as ComparisonFeatureRow[],
    }))
    .filter((g) => g.rows.length > 0);

  const usedFeatureSlugs = new Set(
    featureGroups.flatMap((g) => g.rows.map((r) => r.featureSlug)),
  );
  const leftoverSlugs = [
    ...new Set([...featureMapA.keys(), ...featureMapB.keys()]),
  ].filter((slug) => !usedFeatureSlugs.has(slug));
  if (leftoverSlugs.length > 0) {
    const leftoverGroup = featureGroups.length
      ? "Additional capabilities"
      : "Capabilities";
    const rows = leftoverSlugs
      .map((slug) => toFeatureRow(slug, leftoverGroup))
      .filter(Boolean) as ComparisonFeatureRow[];
    if (rows.length > 0) {
      featureGroups.push({ group: leftoverGroup, rows });
    }
  }

  const featureCount = featureGroups.reduce((n, g) => n + g.rows.length, 0);

  const snapshots =
    comparison.categorySlug === "crm" ? listCrmPricingSnapshots() : [];
  const snapA = snapshots.find((s) => s.productSlug === slugA);
  const snapB = snapshots.find((s) => s.productSlug === slugB);
  const requirements = crmRequirementsFromCalculatorInput({
    crmUsers: 15,
    requiredFeatureSlugs: [],
    billingPreference: "either",
  });

  function estimateLabel(snap: (typeof snapshots)[number] | undefined) {
    if (!snap) return undefined;
    const estimate = calculateProductCost(snap, requirements);
    if (
      (estimate.status !== "calculated" && estimate.status !== "partial") ||
      !estimate.monthlyEquivalent
    ) {
      return { monthlyLabel: "See pricing research", status: estimate.status };
    }
    return {
      monthlyLabel: formatMoney(estimate.monthlyEquivalent),
      planName: estimate.recommendedPlan?.name,
      status: estimate.status,
    };
  }

  const plansFromEnrichment = (
    pricing: unknown,
    currency: CurrencyCode,
  ): Array<{
    name: string;
    priceLabel: string;
    highlights: string[];
    isFree?: boolean;
    highlighted?: boolean;
  }> => {
    const plans = (pricing as { plans?: PricingPlan[] } | undefined)?.plans;
    if (!plans?.length) return [];

    return plans.slice(0, 5).map((plan) => {
      const seat = plan.rules.find((r) => r.kind === "per-seat");
      const flat = plan.rules.find((r) => r.kind === "flat");
      let priceLabel = "See details";
      if (plan.isFree || (flat?.kind === "flat" && flat.amount === 0)) {
        priceLabel = `${formatMoney(fromMajor(0, currency))}/user/mo`;
      } else if (seat?.kind === "per-seat") {
        priceLabel = `${formatMoney(fromMajor(seat.amountPerSeat, currency))}/user/mo`;
      } else if (plan.contactSales) {
        priceLabel = "Custom";
      } else if (flat?.kind === "flat") {
        priceLabel = `${formatMoney(fromMajor(flat.amount, currency))}/mo`;
      }

      const highlights: string[] = [];
      if (plan.limits) {
        for (const [key, value] of Object.entries(plan.limits).slice(0, 4)) {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/[-_]/g, " ")
            .trim()
            .toLowerCase();
          highlights.push(`${label}: ${String(value)}`);
        }
      }
      if (plan.description) {
        highlights.unshift(plan.description);
      }

      return {
        name: plan.name,
        priceLabel,
        highlights: highlights.slice(0, 4),
        isFree: plan.isFree,
        highlighted: plan.highlighted,
      };
    });
  };

  function unitFromSnap(snap: (typeof snapshots)[number] | undefined) {
    const starting = snap?.pricing?.startingPriceMonthly;
    if (typeof starting !== "number") return undefined;
    const estimate = calculateProductCost(snap!, requirements);
    return {
      perUserMonthly: starting,
      currency: (snap?.pricing?.currency ?? "USD") as CurrencyCode,
      planName: estimate.recommendedPlan?.name,
    };
  }

  const currencyA = ((enA?.pricing as { currency?: string } | undefined)
    ?.currency ?? "USD") as CurrencyCode;
  const currencyB = ((enB?.pricing as { currency?: string } | undefined)
    ?.currency ?? "USD") as CurrencyCode;

  const unitA =
    unitFromSnap(snapA) ??
    (typeof (enA?.pricing as { startingPriceMonthly?: number } | undefined)
      ?.startingPriceMonthly === "number"
      ? {
          perUserMonthly: (enA!.pricing as { startingPriceMonthly: number })
            .startingPriceMonthly,
          currency: currencyA,
        }
      : undefined);
  const unitB =
    unitFromSnap(snapB) ??
    (typeof (enB?.pricing as { startingPriceMonthly?: number } | undefined)
      ?.startingPriceMonthly === "number"
      ? {
          perUserMonthly: (enB!.pricing as { startingPriceMonthly: number })
            .startingPriceMonthly,
          currency: currencyB,
        }
      : undefined);

  const related = [
    ...getComparisonsForProduct(slugA),
    ...getComparisonsForProduct(slugB),
  ]
    .filter(
      (c, i, arr) =>
        c.slug !== comparison.slug &&
        arr.findIndex((x) => x.slug === c.slug) === i &&
        isEntityIndexable({ kind: "comparison", entity: c }),
    )
    .slice(0, 6)
    .map((c) => {
      const [a, b] = c.productSlugs;
      const pa = getAllSoftwareUnfiltered().find((s) => s.slug === a);
      const pb = getAllSoftwareUnfiltered().find((s) => s.slug === b);
      return {
        slug: c.slug,
        title: c.title,
        href: `/compare/${c.slug}/`,
        productAName: pa?.name ?? a!,
        productBName: pb?.name ?? b!,
        logoA: pa?.logo,
        logoB: pb?.logo,
      };
    });

  const altSlugs = [
    ...new Set([
      ...comparison.relatedAlternativeSlugs,
      ...(productAEntity?.alternativeSlugs ?? []),
      ...(productBEntity?.alternativeSlugs ?? []),
      ...(productAEntity?.competitorSlugs ?? []),
      ...(productBEntity?.competitorSlugs ?? []),
    ]),
  ]
    .filter((s) => s !== slugA && s !== slugB)
    .slice(0, 4);

  const alternatives = altSlugs
    .map((s) => {
      const soft = getAllSoftwareUnfiltered().find((p) => p.slug === s);
      if (!soft) return null;
      return {
        slug: soft.slug,
        name: soft.name,
        href: `/software/${soft.slug}/`,
        logo: soft.logo,
        bestFor: sanitizeScenarios(soft.bestFor)[0],
        why: firstComparisonPublicCopy([soft.shortDescription]),
      };
    })
    .filter(Boolean) as ComparisonPageModel["alternatives"];

  const guides = [
    ...(comparison.categorySlug
      ? getGuidesByCategory(comparison.categorySlug)
      : []),
    ...getGuidesByProduct(slugA),
    ...getGuidesByProduct(slugB),
  ]
    .filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i)
    .slice(0, 4)
    .map((g) => ({ href: `/guides/${g.slug}/`, title: g.title }));

  const sources = [
    ...sourcesA.map((s) => ({
      id: s.id,
      title: s.title ?? s.id,
      type: s.sourceType,
      url: s.url,
      productSlug: slugA,
    })),
    ...sourcesB.map((s) => ({
      id: s.id,
      title: s.title ?? s.id,
      type: s.sourceType,
      url: s.url,
      productSlug: slugB,
    })),
  ].slice(0, 24);

  const screenshotCount =
    productA.screenshots.length + productB.screenshots.length;

  const availableTabs: ComparisonPageTabId[] = [
    "overview",
    "scorecard",
    ...(featureGroups.length > 0 ? (["features"] as const) : []),
    ...(comparison.categorySlug === "crm" ||
    productA.startingPriceLabel ||
    productB.startingPriceLabel ||
    comparison.pricingNotes
      ? (["pricing"] as const)
      : []),
    ...(productA.pros.length +
      productA.cons.length +
      productB.pros.length +
      productB.cons.length >
    0
      ? (["pros-cons"] as const)
      : []),
    ...(screenshotCount > 0 ? (["screenshots"] as const) : []),
    "evidence",
    "faq",
  ];

  const researched = comparison.metadata.researchStatus === "complete";
  const provisional =
    comparison.editorialStatus !== "approved" ||
    comparison.metadata.researchStatus !== "complete";

  const subtitle =
    comparisonPublicCopy(comparison.summary) ??
    `Compare ${nameA} and ${nameB} on features, pricing, and buyer fit using the same researched criteria.`;

  const discovery = categoryDiscovery(comparison.categorySlug);

  return {
    slug: comparison.slug,
    title: comparison.title,
    subtitle,
    lastUpdated: formatUpdated(
      comparison.metadata.updatedAt || comparison.metadata.publishedAt,
    ),
    provisional,
    researched,
    categorySlug: comparison.categorySlug,
    categoryLabel: discovery.categoryLabel,
    methodologyHref: COMPANY_ROUTES.methodology,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
    methodologyVersion: comparison.methodologyVersion,
    evidenceSourceCount: sources.length || sourcesA.length + sourcesB.length,
    screenshotCount,
    featureCount,
    productA,
    productB,
    overallWinnerKind: overallKind,
    overallLabel,
    verdict: verdictText,
    winsA,
    winsB,
    ties,
    depends,
    criteria,
    decisionCards,
    keyDifferences,
    featureGroups,
    pricing: {
      notes: comparisonPublicCopy(comparison.pricingNotes) ?? undefined,
      showEstimator: Boolean(snapA || snapB),
      defaultSeats: 15,
      verifiedAt: formatUpdated(
        productA.pricingVerifiedAt || productB.pricingVerifiedAt,
      ),
      cardA: {
        starting: productA.startingPriceLabel,
        freePlan: productA.freePlanLabel,
        trial: productA.trialLabel,
        plans: plansFromEnrichment(enA?.pricing, currencyA),
      },
      cardB: {
        starting: productB.startingPriceLabel,
        freePlan: productB.freePlanLabel,
        trial: productB.trialLabel,
        plans: plansFromEnrichment(enB?.pricing, currencyB),
      },
      estimateA: estimateLabel(snapA),
      estimateB: estimateLabel(snapB),
      unitA,
      unitB,
    },
    relatedComparisons: related,
    alternatives,
    guides,
    faq: buildFaq(nameA, nameB, {
      overallLabel,
      verdict: verdictText,
      winsA,
      winsB,
      criteria,
      productA,
      productB,
      categoryLabel: discovery.categoryLabel,
    }),
    sources,
    availableTabs,
    finderHref: discovery.finderHref,
    finderLabel: discovery.finderLabel,
    costCalculatorHref: discovery.costCalculatorHref,
  };
}

export function getComparisonBySlugUnfiltered(slug: string): Comparison | undefined {
  return getAllComparisonsUnfiltered().find((c) => c.slug === slug);
}
