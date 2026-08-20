import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Audit Guide — structured audit of config, data, adoption, security access.
 * Template: softwareglimpse-guide-template-v1
 * topicType: strategy (implementation-shaped teaching blocks)
 * Note: qualitative findings only — no invented industry benchmark %.
 */
const crmAuditBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A CRM audit is a time-boxed review of configuration, data hygiene, adoption behavior, and security access that produces written findings and a ranked remediation backlog — not a vanity dashboard screenshot. Decision rule: if you cannot name evidence, severity, owner, and re-check date for each finding, you are still exploring — do not claim the system is “fine” or jump to replace.",
    bullets: [
      "Four audit lanes",
      "Evidence-backed findings",
      "Remediation backlog",
      "Owners + re-check",
      "Fix before replace",
      "No fake benchmarks",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Audit produces a backlog, not a vibe",
        body: "Findings without owners and dates become slideware.",
      },
      {
        label: "Four lanes prevent blind spots",
        body: "Config, data, adoption, and access each fail differently.",
      },
      {
        label: "Severity ranks the work",
        body: "Security and trust blockers beat cosmetic field tidy-ups.",
      },
      {
        label: "Replace is a last fork",
        body: "Exhaust remediation and health-check intervene rules first.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "audit-path",
    title: "CRM audit path",
    steps: [
      { id: "scope", label: "Scope", short: "Lanes + window" },
      { id: "evidence", label: "Evidence", short: "Config→access" },
      { id: "findings", label: "Findings", short: "Write + rank" },
      { id: "backlog", label: "Remediate", short: "Owners + dates" },
      { id: "fork", label: "Decide", short: "Fix / deepen / replace" },
    ],
    ctaHref: "/guides/crm-health-check/",
    ctaLabel: "Health check guide →",
    figure: {
      src: "/guides/crm-audit-path.png",
      alt: "CRM audit path: scope, evidence, findings, remediate backlog, then decide fix / deepen / replace.",
      caption:
        "Scope and evidence before opinions — then owned backlog and an explicit decide fork.",
    },
  },
  {
    type: "figure",
    id: "audit-flow-visual",
    title: "From scope to remediation backlog",
    src: "/guides/crm-audit-flow.png",
    alt: "CRM audit flow: scope, collect evidence across four lanes, write findings, rank remediation backlog, assign owners, then fix, deepen, or consider replace.",
    caption:
      "Evidence → findings → owned backlog — screenshots without owners are not an audit.",
  },
  {
    type: "checklist",
    id: "audit-run-checklist",
    title: "Run a CRM audit (copyable)",
    copyable: true,
    items: [
      {
        id: "scope-window",
        label: "Freeze audit scope and window",
        description: "Which orgs/pipelines; start/end dates; out of scope named.",
        order: 0,
      },
      {
        id: "lane-config",
        label: "Audit config lane",
        description: "Stages, required fields, automations, permission model.",
        order: 1,
      },
      {
        id: "lane-data",
        label: "Audit data lane",
        description: "Duplicates, empty requireds, stale owners, orphan records.",
        order: 2,
      },
      {
        id: "lane-adoption",
        label: "Audit adoption lane",
        description: "Core-loop usage, manager reviews, side-sheet reliance.",
        order: 3,
      },
      {
        id: "lane-access",
        label: "Audit security access lane",
        description: "Roles, exceptions, inactive seats, export rights.",
        order: 4,
      },
      {
        id: "findings-doc",
        label: "Write findings with evidence",
        description: "Severity, impact, proof link/screenshot, recommended fix.",
        order: 5,
      },
      {
        id: "remediation",
        label: "Publish ranked remediation backlog",
        description: "Owner, due window, re-check date per item.",
        order: 6,
      },
    ],
  },
  {
    type: "step",
    id: "scope-audit",
    stepNumber: 1,
    heading: "Scope the audit before you sample",
    body: "Name the business units, pipelines, and time window. Declare what is out of scope (legacy archives, sandbox) so findings stay actionable. Assign an audit lead and a business counter-signer who can accept severity rankings.\n\nExample: Lakeside B2B scopes Q2 audit to the mid-market pipeline and shared marketing-sourced leads. They exclude the 2019 archive. Ops lead Dana and sales VP Jordan agree the window is two weeks of evidence collection plus one week to publish the backlog.",
    tip: "An unbounded “audit everything” usually produces neither findings nor owners.",
    figure: {
      src: "/guides/crm-audit-hero.png",
      alt: "CRM audit hero dashboard with config, data, adoption, and security access lanes plus findings and remediation backlog.",
      caption:
        "Four lanes into one findings list — then a ranked remediation backlog.",
    },
    scenarios: [
      {
        title: "First post-go-live audit",
        body: "Narrow to core objects and one pipeline; expand next cycle.",
      },
      {
        title: "Regulated context",
        body: "Align access lane with your policy owners; do not invent certification claims.",
      },
      {
        title: "Multi-pod",
        body: "Sample each pod; do not assume HQ hygiene equals field hygiene.",
      },
    ],
  },
  {
    type: "step",
    id: "collect-evidence",
    stepNumber: 2,
    heading: "Collect evidence across four lanes",
    body: "Config: stage definitions vs actual usage, required fields without owners, noisy automations. Data: duplicate clusters, empty requireds, stale owners. Adoption: core-loop fill, manager coaching from CRM vs side sheets. Access: role drift, exception grants, inactive seats, export rights. Capture proof — not opinions.\n\nExample: Dana’s team finds twelve unused required fields, a duplicate cluster on company name, managers coaching from a spreadsheet, and two contractor accounts still active. Each item gets a screenshot or export snippet attached to the finding draft.",
    tip: "If evidence is only “people say,” interview once — then verify in the system of record.",
    figure: {
      src: "/guides/crm-audit-four-lanes.png",
      alt: "Four CRM audit evidence lanes: config, data, adoption, and security access — each with proof, not opinions.",
      caption:
        "Config, data, adoption, access — capture proof in every lane before you rank severity.",
    },
    scenarios: [
      {
        title: "Config drift",
        body: "Stages nobody can define; automations firing without owners.",
      },
      {
        title: "Data decay",
        body: "Duplicates and empty next steps break reporting trust.",
      },
      {
        title: "Access creep",
        body: "Broad roles and eternal temporary exceptions.",
      },
    ],
  },
  {
    type: "step",
    id: "write-findings",
    stepNumber: 3,
    heading: "Write findings with severity and impact",
    body: "Each finding needs: statement, lane, evidence, business impact, severity (blocker / high / medium / low), and recommended fix type (config change, hygiene campaign, coaching, access revoke). Group duplicates. Avoid invented industry benchmark percentages — use your team-defined thresholds or qualitative bands.\n\nExample: Finding F-07 — “Managers coach from a side sheet while CRM next-step fill is empty on active deals” — severity high, impact forecast distrust, fix: improve-adoption coaching loop + enforce next-step on stage moves.",
    tip: "Severity without impact is decoration; impact without evidence is rumor.",
    figure: {
      src: "/guides/crm-audit-findings.png",
      alt: "Write CRM audit findings with statement, lane, evidence, impact, severity, and recommended fix type.",
      caption:
        "Every finding needs evidence and impact — severity alone is decoration.",
    },
    scenarios: [
      {
        title: "Blocker",
        body: "Security exposure or board reporting that leadership no longer trusts.",
      },
      {
        title: "High",
        body: "Core-loop broken for a whole pod; hygiene SLAs missed repeatedly.",
      },
      {
        title: "Medium/low",
        body: "Cosmetic fields, unused views — park behind blockers.",
      },
    ],
  },
  {
    type: "step",
    id: "remediation-backlog",
    stepNumber: 4,
    heading: "Publish a ranked remediation backlog",
    body: "Turn findings into tickets: owner, due window, dependencies, and re-check date. Cap WIP so remediation does not become another infinite admin queue. Link blockers to governance ops change tickets when config must change under control.\n\nExample: Lakeside publishes twelve remediation items. Top three: revoke contractor access (Keisha, this week), merge duplicate companies (hygiene owner, two weeks), kill side-sheet coaching (Jordan + pod leads, 30 days). Re-check on the monthly governance calendar.",
    tip: "A finding without an owner is not remediated — it is archived guilt.",
    figure: {
      src: "/guides/crm-audit-backlog.png",
      alt: "Ranked CRM remediation backlog with owner, due window, dependencies, and re-check date per finding.",
      caption:
        "Findings become tickets — owner, due window, and re-check date, or they are not remediations.",
    },
    scenarios: [
      {
        title: "Quick wins",
        body: "Revoke access, disable dead automations, archive unused fields.",
      },
      {
        title: "Multi-week plays",
        body: "Adoption coaching loops and data cleanup campaigns.",
      },
      {
        title: "Structural",
        body: "Stage model rewrite via governance ops tickets.",
      },
    ],
  },
  {
    type: "step",
    id: "decide-fork",
    stepNumber: 5,
    heading: "Decide: fix in place, deepen, or consider replace",
    body: "After the backlog is owned: fix in place when remediation can restore trust; deepen with a Health Check scorecard if you need ongoing intervene rules; consider replace only when plan gates, admin debt, or exit pain make in-place recovery unrealistic — then use When to Replace CRM, not a feature tour.\n\nExample: Lakeside clears access and hygiene blockers in four weeks. Adoption remains weak, so they run Improve CRM Adoption plays and a Health Check — replace stays off the table until those intervene rules fail.",
    tip: "Buying a new CRM does not erase an unowned remediation backlog — it migrates it.",
    figure: {
      src: "/guides/crm-audit-decide.png",
      alt: "After CRM audit backlog: fix in place, deepen with health check, or consider replace only after recovery fails.",
      caption:
        "Replace is a last fork — exhaust remediation and health-check intervene rules first.",
    },
    scenarios: [
      {
        title: "Fix in place",
        body: "Backlog clearable with current admin capacity.",
      },
      {
        title: "Deepen",
        body: "Health Check + governance ops cadence after audit.",
      },
      {
        title: "Replace fork",
        body: "Chronic gates + exit pain — decision guide, then Finder.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "CRM audit mistakes",
    items: [
      {
        title: "Dashboard tourism",
        body: "Pretty charts without findings, owners, or re-check dates.",
      },
      {
        title: "Config-only audits",
        body: "Ignoring adoption and access leaves the real failure modes untouched.",
      },
      {
        title: "Invented benchmark % as facts",
        body: "Use team-defined thresholds or qualitative bands — not fake industry numbers.",
      },
      {
        title: "Findings with no backlog",
        body: "A PDF that never becomes tickets changes nothing.",
      },
      {
        title: "Immediate rip-and-replace",
        body: "Skipping remediation turns vendor demos into avoidance.",
      },
      {
        title: "One-and-done audit",
        body: "Without a re-check date, drift returns quietly.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is a CRM audit?",
        answer:
          "A structured, time-boxed review of configuration, data, adoption, and security access that produces evidence-backed findings and a ranked remediation backlog with owners and re-check dates.",
      },
      {
        question: "How is an audit different from a health check?",
        answer:
          "An audit goes deep on evidence and produces a remediation backlog. A health check is a faster scorecard pass with intervene rules that may trigger an audit, adoption work, or replace consideration.",
      },
      {
        question: "How long should an audit take?",
        answer:
          "Size it to your scope — many teams use a short evidence window plus a publish week. Prefer a finished backlog over an endless investigation.",
      },
      {
        question: "Who should run the audit?",
        answer:
          "An ops/admin lead with a business counter-signer. External help is optional; ownership of remediation stays internal.",
      },
      {
        question: "Do we need industry benchmark percentages?",
        answer:
          "No. Use qualitative severity, internal targets, or team-defined thresholds. Do not invent industry benchmark percentages as verified facts.",
      },
      {
        question: "When should audit findings trigger replace?",
        answer:
          "Only after remediation and optimize-in-place plays fail, or when plan/admin/exit constraints make recovery unrealistic — follow When to Replace CRM.",
      },
      {
        question: "What should I do next?",
        answer:
          "Scope the four lanes, collect evidence, publish findings with owners, and schedule re-checks. Pair with Governance Ops for change tickets and Health Check for ongoing intervene rules.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-health-check/",
        label: "CRM health check",
        description: "Scorecard pass and intervene rules.",
      },
      {
        href: "/guides/crm-governance-operations/",
        label: "CRM governance ops",
        description: "Tickets and cadence for remediation config changes.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Ownership and change-control foundations.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene SLAs for data-lane findings.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "Recovery when adoption-lane findings dominate.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals to re-check after remediation.",
      },
      {
        href: "/guides/when-to-replace-crm/",
        label: "When to replace CRM",
        description: "Decision fork after fix-in-place fails.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule remediation work and re-checks.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist only after a replace decision.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Schedule the audit and remediation",
    body: "Put audit lanes, publish date, remediation owners, and re-check checkpoints into the Implementation Planner so findings become calendar work.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmAuditGuide: GuidePage = {
  id: "guide-crm-audit",
  slug: "crm-audit",
  title: "CRM Audit Guide: Findings and Remediation Backlog",
  summary:
    "Run a structured CRM audit across config, data, adoption, and security access — then publish evidence-backed findings and a ranked remediation backlog with owners and re-check dates.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "optimization",
  heroVisual: {
    src: "/guides/crm-audit-hero.png",
    alt: "CRM audit hero dashboard with config, data, adoption, and security access lanes plus findings and remediation backlog.",
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
    "crm-health-check",
    "crm-governance-operations",
    "crm-governance",
    "crm-data-quality",
    "improve-crm-adoption",
    "crm-implementation-kpis",
    "when-to-replace-crm",
  ],
  blocks: crmAuditBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "four-lanes",
      label: "Complete four-lane evidence pass",
      description: "Config, data, adoption, access.",
      order: 0,
    },
    {
      id: "findings",
      label: "Publish findings with severity + evidence",
      description: "No vibe-only conclusions.",
      order: 1,
    },
    {
      id: "remediation",
      label: "Rank remediation backlog with owners",
      description: "Due windows and re-check dates.",
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
    title: "CRM Audit Guide: Findings & Remediation Backlog | SoftwareGlimpse",
    description:
      "Structured CRM audit of config, data, adoption, and security access — with evidence-backed findings and a ranked remediation backlog.",
    canonicalPath: "/guides/crm-audit/",
    indexable: true,
  },
};
