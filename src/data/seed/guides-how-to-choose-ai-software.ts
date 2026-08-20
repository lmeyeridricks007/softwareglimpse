import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseAiSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Start with the job blocking work this quarter — not the brand on a billboard. “AI software” covers LLM assistants, coding tools, image and video, meeting notes, writing, voice, decks, sites, ads, and agents. Pick one primary job, shortlist tools built for that job, then check seats, credits or tokens, GPU hours, and any Copilot add-on SKU before you demo.",
    bullets: [
      "One primary job to be done",
      "People who need access",
      "Usage unit you will hit (seats, credits, GPU)",
      "Must-have plan gates & integrations",
      "Copilot / SKU identity check",
      "Trial on one real workflow",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“AI software” is several products",
        body: "A chat assistant, a coding editor, an image generator, and a meeting-notes tool fail for different reasons. Name the weekly output before you name a vendor.",
      },
      {
        label: "Seat vs credit vs GPU math changes cost",
        body: "Per-seat floors, token packs, GPU hours, and Copilot add-ons often decide total cost. Price the configuration you will actually buy — not the starter tile.",
      },
      {
        label: "Identity mix-ups hide on marketing pages",
        body: "Microsoft 365 Copilot is not GitHub Copilot. GitHub Copilot is not GitHub. Confirm which SKU you are evaluating before the demo.",
      },
      {
        label: "Compare peers inside the same job cluster",
        body: "Once the job is frozen, use requirements, pricing, and evaluation guides — then shortlist on Best AI software with the same assumptions on every finalist.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Five worked examples",
    src: "/guides/how-to-choose-ai-software-needs.png",
    alt: "Five worked examples of AI buying: LLM assistant, AI coding, image generation, meeting notes, and agents.",
    caption:
      "Five teams, one category, five different shortlists. Copy the pattern: one sentence about the weekly output, then pick the matching cluster.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive AI selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "LLM assistant (chat / research)",
          "AI coding (IDE / completions)",
          "Image or video generation",
          "Meeting notes / writing / voice",
          "Decks, sites, ads, or agents",
        ],
      },
      {
        id: "team-size",
        label: "People needing access",
        options: ["1–5", "6–20", "21–75", "75+"],
      },
      {
        id: "usage-unit",
        label: "Usage unit you will hit",
        options: ["Seats", "Credits / tokens", "GPU hours", "Minute / conversation caps"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["Microsoft 365", "GitHub / IDE", "Creative Cloud", "Minimal integrations"],
      },
      {
        id: "budget-style",
        label: "Buying style",
        options: ["Free / self-serve", "Published seats", "Credit / GPU packs", "Add-on Copilot SKU"],
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roadmap",
    title: "Selection workflow",
    steps: [
      { id: "step-job", label: "Name the job" },
      { id: "step-gates", label: "Plan gates" },
      { id: "step-units", label: "Price units" },
      { id: "step-sku", label: "Confirm SKU" },
      { id: "step-trial", label: "Trial" },
      { id: "step-decide", label: "Decide" },
    ],
    figure: {
      src: "/guides/how-to-choose-ai-software-framework.png",
      alt: "AI selection workflow: name the job, map plan gates, price usage units, confirm SKU identity, trial one workflow, decide.",
      caption:
        "Freeze the job cluster before demos — then run the same trial script on every finalist.",
    },
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without tab archaeology.” If the blank is cited research drafts, you are buying an LLM assistant. If it is inline completions or multi-file refactors in the IDE, you are buying AI coding. If it is distinctive stills with defensible IP, you are buying image generation. If it is meeting transcripts your team actually reads, you are buying meeting notes — not a chat tool by default.\n\nWorked example: Northline Studio wrote “every campaign still ships with a commercial IP story we can defend.” That sentence ruled out community image tools before demos started and pointed at Adobe Firefly as a Creative Cloud peer of Midjourney.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
    scenarios: [
      {
        title: "LLM assistant job",
        body: "Multi-turn research, writing, and Q&A — compare ChatGPT-class tools inside the assistant cluster.",
      },
      {
        title: "AI coding job",
        body: "IDE completions and agents — compare Cursor and GitHub Copilot, not Microsoft 365 Copilot.",
      },
      {
        title: "Media or meeting job",
        body: "Stills, video, voice, or transcripts as the weekly output — specialist tools, not general chat.",
      },
    ],
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan gates and usage units",
    body: "List workflows that must work on day one — custom GPTs, SSO, IDE agents, stealth stills, video credits, meeting recap, TTS cloning, or no-code agents — and ask which plan, credit pack, GPU hour, or Copilot SKU unlocks them. Token-cap and GPU vendors need a volume model, not just a seat count.\n\nWorked example: Harbor Labs needed an AI-native editor with multi-file agents; a Microsoft 365 Copilot quote failed that requirement because it is a different product from GitHub Copilot and Cursor.\n\nDo not invent dollar totals from marketing tiles. Compare vendor-written quotes for the same headcount and usage assumption.",
    tip: "Ask for a written configuration quote — seats, credits/tokens, GPU hours, minute caps, Copilot add-ons — before the demo ends.",
  },
  {
    type: "step",
    id: "trial-script",
    stepNumber: 3,
    heading: "Run the same trial script on every shortlisted tool",
    body: "Pick one workflow your team will run weekly. Run it on every finalist the same week: load real (or redacted) context, produce the artifact, check governance hooks you need, and note where the tool breaks. Score every product on the same card the same day.\n\nWorked example: Harbor Labs trials three coding tools on the same refactor ticket. Tool A wins completions but lacks the agent depth on their repo size. Tool B clears agents with slower latency. Tool C fails SSO on the tier they were quoted — dropped from the shortlist without a second meeting.",
    tip: "Ban “show us the coolest demo feature” as agenda item one. Run your named weekly output first.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy an all-in-one AI suite?",
        answer:
          "Only if you will use multiple hubs weekly. Otherwise a specialist coding tool, image generator, meeting-notes product, or agent builder usually ships faster and clearer total cost.",
      },
      {
        question: "How do I treat GitHub Copilot on an AI shortlist?",
        answer:
          "As an AI-coding product. It is not Microsoft 365 Copilot and it is not GitHub the source-control platform. Compare it to Cursor inside the AI-coding cluster.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves with the AI requirements guide, model units with the pricing guide, run a fair trial with the evaluation guide, then shortlist on Best AI software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related AI software resources",
    links: [
      {
        href: "/guides/what-is-ai-software/",
        label: "What is AI software?",
        description: "Category fundamentals and job clusters.",
      },
      {
        href: "/guides/ai-requirements-guide/",
        label: "Requirements guide",
        description: "Must-have vs nice-to-have sheet.",
      },
      {
        href: "/guides/ai-evaluation-guide/",
        label: "Evaluation guide",
        description: "Trial scorecard.",
      },
      {
        href: "/guides/ai-pricing-guide/",
        label: "Pricing guide",
        description: "Seats, credits, GPU hours, and Copilot SKUs.",
      },
      {
        href: "/best/ai-software/",
        label: "Best AI software",
        description: "Methodology-based shortlist by job cluster.",
      },
      {
        href: "/categories/ai/",
        label: "AI software category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Compare researched options",
    body: "Open the Best AI software shortlist after your job cluster and usage assumptions are frozen — rankings follow published criteria, not commissions.",
    href: "/best/ai-software/",
    ctaLabel: "See Best AI Software →",
    variant: "finder",
  },
];

export const howToChooseAiSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ai-software",
  slug: "how-to-choose-ai-software",
  title: "How to Choose AI Software: Job-First Framework",
  summary:
    "Choose AI software by primary job — LLM assistant, coding, image, video, meeting notes, or agents — then map plan gates, usage units, SKU identity, and a shared trial script.",
  categorySlugs: ["ai"],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/how-to-choose-ai-software-hero.png",
    alt: "How to choose AI software: name the job, map usage units, confirm SKU identity before comparing brands.",
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
  nextAction: {
    contentId: "content:best:ai-software",
    label: "See Best AI Software",
  },
  relatedGuideSlugs: [
    "what-is-ai-software",
    "ai-pricing-guide",
    "ai-requirements-guide",
    "ai-evaluation-guide",
  ],
  blocks: howToChooseAiSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Freeze primary job",
      description: "One weekly output sentence.",
      order: 0,
    },
    {
      id: "units",
      label: "Price the usage units",
      description: "Seats, credits, GPU, or Copilot SKU.",
      order: 1,
    },
    {
      id: "trial",
      label: "Run shared trial script",
      description: "Same workflow on every finalist.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-19T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-19T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose AI Software | SoftwareGlimpse",
    description:
      "Job-first framework for choosing AI software — LLM assistants, coding, image, video, meeting notes, and agents — with plan gates, usage units, and a fair trial script.",
    canonicalPath: "/guides/how-to-choose-ai-software/",
    indexable: true,
  },
};
