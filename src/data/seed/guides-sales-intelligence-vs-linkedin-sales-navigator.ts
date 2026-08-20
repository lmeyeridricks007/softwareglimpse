import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence vs LinkedIn Sales Navigator — social graph vs verified contact DB / dialer / sequences.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceVsLinkedinSalesNavigatorBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "LinkedIn Sales Navigator is a social-graph prospecting layer — search, InMail, and relationship signals on LinkedIn. Sales intelligence platforms are typically verified contact databases with enrichment, CRM sync, and often dialer or sequence capabilities. Decision rule: if the work is navigating LinkedIn relationships and InMail, Sales Nav fits; if the work is exporting verified emails/phones, dialing, or multichannel sequences outside LinkedIn, you need sales intelligence (or both with clear jobs).",
    bullets: [
      "Sales Nav = social graph",
      "SI = verified contact DB",
      "InMail ≠ email sequences",
      "CRM sync & credits differ",
      "Often complementary",
      "Buy for the primary job",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Different graphs, different outputs",
        body: "Sales Navigator excels at who is connected and active on LinkedIn; SI tools excel at work emails, direct dials, and CRM-ready exports.",
      },
      {
        label: "InMail is not a sequencer",
        body: "Sales Nav messaging stays inside LinkedIn. Multichannel cadences, mailbox warm-up, and dialers live in engagement/SI stacks.",
      },
      {
        label: "Complementary is common",
        body: "Many teams use Sales Nav for account research and SI for verified contact capture — if admin capacity supports both.",
      },
      {
        label: "Do not confuse seat price with coverage",
        body: "Test your ICP on both: LinkedIn presence ≠ usable email/phone rate.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "nav-or-si",
    title: "How to choose (or combine)",
    steps: [
      { id: "job", label: "Primary job", short: "Social vs contact DB" },
      { id: "channel", label: "Channel", short: "InMail vs email/phone" },
      { id: "export", label: "Export need", short: "CRM-ready data?" },
      { id: "dial", label: "Dial / sequence", short: "Outside LinkedIn?" },
      { id: "stack", label: "Stack shape", short: "Nav, SI, or both" },
      { id: "admin", label: "Admin capacity", short: "Who owns each?" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    figure: {
      src: "/guides/sales-intelligence-vs-linkedin-sales-navigator-choose.png",
      alt: "How to choose or combine LinkedIn Sales Navigator and sales intelligence: primary job, channel, export need, dial or sequence, stack shape, admin capacity.",
      caption:
        "Same prospecting goal — different layers. Name the output you need before arguing seats.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Social graph vs verified contact database",
    src: "/guides/sales-intelligence-vs-linkedin-sales-navigator-hero.png",
    alt: "LinkedIn Sales Navigator social-graph prospecting on one side and a sales intelligence verified contact database with email, phone, dialer, and sequences on the other, both feeding CRM.",
    caption: "Same ICP — different outputs and channels.",
  },
  {
    type: "step",
    id: "outputs",
    stepNumber: 1,
    heading: "Compare the outputs you actually need",
    body: "Sales Navigator helps you find people and accounts on LinkedIn, track changes, and message via InMail or connection paths. Sales intelligence tools (catalogue examples include Apollo.io, RocketReach, BookYourData) emphasize searchable contact records, verification, enrichment, CRM push, and often dialer or sequence add-ons.\n\nExample: a three-person SDR pod selling to VP Revenue at 200–1,000-employee SaaS companies uses Sales Nav to map buying committees and warm paths, then unlocks work emails and mobiles in an SI tool before sequencing. When they tried to run volume outbound from InMail alone, reply handling and CRM logging collapsed. When they tried SI without LinkedIn research, account context thinned. Both jobs were real — different tools.",
    tip: "Write the required output in one line: “verified work email + CRM push” vs “LinkedIn path + InMail” — then shortlist.",
    figure: {
      src: "/guides/sales-intelligence-vs-linkedin-sales-navigator-outputs.png",
      alt: "Side-by-side outputs: Sales Navigator social graph and InMail versus sales intelligence verified emails, phones, CRM sync, dialer, and sequences.",
      caption: "Judge tools by the artifact they produce for your weekly ritual.",
    },
    scenarios: [
      {
        title: "Sales Navigator side",
        body: "Social graph search, lead/account lists, alerts, InMail, relationship insights.",
      },
      {
        title: "Sales intelligence side",
        body: "Verified emails/phones, enrichment, CRM sync, credits, dialer/sequences.",
      },
      {
        title: "Shared CRM truth",
        body: "Neither replaces owners and stages — both should respect write rules.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "stack-shapes",
    title: "Stack shapes (educational, not rankings)",
    types: [
      {
        id: "nav-only",
        title: "Sales Navigator only",
        bestFor:
          "Relationship-led selling where LinkedIn is the primary channel and email/phone volume is low.",
        avoidWhen:
          "You need bulk verified emails, dialers, or multichannel sequences outside LinkedIn.",
      },
      {
        id: "si-only",
        title: "Sales intelligence only",
        bestFor:
          "Email/phone-led outbound with CRM sync, where LinkedIn research is secondary or manual.",
        avoidWhen:
          "Warm paths and InMail are core to how you open deals.",
      },
      {
        id: "both",
        title: "Sales Nav + SI",
        bestFor:
          "Teams that research on LinkedIn and execute verified multichannel outreach — with clear job owners.",
        avoidWhen:
          "No one owns credits, seats, suppression, or CRM write rules across tools.",
      },
      {
        id: "si-plus-engagement",
        title: "SI + engagement (Sales Nav optional)",
        bestFor:
          "Pods whose bottleneck is list quality plus cadence execution; LinkedIn is a research add-on.",
        avoidWhen:
          "You assume Sales Nav alone replaces a verified contact database.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Job matrix: Sales Nav vs sales intelligence",
    rows: [
      {
        feature: "LinkedIn social-graph search & alerts",
        mustHave: true,
        niceToHave: false,
        notes: "Sales Navigator strength",
      },
      {
        feature: "Verified work email / direct dial export",
        mustHave: true,
        niceToHave: false,
        notes: "Sales intelligence job",
      },
      {
        feature: "InMail / LinkedIn messaging",
        mustHave: true,
        niceToHave: false,
        notes: "Sales Navigator channel",
      },
      {
        feature: "Email sequences, dialer, deliverability tooling",
        mustHave: true,
        niceToHave: false,
        notes: "SI / engagement stack",
      },
      {
        feature: "CRM sync with field mapping",
        mustHave: false,
        niceToHave: true,
        notes: "Stronger / clearer in many SI tools",
      },
      {
        feature: "Replacing SI with Sales Nav for email lists",
        mustHave: false,
        niceToHave: true,
        notes: "Common mismatch",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-team",
    title: "Fit by team shape",
    tiers: [
      {
        id: "founder-led",
        label: "Founder-led",
        description:
          "Sales Nav can open doors; add SI when you need repeatable verified email/phone lists.",
        fitHints: ["Path selling", "Light credits"],
      },
      {
        id: "sdr-pod",
        label: "SDR pod",
        description:
          "Often both: Nav for accounts, SI for contact capture — only with a Monday ritual that uses both.",
        fitHints: ["Account maps", "Verified unlocks"],
      },
      {
        id: "phone-led",
        label: "Phone-led team",
        description:
          "SI + dialer dominate; Sales Nav is research, not the connect engine.",
        fitHints: ["Direct dials", "CRM logging"],
      },
      {
        id: "enterprise",
        label: "Enterprise ABM",
        description:
          "Sales Nav for buying-committee mapping; SI for coverage and sync at volume.",
        fitHints: ["Committee maps", "Governance"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common boundary mistakes",
    items: [
      {
        title: "Expecting Sales Nav to replace a contact database",
        body: "Social-graph presence is not the same as verified email/phone coverage on your ICP.",
      },
      {
        title: "Running volume email from InMail habits",
        body: "LinkedIn messaging limits and CRM logging differ from mailbox sequences and deliverability controls.",
      },
      {
        title: "Buying SI and never using LinkedIn context",
        body: "Verified contacts without account research can produce cold, low-relevance outreach.",
      },
      {
        title: "Double-paying without job owners",
        body: "Two prospecting seats with no ritual still produce empty Mondays.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is LinkedIn Sales Navigator sales intelligence software?",
        answer:
          "It is a prospecting product focused on LinkedIn’s social graph and InMail. Broader sales intelligence usually means verified contact databases, enrichment, CRM sync, and often dialer or sequence capabilities. Overlap exists in “finding people,” but outputs and channels differ.",
      },
      {
        question: "Can Sales Navigator replace Apollo or similar tools?",
        answer:
          "Only if LinkedIn is your primary channel and you do not need bulk verified emails, phones, dialers, or multichannel sequences. Catalogue products such as Apollo.io are examples of SI-shaped tools — not ranked alternatives on this page.",
      },
      {
        question: "Do we need both Sales Nav and a sales intelligence tool?",
        answer:
          "When both jobs are real: social-graph research plus verified multichannel execution. If only one job blocks pipeline, buy that job first.",
      },
      {
        question: "Where do sequences and dialers fit?",
        answer:
          "Outside Sales Navigator’s core. They sit in sales engagement / SI platforms — see Sales Intelligence vs Sales Engagement.",
      },
      {
        question: "What should I read next?",
        answer:
          "How to Choose Sales Intelligence, then Requirements and Evaluation — or the Best Sales Intelligence Software shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Job-first selection framework.",
      },
      {
        href: "/guides/sales-intelligence-vs-sales-engagement/",
        label: "SI vs sales engagement",
        description: "Data layer vs sequencing layer.",
      },
      {
        href: "/guides/sales-intelligence-requirements-guide/",
        label: "SI requirements guide",
        description: "Freeze must-haves before you shop.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/use-cases/prospecting/",
        label: "Prospecting use case",
        description: "Where contact discovery fits.",
      },
      {
        href: "/software/rocketreach/",
        label: "RocketReach (catalogue example)",
        description: "Contact database example — not a ranking.",
      },
      {
        href: "/software/apollo/",
        label: "Apollo.io (catalogue example)",
        description: "Combined SI example — not a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Shortlist verified-contact tools",
    body: "If your primary job is verified emails, phones, CRM sync, dialer, or sequences — not InMail alone — use How to Choose Sales Intelligence and the Best Sales Intelligence page.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const salesIntelligenceVsLinkedinSalesNavigatorGuide: GuidePage = {
  id: "guide-sales-intelligence-vs-linkedin-sales-navigator",
  slug: "sales-intelligence-vs-linkedin-sales-navigator",
  title:
    "Sales Intelligence vs LinkedIn Sales Navigator: Social Graph vs Contact Data",
  summary:
    "See how LinkedIn Sales Navigator (social graph / InMail) differs from sales intelligence platforms (verified contact databases, CRM sync, dialer, sequences) — and when to use one or both.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-vs-linkedin-sales-navigator-hero.png",
    alt: "LinkedIn Sales Navigator social-graph prospecting versus a sales intelligence verified contact database with email, phone, dialer, and sequences.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:use-case:prospecting",
      relationType: "answers-question-for",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-vs-sales-engagement",
    "sales-intelligence-requirements-guide",
    "sales-intelligence-evaluation-guide",
  ],
  blocks: salesIntelligenceVsLinkedinSalesNavigatorBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary output",
      description: "Social path/InMail vs verified email/phone.",
      order: 0,
    },
    {
      id: "channel",
      label: "Confirm channels you will run",
      description: "LinkedIn-only vs email/phone/sequences.",
      order: 1,
    },
    {
      id: "stack",
      label: "Pick stack shape",
      description: "Nav-only, SI-only, or both with owners.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Sales Intelligence vs LinkedIn Sales Navigator | SoftwareGlimpse",
    description:
      "LinkedIn Sales Navigator is a social-graph layer; sales intelligence is a verified contact / dialer / sequence layer. Learn when you need one or both.",
    canonicalPath: "/guides/sales-intelligence-vs-linkedin-sales-navigator/",
    indexable: true,
  },
};
