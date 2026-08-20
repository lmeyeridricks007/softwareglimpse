import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM examples — concrete scenarios (illustrative, not case studies with invented metrics).
 * Template: softwareglimpse-guide-template-v1
 */
const crmExamplesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM examples are easiest to understand as named team scenarios: a small B2B pipeline team, an inbound desk with SLAs, an advisory firm on long cycles, or an outbound desk with high activity volume. Decision rule: pick the scenario that matches your week, then compare tools against that process — not against a generic “CRM” brochure.",
    bullets: [
      "Small B2B pipeline team",
      "Inbound lead desk",
      "Advisory / relationship sales",
      "Outbound activity-heavy team",
      "Handoff to customer success",
      "What good logging looks like",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Examples reveal process fit",
        body: "The right CRM shape depends on whether your week looks like pipeline coaching, inbound SLA, or high-volume outreach.",
      },
      {
        label: "Same objects, different emphasis",
        body: "All examples use contacts/deals/activities — but stage design, activity volume, and reporting differ.",
      },
      {
        label: "Illustrative ≠ endorsement",
        body: "These scenarios explain patterns. They are not ranked vendor case studies or invented ROI results.",
      },
      {
        label: "Map your scenario before demos",
        body: "Bring your stages and handoff rules to demos so vendors cannot redefine your process mid-pitch.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pick-your-scenario",
    title: "Find your closest scenario",
    steps: [
      { id: "motion", label: "Sales motion", short: "Inbound / outbound / mixed" },
      { id: "cycle", label: "Cycle length", short: "Days vs months" },
      { id: "owners", label: "Owners", short: "Solo vs multi-rep" },
      { id: "handoffs", label: "Handoffs", short: "Sales → success?" },
      { id: "volume", label: "Activity volume", short: "Low vs high" },
      { id: "shape", label: "CRM shape", short: "Simple / engagement / suite" },
    ],
    ctaHref: "/guides/types-of-crm/",
    ctaLabel: "Types of CRM →",
    figure: {
      src: "/guides/crm-examples-scenario-path.png",
      alt: "Four CRM scenario tiles: small B2B pipeline, inbound desk, advisory, and outbound activity-heavy teams.",
      caption: "Match the scenario to your week before you compare product shapes.",
    },
  },
  {
    type: "figure",
    id: "scenario-cards",
    title: "Three common CRM example setups",
    src: "/guides/crm-examples-hero.png",
    alt: "Three CRM scenario cards: small B2B sales team, advisory relationship tracking, and high-volume inbound lead desk.",
    caption: "Start with the scenario that matches your week — then compare tools.",
  },
  {
    type: "step",
    id: "example-smb-pipeline",
    stepNumber: 1,
    heading: "Example: small B2B sales team pipeline",
    body: "A five-person sales team sells a service with a 3–6 week cycle. Leads come from referrals and a website form. They need shared ownership, a short pipeline, and a Friday pipeline review — not enterprise governance on day one.\n\nExample: at Harbor Analytics, AE Maya owns “Acme — Q3 rollout,” advances it from Qualified to Proposal after a discovery call, logs the proposal send, and the Friday review filters open deals by owner — nobody rebuilds a spreadsheet the night before.",
    tip: "Keep stages few and exit criteria explicit: e.g. Qualified, Proposal, Negotiation, Won/Lost.",
    figure: {
      src: "/guides/crm-examples-pipeline-story.png",
      alt: "Example deal moving through New Lead, Qualified, Proposal, Negotiation, and Won stages with activity chips.",
      caption: "Illustrative walkthrough — stages should match your real motion.",
    },
    scenarios: [
      {
        title: "Capture",
        body: "Form submissions create leads; referrals are entered manually with a source field.",
      },
      {
        title: "Qualify",
        body: "An owner converts qualified leads into deals with an estimated value and close date.",
      },
      {
        title: "Advance & log",
        body: "Proposal emails and calls are logged on the deal so anyone can cover PTO without losing context.",
      },
      {
        title: "Review",
        body: "Friday review filters deals by stage and owner — no spreadsheet rebuild.",
      },
    ],
  },
  {
    type: "step",
    id: "example-inbound",
    stepNumber: 2,
    heading: "Example: inbound lead desk",
    body: "A team receives a steady flow of meeting requests. The CRM job is speed-to-lead and clean qualification: assign owners quickly, track SLA breaches, and only create deals that meet criteria.\n\nExample: Pulse Onboarding’s SDR desk auto-assigns form leads by territory; if a lead sits untouched past two hours, a task fires; only leads that pass BANT create deals — the rest stay as leads with a recycle reason.",
    tip: "Measure response time and qualification rate before buying engagement suites you may not need.",
    figure: {
      src: "/guides/crm-examples-inbound.png",
      alt: "Inbound lead desk flow from form capture through SLA routing, qualification, and deal creation.",
      caption: "Inbound CRM jobs emphasize speed-to-lead and clean qualification gates.",
    },
    scenarios: [
      {
        title: "Routing",
        body: "New form leads auto-assign by territory or round-robin.",
      },
      {
        title: "SLA tasks",
        body: "Tasks fire if a lead is untouched past an agreed threshold.",
      },
      {
        title: "Conversion",
        body: "Qualified leads become deals; disqualified leads get a reason code for marketing feedback.",
      },
    ],
  },
  {
    type: "step",
    id: "example-advisory",
    stepNumber: 3,
    heading: "Example: advisory / relationship-led sales",
    body: "An advisory or professional-services firm sells through long trust cycles. Deals may be fewer, but activity history and relationship mapping matter more than sequence volume.\n\nExample: at Meridian Advisory, partner Lena tracks three stakeholders at “Riverbank Holdings” on one company record; the deal stays in Scoping for months with logged notes — when won, delivery inherits the full history instead of a one-line handoff email.",
    tip: "Prioritize contact/company history and next-step discipline over high-volume outreach features.",
    figure: {
      src: "/guides/crm-examples-advisory.png",
      alt: "Advisory relationship-led sales map with stakeholders, trust milestones, proposal, and nurture notes.",
      caption: "Long-cycle advisory sales need relationship history more than sequence volume.",
    },
    scenarios: [
      {
        title: "Relationship record",
        body: "Multiple stakeholders at one company are linked; notes capture preferences and risk.",
      },
      {
        title: "Long cycle stages",
        body: "Stages reflect discovery, scoping, proposal, and contracting — not daily dialer metrics.",
      },
      {
        title: "Handoff",
        body: "When won, success receives the full history instead of a one-line “new client” email.",
      },
    ],
  },
  {
    type: "step",
    id: "example-outbound",
    stepNumber: 4,
    heading: "Example: outbound activity-heavy team",
    body: "Reps run structured outreach across many prospects. The CRM (or CRM + engagement layer) must keep sequences, calls, and outcomes attached to records so managers can coach on activity quality — not vanity send counts alone.\n\nExample: at Brightline Outbound, SDRs enroll prospects into sequences; every call outcome writes back to the contact; managers coach on connected conversations and stage promotions — not raw email sends alone.",
    tip: "Clarify whether engagement is built into CRM or sits beside it — both can work if the system of record stays clear.",
    figure: {
      src: "/guides/crm-examples-outbound.png",
      alt: "Outbound activity-heavy team flow from ICP list through sequences, logged calls, meetings, and opportunities.",
      caption: "Outbound CRM jobs emphasize activity quality attached to records — not vanity send counts.",
    },
    scenarios: [
      {
        title: "List → outreach",
        body: "Prospects enter as leads/contacts; sequences enroll with clear exit rules.",
      },
      {
        title: "Logging",
        body: "Calls and replies update the same record the pipeline uses.",
      },
      {
        title: "Promotion",
        body: "Interested prospects become deals with owners and next meetings.",
      },
    ],
  },
  {
    type: "size-match",
    id: "example-fit",
    title: "Which example is closest?",
    figure: {
      src: "/guides/crm-examples-fit.png",
      alt: "Fit matrix matching team shape, cycle length, and activity volume to CRM example scenarios.",
      caption: "Pick the closest scenario — then validate with your real weekly motion.",
    },
    tiers: [
      {
        id: "smb",
        label: "Small pipeline team",
        description: "Simple sales CRM shape; emphasize stages and weekly review.",
        fitHints: ["Shared owners", "Short pipeline"],
      },
      {
        id: "inbound",
        label: "Inbound desk",
        description: "Routing + SLA tasks; light automation before heavy suites.",
        fitHints: ["Speed-to-lead", "Reason codes"],
      },
      {
        id: "advisory",
        label: "Relationship / advisory",
        description: "History and stakeholders over sequence volume.",
        fitHints: ["Multi-contact accounts", "Long cycles"],
      },
      {
        id: "outbound",
        label: "Outbound desk",
        description: "Engagement-heavy tooling with a clear system of record.",
        fitHints: ["Sequences", "Activity coaching"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Example pitfalls",
    items: [
      {
        title: "Copying another company’s stages",
        body: "Borrow patterns, then rewrite stages to match your real exit criteria.",
      },
      {
        title: "Treating vendor “customer stories” as proof",
        body: "Ask what process and data quality produced the outcome — not just the logo slide.",
      },
      {
        title: "Optimizing for demo wow",
        body: "A flashy sequence demo does not help an advisory firm that needed relationship history.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Can you give CRM examples for small business?",
        answer:
          "Yes — the small B2B pipeline scenario above is the most common SMB pattern: shared contacts, a short pipeline, logged activity, and a weekly review.",
      },
      {
        question: "Are these real customer case studies?",
        answer:
          "No. They are illustrative scenarios for education. SoftwareGlimpse does not invent metrics or attribute outcomes to unpaid endorsements here.",
      },
      {
        question: "How do I turn an example into a shortlist?",
        answer:
          "Identify your motion and CRM shape (Types of CRM), then use How to Choose a CRM and CRM Finder with those constraints.",
      },
      {
        question: "Where do product examples live?",
        answer:
          "Product-specific walkthroughs belong on software review hubs and comparisons — this guide stays scenario-focused.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "Outcomes these scenarios are aiming for.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Match scenario → product shape.",
      },
      {
        href: "/guides/how-crm-works/",
        label: "How CRM works",
        description: "The mechanics behind each scenario.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Check your situation against the signals.",
      },
      {
        href: "/use-cases/",
        label: "CRM use cases",
        description: "Job-based CRM pages.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from your answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Turn your scenario into requirements.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Match your scenario to products",
    body: "CRM Finder turns structured answers about team size, motion, and priorities into researched product matches — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmExamplesGuide: GuidePage = {
  id: "guide-crm-examples",
  slug: "crm-examples",
  title: "CRM Examples: Real-World Sales & Team Scenarios",
  summary:
    "Concrete CRM examples for small B2B pipelines, inbound desks, advisory relationships, and outbound teams — illustrative scenarios that clarify fit without invented case-study metrics.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-examples-hero.png",
    alt: "Three CRM scenario cards for small B2B sales, advisory relationships, and inbound lead desks.",
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
    "crm-benefits",
    "types-of-crm",
    "how-crm-works",
    "what-is-crm",
    "do-i-need-a-crm",
    "when-to-adopt-crm",
    "how-to-choose-crm",
  ],
  blocks: crmExamplesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "scenario",
      label: "Pick your closest scenario",
      description: "Pipeline, inbound, advisory, or outbound.",
      order: 0,
    },
    {
      id: "stages",
      label: "Draft your stages",
      description: "Name exit criteria before demos.",
      order: 1,
    },
    {
      id: "shape",
      label: "Choose a CRM shape",
      description: "Then shortlist with Finder.",
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
    title: "CRM Examples & Scenarios | SoftwareGlimpse",
    description:
      "CRM examples for small B2B teams, inbound desks, advisory firms, and outbound teams — practical scenarios without invented metrics.",
    canonicalPath: "/guides/crm-examples/",
    indexable: true,
  },
};
