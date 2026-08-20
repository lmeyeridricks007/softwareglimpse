import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const marketingEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate marketing software with one shared script per job cluster: queue a week of posts with approvals, publish one funnel page, run a three-step journey, or triage a mention stream — on the qualifying plan. Decision rule: finalists only advance if the weekly ritual stays accurate after three days of real use.",
    bullets: [
      "Shared trial script",
      "Qualifying plan only",
      "One real campaign",
      "Approvals / visibility check",
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
        body: "Vendor tours skip plan gates and messy campaign data. Score the configuration you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty calendar that still needs a side spreadsheet after three days fails the evaluation.",
      },
      {
        label: "Include a sceptic publisher",
        body: "Adoption risk shows up when a reluctant social lead or demand-gen owner tries to ship without IT.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Pick one script for your cluster. Scheduling: queue five posts with one approval. Funnels: publish one page and capture a test lead. MAP: enroll a test person in a three-step journey. Listening: assign owners on a real mention stream for three days. Webinars: run a 20-minute test session with registration.\n\nWorked example: Northline Demand eliminated a finalist when journey branching only worked on a higher tier than the quote assumed.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/marketing-software-evaluation-guide-script.png",
      alt: "Four-day marketing evaluation script from sample campaign to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside each job cluster, weigh ease of use, campaign/content, automation, funnel conversion, analytics/attribution, brand monitoring, integrations, scalability, value, and AI assistance — the SoftwareGlimpse marketing-editorial criteria. Do not reorder finalists by commission. Do not rank a scheduler against a listening suite.",
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
          "Two weeks is enough for most SMB/mid teams if you run a fixed script. Longer trials help when legal review or MAP data plumbing is the risk.",
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
    href: "/best/marketing-software/",
    ctaLabel: "Best marketing software →",
    variant: "finder",
  },
];

export const marketingSoftwareEvaluationGuide: GuidePage = {
  id: "guide-marketing-software-evaluation-guide",
  slug: "marketing-software-evaluation-guide",
  title: "Marketing Software Evaluation Guide",
  summary:
    "A practical evaluation script for social scheduling, funnels, MAP, listening, and webinar tools.",
  categorySlugs: ["marketing"],
  topicType: "buying-guide",
  heroVisual: {
    src: "/guides/marketing-software-evaluation-guide-hero.png",
    alt: "Educational illustration for Marketing Software Evaluation Guide.",
  },
  supports: [
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-marketing-software",
    "how-to-choose-marketing-software",
    "marketing-software-pricing-guide",
    "marketing-software-requirements-guide",
  ],
  blocks: marketingEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T12:00:00.000Z",
    publishedAt: "2026-08-18T12:00:00.000Z",
    reviewedAt: "2026-08-18T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Marketing Software Evaluation Guide | SoftwareGlimpse",
    description:
      "Evaluate marketing software with a shared trial script by job cluster — scheduling, funnels, MAP, listening, and webinars.",
    canonicalPath: "/guides/marketing-software-evaluation-guide/",
    indexable: true,
  },
};
