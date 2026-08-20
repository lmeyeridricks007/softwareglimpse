import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Training Guide — role-based curricula, sandbox practice, certification-lite.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented prices, rankings, or metrics.
 */
const crmTrainingBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Train CRM by role — AE, manager, admin — with short curricula practiced in sandbox on real-shaped records, then a certification-lite checklist before production access. Decision rule: do not grant broad production seats until each role completes its sandbox script (create/update core records for AEs, coach from the board for managers, hygiene and users for admins) and a named owner confirms the checklist.",
    bullets: [
      "Role curricula",
      "Sandbox practice",
      "AE / manager / admin",
      "Certification-lite",
      "Then production",
      "Link adoption",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One webinar is not training",
        body: "Roles need different scripts and different pass criteria.",
      },
      {
        label: "Sandbox before seats",
        body: "Practice on safe data; production is for real work.",
      },
      {
        label: "Certification-lite is a checklist",
        body: "Observable tasks — not a quiz score or vendor badge.",
      },
      {
        label: "Adoption is the sequel",
        body: "Training unlocks access; adoption keeps the board honest.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "training-path",
    title: "Training path",
    steps: [
      { id: "roles", label: "Roles", short: "AE / mgr / admin" },
      { id: "curriculum", label: "Curriculum", short: "Short scripts" },
      { id: "sandbox", label: "Sandbox", short: "Practice reps" },
      { id: "cert", label: "Cert-lite", short: "Checklist pass" },
      { id: "access", label: "Access", short: "Production seats" },
      { id: "adopt", label: "Adopt", short: "Ongoing coaching" },
    ],
    ctaHref: "/guides/crm-adoption/",
    ctaLabel: "Adoption guide →",
    figure: {
      src: "/guides/crm-training-path.png",
      alt: "CRM training path: roles, short curricula, sandbox practice, cert-lite, production access, then adoption coaching.",
      caption:
        "Three curricula, one sandbox lane, then certification-lite — before broad production access.",
    },
  },
  {
    type: "figure",
    id: "roles-visual",
    title: "Role-based curricula",
    src: "/guides/crm-training-roles.png",
    alt: "CRM training path with AE, manager, and admin curriculum columns, shared sandbox practice, and certification-lite checklist leading to adoption.",
    caption:
      "Three curricula, one sandbox lane, then certification-lite — before broad production access.",
  },
  {
    type: "checklist",
    id: "cert-lite",
    title: "Certification-lite checklist",
    copyable: true,
    items: [
      {
        id: "ae-contact",
        label: "AE: create contact + company link",
        description: "Required fields complete without admin help.",
        order: 0,
      },
      {
        id: "ae-deal",
        label: "AE: create deal with owner + next step",
        description: "Stage set honestly; next date filled.",
        order: 1,
      },
      {
        id: "ae-sync",
        label: "AE: connect email/calendar (if in scope)",
        description: "One activity visible on a record.",
        order: 2,
      },
      {
        id: "mgr-board",
        label: "Manager: run a board review in sandbox",
        description: "Find stuck deals; coach without a side sheet.",
        order: 3,
      },
      {
        id: "mgr-forecast",
        label: "Manager: open forecast/pipeline view used weekly",
        description: "Knows filters and owner breakdown.",
        order: 4,
      },
      {
        id: "admin-users",
        label: "Admin: invite user + assign role",
        description: "Matches access matrix; no over-permission.",
        order: 5,
      },
      {
        id: "admin-hygiene",
        label: "Admin: run duplicate or missing-next-step view",
        description: "Knows the weekly hygiene cadence.",
        order: 6,
      },
      {
        id: "signoff",
        label: "Trainer/owner signs checklist",
        description: "Date + name; then production seat granted.",
        order: 7,
      },
    ],
  },
  {
    type: "step",
    id: "role-curricula",
    stepNumber: 1,
    heading: "Build short role-based curricula",
    body: "AE curriculum: find/create contacts, create and update deals, fill owner + next step, log activity, use mobile or inbox sync if required. Manager curriculum: board filters, coaching stuck deals, stage honesty, lightweight forecast view. Admin curriculum: users/roles, field requests triage, duplicates, permission exceptions, weekly hygiene. Keep each under a focused session plus practice — not a day-long feature tour.\n\nExample: Harborline Sales designs three one-hour live sessions. AE Maya’s track ignores admin settings entirely. Manager Priya’s track never covers custom field creation. Admin Keisha’s track skips AE prospecting tips. Shared slide: “what good looks like on Friday.”",
    tip: "If the curriculum tries to teach every role everything, nobody remembers the core loop.",
    figure: {
      src: "/guides/crm-training-hero.png",
      alt: "CRM training hero: academy dashboard with AE, manager, and admin curriculum panels and certification-lite progress.",
      caption:
        "Role panels and a certification-lite checklist — training as observable practice, not a single webinar.",
    },
    scenarios: [
      {
        title: "AE track",
        body: "Contact, deal, next step, activity, sync.",
      },
      {
        title: "Manager track",
        body: "Board coaching, filters, stage honesty.",
      },
      {
        title: "Admin track",
        body: "Users, fields, hygiene, access exceptions.",
      },
    ],
  },
  {
    type: "step",
    id: "sandbox-practice",
    stepNumber: 2,
    heading: "Practice in sandbox on real-shaped records",
    body: "Give each trainee sandbox data that looks like their book: a few accounts, open deals in mixed stages, one messy duplicate. Run the same motions as UAT scripts so training and testing reinforce each other. Record a pass only when the person completes the motion without the trainer driving the mouse.\n\nExample: Harborline clones a scrubbed slice of Maya’s open pipeline into sandbox. Maya must move two deals and set next steps while Priya watches the board update. Keisha practices inviting a new AE with the correct role. Vendor webinar videos are optional homework — not a substitute for sandbox reps.",
    tip: "Generic vendor demo orgs teach the product UI; your sandbox teaches your process.",
    figure: {
      src: "/guides/crm-training-sandbox.png",
      alt: "Practice CRM training in sandbox on real-shaped records: seed data, run role scripts, coach mistakes, pass cert-lite, then grant production.",
      caption:
        "Sandbox practice on empty happy-path demos does not transfer — seed messy, real-shaped work.",
    },
    scenarios: [
      {
        title: "Scrubbed pilot data",
        body: "Best: real shapes without sensitive secrets.",
      },
      {
        title: "Synthetic but honest",
        body: "Invented names OK if stages and owners behave like yours.",
      },
      {
        title: "Pair practice",
        body: "AE + manager complete a mini review together.",
      },
    ],
  },
  {
    type: "step",
    id: "cert-and-access",
    stepNumber: 3,
    heading: "Run certification-lite, then grant production access",
    body: "Certification-lite is the copyable checklist above: observable tasks per role, signed by a trainer or admin owner. Failures get a repractice slot — not a lecture. Only after pass do you grant production seats matching the access matrix. Holdouts stay on legacy or read-only until they complete the checklist.\n\nExample: Harborline blocks production login until the cert-lite row is green in the tracker. One AE skips sandbox; Priya delays their seat by two days. After repractice, they pass create-deal + next-step and join go-live with everyone else.",
    tip: "Access without practice is how empty next-step fields return on day two.",
    figure: {
      src: "/guides/crm-training-cert-access.png",
      alt: "Certification-lite then production access: run checklist, observe without mouse drive, pass or repractice, trainer signoff, grant seat.",
      caption:
        "Access without practice is how empty next-step fields return on day two.",
    },
    scenarios: [
      {
        title: "Pass → seat",
        body: "Checklist signed; production role assigned.",
      },
      {
        title: "Fail → repractice",
        body: "Same script again; no shame, no skip.",
      },
      {
        title: "Late hire",
        body: "Same cert-lite before seat — no permanent exceptions.",
      },
    ],
  },
  {
    type: "step",
    id: "bridge-to-adoption",
    stepNumber: 4,
    heading: "Bridge training into adoption and go-live",
    body: "Training ends when people can execute the core loop; adoption begins when managers coach from the board weekly and empty fields are treated as incidents. Tie training completion to go-live readiness: untrained cohorts do not cut over. Point teams to the adoption guide for hygiene SLAs, reinforcement, and what to do when usage slips.\n\nExample: After Harborline’s go-live, Priya’s first Friday review uses only CRM. Keisha posts a weekly “missing next step” count. Maya’s pod gets a 15-minute refresh when a new stage is added — not a full re-onboarding. Adoption metrics stay qualitative and operational — no invented ROI numbers.",
    tip: "Schedule the first post-go-live refresh before launch day so it actually happens.",
    figure: {
      src: "/guides/crm-training-bridge-adoption.png",
      alt: "Bridge CRM training into adoption: trained cohort only at cutover, Friday board coaching, weekly hygiene, pre-scheduled refresh.",
      caption:
        "Training ends at the core loop; adoption begins when managers coach from the board weekly.",
    },
    scenarios: [
      {
        title: "Launch week",
        body: "Hypercare answers “how do I…” from the curriculum.",
      },
      {
        title: "Week three refresh",
        body: "Short session on the one process that slipped.",
      },
      {
        title: "New hire path",
        body: "Same cert-lite; buddy from a trained AE.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "CRM training mistakes",
    items: [
      {
        title: "One webinar for all roles",
        body: "Admins learn prospecting tips; AEs drown in permission settings.",
      },
      {
        title: "Training only after go-live",
        body: "Week one becomes discovery under fire.",
      },
      {
        title: "No sandbox practice",
        body: "People watch slides and freeze on the real board.",
      },
      {
        title: "Certificate without observed tasks",
        body: "A quiz score does not prove a next step was set.",
      },
      {
        title: "Granting seats to skippers",
        body: "Exceptions become the culture; data quality collapses.",
      },
      {
        title: "Never linking to adoption",
        body: "Training is a launch event; behavior needs ongoing coaching.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How should we structure CRM training by role?",
        answer:
          "Separate short curricula for AE (core loop records), manager (board coaching and views), and admin (users, fields, hygiene). Share only the “what good looks like” definition across roles.",
      },
      {
        question: "What is certification-lite?",
        answer:
          "An observed checklist of role tasks in sandbox — create contact/deal, run a board review, invite a user — signed by a trainer. It is not a vendor badge or a multiple-choice score.",
      },
      {
        question: "Should training happen before or after go-live?",
        answer:
          "Before production access and before cutover for that cohort. Use hypercare for questions, not for first-time learning of the core loop.",
      },
      {
        question: "How do we train remote or hybrid teams?",
        answer:
          "Live virtual sessions plus recorded sandbox walkthroughs, with the same cert-lite checklist. Require screen-share proof of tasks — attendance alone is not a pass.",
      },
      {
        question: "What if managers refuse to leave their spreadsheet?",
        answer:
          "Make the manager curriculum and Friday review the adoption gate: training is incomplete until they coach from the CRM board once in sandbox and once in production hypercare.",
      },
      {
        question: "How does training relate to UAT?",
        answer:
          "Reuse the same motions (create contact, move deal, sync, permissions). UAT proves the system; training proves people can operate it. See the CRM Testing Guide.",
      },
      {
        question: "What should I do next?",
        answer:
          "After cert-lite and go-live, follow the CRM Adoption Guide for ongoing hygiene and coaching. Use the Go-Live Guide to align training completion with the freeze window.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Keep the board trusted after training.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Align cert-lite with cutover.",
      },
      {
        href: "/guides/crm-testing/",
        label: "CRM testing guide",
        description: "Same scripts as sandbox practice.",
      },
      {
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "Who owns training and admin hours.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "Comms around new ways of working.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "Teach the fields people must fill.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Outcomes that define “trained enough.”",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing the CRM?",
    body: "If training plans are blocked on product choice, CRM Finder constrains the shortlist before you build role curricula.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmTrainingGuide: GuidePage = {
  id: "guide-crm-training",
  slug: "crm-training",
  title: "CRM Training Guide: Role-Based Curricula",
  summary:
    "Train CRM by role — AE, manager, admin — with sandbox practice and a certification-lite checklist before production access, then hand off to adoption.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-training-hero.png",
    alt: "CRM training hero: academy dashboard with AE, manager, and admin curriculum panels and certification-lite progress.",
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
    "crm-adoption",
    "crm-go-live",
    "crm-testing",
    "crm-implementation-roles",
    "crm-change-management",
    "crm-field-mapping",
  ],
  blocks: crmTrainingBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "curricula",
      label: "Write AE, manager, and admin curricula",
      description: "Short scripts; no one-size webinar.",
      order: 0,
    },
    {
      id: "sandbox-cert",
      label: "Run sandbox practice + cert-lite",
      description: "Observed tasks before production seats.",
      order: 1,
    },
    {
      id: "adoption-handof",
      label: "Hand off to adoption cadence",
      description: "Weekly board coaching after go-live.",
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
    title: "CRM Training Guide: Role-Based Curricula | SoftwareGlimpse",
    description:
      "CRM training by role — AE, manager, admin — with sandbox practice, certification-lite checklist, and handoff to adoption.",
    canonicalPath: "/guides/crm-training/",
    indexable: true,
  },
};
