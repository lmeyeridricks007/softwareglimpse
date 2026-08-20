import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Reporting Best Practices — trustworthy Friday reviews (not vendor feature tours).
 * Template: softwareglimpse-guide-template-v1
 */
const crmReportingBestPracticesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Trustworthy CRM reporting is stage-honest pipeline, forecast hygiene, and a Friday review that starts from CRM views — not a dashboard gallery. Decision rule: if managers rebuild numbers in Sheets, stages jump without evidence, or forecast categories are theater, freeze new reports and fix ownership, stage definitions, and hygiene until two consecutive CRM-native Fridays need no side sheet.",
    bullets: [
      "Friday trust",
      "Stage honesty",
      "Forecast hygiene",
      "Few canonical views",
      "Freeze sprawl",
      "Not feature tours",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Reports follow process truth",
        body: "Pretty charts on dishonest stages teach leadership the wrong story.",
      },
      {
        label: "Friday is the test",
        body: "If the review needs a rebuild sheet, reporting is not trusted yet.",
      },
      {
        label: "Fewer canonical views win",
        body: "A small set of owned reports beats twenty orphan dashboards.",
      },
      {
        label: "Hygiene before vanity metrics",
        body: "Owner + next-step fill and stage honesty unlock forecast trust.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "reporting-trust-path",
    title: "Reporting trust path",
    steps: [
      { id: "define", label: "Define stages", short: "Exit criteria" },
      { id: "hygiene", label: "Hygiene first", short: "Owner + next step" },
      { id: "canonical", label: "Canonical views", short: "Owned reports" },
      { id: "friday", label: "Friday ritual", short: "CRM-native" },
      { id: "forecast", label: "Forecast hygiene", short: "Honest categories" },
    ],
    ctaHref: "/guides/crm-data-hygiene/",
    ctaLabel: "Data hygiene →",
    figure: {
      src: "/guides/crm-reporting-trust-path.png",
      alt: "Reporting trust path: define stages, hygiene first, canonical views, Friday CRM-native ritual, forecast hygiene.",
      caption:
        "Forecast trust sits on stage honesty and hygiene — dashboards alone cannot carry Friday.",
    },
  },
  {
    type: "figure",
    id: "friday-trust-diagram",
    title: "Friday review trust stack",
    src: "/guides/crm-reporting-best-practices-friday.png",
    alt: "Layered diagram for CRM reporting trust: stage exit criteria at the base, hygiene signals, canonical CRM views, Friday review ritual, and forecast categories at the top — with a blocked Sheet rebuild path.",
    caption:
      "Forecast trust sits on stage honesty and hygiene — dashboards alone cannot carry Friday.",
  },
  {
    type: "checklist",
    id: "reporting-trust-checklist",
    title: "Make Friday reports trustworthy",
    copyable: true,
    items: [
      {
        id: "stage-exits",
        label: "Write stage exit criteria",
        description: "What evidence moves a deal — no silent jumps.",
        order: 0,
      },
      {
        id: "canonical-set",
        label: "Name 3–5 canonical views",
        description: "Pipeline, stuck, forecast, coverage — each with an owner.",
        order: 1,
      },
      {
        id: "friday-agenda",
        label: "Publish Friday agenda from CRM",
        description: "Same filters every week; no side sheet as source of truth.",
        order: 2,
      },
      {
        id: "forecast-defs",
        label: "Define forecast categories",
        description: "Commit / best case / pipeline meanings in writing.",
        order: 3,
      },
      {
        id: "orphan-freeze",
        label: "Freeze orphan dashboard creation",
        description: "New reports require a decision question + owner.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "stage-honesty",
    stepNumber: 1,
    heading: "Start with stage honesty, not charts",
    body: "Reporting cannot fix vague stages. Write exit criteria for each stage (evidence required to advance or regress). Sample deals weekly for jumps without logged evidence. Until stage definitions are coachable, dashboards amplify fiction.\n\nExample: Northwind Estimators had seven stages but partners skipped three. Ops lead Priya collapsed to five stages with written exits and banned “update stage in the meeting without a logged next step.” Friday board debates shortened because the numbers meant something again.",
    tip: "If two managers disagree what “Proposal” means, fix definitions before building another funnel chart.",
    figure: {
      src: "/guides/crm-reporting-best-practices-hero.png",
      alt: "CRM reporting best practices hero: Friday pipeline review UI with stage-honesty callouts, forecast hygiene panel, and a crossed-out side spreadsheet rebuild.",
      caption:
        "Trustworthy reporting is a Friday ritual on honest stages — not a vendor dashboard tour.",
    },
    scenarios: [
      {
        title: "Stage theater",
        body: "Collapse unused stages; publish exits; coach jumps.",
      },
      {
        title: "Regress fear",
        body: "Allow honest regresses; punish silent fiction instead.",
      },
      {
        title: "Multi-pod drift",
        body: "One stage dictionary; pod leads share the same exits.",
      },
    ],
  },
  {
    type: "step",
    id: "hygiene-before-reports",
    stepNumber: 2,
    heading: "Fix hygiene before expanding reports",
    body: "Empty owners, missing next steps, and aged duplicates make every report negotiable. Run hygiene SLAs until open work is owned and dated. Pause new dashboard requests during intervene weeks.\n\nExample: Meridian Specialty Finance’s forecast looked optimistic because closed-lost never updated and next steps were blank. After two hygiene weeks (owner + next-step fill), the same canonical forecast view became usable — without adding widgets.",
    tip: "A new chart on dirty data is a second source of arguments, not a decision tool.",
    figure: {
      src: "/guides/crm-reporting-hygiene-first.png",
      alt: "Fix CRM hygiene before expanding reports: owners filled, next steps dated, dupes aged, pause new dashboards, then expand.",
      caption:
        "A new chart on dirty data is a second source of arguments — not a decision tool.",
    },
    scenarios: [
      {
        title: "Sheet Friday",
        body: "Hygiene + CRM-only agenda before any new report.",
      },
      {
        title: "Duplicate inflation",
        body: "Clear match/merge first; then recount pipeline.",
      },
      {
        title: "Automation spam",
        body: "Disable noisy tasks; restore update quality.",
      },
    ],
  },
  {
    type: "step",
    id: "canonical-views",
    stepNumber: 3,
    heading: "Publish a small set of canonical views",
    body: "Limit the official set: open pipeline by stage, stuck/no-next-step, forecast by category, and coverage/activity for coaching. Each view has an owner, a purpose sentence, and a refresh rule. Archive or unpublish orphan dashboards that nobody can explain.\n\nExample: Harborline Advisory keeps four saved views. Maya owns stuck deals; Ana owns forecast. Leadership stopped accepting screenshots from personal filters because they were not in the canonical set.",
    tip: "If you cannot name the decision a report supports, do not build it.",
    figure: {
      src: "/guides/crm-reporting-canonical-views.png",
      alt: "Publish a small set of canonical CRM views: pick 3–5, name owners, state the decision question, freeze orphans, reuse Friday filters.",
      caption:
        "Every new report needs a decision question and an owner — or it is decoration.",
    },
    scenarios: [
      {
        title: "Dashboard sprawl",
        body: "Inventory → keep 3–5 → archive the rest.",
      },
      {
        title: "Exec vanity set",
        body: "Map each exec question to one canonical view.",
      },
      {
        title: "Pod variants",
        body: "Same structure, filtered by pod — not divergent stage logic.",
      },
    ],
  },
  {
    type: "step",
    id: "friday-ritual",
    stepNumber: 4,
    heading: "Run Friday from CRM — no rebuild sheet",
    body: "The weekly review is the reporting product. Agenda: stuck items, empty next steps, stage changes needing evidence, and forecast movement. Managers prepare from canonical views before the meeting. Side sheets may be personal scratch pads — never the coaching source of truth.\n\nExample: Crestview Wealth’s Friday opens on Maya’s board filter. Partners who bring printed lists are asked to update CRM live. After three weeks the Sheet stops influencing forecast conversations.",
    tip: "Change the meeting rules and the reports follow. Changing charts alone rarely kills the Sheet.",
    figure: {
      src: "/guides/crm-reporting-friday-crm.png",
      alt: "Run Friday from CRM with no rebuild sheet: open board, canonical filters, coach live, update in CRM, ban side-sheet source of truth.",
      caption:
        "Change the meeting rules and the reports follow — charts alone rarely kill the Sheet.",
    },
    scenarios: [
      {
        title: "New manager",
        body: "Shadow one CRM-native Friday, then lead with the same agenda.",
      },
      {
        title: "Founder override",
        body: "Founder models CRM-only answers in exec reviews.",
      },
      {
        title: "Remote team",
        body: "Screen-share canonical views; ban pasted Sheet tables.",
      },
    ],
  },
  {
    type: "step",
    id: "forecast-hygiene",
    stepNumber: 5,
    heading: "Practice forecast hygiene",
    body: "Define commit, best case, and pipeline (or your categories) in writing. Require a dated next step and honest stage for anything in commit. Review category changes weekly as coaching moments — not as silent edits after the meeting.\n\nExample: Lakeside B2B required commit deals to have a next step within seven days and a manager-visible close plan note. Inflated commit shrank without inventing a dollar ROI story — just clearer category rules.",
    tip: "Forecast categories without definitions become political labels. Write them down.",
    figure: {
      src: "/guides/crm-reporting-forecast.png",
      alt: "Practice CRM forecast hygiene: define categories, evidence rules, sample honesty, coach fiction, lock definitions weekly.",
      caption:
        "Forecast categories without written meanings become negotiation — not a forecast.",
    },
    scenarios: [
      {
        title: "Sandbagging",
        body: "Coach evidence for category — do not punish honesty.",
      },
      {
        title: "Happy ears",
        body: "Pull commit when next step is missing; make the rule visible.",
      },
      {
        title: "Long cycles",
        body: "Add milestone exits; keep categories few and stable.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "trusted-vs-theater",
    title: "Trusted reporting vs dashboard theater",
    rows: [
      {
        feature: "Stage exit criteria written",
        mustHave: true,
        niceToHave: false,
        notes: "Trusted: yes. Theater: stages are labels only.",
      },
      {
        feature: "Friday starts in CRM",
        mustHave: true,
        niceToHave: false,
        notes: "Trusted: canonical views. Theater: Sheet rebuild.",
      },
      {
        feature: "Forecast categories defined",
        mustHave: true,
        niceToHave: false,
        notes: "Trusted: written meanings. Theater: vibes and politics.",
      },
      {
        feature: "Report owners named",
        mustHave: true,
        niceToHave: false,
        notes: "Trusted: 3–5 owned views. Theater: orphan dashboards.",
      },
      {
        feature: "Vendor feature tour completeness",
        mustHave: false,
        niceToHave: false,
        notes: "Irrelevant to Friday trust — skip as a success metric.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Reporting mistakes",
    items: [
      {
        title: "Building dashboards on dishonest stages",
        body: "You automate fiction and teach leadership the wrong story.",
      },
      {
        title: "Accepting Sheet Fridays",
        body: "Side sheets as coaching truth make CRM optional.",
      },
      {
        title: "Orphan dashboard sprawl",
        body: "Twenty unexplained charts destroy a single source of truth.",
      },
      {
        title: "Forecast theater",
        body: "Categories without definitions become political labels.",
      },
      {
        title: "Invented benchmark conversion rates",
        body: "Use your funnel samples — do not paste fake industry stats as facts.",
      },
      {
        title: "Reporting before hygiene",
        body: "Fix owners and next steps first; then expand views.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What makes a CRM report trustworthy?",
        answer:
          "Honest stages with exit criteria, owned canonical views, hygiene on open work, and a Friday ritual that starts in CRM. Decision rule: if you still rebuild in Sheets for coaching, trust is incomplete.",
      },
      {
        question: "How many dashboards should we have?",
        answer:
          "Usually three to five canonical views with named owners. More is fine only when each answers a written decision question. Archive orphans.",
      },
      {
        question: "How do we fix forecast distrust?",
        answer:
          "Define categories in writing, require next steps on commit, coach category changes weekly, and stop accepting off-CRM forecast tables.",
      },
      {
        question: "Should we buy a BI tool?",
        answer:
          "Not until CRM-native Friday trust works for the core loop. BI on dirty stages exports the same arguments to a prettier canvas.",
      },
      {
        question: "How does this differ from implementation KPIs?",
        answer:
          "Implementation KPIs cover leading/lagging rollout signals and intervene rules. This guide focuses on ongoing reporting trust: stage honesty, canonical views, Friday ritual, and forecast hygiene after go-live.",
      },
      {
        question: "What about activity dashboards?",
        answer:
          "Use them for coaching coverage gaps — not as adoption success. Prefer next-step and ownership signals over vanity login charts.",
      },
      {
        question: "What should I do next?",
        answer:
          "Write stage exits, name canonical views, publish a CRM-only Friday agenda, and align hygiene SLAs. Cross-read Data Hygiene, Improve Adoption, and Implementation KPIs; plan the ritual in the Implementation Planner.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Weekly ops that feed report trust.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Quality rules behind the numbers.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "When Friday fails because coaching stalled.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals and intervene rules.",
      },
      {
        href: "/guides/crm-automation-best-practices/",
        label: "Automation best practices",
        description: "Automate after reporting trust exists.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Change control for fields that break reports.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Core loop that reporting depends on.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule Friday rituals and hygiene gates.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if reporting must-haves are plan-gated.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Plan reporting trust into the week",
    body: "Use the Implementation Planner to put stage-definition work, hygiene SLAs, and CRM-native Friday reviews on the same calendar — before you add more dashboards.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmReportingBestPracticesGuide: GuidePage = {
  id: "guide-crm-reporting-best-practices",
  slug: "crm-reporting-best-practices",
  title: "CRM Reporting Best Practices: Trustworthy Friday Reviews",
  summary:
    "Build CRM reporting trust with stage honesty, forecast hygiene, and canonical Friday views — not dashboard theater or vendor feature tours.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "strategy",
  heroVisual: {
    src: "/guides/crm-reporting-best-practices-hero.png",
    alt: "CRM reporting best practices hero: Friday pipeline review UI with stage-honesty callouts, forecast hygiene panel, and a crossed-out side spreadsheet rebuild.",
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
    "crm-data-hygiene",
    "crm-data-quality",
    "improve-crm-adoption",
    "crm-implementation-kpis",
    "crm-automation-best-practices",
    "crm-governance",
    "crm-adoption",
  ],
  blocks: crmReportingBestPracticesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "stage-exits",
      label: "Write stage exit criteria",
      description: "Coachable definitions before new charts.",
      order: 0,
    },
    {
      id: "canonical-friday",
      label: "Publish canonical views + CRM-only Friday",
      description: "3–5 owned reports; no side sheet as truth.",
      order: 1,
    },
    {
      id: "forecast-defs",
      label: "Define forecast categories + hygiene rules",
      description: "Commit requires next step and honest stage.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T10:00:00.000Z",
    publishedAt: "2026-08-14T10:00:00.000Z",
    reviewedAt: "2026-08-14T10:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Reporting Best Practices: Friday Trust | SoftwareGlimpse",
    description:
      "CRM reporting best practices for stage honesty, forecast hygiene, canonical views, and CRM-native Friday reviews — without dashboard theater.",
    canonicalPath: "/guides/crm-reporting-best-practices/",
    indexable: true,
  },
};
