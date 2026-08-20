import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM vs marketing automation — sales system of record vs nurture/campaigns and MQL handoff.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVsMarketingAutomationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Marketing automation owns nurture, campaigns, and lead scoring. CRM owns the sales system of record — contacts, deals, owners, stages, and activity after handoff. Decision rule: if the work is programs and engagement at scale, you need MA; if the work is closing and coaching deals, you need CRM — with an agreed sales-ready handoff between them.",
    bullets: [
      "MA = nurture & campaigns",
      "CRM = sales system of record",
      "MQL handoff is the bridge",
      "Suites blur, jobs differ",
      "Shared lifecycle data",
      "Buy for the primary job",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Different owners, different rhythms",
        body: "Marketing automation optimizes for programs and engagement at scale; CRM optimizes for deal ownership and sales execution.",
      },
      {
        label: "Handoff quality decides blame games",
        body: "Without agreed status definitions and ownership rules, marketing says “black hole” and sales says “junk leads.”",
      },
      {
        label: "A suite is not automatically better",
        body: "Bundled CRM + MA helps when one lifecycle and one admin model are real requirements — not when you only need one job.",
      },
      {
        label: "CRM is not a full campaign engine",
        body: "Light email features inside CRM are not the same job as marketing automation journeys, scoring, and program analytics.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "ma-or-crm",
    title: "How to choose (or combine)",
    steps: [
      { id: "job", label: "Primary job", short: "Nurture vs sell" },
      { id: "volume", label: "Lead volume", short: "Programs vs pipeline" },
      { id: "handoff", label: "Handoff rules", short: "MQL definition" },
      { id: "owners", label: "Data owners", short: "Marketing vs sales" },
      { id: "stack", label: "Stack shape", short: "Separate vs suite" },
      { id: "admin", label: "Admin capacity", short: "Who runs it?" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/crm-vs-ma-choose.png",
      alt: "How to choose or combine CRM and marketing automation: primary job, lead volume, handoff rules, data owners, stack shape, admin capacity.",
      caption:
        "Same buyer journey — different systems by job. Write the handoff before arguing logos.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Marketing automation and CRM in the funnel",
    src: "/guides/crm-vs-marketing-automation-hero.png",
    alt: "Marketing automation nurture and campaigns flowing into a CRM sales pipeline via a handoff stage.",
    caption: "Same buyer journey — different systems by job.",
  },
  {
    type: "step",
    id: "handoff",
    stepNumber: 1,
    heading: "The MQL handoff (or your equivalent)",
    body: "Boundary clarity fails most often at handoff. Agree what “sales-ready” means, who owns the person after that status, and what happens on reject or recycle — before arguing about tools.\n\nExample: a SaaS demand-gen team scores webinar attendees in marketing automation. When score + title + company size match their MQL rule, the record is created/updated in CRM, assigned to the round-robin AE within one business day, and marketing pauses active nurture unless sales recycles with a reason. Without that sentence, marketing calls CRM a “black hole” and sales calls MQLs “junk.”",
    tip: "Write the handoff in one sentence: “When X criteria are met, Y owns the record in CRM within Z time, and marketing stops active nurture unless recycled.”",
    figure: {
      src: "/guides/crm-vs-marketing-automation-handoff.png",
      alt: "Diagram of marketing automation scoring and nurture handing qualified leads into CRM ownership and pipeline stages.",
      caption: "Status definitions matter more than vendor logos.",
    },
    scenarios: [
      {
        title: "Marketing automation side",
        body: "Runs campaigns, scoring, nurture tracks, and engagement history before sales ownership.",
      },
      {
        title: "CRM side",
        body: "Assigns owners, advances stages, logs sales activity, and reports pipeline after acceptance.",
      },
      {
        title: "Shared lifecycle fields",
        body: "Lead status, source, consent, and recycle reasons must mean the same thing in both systems.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "stack-shapes",
    title: "Stack shapes (educational, not rankings)",
    types: [
      {
        id: "crm-only",
        title: "CRM with light outreach",
        bestFor:
          "Small teams where sales owns most pipeline creation and marketing programs are simple or manual.",
        avoidWhen:
          "You need multi-step nurture, scoring programs, and campaign analytics at volume.",
      },
      {
        id: "ma-plus-crm",
        title: "Separate MA + CRM",
        bestFor:
          "Teams that want best-fit tools per job and can maintain integration and lifecycle definitions.",
        avoidWhen:
          "No one owns sync rules, status mapping, or duplicate cleanup.",
      },
      {
        id: "suite",
        title: "CRM + marketing suite",
        bestFor:
          "Orgs that will use both modules daily and prefer one vendor admin model for the shared lifecycle.",
        avoidWhen:
          "You only need sales CRM and would ignore marketing modules after purchase.",
      },
      {
        id: "ma-first",
        title: "Marketing automation first",
        bestFor:
          "Demand-gen–heavy teams with clear sales acceptance later — still plan the CRM handoff early.",
        avoidWhen:
          "Deals already stall from missing owners and stages; MA will not create a sales system of record.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Job matrix: MA vs CRM",
    rows: [
      {
        feature: "Multi-step nurture and campaign programs",
        mustHave: true,
        niceToHave: false,
        notes: "Marketing automation job",
      },
      {
        feature: "Deal stages, owners, sales forecasts",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Agreed MQL / sales-ready handoff",
        mustHave: true,
        niceToHave: false,
        notes: "Process + both tools",
      },
      {
        feature: "Sales activity history on the account",
        mustHave: true,
        niceToHave: false,
        notes: "CRM system of record",
      },
      {
        feature: "Program-level engagement analytics",
        mustHave: false,
        niceToHave: true,
        notes: "MA strength",
      },
      {
        feature: "Buying a suite “to grow into later”",
        mustHave: false,
        niceToHave: true,
        notes: "Common overbuy",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-team",
    title: "Fit by team shape",
    tiers: [
      {
        id: "founder-led",
        label: "Founder-led sales",
        description:
          "CRM first; add MA when inbound volume and nurture load exceed manual follow-up.",
        fitHints: ["Pipeline SoR", "Light campaigns"],
      },
      {
        id: "small-marketing",
        label: "Small marketing + sales",
        description:
          "Separate tools or a suite can work — only if handoff statuses are written down.",
        fitHints: ["Shared lifecycle", "Clear admin"],
      },
      {
        id: "demand-gen",
        label: "Demand-gen heavy",
        description:
          "MA capability becomes critical; CRM must still accept and work qualified leads cleanly.",
        fitHints: ["Scoring rules", "Reject/recycle"],
      },
      {
        id: "enterprise",
        label: "Multi-region / complex",
        description:
          "Governance, consent, and permissions dominate — suites help only with real shared administration.",
        fitHints: ["Data governance", "IT involvement"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common boundary mistakes",
    items: [
      {
        title: "Using MA as the sales pipeline",
        body: "Campaign tools are poor systems of record for deal stages, coaching, and forecast reviews.",
      },
      {
        title: "Dumping MQLs without ownership SLAs",
        body: "Volume without acceptance rules creates mistrust, not revenue process.",
      },
      {
        title: "Assuming suite modules replace process design",
        body: "Shared software still needs shared definitions for status, recycle, and attribution.",
      },
      {
        title: "Chasing attribution theater",
        body: "Perfect multi-touch models matter less than a trustworthy handoff and worked pipeline.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is marketing automation the same as CRM?",
        answer:
          "No. Marketing automation focuses on campaigns, nurture, and lead engagement workflows. CRM focuses on sales relationships, deal progression, and activity as the system of record. Decision rule: campaigns vs closing — with an agreed sales-ready handoff in between.",
      },
      {
        question: "Do we need both?",
        answer:
          "Only if both jobs are real. Many small teams start with CRM and light outbound; add marketing automation when program volume and scoring justify another system (or suite module).",
      },
      {
        question: "What is an MQL handoff?",
        answer:
          "A agreed moment when a lead meets sales-ready criteria and ownership moves into CRM for follow-up — including what happens if sales rejects or recycles the lead.",
      },
      {
        question: "Should we buy a CRM + marketing suite?",
        answer:
          "Consider a suite when you will use both sides and want one lifecycle admin model. If you only need sales CRM, a simpler shape usually reduces cost and complexity.",
      },
      {
        question: "What should I read next?",
        answer:
          "Review Types of CRM for suite vs simple shapes, then How to Choose a CRM — or shortlist with CRM Finder.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Suites vs simple sales shapes.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Qualify sales-system timing.",
      },
      {
        href: "/guides/crm-vs-customer-service-software/",
        label: "CRM vs customer service software",
        description: "Sibling boundary comparison.",
      },
      {
        href: "/guides/crm-vs-cdp/",
        label: "CRM vs CDP",
        description: "Where customer data platforms differ.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Split sales musts from marketing nice-to-haves.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Shortlist the CRM side of the stack",
    body: "Once you know CRM is the sales system of record (with or without MA beside it), CRM Finder maps answers to researched products — rankings ignore affiliate commissions.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVsMarketingAutomationGuide: GuidePage = {
  id: "guide-crm-vs-marketing-automation",
  slug: "crm-vs-marketing-automation",
  title: "CRM vs Marketing Automation: Jobs & Handoff",
  summary:
    "See how marketing automation (nurture and campaigns) differs from CRM (sales system of record) — and how MQL handoffs, suites, and lifecycle ownership should work together.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-vs-marketing-automation-hero.png",
    alt: "Marketing automation campaigns and nurture flowing into a CRM sales pipeline at handoff.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "what-is-crm",
    "do-i-need-a-crm",
    "crm-vs-customer-service-software",
    "crm-vs-cdp",
    "crm-vs-spreadsheet",
    "crm-vs-erp",
    "types-of-crm",
    "how-to-choose-crm",
  ],
  blocks: crmVsMarketingAutomationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Nurture/campaigns, sales pipeline, or both.",
      order: 0,
    },
    {
      id: "handoff",
      label: "Write the handoff rule",
      description: "Sales-ready criteria, owner, and recycle path.",
      order: 1,
    },
    {
      id: "stack",
      label: "Pick stack shape",
      description: "CRM-only, MA+CRM, or suite — with admin owner.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM vs Marketing Automation | SoftwareGlimpse",
    description:
      "Marketing automation runs nurture and campaigns; CRM owns the sales system of record. Learn handoffs, suites, and when you need both.",
    canonicalPath: "/guides/crm-vs-marketing-automation/",
    indexable: true,
  },
};
