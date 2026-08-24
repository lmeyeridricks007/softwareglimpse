import type { GuidePage, Software } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { loadReview } from "@/data/editorial/store";
import {
  TIER_2_DEEPEN_PRODUCT_SLUGS,
  tier2WhatIsScheduledAt,
} from "@/data/config/publishing/tier-2-deepen-launch-2026-09-01";
import {
  bestContentId,
  softwareContentId,
  toolContentId,
} from "@/services/publishing/ids";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

export type CategoryDeepenLinks = {
  categorySlug: string;
  bestPageSlug: string;
  categoryWhatIs: string;
  chooseGuide: string;
  evaluationGuide?: string;
  finderToolId?: string;
};

const CATEGORY_DEEPEN_LINKS: Record<string, CategoryDeepenLinks> = {
  crm: {
    categorySlug: "crm",
    bestPageSlug: "crm-software",
    categoryWhatIs: "what-is-crm",
    chooseGuide: "how-to-choose-crm",
    evaluationGuide: "crm-evaluation-guide",
    finderToolId: "crm-finder",
  },
  "sales-intelligence": {
    categorySlug: "sales-intelligence",
    bestPageSlug: "sales-intelligence-software",
    categoryWhatIs: "what-is-sales-intelligence",
    chooseGuide: "how-to-choose-sales-intelligence",
    evaluationGuide: "sales-intelligence-evaluation-guide",
    finderToolId: "sales-intelligence-finder",
  },
  "email-marketing": {
    categorySlug: "email-marketing",
    bestPageSlug: "email-marketing-software",
    categoryWhatIs: "what-is-email-marketing",
    chooseGuide: "how-to-choose-email-marketing-software",
    evaluationGuide: "email-marketing-evaluation-guide",
  },
  marketing: {
    categorySlug: "marketing",
    bestPageSlug: "marketing-software",
    categoryWhatIs: "what-is-marketing-software",
    chooseGuide: "how-to-choose-marketing-software",
    evaluationGuide: "marketing-software-evaluation-guide",
  },
  "business-communications": {
    categorySlug: "business-communications",
    bestPageSlug: "business-communications-software",
    categoryWhatIs: "what-is-business-communications-software",
    chooseGuide: "how-to-choose-business-communications-software",
    evaluationGuide: "business-communications-evaluation-guide",
  },
  "voip-business-phone": {
    categorySlug: "voip-business-phone",
    bestPageSlug: "voip-business-phone-software",
    categoryWhatIs: "what-is-voip-business-phone-software",
    chooseGuide: "how-to-choose-voip-business-phone-software",
    evaluationGuide: "voip-business-phone-evaluation-guide",
  },
  hr: {
    categorySlug: "hr",
    bestPageSlug: "hr-software",
    categoryWhatIs: "what-is-hr-software",
    chooseGuide: "how-to-choose-hr-software",
    evaluationGuide: "hr-evaluation-guide",
    finderToolId: "hr-finder",
  },
  ecommerce: {
    categorySlug: "ecommerce",
    bestPageSlug: "ecommerce-software",
    categoryWhatIs: "what-is-ecommerce-software",
    chooseGuide: "how-to-choose-ecommerce-software",
    evaluationGuide: "ecommerce-evaluation-guide",
  },
  "accounting-finance": {
    categorySlug: "accounting-finance",
    bestPageSlug: "accounting-finance-software",
    categoryWhatIs: "what-is-accounting-finance-software",
    chooseGuide: "how-to-choose-accounting-finance-software",
    evaluationGuide: "accounting-finance-evaluation-guide",
    finderToolId: "accounting-finance-finder",
  },
  "social-media-marketing": {
    categorySlug: "social-media-marketing",
    bestPageSlug: "social-media-marketing-software",
    categoryWhatIs: "what-is-social-media-marketing-software",
    chooseGuide: "how-to-choose-social-media-marketing-software",
    evaluationGuide: "social-media-marketing-evaluation-guide",
    finderToolId: "social-media-marketing-finder",
  },
  "social-media-management": {
    categorySlug: "social-media-management",
    bestPageSlug: "social-media-management-software",
    categoryWhatIs: "what-is-social-media-management-software",
    chooseGuide: "how-to-choose-social-media-management-software",
    evaluationGuide: "social-media-management-evaluation-guide",
    finderToolId: "marketing-finder",
  },
  "landing-pages-cro": {
    categorySlug: "landing-pages-cro",
    bestPageSlug: "landing-pages-cro-software",
    categoryWhatIs: "what-is-landing-pages-cro-software",
    chooseGuide: "how-to-choose-landing-pages-cro-software",
    evaluationGuide: "landing-pages-cro-evaluation-guide",
    finderToolId: "marketing-finder",
  },
  "ppc-advertising": {
    categorySlug: "ppc-advertising",
    bestPageSlug: "ppc-advertising-software",
    categoryWhatIs: "what-is-ppc-advertising-software",
    chooseGuide: "how-to-choose-ppc-advertising-software",
    evaluationGuide: "ppc-advertising-evaluation-guide",
    finderToolId: "marketing-finder",
  },
  "webinar-virtual-events": {
    categorySlug: "webinar-virtual-events",
    bestPageSlug: "webinar-virtual-events-software",
    categoryWhatIs: "what-is-webinar-virtual-events-software",
    chooseGuide: "how-to-choose-webinar-virtual-events-software",
    evaluationGuide: "webinar-virtual-events-evaluation-guide",
    finderToolId: "webinar-virtual-events-finder",
  },
  "lms-course-creation": {
    categorySlug: "lms-course-creation",
    bestPageSlug: "lms-course-creation-software",
    categoryWhatIs: "what-is-lms-course-creation-software",
    chooseGuide: "how-to-choose-lms-course-creation-software",
    evaluationGuide: "lms-course-creation-evaluation-guide",
  },
  "website-digital-presence": {
    categorySlug: "website-digital-presence",
    bestPageSlug: "website-digital-presence-software",
    categoryWhatIs: "what-is-website-digital-presence-software",
    chooseGuide: "how-to-choose-website-digital-presence-software",
    evaluationGuide: "website-digital-presence-evaluation-guide",
  },
  "analytics-bi": {
    categorySlug: "analytics-bi",
    bestPageSlug: "analytics-bi-software",
    categoryWhatIs: "what-is-analytics-bi-software",
    chooseGuide: "how-to-choose-analytics-bi-software",
    evaluationGuide: "analytics-bi-evaluation-guide",
  },
  "field-service-operations": {
    categorySlug: "field-service-operations",
    bestPageSlug: "field-service-operations-software",
    categoryWhatIs: "what-is-field-service-operations-software",
    chooseGuide: "how-to-choose-field-service-operations-software",
    evaluationGuide: "field-service-operations-evaluation-guide",
  },
  "reputation-reviews": {
    categorySlug: "reputation-reviews",
    bestPageSlug: "reputation-reviews-software",
    categoryWhatIs: "what-is-reputation-reviews-software",
    chooseGuide: "how-to-choose-reputation-reviews-software",
    evaluationGuide: "reputation-reviews-evaluation-guide",
  },
  "ai-writing": {
    categorySlug: "ai-writing",
    bestPageSlug: "ai-writing-software",
    categoryWhatIs: "what-is-ai-writing-software",
    chooseGuide: "how-to-choose-ai-writing-software",
    evaluationGuide: "ai-writing-evaluation-guide",
  },
  "ai-website-builder": {
    categorySlug: "ai-website-builder",
    bestPageSlug: "ai-website-builder-software",
    categoryWhatIs: "what-is-ai-website-builder-software",
    chooseGuide: "how-to-choose-ai-website-builder-software",
    evaluationGuide: "ai-website-builder-evaluation-guide",
  },
  "live-chat": {
    categorySlug: "live-chat",
    bestPageSlug: "live-chat-software",
    categoryWhatIs: "what-is-live-chat-software",
    chooseGuide: "how-to-choose-live-chat-software",
    evaluationGuide: "live-chat-evaluation-guide",
    finderToolId: "customer-service-finder",
  },
  "helpdesk-ticketing": {
    categorySlug: "helpdesk-ticketing",
    bestPageSlug: "helpdesk-ticketing-software",
    categoryWhatIs: "what-is-helpdesk-ticketing-software",
    chooseGuide: "how-to-choose-helpdesk-ticketing-software",
    evaluationGuide: "helpdesk-ticketing-evaluation-guide",
    finderToolId: "customer-service-finder",
  },
  "dropshipping-pod": {
    categorySlug: "dropshipping-pod",
    bestPageSlug: "dropshipping-pod-software",
    categoryWhatIs: "what-is-dropshipping-pod-software",
    chooseGuide: "how-to-choose-dropshipping-pod-software",
    evaluationGuide: "dropshipping-pod-evaluation-guide",
    finderToolId: "ecommerce-finder",
  },
  "fulfillment-shipping": {
    categorySlug: "fulfillment-shipping",
    bestPageSlug: "fulfillment-shipping-software",
    categoryWhatIs: "what-is-fulfillment-shipping-software",
    chooseGuide: "how-to-choose-fulfillment-shipping-software",
    evaluationGuide: "fulfillment-shipping-evaluation-guide",
    finderToolId: "ecommerce-finder",
  },
  "ats-recruiting": {
    categorySlug: "ats-recruiting",
    bestPageSlug: "ats-recruiting-software",
    categoryWhatIs: "what-is-ats-recruiting-software",
    chooseGuide: "how-to-choose-ats-recruiting-software",
    evaluationGuide: "ats-recruiting-evaluation-guide",
    finderToolId: "hr-finder",
  },
  "time-attendance": {
    categorySlug: "time-attendance",
    bestPageSlug: "time-attendance-software",
    categoryWhatIs: "what-is-time-attendance-software",
    chooseGuide: "how-to-choose-time-attendance-software",
    evaluationGuide: "time-attendance-evaluation-guide",
    finderToolId: "hr-finder",
  },
  "web-hosting": {
    categorySlug: "web-hosting",
    bestPageSlug: "web-hosting-software",
    categoryWhatIs: "what-is-web-hosting-software",
    chooseGuide: "how-to-choose-web-hosting-software",
    evaluationGuide: "web-hosting-evaluation-guide",
    finderToolId: "it-development-finder",
  },
  itsm: {
    categorySlug: "itsm",
    bestPageSlug: "itsm-software",
    categoryWhatIs: "what-is-itsm-software",
    chooseGuide: "how-to-choose-itsm-software",
    evaluationGuide: "itsm-evaluation-guide",
    finderToolId: "it-development-finder",
  },
  "project-management": {
    categorySlug: "project-management",
    bestPageSlug: "project-management-software",
    categoryWhatIs: "what-is-project-management-software",
    chooseGuide: "how-to-choose-project-management-software",
    evaluationGuide: "project-management-evaluation-guide",
  },
  ai: {
    categorySlug: "ai",
    bestPageSlug: "ai-software",
    categoryWhatIs: "what-is-ai-software",
    chooseGuide: "how-to-choose-ai-software",
    evaluationGuide: "ai-evaluation-guide",
  },
  "it-development": {
    categorySlug: "it-development",
    bestPageSlug: "it-development-software",
    categoryWhatIs: "what-is-it-development-software",
    chooseGuide: "how-to-choose-it-development-software",
    evaluationGuide: "it-development-evaluation-guide",
  },
};

function clusterLabel(software: Software): string {
  const primary = software.useCaseSlugs[0];
  if (primary) return primary.replace(/-/g, " ");
  return `${software.primaryCategorySlug.replace(/-/g, " ")} software`;
}

function categoryLinks(software: Software): CategoryDeepenLinks {
  return (
    CATEGORY_DEEPEN_LINKS[software.primaryCategorySlug] ?? {
      categorySlug: software.primaryCategorySlug,
      bestPageSlug: `${software.primaryCategorySlug}-software`,
      categoryWhatIs: `what-is-${software.primaryCategorySlug}-software`,
      chooseGuide: `how-to-choose-${software.primaryCategorySlug}-software`,
    }
  );
}

function relatedBlocks(
  software: Software,
  links: CategoryDeepenLinks,
): GuideBlockInput {
  const name = software.name;
  const slug = software.slug;
  const items: Array<{
    href: string;
    label: string;
    description: string;
  }> = [
    {
      href: `/software/${slug}/`,
      label: `${name} review`,
      description: "Criteria, pricing notes, and cluster peers.",
    },
    {
      href: `/guides/is-${slug}-worth-it/`,
      label: `Is ${name} worth it?`,
      description: "Product-scoped worth-it guide from the 5-kind pack.",
    },
    {
      href: `/best/${links.bestPageSlug}/`,
      label: `Best ${links.categorySlug.replace(/-/g, " ")} software`,
      description: "Editor's picks by job cluster — not one undifferentiated ranking.",
    },
    {
      href: `/guides/${links.chooseGuide}/`,
      label: `How to choose ${links.categorySlug.replace(/-/g, " ")} software`,
      description: "Name the job before you shortlist brands.",
    },
  ];
  if (links.evaluationGuide) {
    items.push({
      href: `/guides/${links.evaluationGuide}/`,
      label: `${links.categorySlug.replace(/-/g, " ")} evaluation guide`,
      description: "Same trial script for every finalist.",
    });
  }

  return {
    type: "related-content",
    id: "related",
    title: "Related",
    links: items,
  };
}

export type ProductWhatIsDeepenVariant = "affiliate" | "editorial-anchor";

export type BuildProductWhatIsDeepenGuideOptions = {
  scheduledAt?: string;
  variant?: ProductWhatIsDeepenVariant;
  stamp?: string;
};

function whatIsBlocks(
  software: Software,
  links: CategoryDeepenLinks,
  cluster: string,
  body: string,
  verdict: string,
  variant: ProductWhatIsDeepenVariant,
): GuideBlockInput[] {
  const name = software.name;
  const slug = software.slug;
  const finderHref = links.finderToolId
    ? `/tools/${links.finderToolId}/`
    : "/tools/software-finder/";
  const finderLabel = links.finderToolId
    ? `${links.categorySlug.replace(/-/g, " ")} Finder →`
    : "Software Finder →";
  const independenceNote =
    variant === "editorial-anchor"
      ? "Editorial anchor — no affiliate relationship; scores exclude commercial incentives."
      : "Affiliate economics excluded from scores";

  return [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${body} Decision rule: shortlist ${name} only when ${cluster} is the primary job for your team.`,
      bullets: [cluster, "Published pricing — confirm live", independenceNote],
    },
    {
      type: "key-takeaways",
      id: "kt",
      title: "Key takeaways",
      items: [
        {
          label: "Primary job",
          body: `Evaluate ${name} inside the ${cluster} cluster — not as a generic ${links.categorySlug} catch-all.`,
        },
        {
          label: "Worth-it next",
          body: `Read the ${name} review and the is-${slug}-worth-it guide before you trial.`,
        },
        {
          label: "How we decide",
          body:
            variant === "editorial-anchor"
              ? "Research-grounded editorial judgment — handsOnTesting=false. Category leader without affiliate."
              : "Research-grounded editorial judgment — handsOnTesting=false. No affiliate ranking.",
        },
      ],
    },
    {
      type: "decision-framework",
      id: "framework",
      title: `When ${name} belongs on a shortlist`,
      steps: [
        { id: "job", label: "Name the job", short: cluster },
        { id: "fit", label: "Match the weekly ritual", short: "Review + worth-it" },
        { id: "plan", label: "Price the qualifying plan", short: "Not the teaser tile" },
        { id: "trial", label: "Trial one real workflow", short: "Same script as peers" },
      ],
      ctaHref: finderHref,
      ctaLabel: finderLabel,
    },
    {
      type: "step",
      id: "worked",
      stepNumber: 1,
      heading: `What ${name} is (and is not)`,
      body: `${body}\n\nWorked example: a buyer writes the weekly outcome first, then checks whether ${name}'s cluster matches — instead of buying on brand familiarity.\n\n${verdict}`,
      tip: `Compare inside the same job cluster. See Best ${links.categorySlug.replace(/-/g, " ")} software for editor's picks.`,
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: `What category is ${name} on SoftwareGlimpse?`,
          answer: `${name} is catalogued under ${links.categorySlug.replace(/-/g, " ")} with primary job cluster: ${cluster}.`,
        },
        {
          question: `Is ${name} worth it?`,
          answer: `See the dedicated is-${slug}-worth-it guide and the ${name} review — not a single score on this page.`,
        },
      ],
    },
    relatedBlocks(software, links),
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "Read the review, then the worth-it guide. Confirm live commercial terms.",
      href: `/software/${slug}/`,
      ctaLabel: `${name} review →`,
      variant: "generic",
    },
  ];
}

export function buildProductWhatIsDeepenGuide(
  productSlug: string,
  options: BuildProductWhatIsDeepenGuideOptions = {},
): GuidePage {
  const software = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!software) {
    throw new Error(`Product what-is deepen: missing software seed for ${productSlug}`);
  }

  const variant = options.variant ?? "affiliate";
  const stamp = options.stamp ?? "2026-08-23T12:45:00.000Z";
  const review = loadReview(productSlug);
  const links = categoryLinks(software);
  const cluster = clusterLabel(software);
  const slug = `what-is-${productSlug}`;
  const scheduledAt = options.scheduledAt;
  const isScheduled = scheduledAt !== undefined;
  const title = `What Is ${software.name}?`;
  const body =
    review?.intro?.trim() ||
    software.shortDescription ||
    `${software.name} is ${cluster} software on SoftwareGlimpse.`;
  const verdict =
    review?.verdict?.trim() ||
    review?.summary?.trim() ||
    `Confirm fit on the ${software.name} review before you shortlist.`;
  const summary = `${software.name} as ${cluster} software — what it is, who it is for, and how it differs from peers in ${links.categorySlug}.`;

  return {
    id: `guide-${slug}`,
    slug,
    title,
    summary,
    categorySlugs: [links.categorySlug],
    productSlugs: [productSlug],
    topicType: "fundamental",
    journeyStage: "learn",
    heroVisual: {
      src: `/guides/${slug}-hero.png`,
      alt: `Educational illustration for ${title}.`,
    },
    supports: [
      {
        contentId: softwareContentId(productSlug),
        relationType: "supports-anchor",
        primary: true,
      },
      {
        contentId: bestContentId(links.bestPageSlug),
        relationType: "supports-anchor",
        primary: false,
      },
      ...(links.finderToolId
        ? [
            {
              contentId: toolContentId(links.finderToolId),
              relationType: "supports-anchor" as const,
              primary: false,
            },
          ]
        : []),
    ],
    nextAction: {
      contentId: softwareContentId(productSlug),
      label: `Read the ${software.name} review`,
    },
    relatedGuideSlugs: [
      `is-${productSlug}-worth-it`,
      links.categoryWhatIs,
      links.chooseGuide,
      ...(links.evaluationGuide ? [links.evaluationGuide] : []),
    ],
    blocks: whatIsBlocks(
      software,
      links,
      cluster,
      body,
      verdict,
      variant,
    ) as GuidePage["blocks"],
    checklist: [
      {
        id: "job-cluster",
        label: `${cluster} is the primary job`,
        description: `Shortlist ${software.name} only when this cluster matches your weekly ritual.`,
        order: 0,
      },
      {
        id: "review",
        label: "Review + worth-it read",
        description: `Read /software/${productSlug}/ and /guides/is-${productSlug}-worth-it/ before trialing.`,
        order: 1,
      },
      {
        id: "qualifying-plan",
        label: "Qualifying plan is modelled",
        description: "Confirm live packaging — not the marketing teaser tile.",
        order: 2,
      },
    ],
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: isScheduled
      ? {
          status: "scheduled",
          scheduledAt,
          updatedAt: stamp,
          reviewedAt: stamp,
          researchStatus: "complete",
          author: "author-lee-meyeridricks",
        }
      : {
          status: "published",
          updatedAt: stamp,
          publishedAt: stamp,
          reviewedAt: stamp,
          researchStatus: "complete",
          author: "author-lee-meyeridricks",
        },
    seo: {
      title: `${title} | SoftwareGlimpse`,
      description: summary.slice(0, 160),
      canonicalPath: `/guides/${slug}/`,
      indexable: !isScheduled,
    },
  };
}

export function buildAffiliateDeepenWhatIsGuide(productSlug: string): GuidePage {
  const slug = `what-is-${productSlug}`;
  return buildProductWhatIsDeepenGuide(productSlug, {
    scheduledAt: tier2WhatIsScheduledAt(slug),
    variant: "affiliate",
  });
}

export function buildAllAffiliateDeepenWhatIsGuides(): GuidePage[] {
  return TIER_2_DEEPEN_PRODUCT_SLUGS.map((slug) =>
    buildAffiliateDeepenWhatIsGuide(slug),
  );
}
