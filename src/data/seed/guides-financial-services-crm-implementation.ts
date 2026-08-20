import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Implementation — pilot → hygiene → expand.
 * Template: softwareglimpse-guide-template-v1
 */
const financialServicesCrmImplementationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Implement financial-services CRM in gated phases: pilot one book or territory, lock hygiene (owners, stages, next steps, permissions), then expand seats and light automation. Decision rule: do not add teams or complex workflows until Friday reviews run from the board for two consecutive weeks without a side spreadsheet — if Harborline still rebuilds status in Sheets, you are still in pilot.",
    bullets: [
      "Pilot scope",
      "Admin owner",
      "Core loop live",
      "Hygiene gates",
      "Expand seats",
      "Automate last",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Pilot beats big-bang",
        body: "One planner pod or one sales territory proves the loop before firm-wide risk.",
      },
      {
        label: "Name an admin owner",
        body: "Fields, roles, and duplicates need a responsible person with hours on the calendar.",
      },
      {
        label: "Hygiene before automation",
        body: "Automating unclean stages and empty next steps amplifies noise.",
      },
      {
        label: "Expand on evidence",
        body: "Two clean Friday reviews are a better go signal than a feature checklist.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "fs-rollout-path",
    title: "FS CRM rollout path",
    steps: [
      { id: "pilot", label: "Pilot", short: "One book/territory" },
      { id: "configure", label: "Configure", short: "Core loop only" },
      { id: "hygiene", label: "Hygiene", short: "Owners & stages" },
      { id: "review", label: "Review", short: "Two clean Fridays" },
      { id: "expand", label: "Expand", short: "Seats & light automations" },
    ],
    ctaHref: "/guides/financial-services-crm-migration/",
    ctaLabel: "FS CRM migration →",
  },
  {
    type: "figure",
    id: "implementation-roadmap-visual",
    title: "Pilot → hygiene → expand",
    src: "/guides/financial-services-crm-implementation-roadmap.png",
    alt: "Financial-services CRM implementation roadmap: pilot one book, configure core loop, lock hygiene, then expand seats and light automation.",
    caption:
      "Gate expansion on trusted weekly use — not on configuration completeness.",
  },
  {
    type: "checklist",
    id: "pre-pilot-checklist",
    title: "Before the pilot starts",
    copyable: true,
    items: [
      {
        id: "outcomes",
        label: "Three 90-day outcomes frozen",
        description: "From the FS requirements sheet.",
        order: 0,
      },
      {
        id: "admin",
        label: "Admin owner named with hours",
        description: "Fields, users, permissions, duplicates.",
        order: 1,
      },
      {
        id: "scope",
        label: "Pilot segment chosen",
        description: "One book, pod, or territory — not the whole firm.",
        order: 2,
      },
      {
        id: "access",
        label: "Access matrix sketched",
        description: "Who sees which accounts and sensitive fields.",
        order: 3,
      },
      {
        id: "success",
        label: "Pilot success criteria written",
        description: "Two Friday reviews from the board without a side sheet.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "pilot-scope",
    stepNumber: 1,
    heading: "Pilot one book or territory",
    body: "Pick a segment large enough to feel real and small enough to fix quickly. Import or enter only that segment’s accounts, contacts, and open items.\n\nExample: Harborline Advisory pilots Maya’s book (≈80 households) plus BD opportunities tied to those accounts. Ops admin Keisha configures accounts, one advisory board, one new-business pipeline, and roles for planner vs BD. The rest of the firm stays on existing tools until Maya’s Friday reviews run clean for two weeks.",
    tip: "Write the pilot exit criteria before day one — “everyone is in” is not a criterion.",
    figure: {
      src: "/guides/financial-services-crm-implementation-hero.png",
      alt: "Financial-services CRM implementation hero: gated rollout from pilot book to firm-wide expansion.",
      caption:
        "Prove coverage and pipeline truth on one segment before you scale seats.",
    },
    scenarios: [
      {
        title: "Advisory pilot",
        body: "One planner’s book with coverage partner and admin support.",
      },
      {
        title: "Sales pilot",
        body: "One territory with manager coaching from the board.",
      },
      {
        title: "Mixed pilot",
        body: "Shared accounts where BD and planning already collide.",
      },
    ],
  },
  {
    type: "step",
    id: "configure-core",
    stepNumber: 2,
    heading: "Configure the core loop only",
    body: "Day-zero setup: users/roles, account+contact fields you will actually fill, pipelines that match pilot work, email/calendar sync, and required owner + next-step fields. Defer marketplace apps, AI add-ons, and deep automation.\n\nExample: Meridian Specialty Finance configures New Business stages with Credit Review as a real checkpoint, invites six pilot sellers + manager, syncs Microsoft 365, and bans custom fields that are not on the requirements sheet. Ana the ops lead owns field requests with a weekly triage — not instant yes.",
    tip: "Every new field needs an owner who will keep it accurate — otherwise delete it from the pilot.",
    scenarios: [
      {
        title: "Roles first",
        body: "Permissions match the access matrix before data entry.",
      },
      {
        title: "Stages match reality",
        body: "Rename or remove vendor defaults that your process never uses.",
      },
      {
        title: "Sync that feeds records",
        body: "Prove one logged email/meeting on a deal before inviting more users.",
      },
    ],
  },
  {
    type: "step",
    id: "hygiene-gates",
    stepNumber: 3,
    heading: "Lock hygiene before you expand",
    body: "Hygiene means: every open item has an owner and next-step date, stages only move when exit criteria are met, duplicates are merged on a schedule, and permission exceptions are rare and reviewed.\n\nExample: Crestview Wealth’s pilot fails week one because next-review dates are empty. Priya and Devon run a 30-minute hygiene huddle twice a week until the overdue view is empty. Only then does the practice lead schedule the second pod’s onboarding.",
    tip: "Treat empty next steps and orphan accounts as incidents — not as “we’ll clean later.”",
    scenarios: [
      {
        title: "Owner + next step",
        body: "No open deal or review item without both.",
      },
      {
        title: "Stage honesty",
        body: "Managers reject stage jumps that skip real checkpoints.",
      },
      {
        title: "Access exceptions",
        body: "Temporary broader access has an expiry and a named approver.",
      },
    ],
  },
  {
    type: "step",
    id: "expand",
    stepNumber: 4,
    heading: "Expand seats, then light automation",
    body: "After two consecutive Friday reviews run from CRM without a side sheet, invite the next segment with the same core configuration. Add only automations that remove proven repetitive work (stale-deal alerts, missing next-step reminders).\n\nExample: Harborline expands to a second planner after Maya’s board stays clean. Keisha clones the role set, imports the next book carefully, and adds one automation: notify owner when next-review date is blank for seven days. AI features and complex multi-branch flows stay parked.",
    tip: "Expansion is a people change — schedule training on the pilot’s real records, not a generic vendor webinar alone.",
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "FS implementation mistakes",
    items: [
      {
        title: "Firm-wide go-live on week one",
        body: "You inherit every messy process at once and lose the ability to fix the loop quickly.",
      },
      {
        title: "Configuring everything before anyone sells or advises",
        body: "Empty decorated workspaces do not create trust; one complete core loop does.",
      },
      {
        title: "Automating before hygiene",
        body: "Task spam on dishonest stages trains people to ignore the CRM.",
      },
      {
        title: "No admin hours",
        body: "Without a named owner, permissions and fields drift and FS teams quietly return to sheets.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How should financial services teams implement CRM?",
        answer:
          "Pilot one book or territory, configure only the core loop (records, pipelines, permissions, sync), lock hygiene until Friday reviews run from the board, then expand seats and add light automation. Gate expansion on evidence, not on a feature checklist.",
      },
      {
        question: "How long should the pilot run?",
        answer:
          "Long enough to complete two consecutive clean weekly reviews — often a few weeks for a focused pod. Do not calendar a firm-wide date until that gate passes.",
      },
      {
        question: "What belongs in day-zero configuration?",
        answer:
          "Users/roles, account and contact essentials, pipelines that match real work, owner + next-step fields, and email/calendar sync. Defer marketplace apps and heavy automation.",
      },
      {
        question: "When should we migrate historical data?",
        answer:
          "Import what the pilot needs to trust coverage and open opportunities; use the migration guide for bulk history. Prefer a clean pilot over dumping years of unowned notes on day one.",
      },
      {
        question: "How do we handle permissions during rollout?",
        answer:
          "Start from the access matrix, grant least needed access for the pilot roles, and review exceptions on a schedule. Confirm audit/export needs with your policy owners and vendor documentation — do not invent certification claims as go-live proof.",
      },
      {
        question: "What should I do next?",
        answer:
          "If data is moving from another system, follow FS CRM Migration. Use FS CRM Checklist for copyable gates, and CRM Finder if you still need to finalize the product choice.",
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
        description: "Industry hub context for rollout.",
      },
      {
        href: "/guides/financial-services-crm/",
        label: "How FS teams use CRM",
        description: "Operating model to implement.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Freeze outcomes before configure.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "What to configure vs defer.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Access and audit during rollout.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "Pilot import and cutover.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM checklist",
        description: "Copyable implementation gates.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing the product?",
    body: "If implementation is blocked on shortlist clarity, CRM Finder maps FS constraints to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmImplementationGuide: GuidePage = {
  id: "guide-financial-services-crm-implementation",
  slug: "financial-services-crm-implementation",
  title: "Financial Services CRM Implementation: Pilot to Expand",
  summary:
    "Roll out financial-services CRM in gated phases — pilot one book, lock hygiene, then expand seats and light automation — without big-bang risk or invented compliance claims.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/financial-services-crm-implementation-hero.png",
    alt: "Financial-services CRM implementation hero: gated rollout from pilot book to firm-wide expansion.",
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
  blocks: financialServicesCrmImplementationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pilot",
      label: "Define pilot segment & exit criteria",
      description: "One book/territory; two clean Fridays.",
      order: 0,
    },
    {
      id: "core-loop",
      label: "Configure core loop only",
      description: "Roles, pipelines, sync, owner + next step.",
      order: 1,
    },
    {
      id: "expand-gate",
      label: "Expand after hygiene holds",
      description: "Then seats and light automation.",
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
    title:
      "Financial Services CRM Implementation Guide | SoftwareGlimpse",
    description:
      "Implement FS CRM with a pilot → hygiene → expand path: core loop, permissions, and weekly review gates — without big-bang go-lives.",
    canonicalPath: "/guides/financial-services-crm-implementation/",
    indexable: true,
  },
};
