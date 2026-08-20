import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const aiRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write AI requirements as jobs and evidence, not feature wishlists: primary job (LLM assistant vs coding vs image vs video vs meeting vs writing vs voice vs decks vs sites vs ads vs agents), must-have models or outputs, usage unit, stack integrations, admin/privacy, and who uses it weekly. Decision rule: every must-have must map to a weekly output and a plan, credit pack, GPU hour, or Copilot SKU you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have outputs",
      "Usage unit (seats / credits / GPU)",
      "Integrations list",
      "Admin / privacy gates",
      "Roles & permissions",
    ],
  },
  {
    type: "key-takeaways",
    id: "kt",
    title: "Key takeaways",
    items: [
      {
        label: "Separate must from nice",
        body: "If the team still operates without it for 90 days, it is nice-to-have.",
      },
      {
        label: "Requirements own plan gates",
        body: "SSO, custom GPTs, stealth stills, and Copilot add-ons imply a qualifying configuration — write that explicitly.",
      },
      {
        label: "Clusters need their own sheet",
        body: "LLM-assistant, AI-coding, and image-generation requirements should not pollute a single undifferentiated RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who produces the output, (2) who needs visibility or admin, (3) which stack tools must connect — Microsoft 365, the IDE, Creative Cloud, or meeting tools.\n\nWorked example: Harbor Labs wrote “Engineers complete multi-file refactors in the editor; the lead needs SSO without chasing seats; legal needs a privacy mode we can point to.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan/usage unit. Rows for LLM assistant, AI coding, image, video, meeting, writing, voice, presentations, website builder, ad creative, agents, integrations, admin.\n\nThis guide is the requirements surface for AI buyers on SoftwareGlimpse.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/ai-requirements-guide-sheet.png",
      alt: "One-page AI requirements score sheet with must/nice columns and usage-unit gates.",
      caption:
        "One page beats a 40-row feature dump — every must-have needs evidence and a plan, credit, GPU, or Copilot SKU.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should requirements include scores?",
        answer:
          "No invented product scores. Capture evidence against your jobs; use Best page methodology for cluster editor’s picks.",
      },
      {
        question: "How many must-haves is too many?",
        answer:
          "If more than roughly eight items are must-haves, you are still in wishlist mode — force a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Turn the score sheet into an evaluation script.",
    href: "/guides/ai-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const aiRequirementsGuide: GuidePage = {
  id: "guide-ai-requirements-guide",
  slug: "ai-requirements-guide",
  title: "AI Software Requirements Guide",
  summary:
    "A practical requirements sheet for LLM assistants, AI coding, image and video, meeting notes, writing, voice, decks, sites, ads, and agents.",
  categorySlugs: ["ai"],
  topicType: "checklist",
  heroVisual: {
    src: "/guides/ai-requirements-guide-hero.png",
    alt: "Educational illustration for AI Software Requirements Guide.",
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
    "ai-evaluation-guide",
  ],
  blocks: aiRequirementsGuideBlocks as GuidePage["blocks"],
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
    title: "AI Software Requirements Guide | SoftwareGlimpse",
    description:
      "Write AI software requirements by job cluster — LLM assistants, coding, image, video, meeting notes, writing, voice, decks, sites, ads, and agents — with must/nice evidence.",
    canonicalPath: "/guides/ai-requirements-guide/",
    indexable: true,
  },
};
