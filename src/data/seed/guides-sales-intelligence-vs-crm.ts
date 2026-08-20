import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence vs CRM — data/outreach layer vs system of record.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceVsCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM is the system of record for who you sell to, deal stages, ownership, and activity history. Sales intelligence is the data and outreach layer that finds, verifies, and enriches contacts — then feeds that CRM (and often sequences or dialers). Decision rule: buy or fix CRM when handoffs and pipeline trust are broken; buy sales intelligence when the blocking job is accurate people-to-contact data for outbound. Most teams need both.",
    bullets: [
      "CRM = system of record",
      "SI = data / outreach layer",
      "Usually need both",
      "Job decides which first",
      "Sync rules matter",
      "Not a vendor ranking",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Different primary jobs",
        body: "CRM answers “what’s the status and who owns it?” SI answers “who should we contact, with working details?”",
      },
      {
        label: "SI does not replace pipeline",
        body: "Contact databases and sequencers may store people, but deals, stages, and handoff history still belong in CRM.",
      },
      {
        label: "Order depends on the break",
        body: "No CRM + shared deals → CRM first. Solid CRM + empty or stale contacts → SI first.",
      },
      {
        label: "Integration is the product glue",
        body: "Without duplicate matching and overwrite rules, SI imports make the CRM worse, not better.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "which-first",
    title: "CRM first, SI first, or both?",
    steps: [
      { id: "df-pain", label: "Name the pain", short: "Data vs ownership" },
      { id: "df-sor", label: "System of record?", short: "CRM exists?" },
      { id: "df-lists", label: "List quality?", short: "Find / verify gap" },
      { id: "df-order", label: "Pick order", short: "CRM, SI, or both" },
      { id: "df-sync", label: "Define sync", short: "Mapping & owners" },
      { id: "df-measure", label: "Measure", short: "Trust + usable rows" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/sales-intelligence-vs-crm-decision.png",
      alt: "Decision path: diagnose whether pain is ownership and pipeline (CRM) or contact data and verification (sales intelligence), then define sync.",
      caption:
        "Fix the broken job first. Running SI into a chaotic CRM only accelerates duplicate chaos.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Where sales intelligence stops and CRM starts",
    src: "/guides/sales-intelligence-vs-crm-boundary.png",
    alt: "Boundary diagram: sales intelligence for find, verify, enrich, and outreach on the left; CRM for contacts as owned records, deals, stages, and activity history on the right.",
    caption:
      "Same people can appear in both — only CRM should own live deal status and handoff history.",
  },
  {
    type: "step",
    id: "crm-job",
    stepNumber: 1,
    heading: "What CRM is for",
    body: "A sales CRM keeps contacts, companies, deals, owners, and activity history together so the team can run follow-ups, handoffs, and pipeline reviews without reconstructing context from inboxes.\n\nExample: at Quillfield Studio (6-person agency), two account managers both “owned” the same warm lead in a shared inbox — neither followed up. That is a CRM problem: shared ownership, stages, and next steps. Pouring a sales intelligence export into that mess would not have fixed the handoff.",
    tip: "If “where is this deal?” is a weekly Slack thread, you are missing CRM discipline — not another contact database.",
    scenarios: [
      {
        title: "Ownership",
        body: "One clear owner per lead, account, or deal.",
      },
      {
        title: "Pipeline",
        body: "Stages and next steps the team can review live.",
      },
      {
        title: "History",
        body: "Emails, calls, and notes attached to the record across handoffs.",
      },
    ],
  },
  {
    type: "step",
    id: "si-job",
    stepNumber: 2,
    heading: "What sales intelligence is for",
    body: "Sales intelligence finds and refreshes B2B contact and company data: search and filter an ICP, verify emails or dials, enrich fields, and push into CRM or sequences. Some tools add engagement or dialing — still as an execution layer on top of data, not as a full system of record.\n\nExample: Harbor Analytics’ three-person SDR pod has a working CRM board, but Mondays start with no fresh list. Their gap is SI — verified ICP contacts — not another pipeline tool. Catalogue examples (alphabetical): Amplemarket, Apollo, BookYourData, Closely, Kixie, Lusha, Reply, RocketReach. Pick by job and coverage, never by invented scores.",
    tip: "Write the blocking weekly outcome (“150 verified ICP contacts in CRM”) before you compare SI logos.",
    scenarios: [
      {
        title: "Find",
        body: "Net-new contacts and companies matching your ICP.",
      },
      {
        title: "Verify & enrich",
        body: "Working emails/dials and complete firmographic fields.",
      },
      {
        title: "Route to action",
        body: "Push into CRM views, sequences, or dialer workflows.",
      },
    ],
  },
  {
    type: "step",
    id: "when-both",
    stepNumber: 3,
    heading: "When teams need both (the usual case)",
    body: "Outbound teams almost always need a trustworthy CRM and a way to keep contact data fresh at volume. SI without CRM creates orphaned lists. CRM without SI forces reps back to manual research when the ICP list must grow every week.\n\nExample: after Quillfield adopts a simple CRM, Mira (RevOps) adds an enrichment-capable SI tool to backfill titles on 8,000 contacts and feed a weekly SDR list. Sync rules: email as key, never overwrite owner, title overwrite only when verified. Within a month, pipeline reviews and Monday lists both improve — because each tool does its own job.",
    tip: "Define “system of record” in one sentence on a wiki page. If SI and CRM disagree, that sentence decides which wins.",
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Sales intelligence vs CRM by job",
    rows: [
      {
        feature: "Find net-new ICP contacts",
        mustHave: true,
        niceToHave: false,
        notes: "SI primary",
      },
      {
        feature: "Verify emails / dials at volume",
        mustHave: true,
        niceToHave: false,
        notes: "SI primary",
      },
      {
        feature: "Enrich missing CRM fields",
        mustHave: true,
        niceToHave: false,
        notes: "SI → CRM",
      },
      {
        feature: "Shared deal ownership",
        mustHave: false,
        niceToHave: true,
        notes: "CRM must-have",
      },
      {
        feature: "Pipeline stages & forecasts",
        mustHave: false,
        niceToHave: true,
        notes: "CRM must-have",
      },
      {
        feature: "Activity history on handoffs",
        mustHave: false,
        niceToHave: true,
        notes: "CRM must-have",
      },
      {
        feature: "Multichannel sequences / dialer",
        mustHave: false,
        niceToHave: true,
        notes: "Often SI-adjacent",
      },
    ],
  },
  {
    type: "crm-types",
    id: "stack-patterns",
    title: "Common stack patterns (not rankings)",
    types: [
      {
        id: "crm-only",
        title: "CRM only (early)",
        bestFor:
          "Inbound-heavy or relationship-led teams with a short, known network and little cold outbound.",
        avoidWhen:
          "SDRs must produce net-new verified lists every week from a broad ICP.",
      },
      {
        id: "crm-plus-si-data",
        title: "CRM + data / enrichment SI",
        bestFor:
          "Teams with a CRM in place that need coverage, verification, and field backfill.",
        avoidWhen:
          "There is still no trusted owner or stage model — fix CRM process first.",
      },
      {
        id: "crm-plus-engagement",
        title: "CRM + engagement / dialer",
        bestFor:
          "Outbound pods whose contacts exist but need sequences or phone volume with CRM logging.",
        avoidWhen:
          "Contact quality is still the bottleneck — engagement amplifies bad data.",
      },
      {
        id: "si-without-crm",
        title: "SI without CRM (fragile)",
        bestFor:
          "Almost never as a steady state — only a short experiment for a solo operator.",
        avoidWhen:
          "Two or more people must share ownership, stages, or history — adopt CRM immediately.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common SI vs CRM mistakes",
    items: [
      {
        title: "Replacing CRM with a contact database",
        body: "You lose reliable stages, ownership, and handoff history the moment deals matter.",
      },
      {
        title: "Buying SI to fix CRM adoption",
        body: "If reps will not update owners and stages, richer contact data will not create pipeline discipline.",
      },
      {
        title: "Dual systems of record",
        body: "Editing the same people in SI and CRM without sync rules guarantees conflicting “truth.”",
      },
      {
        title: "Choosing tools from affiliate order or invented ROI",
        body: "Compare by job fit, coverage tests, and sync reality — not payouts or unverifiable dollar claims.",
      },
    ],
  },
  {
    type: "checklist",
    id: "boundary-checklist",
    title: "Boundary checklist: which layer is broken?",
    copyable: true,
    items: [
      {
        id: "chk-ownership",
        label: "Two people disagree on who owns a deal",
        description: "CRM / process problem — not an SI gap.",
        order: 0,
      },
      {
        id: "chk-stages",
        label: "Managers rebuild pipeline status from Slack or sheets",
        description: "CRM reporting and stage discipline problem.",
        order: 1,
      },
      {
        id: "chk-lists",
        label: "SDRs cannot start the week with verified ICP contacts",
        description: "Sales intelligence / data problem.",
        order: 2,
      },
      {
        id: "chk-bounces",
        label: "Sequences bounce or titles are obviously wrong",
        description: "Verification and enrichment problem (SI).",
        order: 3,
      },
      {
        id: "chk-sync",
        label: "Imports create duplicates or overwrite owners",
        description: "Integration rules problem between SI and CRM.",
        order: 4,
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the difference between sales intelligence and CRM?",
        answer:
          "CRM is the system of record for contacts, deals, ownership, and activity history. Sales intelligence finds, verifies, and enriches B2B contact and company data for outbound, then feeds the CRM (and often sequences or dialers). They solve different jobs; most outbound teams use both.",
      },
      {
        question: "Can sales intelligence replace my CRM?",
        answer:
          "Not safely once more than one person must share ownership, stages, and history. Some SI products include lightweight CRM-like contact stores, but pipeline truth should live in one place — see What is CRM and How to choose a CRM.",
      },
      {
        question: "Should I buy CRM or sales intelligence first?",
        answer:
          "Buy or fix CRM first when shared ownership and pipeline trust are broken. Buy SI first when the CRM already works but you cannot produce accurate ICP contacts at volume. Example: Quillfield Studio fixed handoffs in CRM before adding enrichment; Harbor Analytics already had CRM and needed SI for Monday lists.",
      },
      {
        question: "How should CRM and sales intelligence integrate?",
        answer:
          "Agree unique keys (usually email), duplicate matching, field mapping, and overwrite rules before bulk sync. CRM should win on owner and deal fields; SI may win on verified contact details when confidence is high.",
      },
      {
        question: "Where do sequencers and dialers fit?",
        answer:
          "They usually sit with the sales intelligence / engagement layer for execution, while logging activity back to CRM. Catalogue examples include Amplemarket, Closely, Kixie, and Reply for engagement or dialing shapes — evaluate by job, not as a ranked list.",
      },
      {
        question: "What should I read next?",
        answer:
          "What is sales intelligence and How sales intelligence works for the SI side; What is CRM and How to choose a CRM for the system of record; then How to choose sales intelligence, the sales intelligence category, and Best sales intelligence software when you shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related guides and catalogue pages",
    links: [
      {
        href: "/guides/what-is-sales-intelligence/",
        label: "What is sales intelligence?",
        description: "Category definition and shapes.",
      },
      {
        href: "/guides/how-sales-intelligence-works/",
        label: "How sales intelligence works",
        description: "Source → verify → CRM sync loop.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework by primary job.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "System of record fundamentals.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Framework before you scale data pushes.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the SI catalogue.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist and methodology.",
      },
      {
        href: "/categories/crm/",
        label: "CRM category",
        description: "Browse CRM products.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Keep imports trustworthy after enrichment.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "si-choose-cta",
    title: "Choosing the data layer?",
    body: "If CRM ownership is solid and contact quality is the gap, use the sales intelligence selection framework — primary job, coverage, credits, and sync.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "crm-choose-cta",
    title: "Choosing the system of record?",
    body: "If handoffs and pipeline trust are broken, start with How to choose a CRM before you scale SI imports.",
    href: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    variant: "generic",
  },
];

export const salesIntelligenceVsCrmGuide: GuidePage = {
  id: "guide-sales-intelligence-vs-crm",
  slug: "sales-intelligence-vs-crm",
  title: "Sales Intelligence vs CRM: What’s the Difference?",
  summary:
    "Clear boundary between sales intelligence (find, verify, enrich contacts) and CRM (system of record for ownership, pipeline, and history) — and when teams need both.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [
    "amplemarket",
    "apollo",
    "bookyourdata",
    "closely",
    "kixie",
    "lusha",
    "reply",
    "rocketreach",
  ],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-vs-crm-hero.png",
    alt: "Side-by-side teaching visual: sales intelligence data and outreach layer versus CRM system of record with deals, owners, and activity history.",
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
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:guide:how-to-choose-sales-intelligence",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-sales-intelligence",
    label: "How to choose sales intelligence",
  },
  relatedGuideSlugs: [
    "what-is-sales-intelligence",
    "how-sales-intelligence-works",
    "how-to-choose-sales-intelligence",
    "what-is-crm",
    "how-to-choose-crm",
    "crm-data-hygiene",
  ],
  blocks: salesIntelligenceVsCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "diagnose",
      label: "Diagnose the broken job",
      description: "Ownership/pipeline vs contact data quality.",
      order: 0,
    },
    {
      id: "order",
      label: "Choose CRM first, SI first, or both",
      description: "Based on which layer fails weekly.",
      order: 1,
    },
    {
      id: "sync",
      label: "Write sync rules before import",
      description: "Keys, duplicates, overwrite, owner of hygiene.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-16T16:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence vs CRM: What’s the Difference? | SoftwareGlimpse",
    description:
      "Sales intelligence vs CRM explained: SI finds and verifies B2B contacts; CRM is the system of record for ownership, pipeline, and history. Most teams need both.",
    canonicalPath: "/guides/sales-intelligence-vs-crm/",
    indexable: true,
  },
};
