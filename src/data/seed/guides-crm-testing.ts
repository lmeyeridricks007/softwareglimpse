import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Testing Guide — UAT scripts and exit criteria before go-live.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented prices, rankings, or metrics.
 */
const crmTestingBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM testing means role-based UAT scripts that prove the core loop — create contact, move deal, email sync, permissions — before you invite the whole company. Decision rule: do not go live until every P0 script passes for AE, manager, and admin personas, with written exit criteria and no open blocker defects on owners, stages, sync, or access.",
    bullets: [
      "P0 scripts",
      "Role-based",
      "Core loop",
      "Sync proof",
      "Permissions",
      "Exit criteria",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Scripts beat click-arounds",
        body: "Named steps with expected results catch gaps demos hide.",
      },
      {
        label: "Test as each role",
        body: "Admin success does not prove AE or manager reality.",
      },
      {
        label: "Exit criteria are binary",
        body: "Pass/fail on P0 — not “mostly fine for launch.”",
      },
      {
        label: "Blockers stop the clock",
        body: "Owner, stage, sync, or permission failures delay go-live.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "testing-path",
    title: "CRM testing path",
    steps: [
      { id: "scope", label: "Scope", short: "P0 vs later" },
      { id: "scripts", label: "Scripts", short: "Role UAT" },
      { id: "run", label: "Run", short: "Sandbox evidence" },
      { id: "defects", label: "Defects", short: "Blockers first" },
      { id: "exit", label: "Exit", short: "Sign-off gate" },
    ],
    ctaHref: "/guides/crm-go-live/",
    ctaLabel: "Go-live guide →",
  },
  {
    type: "figure",
    id: "uat-flow-visual",
    title: "Role-based UAT flow",
    src: "/guides/crm-testing-uat-flow.png",
    alt: "CRM UAT flow: create contact, move deal, prove email sync, check permissions, then exit criteria sign-off.",
    caption:
      "Four core scripts plus exit criteria — enough to prove the loop without testing the entire marketplace.",
  },
  {
    type: "checklist",
    id: "uat-exit",
    title: "UAT exit criteria (before go-live)",
    copyable: true,
    items: [
      {
        id: "p0-pass",
        label: "All P0 scripts pass",
        description: "Create contact, move deal, email sync, permissions.",
        order: 0,
      },
      {
        id: "roles",
        label: "AE, manager, and admin each ran their scripts",
        description: "Not only the implementer on an admin seat.",
        order: 1,
      },
      {
        id: "no-blockers",
        label: "No open P0 defects",
        description: "Owner, stage, sync, or access blockers closed or deferred with written risk.",
        order: 2,
      },
      {
        id: "evidence",
        label: "Evidence attached",
        description: "Screenshots or links to test records for each P0 script.",
        order: 3,
      },
      {
        id: "signoff",
        label: "Manager + admin sign-off recorded",
        description: "Date, names, and “ready for cutover” or “blocked.”",
        order: 4,
      },
      {
        id: "rollback-aware",
        label: "Rollback triggers reviewed",
        description: "Same failures that would stop go-live (see go-live guide).",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "scope-p0",
    stepNumber: 1,
    heading: "Scope P0 scripts — core loop only",
    body: "Write a short P0 list tied to how the team will work in week one: create/update contact and company, create and stage-move a deal with owner + next step, prove one email or meeting attaches to a record, and prove a permission denial (AE cannot edit another territory / sensitive field). Park reporting polish, automations, and marketplace apps for post-hypercare.\n\nExample: Apex Relay (eight-person B2B sales) freezes four P0 scripts. UAT lead Devon rejects “test every dashboard widget” as out of scope. Anything that would stop Friday pipeline review is P0; nice charts are P2.",
    tip: "If a script is not required to sell or coach next week, it is not a go-live blocker.",
    figure: {
      src: "/guides/crm-testing-hero.png",
      alt: "CRM testing hero: UAT console with role tabs and pass/fail scripts for contact, deal, sync, and permissions.",
      caption:
        "Role tabs and pass/fail on P0 scripts — the gate between sandbox and cutover.",
    },
    scenarios: [
      {
        title: "Sales-led P0",
        body: "Contact, deal, sync, manager board view.",
      },
      {
        title: "CS-adjacent P0",
        body: "Account ownership + activity log if support shares CRM.",
      },
      {
        title: "Defer",
        body: "Complex automations and AI features after hypercare.",
      },
    ],
  },
  {
    type: "step",
    id: "write-role-scripts",
    stepNumber: 2,
    heading: "Write role-based scripts with expected results",
    body: "Each script needs: persona, preconditions, numbered steps, expected result, and evidence to capture. AE script: create contact, open deal, set next step, log activity. Manager script: open board, filter by owner, reject a dishonest stage jump (if your process requires it). Admin script: invite user, assign role, confirm field visibility, run a duplicate check view.\n\nExample: Apex AE script expects “deal appears on board with owner = tester and next step date filled.” Manager script expects “can see team deals, cannot edit admin settings.” Admin script expects “AE role cannot export all contacts” if that is the access matrix rule.",
    tip: "Expected results must be observable — “feels fine” is not a pass.",
    scenarios: [
      {
        title: "AE create contact",
        body: "New person + company link; required fields enforced.",
      },
      {
        title: "AE move deal",
        body: "Stage change only when exit criteria fields are present.",
      },
      {
        title: "Manager coach view",
        body: "Board shows stuck deals without rebuilding in Sheets.",
      },
    ],
  },
  {
    type: "step",
    id: "run-sync-permissions",
    stepNumber: 3,
    heading: "Prove email sync and permissions on real seats",
    body: "Run sync tests on the same mailbox provider you will use in production: send or receive one message, confirm it attaches to the correct contact/deal, and note latency. For permissions, test both allow and deny paths — a role that can do everything has not been tested.\n\nExample: Apex seller Lena connects Microsoft 365 in sandbox, emails a prospect from her client, and confirms the thread lands on the deal. Devon then logs in as AE and confirms she cannot open Finance’s private notes field. Both results go in the evidence folder before sign-off.",
    tip: "Sync that works for the admin’s mailbox only is not sync — retest as an AE.",
    scenarios: [
      {
        title: "Inbound attach",
        body: "Customer reply appears on the right record.",
      },
      {
        title: "Outbound log",
        body: "Sent mail from the approved client shows on the deal.",
      },
      {
        title: "Deny path",
        body: "Wrong-role user is blocked and the message is clear.",
      },
    ],
  },
  {
    type: "step",
    id: "exit-and-handoff",
    stepNumber: 4,
    heading: "Apply exit criteria and hand off to go-live",
    body: "Score each P0 script pass/fail. Open defects as blocker vs defer. Blockers (cannot create deals, owners missing, sync broken, permissions wrong) stop cutover. Deferrals need an owner and a date after hypercare. Record manager + admin sign-off, then move to the go-live freeze window.\n\nExample: Apex fails one script when next-step date is optional and sellers leave it blank. They make the field required, re-run AE and manager scripts, pass all P0s, and only then schedule the Friday freeze for go-live.",
    tip: "Sign-off without evidence is theater — attach the test records.",
    scenarios: [
      {
        title: "Pass → go-live",
        body: "All P0 green; cutover checklist unlocked.",
      },
      {
        title: "Blocker → delay",
        body: "Fix config/data; re-run failed scripts only.",
      },
      {
        title: "Defer with risk",
        body: "Written exception, owner, and hypercare watch item.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "CRM testing mistakes",
    items: [
      {
        title: "Only the implementer tests as admin",
        body: "AEs discover broken permissions on day one of go-live.",
      },
      {
        title: "No expected results on scripts",
        body: "Everything “kind of works” and nothing is decidable.",
      },
      {
        title: "Skipping the deny path",
        body: "Over-permissioned roles pass every click and fail compliance intent.",
      },
      {
        title: "Testing automations before the core loop",
        body: "You automate a process nobody can execute manually yet.",
      },
      {
        title: "Going live with open P0 defects",
        body: "Hypercare becomes firefighting instead of coaching.",
      },
      {
        title: "No retest after a “small” config change",
        body: "Field and role edits invalidate prior passes — re-run affected scripts.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What UAT scripts should every CRM run before go-live?",
        answer:
          "At minimum: create/update a contact, create and move a deal with owner and next step, prove email or calendar sync on a real seat, and verify allow/deny permissions for AE vs manager vs admin.",
      },
      {
        question: "Who should execute the scripts?",
        answer:
          "At least one person per role (AE, manager, admin) — not only the project lead on an admin account. Capture evidence from those seats.",
      },
      {
        question: "What are good exit criteria before go-live?",
        answer:
          "All P0 scripts pass, no open blocker defects on owners/stages/sync/access, evidence attached, and manager + admin written sign-off. Anything less is a delay or a documented risk exception.",
      },
      {
        question: "How long should UAT take?",
        answer:
          "Long enough to run and retest P0 scripts after fixes — often days for a focused sales pod, not weeks of unbounded exploration. Scope keeps duration honest.",
      },
      {
        question: "Should we test in production?",
        answer:
          "Prefer a sandbox or isolated pilot org that mirrors production roles and sync. If you must use production, use clearly labeled test records and a cleanup owner.",
      },
      {
        question: "What if email sync fails only for some users?",
        answer:
          "Treat it as a P0 blocker for those seats. Do not go live assuming “they’ll reconnect later” without a named fix owner and retest.",
      },
      {
        question: "What should I do next?",
        answer:
          "When P0 exit criteria pass, follow the CRM Go-Live Guide for freeze and cutover. Use Training so roles practice the same scripts in sandbox before launch day.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/resources/crm-uat-test-script/",
        label: "UAT test script worksheet",
        description: "Role-based cases, expected results, and sign-off before cutover.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Cutover after UAT exit criteria pass.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training guide",
        description: "Practice the same scripts in sandbox.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "Prove mapped fields behave in product.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Pilot data ready before UAT.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Keep usage honest after launch.",
      },
      {
        href: "/guides/crm-implementation-mistakes/",
        label: "Implementation mistakes",
        description: "Avoid launching on untested config.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Trial evidence from earlier evaluation.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing the CRM?",
    body: "If testing is blocked because the product is not final, CRM Finder rebuilds a constrained shortlist before you write more UAT scripts.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmTestingGuide: GuidePage = {
  id: "guide-crm-testing",
  slug: "crm-testing",
  title: "CRM Testing Guide: UAT Scripts Before Go-Live",
  summary:
    "Run role-based CRM UAT — create contact, move deal, email sync, permissions — with clear exit criteria and blocker rules before cutover.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-testing-hero.png",
    alt: "CRM testing hero: UAT console with role tabs and pass/fail scripts for contact, deal, sync, and permissions.",
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
      contentId: "content:tool:crm-vendor-scorecard",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-go-live",
    "crm-training",
    "crm-field-mapping",
    "crm-data-migration",
    "crm-adoption",
    "crm-implementation-mistakes",
  ],
  blocks: crmTestingBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "p0-scripts",
      label: "Write P0 role-based UAT scripts",
      description: "Contact, deal, sync, permissions.",
      order: 0,
    },
    {
      id: "run-evidence",
      label: "Run as AE, manager, and admin",
      description: "Attach evidence for each pass.",
      order: 1,
    },
    {
      id: "exit-signoff",
      label: "Meet exit criteria and sign off",
      description: "No open P0 blockers before cutover.",
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
    title: "CRM Testing Guide: UAT Before Go-Live | SoftwareGlimpse",
    description:
      "CRM UAT scripts for AE, manager, and admin — create contact, move deal, email sync, permissions — plus exit criteria before go-live.",
    canonicalPath: "/guides/crm-testing/",
    indexable: true,
  },
};
