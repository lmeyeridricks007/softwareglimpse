import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Compliance Basics — buyer checklist (NOT legal advice).
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational framing only.
 */
const salesIntelligenceComplianceBasicsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence compliance for buyers means treating GDPR, CCPA/CPRA, and CAN-SPAM as a checklist of questions you own with your privacy counsel — not as a vendor marketing badge. Decision rule: do not start prospecting in a regulated region until you have named a lawful basis / notice strategy with your own privacy owner, reviewed vendor sourcing and processing terms, and set suppression + unsubscribe controls you can prove. This guide is educational, not legal advice.",
    bullets: [
      "Not legal advice",
      "Buyer owns outreach",
      "Sourcing questions",
      "GDPR / CCPA framing",
      "CAN-SPAM controls",
      "Privacy owner looped",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Vendor ≠ your lawful basis",
        body: "They publish sourcing terms; your outreach purpose and notices are yours.",
      },
      {
        label: "Checklist, not a verdict",
        body: "Use frameworks to ask better questions — counsel applies them to your facts.",
      },
      {
        label: "Suppression is operational",
        body: "Unsubscribe, do-not-contact, and bounce handling must work in the tool you buy.",
      },
      {
        label: "Document before scale",
        body: "A one-pager with owners beats hoping the SDR pod “knows the rules.”",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "compliance-path",
    title: "Buyer compliance path",
    steps: [
      { id: "owner", label: "Owner", short: "Privacy contact" },
      { id: "scope", label: "Scope", short: "Regions & channels" },
      { id: "vendor", label: "Vendor", short: "Sourcing docs" },
      { id: "controls", label: "Controls", short: "Suppress / notice" },
      { id: "review", label: "Review", short: "Before scale" },
    ],
    ctaHref: "/guides/sales-intelligence-vendor-questions/",
    ctaLabel: "Vendor questions →",
    figure: {
      src: "/guides/sales-intelligence-compliance-basics-map.png",
      alt: "Buyer compliance path for sales intelligence: name privacy owner, scope regions and channels, review vendor sourcing, set suppress and notice controls, review before scale — with not-legal-advice banner.",
      caption:
        "Educational buyer path — your counsel applies GDPR/CCPA/CAN-SPAM to your facts.",
    },
  },
  {
    type: "figure",
    id: "framework-map",
    title: "Framework map (educational)",
    src: "/guides/sales-intelligence-compliance-basics-map.png",
    alt: "Three educational panels for GDPR, CCPA/CPRA, and CAN-SPAM as buyer question themes — not legal conclusions — feeding a shared SI outreach checklist.",
    caption:
      "Use each framework as question themes with counsel — never as a self-issued green light.",
  },
  {
    type: "step",
    id: "own-the-duty",
    stepNumber: 1,
    heading: "Separate vendor claims from your duty",
    body: "Vendors describe how they source and process data and may offer DPAs, trust centers, or regional hosting. That does not automatically authorize your cold email, LinkedIn, or dialing program. Name who in your company owns privacy review for outbound, which regions and channels are in scope this quarter, and where suppression lists live.\n\nExample: Crestview B2B pauses EU prospecting until privacy lead Ana reviews vendor processing terms and the SDR playbook’s notice language. US email continues only with verified unsubscribe and suppression sync into the sequencer.\n\nDisclaimer: this is educational framing for software buyers — not legal advice. Have qualified counsel interpret obligations for your facts.",
    tip: "If “compliance” only appears in a sales deck and not in your runbook, you are not ready to scale.",
    figure: {
      src: "/guides/sales-intelligence-compliance-basics-hero.png",
      alt: "Sales intelligence compliance basics hero: buyer checklist UI with GDPR, CCPA, and CAN-SPAM question themes plus a clear Not legal advice banner.",
      caption:
        "Buyer checklist and privacy owner — educational, not a legal opinion.",
    },
    scenarios: [
      {
        title: "EU / UK prospects",
        body: "Loop counsel early; treat vendor badges as docs to review, not clearance.",
      },
      {
        title: "US email outbound",
        body: "Operationalize CAN-SPAM-style identity, unsubscribe, and honor timing.",
      },
      {
        title: "Multi-channel",
        body: "Apply the same suppression truth across email, phone, and LinkedIn tools.",
      },
    ],
  },
  {
    type: "step",
    id: "checklist-themes",
    stepNumber: 2,
    heading: "Run GDPR / CCPA / CAN-SPAM as question themes",
    body: "GDPR-oriented buyer questions (with counsel): What is our purpose and lawful basis narrative for this outreach? Where do we document notices and data subject requests? How does the vendor support deletion/access workflows we owe?\n\nCCPA/CPRA-oriented questions: How do we honor do-not-sell / do-not-share and consumer requests that touch purchased lists? What disclosures does counsel want on our site and in emails?\n\nCAN-SPAM-oriented operational checks: Accurate from/subject practices, physical address where required, working unsubscribe, and timely honor of opt-outs in your sending tool.\n\nExample: Harborline’s counsel workshop produces a one-page outbound checklist. RevOps configures suppression sync before credits are spent on a new EU list.",
    tip: "Write answers as “ask counsel / confirmed / blocked” — never as DIY legal conclusions.",
    scenarios: [
      {
        title: "Blocked",
        body: "No privacy owner or no unsubscribe proof — do not scale.",
      },
      {
        title: "Confirmed",
        body: "Counsel signed the playbook; controls tested in trial.",
      },
      {
        title: "Ask counsel",
        body: "New region or channel — pause that slice only.",
      },
    ],
  },
  {
    type: "checklist",
    id: "buyer-checklist",
    title: "Copyable buyer compliance checklist (not legal advice)",
    copyable: true,
    items: [
      {
        id: "privacy-owner",
        label: "Named privacy / legal owner for outbound",
        description: "Contact + review cadence.",
        order: 0,
      },
      {
        id: "regions",
        label: "Regions and channels in scope this quarter",
        description: "Explicit include/exclude list.",
        order: 1,
      },
      {
        id: "sourcing",
        label: "Vendor sourcing & processing docs reviewed",
        description: "Trust center / DPA path located.",
        order: 2,
      },
      {
        id: "basis",
        label: "Lawful basis / notice strategy discussed with counsel",
        description: "Educational prompt — counsel decides.",
        order: 3,
      },
      {
        id: "suppress",
        label: "Suppression + unsubscribe path tested",
        description: "Works in the actual sending/dialing tool.",
        order: 4,
      },
      {
        id: "requests",
        label: "Data subject / consumer request routing defined",
        description: "Who acts when someone asks to be removed.",
        order: 5,
      },
      {
        id: "disclaimer",
        label: "Team knows this checklist is not legal advice",
        description: "Escalate edge cases to counsel.",
        order: 6,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Compliance mistakes (operational)",
    items: [
      {
        title: "Treating “GDPR compliant” badges as clearance",
        body: "Marketing language is not your counsel’s opinion.",
      },
      {
        title: "Buying data before suppression exists",
        body: "Credits spent on contacts you cannot legally or operationally email.",
      },
      {
        title: "Different opt-out lists per channel",
        body: "Email-unsubscribed contacts still get dialed from another tool.",
      },
      {
        title: "Skipping counsel for a new region",
        body: "Scaling EU/UK from a US-only playbook is a process failure.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is this legal advice?",
        answer:
          "No. This guide is educational buyer framing for sales intelligence software evaluation. It does not determine your obligations. Consult qualified privacy counsel for your jurisdiction, data types, and outreach methods.",
      },
      {
        question: "Does the vendor’s DPA make our cold outreach lawful?",
        answer:
          "Not automatically. A DPA addresses processing relationships; your purpose, notices, and channel rules still need internal and counsel review. Decision rule: vendor docs are inputs, not a green light.",
      },
      {
        question: "What should SDRs do day to day?",
        answer:
          "Follow the approved playbook: use suppression lists, honor opt-outs, avoid purchased lists marked out of scope, and escalate odd requests to the privacy owner — not invent policy in Slack.",
      },
      {
        question: "What should I do next?",
        answer:
          "Complete the checklist with counsel, add sourcing questions to Vendor Questions, and prove unsubscribe/suppression in Trial Evaluation before scaling credits.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Sourcing & security asks.",
      },
      {
        href: "/guides/sales-intelligence-data-quality/",
        label: "Data quality",
        description: "Suppression and bounce hygiene.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Compliance as a selection gate.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Test controls hands-on.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Put compliance on the selection gate",
    body: "Choose SI by primary job — then require sourcing docs and working suppression before you scale credits. Still not legal advice.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceComplianceBasicsGuide: GuidePage = {
  id: "guide-sales-intelligence-compliance-basics",
  slug: "sales-intelligence-compliance-basics",
  title: "Sales Intelligence Compliance Basics (Buyer Checklist)",
  summary:
    "Educational GDPR, CCPA/CPRA, and CAN-SPAM framing for sales intelligence buyers — a checklist with your privacy owner, not legal advice.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-compliance-basics-hero.png",
    alt: "Sales intelligence compliance basics hero: buyer checklist with GDPR, CCPA, and CAN-SPAM themes and a Not legal advice banner.",
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
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-vendor-questions",
    "sales-intelligence-data-quality",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-trial-evaluation",
  ],
  blocks: salesIntelligenceComplianceBasicsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "privacy-owner",
      label: "Name privacy owner for outbound",
      description: "Before spending credits at scale.",
      order: 0,
    },
    {
      id: "counsel-review",
      label: "Review playbook with counsel",
      description: "Educational checklist ≠ legal opinion.",
      order: 1,
    },
    {
      id: "suppress-test",
      label: "Test suppression + unsubscribe",
      description: "In the real sending tool.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Compliance Basics | SoftwareGlimpse",
    description:
      "Buyer checklist for SI outreach: GDPR/CCPA/CAN-SPAM question themes, sourcing review, suppression — educational, not legal advice.",
    canonicalPath: "/guides/sales-intelligence-compliance-basics/",
    indexable: true,
  },
};
