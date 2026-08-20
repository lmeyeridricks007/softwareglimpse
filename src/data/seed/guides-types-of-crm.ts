import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Types of CRM — product shapes and classic typologies.
 * Template: softwareglimpse-guide-template-v1
 */
const typesOfCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "“Types of CRM” means two layers: classic lenses (operational, analytical, collaborative) and modern product shapes (simple sales, sales-engagement, CRM+marketing suites, enterprise platforms). Decision rule: pick the shape that matches your primary job and admin capacity before you compare vendor brands.",
    bullets: [
      "Operational vs analytical vs collaborative",
      "Simple sales CRM",
      "Sales engagement CRM",
      "CRM + marketing suite",
      "Enterprise platform",
      "Fit before brand",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Shape before shortlist",
        body: "Comparing a lightweight pipeline tool to an enterprise platform as if they were the same product wastes evaluation time.",
      },
      {
        label: "Classic types describe jobs",
        body: "Operational CRM runs day-to-day selling; analytical CRM focuses on insight; collaborative CRM emphasizes shared customer context across teams.",
      },
      {
        label: "Most SMB buyers need operational CRM",
        body: "Pipeline, contacts, and activity history first — analytics and collaboration deepen as the org grows.",
      },
      {
        label: "Suites are not free upgrades",
        body: "Bundled marketing or service modules help only if you will use them; otherwise you pay for complexity.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "choose-shape-first",
    title: "How to choose a CRM type",
    steps: [
      { id: "job", label: "Primary job", short: "Sell, engage, market, govern" },
      { id: "users", label: "Who uses it", short: "Reps, managers, IT" },
      { id: "process", label: "Process complexity", short: "Simple vs multi-team" },
      { id: "channels", label: "Channels", short: "Email, call, sequences" },
      { id: "admin", label: "Admin capacity", short: "Who configures it?" },
      { id: "shape", label: "Pick a shape", short: "Then shortlist vendors" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/types-of-crm-choose-shape.png",
      alt: "Six-step path: primary job, users, process complexity, channels, admin capacity, then pick a CRM shape.",
      caption: "Choose the product shape before you compare vendor brands.",
    },
  },
  {
    type: "figure",
    id: "shapes-visual",
    title: "Modern CRM product shapes",
    src: "/guides/types-of-crm-hero.png",
    alt: "Four CRM product shapes: simple sales, sales engagement, CRM plus marketing suite, and enterprise platform.",
    caption: "Same category label — different primary jobs.",
  },
  {
    type: "crm-types",
    id: "product-shapes",
    title: "Modern product shapes (not rankings)",
    types: [
      {
        id: "simple-sales",
        title: "Simple sales CRM",
        bestFor:
          "Small teams that need contacts, pipeline stages, activity history, and light reporting with minimal admin.",
        avoidWhen:
          "You need multi-department governance, deep customization, or heavy outbound sequencing on day one.",
      },
      {
        id: "sales-engagement",
        title: "Sales engagement–heavy CRM",
        bestFor:
          "Outbound or high-activity teams that live in sequences, dialers, and daily task queues.",
        avoidWhen:
          "Your pain is account management, complex approvals, or support history — not activity throughput.",
      },
      {
        id: "suite",
        title: "CRM + marketing suite",
        bestFor:
          "Teams that will actively use marketing and CRM in one vendor ecosystem and accept shared administration.",
        avoidWhen:
          "You only need a sales system of record and dislike paying for unused modules.",
      },
      {
        id: "enterprise",
        title: "Enterprise CRM platform",
        bestFor:
          "Complex processes, security reviews, permissions, and multi-team workflows with IT involvement.",
        avoidWhen:
          "A small team that needs to go live quickly with minimal configuration capacity.",
      },
    ],
  },
  {
    type: "step",
    id: "classic-types",
    stepNumber: 1,
    heading: "Classic CRM types: operational, analytical, collaborative",
    body: "Textbooks and older buyer guides still use three labels. They are useful as lenses — many modern products mix all three, with operational CRM as the center of gravity for sales teams.\n\nExample: a 6-person outbound SDR/AE team mostly needs operational CRM (contacts, stages, tasks). Their VP may later want analytical views for forecast quality, and CS may want collaborative access to account history — but day-one buy is still the operational sales system of record, not an enterprise analytics platform.",
    tip: "If a vendor markets “AI CRM” without clarifying the operational core, ask which records, stages, and owners the AI actually updates.",
    figure: {
      src: "/guides/types-of-crm-classic-types.png",
      alt: "Operational, analytical, and collaborative CRM columns with example capabilities.",
      caption: "Most sales buyers start with operational CRM and add analytical depth later.",
    },
    scenarios: [
      {
        title: "Operational CRM",
        body: "Runs daily selling: contacts, deals, tasks, pipelines, and workflow automation.",
      },
      {
        title: "Analytical CRM",
        body: "Turns CRM data into segments, forecasts, and performance insight — only as good as the underlying records.",
      },
      {
        title: "Collaborative CRM",
        body: "Emphasizes shared customer context across sales, service, and partners — still needs a system of record underneath.",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-audience",
    title: "Which CRM type fits whom?",
    figure: {
      src: "/guides/types-of-crm-fit-matrix.png",
      alt: "Fit matrix mapping team types to simple, engagement, suite, and enterprise CRM shapes.",
      caption: "Use this as a starting filter — then validate with your process map.",
    },
    tiers: [
      {
        id: "solo",
        label: "Solo / freelancer",
        description:
          "Simple sales CRM or even a structured list until shared ownership becomes painful.",
        fitHints: ["Light pipeline", "Low admin"],
      },
      {
        id: "small-sales",
        label: "Small sales team",
        description:
          "Simple sales CRM is usually the right shape; engagement tools if outbound volume is high.",
        fitHints: ["Shared owners", "Weekly pipeline"],
      },
      {
        id: "marketing-sales",
        label: "Marketing + sales org",
        description:
          "Suite can help when lead handoff and campaign attribution are daily needs — not vanity bundling.",
        fitHints: ["Shared lifecycle", "Clear admin owner"],
      },
      {
        id: "enterprise",
        label: "Enterprise / multi-team",
        description:
          "Enterprise platforms when security, permissions, and complex processes dominate the buy.",
        fitHints: ["SSO / audit", "IT involvement"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "shape-signals",
    title: "Signals you may be in the wrong shape",
    rows: [
      {
        feature: "Team needs pipeline + shared history",
        mustHave: true,
        niceToHave: false,
        notes: "Points to operational / simple sales CRM",
      },
      {
        feature: "High outbound sequence volume",
        mustHave: true,
        niceToHave: false,
        notes: "Engagement-heavy shape",
      },
      {
        feature: "Marketing + CRM must share one lifecycle",
        mustHave: false,
        niceToHave: true,
        notes: "Suite may fit",
      },
      {
        feature: "SSO, complex permissions, multi-org",
        mustHave: true,
        niceToHave: false,
        notes: "Enterprise platform territory",
      },
      {
        feature: "Buying the biggest suite “to grow into”",
        mustHave: false,
        niceToHave: true,
        notes: "Common overbuy pattern",
      },
    ],
    figure: {
      src: "/guides/types-of-crm-shape-signals.png",
      alt: "Signals matrix for when a team may be using the wrong CRM product shape.",
      caption: "Mismatch signals usually show up as unused modules or missing daily workflows.",
    },
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common typing mistakes",
    items: [
      {
        title: "Comparing all “CRMs” as equals",
        body: "A sequence tool and an enterprise platform can both say CRM and still solve different jobs.",
      },
      {
        title: "Starting with analytical features",
        body: "Forecast dashboards cannot fix missing owners and stale stages.",
      },
      {
        title: "Assuming suite = better CRM",
        body: "Unused marketing modules add cost and configuration without improving sales execution.",
      },
      {
        title: "Ignoring admin capacity",
        body: "Enterprise-shaped tools fail in small teams that cannot staff configuration and governance.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What types of CRM are there?",
        answer:
          "Two useful layers: classic lenses (operational, analytical, collaborative) and modern product shapes (simple sales, sales-engagement, CRM+marketing suites, enterprise platforms). Pick the shape that matches your primary job before comparing brands.",
      },
      {
        question: "What is operational CRM?",
        answer:
          "Operational CRM is the day-to-day system for contacts, deals, activities, and workflows — the system of record most sales teams mean when they say CRM. Example: a small outbound team’s first buy is usually operational CRM, not an analytics platform.",
      },
      {
        question: "Is sales engagement the same as CRM?",
        answer:
          "Sales engagement focuses on high-volume outreach workflows. Some products blend it with CRM; others sit beside a system of record. Clarify which is primary.",
      },
      {
        question: "Should startups buy enterprise CRM?",
        answer:
          "Usually not on day one. Start with a shape you can administer and adopt; revisit platform needs when process and compliance complexity arrive.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use How to Choose a CRM for evaluation criteria, or CRM Finder to shortlist within the shape you selected.",
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
        href: "/guides/how-crm-works/",
        label: "How CRM works",
        description: "Records, pipelines, and activity.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "What each shape is meant to improve.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Readiness check before you shop.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Compare products within your CRM type.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Write must vs nice before vendor meetings.",
      },
      {
        href: "/best/crm-software/",
        label: "Best CRM software",
        description: "Research-backed rankings when available.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Compare options within your shape",
    body: "Once you know which CRM type fits, CRM Finder maps your answers to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const typesOfCrmGuide: GuidePage = {
  id: "guide-types-of-crm",
  slug: "types-of-crm",
  title: "Types of CRM Software: Operational, Suites & Sales CRM Shapes",
  summary:
    "Learn the difference between operational, analytical, and collaborative CRM — and how modern product shapes (simple sales, engagement, suites, enterprise) change what you should buy.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/types-of-crm-hero.png",
    alt: "Four CRM product shapes: simple sales, sales engagement, suite, and enterprise platform.",
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
    "how-crm-works",
    "crm-benefits",
    "crm-glossary",
    "do-i-need-a-crm",
    "when-to-adopt-crm",
    "how-to-choose-crm",
  ],
  blocks: typesOfCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Sell, engage, market+sell, or govern.",
      order: 0,
    },
    {
      id: "shape",
      label: "Pick a product shape",
      description: "Simple, engagement, suite, or enterprise.",
      order: 1,
    },
    {
      id: "admin",
      label: "Check admin capacity",
      description: "Who will configure and govern it?",
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
    title: "Types of CRM Software Explained | SoftwareGlimpse",
    description:
      "Operational vs analytical vs collaborative CRM, plus modern product shapes — simple sales, engagement, suites, and enterprise platforms.",
    canonicalPath: "/guides/types-of-crm/",
    indexable: true,
  },
};
