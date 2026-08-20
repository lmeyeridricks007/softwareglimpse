import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Improve CRM Adoption — post-go-live stalled adoption recovery (≠ /guides/crm-adoption/).
 * Template: softwareglimpse-guide-template-v1
 */
const improveCrmAdoptionBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Post-go-live CRM adoption stalls when the core loop, manager coaching, or Friday review drifts after launch — not when seats fail to log in. Decision rule: diagnose stall signals first (side sheets, empty next steps, Slack-only coaching), pause expansion and new automation, then run a 30/60/90 restart with manager coaching loops until two consecutive CRM-native reviews pass.",
    bullets: [
      "Diagnose stall",
      "Pause expand",
      "Coach loops",
      "30/60/90 restart",
      "Not login KPIs",
      "Fix before add",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Stalled ≠ never adopted",
        body: "Many teams passed go-live and then drifted — recovery is a restart, not a second buy.",
      },
      {
        label: "Managers restart adoption",
        body: "Coaching loops from CRM views beat reminder emails and login dashboards.",
      },
      {
        label: "30/60/90 works after launch too",
        body: "Treat recovery as a new gated cycle with freeze rules and exit criteria.",
      },
      {
        label: "Implementation playbook still applies",
        body: "Use /guides/crm-adoption/ for loop design; this guide is for diagnosing and restarting after drift.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "recovery-path",
    title: "Stalled-adoption recovery path",
    steps: [
      { id: "diagnose", label: "Diagnose stall", short: "Signals + root" },
      { id: "freeze", label: "Freeze sprawl", short: "No new fields" },
      { id: "coach", label: "Coach loops", short: "Manager ritual" },
      { id: "restart", label: "30/60/90 restart", short: "Pass or intervene" },
      { id: "expand", label: "Re-expand", short: "Only on evidence" },
    ],
    ctaHref: "/guides/crm-adoption/",
    ctaLabel: "Adoption fundamentals →",
    figure: {
      src: "/guides/improve-crm-adoption-recovery-path.png",
      alt: "Stalled CRM adoption recovery path: diagnose, freeze sprawl, coach, 30/60/90 restart, re-expand on evidence.",
      caption:
        "Each stall signal maps to a recovery play — not more seats or more fields.",
    },
  },
  {
    type: "figure",
    id: "stall-recovery-map",
    title: "Stall signals → recovery plays",
    src: "/guides/improve-crm-adoption-stall-map.png",
    alt: "Four-panel diagram mapping CRM adoption stall signals to recovery plays: side sheets, empty next steps, Slack coaching, and dishonest stages each linked to a named restart action.",
    caption:
      "Each stall signal maps to a recovery play — not a feature request or more seats.",
  },
  {
    type: "checklist",
    id: "stall-diagnosis-checklist",
    title: "Diagnose stalled adoption in one hour",
    copyable: true,
    items: [
      {
        id: "friday-surface",
        label: "Name the Friday review surface",
        description: "CRM board, Sheet, Slack thread, or mix — write what actually happens.",
        order: 0,
      },
      {
        id: "next-step-sample",
        label: "Sample open work for next steps",
        description: "Pull 20 open deals/jobs; count empty or stale next-step dates.",
        order: 1,
      },
      {
        id: "coach-channel",
        label: "Map where managers coach",
        description: "CRM view, 1:1 notes, chat, or hallway — list the real channel.",
        order: 2,
      },
      {
        id: "dual-run",
        label: "List dual-running artifacts",
        description: "Sheets, personal trackers, email folders used as pipeline.",
        order: 3,
      },
      {
        id: "root-label",
        label: "Label the primary root",
        description: "Process, coaching, field sprawl, training decay, or product fit — pick one primary.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "diagnose-stall",
    stepNumber: 1,
    heading: "Diagnose the stall — do not celebrate logins",
    body: "After go-live, teams often look “active” while the system of record quietly loses authority. Separate seat activity from stall signals: Friday rebuilds outside CRM, empty or stale next steps on open work, managers accepting verbal updates, dishonest stage jumps, and dual-running Sheets that still drive coaching.\n\nExample: Meridian Field Ops went live nine months ago. Ops lead Priya saw healthy weekly logins, but partners still rebuilt a household coverage Sheet every Monday. A twenty-deal sample showed fourteen without dated next steps. Priya labeled the stall as coaching + ritual decay — not “people hate the product” — and froze new custom fields before any recovery sprint.",
    tip: "If leadership only asks for login charts, reframe the conversation with stall signals before you propose more seats or apps.",
    figure: {
      src: "/guides/improve-crm-adoption-hero.png",
      alt: "Improve CRM adoption hero: post-go-live dashboard contrasting healthy login chart with stall signals and a 30/60/90 recovery restart timeline.",
      caption:
        "Logins can stay green while adoption stalls — recovery starts with stall diagnosis.",
    },
    scenarios: [
      {
        title: "High login, Sheet Friday",
        body: "Ritual decay — restart manager reviews from CRM only.",
      },
      {
        title: "Low update, high Slack coaching",
        body: "Manager bypass — change coaching channel before training more UI.",
      },
      {
        title: "Honest use, wrong product",
        body: "Must-have gap after honest recovery — reopen evaluation, do not fake adoption.",
      },
    ],
  },
  {
    type: "step",
    id: "freeze-and-simplify",
    stepNumber: 2,
    heading: "Freeze sprawl and simplify the loop",
    body: "Stalled teams often try to “fix adoption” by adding stages, fields, and marketplace apps. That usually deepens dual-running. Freeze new fields and automations for the restart window. Rewrite the one-sentence core loop (own → update → honest stage → dated next step) and remove unused layout clutter that blocks weekly updates.\n\nExample: Harborline Advisory paused three pending automation requests and cut six unused opportunity fields. Sellers practiced the shortened loop on live stuck deals in a ninety-minute lab. Empty next-step counts dropped before any new feature shipped.",
    tip: "A field without a coaching response for empties is recovery debt — delete or defer it.",
    figure: {
      src: "/guides/improve-crm-adoption-freeze-loop.png",
      alt: "Freeze CRM sprawl and simplify the loop: freeze fields, cut stages, restore core loop, mute noisy automation, prove two clean Fridays.",
      caption:
        "Freeze before you “improve” — restore the minimum trusted loop first.",
    },
    scenarios: [
      {
        title: "Field sprawl stall",
        body: "Cut unused fields; keep owner + next step mandatory.",
      },
      {
        title: "Automation noise",
        body: "Disable noisy tasks; restore hygiene trust first.",
      },
      {
        title: "Too many stages",
        body: "Collapse dishonest stages; redefine exit criteria per stage.",
      },
    ],
  },
  {
    type: "step",
    id: "manager-coaching-loops",
    stepNumber: 3,
    heading: "Install manager coaching loops",
    body: "Recovery fails when managers keep coaching from Slack or personal notes. Publish one coaching agenda: stuck items, empty next steps, stage jumps without evidence, and coverage gaps. Managers prepare from a saved CRM view before the meeting. Refuse status that is not on the board.\n\nExample: Crestview Wealth’s practice lead Maya runs a fifteen-minute Monday huddle from a filtered board only. After two weeks, partners stop bringing printed lists because they no longer change coaching outcomes. Ops tracks empty next steps as the leading recovery signal — not seat logins.",
    tip: "Manager behavior is the enforcement mechanism. Reminder emails without coaching change rarely restart adoption.",
    figure: {
      src: "/guides/improve-crm-adoption-coach-loops.png",
      alt: "Install manager coaching loops: publish agenda, prepare from CRM views, board-native meeting, update live, ban side-sheet answers.",
      caption:
        "Manager behavior is enforcement — tooling alone will not restart adoption.",
    },
    scenarios: [
      {
        title: "New manager mid-stall",
        body: "Shadow one CRM-native review, then lead with the same agenda.",
      },
      {
        title: "Founder-led bypass",
        body: "Founder models the rule: no Slack-only pipeline answers in exec reviews.",
      },
      {
        title: "Multi-pod drift",
        body: "Same agenda template per pod; ops audits empty next steps weekly.",
      },
    ],
  },
  {
    type: "step",
    id: "restart-306090",
    stepNumber: 4,
    heading: "Run a 30 / 60 / 90 restart",
    body: "Treat recovery like a fresh gated cycle. Day 30: stall diagnosed, freeze in place, core loop retrained on live records, coaching agenda live. Day 60: two consecutive CRM-native Friday/Monday reviews; next-step fill and open-item ownership meet team-defined targets; side sheets retired from coaching. Day 90: re-expand seats or segments only if gates passed — otherwise intervene (simplify, retrain, or reset ownership).\n\nExample: Northwind Estimators failed a soft Day 60 because Friday still opened with a Sheet. They held seats steady, cut two more unused stages, and retrained the board ritual for three weeks before retrying the gate — then expanded the second pod.",
    tip: "Missing a restart gate is information. Adding configuration to “catch up” usually extends the stall.",
    figure: {
      src: "/guides/improve-crm-adoption-restart-gates.png",
      alt: "30/60/90 CRM adoption restart gates: restore loop, managers coach, pass or intervene, trusted Fridays, re-expand only on pass.",
      caption:
        "Missing a restart gate is information — not a reason to add configuration.",
    },
    scenarios: [
      {
        title: "Pass",
        body: "Re-expand with the same simplified config and coaching agenda.",
      },
      {
        title: "Coach",
        body: "Hold seats; intensify hygiene huddles and manager practice.",
      },
      {
        title: "Simplify again",
        body: "Remove more stages/fields; rewrite the one-sentence loop.",
      },
    ],
  },
  {
    type: "step",
    id: "link-training-kpis",
    stepNumber: 5,
    heading: "Link retraining to KPIs and failure modes",
    body: "Feature tours do not restart stalled adoption. Retrain the loop and the mistakes you will coach against: empty next steps, dishonest stages, duplicate creation, and dual-running Sheets. Pair each failure with a coaching response. Use implementation KPI intervene rules so leadership sees leading signals, not vanity activity.\n\nExample: Meridian’s Day-30 restart lab uses three real stuck jobs from last week. Reps update them live while Maya scores the board afterward — training, mistakes, and the recovery gate become one conversation.",
    tip: "If restart training materials never mention your stall signals, rewrite them before the next cohort.",
    figure: {
      src: "/guides/improve-crm-adoption-retrain.png",
      alt: "Link CRM retraining to KPIs and failure modes: name metric, real failure, role lab, fix live records, refresh after gate fail.",
      caption:
        "Retrain on empty next-steps and stage lies — not another vendor feature tour.",
    },
    scenarios: [
      {
        title: "Role-based refresh",
        body: "Seller, manager, admin paths — not one generic webinar.",
      },
      {
        title: "Gate-fail refresh",
        body: "Retrain the ritual on live records within one week of a miss.",
      },
      {
        title: "Champion office hours",
        body: "Pilot champions run hours using the stall checklist.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "stall-vs-healthy",
    title: "Stalled vs recovering signals",
    figure: {
      src: "/guides/improve-crm-adoption-stalled-vs-recovering.png",
      alt: "Stalled vs recovering CRM adoption signals: review surface, next steps, coaching channel, frozen complexity, trust over login vanity.",
      caption:
        "Recovering teams coach from CRM and freeze complexity — stalled teams accept Sheets and Slack updates.",
    },
    rows: [
      {
        feature: "Friday / weekly review surface",
        mustHave: true,
        niceToHave: false,
        notes: "Recovering: CRM board. Stalled: Sheet or Slack archaeology.",
      },
      {
        feature: "Open work next-step dates",
        mustHave: true,
        niceToHave: false,
        notes: "Recovering: filled and dated. Stalled: empty or stale majority.",
      },
      {
        feature: "Manager coaching channel",
        mustHave: true,
        niceToHave: false,
        notes: "Recovering: saved CRM views. Stalled: chat-only updates accepted.",
      },
      {
        feature: "New fields / automations during restart",
        mustHave: false,
        niceToHave: false,
        notes: "Recovering: frozen. Stalled: still adding complexity to “fix” usage.",
      },
      {
        feature: "Login / seat activity dashboards",
        mustHave: false,
        niceToHave: false,
        notes: "Useful as access proof only — never the recovery success metric.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Recovery mistakes",
    items: [
      {
        title: "Treating stall as a buying problem",
        body: "Switching vendors without an honest recovery pass usually moves the Sheet to a new UI.",
      },
      {
        title: "Celebrating login recovery",
        body: "Activity without core-loop completion trains leadership to ignore the real risk.",
      },
      {
        title: "Expanding seats mid-stall",
        body: "More seats amplify Slack coaching and dual-running.",
      },
      {
        title: "Adding fields to drive usage",
        body: "Complexity usually reduces updates; simplify the loop first.",
      },
      {
        title: "Skipping manager behavior change",
        body: "Without CRM-native coaching, reminder campaigns fail.",
      },
      {
        title: "No restart gate owners",
        body: "Without R/A for 30/60/90, recovery drifts into permanent dual-running.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How is this different from the CRM Adoption Guide?",
        answer:
          "The Adoption Guide defines the loop, coaching ritual, and first 30/60/90 rollout. This guide is for teams already live who stalled: diagnose drift, freeze sprawl, restart coaching loops, and re-gate expand. Use both — fundamentals first, then recovery plays.",
      },
      {
        question: "How do we know adoption is stalled?",
        answer:
          "Look for side-sheet Fridays, empty/stale next steps on open work, managers accepting Slack-only updates, and dishonest stages. Decision rule: if reviews do not start from a CRM view, adoption is incomplete regardless of login charts.",
      },
      {
        question: "Should we switch CRMs if adoption stalled?",
        answer:
          "Not until you run an honest recovery pass (freeze, simplify, coach, restart gates). Reopen evaluation only if must-haves remain structurally missing after that pass — do not blame the product for coaching bypass.",
      },
      {
        question: "What belongs in a 30-day restart gate?",
        answer:
          "Stall diagnosis written, freeze on new fields/automations, core loop retrained on live records, and a scheduled manager review that uses a CRM view. Pass only if dual-running is shrinking.",
      },
      {
        question: "How do managers restart adoption without nagging?",
        answer:
          "Change the coaching channel: prepare from saved CRM views, refuse off-board status, and coach empty next steps and stuck stages. Pair with role-based labs — not generic reminder emails.",
      },
      {
        question: "What metrics should leadership see?",
        answer:
          "Team-defined leading signals: open-item ownership, next-step fill, CRM-native review adherence. Avoid invented industry adoption percentages. See Implementation KPIs for intervene rules.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the stall diagnosis checklist, schedule the first CRM-only coaching review, and set Day 30/60/90 restart owners. Cross-read CRM Adoption, Training, and Implementation KPIs; use the Implementation Planner to put gates on a calendar.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Core loop, coaching, first 30/60/90.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals and intervene rules.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training",
        description: "Role-based labs for restart cohorts.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "Resistance and shadow-sheet handling.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene that sustains recovered adoption.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Ongoing operating rhythm post-recovery.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Failure modes to coach against.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Put restart gates on the plan.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist only after honest recovery fails on fit.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Put the restart on a plan",
    body: "Use the Implementation Planner to schedule freeze rules, manager coaching reviews, and 30/60/90 restart gates — before you re-expand seats or add automation.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const improveCrmAdoptionGuide: GuidePage = {
  id: "guide-improve-crm-adoption",
  slug: "improve-crm-adoption",
  title: "Improve CRM Adoption: Restart After Go-Live Stall",
  summary:
    "Diagnose stalled CRM adoption after launch, install manager coaching loops, and run a 30/60/90 restart — without mistaking logins for recovery.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "strategy",
  heroVisual: {
    src: "/guides/improve-crm-adoption-hero.png",
    alt: "Improve CRM adoption hero: post-go-live dashboard contrasting healthy login chart with stall signals and a 30/60/90 recovery restart timeline.",
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
    "crm-adoption",
    "crm-implementation-kpis",
    "crm-training",
    "crm-change-management",
    "crm-data-quality",
    "crm-data-hygiene",
    "common-crm-mistakes",
  ],
  blocks: improveCrmAdoptionBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "diagnose-stall",
      label: "Diagnose stall signals + primary root",
      description: "Friday surface, next steps, coaching channel, dual-run list.",
      order: 0,
    },
    {
      id: "freeze-coach",
      label: "Freeze sprawl + install CRM coaching loops",
      description: "No new fields/automations; managers review from CRM views.",
      order: 1,
    },
    {
      id: "restart-gates",
      label: "Run 30/60/90 restart gates",
      description: "Re-expand only on evidence.",
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
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Improve CRM Adoption: Restart After Go-Live Stall | SoftwareGlimpse",
    description:
      "Recover stalled CRM adoption after launch: diagnose stall signals, freeze sprawl, install manager coaching loops, and run a 30/60/90 restart.",
    canonicalPath: "/guides/improve-crm-adoption/",
    indexable: true,
  },
};
