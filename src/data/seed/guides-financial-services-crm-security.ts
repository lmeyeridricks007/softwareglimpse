import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Security — permissions, audit logs, access reviews.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no certification or product-ranking claims.
 */
const financialServicesCrmSecurityBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Financial-services CRM security is an access model first: decide who sees which client records, map that to roles, then prove it with audit logs and recurring access reviews. Decision rule: do not buy or go live until you can name every role that needs client data, what each role can do, and how you will review who still has that access after the first quarter.",
    bullets: [
      "Who needs access",
      "Role boundaries",
      "Sensitive fields",
      "Audit logs",
      "Access reviews",
      "Vendor questions",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Permissions before polish",
        body: "A clean pipeline board is worthless if every seat can export every household.",
      },
      {
        label: "Roles are operational, not ceremonial",
        body: "Advisor, ops, sales, and leadership rarely need the same view of the same account.",
      },
      {
        label: "Auditability is a workflow",
        body: "Logs only help when someone owns how exports, permission changes, and bulk edits get reviewed.",
      },
      {
        label: "Ask vendors for controls, not slogans",
        body: "Request how roles, field-level limits, SSO options, and audit exports work on the plan you would buy — without treating marketing badges as proof.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "security-path",
    title: "Security evaluation path",
    steps: [
      { id: "access-map", label: "Access map", short: "Who needs what" },
      { id: "roles", label: "Roles", short: "Seat boundaries" },
      { id: "fields", label: "Fields", short: "Sensitive data" },
      { id: "audit", label: "Audit", short: "Logs & reviews" },
      { id: "vendor-ask", label: "Vendor ask", short: "Written answers" },
    ],
    ctaHref: "/guides/financial-services-crm-checklist/",
    ctaLabel: "Buyer checklist →",
  },
  {
    type: "figure",
    id: "controls-visual",
    title: "Access controls stack",
    src: "/guides/financial-services-crm-security-controls.png",
    alt: "Layered financial-services CRM security diagram: access map, roles, sensitive fields, audit logs, and recurring access reviews.",
    caption:
      "Treat CRM security as stacked operational controls — not a single checkbox on a vendor slide.",
  },
  {
    type: "step",
    id: "who-needs-access",
    stepNumber: 1,
    heading: "Map who needs access to client data",
    body: "List every seat type that will open accounts, contacts, notes, or exports. Separate daily relationship work from reporting, ops administration, and external contractors. For each seat, write whether they need all clients, only owned clients, or team-shared books.\n\nExample: an 18-person RIA (12 advisors, 3 client-service associates, 2 ops admins, 1 managing partner) maps advisors to owned households only, CSAs to assigned books, ops to configuration plus limited client read for cleanup, and the partner to firm-wide pipeline reports without bulk export of every note field.",
    tip: "If two people share a login today, treat that as a security defect to fix in the CRM design — not a habit to recreate.",
    figure: {
      src: "/guides/financial-services-crm-security-hero.png",
      alt: "Financial services CRM security hero: access map feeding roles, sensitive fields, audit logs, and access reviews.",
      caption:
        "Start from who needs client data — then design roles and reviews around that map.",
    },
    scenarios: [
      {
        title: "Advisor / RM",
        body: "Needs deep history on owned clients; rarely needs firm-wide export.",
      },
      {
        title: "Client service",
        body: "Needs assigned books and task queues without rewriting ownership.",
      },
      {
        title: "Ops / admin",
        body: "Needs configuration rights; client read should be deliberate, not default.",
      },
      {
        title: "Leadership",
        body: "Needs aggregated pipeline and activity views more than note-level browsing.",
      },
    ],
  },
  {
    type: "step",
    id: "design-roles",
    stepNumber: 2,
    heading: "Design roles before inviting the whole firm",
    body: "Translate the access map into a small role set with clear create/read/update/delete and export boundaries. Prefer fewer well-named roles over one-off exceptions. Document who can change permissions and who approves exceptions.\n\nExample: the same RIA ships four roles — Advisor, Client Service, Ops Admin, Leadership View — and refuses a fifth “power user” until a written exception names the data risk and review date. Field-level limits hide tax-ID style custom fields from Leadership View and Client Service create rights.",
    tip: "Pilot roles with two advisors and one CSA before cloning the model firm-wide.",
    scenarios: [
      {
        title: "Owned vs team vs firm",
        body: "Visibility scopes should match how books are actually shared.",
      },
      {
        title: "Export rights",
        body: "Treat export as a distinct privilege from on-screen read.",
      },
      {
        title: "Permission changers",
        body: "Only named admins alter roles; changes should be reviewable later.",
      },
    ],
  },
  {
    type: "step",
    id: "audit-needs",
    stepNumber: 3,
    heading: "Define audit needs and access-review cadence",
    body: "Decide what events matter operationally: permission changes, bulk edits, exports, login anomalies your vendor surfaces, and who can restore deleted records. Assign an owner for quarterly access reviews — compare active seats to the HR roster and remove leavers the same week they exit.\n\nExample: the RIA ops lead runs a 30-minute access review on the first Monday of each quarter: export user list, tick seats against the headcount sheet, revoke contractor access that outlived the project, and file the dated checklist in the admin drive. Export events are sampled monthly for unexpected full-book downloads.",
    tip: "If nobody owns the review calendar, audit logs become unread storage — not a control.",
    scenarios: [
      {
        title: "Joiners / movers / leavers",
        body: "Seat changes should trigger the same day as role or book changes.",
      },
      {
        title: "Export sampling",
        body: "Spot-check large exports; ask why before assuming malice.",
      },
      {
        title: "Admin change log",
        body: "Keep a short trail of who altered roles or sharing rules.",
      },
    ],
  },
  {
    type: "step",
    id: "vendor-questions",
    stepNumber: 4,
    heading: "Ask vendors the same security questions in writing",
    body: "Send every finalist an identical bank: which plans include role-based access and field-level limits; how sharing rules work for multi-advisor households; whether SSO is available on the proposed plan; what audit events export and in what format; how long logs are retained on that plan; how you remove a leavers’ access; and what happens to data on cancellation. Record answers next to your access map — do not accept slide claims alone.\n\nExample: after demos, the RIA emails three finalists the same six questions. One clarifies field-level limits sit on a higher tier than demoed; another provides a sample audit export during trial. The team scores controls against the access map, not against who sounded most “enterprise.”",
    tip: "Pair these asks with your buyer checklist and requirements sheet so security is not a late surprise.",
    scenarios: [
      {
        title: "Plan gates",
        body: "Confirm the proposed tier includes the controls you mapped.",
      },
      {
        title: "Trial proof",
        body: "Create a non-admin seat and verify it cannot export the full book.",
      },
      {
        title: "Exit path",
        body: "Ask how exports and deletion work before you depend on the system.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Security mistakes",
    items: [
      {
        title: "Everyone gets admin “just for setup”",
        body: "Temporary admin rights become permanent. Seed a temporary admin list with a removal date.",
      },
      {
        title: "Confusing marketing badges with your access model",
        body: "Vendor security pages do not replace your role map, field limits, or review cadence.",
      },
      {
        title: "Ignoring exports and integrations",
        body: "A locked UI still leaks if CSV export or connected tools bypass your intended boundaries.",
      },
      {
        title: "No owner for access reviews",
        body: "Without a named ops owner and calendar, leavers and contractors linger indefinitely.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What does CRM security mean for financial-services teams?",
        answer:
          "In practice it means who can see and change client records, which fields are limited, how exports work, and how you review access over time. Treat it as an operational model you can test in a trial — this guide is educational, not legal or compliance advice.",
      },
      {
        question: "Do we need an industry-specific CRM for security?",
        answer:
          "Not automatically. Many firms meet their needs with a general CRM that supports roles, sharing rules, and auditability — plus disciplined process. Choose purpose-built options only when your access or workflow requirements cannot be modeled; verify with vendors and your internal owners.",
      },
      {
        question: "What should we ask vendors about audit logs?",
        answer:
          "Ask which events are logged, who can view or export them, retention on the proposed plan, and whether you can evidence permission changes and bulk exports. Request a sample export during evaluation when possible.",
      },
      {
        question: "How often should we run access reviews?",
        answer:
          "A common operational pattern is at least quarterly, plus same-week reviews for joiners, movers, and leavers. Increase frequency if contractors or seasonal staff rotate often.",
      },
      {
        question: "Where does this fit in the buying journey?",
        answer:
          "Use the access map during requirements and demos, prove roles in trial, and keep review ownership on the go-live checklist. Cross-link the FS requirements, checklist, and implementation guides so security is not bolted on after launch.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related financial-services CRM resources",
    links: [
      {
        href: "/industries/financial-services/",
        label: "CRM for Financial Services",
        description: "Industry hub for FS buyers.",
      },
      {
        href: "/guides/financial-services-crm/",
        label: "How FS teams use CRM",
        description: "Advisory and sales workflows.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Must-haves including permissions.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "Admin and access capabilities.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Pilot with roles before scale.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "Move data without widening access.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM buyer checklist",
        description: "Security questions on one sheet.",
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
    title: "Shortlist with security constraints in mind",
    body: "Use CRM Finder to capture admin and access needs alongside pipeline fit — then pressure-test finalists with the same written security questions.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmSecurityGuide: GuidePage = {
  id: "guide-financial-services-crm-security",
  slug: "financial-services-crm-security",
  title: "Financial Services CRM Security: Permissions, Audit Logs & Access Reviews",
  summary:
    "Evaluate financial-services CRM security as an access model — roles, sensitive fields, audit logs, and access reviews — without relying on marketing certification claims.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/financial-services-crm-security-hero.png",
    alt: "Financial services CRM security hero: access map feeding roles, sensitive fields, audit logs, and access reviews.",
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
    "financial-services-crm-migration",
    "financial-services-crm-checklist",
  ],
  blocks: financialServicesCrmSecurityBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "access-map",
      label: "Write who needs which client access",
      description: "Owned, team, or firm-wide scopes.",
      order: 0,
    },
    {
      id: "roles",
      label: "Define roles and export rights",
      description: "Pilot before firm-wide invites.",
      order: 1,
    },
    {
      id: "reviews",
      label: "Name an access-review owner",
      description: "Quarterly plus joiner/mover/leaver.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
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
    title: "FS CRM Security: Permissions & Audit Logs | SoftwareGlimpse",
    description:
      "How to evaluate financial-services CRM security: access maps, roles, sensitive fields, audit logs, and access reviews — educational, not legal advice.",
    canonicalPath: "/guides/financial-services-crm-security/",
    indexable: true,
  },
};
