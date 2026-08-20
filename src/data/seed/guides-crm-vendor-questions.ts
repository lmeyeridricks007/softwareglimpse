import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Vendor Questions — ask once, compare every finalist.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVendorQuestionsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Vendor questions are a shared list covering plan gates for must-haves, integrations, admin model, support, security baseline, and export/exit — asked identically to every finalist. Decision rule: if a critical answer is only verbal, treat it as open until written; do not sign on demo confidence alone.",
    bullets: [
      "Same list",
      "Plan gates",
      "Integrations",
      "Admin & support",
      "Security",
      "Exit",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Questions ≠ interrogation theater",
        body: "Short, testable asks beat hundred-item RFPs for SMB.",
      },
      {
        label: "Plan mapping is non-optional",
        body: "Which tier includes each must-have?",
      },
      {
        label: "Category examples are not claims",
        body: "Ask how multiple pipelines or automation are licensed — do not assert unverified support.",
      },
      {
        label: "Pairs with diligence",
        body: "This bank feeds Vendor Evaluation — it does not replace references or contract skim.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "questions-path",
    title: "When to ask what",
    steps: [
      { id: "pre-demo", label: "Pre-demo", short: "Agenda + musts" },
      { id: "live", label: "Live", short: "Plan & edge" },
      { id: "trial", label: "Trial", short: "Export sample" },
      { id: "diligence", label: "Diligence", short: "Security/exit" },
      { id: "memo", label: "Memo", short: "Written file" },
    ],
    ctaHref: "/guides/crm-vendor-evaluation/",
    ctaLabel: "Vendor evaluation →",
    figure: {
      src: "/guides/crm-vendor-questions-when.png",
      alt: "When to ask CRM vendor questions: pre-demo agenda, live plan and edges, trial export, diligence security/exit, memo file.",
      caption:
        "Use one category ring for every finalist — swap products, not the list.",
    },
  },
  {
    type: "figure",
    id: "question-map",
    title: "Question categories",
    src: "/guides/crm-vendor-questions-map.png",
    alt: "Six CRM vendor question categories arranged around a shared scorecard: plan gates, integrations, admin, support, security, exit.",
    caption:
      "Use one category ring for every finalist — swap products, not the list.",
  },
  {
    type: "step",
    id: "core-bank",
    stepNumber: 1,
    heading: "Use this core question bank",
    body: "Plan & packaging: Which plan includes our must-haves (list them)? Are automation, multiple pipelines, or advanced reporting separately licensed? What was the demo plan vs the proposed plan?\nIntegrations: How does email/calendar sync work with our stack? What breaks if we only use native features?\nAdmin: Who typically configures fields/permissions for a team our size? What cannot a non-admin do?\nSupport: Channels, hours, how escalations work on our plan.\nSecurity: Roles, SSO needs, where security docs live, residency constraints we actually have.\nExit: What objects export, formats, who initiates, deletion/cancellation steps.\n\nExample: an 11-person RevOps-light team emails this bank to three finalists after demos. One vendor clarifies reporting is on a higher tier than demoed; another provides an activity export sample during trial.",
    tip: "Ask category-of-capability questions (“how are multiple pipelines licensed?”) without claiming a named product supports them.",
    figure: {
      src: "/guides/crm-vendor-questions-hero.png",
      alt: "CRM vendor questions hero: shared checklist to multiple vendors.",
      caption: "Identical asks create comparable diligence files.",
    },
    scenarios: [
      {
        title: "Demo live",
        body: "Plan gates + edge-case clicks.",
      },
      {
        title: "Email follow-up",
        body: "Security docs location + export path.",
      },
      {
        title: "Trial proof",
        body: "Non-admin limits + export sample.",
      },
    ],
  },
  {
    type: "step",
    id: "score-answers",
    stepNumber: 2,
    heading: "Score answers for clarity, not charm",
    body: "Mark each reply Clear / Partial / Missing. Partial answers become trial tasks or blockers. Do not convert vague enthusiasm into a high diligence score.\n\nExample: “We’ll handle migration in onboarding” without objects/formats stays Partial until a concrete export/import story appears.",
    tip: "Store answers next to the RFP/brief if you sent one — same source of truth.",
    figure: {
      src: "/guides/crm-vendor-questions-score.png",
      alt: "Score CRM vendor answers for clarity: Clear, Partial, or Missing — Partial becomes trial task, Missing is blocker.",
      caption:
        "Do not convert vague enthusiasm into a high diligence score.",
    },
    scenarios: [
      {
        title: "Clear",
        body: "Plan name + feature mapping + doc links.",
      },
      {
        title: "Partial",
        body: "Directional answer, needs proof.",
      },
      {
        title: "Missing",
        body: "No reply on exit or support hours.",
      },
    ],
  },
  {
    type: "checklist",
    id: "copyable-questions",
    title: "Copyable shortlist (send as-is)",
    copyable: true,
    items: [
      {
        id: "q1",
        label: "Which plan includes each must-have on our list?",
        description: "Name plan/tier; note add-ons.",
        order: 0,
      },
      {
        id: "q2",
        label:
          "How are automation / multiple pipelines / advanced reporting licensed?",
        description: "Category question — verify per vendor.",
        order: 1,
      },
      {
        id: "q3",
        label: "Show our email/calendar sync path and limits.",
        description: "Native vs add-on.",
        order: 2,
      },
      {
        id: "q4",
        label: "What can a non-admin seller not do?",
        description: "Permissions reality.",
        order: 3,
      },
      {
        id: "q5",
        label: "Support channels and hours on the proposed plan?",
        description: "Escalation path.",
        order: 4,
      },
      {
        id: "q6",
        label: "How do we export contacts, deals, activities, and files?",
        description: "Formats + who initiates.",
        order: 5,
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How many questions should I ask?",
        answer:
          "A short bank of must-have diligence questions beats a novel. Expand only for real compliance needs.",
      },
      {
        question: "Should questions differ by vendor?",
        answer:
          "Keep the core identical. Add product-specific probes only after the shared list.",
      },
      {
        question: "When do I ask security questions?",
        answer:
          "Before signature — often in writing after demo, in parallel with trial.",
      },
      {
        question: "What if vendors refuse written answers?",
        answer:
          "Treat that as a risk signal; do not rely on memory of the call.",
      },
      {
        question: "What should I do next?",
        answer:
          "Paste replies into Vendor Evaluation diligence, finish Trial Evaluation if needed, then Decision memo.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence beyond answers.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Live probes during sessions.",
      },
      {
        href: "/guides/crm-rfp-guide/",
        label: "CRM RFP guide",
        description: "Packet these questions into.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Score after evidence.",
      },
      {
        href: "/guides/crm-trial-evaluation/",
        label: "CRM trial evaluation",
        description: "Prove answers hands-on.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Context for commercial questions.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Who receives the list.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Must-haves each question checks.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score answers against your criteria.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ask fewer vendors, better questions",
    body: "Shortlist with CRM Finder, then send this same question bank to every finalist — no affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVendorQuestionsGuide: GuidePage = {
  id: "guide-crm-vendor-questions",
  slug: "crm-vendor-questions",
  title: "CRM Vendor Questions: Ask Once, Compare Every Finalist",
  summary:
    "Copyable CRM vendor questions for demos, trials, and diligence — plan gates, integrations, admin, support, security, and exit — without product score claims.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-vendor-questions-hero.png",
    alt: "CRM vendor questions hero: checklist of question categories with speech bubbles to three generic vendors.",
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
    "crm-vendor-evaluation",
    "crm-demo-guide",
    "crm-rfp-guide",
    "crm-evaluation-guide",
    "crm-trial-evaluation",
    "crm-requirements-guide",
    "crm-pricing-guide",
    "how-to-choose-crm",
  ],
  blocks: crmVendorQuestionsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "same-list",
      label: "Send the same question list to all finalists",
      description: "Comparable answers.",
      order: 0,
    },
    {
      id: "writing",
      label: "Prefer answers in writing",
      description: "Email or brief reply.",
      order: 1,
    },
    {
      id: "attach",
      label: "Attach replies to the decision memo",
      description: "Before signature.",
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
    title: "CRM Vendor Questions: Compare Every Finalist | SoftwareGlimpse",
    description:
      "CRM vendor question bank for plan gates, integrations, admin, support, security, and data exit — same list for every finalist.",
    canonicalPath: "/guides/crm-vendor-questions/",
    indexable: true,
  },
};
