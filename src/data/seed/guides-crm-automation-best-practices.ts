import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Automation Best Practices — when to automate vs not; trigger discipline after hygiene.
 * Template: softwareglimpse-guide-template-v1
 */
const crmAutomationBestPracticesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM automation pays off only after hygiene and stage honesty are trusted — and only for repeatable decisions with clear owners. Decision rule: automate when a trigger is unambiguous, the action reduces real toil, and failure is visible; do not automate reminders that create task spam, stage moves without evidence, or workflows on dirty queues. If Friday trust or next-step fill is failing, pause new automations first.",
    bullets: [
      "Hygiene first",
      "Clear triggers",
      "Avoid task spam",
      "Visible failure",
      "Owner per flow",
      "Pause if dirty",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Automation amplifies process",
        body: "Dirty data and dishonest stages become noisy tasks and false moves at scale.",
      },
      {
        label: "Not every click deserves a workflow",
        body: "If a human judgment is required, keep the step manual and coachable.",
      },
      {
        label: "One owner per automation",
        body: "Orphan flows become silent debt nobody dares to edit.",
      },
      {
        label: "Kill criteria matter",
        body: "Every automation needs a retire rule when it creates spam or distrust.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "automate-or-not",
    title: "Automate or not",
    steps: [
      { id: "trust", label: "Trust check", short: "Hygiene OK?" },
      { id: "trigger", label: "Trigger clarity", short: "Unambiguous?" },
      { id: "value", label: "Toil test", short: "Real savings?" },
      { id: "owner", label: "Name owner", short: "R/A + kill rule" },
      { id: "ship", label: "Ship small", short: "Monitor spam" },
    ],
    ctaHref: "/guides/crm-data-hygiene/",
    ctaLabel: "Data hygiene →",
    figure: {
      src: "/guides/crm-automation-or-not.png",
      alt: "Automate or not path: hygiene trust, trigger clarity, toil test, name owner with kill rule, then ship small.",
      caption:
        "Trust and trigger clarity before the workflow builder — then owner, kill rule, and a small ship.",
    },
  },
  {
    type: "figure",
    id: "automate-decision-map",
    title: "When to automate vs keep manual",
    src: "/guides/crm-automation-best-practices-decision.png",
    alt: "Decision tree for CRM automation: hygiene trust gate, trigger clarity, toil value, then ship with owner — or keep manual / pause paths for judgment calls and dirty queues.",
    caption:
      "Hygiene trust is the first gate — workflow builders come after, not before.",
  },
  {
    type: "checklist",
    id: "automation-gate-checklist",
    title: "Automation go / no-go checklist",
    copyable: true,
    items: [
      {
        id: "hygiene-green",
        label: "Confirm two green hygiene weeks",
        description: "Owners, next steps, and duplicate age meet team SLAs.",
        order: 0,
      },
      {
        id: "trigger-written",
        label: "Write the trigger in one sentence",
        description: "If you need “sometimes,” keep it manual.",
        order: 1,
      },
      {
        id: "action-scoped",
        label: "Scope a single action",
        description: "One clear outcome — not a multi-branch novel.",
        order: 2,
      },
      {
        id: "owner-kill",
        label: "Name owner + kill criteria",
        description: "Who maintains it; when spam or errors force retire.",
        order: 3,
      },
      {
        id: "pilot-monitor",
        label: "Pilot on one pod and monitor",
        description: "Watch task volume and false positives for two weeks.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "hygiene-gate",
    stepNumber: 1,
    heading: "Pass the hygiene gate before you automate",
    body: "Automations on empty next steps, missing owners, or aged duplicates create task spam and false stage moves. Require team hygiene SLAs to hold for two consecutive weeks before enabling new workflows. Pause existing noisy automations during intervene weeks.\n\nExample: Meridian Specialty Finance disabled three “nudge” workflows after Friday still needed a Sheet. Ops lead Ana restored owner + next-step fill for two weeks, then reintroduced a single assignment rule with a clear trigger. Task volume dropped and trust returned.",
    tip: "If you are automating to paper over missing updates, you are encoding the stall — fix coaching and hygiene first.",
    figure: {
      src: "/guides/crm-automation-best-practices-hero.png",
      alt: "CRM automation best practices hero: workflow builder with hygiene trust gate open, clear trigger panel, and a blocked task-spam path labeled pause.",
      caption:
        "Good automation starts with a trust gate — not a blank workflow canvas.",
    },
    scenarios: [
      {
        title: "Dirty queue",
        body: "Pause flows; run hygiene ritual; retry later.",
      },
      {
        title: "Adoption stall",
        body: "Restart coaching before any new automation.",
      },
      {
        title: "Import spike",
        body: "Hold workflows until match/merge catches up.",
      },
    ],
  },
  {
    type: "step",
    id: "when-to-automate",
    stepNumber: 2,
    heading: "Automate unambiguous, high-toil steps",
    body: "Good candidates: assign owner on create from a clear routing rule, create a follow-up task when a dated next step expires, notify a manager when a deal sits idle past a team-defined window, or stamp a field when a stage exit checklist is complete. Bad candidates: auto-advancing stages on email opens, mass reminder tasks without context, or “AI” field fills nobody reviews.\n\nExample: Harborline Advisory automated only “if new inbound form + region = West → assign Jordan.” They kept stage moves manual. False assignments were visible and fixable; stage theater never got encoded.",
    tip: "Write the trigger as a sentence a new hire would understand. Ambiguity means keep it manual.",
    figure: {
      src: "/guides/crm-automation-high-toil.png",
      alt: "Automate unambiguous high-toil CRM steps: routing, idle alerts, and checklist stamps — keep judgment calls manual.",
      caption:
        "High-toil and unambiguous wins — judgment calls and stage theater stay manual.",
    },
    scenarios: [
      {
        title: "Routing",
        body: "Clear territory/product rules → automate assignment.",
      },
      {
        title: "Idle alerts",
        body: "Team-defined idle window → manager notify, not auto-close.",
      },
      {
        title: "Judgment calls",
        body: "Discount approval, stage exit evidence → stay manual.",
      },
    ],
  },
  {
    type: "step",
    id: "avoid-task-spam",
    stepNumber: 3,
    heading: "Design against task spam",
    body: "Task spam kills adoption. Cap concurrent open automated tasks per person, suppress duplicates when a next step already exists, and prefer updating an existing activity over creating a new one. Review automation-created task volume weekly in the hygiene or ops huddle.\n\nExample: Crestview Wealth’s “daily reminder if no activity” flooded partners with dozens of identical tasks. Maya replaced it with a single stuck-deal view and a Monday coaching list. Completion rates on real next steps rose because noise fell.",
    tip: "If people dismiss automation tasks without reading them, the automation has already failed — retire it.",
    figure: {
      src: "/guides/crm-automation-task-spam.png",
      alt: "Design against CRM task spam: cap open tasks, suppress duplicates, update in place, review weekly volume, retire noise.",
      caption:
        "Dismissed-unread automation tasks mean the flow already failed — retire it.",
    },
    scenarios: [
      {
        title: "Reminder storms",
        body: "Retire; coach from a stuck view instead.",
      },
      {
        title: "Duplicate creates",
        body: "Add suppression when open task/next step exists.",
      },
      {
        title: "Multi-flow overlap",
        body: "Inventory flows; one action per trigger family.",
      },
    ],
  },
  {
    type: "step",
    id: "trigger-discipline",
    stepNumber: 4,
    heading: "Enforce trigger discipline and ownership",
    body: "Every automation needs: trigger sentence, objects in scope, action, owner, last reviewed date, and kill criteria. Prefer fewer flows with clear names over a web of undocumented branches. Change control belongs with governance — no self-serve production edits without a peer check.\n\nExample: Lakeside B2B keeps an automation register in the same place as field ownership. Jordan owns “Inbound West assign.” Kill criteria: more than a team-defined false-assign count in two weeks, or hygiene intervene weeks. Two flows were retired in one quarter without drama.",
    tip: "An automation without an owner is debt. Assign R/A before it goes live.",
    figure: {
      src: "/guides/crm-automation-trigger-owner.png",
      alt: "CRM automation trigger discipline: one-sentence trigger, scoped objects, named owner, kill criteria, peer-reviewed changes.",
      caption:
        "Trigger sentence, owner, and kill criteria before production — orphan flows are debt.",
    },
    scenarios: [
      {
        title: "Orphan flows",
        body: "Inventory → assign owners or disable.",
      },
      {
        title: "Silent edits",
        body: "Require change notes + peer review for production.",
      },
      {
        title: "Vendor template packs",
        body: "Enable only what passes the go/no-go checklist.",
      },
    ],
  },
  {
    type: "step",
    id: "monitor-and-retire",
    stepNumber: 5,
    heading: "Monitor, then retire without guilt",
    body: "Ship small, watch false positives and task volume for two weeks, then keep or kill. Tie automation health to Friday trust and hygiene intervene rules. Retiring a noisy flow is a win — not a failure of ambition.\n\nExample: Northwind Estimators piloted an idle-deal notify on six sellers. Week one looked fine; week two showed alerts on deals that already had dated next steps. They added suppression, then kept the flow. A second “auto-stage on quote send” pilot was retired after stage honesty complaints.",
    tip: "Schedule a quarterly automation review the same way you review fields — unused flows accumulate risk.",
    figure: {
      src: "/guides/crm-automation-monitor-retire.png",
      alt: "Monitor CRM automation then retire: pilot one pod, watch false positives, keep or kill, document next review, pause on hygiene intervene.",
      caption:
        "Ship small, watch two weeks, then keep or kill — retiring noise is a win.",
    },
    scenarios: [
      {
        title: "Healthy flow",
        body: "Keep; document; set next review date.",
      },
      {
        title: "Noisy flow",
        body: "Tighten trigger or retire; tell the team why.",
      },
      {
        title: "Hygiene intervene",
        body: "Pause nonessential automations until two green weeks.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "automate-matrix",
    title: "Automate vs keep manual",
    rows: [
      {
        feature: "Territory / inbound assignment with clear rules",
        mustHave: true,
        niceToHave: false,
        notes: "Strong automate candidate after hygiene trust.",
      },
      {
        feature: "Idle / stuck notify to manager",
        mustHave: true,
        niceToHave: false,
        notes: "Automate alert; keep close/stage judgment manual.",
      },
      {
        feature: "Stage advance on weak signals (opens, clicks)",
        mustHave: false,
        niceToHave: false,
        notes: "Keep manual — encodes dishonest stages.",
      },
      {
        feature: "Daily generic reminder tasks",
        mustHave: false,
        niceToHave: false,
        notes: "Usually spam — prefer stuck views + coaching.",
      },
      {
        feature: "Field stamp after completed checklist",
        mustHave: true,
        niceToHave: false,
        notes: "Automate when checklist exit is unambiguous.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Automation mistakes",
    items: [
      {
        title: "Automating before hygiene trust",
        body: "You scale junk tasks and false stage moves.",
      },
      {
        title: "Task spam as “engagement”",
        body: "Dismissed tasks train people to ignore the CRM.",
      },
      {
        title: "Auto-advancing stages",
        body: "Without evidence rules, reporting becomes theater.",
      },
      {
        title: "Orphan workflows",
        body: "Nobody owns fixes; debt compounds until an outage.",
      },
      {
        title: "Template pack enable-all",
        body: "Vendor recipes still need your go/no-go checklist.",
      },
      {
        title: "No kill criteria",
        body: "Noisy flows live forever because “someone might use it.”",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "When should we automate CRM work?",
        answer:
          "After hygiene and stage honesty are trusted, and only when the trigger is unambiguous and the action cuts real toil. Decision rule: if you need judgment or “sometimes,” keep it manual and coachable.",
      },
      {
        question: "Why do automations create so many tasks?",
        answer:
          "Usually overlapping flows, missing suppression when a next step exists, or reminders used as a substitute for coaching. Cap volume, suppress duplicates, and retire noisy flows.",
      },
      {
        question: "Should stage changes be automated?",
        answer:
          "Rarely. Prefer manual stage moves with written exit criteria. Automate supporting stamps or tasks after a checklist completes — not silent advances on weak signals.",
      },
      {
        question: "What if leadership wants automation to force adoption?",
        answer:
          "Automation cannot replace manager coaching. Restart adoption and hygiene first (see Improve CRM Adoption). Workflows on a stalled loop create spam, not habits.",
      },
      {
        question: "How do we govern automations?",
        answer:
          "Register each flow with owner, trigger, kill criteria, and review date. Pair with field governance so silent edits do not break Friday reports.",
      },
      {
        question: "When should we pause automations?",
        answer:
          "During hygiene intervene weeks, after go-live stall diagnosis, during import spikes, or when task spam / false positives exceed kill criteria.",
      },
      {
        question: "What should I do next?",
        answer:
          "Inventory live flows, pause noisy ones, confirm two green hygiene weeks, then ship one clear automation with an owner. Cross-read Data Hygiene, Reporting Best Practices, and Governance; schedule reviews in the Implementation Planner.",
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
        description: "Trust gate before automation.",
      },
      {
        href: "/guides/crm-reporting-best-practices/",
        label: "Reporting best practices",
        description: "Stage honesty automations must not break.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "Do not automate a stalled coaching loop.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Change control for flows and fields.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Quality rules automation depends on.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Intervene rules that pause automation.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training",
        description: "Teach the manual loop before workflows.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule hygiene gates and automation reviews.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if automation must-haves are plan-gated.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Plan automation after hygiene",
    body: "Use the Implementation Planner to sequence hygiene SLAs, Friday trust, and a small automation pilot with owners and kill criteria — before you enable a template pack.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmAutomationBestPracticesGuide: GuidePage = {
  id: "guide-crm-automation-best-practices",
  slug: "crm-automation-best-practices",
  title: "CRM Automation Best Practices: Automate After Trust",
  summary:
    "Decide when to automate CRM work — hygiene gates, clear triggers, anti-spam design, owners, and kill criteria — so workflows do not amplify dirty data.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "strategy",
  heroVisual: {
    src: "/guides/crm-automation-best-practices-hero.png",
    alt: "CRM automation best practices hero: workflow builder with hygiene trust gate open, clear trigger panel, and a blocked task-spam path labeled pause.",
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
    "crm-reporting-best-practices",
    "improve-crm-adoption",
    "crm-governance",
    "crm-data-quality",
    "crm-implementation-kpis",
    "crm-training",
  ],
  blocks: crmAutomationBestPracticesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "hygiene-gate",
      label: "Confirm hygiene trust before new flows",
      description: "Two green weeks; pause noisy automations if not.",
      order: 0,
    },
    {
      id: "trigger-owner",
      label: "Write trigger + name owner + kill criteria",
      description: "One action per flow; register it.",
      order: 1,
    },
    {
      id: "pilot-monitor",
      label: "Pilot one pod and monitor task spam",
      description: "Keep, tighten, or retire after two weeks.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T11:00:00.000Z",
    publishedAt: "2026-08-14T11:00:00.000Z",
    reviewedAt: "2026-08-14T11:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Automation Best Practices: Automate After Trust | SoftwareGlimpse",
    description:
      "CRM automation best practices: hygiene gates, clear triggers, avoid task spam, owners and kill criteria — automate only after data trust.",
    canonicalPath: "/guides/crm-automation-best-practices/",
    indexable: true,
  },
};
