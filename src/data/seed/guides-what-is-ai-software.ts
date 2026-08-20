import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental AI guide — softwareglimpse-guide-template-v1.
 */
const whatIsAiSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI software is several jobs — LLM assistants, coding tools, image and video generators, meeting notes, writing and voice, decks and sites, ad creative, agent builders, and workflow automation platforms — not one undifferentiated “best AI” list. Decision rule: name the weekly output first; if it is multi-turn reasoning, buy an LLM assistant; if it is IDE completions or an AI-native editor, buy an AI coding tool; if it is stills, video, transcripts, or TTS, buy that specialist; if it is multi-app triggers and actions with AI steps, buy workflow automation — and never treat Microsoft 365 Copilot, GitHub Copilot, GitHub, Zapier, and MindStudio as the same product.",
    bullets: [
      "LLM assistant",
      "AI coding",
      "Image & video",
      "Meeting / writing / voice",
      "Decks, sites, ads, agents",
      "Workflow automation",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Chat assistants, coding editors, stills, video, meeting notes, paraphrase, TTS, decks, sites, ads, agent builders, and automation platforms fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "Copilot is not one SKU",
        body: "Microsoft 365 Copilot sits in the Microsoft 365 suite. GitHub Copilot sits in the IDE / GitHub. GitHub itself is source control. Rank them only inside their own jobs.",
      },
      {
        label: "Pricing units are not interchangeable",
        body: "Seats, credits and tokens, GPU hours, conversation or minute caps, task/execution packs, and add-on Copilot SKUs change TCO more than the starter tile.",
      },
      {
        label: "Specialists are not weaker LLMs",
        body: "Otter.ai, Fireflies.ai, Synthesia, QuillBot, ElevenLabs, Gamma, Wegic, AdCreative.ai, MindStudio, Zapier, and n8n are cluster peers for their jobs — not ChatGPT substitutes to rank on one list.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "ai-building-blocks",
    title: "AI software building blocks",
    steps: [
      { id: "block-chat", label: "Chat", short: "LLM assistants" },
      { id: "block-code", label: "Code", short: "IDE / agents" },
      { id: "block-still", label: "Still", short: "Image gen" },
      { id: "block-motion", label: "Motion", short: "Video gen" },
      { id: "block-capture", label: "Capture", short: "Notes / write / voice" },
      { id: "block-build", label: "Build", short: "Decks, sites, ads, agents, automation" },
    ],
    ctaHref: "/guides/how-to-choose-ai-software/",
    ctaLabel: "How to choose AI software →",
    figure: {
      src: "/guides/what-is-ai-software-building-blocks.png",
      alt: "Six AI software building blocks: chat, code, still, motion, capture, and build.",
      caption:
        "These blocks define the AI core. Buy for the block that is blocking first — specialists sit beside each other, not in one peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does AI software work?",
    body: "Most AI platforms specialise: LLM assistants run multi-turn chat, projects, and connectors; coding tools complete or refactor inside an editor; image and video products spend GPU or credit pools on media; meeting tools transcribe; writing and voice tools rewrite or speak; deck, site, ad, and agent builders turn prompts into artefacts; automation platforms connect apps with triggers, actions, and AI steps.\n\nExample: Harbor Labs, an 18-person SaaS team, starts with ChatGPT for research drafts, then adds Cursor when engineers need an AI-native editor — without buying Midjourney they do not need yet.",
    tip: "Write the weekly output you need (“every brief has a cited draft” or “every PR has inline completions”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-ai-software-loop.png",
      alt: "AI software loop across chat, code, stills, video, capture, and build jobs.",
      caption:
        "Each loop is a different purchase. Microsoft 365 Copilot is not GitHub Copilot; GitHub Copilot is not GitHub.",
    },
    scenarios: [
      { title: "Chat", body: "Multi-turn reasoning with projects and connectors." },
      { title: "Code", body: "Completions, agents, and AI-native editors." },
      { title: "Still", body: "Prompt-to-image for creative or commercial work." },
      { title: "Motion", body: "Generative video with credit-priced editors." },
      { title: "Capture", body: "Meeting notes, rewrite, or TTS on their own units." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What AI software typically includes",
    body: "Depending on job cluster: chat and model tiers; inline completions and coding agents; stills and commercial IP terms; video credits; meeting transcription; paraphrase and grammar; voice cloning/TTS; prompt-to-deck; prompt-to-site; ad-creative downloads; or no-code agent builders.\n\nJob clusters matter more than brand names: ChatGPT, Claude, Gemini, Microsoft 365 Copilot, and Perplexity are LLM-assistant shapes; Cursor and GitHub Copilot are AI-coding shapes; Midjourney and Adobe Firefly are image shapes; Runway (generative clips) and Synthesia (avatar / L&D video) are video shapes; Otter.ai and Fireflies.ai are meeting-notes shapes; QuillBot, ElevenLabs, Gamma, Wegic, AdCreative.ai, and MindStudio each own a specialist job. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets “all-in-one AI,” check which hub is actually strong before you buy for a secondary job.",
  },
  {
    type: "crm-types",
    id: "ai-shapes",
    title: "Common AI software shapes (not rankings)",
    types: [
      {
        id: "llm-assistant",
        title: "LLM assistant",
        bestFor: "Teams that need multi-turn chat, research, custom GPTs, or Microsoft 365-native copilots.",
        avoidWhen: "Your primary job is IDE completions, stills, video, or meeting transcripts.",
      },
      {
        id: "ai-code",
        title: "AI coding",
        bestFor: "Engineers who need inline completions, agents, or an AI-native editor.",
        avoidWhen: "You only need Microsoft 365 Copilot in Word/Excel, or GitHub as source control.",
      },
      {
        id: "ai-media",
        title: "Image & video generation",
        bestFor: "Creative teams that need distinctive stills, Creative Cloud IP posture, or generative video.",
        avoidWhen: "Chat reasoning or coding assistance is the real purchase.",
      },
      {
        id: "ai-specialist",
        title: "Capture, write, voice, build",
        bestFor: "Meeting notes, paraphrase, TTS, decks, sites, ad creative, or no-code agents.",
        avoidWhen: "You are shopping an undifferentiated “best AI” list against ChatGPT.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is Microsoft 365 Copilot the same as GitHub Copilot?",
        answer:
          "No. Microsoft 365 Copilot is an add-on SKU inside Microsoft 365. GitHub Copilot is an AI coding product. GitHub is a source-control / DevOps platform. Compare each inside its job cluster only.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. LLM assistants help when chat is the weekly ritual; specialists win when the output is stills, video, transcripts, voice, decks, sites, ads, or agents.",
      },
      {
        question: "Where do ChatGPT, Cursor, Midjourney, Synthesia, and Fireflies.ai fit?",
        answer:
          "They are catalogue cluster leaders or peers for LLM assistant, AI coding, image generation, avatar/L&D video, and meeting notes. Runway remains the generative-filmmaking peer of Synthesia — same cluster, different production job. Compare inside those jobs — see Best AI software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/ai-software/",
    ctaLabel: "See Best AI Software →",
    variant: "finder",
  },
];

export const whatIsAiSoftwareGuide: GuidePage = {
  id: "guide-what-is-ai-software",
  slug: "what-is-ai-software",
  title: "What Is AI Software?",
  summary:
    "A clear definition of LLM assistants, AI coding, image and video, meeting notes, writing, voice, decks, sites, ads, and agents — and why they are not one ranking.",
  categorySlugs: ["ai"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-ai-software-hero.png",
    alt: "Educational SaaS mockup of AI software spanning chat assistants, coding, and generative media jobs.",
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
    contentId: "content:guide:how-to-choose-ai-software",
    label: "How to choose AI software",
  },
  relatedGuideSlugs: [
    "how-to-choose-ai-software",
    "ai-pricing-guide",
    "ai-requirements-guide",
    "ai-evaluation-guide",
  ],
  blocks: whatIsAiSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description:
        "LLM assistant, AI coding, image, video, meeting notes, writing, voice, decks, sites, ads, or agents — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "Knowledge workers, engineers, designers, marketers, or meeting owners.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description:
        "Chat projects, IDE agents, GPU stills, credit video, transcripts, or agent apps — map to plan gates later.",
      order: 2,
    },
  ],
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
    title: "What Is AI Software? | SoftwareGlimpse",
    description:
      "What is AI software? A clear definition of LLM assistants, AI coding, image and video, meeting notes, writing, voice, decks, sites, ads, agents, and workflow automation — not one ranking.",
    canonicalPath: "/guides/what-is-ai-software/",
    indexable: true,
  },
};
