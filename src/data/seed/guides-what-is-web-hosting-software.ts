import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier29GuideScheduledAt } from "@/data/config/publishing/tier-29-web-hosting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-web-hosting-software";
const SCHEDULED_AT = tier29GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Web hosting software provisions servers, domains, and site administration through control panels, managed WordPress, VPS, or PaaS hosting — not observability, ITSM ticketing, or git hosting. Decision rule: if the blocking job is a hosting control panel on VPS or dedicated servers, shortlist Plesk-class tools — confirm live terms. Wave-1 hub inventory is thin; expand comparisons as peer depth grows.",
    bullets: [
      "Hosting control panels",
      "VPS and dedicated server admin",
      "Managed WordPress / PaaS",
      "Domain and DNS management",
      "SSL and backup tooling",
      "Not observability, ITSM, or git CI",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Hosting is not the full IT stack",
        body: "Control panels, managed WordPress, and PaaS hosts are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under IT",
        body: "Use the parent IT & development Finder with hosting as the primary job to shortlist.",
      },
      {
        label: "Edition and server count matter",
        body: "Panel edition, server licences, and managed tiers change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by hosting job cluster, then run the IT Finder with hosting as the primary job.",
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

export const whatIsWebHostingSoftwareGuide: GuidePage = {
  id: "guide-what-is-web-hosting-software",
  slug: SLUG,
  title: "What Is Web Hosting Software?",
  summary:
    "Web hosting software for control panels, managed WordPress, and server administration — distinct from observability, ITSM, and git hosting.",
  categorySlugs: ["web-hosting", "it-development"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:web-hosting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-web-hosting-software",
    "web-hosting-pricing-guide",
    "web-hosting-evaluation-guide",
    "web-hosting-vs-it-development-software",
    "what-is-it-development-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Web Hosting Software? | SoftwareGlimpse",
    description:
      "Control panels, managed WordPress, and server admin — how web hosting differs from observability and ITSM.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
