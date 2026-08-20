import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const projectManagementEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate project management software with one shared script: import or create a real project, assign owners, configure one automation, open the manager view you need weekly, and test the integrations you rely on. Decision rule: finalists only advance if status stays accurate after three days of real use on the qualifying plan.",
    bullets: [
      "Shared trial script",
      "Qualifying plan only",
      "One automation",
      "Manager dashboard",
      "Integration smoke test",
      "Three-day accuracy check",
    ],
  },
  {
    type: "key-takeaways",
    id: "kt",
    title: "Key takeaways",
    items: [
      {
        label: "Demos are not trials",
        body: "Vendor tours skip plan gates and messy data. Score the plan you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty board that drifts after three days fails the evaluation.",
      },
      {
        label: "Include a sceptic user",
        body: "Adoption risk shows up when a reluctant contributor tries to update work.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Day 0: create the Harbor Studio sample project (8 tasks, 2 milestones, 3 owners). Day 1: add one automation (status → notify account lead). Day 2: open the timeline or dashboard a manager would use. Day 3: check whether owners and dates still match reality.\n\nWorked example: Northline Ops eliminated a finalist when the automation only worked on a higher plan than the quote assumed.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/project-management-evaluation-guide-script.png",
      alt: "Four-day project management evaluation script from sample project to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside the work OS cluster, weigh ease of use, planning depth, automation, collaboration, integrations, reporting, scalability, value, and AI assistance — the SoftwareGlimpse criteria. Do not reorder finalists by commission. Specialists belong on separate decision paths.",
    tip: "If two peers tie, prefer the one your sceptic user will actually update.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How long should a trial last?",
        answer:
          "Two weeks is enough for most SMB/mid teams if you run a fixed script. Longer trials help when change management is the risk.",
      },
      {
        question: "What if hands-on testing is not available?",
        answer:
          "SoftwareGlimpse disclosures note research-grounded editorial judgment when handsOnTesting is false — still demand a vendor trial for your own purchase decision.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Compare awards",
    body: "See job-cluster recommendations after your trial notes.",
    href: "/best/project-management-software/",
    ctaLabel: "Best project management software →",
    variant: "finder",
  },
];

export const projectManagementEvaluationGuide: GuidePage = {
  id: "guide-project-management-evaluation-guide",
  slug: "project-management-evaluation-guide",
  title: "Project Management Evaluation Guide",
  summary: "A practical evaluation script for work OS peers and adjacent productivity tools.",
  categorySlugs: ["project-management"],
    topicType: "buying-guide",
    heroVisual: {
    src: "/guides/project-management-evaluation-guide-hero.png",
    alt: "Educational illustration for Project Management Evaluation Guide.",
  },
    supports: [
    {
      contentId: "content:category:project-management",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:project-management-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-project-management-software",
    "how-to-choose-project-management-software",
    "project-management-pricing-guide",
    "project-management-requirements-guide",
    "project-management-evaluation-guide",
  ].filter((s) => s !== "project-management-evaluation-guide"),
  blocks: projectManagementEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T18:00:00.000Z",
    publishedAt: "2026-08-17T18:00:00.000Z",
    reviewedAt: "2026-08-17T18:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Project Management Evaluation Guide | SoftwareGlimpse",
    description: "How to trial and score project management software with one shared script on the qualifying plan.",
    canonicalPath: "/guides/project-management-evaluation-guide/",
    indexable: true,
  },
};
