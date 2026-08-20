import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Vendor Evaluation — diligence beyond the demo.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVendorEvaluationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Vendor evaluation is diligence beyond features — security posture, pricing clarity, support commitments, data export/exit, implementation reality, references, and contract terms. Decision rule: do not sign until exit/export, true plan cost for must-haves, and support expectations are answered in writing; a winning demo score alone is not enough.",
    bullets: [
      "Security baseline",
      "Pricing clarity",
      "Support expectations",
      "Export & exit",
      "Implementation",
      "References & contract",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Features ≠ vendor risk",
        body: "A strong product trial can still hide lock-in, opaque add-ons, or weak support.",
      },
      {
        label: "Exit is a day-one question",
        body: "Ask how you export contacts, deals, activities, and files before you import them.",
      },
      {
        label: "Get answers in writing",
        body: "Verbal demo promises fade; email or order-form language is what you keep.",
      },
      {
        label: "References beat slogans",
        body: "Talk to a team with similar size and process — not only a logo slide.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "diligence-path",
    title: "Diligence path",
    steps: [
      { id: "security", label: "Security", short: "Baseline fit" },
      { id: "pricing", label: "Pricing", short: "Plan truth" },
      { id: "support", label: "Support", short: "Channels & hours" },
      { id: "exit", label: "Exit", short: "Export path" },
      { id: "implement", label: "Implement", short: "Who does work" },
      { id: "contract", label: "Contract", short: "Terms & refs" },
    ],
    ctaHref: "/guides/crm-evaluation-guide/",
    ctaLabel: "Feature evaluation →",
    figure: {
      src: "/guides/crm-vendor-diligence-path.png",
      alt: "CRM vendor diligence path: security, pricing truth, support, exit, implement, contract — in parallel with scores.",
      caption:
        "Run diligence in parallel with final scoring — contract review is not a rubber stamp after the demo.",
    },
  },
  {
    type: "figure",
    id: "diligence-visual",
    title: "Diligence checklist map",
    src: "/guides/crm-vendor-evaluation-diligence.png",
    alt: "CRM vendor diligence map covering security, pricing clarity, support, data export/exit, implementation, references, and contract terms.",
    caption:
      "Run diligence in parallel with final scoring — do not treat contract review as a rubber stamp after the demo win.",
  },
  {
    type: "step",
    id: "ask-before-signing",
    stepNumber: 1,
    heading: "Questions to ask before signing",
    body: "Cover security baseline, which plan unlocks your must-haves, support channels and response expectations, export formats and exit steps, who implements (you vs partner), and reference customers like you.\n\nExample: after scoring three tools, a 6-person B2B team emails each finalist the same diligence list. One vendor cannot describe a full activity export; another clarifies that email sync sits on a higher plan than the demo used. They keep the scorecard winner only after export path and plan gates are confirmed in writing.",
    tip: "Paste answers into the decision memo. If a reply is “we’ll figure it out in onboarding,” treat that as an open risk.",
    figure: {
      src: "/guides/crm-vendor-evaluation-hero.png",
      alt: "CRM vendor evaluation hero: diligence topics beyond the product demo.",
      caption:
        "Demo fit is necessary; written diligence on exit, cost, and support decides the signature.",
    },
    scenarios: [
      {
        title: "Security",
        body: "SSO, roles, audit logs, data residency — match to your actual baseline.",
      },
      {
        title: "Pricing clarity",
        body: "Seat tiers, add-on gates, and what the trial plan excluded.",
      },
      {
        title: "Support",
        body: "Channels, hours, and what “priority” means without invented SLA math.",
      },
    ],
  },
  {
    type: "step",
    id: "exit-and-contract",
    stepNumber: 2,
    heading: "Prove exit, implementation, and contract fit",
    body: "Require a concrete export story (objects and formats), a realistic implementation owner, and contract terms you can live with (term length, renewal, data handling). Skip invented ROI claims in the business case — use researched prices and named risks instead.",
    tip: "Do a small export test in trial when the product allows it. Screenshots of UI are not an exit plan.",
    figure: {
      src: "/guides/crm-vendor-exit-contract.png",
      alt: "Prove CRM exit, implementation, and contract fit: export story, implement owner, similar references, term and renewal, trial export test.",
      caption:
        "Screenshots of UI are not an exit plan — require objects, formats, and a trial export when possible.",
    },
    scenarios: [
      {
        title: "Implementation",
        body: "Who configures fields, imports data, and trains sellers — and in what hours?",
      },
      {
        title: "References",
        body: "Ask for a customer with similar team size and sales motion.",
      },
      {
        title: "Contract",
        body: "Notice periods, renewal defaults, and where security docs live.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "diligence-musts",
    title: "Diligence musts vs deferrable",
    rows: [
      {
        feature: "Written plan for must-have features",
        mustHave: true,
        niceToHave: false,
        notes: "No demo-plan mismatch",
      },
      {
        feature: "Documented export / exit path",
        mustHave: true,
        niceToHave: false,
        notes: "Test in trial if possible",
      },
      {
        feature: "Support channels & hours stated",
        mustHave: true,
        niceToHave: false,
        notes: "Match your working hours",
      },
      {
        feature: "Security baseline answers",
        mustHave: true,
        niceToHave: false,
        notes: "Fit your real requirements",
      },
      {
        feature: "Marketplace app depth",
        mustHave: false,
        niceToHave: true,
        notes: "After core diligence clears",
      },
      {
        feature: "Custom legal redlines (SMB)",
        mustHave: false,
        niceToHave: true,
        notes: "Often limited; know what you need",
      },
    ],
  },
  {
    type: "checklist",
    id: "pre-sign-checklist",
    title: "Pre-signature diligence checklist",
    copyable: true,
    items: [
      {
        id: "plan-gates",
        label: "Must-haves mapped to paid plan",
        description: "Including add-ons called out in trial.",
        order: 0,
      },
      {
        id: "export",
        label: "Export/exit path documented",
        description: "Objects, formats, who initiates.",
        order: 1,
      },
      {
        id: "support",
        label: "Support expectations confirmed",
        description: "Channels, hours, escalation path.",
        order: 2,
      },
      {
        id: "security",
        label: "Security baseline reviewed",
        description: "Roles, SSO needs, docs location.",
        order: 3,
      },
      {
        id: "impl",
        label: "Implementation owner named",
        description: "Internal and/or partner scope.",
        order: 4,
      },
      {
        id: "refs-contract",
        label: "Reference + contract skim done",
        description: "Term, renewal, data handling.",
        order: 5,
      },
    ],
  },
  {
    type: "selection-checklist",
    id: "diligence-dimensions",
    title: "Diligence dimensions",
    dimensions: [
      {
        id: "security",
        label: "Security",
        options: ["Roles/permissions", "SSO need", "Audit logs", "Data residency"],
      },
      {
        id: "commercial",
        label: "Commercial",
        options: ["Plan gates", "Add-ons", "Term length", "Renewal notice"],
      },
      {
        id: "operations",
        label: "Operations",
        options: ["Support hours", "Implementation owner", "Training plan", "Admin spare"],
      },
      {
        id: "exit",
        label: "Exit readiness",
        options: ["Contact export", "Deal/activity export", "File export", "Deletion process"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Vendor evaluation mistakes",
    items: [
      {
        title: "Signing on demo score alone",
        body: "Feature fit without exit, cost gates, and support clarity creates regret at renewal.",
      },
      {
        title: "Accepting “from $X” as total cost",
        body: "Must-haves often require higher tiers — confirm in the order form.",
      },
      {
        title: "Skipping a peer reference",
        body: "Marketing case studies are not the same as a 30-minute call with a similar team.",
      },
      {
        title: "Ignoring data exit until you are unhappy",
        body: "Export pain is cheapest to discover before import and automation sprawl.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I evaluate a CRM vendor beyond the demo?",
        answer:
          "Diligence security, pricing clarity for must-haves, support expectations, data export/exit, implementation ownership, references, and contract terms — in writing. Decision rule: no signature until exit/export and true plan cost are clear, even if the product trial scored highest.",
      },
      {
        question: "What security questions should small teams ask?",
        answer:
          "Start with roles/permissions, authentication options you need, where security documentation lives, and any data residency constraints you actually have — match the baseline to reality, not enterprise theater.",
      },
      {
        question: "How important is data export?",
        answer:
          "Critical. Confirm which objects export, in what formats, and how cancellation/deletion works before you depend on the CRM as system of record.",
      },
      {
        question: "Do we need formal SLAs?",
        answer:
          "Many SMB plans publish support channels and hours rather than heavy SLA contracts. Get the real expectations in writing and decide if that matches how you sell.",
      },
      {
        question: "What should I do next?",
        answer:
          "Attach diligence answers to your decision memo from the Evaluation and Selection Process guides, then shortlist or validate fit with CRM Finder if needed.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Scorecards and fair trials.",
      },
      {
        href: "/guides/crm-selection-process/",
        label: "CRM selection process",
        description: "Gates and owners through Decide.",
      },
      {
        href: "/guides/crm-vendor-questions/",
        label: "CRM vendor questions",
        description: "The question bank to send.",
      },
      {
        href: "/guides/crm-rfp-guide/",
        label: "CRM RFP guide",
        description: "Packet the same ask to finalists.",
      },
      {
        href: "/guides/crm-trial-evaluation/",
        label: "CRM trial evaluation",
        description: "Prove answers hands-on.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Plan and seat literacy.",
      },
      {
        href: "/guides/crm-total-cost-guide/",
        label: "CRM total cost guide",
        description: "Costs beyond the seat price.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Constrained product shortlist.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Weighted scores with evidence.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Check quotes against researched bands.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Ownership cost beyond seat price.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Shortlist before diligence",
    body: "Use CRM Finder to narrow researched options, then run the same diligence list on finalists — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVendorEvaluationGuide: GuidePage = {
  id: "guide-crm-vendor-evaluation",
  slug: "crm-vendor-evaluation",
  title: "CRM Vendor Evaluation: Diligence Beyond the Demo",
  summary:
    "Evaluate CRM vendors beyond feature demos — security, pricing clarity, support, data export/exit, implementation, references, and contract fit.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-vendor-evaluation-hero.png",
    alt: "CRM vendor evaluation hero: diligence topics beyond the product demo.",
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
    "crm-vendor-questions",
    "crm-rfp-guide",
    "crm-evaluation-guide",
    "crm-trial-evaluation",
    "crm-pricing-guide",
    "crm-total-cost-guide",
    "crm-selection-process",
    "how-to-choose-crm",
  ],
  blocks: crmVendorEvaluationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "written",
      label: "Collect written diligence answers",
      description: "Plan gates, support, security, exit.",
      order: 0,
    },
    {
      id: "export-test",
      label: "Confirm export/exit path",
      description: "Prefer a trial export sample.",
      order: 1,
    },
    {
      id: "memo",
      label: "Attach answers to decision memo",
      description: "No signature on demo score alone.",
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
    title: "CRM Vendor Evaluation: Diligence Beyond the Demo | SoftwareGlimpse",
    description:
      "CRM vendor diligence checklist: security, pricing clarity, support, data export/exit, implementation, references, and contract terms.",
    canonicalPath: "/guides/crm-vendor-evaluation/",
    indexable: true,
  },
};
