import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Demo Guide — buyer-led demos that reveal fit.
 * Template: softwareglimpse-guide-template-v1
 */
const crmDemoGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A useful CRM demo is buyer-led: you send the agenda, run must-have tasks first, and score on the same card you will use in trial. Decision rule: if the vendor drives the entire session and your must-haves never appear as live clicks, stop and reschedule — a tour is not an evaluation.",
    bullets: [
      "Buyer agenda",
      "Must-haves first",
      "Live scoring",
      "Non-admin seat",
      "Same script",
      "Tour last",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Agenda is a control surface",
        body: "Whoever owns the agenda owns what gets proven.",
      },
      {
        label: "Must-haves before wow features",
        body: "AI and marketplace apps wait until core loops pass.",
      },
      {
        label: "Score during, not after memory fades",
        body: "Write 1–5 notes before the call ends.",
      },
      {
        label: "Demo ≠ trial",
        body: "Demos prove possibility; trials prove your team can operate the product.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "demo-path",
    title: "Buyer-led demo path",
    steps: [
      { id: "prep", label: "Prep", short: "Agenda + sheet" },
      { id: "open", label: "Open", short: "Outcomes stated" },
      { id: "script", label: "Script", short: "Must tasks live" },
      { id: "probe", label: "Probe", short: "Plan & edge cases" },
      { id: "close", label: "Close", short: "Score + next" },
    ],
    ctaHref: "/guides/crm-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/crm-demo-path.png",
      alt: "Buyer-led CRM demo path: prep agenda, open outcomes, run must tasks, probe plan and edges, score and next step.",
      caption:
        "Protect the middle block for your script — that is where fit is proven.",
    },
  },
  {
    type: "figure",
    id: "demo-agenda",
    title: "60-minute demo agenda",
    src: "/guides/crm-demo-guide-agenda.png",
    alt: "Timeline of a 60-minute CRM demo: 5 min context, 35 min buyer script, 10 min plan/edge questions, 10 min wrap and scores.",
    caption:
      "Protect the middle block for your script — that is where fit is proven.",
  },
  {
    type: "step",
    id: "prep-agenda",
    stepNumber: 1,
    heading: "Prep the agenda from must-haves",
    body: "Pull pass/fail checks from the requirements sheet. Typical live tasks: create/import a contact, open a deal with owner + next step, move stages, log an activity, show the weekly board, attempt one critical integration path, and ask which plan unlocks each must-have.\n\nExample: an 8-person productized-services team sends a one-page agenda to two finalists. Block one is “seller creates deal from inbound lead”; block two is “ops filters pipeline by owner for Friday review.” They explicitly schedule “product tour” for the last ten minutes.",
    tip: "Invite at least one daily user who is not the admin. Admin-only demos hide adoption risk.",
    figure: {
      src: "/guides/crm-demo-guide-hero.png",
      alt: "CRM demo guide hero: buyer agenda controlling the session.",
      caption:
        "Your agenda turns a sales call into an evaluation session.",
    },
    scenarios: [
      {
        title: "Core loop",
        body: "Contact → deal → activity → board.",
      },
      {
        title: "Constraint check",
        body: "Show the email/calendar path you already use.",
      },
      {
        title: "Plan gate",
        body: "Ask which tier includes each must-have — no invented prices.",
      },
    ],
  },
  {
    type: "step",
    id: "run-and-score",
    stepNumber: 2,
    heading: "Run the script and score live",
    body: "Open with your three outcomes. Hand the mouse to your side when possible, or narrate exact clicks you need. One person scores process fit, must-have coverage, and usability while another watches for “we’ll configure that later” hedges.\n\nExample: during Finalist A’s demo, the seller completes create-deal quickly but the Friday board requires a custom report the AE cannot show without an admin sandbox. They score usability down and book a trial day for that gap — they do not “assume it exists.”",
    tip: "Park parking-lot features in a shared note. Do not let them steal the script clock.",
    figure: {
      src: "/guides/crm-demo-run-score.png",
      alt: "Run CRM demo script and score live: state outcomes, buyer clicks, score fit, park hedges, lock scores before next vendor.",
      caption:
        "Score process fit and must-haves live — deferred hedges become trial tasks, not assumptions.",
    },
    scenarios: [
      {
        title: "Demo theater",
        body: "Happy-path clicks with pre-filled data — ask to start from empty.",
      },
      {
        title: "Sequential bias",
        body: "Score before the next vendor call starts.",
      },
      {
        title: "Unresolved hedges",
        body: "Anything deferred becomes a trial task or diligence email.",
      },
    ],
  },
  {
    type: "step",
    id: "close-demo",
    stepNumber: 3,
    heading: "Close with written follow-ups",
    body: "End with: open questions list, which plan was shown, recording permission if any, and whether a scripted trial is next. Attach demo scores to the evaluation card the same day.\n\nExample: the services team emails both vendors the same three follow-ups — plan for multiple pipelines licensing, export of activities, and support hours — before scheduling trials.",
    tip: "Do not negotiate price mid-demo. Lock fit evidence first; cost clarity next via Calculator bands.",
    figure: {
      src: "/guides/crm-demo-close.png",
      alt: "Close CRM demo with written follow-ups: open questions, plan shown, recording note, trial decision, attach scores same day.",
      caption:
        "Same-day scores and written follow-ups beat memory before the next vendor call.",
    },
    scenarios: [
      {
        title: "Advance to trial",
        body: "Must-haves shown live; residual risk is hands-on.",
      },
      {
        title: "Drop vendor",
        body: "Core loop failed or plan gates unclear after probing.",
      },
      {
        title: "Need second demo",
        body: "Only if a named must-have was blocked by sandbox limits.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long should a CRM demo be?",
        answer:
          "About 45–60 minutes is enough for a buyer-led script. Longer sessions usually mean the tour expanded — protect your middle block.",
      },
      {
        question: "Should vendors drive the mouse?",
        answer:
          "Prefer your users clicking. If the vendor must drive, narrate exact tasks and pause for scoring notes.",
      },
      {
        question: "What if the demo environment is empty or broken?",
        answer:
          "Reschedule. An unusable sandbox is not a pass on your must-haves.",
      },
      {
        question: "Demo or trial first?",
        answer:
          "Short buyer-led demos to cut the list; scripted trials to confirm non-admin reality. See the Trial Evaluation guide for the calendar.",
      },
      {
        question: "What should I do next?",
        answer:
          "Reuse the Evaluation Guide scorecard, then run the same tasks unsupervised in trial.",
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
        description: "Weights and scorecard.",
      },
      {
        href: "/guides/crm-trial-evaluation/",
        label: "CRM trial evaluation",
        description: "Hands-on plan after demos.",
      },
      {
        href: "/guides/crm-vendor-questions/",
        label: "CRM vendor questions",
        description: "Probe list for live calls.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Must-haves for the agenda.",
      },
      {
        href: "/guides/crm-rfp-guide/",
        label: "CRM RFP guide",
        description: "Written replies before demos.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence after the session.",
      },
      {
        href: "/compare/",
        label: "Compare CRM tools",
        description: "Side-by-side research views.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Who to invite.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Must-haves that drive the agenda.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score demos against the same criteria.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Invite fewer, better demos",
    body: "Shortlist with CRM Finder first — then run the same buyer-led agenda on every finalist.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmDemoGuide: GuidePage = {
  id: "guide-crm-demo-guide",
  slug: "crm-demo-guide",
  title: "CRM Demo Guide: Run Buyer-Led Demos That Reveal Fit",
  summary:
    "Control CRM vendor demos with your agenda, must-have script, and scoring notes — so polished tours do not replace evidence.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-demo-guide-hero.png",
    alt: "CRM demo guide hero: buyer agenda on a laptop with a vendor screen sharing a pipeline board.",
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
    "crm-evaluation-guide",
    "crm-trial-evaluation",
    "crm-vendor-questions",
    "crm-requirements-guide",
    "crm-rfp-guide",
    "crm-vendor-evaluation",
    "how-to-choose-crm",
  ],
  blocks: crmDemoGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "agenda",
      label: "Send agenda 24h ahead",
      description: "Your tasks first; vendor tour second.",
      order: 0,
    },
    {
      id: "scorer",
      label: "Assign a live scorer",
      description: "Notes on the shared scorecard during the call.",
      order: 1,
    },
    {
      id: "same-script",
      label: "Reuse the same script per vendor",
      description: "Fair comparison across finalists.",
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
    title: "CRM Demo Guide: Buyer-Led Demos That Reveal Fit | SoftwareGlimpse",
    description:
      "Run CRM demos with your agenda, must-have script, and live scoring — avoid demo theater.",
    canonicalPath: "/guides/crm-demo-guide/",
    indexable: true,
  },
};
