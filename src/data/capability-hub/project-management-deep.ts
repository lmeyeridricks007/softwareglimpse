import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL =
  "No. Fit depends on your primary productivity job (work OS vs timeline slides vs PDF vs remote access vs desktop workspace), seat count, and which requirements are must-haves. Use the Best Project Management shortlist and requirements guide rather than starting from a single ranking.";

const PM_META = {
  categorySlug: "project-management" as const,
  buyingGuideHref: "/guides/how-to-choose-project-management-software/",
};

function pmCap(args: {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  overview: string;
  who: string;
  matters: string;
  example: string;
  example2: string;
  goal: string;
  team?: string;
  priorities: string[];
  challenges: Array<{ id: string; title: string; pain: string; help: string }>;
  outcomes: Array<{ id: string; title: string; description: string }>;
  needs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "must" | "nice";
    href?: string;
  }>;
  steps: Array<{ id: string; label: string; detail: string }>;
  relatedCaps: string[];
  relatedUse: string[];
  featureSlug: string;
}): Depth {
  return {
    ...PM_META,
    displayTitle: `Project management ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam:
        args.team ??
        "Ops, project managers, agencies, and delivery teams",
      commonPriorities: args.priorities,
    },
    challenges: args.challenges.map((c) => ({
      id: c.id,
      title: c.title,
      pain: c.pain,
      crmHelps: c.help,
    })),
    outcomes: args.outcomes,
    capabilityNeeds: args.needs,
    workflowSteps: args.steps,
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this capability.`,
      icon: "check",
    })),
    scenarios: [
      {
        id: "work-os",
        title: "Work OS buyer",
        bestWhen: "Shared ownership and multi-view planning are the job.",
      },
      {
        id: "specialist",
        title: "Specialist buyer",
        bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the job.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this capability is a must-have",
        href: "/guides/project-management-requirements-guide/",
      },
      {
        step: 2,
        title: "Map it to seats and plan gates",
        href: "/guides/project-management-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it in a shared trial",
        href: "/guides/project-management-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/project-management-software/",
        ctaLabel: "Best project management →",
      },
    ],
    faq: [
      {
        question: `Is there one best platform for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM capabilities?",
        answer:
          "CRM capabilities store relationships and pipeline on records. Project management capabilities plan and track internal work — often integrating with chat, files, and CRM. Buy for the productivity job that is blocking first.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-project-management-software/",
      "/guides/what-is-project-management-software/",
      "/best/project-management-software/",
      "/categories/project-management/",
    ],
    heroVisual: {
      src: `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of project management ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in a productivity stack — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to project management capability fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in project management.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * Project management capability hub depth.
 * Does **not** include `ai-assistance` — CRM already owns `/capabilities/ai-assistance/`.
 */
export const projectManagementCapabilityDepth: Record<string, Depth> = {
  "task-boards": pmCap({
    slug: "task-boards",
    title: "Task boards & work views",
    badge: "Task boards",
    tagline: "Boards, tables, lists, and kanban-style views for tracking work items.",
    overview: "Task boards are the primary work views where items are owned, staged, and reviewed. They are the foundation most work OS stacks build on.",
    who: "Anyone updating or reviewing delivery status weekly — contributors and managers.",
    matters: "Evaluate which views ship on free vs paid plans, and whether people will actually update them.",
    example: "Worked example: Harbor Studio runs client delivery on a board with owners and stages instead of a shared sheet.",
    example2: "Worked example: ops intake lands on a board so nothing starts without an owner.",
    goal: "Trusted shared views of work items",
    priorities: ["Views on target plan","Ownership fields","Status discipline","Filters & groups","Mobile usability"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["timeline-gantt","automations-workflows","docs-collaboration"],
    relatedUse: ["work-management","project-tracking"],
    featureSlug: "task-boards",
  }),
  "timeline-gantt": pmCap({
    slug: "timeline-gantt",
    title: "Timeline / Gantt",
    badge: "Timeline / Gantt",
    tagline: "Timeline, Gantt, or roadmap views for scheduling and dependencies.",
    overview: "Timeline and Gantt views show sequence, dependencies, and milestones — either live in a work OS or as presentation slides.",
    who: "PMs and programme leads who need sequence visibility beyond a flat task list.",
    matters: "Confirm whether timeline is native on your plan, and whether you need living dates or PowerPoint polish.",
    example: "Worked example: a programme lead tracks milestones on a live timeline tied to tasks.",
    example2: "Worked example: a client deck needs PowerPoint Gantt polish — a presenter tool may fit better.",
    goal: "Clear sequence and milestone visibility",
    priorities: ["Dependencies","Milestones","Plan gates","Export / slides","Living vs static"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["task-boards","workload-resources","reporting-dashboards"],
    relatedUse: ["timeline-reporting","work-management","resource-planning"],
    featureSlug: "timeline-gantt",
  }),
  "workload-resources": pmCap({
    slug: "workload-resources",
    title: "Workload & resource management",
    badge: "Workload",
    tagline: "Capacity and portfolio load views across people and projects.",
    overview: "Workload and resource views show who is overallocated so managers can rebalance before deadlines slip.",
    who: "Delivery managers balancing multiple projects across shared people.",
    matters: "Note whether resourcing is native, add-on, or enterprise-gated.",
    example: "Worked example: a studio lead spots overload two weeks before launch and reassigns.",
    example2: "Worked example: a services firm uses capacity to decide hire vs defer.",
    goal: "Visible capacity before deadlines slip",
    priorities: ["Capacity views","Plan gates","Rebalancing","Portfolio load","Time inputs"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["timeline-gantt","time-tracking","reporting-dashboards"],
    relatedUse: ["resource-planning","work-management"],
    featureSlug: "workload-resources",
  }),
  "automations-workflows": pmCap({
    slug: "automations-workflows",
    title: "Automations & workflows",
    badge: "Automations",
    tagline: "Rules and multi-step workflows that move work without manual updates.",
    overview: "Automations change status, assignees, and notifications when conditions are met — reducing status chasing.",
    who: "Ops and PM leads tired of manual handoff reminders.",
    matters: "Capture action caps and plan gates when published.",
    example: "Worked example: status “Ready for review” notifies the account lead automatically.",
    example2: "Worked example: overdue items escalate to a manager after two days.",
    goal: "Reliable handoffs without manual chasing",
    priorities: ["Recipe depth","Action caps","Plan gates","Auditability","Noise control"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["task-boards","integrations-ecosystem","docs-collaboration"],
    relatedUse: ["work-management","project-tracking"],
    featureSlug: "automations-workflows",
  }),
  "time-tracking": pmCap({
    slug: "time-tracking",
    title: "Time tracking",
    badge: "Time tracking",
    tagline: "Timers, timesheets, or billable time capture against tasks and projects.",
    overview: "Time tracking attaches effort to work items for billing, capacity, or retrospectives.",
    who: "Agencies and professional services that bill or analyse effort.",
    matters: "Check whether timers are native and how timesheets export.",
    example: "Worked example: designers log time on deliverable cards for monthly billing.",
    example2: "Worked example: ops compares estimated vs actual hours after a launch.",
    goal: "Effort captured against real work items",
    priorities: ["Timers","Timesheets","Billable flags","Exports","Adoption"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["workload-resources","task-boards","reporting-dashboards"],
    relatedUse: ["resource-planning","project-tracking"],
    featureSlug: "time-tracking",
  }),
  "docs-collaboration": pmCap({
    slug: "docs-collaboration",
    title: "Docs & collaboration",
    badge: "Docs",
    tagline: "Shared docs, comments, chat, or proofing tied to work items.",
    overview: "Docs and collaboration keep decisions and files on the work item so context survives handoffs.",
    who: "Teams currently coordinating delivery in private chat threads.",
    matters: "Evaluate comments, files, guests, and notification noise.",
    example: "Worked example: proofing notes live on the deliverable card.",
    example2: "Worked example: a guest client comments without a full seat — confirm guest rules.",
    goal: "Context attached to the work",
    priorities: ["Comments","Files","Guests","Proofing","Notifications"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["task-boards","automations-workflows","integrations-ecosystem"],
    relatedUse: ["team-collaboration-work","document-productivity"],
    featureSlug: "docs-collaboration",
  }),
  "integrations-ecosystem": pmCap({
    slug: "integrations-ecosystem",
    title: "Integrations ecosystem",
    badge: "Integrations",
    tagline: "Native and Zapier-style connections to chat, storage, CRM, and design tools.",
    overview: "Integrations connect the work OS to tools people already open — chat, files, CRM, and design.",
    who: "Teams standardised on Slack, Microsoft 365, Google, or a CRM.",
    matters: "Prefer native depth over Zapier-only claims for daily tools.",
    example: "Worked example: Slack updates when a card reaches “Blocked”.",
    example2: "Worked example: Drive files attach without duplicate uploads.",
    goal: "Native depth for daily tools",
    priorities: ["Native connectors","Reliability","Auth model","Zapier fallback","Admin control"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["automations-workflows","task-boards","docs-collaboration"],
    relatedUse: ["work-management","team-collaboration-work"],
    featureSlug: "integrations-ecosystem",
  }),
  "reporting-dashboards": pmCap({
    slug: "reporting-dashboards",
    title: "Reporting & dashboards",
    badge: "Reporting",
    tagline: "Dashboards, portfolio reports, and progress analytics for managers.",
    overview: "Reporting turns live work data into dashboards managers can review weekly without rebuilding slides from scratch.",
    who: "Managers and ops leads running delivery reviews.",
    matters: "Check dashboard depth on the plan you will buy and whether reports stay live.",
    example: "Worked example: Monday reviews start from a stuck-items dashboard.",
    example2: "Worked example: portfolio health is visible without exporting to sheets.",
    goal: "Trusted manager visibility",
    priorities: ["Live dashboards","Portfolio views","Exports","Plan gates","Review ritual"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["task-boards","timeline-gantt","workload-resources"],
    relatedUse: ["timeline-reporting","work-management","resource-planning"],
    featureSlug: "reporting-dashboards",
  }),
  "document-pdf": pmCap({
    slug: "document-pdf",
    title: "Document / PDF productivity",
    badge: "PDF",
    tagline: "PDF edit, convert, sign, or redact capabilities for document workflows.",
    overview: "Document/PDF productivity handles edit, convert, sign, and redact jobs beside — not instead of — a work tracker.",
    who: "Teams blocked by PDF friction in delivery or contracting.",
    matters: "Buy for document depth; keep work OS as a separate decision.",
    example: "Worked example: Foxit redlines a proposal while the task stays on the board.",
    example2: "Worked example: ops signs vendor PDFs without desktop email chaos.",
    goal: "PDF workflows without derailing delivery",
    priorities: ["Edit","Sign","Convert","Redact","Stack fit"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["docs-collaboration"],
    relatedUse: ["document-productivity"],
    featureSlug: "document-pdf",
  }),
  "remote-access": pmCap({
    slug: "remote-access",
    title: "Remote access / screen share",
    badge: "Remote access",
    tagline: "Remote desktop, unattended access, or session sharing for support and remote work.",
    overview: "Remote access lets support and ops reach machines securely — a specialist productivity job, not a work OS.",
    who: "IT/support and ops supporting remote machines or clients.",
    matters: "Evaluate security, unattended access, and browser convenience.",
    example: "Worked example: browser remote session fixes a client machine quickly.",
    example2: "Worked example: unattended access restarts a studio PC overnight.",
    goal: "Secure remote sessions when needed",
    priorities: ["Security","Unattended access","Browser UX","Audit trail","Support fit"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["desktop-workspace"],
    relatedUse: ["remote-support-access"],
    featureSlug: "remote-access",
  }),
  "desktop-workspace": pmCap({
    slug: "desktop-workspace",
    title: "Desktop workspace organizer",
    badge: "Desktop workspace",
    tagline: "Desktop app wrappers, workspaces, and multi-app productivity shells.",
    overview: "Desktop workspace organizers group web apps into focus contexts. They do not replace boards and timelines.",
    who: "Knowledge workers juggling many SaaS tools.",
    matters: "Buy for organisation and focus; keep delivery tracking separate.",
    example: "Worked example: a client workspace opens only the apps for that account.",
    example2: "Worked example: contractors separate personal and client app sets.",
    goal: "Focused multi-app desktop contexts",
    priorities: ["Workspaces","App wrappers","Focus","Performance","Separation of jobs"],
    challenges: [
      { id: "missing", title: "Capability missing or gated", pain: "Teams discover the feature only after buying the wrong plan.", help: "Map must-haves to the qualifying plan before purchase." },
      { id: "unused", title: "Capability unused after launch", pain: "Adoption fails and status drifts.", help: "Trial with a real workflow and a sceptic user." },
      { id: "noise", title: "Too much noise", pain: "Notifications and views overwhelm contributors.", help: "Configure for the weekly ritual you will keep." },
      { id: "wrong-job", title: "Wrong job cluster", pain: "A specialist tool is forced to act like a work OS (or the reverse).", help: "Keep specialists on landscape decision paths." },
    ],
    outcomes: [
      { id: "clarity", title: "Clearer operating loop", description: "The capability supports a weekly ritual people keep." },
      { id: "less-rework", title: "Less rework", description: "Status and handoffs need fewer manual chases." },
      { id: "fit", title: "Honest fit", description: "Buyers stop comparing across unrelated job clusters." },
    ],
    needs: [
      { id: "must-plan", title: "Available on target plan", description: "Confirm gates before you commit.", priority: "must" },
      { id: "must-trial", title: "Trialable in two weeks", description: "Evidence from a real workflow.", priority: "must" },
      { id: "nice-depth", title: "Depth beyond marketing copy", description: "Native behaviour for your stack.", priority: "nice" },
    ],
    steps: [
      { id: "confirm", label: "Confirm must-have", detail: "Write the weekly outcome this capability must enable." },
      { id: "gate", label: "Check plan gates", detail: "Confirm the quoted tier unlocks it." },
      { id: "trial", label: "Trial it", detail: "Run one real workflow for several days." },
      { id: "review", label: "Review adoption", detail: "Keep only what people actually use." },
    ],
    relatedCaps: ["remote-access","document-pdf"],
    relatedUse: ["desktop-productivity"],
    featureSlug: "desktop-workspace",
  })
};
