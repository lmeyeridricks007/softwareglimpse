import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier29GuideScheduledAt } from "@/data/config/publishing/tier-29-web-hosting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "web-hosting-pricing-guide";
const SCHEDULED_AT = tier29GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Web hosting pricing mixes per-server panel licences, managed WordPress tiers, and PaaS resource bundles. Plesk Web Admin Edition starts from $16.99/mo on VPS licensing — confirm live terms for edition, server count, and managed add-ons. Compare licence edition and server or site limits, not headline tiles alone.",
    bullets: [
      "Per-server panel licences",
      "Edition and feature tier gates",
      "Managed WordPress / PaaS bundles",
      "Backup and SSL add-ons",
      "Domain and DNS packaging",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your server or site count, then shortlist inside the hosting cluster.",
    href: "/best/web-hosting-software/",
    ctaLabel: "Best web hosting software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T21:00:00.000Z",
        publishedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const webHostingPricingGuide: GuidePage = {
  id: "guide-web-hosting-pricing-guide",
  slug: SLUG,
  title: "Web Hosting Pricing Guide",
  summary:
    "Panel licences, managed WordPress tiers, and PaaS bundles for web hosting platforms.",
  categorySlugs: ["web-hosting", "it-development"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:web-hosting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-web-hosting-software",
    "how-to-choose-web-hosting-software",
    "web-hosting-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Web Hosting Pricing Guide | SoftwareGlimpse",
    description:
      "Compare panel licence, managed WordPress, and PaaS pricing for web hosting software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
