import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Adoption Guide — login ≠ adoption; core-loop usage; 30/60/90 gates.
 * Template: softwareglimpse-guide-template-v1
 */
const crmAdoptionBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM adoption is core-loop usage under manager coaching — not seat logins. Decision rule: treat adoption as healthy only when open work has owners and dated next steps, weekly reviews run from the CRM board (not a side sheet), and managers coach from CRM views. If any of those fail at a 30/60/90 gate, pause expansion and fix training or process — do not add fields or automations.",
    bullets: [
      "Login ≠ adoption",
      "Core-loop usage",
      "Coach from CRM",
      "30/60/90 gates",
      "Train + mistakes",
      "Expand on evidence",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Measure the loop, not the login",
        body: "Contacts/deals updated with next steps beat vanity active-user charts.",
      },
      {
        label: "Managers are the adoption system",
        body: "If coaching still happens in Slack or sheets, the CRM is optional.",
      },
      {
        label: "Gates beat go-live parties",
        body: "30/60/90 checkpoints decide expand, coach, or simplify.",
      },
      {
        label: "Training and mistakes are linked",
        body: "Empty next steps and shadow sheets are process debts — retrain the ritual, not just the UI.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "adoption-path",
    title: "Adoption path",
    steps: [
      { id: "define", label: "Define loop", short: "Owner + next step" },
      { id: "train", label: "Train ritual", short: "Role-based practice" },
      { id: "coach", label: "Coach from CRM", short: "Manager views" },
      { id: "gate", label: "30/60/90", short: "Pass or intervene" },
      { id: "expand", label: "Expand", short: "Only on evidence" },
    ],
    ctaHref: "/guides/crm-implementation-kpis/",
    ctaLabel: "Implementation KPIs →",
    figure: {
      src: "/guides/crm-adoption-path.png",
      alt: "CRM adoption path: define the loop, train, coach from CRM, run 30/60/90 gates, expand only on evidence.",
      caption:
        "Adoption is gated operating change — expand only when the loop and coaching ritual are proven.",
    },
  },
  {
    type: "figure",
    id: "adoption-gates-visual",
    title: "30 / 60 / 90 adoption gates",
    src: "/guides/crm-adoption-gates-30-60-90.png",
    alt: "Three-column CRM adoption timeline for Day 30, Day 60, and Day 90 with pass versus coaching decision paths.",
    caption:
      "Each gate is a decision — expand, coach, or simplify — not a calendar decoration.",
  },
  {
    type: "checklist",
    id: "adoption-definition-checklist",
    title: "Define adoption before you measure it",
    copyable: true,
    items: [
      {
        id: "core-objects",
        label: "Name the core objects",
        description: "Usually accounts/contacts + opportunities (or tickets) for this team.",
        order: 0,
      },
      {
        id: "loop-steps",
        label: "Write the core loop in one sentence",
        description: "Create/update → log activity → move stage honestly → set next step.",
        order: 1,
      },
      {
        id: "manager-view",
        label: "Name the manager coaching view",
        description: "The board or list used in the weekly review — no side sheet allowed.",
        order: 2,
      },
      {
        id: "non-signals",
        label: "List non-adoption signals",
        description: "Login-only, notes in email, Friday rebuild in Sheets.",
        order: 3,
      },
      {
        id: "gate-owners",
        label: "Assign 30/60/90 gate owners",
        description: "Ops + sales/service lead jointly sign pass/fail.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "login-vs-adoption",
    stepNumber: 1,
    heading: "Separate logins from adoption",
    body: "Seat activity proves people can open the app. Adoption proves the system of record is where work lives. Track whether open items have owners and next-step dates, whether stage changes happen in CRM, and whether the weekly review starts from a CRM view.\n\nExample: Northwind Field Services rolled out CRM to twelve estimators. Week three showed strong daily logins, but Friday still rebuilt a shared Sheet because next-step dates were empty and managers asked for updates in chat. Ops lead Priya redefined success as “board-native Friday review” and stopped reporting login counts to leadership.",
    tip: "If leadership only asks “are people logging in?”, reframe the metric before you celebrate go-live.",
    figure: {
      src: "/guides/crm-adoption-hero.png",
      alt: "CRM adoption hero: login chart contrasted with core-loop usage and manager coaching from the pipeline board, plus 30/60/90 gates.",
      caption:
        "Logins can look healthy while the core loop and coaching ritual are still broken.",
    },
    scenarios: [
      {
        title: "High login, low trust",
        body: "People browse dashboards but update deals elsewhere — coach the loop.",
      },
      {
        title: "Low login, high shadow work",
        body: "Sheets and inboxes still win — simplify fields and retrain the ritual.",
      },
      {
        title: "Manager bypass",
        body: "Managers accept verbal updates — make CRM the only accepted review surface.",
      },
    ],
  },
  {
    type: "step",
    id: "core-loop",
    stepNumber: 2,
    heading: "Instrument the core loop",
    body: "Pick the minimum loop every role must complete for open work. For sales pods that is usually: own the opportunity, keep stage honest, log the last meaningful touch, and set a dated next step. Defer custom fields and automation until that loop holds for two consecutive weekly reviews.\n\nExample: Meridian Specialty Finance pilots six sellers. Admin Ana requires owner + next-step on every open deal and bans new custom fields for thirty days. Sellers practice the loop on live deals in a ninety-minute role workshop — not a vendor feature tour.",
    tip: "A field without an owner who will keep it accurate is adoption debt.",
    figure: {
      src: "/guides/crm-adoption-core-loop.png",
      alt: "CRM core loop teaching diagram: own, stage honestly, log touch, set next step, review weekly from CRM.",
      caption:
        "Instrument this minimum loop before you add custom fields or automation.",
    },
    scenarios: [
      {
        title: "Sales loop",
        body: "Deal owner, stage, activity, next step — reviewed weekly.",
      },
      {
        title: "Account management loop",
        body: "Account owner, open risks/opportunities, next review date.",
      },
      {
        title: "Service-adjacent loop",
        body: "Case/ticket owner, status, customer next action date.",
      },
    ],
  },
  {
    type: "step",
    id: "manager-coaching",
    stepNumber: 3,
    heading: "Make managers coach from CRM",
    body: "Adoption collapses when managers run reviews from memory, Slack threads, or personal sheets. Publish one coaching agenda: stuck deals, empty next steps, stage jumps without evidence, and coverage gaps. Managers prepare from saved CRM views before the meeting.\n\nExample: Harborline Advisory’s practice lead refuses status updates that are not on Maya’s board. After two Fridays, estimators stop dual-entering because the Sheet no longer influences coaching or forecast conversations.",
    tip: "Manager behavior is the real enforcement mechanism — tooling alone will not win.",
    figure: {
      src: "/guides/crm-adoption-manager-coach.png",
      alt: "Managers coach from CRM: open the board, ask owner and next step, coach deal quality, update live, no side sheet.",
      caption:
        "If managers accept verbal updates, the CRM will never become the system of record.",
    },
    scenarios: [
      {
        title: "New manager",
        body: "Shadow one CRM-native review before leading alone.",
      },
      {
        title: "Founder-led team",
        body: "Founder models the same rule: no Slack-only pipeline answers.",
      },
      {
        title: "Multi-pod rollout",
        body: "Each pod lead owns the same agenda template; ops audits empty next steps.",
      },
    ],
  },
  {
    type: "step",
    id: "gates-306090",
    stepNumber: 4,
    heading: "Run 30 / 60 / 90 gates",
    body: "Day 30: core loop trained, owners assigned, no uncontrolled field sprawl. Day 60: managers coach from CRM; next-step fill and open-item ownership meet your team-defined targets for two weeks; side sheets retired from the review. Day 90: expand seats or segments only if gates passed — otherwise intervene (simplify, retrain, or reset ownership).\n\nExample: Crestview Wealth fails Day 60 because partners still rebuild household lists for Monday. They freeze new users, cut unused fields, and retrain the coverage ritual for three weeks before retrying the gate.",
    tip: "Missing a gate is information — not a reason to add more configuration.",
    figure: {
      src: "/guides/crm-adoption-gates-30-60-90.png",
      alt: "30/60/90 CRM adoption gates with pass, coach, or simplify decisions at each checkpoint.",
      caption:
        "Each gate is a decision — expand, coach, or simplify — not a calendar decoration.",
    },
    scenarios: [
      {
        title: "Pass",
        body: "Expand the next pod with the same core config and coaching agenda.",
      },
      {
        title: "Coach",
        body: "Hold seats steady; run hygiene huddles and manager practice.",
      },
      {
        title: "Simplify",
        body: "Remove unused stages/fields; rewrite the one-sentence loop.",
      },
    ],
  },
  {
    type: "step",
    id: "training-and-mistakes",
    stepNumber: 5,
    heading: "Link training to common failure modes",
    body: "Training that only demos navigation does not create adoption. Practice the mistakes you will actually see: empty next steps, dishonest stage jumps, duplicate creation, and dual-running sheets. Pair each mistake with a coaching response and an owner.\n\nExample: Northwind’s Day-30 workshop uses three real stuck jobs from last week. Reps update them live while the manager scores the board afterward — training and the mistakes guide become the same conversation.",
    tip: "If training materials do not mention your failure modes, rewrite them before the next cohort.",
    figure: {
      src: "/guides/crm-adoption-training.png",
      alt: "Link CRM training to failure modes: spot the pattern, role-based lab, live practice, refresh after drift, champion assist.",
      caption:
        "Labs tied to missed next-steps and stage lies change behavior — one webinar does not.",
    },
    scenarios: [
      {
        title: "Role-based labs",
        body: "Seller, manager, and admin paths — not one generic webinar.",
      },
      {
        title: "Refresh after drift",
        body: "When a gate fails, retrain the ritual on live records within one week.",
      },
      {
        title: "Champion assist",
        body: "Pilot champions run office hours using the mistakes checklist.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Adoption mistakes",
    items: [
      {
        title: "Celebrating login dashboards",
        body: "Activity without core-loop completion trains leadership to ignore the real risk.",
      },
      {
        title: "Expanding before managers change",
        body: "More seats amplify Slack coaching and sheet rebuilds.",
      },
      {
        title: "Training as a one-time webinar",
        body: "Without live-record practice and gate reviews, habits snap back.",
      },
      {
        title: "Adding fields to “drive adoption”",
        body: "Complexity usually reduces updates; simplify the loop first.",
      },
      {
        title: "No named gate owners",
        body: "Without R/A for 30/60/90, go-live dates drift into permanent dual-running.",
      },
      {
        title: "Ignoring change resistance",
        body: "Shadow sheets are a change-management signal — handle with the change guide, not more alerts.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM adoption?",
        answer:
          "Adoption means the team completes the core work loop in CRM and managers coach from CRM views. Logins alone are not adoption. Decision rule: if Friday status still depends on a side sheet or Slack archaeology, adoption is incomplete.",
      },
      {
        question: "How do we measure adoption without fake benchmarks?",
        answer:
          "Track leading signals you define for your team — open-item ownership, next-step fill, core-object usage, and whether reviews run from CRM. Set team targets and intervene when they miss for two consecutive weeks. Do not treat invented industry percentages as facts.",
      },
      {
        question: "What should a 30-day adoption gate include?",
        answer:
          "Core loop trained on live records, owners named, required owner + next-step fields in use, and a scheduled manager review that uses a CRM view. Pass only if dual-running is shrinking, not growing.",
      },
      {
        question: "We have high logins but low trust — what now?",
        answer:
          "Pause expansion, audit empty next steps and dishonest stages, force manager coaching from CRM, and retrain the ritual. See Implementation KPIs for intervention rules and Common CRM Mistakes for failure patterns.",
      },
      {
        question: "How does training connect to adoption?",
        answer:
          "Train the loop and the mistakes you will coach against. Role-based labs on live records beat feature tours. Refresh training whenever a 60/90 gate fails.",
      },
      {
        question: "What should I do next?",
        answer:
          "Write your one-sentence core loop, schedule the first CRM-native manager review, and set Day 30/60/90 gate owners. Use Implementation KPIs to pick signals, and Change Management if resistance shows up as shadow sheets.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading vs lagging signals and intervene rules.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "Stakeholders, resistance, communications.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Field ownership and change control.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Ongoing hygiene that sustains adoption.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training",
        description: "Role-based labs that stick the loop.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Failure modes to train against.",
      },
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation",
        description: "Pillar rollout path for gated expand.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt CRM",
        description: "Timing and pilot discipline.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Phases, tasks, and go-live checklist.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product fit is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Plan adoption into the rollout",
    body: "Use the Implementation Planner to put 30/60/90 gates, training, and manager reviews on the same plan as configuration — before you expand seats.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmAdoptionGuide: GuidePage = {
  id: "guide-crm-adoption",
  slug: "crm-adoption",
  title: "CRM Adoption Guide: Login ≠ Adoption",
  summary:
    "Drive CRM adoption with core-loop usage, manager coaching from the board, and 30/60/90 gates — not vanity login metrics.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "optimize",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-adoption-hero.png",
    alt: "CRM adoption hero: login chart contrasted with core-loop usage and manager coaching from the pipeline board, plus 30/60/90 gates.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-implementation-planner",
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
    contentId: "content:tool:crm-implementation-planner",
    label: "Open Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-implementation-kpis",
    "crm-change-management",
    "crm-governance",
    "crm-data-quality",
    "crm-training",
    "crm-implementation",
    "common-crm-mistakes",
    "when-to-adopt-crm",
  ],
  blocks: crmAdoptionBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "define-loop",
      label: "Define core loop + non-adoption signals",
      description: "Owner, stage, activity, next step — written.",
      order: 0,
    },
    {
      id: "manager-ritual",
      label: "Schedule CRM-native manager reviews",
      description: "No side sheet as the coaching surface.",
      order: 1,
    },
    {
      id: "gates",
      label: "Run 30/60/90 pass-or-intervene gates",
      description: "Expand only on evidence.",
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
    title: "CRM Adoption Guide: Login ≠ Adoption | SoftwareGlimpse",
    description:
      "Measure CRM adoption by core-loop usage and manager coaching — with 30/60/90 gates, training linked to mistakes, and no vanity login metrics.",
    canonicalPath: "/guides/crm-adoption/",
    indexable: true,
  },
};
