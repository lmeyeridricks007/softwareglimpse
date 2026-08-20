import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Go-Live Guide — freeze, cutover, rollback, hypercare.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented prices, rankings, or metrics.
 */
const crmGoLiveBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM go-live is a controlled cutover: freeze legacy edits, run the final import, validate owners and stages, open the new CRM, then run a hypercare week with named support. Decision rule: do not cut over until UAT exit criteria pass and you have written rollback criteria — if owners, stages, or sync fail validation in the cutover window, stop and roll back rather than “push through” and hope hypercare fixes trust.",
    bullets: [
      "UAT passed",
      "Freeze window",
      "Cutover checklist",
      "Validate",
      "Rollback ready",
      "Hypercare week",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Freeze is non-negotiable",
        body: "Edits in two systems during cutover guarantee conflict.",
      },
      {
        label: "Cutover is a checklist, not a vibe",
        body: "Ordered steps with owners beat a weekend dump.",
      },
      {
        label: "Rollback criteria before you need them",
        body: "Decide the fail triggers while everyone is calm.",
      },
      {
        label: "Hypercare is staffing, not a slogan",
        body: "Named hours and escalation paths keep week one usable.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "golive-path",
    title: "Go-live path",
    steps: [
      { id: "ready", label: "Ready", short: "UAT exit met" },
      { id: "freeze", label: "Freeze", short: "Legacy edits stop" },
      { id: "cutover", label: "Cutover", short: "Export→import→check" },
      { id: "open", label: "Open", short: "CRM is system of record" },
      { id: "hypercare", label: "Hypercare", short: "Staffed week" },
    ],
    ctaHref: "/guides/crm-training/",
    ctaLabel: "Training guide →",
    figure: {
      src: "/guides/crm-go-live-path.png",
      alt: "CRM go-live path: ready gate, freeze, cutover, open as system of record, hypercare week.",
      caption:
        "Ready gates before the calendar date — freeze, cutover, open, then staffed hypercare.",
    },
  },
  {
    type: "figure",
    id: "cutover-visual",
    title: "Cutover sequence",
    src: "/guides/crm-go-live-cutover.png",
    alt: "CRM go-live cutover sequence: freeze, final export, import, validate owners and stages, open CRM, hypercare week, with rollback criteria.",
    caption:
      "Six controlled stages — with rollback triggers — keep launch from becoming an irreversible dump.",
  },
  {
    type: "checklist",
    id: "cutover-checklist",
    title: "Cutover checklist",
    copyable: true,
    items: [
      {
        id: "uat",
        label: "UAT exit criteria signed",
        description: "P0 scripts green; no open blockers.",
        order: 0,
      },
      {
        id: "comms",
        label: "Communication plan sent",
        description: "Freeze time, new login URL, who to ping.",
        order: 1,
      },
      {
        id: "freeze",
        label: "Freeze window started",
        description: "Legacy CRM/sheets read-only or offline for edits.",
        order: 2,
      },
      {
        id: "export",
        label: "Final export captured",
        description: "Versioned files; mapping sheet version recorded.",
        order: 3,
      },
      {
        id: "import",
        label: "Import completed",
        description: "Counts checked against export; quarantine reviewed.",
        order: 4,
      },
      {
        id: "validate",
        label: "Owners, stages, sync spot-checked",
        description: "Seller + manager sample of open deals.",
        order: 5,
      },
      {
        id: "open",
        label: "New CRM declared system of record",
        description: "Legacy edit path closed; bookmarks updated.",
        order: 6,
      },
      {
        id: "hypercare",
        label: "Hypercare roster live",
        description: "Hours, channel, escalation owner for the week.",
        order: 7,
      },
    ],
  },
  {
    type: "step",
    id: "ready-gate",
    stepNumber: 1,
    heading: "Confirm readiness before you announce a date",
    body: "Go-live is allowed only when UAT exit criteria pass, the field map version is frozen, pilot data (if any) is trusted, training for week-one roles is scheduled or complete, and rollback criteria are written. A calendar date without those gates is a rumor.\n\nExample: Crestline Commerce (B2B e-commerce sales, 14 sellers) sets go-live for a Tuesday only after Devon’s UAT sign-off and Mara’s mapping version NLB-MAP-v3 (adapted for Crestline’s export) are in the shared folder. The VP had wanted “this Friday”; the project lead refused until P0 sync scripts passed.",
    tip: "Moving the date is cheaper than a cutover that teaches the team not to trust the CRM.",
    figure: {
      src: "/guides/crm-go-live-hero.png",
      alt: "CRM go-live hero: cutover command center with freeze-to-hypercare timeline, checklist, and rollback criteria.",
      caption:
        "Command-center view of freeze, cutover, validation, and hypercare — not a silent weekend import.",
    },
    scenarios: [
      {
        title: "Green ready",
        body: "UAT + map + training + rollback doc complete.",
      },
      {
        title: "Amber",
        body: "One deferred P2 with owner; P0 still green.",
      },
      {
        title: "Red — delay",
        body: "Open P0 on sync or owners; do not freeze yet.",
      },
    ],
  },
  {
    type: "step",
    id: "freeze-and-comms",
    stepNumber: 2,
    heading: "Run the freeze window and communication plan",
    body: "Publish who stops editing where, when the freeze starts/ends, how to handle urgent deals during freeze (usually note offline, enter after open), and where to log in after cutover. Message sellers, managers, and adjacent teams (CS, finance) that still touch accounts.\n\nExample: Crestline sends a Monday note: freeze starts Tuesday 08:00, legacy CRM becomes read-only, urgent orders go to a Slack thread owned by ops, new CRM opens after validation ping. Managers confirm every AE acknowledged the note before freeze.",
    tip: "If people keep editing legacy during freeze, stop cutover — do not race two sources of truth.",
    figure: {
      src: "/guides/crm-go-live-freeze.png",
      alt: "CRM freeze window and communication plan: publish who/when, legacy read-only, urgent path, new login, AE acknowledgements.",
      caption:
        "Freeze without acknowledgements is theater — stop cutover if legacy edits continue.",
    },
    scenarios: [
      {
        title: "Seller comms",
        body: "Freeze time, login link, hypercare channel.",
      },
      {
        title: "Manager comms",
        body: "How Friday review runs from the new board.",
      },
      {
        title: "Exec comms",
        body: "Success = trusted board, not “system is live.”",
      },
    ],
  },
  {
    type: "step",
    id: "cutover-validate",
    stepNumber: 3,
    heading: "Execute cutover, validate, apply rollback criteria",
    body: "Ordered runbook: final export → import with frozen map → reconcile counts → spot-check owners/stages/next steps on a sample of open deals → prove sync on one production seat → open CRM or roll back. Rollback criteria examples: >X% owner mismatch on sample, stage map wrong on open pipeline, sync broken for pilot users, import quarantine larger than agreed threshold.\n\nExample: Crestline imports, finds three deals with blank owners in the sample of twenty. That trips their written rule (“any blank owners on open sample = pause”). They fix the owner lookup, re-import the quarantine set, re-validate, then declare open. They do not “fix in hypercare.”",
    tip: "Write numeric or binary rollback triggers before cutover day — arguments mid-incident are how bad launches happen.",
    figure: {
      src: "/guides/crm-go-live-validate.png",
      alt: "CRM cutover validate and rollback: final export, import on frozen map, reconcile counts, sample owners/stages, open or roll back.",
      caption:
        "Written rollback triggers before cutover day — do not negotiate them mid-incident.",
    },
    scenarios: [
      {
        title: "Pass validation",
        body: "Sample clean; declare system of record.",
      },
      {
        title: "Partial rollback",
        body: "Re-import failed object only; keep freeze.",
      },
      {
        title: "Full rollback",
        body: "Restore legacy edit path; schedule new window.",
      },
    ],
  },
  {
    type: "step",
    id: "hypercare-week",
    stepNumber: 4,
    heading: "Staff hypercare week and protect the core loop",
    body: "Hypercare is a staffed support window (often five to ten business days): named channel, response expectations, daily triage of duplicates/permissions/sync, and a ban on new automations until the board is trusted. End hypercare when open P0 issues are empty and managers run one review from CRM without a side sheet.\n\nExample: Crestline runs a #crm-hypercare channel with Mara (ops) and Devon (UAT lead) covering business hours. Day two: duplicate merge queue. Day four: one AE mailbox reconnect. They refuse a marketing automation install until Friday’s pipeline meeting runs clean from the board.",
    tip: "Hypercare without named humans is just a calendar label.",
    figure: {
      src: "/guides/crm-go-live-hypercare.png",
      alt: "CRM hypercare week: named staff, daily triage, ban new automation, coach from board, exit on a clean Friday review.",
      caption:
        "Staffed channel and a ban on new automations until the board is trusted.",
    },
    scenarios: [
      {
        title: "Daily triage",
        body: "Duplicates, access, sync, missing next steps.",
      },
      {
        title: "Coach from board",
        body: "Managers model reviews in CRM, not Slack rebuilds.",
      },
      {
        title: "Exit hypercare",
        body: "No open P0; one clean weekly review; then light automation.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Go-live mistakes",
    items: [
      {
        title: "Big-bang with no freeze",
        body: "Two systems stay editable and nobody knows which is true.",
      },
      {
        title: "Skipping UAT because “we’re out of time”",
        body: "You trade a delay for a credibility crater.",
      },
      {
        title: "No written rollback criteria",
        body: "Teams argue while sellers wait for a working board.",
      },
      {
        title: "Silent cutover with no communication plan",
        body: "People keep working in legacy and poison the import.",
      },
      {
        title: "Unstaffed “hypercare”",
        body: "Issues pile in email; adoption dies in week one.",
      },
      {
        title: "Adding automations on day one",
        body: "Noise on shaky data trains everyone to ignore the CRM.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is a CRM freeze window?",
        answer:
          "A defined period when legacy CRM or sheets become read-only (or offline for edits) so the final export and import are not racing new changes. Urgent work is parked and entered after the new CRM opens.",
      },
      {
        question: "What belongs on a cutover checklist?",
        answer:
          "UAT sign-off, communications, freeze start, final export, import, count reconcile, owner/stage/sync validation, declare system of record, and hypercare roster live.",
      },
      {
        question: "What are sensible rollback criteria?",
        answer:
          "Binary triggers such as blank owners on the open-deal sample, wrong stage mapping on active pipeline, broken email sync for go-live seats, or quarantine volume above the pre-agreed threshold. If triggered, pause or roll back — do not “hope through.”",
      },
      {
        question: "How long should hypercare last?",
        answer:
          "Long enough to clear P0 issues and complete at least one trusted weekly review — often about a week for a focused sales team. End on evidence, not on the calendar alone.",
      },
      {
        question: "Should we go live on a Friday?",
        answer:
          "Prefer a day when support staff are available the next morning. Friday launches often strand sellers over a weekend with no hypercare coverage.",
      },
      {
        question: "What if some teams are not ready?",
        answer:
          "Cut over the ready segment only (pilot-style) and keep others on legacy until their UAT and training gates pass. Partial honesty beats firm-wide fiction.",
      },
      {
        question: "What should I do next?",
        answer:
          "Finish role-based training if not done, run hypercare discipline, then follow the CRM Adoption Guide so the board stays trusted after the launch spike fades.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/guides/crm-testing/",
        label: "CRM testing guide",
        description: "UAT exit criteria before freeze.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training guide",
        description: "Role practice before and during launch.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Import and pilot path into cutover.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "Frozen map version for final import.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "After hypercare, keep usage honest.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "Comms and behavior around launch.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Outcomes that define go-live success.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing the CRM?",
    body: "If cutover planning is blocked on product clarity, CRM Finder constrains the shortlist before you schedule a freeze window.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmGoLiveGuide: GuidePage = {
  id: "guide-crm-go-live",
  slug: "crm-go-live",
  title: "CRM Go-Live Guide: Freeze, Cutover, Hypercare",
  summary:
    "Run a controlled CRM go-live — freeze window, cutover checklist, rollback criteria, communication plan, and staffed hypercare week.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-go-live-hero.png",
    alt: "CRM go-live hero: cutover command center with freeze-to-hypercare timeline, checklist, and rollback criteria.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-requirements-builder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-testing",
    "crm-training",
    "crm-data-migration",
    "crm-field-mapping",
    "crm-adoption",
    "crm-change-management",
  ],
  blocks: crmGoLiveBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "gates-green",
      label: "Confirm UAT + map + rollback doc",
      description: "No open P0 before announcing freeze.",
      order: 0,
    },
    {
      id: "run-cutover",
      label: "Execute freeze → import → validate",
      description: "Apply rollback criteria if sample fails.",
      order: 1,
    },
    {
      id: "hypercare",
      label: "Staff hypercare and exit on evidence",
      description: "One clean weekly review from the board.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T12:00:00.000Z",
    publishedAt: "2026-08-14T12:00:00.000Z",
    reviewedAt: "2026-08-14T12:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Go-Live Guide: Cutover & Hypercare | SoftwareGlimpse",
    description:
      "CRM go-live playbook: freeze window, cutover checklist, rollback criteria, communication plan, and staffed hypercare week.",
    canonicalPath: "/guides/crm-go-live/",
    indexable: true,
  },
};
