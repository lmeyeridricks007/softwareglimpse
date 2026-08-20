import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Email marketing pricing guide — contact tiers, send limits, first 90 days.
 * Educational only — no invented list prices or dollar totals.
 */
const emailMarketingPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Email marketing pricing is usually driven by contact or subscriber tiers — sometimes with monthly send caps, feature gates, and add-ons — so the headline “from” price rarely matches your first 90 days at real list size. Decision rule: do not compare tools on marketing starting prices; map must-have workflows to the qualifying plan, confirm what counts as a billable contact, then compare written quotes for the same list-size and send-volume assumptions.",
    bullets: [
      "Contact / subscriber tiers",
      "Send caps vs unlimited",
      "Feature-gated plans",
      "What counts as a contact",
      "First-90-day quote compare",
      "No invented dollar totals",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "List size is the bill",
        body: "Most ESPs charge by contacts. Inactive and suppressed contacts may still count — ask in writing.",
      },
      {
        label: "Send caps hide on cheap tiers",
        body: "Lower plans often limit monthly emails even when contact floors look affordable.",
      },
      {
        label: "Automation sits behind gates",
        body: "Journeys, branching, SMS, or dedicated IP often unlock above entry tiers.",
      },
      {
        label: "Bands beat fake precision",
        body: "Use vendor pricing pages and written quotes; never invent market averages or totals in a memo.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing literacy path",
    steps: [
      { id: "model", label: "Model", short: "Contact tiers / usage" },
      { id: "count", label: "Count", short: "Billable contacts" },
      { id: "gates", label: "Gates", short: "Must → plan" },
      { id: "sends", label: "Sends", short: "Monthly volume" },
      { id: "quote", label: "Quote", short: "Written compare" },
    ],
    ctaHref: "/guides/how-to-choose-email-marketing/",
    ctaLabel: "Selection framework →",
    figure: {
      src: "/guides/email-marketing-pricing-guide-90-days.png",
      alt: "Compare email marketing quotes for first 90 days: billable contacts, monthly sends, must-have feature gates, written quote side-by-side.",
      caption:
        "Same list-size and send assumptions for every finalist — then read plan gates side by side.",
    },
  },
  {
    type: "figure",
    id: "models-visual",
    title: "Common pricing models",
    src: "/guides/email-marketing-pricing-guide-models.png",
    alt: "Email marketing pricing model cards: contact tiers, send-capped entry plans, and feature-gated upgrades — no dollar figures.",
    caption:
      "Match the model to usage shape: growing lists lean contact tiers; heavy senders watch caps; automation buyers map gates early.",
  },
  {
    type: "step",
    id: "read-models",
    stepNumber: 1,
    heading: "Recognize contact tiers, send caps, and feature gates",
    body: "Most catalogue ESPs sell plan ladders keyed to contact counts. Some freemium plans cap monthly newsletters or contacts. Automation, landing pages, transactional email, SMS, or dedicated IP often sit above entry tiers — ask how those are licensed without claiming a specific product’s unpublished price as fact.\n\nExample: a solo creator with ~800 subscribers often fits freemium or entry paid tiers (AWeber- or GetResponse-style packaging) if automation needs stay light. A marketing-led SMB running multi-step journeys usually needs the plan that unlocks automation — not the cheapest contact tile.",
    tip: "Screenshot the exact plan name shown in demo — demos often use higher tiers than the “from” tile.",
    figure: {
      src: "/guides/email-marketing-pricing-guide-hero.png",
      alt: "Anatomy of email marketing pricing: contact tiers, send caps, feature gates, and first-90-days quote compare — no dollar amounts.",
      caption:
        "Read commercials bottom-up from billable contacts and must-have gates — not top-down from the cheapest tile.",
    },
    scenarios: [
      {
        title: "Contact-tier subscription",
        body: "Ongoing programs: pay for list size; confirm inactive contact billing.",
      },
      {
        title: "Send-capped entry",
        body: "Cheap or free rungs may limit monthly emails — model real campaign cadence.",
      },
      {
        title: "Feature gates",
        body: "Must-have journeys or ecommerce tools may force an up-tier at the same contact band.",
      },
    ],
  },
  {
    type: "step",
    id: "first-90-days",
    stepNumber: 2,
    heading: "Compare first 90 days on the same volume sheet",
    body: "For every finalist, fill one sheet: starting contacts, expected net-new per month, campaigns per week, one must-have automation, and required integrations. Ask each vendor (or read the pricing page) which plan qualifies — then compare those plans only.\n\nWorked example: Northline Goods models 12,000 contacts and weekly promo + cart journeys. Vendor A’s entry tier fits contacts but locks cart automation; Vendor B’s mid tier clears both. The team compares mid-tier quotes, not entry tiles.",
    tip: "Include a buffer for list growth in 90 days — upgrading mid-launch is expensive in time, not just money.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Do unsubscribed contacts count toward pricing?",
        answer:
          "It depends on the vendor. Some bill only active subscribers; others count broader contact records. Confirm in writing for your shortlist.",
      },
      {
        question: "Are free plans really free?",
        answer:
          "Forever-free and freemium plans exist on some ESPs, usually with contact and send caps and limited automation. Use them to learn — then map paid gates before you scale.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves, then shortlist on Best Email Marketing Software and run the evaluation guide’s trial script on qualifying plans only.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related email marketing resources",
    links: [
      {
        href: "/guides/how-to-choose-email-marketing/",
        label: "How to choose email marketing",
        description: "Job-first selection.",
      },
      {
        href: "/best/email-marketing-software/",
        label: "Best email marketing software",
        description: "Researched shortlist.",
      },
      {
        href: "/guides/email-marketing-requirements-guide/",
        label: "Requirements guide",
        description: "Must-haves before quotes.",
      },
      {
        href: "/categories/email-marketing/",
        label: "Email marketing category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "shortlist-cta",
    title: "Compare researched options",
    body: "Once contact definitions and must-haves are clear, shortlist with the published email marketing methodology — not affiliate-ordered price tiles.",
    href: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    variant: "generic",
  },
];

export const emailMarketingPricingGuide: GuidePage = {
  id: "guide-email-marketing-pricing-guide",
  slug: "email-marketing-pricing-guide",
  title: "Email Marketing Pricing Guide: Contact Tiers & First 90 Days",
  summary:
    "Learn how email marketing pricing works — contact tiers, send caps, feature gates, and how to compare written quotes for the first 90 days — without invented price tables.",
  categorySlugs: ["email-marketing"],
  productSlugs: [
    "getresponse",
    "aweber",
    "campaign-monitor",
    "mailchimp",
    "activecampaign",
  ],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/email-marketing-pricing-guide-hero.png",
    alt: "Email marketing pricing anatomy: contact tiers, send caps, feature gates, and first-90-day quote compare — no dollar totals.",
  },
  supports: [
    {
      contentId: "content:category:email-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:email-marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:email-marketing-software",
    label: "See Best Email Marketing Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-email-marketing",
    "email-marketing-requirements-guide",
    "what-is-email-marketing",
  ],
  blocks: emailMarketingPricingGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "model",
      label: "Name the pricing model",
      description: "Contact tiers, send caps, feature gates.",
      order: 0,
    },
    {
      id: "count",
      label: "Define billable contacts",
      description: "Active vs suppressed vs inactive.",
      order: 1,
    },
    {
      id: "quote",
      label: "Compare first-90-day quotes",
      description: "Same volume sheet for every finalist.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Email Marketing Pricing Guide | SoftwareGlimpse",
    description:
      "Understand email marketing pricing — contact tiers, send caps, feature gates, and how to compare first-90-day quotes — without invented price tables.",
    canonicalPath: "/guides/email-marketing-pricing-guide/",
    indexable: true,
  },
};
