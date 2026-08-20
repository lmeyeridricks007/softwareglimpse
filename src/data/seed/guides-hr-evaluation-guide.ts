import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const hrEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate HR software with one shared script per job cluster: run a real hiring pool, publish a week of shifts, clock in with your attendance policy, or assign one training path — on the qualifying plan. Decision rule: finalists only advance if the weekly ritual stays accurate after three days of real use.",
    bullets: [
      "Shared trial script",
      "Qualifying plan / hubs only",
      "One real workflow",
      "Manager visibility check",
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
        body: "Vendor tours skip plan gates and messy frontline data. Score the configuration you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty schedule that drifts after three days fails the evaluation.",
      },
      {
        label: "Include a frontline sceptic",
        body: "Adoption risk shows up when a reluctant hourly worker tries to clock in or open the app.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Pick one script for your cluster. ATS: create one role, post it, move three candidates through stages. WFM: build next week’s shifts for one site and publish. Time: clock in/out with your geofence or face policy for three days. SOP: assign one role path and check completion evidence.\n\nWorked example: Northline Ops eliminated a finalist when GPS clock-in only worked on a higher hub than the quote assumed.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/hr-evaluation-guide-script.png",
      alt: "Four-day HR evaluation script from sample workflow to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside each job cluster, weigh ease of use, hiring/workforce fit, workflow depth, integrations, mobile/frontline readiness, analytics, scalability, value, and AI assistance — the SoftwareGlimpse hr-editorial criteria. Do not reorder finalists by commission. Do not rank an ATS against a time clock.",
    tip: "If two peers tie inside a cluster, prefer the one your sceptic user will actually open.",
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
    title: "Compare editor’s picks",
    body: "See job-cluster recommendations after your trial notes.",
    href: "/best/hr-software/",
    ctaLabel: "Best HR software →",
    variant: "finder",
  },
];

export const hrEvaluationGuide: GuidePage = {
  id: "guide-hr-evaluation-guide",
  slug: "hr-evaluation-guide",
  title: "HR Software Evaluation Guide",
  summary:
    "A practical evaluation script for ATS, frontline WFM, time & attendance, SOP training, and LMS tools.",
  categorySlugs: ["hr"],
  topicType: "buying-guide",
  heroVisual: {
    src: "/guides/hr-evaluation-guide-hero.png",
    alt: "Educational illustration for HR Software Evaluation Guide.",
  },
  supports: [
    {
      contentId: "content:category:hr",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:hr-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-hr-software",
    "how-to-choose-hr-software",
    "hr-pricing-guide",
    "hr-requirements-guide",
  ],
  blocks: hrEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T00:00:00.000Z",
    publishedAt: "2026-08-17T00:00:00.000Z",
    reviewedAt: "2026-08-17T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "HR Software Evaluation Guide | SoftwareGlimpse",
    description:
      "Evaluate HR software with a shared trial script by job cluster — ATS, WFM, time & attendance, SOP training, and LMS.",
    canonicalPath: "/guides/hr-evaluation-guide/",
    indexable: true,
  },
};
