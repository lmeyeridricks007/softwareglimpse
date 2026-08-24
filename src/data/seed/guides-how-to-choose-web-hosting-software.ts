import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier29GuideScheduledAt } from "@/data/config/publishing/tier-29-web-hosting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-web-hosting-software";
const SCHEDULED_AT = tier29GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose web hosting software by the hosting job blocking work — control panel on VPS/dedicated, managed WordPress, or PaaS hosting — then confirm edition limits, server or site count, backup/SSL depth, and DNS integrations. Shortlist only tools whose core product is hosting administration, not observability, ITSM, or source control.",
    bullets: [
      "Primary hosting job",
      "Control panel vs managed WordPress vs PaaS",
      "Server or site licence limits",
      "Backup, SSL, and staging depth",
      "DNS and domain integrations",
      "Trial with one real site or server",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by hosting cluster, then confirm live commercial terms.",
    href: "/tools/it-development-finder/",
    ctaLabel: "IT Finder (hosting primary) →",
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

export const howToChooseWebHostingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-web-hosting-software",
  slug: SLUG,
  title: "How to Choose Web Hosting Software",
  summary:
    "Pick hosting tools by control panel, managed WordPress, or PaaS cluster — not as one generic IT list.",
  categorySlugs: ["web-hosting", "it-development"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:web-hosting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-web-hosting-software",
    "web-hosting-pricing-guide",
    "web-hosting-evaluation-guide",
    "web-hosting-vs-it-development-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Web Hosting Software | SoftwareGlimpse",
    description:
      "Choose web hosting software by hosting job, edition limits, and server or site administration depth.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
