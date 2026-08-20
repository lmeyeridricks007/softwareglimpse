import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Features — capabilities that matter for FS evaluation.
 * Template: softwareglimpse-guide-template-v1
 */
const financialServicesCrmFeaturesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Financial-services CRM features matter when they support shared client accounts, multi-pipeline work, activity history, permissions, reporting, and the integrations your stack already uses. Decision rule: evaluate a capability only if it maps to a written must-have with a demo test — ignore feature-count marketing that does not change Harborline’s Friday review or Meridian’s stage honesty.",
    bullets: [
      "Contacts & accounts",
      "Pipelines & deals",
      "Automation",
      "Reporting",
      "Integrations",
      "Admin & permissions",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Objects before feature lists",
        body: "Accounts, contacts, deals, and activities are the model; features are ways to create and update them reliably.",
      },
      {
        label: "Multi-pipeline is often the FS differentiator",
        body: "Advisory boards and sales boards sharing one account beat two disconnected tools.",
      },
      {
        label: "Admin is a capability",
        body: "Roles, field access, and hygiene tooling decide whether FS teams trust the system.",
      },
      {
        label: "Automation waits on hygiene",
        body: "Workflows amplify whatever is in the record — clean owners and stages first.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "fs-capability-map",
    title: "FS CRM capability map",
    steps: [
      { id: "records", label: "Records", short: "Accounts & contacts" },
      { id: "pipelines", label: "Pipelines", short: "Deals & stages" },
      { id: "automation", label: "Automation", short: "Repeatable tasks" },
      { id: "reporting", label: "Reporting", short: "Weekly truth" },
      { id: "integrations", label: "Integrations", short: "Mail & stack" },
      { id: "admin", label: "Admin", short: "Roles & hygiene" },
    ],
    ctaHref: "/guides/financial-services-crm-requirements/",
    ctaLabel: "Back to requirements →",
  },
  {
    type: "figure",
    id: "features-map-visual",
    title: "Where FS CRM capabilities sit",
    src: "/guides/financial-services-crm-features-map.png",
    alt: "Educational map of financial-services CRM capabilities: contacts/accounts, pipelines, automation, reporting, integrations, and admin permissions.",
    caption:
      "Judge each capability by whether it strengthens the shared client loop — not by brochure length.",
  },
  {
    type: "step",
    id: "contacts-accounts",
    stepNumber: 1,
    heading: "Contacts, accounts, and relationship context",
    body: "FS teams need durable account/household structures with related contacts, roles, and a timeline of notes and meetings. Flat contact lists without account context recreate notebook silos.\n\nExample: Crestview Wealth’s Priya links spouse and adult child under Chen Family, tags roles, and keeps quarterly review notes on the account. When associate Devon covers, the relationship map and timeline are already there — no “who is who?” call to the client.",
    tip: "In demos, create one household with three related contacts and prove the timeline stays on the account after a handoff.",
    figure: {
      src: "/guides/financial-services-crm-features-hero.png",
      alt: "Financial-services CRM features hero: capability layers around a shared client account.",
      caption:
        "Relationship context is a capability — not a nice-to-have note field.",
    },
    scenarios: [
      {
        title: "Account hierarchy",
        body: "Households or firms group related people with clear roles.",
      },
      {
        title: "Timeline on the record",
        body: "Meetings and notes attach where coverage looks first.",
      },
      {
        title: "Duplicate control",
        body: "Merge/prevent rules protect trust when imports grow.",
      },
    ],
  },
  {
    type: "step",
    id: "pipelines",
    stepNumber: 2,
    heading: "Pipelines and stage design for FS work",
    body: "Multiple pipelines (or carefully separated stage models) let advisory/service work and new-business sales share accounts without forcing one fake funnel. Stages should encode checkpoints your firm already runs.\n\nExample: Meridian Specialty Finance uses New Business stages Discovery → Credit Review → Proposal → Docs → Funded. Harborline keeps a separate Advisory Reviews board for next-meeting cadence. Both boards hang off the same accounts.",
    tip: "Ask vendors to show two pipelines on one account in the same demo — not two disconnected product tours.",
    scenarios: [
      {
        title: "Separate boards",
        body: "Relationship work and opportunity work stay readable.",
      },
      {
        title: "Exit criteria",
        body: "Required fields or checklists mirror real approvals.",
      },
      {
        title: "Owner clarity",
        body: "Every open deal has an owner and dated next step.",
      },
    ],
  },
  {
    type: "step",
    id: "automation",
    stepNumber: 3,
    heading: "Automation that helps without creating noise",
    body: "Useful FS automation assigns owners, creates follow-up tasks on stage changes, and notifies managers when items go stale. Complex multi-branch workflows wait until stages and logging habits are trusted.\n\nExample: When Meridian moves a deal to Credit Review, automation assigns the credit liaison a task and notifies the sales manager. Harborline only automates “no next-review date” reminders after two weeks of manual hygiene prove the board is accurate.",
    tip: "Automate the two repetitive tasks you already do weekly — not a catalog of unused recipes.",
  },
  {
    type: "step",
    id: "reporting",
    stepNumber: 4,
    heading: "Reporting for pipeline and relationship health",
    body: "Day-one reporting should answer: what is open, what is stuck, who owns it, and what is overdue. Leadership snapshots come after sellers trust the board. Do not invent forecast accuracy claims in evaluation — ask how filters and exports work for your Friday review.\n\nExample: Harborline’s practice lead runs a saved view of accounts missing next-review dates and a second view of new-business deals idle more than 14 days. That replaces the weekly rebuild in Sheets.",
    tip: "Bring your Friday questions to the demo and build the view live — if you cannot, reporting is not ready.",
  },
  {
    type: "step",
    id: "integrations",
    stepNumber: 5,
    heading: "Integrations that feed the record",
    body: "Prioritize email and calendar sync you already use so activity lands on accounts and deals. Add core ops systems only when ownership of the integration is clear. Integration count is not a score.\n\nExample: Meridian’s must-have is Microsoft 365 sync that logs seller email to the deal. A “200+ integrations” marketplace page does not replace that pass/fail test.",
    tip: "Write the exact inbox/calendar workflow you need on the requirements sheet before demos.",
  },
  {
    type: "step",
    id: "admin-permissions",
    stepNumber: 6,
    heading: "Admin, permissions, and field discipline",
    body: "FS evaluation should include who can see which books, which fields are restricted, how permission changes are reviewed, and who owns ongoing hygiene. Soft operational language beats invented certification claims — map needs to your policy and verify vendor documentation.\n\nExample: Harborline’s ops admin Keisha demos a role where BD sees opportunity fields but not planner-only notes, then shows how she audits who changed a permission last month.",
    tip: "If the product cannot express your access matrix in a pilot, treat that as a must-have failure — not a training issue.",
  },
  {
    type: "feature-matrix",
    id: "fs-feature-priority",
    title: "FS capability priority (starter)",
    rows: [
      {
        feature: "Accounts + related contacts + timeline",
        mustHave: true,
        niceToHave: false,
        notes: "Relationship system of record",
      },
      {
        feature: "Multiple pipelines / stage models",
        mustHave: true,
        niceToHave: false,
        notes: "Advisory + sales together",
      },
      {
        feature: "Role/team permissions & field access",
        mustHave: true,
        niceToHave: false,
        notes: "Day-one governance",
      },
      {
        feature: "Email/calendar activity on records",
        mustHave: true,
        niceToHave: false,
        notes: "Handoffs depend on it",
      },
      {
        feature: "Saved pipeline / overdue views",
        mustHave: true,
        niceToHave: false,
        notes: "Friday review without sheets",
      },
      {
        feature: "Simple stage/task automation",
        mustHave: false,
        niceToHave: true,
        notes: "After hygiene holds",
      },
      {
        feature: "Advanced forecasting modules",
        mustHave: false,
        niceToHave: true,
        notes: "After board trust",
      },
      {
        feature: "AI writing / summary aids",
        mustHave: false,
        niceToHave: true,
        notes: "Do not drive selection",
      },
    ],
  },
  {
    type: "size-match",
    id: "fs-team-fit",
    title: "How capability depth scales with team shape",
    tiers: [
      {
        id: "small-advisory",
        label: "Small advisory practice",
        description:
          "Account/household context, one advisory board, light permissions, email sync.",
        fitHints: ["Named admin hours", "Coverage views"],
      },
      {
        id: "mixed-fs",
        label: "Advisory + BD together",
        description:
          "Shared accounts, two pipelines, clearer role boundaries, weekly dual-board review.",
        fitHints: ["Permission matrix", "Handoff fields"],
      },
      {
        id: "b2b-sales-pod",
        label: "B2B FS sales pod",
        description:
          "Checkpoint stages, manager visibility, activity discipline, simple automation later.",
        fitHints: ["Stage exit tests", "Stuck-deal views"],
      },
      {
        id: "multi-team",
        label: "Multi-team FS org",
        description:
          "Stronger admin ownership, access reviews, and integration governance before feature sprawl.",
        fitHints: ["Audit questions", "Named RevOps/ops owner"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Feature evaluation mistakes",
    items: [
      {
        title: "Scoring by feature count",
        body: "A longer grid rarely fixes unclear ownership, dishonest stages, or missing access controls.",
      },
      {
        title: "Assuming “industry CRM” means fit",
        body: "Category labels are not pass/fail tests — run your household and multi-pipeline scripts.",
      },
      {
        title: "Buying automation before hygiene",
        body: "Automating noisy stages creates more noise and erodes trust faster.",
      },
      {
        title: "Skipping admin in the demo",
        body: "If permissions and field rules are not shown, you have not evaluated an FS-critical capability.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Which CRM features matter most for financial services?",
        answer:
          "Accounts/contacts with relationship history, multi-pipeline or clear stage separation, permissions, activity logging, basic reporting, and email/calendar sync. Rank others only after those map to your must-haves.",
      },
      {
        question: "Do we need industry-specific CRM features?",
        answer:
          "Only when a written must-have cannot be modeled in a general CRM (for example, a household structure or permission pattern you cannot demo). Verify with scripts — do not assume from marketing labels.",
      },
      {
        question: "How should we evaluate reporting?",
        answer:
          "Bring the Friday questions you already ask and build saved views live. Prefer honest filters and exports over claims about forecast accuracy you cannot validate.",
      },
      {
        question: "When does automation become a must-have?",
        answer:
          "When the board is trusted and the same manual follow-up repeats weekly. Until then, keep automation as nice-to-have.",
      },
      {
        question: "What about security features?",
        answer:
          "Treat roles, field access, audit/export needs, and access-review ownership as evaluation criteria. Confirm with vendor documentation and your policy owners — do not invent certification claims in the guide or sheet.",
      },
      {
        question: "What should I do next?",
        answer:
          "Lock must-haves in FS CRM Requirements, review FS CRM Security for access questions, then shortlist with CRM Finder.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related financial services CRM resources",
    links: [
      {
        href: "/industries/financial-services/",
        label: "CRM for Financial Services",
        description: "Industry hub and capability priorities.",
      },
      {
        href: "/guides/financial-services-crm/",
        label: "How FS teams use CRM",
        description: "Operating model with worked examples.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Must vs nice with pass/fail tests.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Permissions and audit evaluation.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Configure capabilities in phases.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "Bring history into the new model.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM checklist",
        description: "Pack-wide gates.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Match capabilities to products",
    body: "Once FS must-have capabilities are clear, CRM Finder maps your answers to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmFeaturesGuide: GuidePage = {
  id: "guide-financial-services-crm-features",
  slug: "financial-services-crm-features",
  title: "Financial Services CRM Features: What Actually Matters",
  summary:
    "Map financial-services CRM capabilities — accounts, pipelines, automation, reporting, integrations, and admin — to must-have tests without invented rankings or certification claims.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/financial-services-crm-features-hero.png",
    alt: "Financial-services CRM features hero: capability layers around a shared client account.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:industry:financial-services",
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
    "financial-services-crm",
    "financial-services-crm-requirements",
    "financial-services-crm-features",
    "financial-services-crm-implementation",
    "financial-services-crm-security",
    "financial-services-crm-migration",
    "financial-services-crm-checklist",
  ],
  blocks: financialServicesCrmFeaturesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "map-capabilities",
      label: "Map must-have capabilities",
      description: "Records, pipelines, permissions, reporting, sync.",
      order: 0,
    },
    {
      id: "demo-scripts",
      label: "Write demo scripts per capability",
      description: "Household, dual pipeline, role restriction.",
      order: 1,
    },
    {
      id: "defer-nice",
      label: "Park nice-to-haves",
      description: "Automation depth and AI until hygiene holds.",
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
    title: "Financial Services CRM Features That Matter | SoftwareGlimpse",
    description:
      "Evaluate FS CRM features — accounts, multi-pipeline, permissions, reporting, integrations, admin — with demo tests, not feature-count marketing.",
    canonicalPath: "/guides/financial-services-crm-features/",
    indexable: true,
  },
};
