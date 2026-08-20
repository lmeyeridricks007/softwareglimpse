import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM RFP Guide — write a vendor brief that shortlists honestly.
 * Template: softwareglimpse-guide-template-v1
 */
const crmRfpGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A CRM RFP (or lighter vendor brief) is a written request that restates outcomes, must-haves, constraints, evaluation criteria, and how vendors must reply — so finalists answer the same questions. Decision rule: do not send an RFP until your requirements sheet is demo-ready; if you cannot score answers against pass/fail checks, keep writing the brief.",
    bullets: [
      "Outcomes first",
      "Must + constraints",
      "Criteria weights",
      "Response format",
      "Same ask to all",
      "No wishlist novel",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Brief ≠ feature dump",
        body: "Long wishlists invite yes-to-everything replies; outcomes and constraints force honesty.",
      },
      {
        label: "Same packet to every finalist",
        body: "Comparable answers beat sequential sales decks.",
      },
      {
        label: "Pass/fail beats adjectives",
        body: "Every must-have needs a check you can verify in demo or trial.",
      },
      {
        label: "SMB can stay light",
        body: "A 2–4 page vendor brief is enough when procurement is informal — structure still matters.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "rfp-path",
    title: "RFP / vendor-brief path",
    steps: [
      { id: "freeze-sheet", label: "Freeze sheet", short: "Requirements ready" },
      { id: "scope", label: "Scope", short: "Who / when / why" },
      { id: "criteria", label: "Criteria", short: "Weights stated" },
      { id: "packet", label: "Packet", short: "Same ask" },
      { id: "score", label: "Score", short: "Written replies" },
    ],
    ctaHref: "/guides/crm-requirements-guide/",
    ctaLabel: "Requirements guide →",
  },
  {
    type: "figure",
    id: "brief-structure",
    title: "Vendor brief structure",
    src: "/guides/crm-rfp-guide-structure.png",
    alt: "One-page CRM vendor brief outline: company context, 90-day outcomes, must-haves with pass/fail, constraints, evaluation criteria, response format, timeline.",
    caption:
      "Keep the brief thin enough that vendors reply in kind — structure enables comparison.",
  },
  {
    type: "step",
    id: "build-brief",
    stepNumber: 1,
    heading: "Build the brief from the requirements sheet",
    body: "Copy 90-day outcomes, must vs nice, integrations, admin capacity, and budget posture into a single packet. Add company context (team size, sales motion) and a short “out of scope” list so vendors stop pitching year-three platform dreams.\n\nExample: a 12-person B2B advisory firm (four sellers, founder, ops, delivery) freezes three outcomes — owner SLA on inbound, Friday pipeline with next step, clean delivery handoff — then writes a 3-page brief. Nice-to-haves (AI email drafts, marketplace apps) sit in an appendix labeled “not scored for shortlist.”",
    tip: "If a stakeholder wants to add ten “musts,” force a trade: one new must replaces one existing must.",
    figure: {
      src: "/guides/crm-rfp-guide-hero.png",
      alt: "CRM RFP hero: requirements flowing into a vendor brief.",
      caption:
        "The RFP inherits the sheet — it does not invent a second wishlist.",
    },
    scenarios: [
      {
        title: "Outcomes",
        body: "Three observable 90-day results vendors must map to.",
      },
      {
        title: "Must-haves",
        body: "Pass/fail checks (e.g. non-admin creates deal + next step).",
      },
      {
        title: "Constraints",
        body: "Email/calendar you already use, admin hours, compliance baseline.",
      },
    ],
  },
  {
    type: "step",
    id: "response-and-score",
    stepNumber: 2,
    heading: "Define response format and how you will score",
    body: "Tell vendors exactly which sections to answer: must-have mapping (plan/tier language without inventing list prices), integrations, implementation owner, export/exit, support channels, security docs location, and commercial term basics. State that demos follow only after written replies, and that scores use your evaluation weights.\n\nExample: the advisory firm sends the same brief to three finalists from CRM Finder, with a five-business-day reply window. One reply maps every must-have to a named plan; another answers with marketing adjectives only and is scored zero on clarity before any demo.",
    tip: "Ban “see our website” as a complete answer to a must-have. Require plan/feature mapping in the reply.",
    scenarios: [
      {
        title: "Formal procurement",
        body: "Heavier RFP + legal review — still keep musts short.",
      },
      {
        title: "SMB vendor brief",
        body: "Email packet + shared doc is fine if structure matches.",
      },
      {
        title: "No RFP needed",
        body: "Solo buyer with one trial — skip formal RFP; keep a one-page decision memo instead.",
      },
    ],
  },
  {
    type: "step",
    id: "when-to-rfp",
    stepNumber: 3,
    heading: "Decide when a formal RFP is worth it",
    body: "Use a full RFP when multiple stakeholders, security review, or procurement rules require comparable written bids. Prefer a short vendor brief when the team is small and speed matters — but never skip the requirements sheet.\n\nExample: the same firm skips a 40-page RFP template and uses the 3-page brief + scorecard; finance still gets commercial clarity questions attached before signature.",
    tip: "An RFP cannot fix unclear requirements. Fix the sheet first via the Requirements Builder.",
    scenarios: [
      {
        title: "Use RFP",
        body: "Procurement, multi-approver, or regulated baseline.",
      },
      {
        title: "Use brief",
        body: "Small team, 2–3 finalists, written answers still required.",
      },
      {
        title: "Skip both",
        body: "Only when one owner trials with a frozen sheet and memo.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "RFP mistakes",
    items: [
      {
        title: "Sending a feature encyclopedia",
        body: "Vendors will claim support for everything; you cannot score it.",
      },
      {
        title: "Different asks per vendor",
        body: "Breaks fairness before demos start.",
      },
      {
        title: "Scoring demos before written replies",
        body: "Theater replaces comparable answers.",
      },
      {
        title: "Omitting exit and plan gates",
        body: "Those belong in the brief — not as post-signature surprises.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Do small teams need a formal CRM RFP?",
        answer:
          "Not always. A short vendor brief with the same sections is enough for most SMB buys. Decision rule: if you need comparable written answers across finalists, use a brief; if procurement requires formal bids, expand into an RFP without lengthening the must-have list.",
      },
      {
        question: "What should a CRM RFP include?",
        answer:
          "Context, 90-day outcomes, must-haves with pass/fail checks, constraints, evaluation criteria/weights, response format, timeline, and commercial/security questions — not a marketplace feature dump.",
      },
      {
        question: "How many vendors should receive the RFP?",
        answer:
          "Usually two or three finalists after a constrained shortlist. More packets slow scoring without improving fit.",
      },
      {
        question: "Should pricing be in the RFP?",
        answer:
          "Ask for plan mapping and commercial clarity for your must-haves; estimate bands in the Cost Calculator — do not invent list prices in the brief.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze the requirements sheet, generate or paste a brief, shortlist with CRM Finder, then run demos from the Demo Guide.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Sheet the RFP inherits.",
      },
      {
        href: "/guides/crm-vendor-questions/",
        label: "CRM vendor questions",
        description: "Question bank to attach.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence beyond replies.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Buyer-led sessions after replies.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Weights that score replies.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Build the must/nice sheet.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Constrained shortlist.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score replies against weighted criteria.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Estimate bands before commercial asks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Shortlist before you send packets",
    body: "Use CRM Finder to narrow researched options, then send the same vendor brief to finalists — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmRfpGuide: GuidePage = {
  id: "guide-crm-rfp-guide",
  slug: "crm-rfp-guide",
  title: "CRM RFP Guide: Write a Vendor Brief That Shortlists Honestly",
  summary:
    "Turn CRM requirements into a short RFP or vendor brief — scope, must-haves, constraints, evaluation criteria, and response format — without a feature wishlist novel.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-rfp-guide-hero.png",
    alt: "CRM RFP hero: requirements sheet flowing into a short vendor brief with response sections.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-requirements-guide",
    "crm-vendor-questions",
    "crm-vendor-evaluation",
    "crm-demo-guide",
    "crm-evaluation-guide",
    "crm-selection-process",
    "how-to-choose-crm",
  ],
  blocks: crmRfpGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes",
      label: "Paste 90-day outcomes into the brief",
      description: "From requirements sheet — not feature names.",
      order: 0,
    },
    {
      id: "must-pass",
      label: "List must-haves with pass/fail checks",
      description: "Vendors answer the same tests.",
      order: 1,
    },
    {
      id: "response-format",
      label: "Define response sections + deadline",
      description: "So replies are comparable.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM RFP Guide: Vendor Brief That Shortlists Honestly | SoftwareGlimpse",
    description:
      "Write a short CRM RFP or vendor brief from outcomes, must-haves, constraints, and evaluation criteria — ready for comparable responses.",
    canonicalPath: "/guides/crm-rfp-guide/",
    indexable: true,
  },
};
