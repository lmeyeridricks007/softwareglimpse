import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseEmailMarketingBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose email marketing software by the primary job you need done — recurring newsletters, design-led campaigns, multi-step automation, ecommerce journeys, or an all-in-one creator stack — not by brand familiarity or an “all-in-one” badge alone. Name the one job blocking list growth or revenue this quarter, then shortlist only tools whose core product is that job and whose contact tiers, send limits, and automation depth survive your real workflow.",
    bullets: [
      "Primary job to be done",
      "Contact / subscriber tier",
      "Automation depth needed",
      "Editor & template quality",
      "Integrations (CRM / shop)",
      "Deliverability basics",
      "Trial on your real list shape",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Email marketing” is several products",
        body: "Newsletter tools, automation platforms, ecommerce email, and funnel suites fail for different reasons. Pick the shape first.",
      },
      {
        label: "Contact tiers are the real price",
        body: "Compare published floors for your list size and send caps — not marketing “from” tiles for a tiny starter list.",
      },
      {
        label: "Automation gates hide on higher plans",
        body: "Entry tiers often cap journeys, branching, or AI. Map must-have workflows to the qualifying plan before you fall in love with a demo.",
      },
      {
        label: "Integrations decide daily work",
        body: "CRM, ecommerce, and form tools must sync cleanly or you will rebuild segments by hand every week.",
      },
      {
        label: "Deliverability is yours to operate",
        body: "Vendors help with SPF/DKIM/DMARC guidance; list hygiene and send reputation still need a team owner.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Four worked examples",
    src: "/guides/how-to-choose-email-marketing-needs.png",
    alt: "Four worked examples of email marketing buying: creator newsletter, SMB automation, ecommerce cart recovery, and agency multi-brand campaigns.",
    caption:
      "Four teams, one category, four different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive email marketing selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Newsletters / campaigns",
          "Multi-step automation",
          "Ecommerce journeys",
          "All-in-one funnels + email",
          "Two or more of these",
        ],
      },
      {
        id: "list-size",
        label: "Approximate list size",
        options: [
          "Under 1,000",
          "1,000–10,000",
          "10,000–50,000",
          "50,000+",
        ],
      },
      {
        id: "team-shape",
        label: "Who runs email",
        options: [
          "Solo / founder",
          "1–2 marketers",
          "Marketing + ecommerce",
          "Agency / multi-brand",
        ],
      },
      {
        id: "stack",
        label: "Must connect to",
        options: [
          "CRM",
          "Ecommerce store",
          "Forms / landing pages",
          "Minimal integrations",
        ],
      },
      {
        id: "budget",
        label: "Budget posture",
        options: [
          "Need free / freemium start",
          "Paid contact tier OK",
          "Annual if ROI is clear",
        ],
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roadmap",
    title: "Selection workflow",
    steps: [
      { id: "step-job", label: "Primary job" },
      { id: "step-tier", label: "Contact tier" },
      { id: "step-auto", label: "Automation" },
      { id: "step-stack", label: "Integrations" },
      { id: "step-trial", label: "Trial" },
      { id: "step-decide", label: "Decide" },
    ],
    ctaHref: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    figure: {
      src: "/guides/how-to-choose-email-marketing-roadmap.png",
      alt: "Email marketing selection roadmap: job, contact tier, automation, integrations, trial, decide.",
      caption: "Freeze the job and list size before demos — then run the same trial script on every finalist.",
    },
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the primary job before you name a vendor",
    body: "Write one sentence: “We are blocked because we cannot ___ with email this quarter.” Examples: ship a weekly newsletter without design chaos; run cart-abandon and post-purchase journeys; nurture trial leads with branching automations; consolidate funnels and email for a course launch.\n\nExample: Harbor Studio (8-person agency) needs multi-brand templates and client-safe sending more than deepest automation. Northline Goods needs Shopify-connected journeys. Same category — different shortlists. Catalogue ESPs such as GetResponse, Campaign Monitor, AWeber, ActiveCampaign, and Mailchimp are examples of shapes you might shortlist — not ranked winners on this page.",
    tip: "If two jobs are truly equal, pick the harder one as primary — the softer one is usually a nice-to-have on the same platform.",
    scenarios: [
      {
        title: "Newsletter job",
        body: "Recurring editorial sends, templates, and list hygiene beat journey complexity.",
      },
      {
        title: "Automation job",
        body: "Triggers, branching, and workflow limits decide the qualifying plan.",
      },
      {
        title: "Ecommerce job",
        body: "Product blocks, cart events, and store sync matter more than fancy broadcast UI.",
      },
    ],
  },
  {
    type: "step",
    id: "map-tier-and-gates",
    stepNumber: 2,
    heading: "Map contact tier, send caps, and feature gates",
    body: "Estimate active subscribers (not every email you ever collected). Check published contact-tier floors, monthly send limits, and which automation / landing-page features unlock on which plan. Screenshot the exact plan shown in demos — demos often use higher tiers than the “from” tile.\n\nDo not invent dollar totals. Compare vendor-written quotes and pricing pages for the same list-size assumption.",
    tip: "Include suppression and inactive contacts in your count if the vendor bills them — ask in writing.",
  },
  {
    type: "step",
    id: "trial-script",
    stepNumber: 3,
    heading: "Run the same trial script on every shortlisted ESP",
    body: "Import a sample list (or use a staging list), build one campaign and one automation your team actually needs, authenticate the sending domain, send to a seed group, and check reporting you will use weekly. Score every tool on the same card the same day.\n\nWorked example: Harbor Studio scores three finalists. Tool A wins the design demo but caps client subaccounts on the affordable tier. Tool B clears automation with slower templates. Tool C fails domain auth guidance and is dropped — all from one scorecard.",
    tip: "Ban “show us the coolest AI feature” as agenda item one. Run list import, one real journey, and reporting first.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should beginners start on a free plan?",
        answer:
          "Yes for learning workflows — then verify list/send caps and which automation features unlock on paid tiers before you build a program you cannot grow into.",
      },
      {
        question: "Is the most popular ESP the right choice?",
        answer:
          "Popularity is not a requirements sheet. Match job, contact tier, and stack integrations first; brand familiarity is a secondary convenience.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves with the requirements guide, run a fair trial with the evaluation guide, then shortlist on Best Email Marketing Software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related email marketing resources",
    links: [
      {
        href: "/guides/what-is-email-marketing/",
        label: "What is email marketing?",
        description: "Category fundamentals.",
      },
      {
        href: "/guides/email-marketing-requirements-guide/",
        label: "Requirements guide",
        description: "Must vs nice sheet.",
      },
      {
        href: "/guides/email-marketing-evaluation-guide/",
        label: "Evaluation guide",
        description: "Trial scorecard.",
      },
      {
        href: "/guides/email-marketing-pricing-guide/",
        label: "Pricing guide",
        description: "Contact tiers & send limits.",
      },
      {
        href: "/best/email-marketing-software/",
        label: "Best email marketing software",
        description: "Methodology-based shortlist.",
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
    id: "best-cta",
    title: "Compare researched options",
    body: "Open the Best Email Marketing Software shortlist after your job and contact-tier assumptions are frozen — rankings follow published criteria, not commissions.",
    href: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    variant: "finder",
  },
];

export const howToChooseEmailMarketingGuide: GuidePage = {
  id: "guide-how-to-choose-email-marketing",
  slug: "how-to-choose-email-marketing",
  title: "How to Choose Email Marketing Software: Job-First Framework",
  summary:
    "Choose email marketing software by primary job — newsletters, automation, ecommerce, or all-in-one — then map contact tiers, feature gates, and a shared trial script.",
  categorySlugs: ["email-marketing"],
  productSlugs: [
    "getresponse",
    "aweber",
    "campaign-monitor",
    "mailchimp",
    "activecampaign",
  ],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/how-to-choose-email-marketing-hero.png",
    alt: "How to choose email marketing: primary job, contact tier, automation gates, integrations, and shared trial scorecard.",
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
    "what-is-email-marketing",
    "email-marketing-requirements-guide",
    "email-marketing-evaluation-guide",
    "email-marketing-pricing-guide",
  ],
  blocks: howToChooseEmailMarketingBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Freeze primary job",
      description: "One blocking outcome this quarter.",
      order: 0,
    },
    {
      id: "tier",
      label: "Estimate contact tier",
      description: "Same list-size assumption for every quote.",
      order: 1,
    },
    {
      id: "trial",
      label: "Run shared trial script",
      description: "One campaign + one must-have journey.",
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
    title: "How to Choose Email Marketing Software | SoftwareGlimpse",
    description:
      "Job-first framework for choosing email marketing software — newsletters, automation, ecommerce, contact tiers, and a fair trial script.",
    canonicalPath: "/guides/how-to-choose-email-marketing/",
    indexable: true,
  },
};
