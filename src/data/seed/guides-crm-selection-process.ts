import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Selection Process — steps, owners, timeline.
 * Template: softwareglimpse-guide-template-v1
 */
const crmSelectionProcessBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Run CRM selection as a gated process — Define → Requirements → Shortlist → Demo/trial → Decide → Rollout — with a named owner for each gate. Decision rule: do not advance stages until the gate artifact exists (outcomes, requirements sheet, scored shortlist, decision memo); skipping gates is how teams buy from the last demo.",
    bullets: [
      "Define need",
      "Requirements sheet",
      "Shortlist",
      "Demo & trial",
      "Decide",
      "Rollout plan",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Process beats preference",
        body: "A short RACI and timeline prevent endless demos and silent vetoes.",
      },
      {
        label: "Every gate needs an artifact",
        body: "Outcomes, sheet, scores, and a written decision keep the team aligned.",
      },
      {
        label: "Owners unblock speed",
        body: "Ambiguous “the team will decide” stalls more buys than missing features.",
      },
      {
        label: "Rollout is part of selection",
        body: "Who owns fields, training, and go-live criteria should be named before signature.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "process-stages",
    title: "Selection process stages",
    steps: [
      { id: "define", label: "Define", short: "Need & scope" },
      { id: "requirements", label: "Requirements", short: "Sheet ready" },
      { id: "shortlist", label: "Shortlist", short: "2–3 tools" },
      { id: "trial", label: "Demo/trial", short: "Same script" },
      { id: "decide", label: "Decide", short: "Scored pick" },
      { id: "rollout", label: "Rollout", short: "Owners set" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose →",
    figure: {
      src: "/guides/crm-selection-roadmap.png",
      alt: "CRM selection roadmap stages from needs through decision.",
      caption: "Walk stages in order; gate artifacts prevent demo-driven jumps.",
    },
  },
  {
    type: "figure",
    id: "raci-visual",
    title: "RACI / gate owners",
    src: "/guides/crm-selection-process-raci.png",
    alt: "RACI-style diagram showing who is responsible, accountable, consulted, and informed across CRM selection gates.",
    caption:
      "Name R/A for each gate before demos start — consulted voices advise; they do not silently veto later.",
  },
  {
    type: "step",
    id: "gates-and-owners",
    stepNumber: 1,
    heading: "Assign owners to each gate",
    body: "Map Responsible and Accountable people for Define, Requirements, Shortlist, Demo/trial, Decide, and Rollout. Consult daily users early; keep one accountable decider.\n\nExample: a 6-person B2B team sets RACI — founder Accountable for Decide; ops lead Responsible for Requirements sheet; both sellers Responsible for trial scores; delivery Consulted on handoff fields; finance Informed on budget posture. Gate rule: no vendor demo until the requirements sheet is marked complete by ops.",
    tip: "Write the RACI on one page. If two people think they are Accountable for Decide, fix that before shortlisting.",
    figure: {
      src: "/guides/crm-selection-process-hero.png",
      alt: "CRM selection process hero: Define through Rollout with owners and timeline.",
      caption:
        "Selection is a staged process with owners — not a series of unrelated demos.",
    },
    scenarios: [
      {
        title: "Define",
        body: "Confirm CRM need and 90-day scope with the buyer.",
      },
      {
        title: "Requirements",
        body: "Ops/admin owns the must vs nice sheet and constraints.",
      },
      {
        title: "Decide",
        body: "One accountable person signs the decision memo from scores.",
      },
    ],
  },
  {
    type: "step",
    id: "timeline",
    stepNumber: 2,
    heading: "Set a realistic timeline",
    body: "Small teams often finish Define through Decide in a few weeks if artifacts stay thin. Block calendar for scripted trials; do not stack five demos in two days without scoring time.\n\nExample: the same team runs a three-week calendar — week 1 Define + requirements, week 2 shortlist + three scripted trials, week 3 diligence questions + decision memo + rollout owner checklist. They refuse to “just see one more tool” after scores are locked unless a hard constraint failed.",
    tip: "Schedule scorecard fill-in the same day as each trial. Delay is how preference replaces evidence.",
    figure: {
      src: "/guides/crm-selection-process-timeline.png",
      alt: "Set a realistic CRM selection timeline: week 1 define and sheet, week 2 trials and scores, week 3 diligence and memo, score same day, lock shortlist.",
      caption:
        "Schedule scores the same day as each trial — delay is how preference replaces evidence.",
    },
    scenarios: [
      {
        title: "Too fast",
        body: "Contract signed after one demo — no requirements sheet or non-admin trial.",
      },
      {
        title: "Too slow",
        body: "Months of demos with rotating stakeholders and no Accountable decider.",
      },
      {
        title: "Healthy pace",
        body: "Gates clear with artifacts; timeline has scoring and diligence days.",
      },
    ],
  },
  {
    type: "size-match",
    id: "process-by-size",
    title: "Process depth by team shape",
    tiers: [
      {
        id: "solo-small",
        label: "Solo / tiny team",
        description:
          "Light process: outcomes, short must-list, one or two trials, written pick.",
        fitHints: ["One decider", "Thin sheet"],
      },
      {
        id: "small-shared",
        label: "Small shared sales team",
        description:
          "Full gates with RACI, shared scorecard, and named rollout owner.",
        fitHints: ["Seller scorers", "Ops admin"],
      },
      {
        id: "scaling",
        label: "Scaling / multi-team",
        description:
          "Add security/review gates and clearer consult lists without inventing bureaucracy.",
        fitHints: ["IT/security", "Change owner"],
      },
    ],
    figure: {
      src: "/guides/crm-size-progression.png",
      alt: "CRM size progression affecting how heavy the selection process should be.",
      caption: "Match process weight to team size — do not copy enterprise RFP theater by default.",
    },
  },
  {
    type: "selection-checklist",
    id: "gate-checklist",
    title: "Gate checklist",
    dimensions: [
      {
        id: "define",
        label: "Define gate",
        options: ["Need confirmed", "90-day scope", "Budget posture"],
      },
      {
        id: "requirements",
        label: "Requirements gate",
        options: ["Outcomes written", "Must vs nice", "Constraints listed"],
      },
      {
        id: "shortlist",
        label: "Shortlist gate",
        options: ["2–3 tools", "Hard filters applied", "Trial accounts ready"],
      },
      {
        id: "trial",
        label: "Demo/trial gate",
        options: ["Shared script", "Scores filled", "Non-admin ran tasks"],
      },
      {
        id: "decide",
        label: "Decide gate",
        options: ["Decision memo", "Diligence open items", "Rollout owner named"],
      },
    ],
  },
  {
    type: "checklist",
    id: "process-artifacts",
    title: "Artifacts to keep",
    copyable: true,
    items: [
      {
        id: "raci",
        label: "One-page RACI",
        description: "R/A for each gate.",
        order: 0,
      },
      {
        id: "sheet",
        label: "Requirements sheet",
        description: "Outcomes, musts, constraints.",
        order: 1,
      },
      {
        id: "scores",
        label: "Shared scorecard",
        description: "Same script, same weights.",
        order: 2,
      },
      {
        id: "memo",
        label: "Decision + rollout memo",
        description: "Why this tool; who owns go-live.",
        order: 3,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Process mistakes",
    items: [
      {
        title: "Starting with demos",
        body: "Without Define and Requirements, every product looks viable.",
      },
      {
        title: "No Accountable decider",
        body: "Consensus theater delays the buy and invites late vetoes.",
      },
      {
        title: "Skipping rollout ownership",
        body: "Selection “ends” at signature — then nobody owns stages or training.",
      },
      {
        title: "Infinite shortlist expansion",
        body: "New vendors after scores are locked usually restart politics, not evidence.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the CRM selection process?",
        answer:
          "A gated path: Define → Requirements → Shortlist → Demo/trial → Decide → Rollout, with named owners and artifacts at each gate. Do not advance until the gate artifact exists — that is the decision rule that prevents last-demo bias.",
      },
      {
        question: "Who should own CRM selection?",
        answer:
          "One Accountable decider (often the buyer/founder), a Responsible owner for the requirements sheet, and daily users Responsible for trial scores. Consult delivery/IT as needed; avoid dual Accountables.",
      },
      {
        question: "How long should selection take?",
        answer:
          "Small teams can often complete it in a few focused weeks if artifacts stay thin. Longer timelines need clearer RACI — not more demos.",
      },
      {
        question: "When does rollout planning start?",
        answer:
          "Before signature: name who owns fields, stages, training, and go-live criteria so Decide includes implementation reality.",
      },
      {
        question: "What should I do next?",
        answer:
          "Draft the RACI, then use the Requirements and Evaluation guides for gate artifacts — or CRM Finder once constraints are clear.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Criteria inside each stage.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Requirements gate artifact.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Trial and scorecard gate.",
      },
      {
        href: "/guides/crm-business-case/",
        label: "CRM business case",
        description: "Decide-gate approval memo.",
      },
      {
        href: "/guides/crm-selection-mistakes/",
        label: "CRM selection mistakes",
        description: "Where processes derail.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Build a constrained shortlist.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Artifact for the requirements gate.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score finalists at the trial gate.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Shortlist with structure",
    body: "When Define and Requirements are clear, CRM Finder helps build a constrained shortlist for the trial gate — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmSelectionProcessGuide: GuidePage = {
  id: "guide-crm-selection-process",
  slug: "crm-selection-process",
  title: "CRM Selection Process: Steps, Owners & Timeline",
  summary:
    "Run an end-to-end CRM selection process with clear stages, RACI owners, gate artifacts, and a realistic timeline from Define through Rollout.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-selection-process-hero.png",
    alt: "CRM selection process hero: Define through Rollout with owners and timeline.",
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
    "how-to-choose-crm",
    "crm-requirements-guide",
    "crm-evaluation-guide",
    "crm-business-case",
    "crm-selection-mistakes",
    "crm-vendor-evaluation",
    "do-i-need-a-crm",
  ],
  blocks: crmSelectionProcessBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "raci",
      label: "Publish gate RACI",
      description: "One Accountable per Decide gate.",
      order: 0,
    },
    {
      id: "timeline",
      label: "Block trial + score days",
      description: "Same-day scorecards on the calendar.",
      order: 1,
    },
    {
      id: "artifacts",
      label: "Require gate artifacts",
      description: "No demo before requirements sheet.",
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
    title: "CRM Selection Process: Steps, Owners & Timeline | SoftwareGlimpse",
    description:
      "End-to-end CRM selection process with stages, RACI owners, gate artifacts, and timeline — from Define through Rollout.",
    canonicalPath: "/guides/crm-selection-process/",
    indexable: true,
  },
};
