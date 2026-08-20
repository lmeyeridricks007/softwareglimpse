import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Training — role curricula for SDR, manager, RevOps.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceTrainingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Train sales intelligence by role — SDR, manager, RevOps — with short curricula practiced on real ICP lists in a sandbox or limited-credit lane, then a certification-lite checklist before full credit budgets. Decision rule: do not grant broad unlock/export rights until each role completes its script (search→verify→CRM for SDRs, coaching from SI+CRM views for managers, sync/credits/hygiene for RevOps) and a named owner signs the checklist.",
    bullets: [
      "Role curricula",
      "Sandbox / limited credits",
      "SDR / manager / RevOps",
      "Certification-lite",
      "Then full access",
      "Link adoption",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One webinar is not training",
        body: "Roles need different scripts and pass criteria.",
      },
      {
        label: "Practice on your ICP",
        body: "Vendor demo orgs teach UI; your lists teach judgment.",
      },
      {
        label: "Certification-lite is observed tasks",
        body: "Not a quiz score or vendor badge.",
      },
      {
        label: "Adoption is the sequel",
        body: "Training unlocks access; adoption keeps credits honest.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "training-path",
    title: "Training path",
    steps: [
      { id: "roles", label: "Roles", short: "SDR / mgr / RevOps" },
      { id: "curriculum", label: "Curriculum", short: "Short scripts" },
      { id: "practice", label: "Practice", short: "ICP lists" },
      { id: "cert", label: "Cert-lite", short: "Checklist pass" },
      { id: "access", label: "Access", short: "Credit budgets" },
      { id: "adopt", label: "Adopt", short: "Ongoing coaching" },
    ],
    ctaHref: "/guides/sales-intelligence-adoption/",
    ctaLabel: "Adoption guide →",
    figure: {
      src: "/guides/sales-intelligence-training-path.png",
      alt: "SI training path: roles, short curricula, ICP practice, cert-lite, credit access, then adoption coaching.",
      caption:
        "Three curricula, limited-credit practice, then certification-lite — before full unlock budgets.",
    },
  },
  {
    type: "figure",
    id: "roles-visual",
    title: "Role-based curricula",
    src: "/guides/sales-intelligence-training-path.png",
    alt: "Three curriculum columns for SDR, manager, and RevOps sharing an ICP practice lane and certification-lite checklist before full SI access.",
    caption:
      "Three curricula, one practice lane, then certification-lite — before burning production credits.",
  },
  {
    type: "checklist",
    id: "cert-lite",
    title: "Certification-lite checklist",
    copyable: true,
    items: [
      {
        id: "sdr-search",
        label: "SDR: build ICP list + verify before sequence",
        description: "Uses approved filters; no random spray.",
        order: 0,
      },
      {
        id: "sdr-crm",
        label: "SDR: push/update CRM with owner + next step",
        description: "Matches sync rules; no orphan exports.",
        order: 1,
      },
      {
        id: "sdr-suppress",
        label: "SDR: honor suppression / unsubscribe path",
        description: "Knows where do-not-contact lives.",
        order: 2,
      },
      {
        id: "mgr-coach",
        label: "Manager: coach from SI + CRM views",
        description: "No private sheet as the review surface.",
        order: 3,
      },
      {
        id: "mgr-credits",
        label: "Manager: reads weekly credit / bounce signals",
        description: "Knows when to pause unlocks.",
        order: 4,
      },
      {
        id: "revops-sync",
        label: "RevOps: show mapping + overwrite on sample",
        description: "Can explain who wins on conflict.",
        order: 5,
      },
      {
        id: "revops-credits",
        label: "RevOps: forecast credits for a campaign week",
        description: "Uses unit definition, not vibes.",
        order: 6,
      },
      {
        id: "signoff",
        label: "Trainer/owner signs checklist",
        description: "Then full credit seat granted.",
        order: 7,
      },
    ],
  },
  {
    type: "step",
    id: "role-curricula",
    stepNumber: 1,
    heading: "Build short role-based curricula",
    body: "SDR: search ICP, verify, sequence/dial disposition, CRM update, suppression. Manager: pipeline coaching using SI activity + CRM board, credit/bounce watchouts. RevOps: field mapping, credit forecasting, duplicate queue, export rights. Keep each under a focused session plus practice — not a day-long feature tour.\n\nExample: Harborline designs three 60-minute tracks. SDR Maya never touches admin credit billing. Manager Priya never builds custom fields. RevOps Keisha skips cold-call tips. Shared slide: “what good unlock hygiene looks like.”",
    tip: "If the curriculum teaches every role everything, nobody remembers the core loop.",
    figure: {
      src: "/guides/sales-intelligence-training-hero.png",
      alt: "Sales intelligence training hero: academy dashboard with SDR, manager, and RevOps panels and certification-lite progress.",
      caption:
        "Role panels and cert-lite — training as observed practice, not one webinar.",
    },
    scenarios: [
      {
        title: "SDR track",
        body: "Search, verify, CRM, suppress, disposition.",
      },
      {
        title: "Manager track",
        body: "Coach from views; watch credits and bounces.",
      },
      {
        title: "RevOps track",
        body: "Sync map, credits, duplicates, export.",
      },
    ],
  },
  {
    type: "step",
    id: "practice-and-access",
    stepNumber: 2,
    heading: "Practice on ICP lists, then grant credit access",
    body: "Give trainees a limited-credit or sandbox lane with real-shaped target accounts. Pass only when they complete motions without the trainer driving. Failures get repractice — not a lecture. Full budgets wait for signed cert-lite.\n\nExample: Harborline caps new SDRs at a small daily unlock limit until cert-lite is green. One AE skips verify-before-send; Priya delays their full budget two days. After repractice, they pass and join the pod cadence.",
    tip: "Unlimited credits on day one trains waste, not skill.",
    scenarios: [
      {
        title: "Pass → budget",
        body: "Checklist signed; production credit pool assigned.",
      },
      {
        title: "Fail → repractice",
        body: "Same script; no shame, no skip.",
      },
      {
        title: "Late hire",
        body: "Same cert-lite — no permanent exceptions.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "SI training mistakes",
    items: [
      {
        title: "Vendor webinar as the only enablement",
        body: "UI tour without ICP practice and CRM rules.",
      },
      {
        title: "Training after credits are unlimited",
        body: "Week one becomes expensive discovery under fire.",
      },
      {
        title: "Certificate without observed tasks",
        body: "Attendance is not proof of verify-before-send.",
      },
      {
        title: "Never linking to adoption",
        body: "Training is a launch event; credit discipline needs coaching.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How should we structure SI training by role?",
        answer:
          "Separate short curricula for SDR (unlock loop), manager (coaching + signals), and RevOps (sync, credits, hygiene). Share only the definition of good hygiene across roles.",
      },
      {
        question: "What is certification-lite?",
        answer:
          "An observed checklist on ICP-shaped work — not a vendor badge or multiple-choice score.",
      },
      {
        question: "Should training happen before full credit access?",
        answer:
          "Yes. Use limited credits for practice; unlock full budgets after cert-lite. Hypercare answers questions — it is not first-time learning.",
      },
      {
        question: "What should I do next?",
        answer:
          "After cert-lite, follow the Adoption Guide for 30/60/90 gates and credit coaching.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-adoption/",
        label: "Adoption guide",
        description: "Keep the loop after training.",
      },
      {
        href: "/guides/sales-intelligence-data-quality/",
        label: "Data quality",
        description: "Hygiene rituals to teach.",
      },
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "What RevOps must teach.",
      },
      {
        href: "/guides/sales-intelligence-crm-sync-explained/",
        label: "CRM sync explained",
        description: "Fields SDRs must respect.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "If product choice is still open.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Still choosing the tool?",
    body: "If curricula are blocked on product choice, finish job-first selection before building role tracks.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceTrainingGuide: GuidePage = {
  id: "guide-sales-intelligence-training",
  slug: "sales-intelligence-training",
  title: "Sales Intelligence Training Guide: Role-Based Curricula",
  summary:
    "Train SI by role — SDR, manager, RevOps — with ICP practice and certification-lite before full credit access, then hand off to adoption.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/sales-intelligence-training-hero.png",
    alt: "Sales intelligence training hero: academy dashboard with SDR, manager, and RevOps curriculum panels and certification-lite progress.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-adoption",
    "sales-intelligence-data-quality",
    "sales-intelligence-credits-explained",
    "sales-intelligence-crm-sync-explained",
    "how-to-choose-sales-intelligence",
  ],
  blocks: salesIntelligenceTrainingGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "curricula",
      label: "Write SDR, manager, and RevOps curricula",
      description: "Short scripts; no one-size webinar.",
      order: 0,
    },
    {
      id: "practice-cert",
      label: "Run ICP practice + cert-lite",
      description: "Observed tasks before full credits.",
      order: 1,
    },
    {
      id: "adoption-handof",
      label: "Hand off to adoption cadence",
      description: "Weekly coaching after go-live.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Training Guide | SoftwareGlimpse",
    description:
      "SI training by role — SDR, manager, RevOps — with ICP practice, certification-lite, and handoff to adoption.",
    canonicalPath: "/guides/sales-intelligence-training/",
    indexable: true,
  },
};
