import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const projectManagementPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Project management pricing is usually a per-seat licence plus everything that sits on top of it: plan minimums, feature gates for timelines and automations, and AI credit or add-on bundles. Decision rule: never compare the advertised per-user tile; compare the total for your real seat count on the tier that unlocks your must-have views and automations.",
    bullets: [
      "Per-seat licence",
      "Plan / seat minimums",
      "View & automation gates",
      "AI credits / add-ons",
      "Guest / external user rules",
      "Annual vs monthly",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "A cheap seat that lacks timeline or automation forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "AI credits change TCO",
        body: "When AI is metered, estimate monthly usage instead of treating AI as free marketing copy.",
      },
      {
        label: "Guests and viewers matter",
        body: "Client or contractor access may be free, limited, or billed. Count external collaborators honestly.",
      },
      {
        label: "Specialists price differently",
        body: "PowerPoint add-ins, PDF licences, remote-desktop seats, and desktop shells are not comparable to work OS seats on a per-user tile alone.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "seats", label: "Seats", short: "Real licence count" },
      { id: "tier", label: "Tier", short: "Feature gates" },
      { id: "automation", label: "Automation", short: "Caps & recipes" },
      { id: "ai", label: "AI", short: "Credits / bundles" },
      { id: "guests", label: "Guests", short: "External access" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/project-management-software/",
    ctaLabel: "See Best Project Management Software →",
    figure: {
      src: "/guides/project-management-pricing-guide-stack.png",
      alt: "Project management cost stack: seats, plan gates, automation caps, AI credits, and guest access.",
      caption: "The seat price is the bottom layer. Gates and credits often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: seat count, must-have views, expected automations, and whether AI is required. Total the qualifying plan, then add estimated AI/add-ons.\n\nWorked example: Northline Ops needs 12 seats with timeline and automations. Vendor A’s entry plan is cheaper per seat but timeline unlocks mid-tier — so the honest comparison is mid-tier × 12, not the starter tile.",
    tip: "Ask for a written quote on the qualifying plan for your seat count.",
    figure: {
      src: "/guides/project-management-pricing-worked-example.png",
      alt: "Worked example comparing two work OS quotes at the same seat count with plan-gate effects.",
      caption: "Same team, same requirements — the cheaper tile is not always the cheaper deployment once gates apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does project management software cost?",
        answer:
          "Work OS products are typically priced per seat with plan tiers. Exact floors change — confirm live vendor pricing. Specialists (timeline add-ins, PDF, remote desktop, desktop shells) use different licence models.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted but locks seat count. If headcount is uncertain, price both.",
      },
      {
        question: "Do affiliate deals change our advice?",
        answer:
          "No. SoftwareGlimpse methodology excludes affiliate economics from rankings and pricing guidance.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/project-management-software/",
    ctaLabel: "Best project management software →",
    variant: "finder",
  },
];

export const projectManagementPricingGuide: GuidePage = {
  id: "guide-project-management-pricing-guide",
  slug: "project-management-pricing-guide",
  title: "Project Management Pricing Guide",
  summary: "Budget work OS and adjacent productivity tools by qualifying tier — not the advertised starter seat.",
  categorySlugs: ["project-management"],
    topicType: "pricing-education",
    heroVisual: {
    src: "/guides/project-management-pricing-guide-hero.png",
    alt: "Educational illustration for Project Management Pricing Guide.",
  },
    supports: [
    {
      contentId: "content:category:project-management",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:project-management-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-project-management-software",
    "how-to-choose-project-management-software",
    "project-management-pricing-guide",
    "project-management-requirements-guide",
    "project-management-evaluation-guide",
  ].filter((s) => s !== "project-management-pricing-guide"),
  blocks: projectManagementPricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T18:00:00.000Z",
    publishedAt: "2026-08-17T18:00:00.000Z",
    reviewedAt: "2026-08-17T18:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Project Management Pricing Guide | SoftwareGlimpse",
    description: "How to budget project management software — seats, plan gates, automations, AI credits, and guest access.",
    canonicalPath: "/guides/project-management-pricing-guide/",
    indexable: true,
  },
};
