import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const aiPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI software pricing is usually per seat, per credit or token pack, per GPU hour, per conversation or minute cap, or as an add-on Copilot SKU — plus overage. Decision rule: never compare the advertised starter tile; compare the total for your real headcount and usage on the configuration that unlocks your must-have models, agents, or commercial terms.",
    bullets: [
      "Seats",
      "Credits / tokens",
      "GPU hours",
      "Conversation / minute caps",
      "Add-on Copilot SKUs",
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
        body: "A cheap tile that blocks custom GPTs, stealth stills, video credits, or SSO forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Units are not comparable on a tile alone",
        body: "Per-seat LLM assistants, GPU-hour image tools, credit-priced video, and Copilot add-on SKUs need a volume model for the same team.",
      },
      {
        label: "Credits stack on the core",
        body: "Token packs, GPU hours, and minute caps can exceed seat cost. Treat usage as a line item, not a free checkbox.",
      },
      {
        label: "Copilot SKUs are different purchases",
        body: "Microsoft 365 Copilot is an add-on to Microsoft 365. GitHub Copilot is a coding seat. Do not compare those tiles to ChatGPT Plus as if they were the same SKU.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "seats", label: "Seats", short: "Real headcount" },
      { id: "usage", label: "Usage", short: "Credits / tokens / GPU" },
      { id: "gates", label: "Gates", short: "Must-have models" },
      { id: "sku", label: "SKU", short: "Copilot add-ons" },
      { id: "caps", label: "Caps", short: "Minutes / chats" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/ai-software/",
    ctaLabel: "See Best AI Software →",
    figure: {
      src: "/guides/ai-pricing-guide-stack.png",
      alt: "AI cost stack: seats, credits or tokens, GPU hours, Copilot SKUs, and caps.",
      caption:
        "The starter tile is the bottom layer. Credits, GPU hours, and add-on SKUs often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: people who need access, monthly tokens or credits, GPU hours or video minutes, must-have models or agents, and whether a Copilot add-on is in scope. Total the qualifying configuration.\n\nWorked example: Harbor Labs needs 12 knowledge-work seats plus 8 engineering seats with agent-loop usage. Vendor A’s Plus tile looks cheaper until Business connectors unlock; Vendor B’s coding credit pack looks expensive until you include overage. The honest comparison is qualifying config × usage, not the homepage tile.",
    tip: "Ask for a written quote on the qualifying configuration for your seats and usage units.",
    figure: {
      src: "/guides/ai-pricing-guide-worked-example.png",
      alt: "Worked example comparing two AI quotes at the same headcount with credit and SKU effects.",
      caption:
        "Same team, same requirements — the cheaper tile is not always the cheaper deployment once credits and Copilot SKUs apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does AI software cost?",
        answer:
          "Models vary: free caps, published personal seats, credit or token packs, GPU-hour image plans, minute-capped meeting tools, and quote-led Copilot add-ons. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted but locks seats and credit pools. If campaign or launch spikes drive GPU or video usage, price both annual and overage.",
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
    href: "/best/ai-software/",
    ctaLabel: "Best AI software →",
    variant: "finder",
  },
];

export const aiPricingGuide: GuidePage = {
  id: "guide-ai-pricing-guide",
  slug: "ai-pricing-guide",
  title: "AI Software Pricing Guide",
  summary:
    "Budget LLM assistants, coding tools, image and video, meeting notes, and specialist AI by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["ai"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/ai-pricing-guide-hero.png",
    alt: "Educational illustration for AI Software Pricing Guide.",
  },
  supports: [
    {
      contentId: "content:category:ai",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:ai-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-ai-software",
    "how-to-choose-ai-software",
    "ai-requirements-guide",
    "ai-evaluation-guide",
  ],
  blocks: aiPricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "AI Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget AI software — seats, credits and tokens, GPU hours, conversation or minute caps, and add-on Copilot SKUs.",
    canonicalPath: "/guides/ai-pricing-guide/",
    indexable: true,
  },
};
