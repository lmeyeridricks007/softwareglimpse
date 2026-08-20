import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const customerServiceEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate customer service software with one shared script per job cluster: run a real ticket queue, staff a week of live chat, process Shopify refunds in-thread, or log an IT incident — on the qualifying plan. Decision rule: finalists only advance if the weekly ritual stays accurate after three days of real use.",
    bullets: [
      "Shared trial script",
      "Qualifying plan / volume only",
      "One real workflow",
      "Lead visibility check",
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
        body: "Vendor tours skip plan gates and messy ticket data. Score the configuration you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty inbox that drops SLA clocks after three days fails the evaluation.",
      },
      {
        label: "Include a sceptical agent",
        body: "Adoption risk shows up when a reluctant agent tries macros, collision detection, or the mobile inbox.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Pick one script for your cluster. Helpdesk: convert five real emails, assign owners, hit an SLA. Live chat: staff the widget for three days with canned replies and routing. Ecommerce: process two refunds with order context. ITSM: log an incident, a problem, and a change on the qualifying tier.\n\nWorked example: Northline Support eliminated a finalist when Shopify refund macros only worked on a higher plan than the quote assumed.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/customer-service-evaluation-guide-script.png",
      alt: "Four-day customer service evaluation script from sample workflow to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside each job cluster, weigh ease of use, support job fit, workflow depth, omnichannel, self-service, integrations, analytics, scalability, value, and AI assistance — the SoftwareGlimpse customer-service-editorial criteria. Do not reorder finalists by commission. Do not rank a helpdesk against a live-chat widget or an ITSM desk.",
    tip: "If two peers tie inside a cluster, prefer the one your sceptical agent will actually keep open.",
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
    href: "/best/customer-service-software/",
    ctaLabel: "Best customer service software →",
    variant: "finder",
  },
];

export const customerServiceEvaluationGuide: GuidePage = {
  id: "guide-customer-service-evaluation-guide",
  slug: "customer-service-evaluation-guide",
  title: "Customer Service Software Evaluation Guide",
  summary:
    "A practical evaluation script for helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM tools.",
  categorySlugs: ["customer-service"],
  topicType: "buying-guide",
  heroVisual: {
    src: "/guides/customer-service-evaluation-guide-hero.png",
    alt: "Educational illustration for Customer Service Software Evaluation Guide.",
  },
  supports: [
    {
      contentId: "content:category:customer-service",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:customer-service-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-customer-service-software",
    "how-to-choose-customer-service-software",
    "customer-service-pricing-guide",
    "customer-service-requirements-guide",
  ],
  blocks: customerServiceEvaluationGuideBlocks as GuidePage["blocks"],
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
    title: "Customer Service Software Evaluation Guide | SoftwareGlimpse",
    description:
      "Evaluate customer service software with a shared trial script by job cluster — helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM.",
    canonicalPath: "/guides/customer-service-evaluation-guide/",
    indexable: true,
  },
};
