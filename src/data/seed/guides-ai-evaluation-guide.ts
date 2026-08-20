import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const aiEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate AI software with one shared script per job cluster: run a real research thread, complete a multi-file refactor, generate a campaign still, transcribe a real meeting, or ship a prompt-to-deck — on the qualifying plan. Decision rule: finalists only advance if the weekly ritual stays accurate after three days of real use.",
    bullets: [
      "Shared trial script",
      "Qualifying plan / usage only",
      "One real workflow",
      "Admin / privacy check",
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
        body: "Vendor tours skip plan gates, credit overage, and messy prompts. Score the configuration you will buy.",
      },
      {
        label: "Accuracy beats beauty",
        body: "A pretty chat UI that drops connectors or overages after three days fails the evaluation.",
      },
      {
        label: "Include a sceptical user",
        body: "Adoption risk shows up when a reluctant engineer tries the agent loop, or a designer hits GPU-hour caps.",
      },
    ],
  },
  {
    type: "step",
    id: "script",
    stepNumber: 1,
    heading: "Run the same script on every finalist",
    body: "Pick one script for your cluster. LLM assistant: one real brief with projects and a connector. AI coding: one multi-file refactor on the qualifying seat. Image: three campaign stills with the IP terms you need. Video: one short clip against the credit pack. Meeting: three days of transcripts. Writing/voice/decks/sites/ads/agents: one artefact you would actually ship.\n\nWorked example: Northline Studio eliminated a finalist when commercial-use stills only worked on a higher GPU-hour tier than the quote assumed.",
    tip: "Record a 10-minute loom of each trial for stakeholders who skip hands-on time.",
    figure: {
      src: "/guides/ai-evaluation-guide-script.png",
      alt: "Four-day AI evaluation script from sample workflow to accuracy check.",
      caption: "Same script, same plan tier, same success criteria — then compare notes.",
    },
  },
  {
    type: "step",
    id: "decide",
    stepNumber: 2,
    heading: "Decide with methodology, not affiliate pressure",
    body: "Inside each job cluster, weigh ease of use, AI job fit, workflow depth, integrations, admin/privacy, scalability, value, and assistance quality — the SoftwareGlimpse ai-editorial criteria. Do not reorder finalists by commission. Do not rank an LLM assistant against an image generator, or GitHub Copilot against Microsoft 365 Copilot.",
    tip: "If two peers tie inside a cluster, prefer the one your sceptical user will actually keep open.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How long should a trial last?",
        answer:
          "Two weeks is enough for most SMB/mid teams if you run a fixed script. Longer trials help when credit overage or change management is the risk.",
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
    href: "/best/ai-software/",
    ctaLabel: "Best AI software →",
    variant: "finder",
  },
];

export const aiEvaluationGuide: GuidePage = {
  id: "guide-ai-evaluation-guide",
  slug: "ai-evaluation-guide",
  title: "AI Software Evaluation Guide",
  summary:
    "A practical evaluation script for LLM assistants, AI coding, image and video, meeting notes, writing, voice, decks, sites, ads, and agents.",
  categorySlugs: ["ai"],
  topicType: "buying-guide",
  heroVisual: {
    src: "/guides/ai-evaluation-guide-hero.png",
    alt: "Educational illustration for AI Software Evaluation Guide.",
  },
  supports: [
    {
      contentId: "content:category:ai",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:ai-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ai-software",
    "how-to-choose-ai-software",
    "ai-pricing-guide",
    "ai-requirements-guide",
  ],
  blocks: aiEvaluationGuideBlocks as GuidePage["blocks"],
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
    title: "AI Software Evaluation Guide | SoftwareGlimpse",
    description:
      "Evaluate AI software with a shared trial script by job cluster — LLM assistants, coding, image, video, meeting notes, writing, voice, decks, sites, ads, and agents.",
    canonicalPath: "/guides/ai-evaluation-guide/",
    indexable: true,
  },
};
