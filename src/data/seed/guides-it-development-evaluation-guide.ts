import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const itDevelopmentEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate IT and development software with one shared script per job cluster: log an employee incident, staff a service map, page the on-call, merge a real PR, provision a panel, or pull a compliant proxy sample — on the qualifying plan. Decision rule: finalists only advance if the weekly ritual stays accurate after three days of real use.",
    bullets: [
      "Shared trial script",
      "Qualifying plan / usage only",
      "One real workflow",
      "Admin / security check",
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
        body: "Vendor tours skip plan gates, ingest overage, and messy ticket data. Score the configuration you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty dashboard that drops pages or log retention after three days fails the evaluation.",
      },
      {
        label: "Include a sceptical operator",
        body: "Adoption risk shows up when a reluctant SRE tries the service map, or an agent hits an ITSM plan gate.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Pick one script for your cluster. ITSM: log an incident, a problem, and a change on the qualifying tier. Observability: instrument one service with metrics, a trace, and log search. On-call: staff a rotation and fire a test page. Source control: open a PR and run CI. Hosting: provision one site on the panel SKU. Web data: pull a compliant sample against the proxy GB pack.\n\nWorked example: Northline Platform eliminated a finalist when APM only worked on a higher host pack than the quote assumed — and separately kept PagerDuty off the observability sheet.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/it-development-evaluation-guide-script.png",
      alt: "Four-day IT evaluation script from sample workflow to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside each job cluster, weigh ease of use, IT job fit, workflow depth, integrations, admin/security, scalability, value, and AI assistance — the SoftwareGlimpse it-development-editorial criteria. Do not reorder finalists by commission. Do not rank an ITSM desk against Datadog, or PagerDuty against GitHub.",
    tip: "If two peers tie inside a cluster, prefer the one your sceptical operator will actually keep open.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How long should a trial last?",
        answer:
          "Two weeks is enough for most SMB/mid teams if you run a fixed script. Longer trials help when ingest overage or change management is the risk.",
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
    href: "/best/it-development-software/",
    ctaLabel: "Best IT & development software →",
    variant: "finder",
  },
];

export const itDevelopmentEvaluationGuide: GuidePage = {
  id: "guide-it-development-evaluation-guide",
  slug: "it-development-evaluation-guide",
  title: "IT & Development Software Evaluation Guide",
  summary:
    "A practical evaluation script for ITSM, observability, incident/on-call, source control, hosting panels, and web-data tools.",
  categorySlugs: ["it-development"],
  topicType: "buying-guide",
  heroVisual: {
    src: "/guides/it-development-evaluation-guide-hero.png",
    alt: "Educational illustration for IT & Development Software Evaluation Guide.",
  },
  supports: [
    {
      contentId: "content:category:it-development",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:it-development-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-it-development-software",
    "how-to-choose-it-development-software",
    "it-development-pricing-guide",
    "it-development-requirements-guide",
  ],
  blocks: itDevelopmentEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "IT & Development Software Evaluation Guide | SoftwareGlimpse",
    description:
      "Evaluate IT and development software with a shared trial script by job cluster — ITSM, observability, on-call, source control, hosting, and web data.",
    canonicalPath: "/guides/it-development-evaluation-guide/",
    indexable: true,
  },
};
