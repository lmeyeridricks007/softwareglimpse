import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

type PmJob = {
  noun: string;
  loop: string;
  setupFirst: string;
  migrateObjects: string;
  prove: string;
  team: string;
  notPeer: string;
  categoryHowTo: string;
};

function joinList(items: readonly string[], max = 4): string {
  const picked = items.filter(Boolean).slice(0, max);
  if (picked.length === 0) return "";
  if (picked.length === 1) return picked[0] as string;
  if (picked.length === 2) return `${picked[0]} and ${picked[1]}`;
  return `${picked.slice(0, -1).join(", ")}, and ${picked[picked.length - 1]}`;
}

function clauses(items: readonly string[], max: number, sep = "; "): string {
  return items
    .slice(0, max)
    .map((line) => line.replace(/\s*[.;·]+$/u, ""))
    .join(sep);
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item != null);
}

function pmJob(ctx: ProductGuideContext): PmJob {
  const howTo = "how to choose project management software";
  switch (ctx.productSlug) {
    case "asana":
      return {
        noun: "cross-functional work management",
        loop: "create one project with owners, move three tasks across a board or list, and show status on a timeline",
        setupFirst: "one real project, one board or list view, and a weekly update ritual contributors will keep",
        migrateObjects: "projects, tasks, sections, owners, due dates, and attachments",
        prove: "a non-admin owner updates a task and a manager sees it on the project without an admin screenshot",
        team: "Harbor Marketing (14 people across brand, web, and ops)",
        notPeer: "an engineering issue tracker or a PowerPoint Gantt add-in",
        categoryHowTo: howTo,
      };
    case "clickup":
      return {
        noun: "all-in-one work OS",
        loop: "capture work in one Space, complete a task in List and Board, and prove an automation fired",
        setupFirst: "one Space, one hierarchy you will actually use, and a core view set (List + Board)",
        migrateObjects: "spaces, lists, tasks, statuses, docs, and automations",
        prove: "a contributor closes a task in the view they will live in and a lead sees it without ClickUp admin help",
        team: "Northline Ops (a 20-person ops + delivery team)",
        notPeer: "a lightweight personal to-do list or a PDF editor",
        categoryHowTo: howTo,
      };
    case "wrike":
      return {
        noun: "structured work management for marketing and professional services",
        loop: "open one folder/project, assign work, and show progress on a Gantt or dashboard a client lead can read",
        setupFirst: "one folder structure, custom fields you will report on, and request forms if intake is the job",
        migrateObjects: "folders, tasks, custom fields, attachments, and dashboards",
        prove: "a requestor submits intake and a manager sees the resulting task on a timeline without an admin",
        team: "Harbor Creative (agency-style delivery with client reviews)",
        notPeer: "a lightweight kanban toy or an engineering-only tracker",
        categoryHowTo: howTo,
      };
    case "hive":
      return {
        noun: "collaborative project hub",
        loop: "create one project, assign actions, and prove status is visible in chat or proofing without a side spreadsheet",
        setupFirst: "one project workspace, action cards, and the messaging or proofing surface you will actually buy",
        migrateObjects: "projects, actions, comments, files, and proof rounds",
        prove: "a sceptic contributor updates an action and a lead sees it in the project home",
        team: "Northline Ops (SMB delivery team replacing Slack archaeology)",
        notPeer: "the heaviest enterprise work OS or a Gantt slide tool",
        categoryHowTo: howTo,
      };
    case "smartsheet":
      return {
        noun: "spreadsheet-native project and portfolio tracking",
        loop: "build one sheet with dependencies, share a report, and prove a stakeholder can filter without breaking formulas",
        setupFirst: "one production sheet, one report, and access rules for editors vs viewers",
        migrateObjects: "sheets, reports, dashboards, attachments, and row history",
        prove: "an editor updates a row and a dashboard refreshes for a stakeholder who is not the sheet owner",
        team: "Harbor PMO (spreadsheet-fluent ops with Gantt reporting needs)",
        notPeer: "a lightweight personal task app or a docs wiki",
        categoryHowTo: howTo,
      };
    case "jira":
      return {
        noun: "engineering issue tracking and sprint delivery",
        loop: "create one issue, move it across a board, and close a sprint or increment a release with a comment trail",
        setupFirst: "one project, one issue type set, and a board a developer can update without a Jira admin",
        migrateObjects: "projects, issues, sprints, comments, and attachments",
        prove: "a developer transitions an issue and a tech lead sees it on the board without admin rights",
        team: "Northline Engineering (two squads, one shared backlog)",
        notPeer: "a marketing work OS or a personal to-do list",
        categoryHowTo: howTo,
      };
    case "linear":
      return {
        noun: "fast engineering issue tracking",
        loop: "file an issue, cycle it, and ship with a changelog a PM can read",
        setupFirst: "one team, one cycle, and issue labels you will actually search",
        migrateObjects: "teams, issues, cycles, projects, and comments",
        prove: "an engineer closes an issue in a cycle and a PM sees it without a Linear admin",
        team: "Harbor Product (small product-engineering team)",
        notPeer: "a cross-functional marketing work OS or a spreadsheet PMO",
        categoryHowTo: howTo,
      };
    case "notion":
      return {
        noun: "docs-first workspace with databases",
        loop: "write one project doc, link a database of tasks, and prove a teammate can find status without asking Slack",
        setupFirst: "one teamspace, one project database, and a template people will duplicate",
        migrateObjects: "pages, databases, permissions, and linked views",
        prove: "a non-admin updates a row and a manager opens the same view without a workspace owner",
        team: "Northline Ops (docs-heavy team that also tracks work)",
        notPeer: "a dedicated sprint tracker or a Gantt presenter",
        categoryHowTo: howTo,
      };
    case "trello":
      return {
        noun: "lightweight kanban boards",
        loop: "create one board, move three cards across lists, and prove comments replace a side chat for that work",
        setupFirst: "one board, list names that match how you actually work, and members who will move cards",
        migrateObjects: "boards, lists, cards, checklists, and attachments",
        prove: "a contributor moves a card and a lead sees it without a Trello admin",
        team: "Harbor Marketing (a small campaign crew)",
        notPeer: "a portfolio PMO or an engineering issue tracker",
        categoryHowTo: howTo,
      };
    case "airtable":
      return {
        noun: "spreadsheet-database hybrid for structured work",
        loop: "stand up one base, add records in Grid and Kanban, and share a view a requester can use",
        setupFirst: "one base, field types you will report on, and interface or view permissions",
        migrateObjects: "bases, tables, records, attachments, and interfaces",
        prove: "an editor adds a record and a stakeholder sees it in a locked view",
        team: "Harbor Ops (ops team replacing messy Sheets)",
        notPeer: "a chat-first work hub or a PDF editor",
        categoryHowTo: howTo,
      };
    case "motion":
      return {
        noun: "AI calendar and auto-scheduled tasks",
        loop: "capture tasks, let the calendar place them, and prove a meeting plus task day still holds",
        setupFirst: "one calendar connection, one task list, and auto-schedule rules you will live with",
        migrateObjects: "tasks, calendars, projects, and meeting notes",
        prove: "a user completes an auto-scheduled task and the calendar reflows without an admin",
        team: "Northline Leads (PMs drowning in calendar tetris)",
        notPeer: "a full work OS for 50-person portfolio reporting",
        categoryHowTo: howTo,
      };
    case "basecamp":
      return {
        noun: "lightweight project communication hub",
        loop: "open one project, post a message, assign to-dos, and prove the team stopped using a parallel Slack thread for that project",
        setupFirst: "one project, to-dos, message board, and who is allowed to ping",
        migrateObjects: "projects, to-dos, messages, docs, and schedules",
        prove: "a contributor checks off a to-do and a lead sees it on the project hill without an owner login",
        team: "Harbor Studio (a calm client-delivery crew)",
        notPeer: "an engineering tracker or a spreadsheet PMO",
        categoryHowTo: howTo,
      };
    case "todoist":
      return {
        noun: "personal and small-team task lists",
        loop: "capture tasks, assign one shared project, and complete a daily review without a second tool",
        setupFirst: "one shared project, labels you will filter, and a daily review habit",
        migrateObjects: "projects, tasks, labels, and filters",
        prove: "a teammate completes an assigned task and you see it without being the project admin",
        team: "Northline Founders (a five-person leadership list)",
        notPeer: "a company work OS or a Gantt portfolio",
        categoryHowTo: howTo,
      };
    case "microsoft-project":
      return {
        noun: "schedule-driven PMO planning",
        loop: "build one schedule with predecessors, resource names, and a baseline a sponsor can read",
        setupFirst: "one project file, calendars, and who may publish vs view",
        migrateObjects: "tasks, dependencies, resources, baselines, and reports",
        prove: "a planner updates percent-complete and a sponsor sees the shifted finish date",
        team: "Harbor PMO (construction-style schedule owners)",
        notPeer: "a lightweight kanban or a docs wiki",
        categoryHowTo: howTo,
      };
    default:
      return {
        noun: "work OS / collaborative project tracking",
        loop: "stand up one board, assign owners, and show status in a second view (timeline or dashboard)",
        setupFirst: "one workspace, one real board, and a weekly update ritual",
        migrateObjects: "boards, items, groups, owners, and automations",
        prove: "a non-admin updates an item and a manager sees it on the board or timeline",
        team: "Harbor Ops (cross-functional delivery replacing spreadsheet status)",
        notPeer: "a PDF editor, remote-desktop tool, or PowerPoint Gantt add-in",
        categoryHowTo: howTo,
      };
  }
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return pmJob(ctx).setupFirst;
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) return pmJob(ctx).loop;
  return joinList(ctx.coreLoopLabels, 4);
}

function planPhrase(ctx: ProductGuideContext): string {
  if (!ctx.hasPlanMatrix) {
    return "usage / hub / contact-sales packaging (no public plan matrix in our snapshot)";
  }
  return ctx.planNames.join(", ");
}

function bestForPhrase(ctx: ProductGuideContext): string {
  if (ctx.bestFor.length === 0) {
    return `teams whose primary job is ${pmJob(ctx).noun}`;
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return `teams whose blocking job is ${pmJob(ctx).notPeer}`;
  }
  return clauses(ctx.notIdealFor, 4);
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves — including seats, hubs, and add-ons — against the packaging you actually intend to buy.`;
  }
  return `Plan-gated in research: ${ctx.gatedFeatureHints.slice(0, 4).join("; ")}.`;
}

function quickGateHint(ctx: ProductGuideContext): string {
  const top = ctx.gatedFeatures.slice(0, 2);
  if (top.length === 0) return "";
  const phrase = (f: (typeof top)[number]) => {
    const plan = f.planNames[0] ?? null;
    return plan ? `${f.label} (${plan}+)` : f.label;
  };
  if (top.length === 1) {
    return ` Confirm ${phrase(top[0]!)} is on the package you will actually buy.`;
  }
  return ` Confirm ${phrase(top[0]!)} and ${phrase(top[1]!)} are on the package you will actually buy.`;
}

function trialSentence(ctx: ProductGuideContext): string {
  if (ctx.trialDays != null) {
    const where =
      ctx.trialPlanNames.length > 0
        ? ` on ${joinList(ctx.trialPlanNames, 3)}`
        : "";
    return `Our pricing snapshot records a ${ctx.trialDays}-day trial${where} — confirm current terms on the ${ctx.productName} pricing page before you build a schedule around it.`;
  }
  if (ctx.trialPlanNames.length > 0) {
    return `Our snapshot flags a trial on ${joinList(ctx.trialPlanNames, 3)} without a published length — confirm the window on the ${ctx.productName} pricing page.`;
  }
  if (ctx.freePlanNames.length > 0) {
    return `Our snapshot records no trial length for ${ctx.productName}, so ${joinList(ctx.freePlanNames, 2)} is your proving ground.`;
  }
  return `Our snapshot records no trial length for ${ctx.productName} — ask for an evaluation window in writing before you commit seats.`;
}

function integrationSentence(ctx: ProductGuideContext): string {
  if (ctx.integrationNames.length === 0) {
    return `Our research does not name specific ${ctx.productName} integrations, so verify Slack, calendar, and file-store connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your work loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on the core ${pmJob(ctx).noun} loop rather than assistance features.`;
  }
  const gate =
    ctx.aiPlanNames.length > 0
      ? ` Research places AI assistance on ${joinList(ctx.aiPlanNames, 4)}.`
      : "";
  const labels =
    ctx.aiCapabilityLabels.length > 0
      ? `Research lists ${joinList(ctx.aiCapabilityLabels, 4)} for ${ctx.productName}.`
      : `${ctx.productName} research mentions AI assistance without naming capabilities.`;
  return `${labels}${gate}`;
}

function positioningSentence(ctx: ProductGuideContext): string {
  if (ctx.shortDescription) return ctx.shortDescription;
  if (ctx.vendorClaim) return `Vendor positioning: ${ctx.vendorClaim}`;
  return `${ctx.productName} is evaluated here as ${pmJob(ctx).noun} tooling — not a peer for every project-management job cluster.`;
}

function planSoftener(ctx: ProductGuideContext): string {
  if (ctx.hasPlanMatrix) return `Researched plans: ${planPhrase(ctx)}.`;
  return `${ctx.productName} is often sold on seats, hubs, pools, or quote packaging in our snapshot — treat homepage tiles as marketing, not a bill of materials. Confirm live packaging on the pricing page.`;
}

function pricingPointer(ctx: ProductGuideContext): string {
  return `Never invent list prices here — confirm seats, hubs, and quote terms on ${ctx.pricingHref}.`;
}

function limitationLines(ctx: ProductGuideContext): string[] {
  const merged = [...ctx.reviewLimitations, ...ctx.enrichmentLimitations];
  const out: string[] = [];
  for (const line of merged) {
    if (!out.includes(line)) out.push(line);
  }
  return out;
}

function diagramFigure(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  caption: string,
) {
  return {
    src: ctx.figureSrc(kind),
    alt: `${ctx.productName} ${kind} teaching diagram.`,
    caption,
  };
}

function researchCallout(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput | null {
  const lines = limitationLines(ctx);
  if (lines.length === 0) return null;
  const framing: Record<CrmProductGuideKind, string> = {
    setup: "Design day-zero configuration around these before you invite the whole team.",
    implementation: "Sequence your 30/60/90 plan around these constraints.",
    migration: "Check these before you promise a cutover date.",
    plans: "Weigh these when you pick seats, hubs, and a qualifying tier.",
    "worth-it": "These are the tradeoffs your buy decision has to accept.",
  };
  return {
    type: "callout",
    id: "research-watchouts",
    title: `What research flags about ${ctx.productName}`,
    body: `${clauses(lines, 4, " · ")}. ${framing[kind]}`,
    tone: "warning",
  };
}

function relatedLinks(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput {
  const siblings = (
    [
      ["setup", "Setup guide"],
      ["implementation", "Implementation guide"],
      ["migration", "Migration guide"],
      ["plans", "Plans / seats vs hubs"],
      ["worth-it", "Worth it?"],
    ] as const
  )
    .filter(([k]) => k !== kind)
    .map(([k, label]) => ({
      href: `/guides/${ctx.siblingSlugs[k]}/`,
      label: `${ctx.productName} ${label}`,
      description: `Continue the ${ctx.productName} path.`,
    }));

  return {
    type: "related-content",
    id: "related",
    title: `Related ${ctx.productName} resources`,
    links: [
      {
        href: ctx.reviewHref,
        label: `${ctx.productName} review`,
        description: "Product hub and verdict.",
      },
      {
        href: ctx.pricingHref,
        label: `${ctx.productName} pricing`,
        description: "Researched plans, seats/hubs, and sources.",
      },
      ...siblings,
      {
        href: "/guides/how-to-choose-project-management-software/",
        label: "How to choose project management software",
        description: "Category selection framework by job cluster.",
      },
      {
        href: "/best/project-management-software/",
        label: "Best project management software",
        description: "Editor’s picks by job cluster — not one ranking.",
      },
      {
        href: "/categories/project-management/",
        label: "Project management & productivity",
        description: "Browse the category hub.",
      },
    ],
  };
}

function interactiveCta(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput {
  if (kind === "plans") {
    return {
      type: "interactive-cta",
      id: "pricing-cta",
      title: `Confirm ${ctx.productName} packaging on the pricing page`,
      body: `Work OS products often mix seats, guests, and feature gates. Use the researched pricing page — do not invent totals in a spreadsheet.`,
      href: ctx.pricingHref,
      ctaLabel: `Open ${ctx.productName} pricing →`,
      variant: "calculator",
    };
  }
  if (kind === "worth-it") {
    return {
      type: "interactive-cta",
      id: "choose-cta",
      title: "Still unsure? Use the category framework",
      body: `If ${ctx.productName} is close but not obvious, read how to choose project management software and compare finalists inside the same job cluster — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-project-management-software/",
      ctaLabel: "How to choose →",
      variant: "generic",
    };
  }
  return {
    type: "interactive-cta",
    id: "review-cta",
    title: "Read the product hub next",
    body: `Freeze must vs nice for ${ctx.productName}, then follow setup and implementation gates from the review hub.`,
    href: ctx.reviewHref,
    ctaLabel: `Open ${ctx.productName} review →`,
    variant: "generic",
  };
}

function mustNiceMatrix(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  rows: Array<{
    feature: string;
    mustHave: boolean;
    niceToHave: boolean;
    notes: string;
  }>,
): GuideBlockInput {
  return {
    type: "feature-matrix",
    id: `${kind}-must-nice`,
    title: `${ctx.productName} must vs nice`,
    rows,
  };
}

function phaseChecklist(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  items: Array<{ id: string; label: string; description: string }>,
): GuideBlockInput {
  return {
    type: "checklist",
    id: `${kind}-checklist`,
    title: `${ctx.productName} checklist`,
    copyable: true,
    items,
  };
}

function startPlan(ctx: ProductGuideContext): string {
  return (
    ctx.freePlanNames[0] ??
    ctx.entryPlanName ??
    "the entry package on the pricing page"
  );
}

function teachingFigure(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  panel: 1 | 2 | 3 | 4,
  caption: string,
) {
  return {
    src: ctx.panelSrc(kind, panel),
    alt: `${ctx.productName} ${kind} diagram ${panel}.`,
    caption,
  };
}

function peerSlugs(ctx: ProductGuideContext): string[] {
  const peers: Record<string, string[]> = {
    monday: ["asana", "clickup", "wrike", "hive"],
    asana: ["monday", "clickup", "wrike", "smartsheet"],
    clickup: ["monday", "asana", "notion", "jira"],
    wrike: ["asana", "monday", "smartsheet", "clickup"],
    hive: ["monday", "asana", "clickup", "basecamp"],
    smartsheet: ["monday", "wrike", "airtable", "microsoft-project"],
    jira: ["linear", "clickup", "asana", "monday"],
    linear: ["jira", "clickup", "asana", "notion"],
    notion: ["clickup", "asana", "airtable", "monday"],
    trello: ["asana", "monday", "clickup", "basecamp"],
    airtable: ["smartsheet", "notion", "monday", "clickup"],
    motion: ["todoist", "asana", "monday", "clickup"],
    basecamp: ["monday", "asana", "trello", "todoist"],
    todoist: ["asana", "trello", "clickup", "motion"],
    "microsoft-project": ["smartsheet", "wrike", "monday", "asana"],
  };
  return (peers[ctx.productSlug] ?? ["monday", "asana", "clickup"]).slice(0, 4);
}

function integrationSystems(ctx: ProductGuideContext): Array<{
  id: string;
  label: string;
}> {
  const named = ctx.integrationNames.slice(0, 5).map((label, i) => ({
    id: `int-${i + 1}`,
    label,
  }));
  const fallback = [
    { id: "slack", label: "Slack" },
    { id: "calendar", label: "Google Calendar / Outlook" },
    { id: "files", label: "Google Drive / OneDrive" },
    { id: "email", label: "Email" },
  ];
  const merged = [...named];
  for (const item of fallback) {
    if (merged.length >= 4) break;
    if (!merged.some((x) => x.label.toLowerCase() === item.label.toLowerCase())) {
      merged.push(item);
    }
  }
  return merged.slice(0, 6);
}

function buildPmSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = pmJob(ctx);
  const boards = ctx.feature("task-boards");
  const timeline = ctx.feature("timeline-gantt");
  const automations = ctx.feature("automations-workflows");
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify seats for people who will actually open it weekly, name one workspace owner, configure ${job.setupFirst}, connect Slack/calendar/storage the loop depends on, then have a non-admin prove ${job.prove}.${quickGateHint(ctx)} You are done when that walkthrough works — not when every optional view or automation is switched on.`,
      bullets: [
        `Start on ${startPlan(ctx)}`,
        "Name one workspace owner with weekly hours",
        job.setupFirst,
        "Connect Slack / calendar / files",
        "Prove a non-admin can run the loop",
        "Write a one-page setup note",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `What matters in your ${name} setup`,
      items: compact([
        {
          label: `What ${name} actually is`,
          body: positioningSentence(ctx),
        },
        {
          label: "Configure these first",
          body: `Research lists ${featurePhrase(ctx)} as supported — that is your day-zero surface. Core loop: ${coreLoopPhrase(ctx)}.`,
        },
        {
          label: "Do not treat it as every work-management job",
          body: `${name} is ${job.noun}. It is not a substitute for ${job.notPeer}.`,
        },
        {
          label: "Start on the right package",
          body: `${planSoftener(ctx)} ${pricingPointer(ctx)}`,
        },
        {
          label: "Connect only what the loop needs",
          body: integrationSentence(ctx),
        },
        ctx.hasAi
          ? {
              label: "AI comes after habits",
              body: `${aiSentence(ctx)} Leave it off until the manual loop is boring.`,
            }
          : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "setup-path",
      title: `${name} day-zero path`,
      steps: [
        { id: "package", label: "Package", short: "Qualify seats" },
        { id: "owner", label: "Owner", short: "Workspace admin" },
        { id: "loop", label: "Loop", short: "One real board" },
        { id: "users", label: "Users", short: "Weekly people" },
        { id: "sync", label: "Sync", short: "Slack/files" },
        { id: "proof", label: "Proof", short: "Non-admin" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.implementation}/`,
      ctaLabel: "Implementation →",
    },
    {
      type: "figure",
      id: "setup-diagram",
      title: `${name} day-zero path`,
      src: ctx.figureSrc("setup"),
      alt: `${name} setup walkthrough for ${job.noun}.`,
      caption: `A working ${name} core loop beats a decorated empty workspace.`,
    },
    mustNiceMatrix(ctx, "setup", [
      {
        feature: boards?.label ?? "Task boards / lists",
        mustHave: true,
        niceToHave: false,
        notes: job.setupFirst,
      },
      {
        feature: "Named owners on live work",
        mustHave: true,
        niceToHave: false,
        notes: "If ownership is optional, status meetings will stay in Slack",
      },
      {
        feature: timeline?.label ?? "Second view (timeline / Gantt / dashboard)",
        mustHave: true,
        niceToHave: false,
        notes: timeline?.gated
          ? `Researched on ${joinList(timeline.planNames, 3)}`
          : "Managers need a view they did not build",
      },
      {
        feature: "Slack / calendar / files for the loop",
        mustHave: true,
        niceToHave: false,
        notes: integrationSentence(ctx),
      },
      {
        feature: automations?.label ?? "Automations",
        mustHave: false,
        niceToHave: true,
        notes: automations?.gated
          ? `Researched on ${joinList(automations.planNames, 3)} — after the manual loop holds`
          : "After a week of real updates",
      },
      {
        feature: ctx.hasAi ? "AI assistance" : "Extra hubs and marketplace apps",
        mustHave: false,
        niceToHave: true,
        notes: "Defer until week 4+",
      },
    ]),
    {
      type: "integration-ecosystem",
      id: "setup-integrations",
      title: `${name} day-zero connectors`,
      hubLabel: "Work OS",
      systems: integrationSystems(ctx),
      body: `Connect only what ${job.loop} needs. Extra apps hide whether the core loop works.`,
    },
    phaseChecklist(ctx, "setup", [
      {
        id: "package",
        label: `Qualify ${name} seats and hubs`,
        description: "Day-one must-haves on the cheapest researched package.",
      },
      {
        id: "owner",
        label: "Name one workspace owner",
        description: "Boards, users, and hygiene need ~2 hours a week.",
      },
      {
        id: "loop",
        label: "Configure one core loop",
        description: job.setupFirst,
      },
      {
        id: "users",
        label: "Invite weekly users only",
        description: "Roles before a company-wide invite.",
      },
      {
        id: "sync",
        label: "Connect Slack / calendar / files",
        description: "Document other gaps instead of wiring everything.",
      },
      {
        id: "proof",
        label: "Complete non-admin proof",
        description: job.prove,
      },
    ]),
    researchCallout(ctx, "setup"),
    {
      type: "step",
      stepNumber: 1,
      id: "qualify-seats",
      heading: `Start on the ${name} package your must-haves need`,
      body: `Write five day-one jobs for ${job.noun}, map each to researched ${name} packaging, and pick the cheapest tier that covers all five — including seats and guests.\n\n1. List everyone who must log in weekly (not “the whole company”).\n2. Match each day-one job to researched packaging. ${gatedHintSentence(ctx)}\n3. Pick the cheapest package that covers all five jobs.\n4. Confirm guest/viewer rules so clients or execs are not accidentally billed as full seats.\n\n${trialSentence(ctx)}\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} lists the people who will update ${name} every week before they invite lurkers. They refuse a demo tenant that is running on a higher hub than they will buy.`,
      tip: "Homepage tiles are not a bill of materials. Demos often run with inflated seats or top-tier views.",
      figure: teachingFigure(
        ctx,
        "setup",
        1,
        `Package choice decides whether ${name} can even run ${job.noun}.`,
      ),
      scenarios: [
        {
          title: "Right package",
          body: "Must-haves sit on a researched tier you can accept.",
        },
        {
          title: "Demo trap",
          body: "The tour used timeline or automations that unlock later — write the qualifying hub before setup continues.",
        },
        {
          title: "Over-invite",
          body: "Inviting the whole Slack workspace inflates seats before the loop is proven.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "name-owner",
      heading: "Create the workspace and name one owner",
      body: `Name one workspace owner — not a committee — before you invite contributors.\n\n1. Create the workspace with real timezone and company identity.\n2. Give that owner ~2 hours a week for users, board hygiene, and permission changes.\n3. Agree: new boards, automations, and seat upgrades go through that owner for 30 days.\n4. Confirm current control labels in ${name} admin / users settings — do not invent menu names.\n\nWorked example: ${job.team} writes the two-hour ${name} ownership into the week and blocks everyone else from installing marketplace apps until the core loop has a week of real use.`,
      tip: "An unnamed owner is the best predictor of abandoned boards and surprise seat invoices.",
      figure: teachingFigure(
        ctx,
        "setup",
        2,
        `Name Responsible + Accountable for ${name} before anyone builds a second board.`,
      ),
      scenarios: [
        {
          title: "Owned",
          body: "One person can change permissions without a Slack poll.",
        },
        {
          title: "Committee",
          body: "Three “admins” and no hygiene — pause invites.",
        },
        {
          title: "Vendor-owned",
          body: "If only the implementation partner can change a board, you do not own the workspace yet.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "configure-loop",
      heading: "Configure one core loop — not five experiments",
      body: `Configure ${job.setupFirst}. Research-supported surfaces include ${coreLoopPhrase(ctx)}.\n\n1. Stand up one live container of work (board, project, space, sheet, or cycle — whatever ${name} actually uses).\n2. Put real owners and due dates on at least five items.\n3. Open a second view a manager can read without being the builder.\n4. Refuse optional hubs until a non-admin can ${job.prove}.\n\nWorked example: ${job.team} treats a decorated empty workspace as failure. They will not turn on AI or extra automations until ${job.loop}.`,
      tip: "One loop in production beats five unused hubs.",
      figure: teachingFigure(
        ctx,
        "setup",
        3,
        `One trusted ${name} board beats a folder of experiments nobody updates.`,
      ),
      scenarios: [
        {
          title: "Loop live",
          body: "Contributors update the same place managers look.",
        },
        {
          title: "Shadow spreadsheet",
          body: "If status still lives in Sheets, setup is not finished.",
        },
        {
          title: "View sprawl",
          body: "Six unused views hide the one ritual you need.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "non-admin-proof",
      heading: "Invite weekly users, connect the loop, prove non-admin work",
      body: `${trialSentence(ctx)}\n\n1. Invite only people who will update ${name} this week.\n2. Connect Slack, calendar, or files the loop depends on. ${integrationSentence(ctx)}\n3. Success: ${job.prove}.\n4. Record a 10-minute walkthrough for stakeholders who skip hands-on time.\n5. Write a one-page setup note: package, owner, loop, known gaps.\n\nWorked example: ${job.team} is done only when a sceptic contributor finishes the walkthrough without an admin hovering. If that fails, they fix permissions before any go-live speech.`,
      tip: "If only an admin can complete the loop, setup is not finished.",
      figure: teachingFigure(
        ctx,
        "setup",
        4,
        `Exit ${name} setup when a non-admin can finish the work loop unaided.`,
      ),
      scenarios: [
        {
          title: "Proof pass",
          body: "A non-admin completes the loop; a manager sees it without a screenshot.",
        },
        {
          title: "Permission fail",
          body: "Extend the trial and fix roles — do not buy more hubs.",
        },
        {
          title: "Integration fail",
          body: "The loop still depends on a side chat or sheet — reconnect or document the gap.",
        },
      ],
    },
    {
      type: "mistakes",
      id: "setup-mistakes",
      title: `Common ${name} setup mistakes`,
      items: [
        {
          title: "Configuring the demo hub you will not buy",
          body: `If timeline, automations, or guest access only exist on a higher ${name} package, setup on the demo is fiction. Qualify the hub first.`,
        },
        {
          title: "Inviting the whole company on day one",
          body: "Empty seats do not create adoption. Invite weekly users, prove the loop, then expand.",
        },
        {
          title: "Treating it as every PM job",
          body: `${name} is ${job.noun}. Stretching it into ${job.notPeer} produces a messy workspace and a second tool anyway.`,
        },
        {
          title: "Automations before a weekly ritual",
          body: "Automations amplify garbage. Get humans updating the board first.",
        },
        {
          title: "Skipping non-admin proof",
          body: "A polished admin tour is not evidence. If a contributor cannot finish the loop, you do not have a working system.",
        },
      ],
    },
    {
      type: "expert-tip",
      id: "setup-tip",
      title: "Setup exit test",
      body: `${job.team.split(" (")[0]} should be able to ${job.prove} on the package you will actually buy. Until that is true, you are still in setup — even if the workspace looks pretty.`,
    },
    {
      type: "faq",
      id: "setup-faq",
      title: `${name} setup FAQ`,
      items: [
        {
          question: "When is setup actually done?",
          answer: `When a non-admin can ${job.prove} on the package you will buy, and you have a named owner with weekly hours. A decorated workspace is not done.`,
        },
        {
          question: `Should we turn on every ${name} hub on day one?`,
          answer: `No. Extra hubs hide whether the core ${job.noun} loop works. Add views and automations after a week of real updates.`,
        },
        {
          question: "How long should day-zero take?",
          answer: `A focused team can finish in one working day if package, owner, and the first board are already decided. Multi-week “setup” usually means undecided packaging or missing ownership.`,
        },
        {
          question: "Do we need Slack connected on day one?",
          answer: `Only if the work loop depends on it. ${integrationSentence(ctx)} Document gaps instead of wiring a marketplace zoo.`,
        },
        {
          question: `Where do we confirm seats and hubs?`,
          answer: pricingPointer(ctx),
        },
        {
          question: `Is ${name} the same as monday sales CRM?`,
          answer:
            name.includes("monday")
              ? "No. monday sales CRM is CRM-primary. This guide is about work management / work OS — boards, timelines, and delivery visibility."
              : `${name} is evaluated here as ${job.noun}. Do not assume a sibling product (CRM, ITSM, or docs) is the same workspace.`,
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

function buildPmImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const job = pmJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in gated phases: freeze 90-day outcomes for ${job.noun}, name an owner, configure the core loop, train the people who must update it weekly, then review adoption before adding automations or extra hubs.${quickGateHint(ctx)} Treat ${name} implementation as phases — not a feature dump in week one.`,
      bullets: [
        "Freeze 90-day outcomes in writing",
        "Name an admin owner with hours",
        "Days 1–30: core loop only",
        "Days 31–60: train weekly users + sceptics",
        "Days 61–90: adoption review, then extras",
        "Do not implement it as the wrong job cluster",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} rollout rules`,
      items: [
        {
          label: "Job cluster first",
          body: `${name} is ${job.noun}. Do not implement it as ${job.notPeer}.`,
        },
        {
          label: "Adoption before add-ons",
          body: `If ${job.team.split(" (")[0]} will not open the product weekly, extra hubs will not save the rollout.`,
        },
        {
          label: "Integrations are a phase",
          body: integrationSentence(ctx),
        },
        {
          label: "AI is optional",
          body: aiSentence(ctx),
        },
        {
          label: "Measure the ritual",
          body: `Success is ${job.loop} — not a kickoff deck.`,
        },
      ],
    },
    {
      type: "decision-framework",
      id: "impl-path",
      title: `${name} 30/60/90`,
      steps: [
        { id: "outcomes", label: "Outcomes", short: "90 days" },
        { id: "d30", label: "Days 1–30", short: "Core loop" },
        { id: "d60", label: "Days 31–60", short: "Train" },
        { id: "d90", label: "Days 61–90", short: "Adoption" },
        { id: "extras", label: "Extras", short: "Then hubs" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.setup}/`,
      ctaLabel: "Setup guide →",
    },
    {
      type: "figure",
      id: "impl-diagram",
      title: `${name} 30/60/90`,
      src: ctx.figureSrc("implementation"),
      alt: `${name} 30/60/90 rollout for ${job.noun}.`,
      caption: `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    },
    mustNiceMatrix(ctx, "implementation", [
      {
        feature: "Weekly update ritual",
        mustHave: true,
        niceToHave: false,
        notes: job.loop,
      },
      {
        feature: "Sceptic user in training",
        mustHave: true,
        niceToHave: false,
        notes: "If sceptics will not open it, the rollout is theatre",
      },
      {
        feature: "Named admin hours",
        mustHave: true,
        niceToHave: false,
        notes: "~2 hours/week for hygiene",
      },
      {
        feature: "Automations and AI",
        mustHave: false,
        niceToHave: true,
        notes: "After adoption review",
      },
    ]),
    {
      type: "step",
      stepNumber: 1,
      id: "freeze-outcomes",
      heading: "Freeze 90-day outcomes before configuration sprawl",
      body: `Write three outcomes ${name} must change — status visibility, owner accountability, or time-to-update — and who owns each.\n\n1. Name the job: ${job.noun}. Explicitly exclude ${job.notPeer}.\n2. Pick three measurable rituals (example: Friday status lives in ${name}, not Slack).\n3. Name the admin owner and the weekly users.\n4. List nice-to-haves you will refuse until day 61.\n\nWorked example: ${job.team} freeze “replace the status spreadsheet” as the only 90-day outcome. Portfolio dashboards wait.`,
      tip: "If you cannot name the ritual, you are buying software for a vibe.",
      figure: teachingFigure(
        ctx,
        "implementation",
        1,
        `Freeze ${name} outcomes before anyone installs extra views.`,
      ),
      scenarios: [
        {
          title: "Clear outcomes",
          body: "Three rituals, named owner, written exclusions.",
        },
        {
          title: "Feature dump",
          body: "Kickoff lists every hub — pause and cut to the core loop.",
        },
        {
          title: "Wrong cluster",
          body: `If the real job is ${job.notPeer}, stop this rollout and pick a different product.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "days-30",
      heading: "Days 1–30: core loop only",
      body: `Configure ${job.setupFirst}. Success looks like: ${job.loop}.\n\n1. One live container of work with real owners.\n2. No marketplace apps except the connectors the loop needs. ${integrationSentence(ctx)}\n3. A manager can see status without asking for a screenshot.\n4. Log every “can we also…” request for day 61.\n\nWorked example: ${job.team} delays optional AI and extra hubs until the core loop has a week of real use. Week-one marketplace apps are treated as a failure mode.`,
      tip: "Week-one marketplace apps are a common failure mode.",
      figure: teachingFigure(
        ctx,
        "implementation",
        2,
        `Days 1–30 of ${name}: one loop in production, everything else parked.`,
      ),
      scenarios: [
        {
          title: "On track",
          body: "Weekly users update without nagging; managers look in-product.",
        },
        {
          title: "Shadow tool",
          body: "Slack or Sheets still hold status — do not start phase two.",
        },
        {
          title: "Admin-only",
          body: "If only the owner can update items, fix permissions before training.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "days-60",
      heading: "Days 31–60: train weekly users — include a sceptic",
      body: `Train the people who must update ${name} every week — not a one-time all-hands. ${trialSentence(ctx)}\n\n1. Role-based sessions: contributors vs managers vs guests.\n2. Include one sceptic so adoption risk shows up before speeches.\n3. Practice ${job.prove} live — no slideware-only training.\n4. Capture every question as a training-cost line, not a feature request.\n\nWorked example: ${job.team} includes one sceptic user in training so “I still ping the owner in Slack” shows up while you can still fix the ritual.`,
      tip: "If sceptics will not open it, fix the ritual before buying more seats.",
      figure: teachingFigure(
        ctx,
        "implementation",
        3,
        `Train ${name} as a weekly ritual, not a kickoff webinar.`,
      ),
      scenarios: [
        {
          title: "Ritual sticks",
          body: "Sceptics update without a chase list.",
        },
        {
          title: "Training theatre",
          body: "Attendance was high; updates were not — rerun with live work.",
        },
        {
          title: "Guest confusion",
          body: "Clients or execs need a viewer path that is not a full seat.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "days-90",
      heading: "Days 61–90: adoption review, then extras",
      body: `Check whether the core loop is actually used. Only then add automations, extra hubs, or AI.\n\n1. Count weekly active updaters vs invited seats.\n2. Confirm managers stopped asking for spreadsheet status.\n3. Review watch-outs. ${ctx.weaknesses.length > 0 ? `Research flags: ${clauses(ctx.weaknesses, 3)}.` : `Confirm limitations in the ${name} review.`}\n4. Unlock one extra: automations or a dashboard — not both in the same week.\n\nWorked example: ${job.team} reviews whether ${job.loop} happened for four consecutive weeks before expanding scope. Empty dashboards mean the rollout is not done.`,
      tip: "Empty dashboards mean the rollout is not done.",
      figure: teachingFigure(
        ctx,
        "implementation",
        4,
        `Day 90 of ${name}: prove adoption, then add automations — never the reverse.`,
      ),
      scenarios: [
        {
          title: "Adopted",
          body: "Core loop is boring and reliable — extras are earned.",
        },
        {
          title: "Partial",
          body: "One team lives in it; others do not — do not buy enterprise hubs yet.",
        },
        {
          title: "Failed ritual",
          body: "Reset to setup: fewer seats, clearer owner, one board.",
        },
      ],
    },
    {
      type: "mistakes",
      id: "impl-mistakes",
      title: `Common ${name} implementation mistakes`,
      items: [
        {
          title: "Feature dump in week one",
          body: "Turning on every view trains nobody. Freeze the core loop for 30 days.",
        },
        {
          title: "All-hands instead of weekly users",
          body: "A kickoff webinar is not a ritual. Train the people who must update the board.",
        },
        {
          title: "No sceptic in the room",
          body: "Cheerleaders will nod. A sceptic will show you the Slack workaround.",
        },
        {
          title: "Implementing the wrong cluster",
          body: `${name} should not be stretched into ${job.notPeer}. Buy the second job as a second product or a later wave.`,
        },
        {
          title: "Automations as a substitute for ownership",
          body: "If humans will not update items, rules will just move stale cards faster.",
        },
      ],
    },
    phaseChecklist(ctx, "implementation", [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name a workspace owner",
        description: "Boards, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ]),
    researchCallout(ctx, "implementation"),
    {
      type: "faq",
      id: "impl-faq",
      title: `${name} implementation FAQ`,
      items: [
        {
          question: "How long should rollout take?",
          answer:
            "Ninety days is enough for most SMB/mid teams if you freeze the job and defer extras. Longer programmes help when change management is the risk — not when the product is “complex.”",
        },
        {
          question: "What if we also need a different work-management job?",
          answer: `Buy the second job as a second product (or a later wave). ${name} should not be stretched into ${job.notPeer}.`,
        },
        {
          question: "When do automations belong?",
          answer: `After four weeks of humans completing ${job.loop}. Automating a dead board just creates faster garbage.`,
        },
        {
          question: "Do we need professional services?",
          answer: `Only if you cannot name an internal owner. A partner cannot substitute for weekly users. Confirm any implementation fees on the pricing page — do not invent them here.`,
        },
        {
          question: "What if adoption is low at day 60?",
          answer: `Do not buy more seats. Cut invited users to the people who must update ${name}, fix permissions, and rerun non-admin proof.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

function buildPmMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = pmJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Migrate into ${name} with an inventory of ${job.migrateObjects}, a field map, a pilot import, a dual-run week, and validation with the people who live in the data — so history survives and the team trusts the new system. Do not big-bang cutover from a messy spreadsheet on a Friday.`,
      bullets: [
        "Inventory source objects before mapping",
        "Map fields — do not invent columns",
        "Pilot one project / team / client",
        "Dual-run for a week",
        "Validate with sceptic users",
        "Archive messy history instead of poisoning the new board",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} migration rules`,
      items: [
        {
          label: "Inventory first",
          body: `Typical objects: ${job.migrateObjects}.`,
        },
        {
          label: "Pilot beats big-bang",
          body: `Prove a small ${name} import before you move everything.`,
        },
        {
          label: "Integrations after the pilot",
          body: integrationSentence(ctx),
        },
        {
          label: "Do not migrate the wrong job",
          body: `${name} is ${job.noun}. Do not import a CRM pipeline or a marketing course catalogue and expect it to become ${job.noun}.`,
        },
        {
          label: "Sceptics validate",
          body: "If the people who live in the data do not trust the import, managers will not either.",
        },
      ],
    },
    {
      type: "decision-framework",
      id: "migration-path",
      title: `${name} migration path`,
      steps: [
        { id: "inventory", label: "Inventory", short: "Objects" },
        { id: "map", label: "Map", short: "Fields" },
        { id: "pilot", label: "Pilot", short: "One team" },
        { id: "dual", label: "Dual-run", short: "One week" },
        { id: "cutover", label: "Cutover", short: "Freeze legacy" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.setup}/`,
      ctaLabel: "Setup guide →",
    },
    {
      type: "figure",
      id: "migration-diagram",
      title: `${name} migration map`,
      src: ctx.figureSrc("migration"),
      alt: `${name} migration map for ${job.migrateObjects}.`,
      caption: `Prove a small ${name} import before you move the whole operation.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "inventory",
      heading: "Inventory source objects and decide what not to bring",
      body: `List ${job.migrateObjects} in the current source (Sheets, another work OS, or email). Mark each: migrate live, archive as files, or drop.\n\n1. Count live vs stale items — stale work should not become “To do” in ${name}.\n2. Capture owners, dates, comments, and attachments as first-class — not as a notes dump.\n3. Write the exclusions: personal lists, duplicate boards, and the wrong job cluster (${job.notPeer}).\n\nWorked example: ${job.team} inventories 14 spreadsheets and migrates two production boards. The rest become a read-only archive folder.`,
      tip: "A complete inventory includes what you will deliberately leave behind.",
      figure: teachingFigure(
        ctx,
        "migration",
        1,
        `Inventory ${job.migrateObjects} before anyone draws a field map.`,
      ),
      scenarios: [
        {
          title: "Live set",
          body: "You can name the boards that still get weekly updates.",
        },
        {
          title: "Museum",
          body: "Five years of stale rows — archive files, do not import as open work.",
        },
        {
          title: "Wrong objects",
          body: `If you are mapping CRM deals or LMS courses, stop — ${name} is ${job.noun}.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "field-map",
      heading: "Map fields before you touch bulk import",
      body: `Build a field map: source column → ${name} property → transform → owner.\n\n1. Owners must resolve to real users, not free-text names.\n2. Status values must match the lists you will actually use.\n3. Dates and timezones need an explicit rule.\n4. Comments/files either attach or get a documented “not migrating” label.\n\nWorked example: ${job.team} refuses to import until 20 sample rows survive the map without a mystery column.`,
      tip: "A pretty mapping spreadsheet is not a successful import.",
      figure: teachingFigure(
        ctx,
        "migration",
        2,
        `Map owners, status, and dates into ${name} before bulk load.`,
      ),
      scenarios: [
        {
          title: "Clean map",
          body: "Every required field has a source and an owner.",
        },
        {
          title: "Mystery columns",
          body: "Unmapped fields become a Notes dumping ground — stop and decide.",
        },
        {
          title: "Orphan owners",
          body: "If names do not match seats, the board will look assigned and be ownerless.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "pilot",
      heading: "Pilot import one team — then run the real loop",
      body: `Import one site, one role, one client, or one squad. Then run ${job.loop} on the pilot set.\n\n1. Import, then immediately ${job.prove}.\n2. Ask a sceptic user to find “their” items without help.\n3. Time how long a manager takes to answer “what is late?”\n4. Fix the map before the next batch.\n\nWorked example: ${job.team} will not schedule a cutover until the pilot can ${job.prove}.`,
      tip: "If the pilot needs an admin to interpret the board, the map is wrong.",
      figure: teachingFigure(
        ctx,
        "migration",
        3,
        `Pilot one ${name} import and run the live loop before you scale.`,
      ),
      scenarios: [
        {
          title: "Pilot pass",
          body: "Sceptics find their work; managers see status without a sheet.",
        },
        {
          title: "Pilot messy",
          body: "Fix mapping and permissions; do not import the rest “to save time.”",
        },
        {
          title: "Pilot empty",
          body: "You imported structure without live items — that is not a pilot.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "cutover",
      heading: "Dual-run a week, then freeze the legacy source",
      body: `Run old and new in parallel for a week. Spot-check records sceptic users care about, then freeze the legacy source.\n\n1. Dual-run rules: ${name} is the write path; the old sheet is read-only after day 3 if the pilot held.\n2. Daily: five sceptic spot-checks (late items, owners, attachments).\n3. Connect remaining integrations only after the pilot week. ${integrationSentence(ctx)}\n4. Cut over on a quiet day — not month-end reporting.\n\nWorked example: ${job.team} keeps the old export until ${name} matches for seven consecutive days, then revokes edit access on the spreadsheet.`,
      tip: "Cut over on a quiet day, not during a client deadline or month-end report.",
      figure: teachingFigure(
        ctx,
        "migration",
        4,
        `Dual-run ${name} for a week, then freeze the legacy source.`,
      ),
      scenarios: [
        {
          title: "Cutover ready",
          body: "Seven matching days; sceptics stopped using the sheet.",
        },
        {
          title: "Split brain",
          body: "People still edit both — extend dual-run and kill one write path.",
        },
        {
          title: "History poison",
          body: "Import active records only; archive messy history as files.",
        },
      ],
    },
    {
      type: "mistakes",
      id: "migration-mistakes",
      title: `Common ${name} migration mistakes`,
      items: [
        {
          title: "Big-bang Friday cutover",
          body: "You will spend the weekend reconstructing owners from Slack. Pilot + dual-run exists to avoid that.",
        },
        {
          title: "Importing the museum",
          body: "Stale rows become fake backlog. Archive them.",
        },
        {
          title: "Skipping sceptic validation",
          body: "Admins always think the import looks fine. Operators find the missing attachments.",
        },
        {
          title: "Migrating the wrong product job",
          body: `If the source is really ${job.notPeer}, ${name} will not become that system by import.`,
        },
        {
          title: "Wiring every integration on night one",
          body: "Broken sync on a bad map multiplies errors. Integrations after the pilot.",
        },
      ],
    },
    phaseChecklist(ctx, "migration", [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: job.migrateObjects,
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ]),
    researchCallout(ctx, "migration"),
    {
      type: "faq",
      id: "migration-faq",
      title: `${name} migration FAQ`,
      items: [
        {
          question: "Can we skip the dual-run?",
          answer:
            "Only if the dataset is tiny and reversible. Most SMB/mid teams regret skipping a week of parallel use.",
        },
        {
          question: "What if history will not map cleanly?",
          answer:
            "Import active records first. Archive messy history as files rather than poisoning the new system of record.",
        },
        {
          question: "Should comments and files come over?",
          answer:
            "If people still need them to do the work, yes. If they are CYA noise, archive. Decide per object in the inventory, not during bulk load.",
        },
        {
          question: "Who should run the import?",
          answer: `The workspace owner plus one operator from ${job.team.split(" (")[0]} — not a vendor alone. Operators catch mapping errors vendors will not see.`,
        },
        {
          question: "When do we connect Slack?",
          answer: `After the pilot loop works in ${name} without chat as the system of record. ${integrationSentence(ctx)}`,
        },
      ],
    },
    relatedLinks(ctx, "migration"),
    interactiveCta(ctx, "migration"),
  ]);
}

function buildPmPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = pmJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} plan by mapping must-haves for ${job.noun} to a qualifying tier — seats, guests, views, and add-ons included — not by comparing homepage “from” tiles.${quickGateHint(ctx)} ${pricingPointer(ctx)}`,
      bullets: [
        "List day-one must-haves for the job cluster",
        "Map each to a researched qualifying plan",
        "Price guests / viewers separately from full seats",
        "Confirm trial or free proving ground",
        "Get the qualifying configuration in writing",
        "Never invent a spreadsheet total in this guide",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} packaging rules`,
      items: [
        {
          label: "Tiles are the bottom layer",
          body: planSoftener(ctx),
        },
        {
          label: "Gates change the bill",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Prove on the package you will buy",
          body: trialSentence(ctx),
        },
        {
          label: "Job cluster first",
          body: `Must-haves should match ${job.loop}. Do not pay for hubs that serve ${job.notPeer}.`,
        },
      ],
    },
    {
      type: "decision-framework",
      id: "plans-path",
      title: `${name} plan path`,
      steps: [
        { id: "musts", label: "Must-haves", short: "Day one" },
        { id: "map", label: "Map", short: "Qualifying tier" },
        { id: "capacity", label: "Capacity", short: "Seats/guests" },
        { id: "quote", label: "Quote", short: "In writing" },
      ],
      ctaHref: ctx.pricingHref,
      ctaLabel: "Pricing page →",
    },
    {
      type: "figure",
      id: "plans-diagram",
      title: `${name} plan anatomy`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy: seats, gates, add-ons.`,
      caption: `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    },
    {
      type: "cost-breakdown",
      id: "plans-cost-shape",
      title: `What actually shapes a ${name} bill`,
      body: `We do not invent list prices here. Use this anatomy, then confirm live numbers on the ${name} pricing page.`,
      lines: [
        {
          label: "Full seats",
          description:
            "People who create and update work weekly — not everyone in Slack.",
        },
        {
          label: "Guests / viewers",
          description:
            "Clients and execs often need a cheaper or free viewer path. Confirm whether they count as seats.",
        },
        {
          label: "Feature gates / hubs",
          description: gatedHintSentence(ctx),
        },
        {
          label: "Add-ons and AI",
          description: aiSentence(ctx),
        },
        {
          label: "Implementation time",
          description:
            "Internal owner hours plus any vendor onboarding — get fees in writing; do not invent them.",
        },
      ],
      calculatorHref: ctx.pricingHref,
      calculatorLabel: `Open ${name} pricing →`,
    },
    {
      type: "size-match",
      id: "plans-size",
      title: `Who ${name} packaging usually fits`,
      tiers: [
        {
          id: "small",
          label: "Small crew (about 5–15 weekly users)",
          description: `Fits when ${job.noun} is the job and you can live without enterprise portfolio controls.`,
          fitHints: [
            "One workspace owner",
            "One live board or project",
            "Guests only if the plan allows",
          ],
        },
        {
          id: "mid",
          label: "Cross-functional team (about 15–50)",
          description:
            "Fits when managers need a second view and you will admin the tool weekly.",
          fitHints: [
            "Named admin hours",
            "Intake or automations on a qualifying hub",
            "Stop shadow spreadsheets",
          ],
        },
        {
          id: "scale",
          label: "Portfolio / multi-team",
          description: `Fits only if ${name} is still ${job.noun} at that scale — not if you actually needed ${job.notPeer}.`,
          fitHints: [
            "Written qualifying configuration",
            "Guest vs seat rules",
            "Adoption review before more hubs",
          ],
        },
      ],
    },
    mustNiceMatrix(ctx, "plans", [
      {
        feature: "Core loop on the qualifying plan",
        mustHave: true,
        niceToHave: false,
        notes: job.loop,
      },
      {
        feature: "Seats for weekly users",
        mustHave: true,
        niceToHave: false,
        notes: "Lurkers are not a reason to over-buy",
      },
      {
        feature: featurePhrase(ctx),
        mustHave: true,
        niceToHave: false,
        notes: "Map each capability to a researched plan name",
      },
      {
        feature: "AI / extra hubs",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
    {
      type: "step",
      stepNumber: 1,
      id: "list-musts",
      heading: "List day-one must-haves for this job cluster",
      body: `Must-haves should match ${job.loop}. Research-supported features include ${featurePhrase(ctx)}.\n\n1. Write five things the team must do in week one.\n2. Mark each must vs nice.\n3. Drop anything that is actually ${job.notPeer}.\n\nWorked example: ${job.team} drops a cheaper tile when the must-have workflow unlocks only on a higher hub.`,
      tip: "A must-have you will not use in 90 days is a nice-to-have in disguise.",
      figure: teachingFigure(
        ctx,
        "plans",
        1,
        `Start ${name} packaging from the ${job.noun} loop — not from a “from” tile.`,
      ),
      scenarios: [
        {
          title: "Honest musts",
          body: "Five jobs, all used weekly.",
        },
        {
          title: "Wishlist",
          body: "Twelve musts including unused AI — cut to five.",
        },
        {
          title: "Wrong job",
          body: `If musts describe ${job.notPeer}, this product’s packaging will not save you.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "map-tier",
      heading: "Map must-haves to a researched qualifying plan",
      body: `${planSoftener(ctx)}\n\n1. For each must-have, write the lowest researched ${name} plan that includes it. ${gatedHintSentence(ctx)}\n2. The highest plan on that list is the qualifying tier — not the homepage starter tile.\n3. Check guests and view-only seats separately.\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} discovers timeline or automations force a higher hub than the tile they screenshotted, so they re-qualify before a trial.`,
      tip: "The qualifying plan is the cheapest tier that covers must-haves — not the cheapest logo on the pricing grid.",
      figure: teachingFigure(
        ctx,
        "plans",
        2,
        `Map ${name} must-haves upward until every day-one job unlocks.`,
      ),
      scenarios: [
        {
          title: "Mapped",
          body: "Every must-have has a researched plan name.",
        },
        {
          title: "Tile shopping",
          body: "You compared “from” prices across vendors — restart from must-haves.",
        },
        {
          title: "Quote-only",
          body: "If there is no public matrix, get the configuration in writing before you call it cheap.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "prove-package",
      heading: "Prove the loop on the package you will buy",
      body: `${trialSentence(ctx)}\n\n1. Run ${job.prove} on the qualifying hub — not a demo enterprise workspace.\n2. Confirm guest/viewer behaviour if clients or execs must see status.\n3. Write the configuration: seats, hubs, add-ons, billing term.\n\nWorked example: ${job.team} fails the gate when the trial ran Pro features they will not purchase. They restart the trial on the written package.`,
      tip: "A trial on the wrong hub is a marketing exercise.",
      figure: teachingFigure(
        ctx,
        "plans",
        3,
        `Trial ${name} on the qualifying package — not the demo’s extra hubs.`,
      ),
      scenarios: [
        {
          title: "Honest trial",
          body: "Loop works on the hub you will pay for.",
        },
        {
          title: "Inflated trial",
          body: "Ask the vendor which package the tenant is on, in writing.",
        },
        {
          title: "Free-plan trap",
          body: "Free is a proving ground only if must-haves actually live there.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "quote",
      heading: "Get the qualifying configuration in writing",
      body: `1. Seats (weekly users only).\n2. Guests/viewers.\n3. Hubs and add-ons the trial proved.\n4. Implementation or onboarding fees if any — do not invent them.\n5. Annual vs monthly only after the configuration is frozen.\n\nWorked example: ${job.team} will not sign until the qualifying hub and guest rules are in an email they can attach to the buy decision.`,
      tip: "Annual discounts do not fix the wrong hub.",
      figure: teachingFigure(
        ctx,
        "plans",
        4,
        `Buy ${name} from a written configuration — never from a homepage tile.`,
      ),
      scenarios: [
        {
          title: "Written",
          body: "Seats, guests, hubs, term — attached to the decision.",
        },
        {
          title: "Verbal extra",
          body: "If a feature was “included in the demo,” it is not included until it is written.",
        },
        {
          title: "Walk",
          body: "If packaging stays vague, keep looking via how to choose project management software.",
        },
      ],
    },
    phaseChecklist(ctx, "plans", [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, guests, add-ons, and implementation fees.",
      },
    ]),
    researchCallout(ctx, "plans"),
    {
      type: "faq",
      id: "plans-faq",
      title: `${name} plans FAQ`,
      items: [
        {
          question: `Does a free ${name} plan count?`,
          answer: trialSentence(ctx),
        },
        {
          question: "Should we pay annually?",
          answer:
            "Only after the qualifying configuration is written. Annual discounts do not fix the wrong hub.",
        },
        {
          question: "How do we treat guests?",
          answer:
            "Count people who must log in weekly as seats. Confirm whether clients and execs are guests, viewers, or billable users on the pricing page.",
        },
        {
          question: "Can we compare “from” prices across tools?",
          answer:
            "Not usefully. Compare qualifying configurations for the same must-haves. Tiles omit gates.",
        },
        {
          question: "Where are the actual numbers?",
          answer: pricingPointer(ctx),
        },
      ],
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

function buildPmWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = pmJob(ctx);
  const alts = peerSlugs(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth it when your primary job is ${job.noun}, a non-admin can ${job.prove} on the package you will buy, and you can live with the researched tradeoffs. It is not worth stretching into ${job.notPeer}.${quickGateHint(ctx)} If fit, proof, or packaging fails, keep looking — do not invent ROI to justify a shaky buy.`,
      bullets: [
        "Fit the job cluster",
        "Prove the core loop with a non-admin",
        "Accept tradeoffs in writing",
        "Confirm the qualifying package",
        "Name an admin with weekly hours",
        "Otherwise keep looking",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `Is ${name} worth it?`,
      items: compact([
        {
          label: "What it is",
          body: positioningSentence(ctx),
        },
        {
          label: "Fit",
          body: `Best for: ${bestForPhrase(ctx)}. Not ideal: ${notIdealPhrase(ctx)}.`,
        },
        {
          label: "Proof",
          body: `Worth it only when ${job.team} can ${job.prove}.`,
        },
        {
          label: "Package",
          body: gatedHintSentence(ctx),
        },
        {
          label: "No invented ROI",
          body: "Outcomes, usability, and qualifying cost either align or they don’t — affiliate economics are not a score.",
        },
        ctx.verdict
          ? { label: "Editorial verdict snapshot", body: ctx.verdict }
          : ctx.recommendation
            ? { label: "Editorial recommendation", body: ctx.recommendation }
            : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "worth-it-path",
      title: `${name} worth-it gates`,
      steps: [
        { id: "fit", label: "Fit", short: "Job cluster" },
        { id: "proof", label: "Proof", short: "Non-admin loop" },
        { id: "tradeoffs", label: "Tradeoffs", short: "Accept?" },
        { id: "package", label: "Package", short: "Qualifying hub" },
        { id: "decide", label: "Decide", short: "Buy/pass" },
      ],
      ctaHref: ctx.reviewHref,
      ctaLabel: "Full review →",
    },
    {
      type: "figure",
      id: "worth-it-diagram",
      title: `${name} fit / proof / package`,
      src: ctx.figureSrc("worth-it"),
      alt: `${name} worth-it gates: fit, proof, package.`,
      caption: `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    },
    {
      type: "selection-checklist",
      id: "worth-it-dimensions",
      title: `${name} fit checklist`,
      dimensions: [
        {
          id: "job",
          label: "Primary job",
          options: [job.noun, job.notPeer, "not sure yet"],
        },
        {
          id: "users",
          label: "Who updates weekly",
          options: [
            "named contributors will live in it",
            "managers only",
            "nobody has hours",
          ],
        },
        {
          id: "admin",
          label: "Workspace owner",
          options: [
            "~2 hours/week named",
            "committee / TBD",
            "vendor will admin forever",
          ],
        },
        {
          id: "views",
          label: "Visibility need",
          options: [
            "board + one manager view",
            "portfolio / Gantt reporting",
            "personal lists only",
          ],
        },
      ],
    },
    {
      type: "crm-types",
      id: "job-clusters",
      title: "Do not buy the wrong work-management cluster",
      types: [
        {
          id: "work-os",
          title: "Work OS / collaborative projects",
          bestFor:
            "Shared ownership, boards or action cards, manager visibility across functions.",
          avoidWhen:
            "You actually need an engineering tracker, a Gantt slide, or a PDF editor.",
        },
        {
          id: "eng-tracker",
          title: "Engineering issue tracking",
          bestFor: "Issues, sprints/cycles, developer boards, release comments.",
          avoidWhen: "Marketing campaigns and client proofing are the real job.",
        },
        {
          id: "spreadsheet-pmo",
          title: "Spreadsheet PMO",
          bestFor: "Dependencies, reports, and stakeholders who think in grids.",
          avoidWhen: "You wanted a lightweight personal to-do list.",
        },
        {
          id: "docs-first",
          title: "Docs + databases",
          bestFor: "Project docs linked to task databases.",
          avoidWhen: "You need a dedicated sprint tracker or Gantt presenter.",
        },
      ],
    },
    mustNiceMatrix(ctx, "worth-it", [
      {
        feature: "Job-cluster fit",
        mustHave: true,
        niceToHave: false,
        notes: job.noun,
      },
      {
        feature: "Non-admin loop",
        mustHave: true,
        niceToHave: false,
        notes: job.prove,
      },
      {
        feature: "Qualifying package",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "Demo excitement / brand preference",
        mustHave: false,
        niceToHave: true,
        notes: "Not a buy signal",
      },
    ]),
    {
      type: "size-match",
      id: "worth-it-size",
      title: `When ${name} is the right size of tool`,
      tiers: [
        {
          id: "fit-size",
          label: "Likely worth evaluating",
          description: `Your motion looks like ${job.noun} and someone will admin ${name} weekly.`,
          fitHints: [bestForPhrase(ctx)],
        },
        {
          id: "stretch",
          label: "Borderline — trial hard",
          description:
            "Needs are real but admin capacity is thin, or one must-have sits on a higher hub.",
          fitHints: [
            "Set a decide-by date",
            "Prove the loop on the qualifying package",
          ],
        },
        {
          id: "skip",
          label: "Usually not worth it",
          description: `The blocking job is ${job.notPeer}, or nobody will update the board.`,
          fitHints: [notIdealPhrase(ctx)],
        },
      ],
    },
    {
      type: "integration-ecosystem",
      id: "worth-it-integrations",
      title: `${name} connectors to verify in trial`,
      hubLabel: "Work OS",
      systems: integrationSystems(ctx),
      body: integrationSentence(ctx),
    },
    {
      type: "comparison-framework",
      id: "worth-it-criteria",
      title: `How to judge ${name} against peers`,
      criteria: [
        {
          id: "cluster",
          label: "Job-cluster match",
          weight: 5,
          description: `Does the product’s primary job match ${job.noun}?`,
        },
        {
          id: "loop",
          label: "Non-admin loop",
          weight: 5,
          description: job.prove,
        },
        {
          id: "visibility",
          label: "Manager visibility",
          weight: 4,
          description: "A lead can see status without a screenshot or side sheet.",
        },
        {
          id: "package",
          label: "Qualifying packaging",
          weight: 4,
          description: "Must-haves on a real tier; guests/seats understood.",
        },
        {
          id: "admin",
          label: "Admin load",
          weight: 3,
          description: "Someone has weekly hours; hygiene is possible.",
        },
      ],
    },
    {
      type: "scorecard",
      id: "worth-it-scorecard",
      title: `${name} evaluation scorecard (no invented scores)`,
      body: `Weight the criteria; fill scores from your trial — SoftwareGlimpse does not invent a numeric ROI or a “worth it %.”`,
      criteria: [
        { id: "fit", label: "Job-cluster fit", weight: 5 },
        { id: "proof", label: "Non-admin proof", weight: 5 },
        { id: "package", label: "Qualifying package", weight: 4 },
        { id: "admin", label: "Admin capacity", weight: 3 },
        { id: "tradeoffs", label: "Accepted tradeoffs", weight: 3 },
      ],
      productSlugs: [ctx.productSlug, ...alts.slice(0, 2)],
    },
    {
      type: "product-shortlist",
      id: "worth-it-shortlist",
      title: "If fit fails, compare inside the same cluster",
      body: `Do not rank ${name} against a PDF editor or a remote-desktop tool. Stay in the same job cluster.`,
      productSlugs: alts,
      disclaimer:
        "Shortlist is cluster-matched from the catalogue — not an affiliate-ordered ranking and not a score.",
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: `Your motion should be ${job.noun}.`,
      },
      {
        id: "trial",
        label: "Prove the work loop",
        description: job.prove,
      },
      {
        id: "plan",
        label: "Confirm seats and hubs",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
      {
        id: "decide",
        label: "Write buy · extend · pass",
        description: "One page, named reasons, no invented ROI.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
    {
      type: "step",
      stepNumber: 1,
      id: "fit-gate",
      heading: "Fit gate: does your motion match this job cluster?",
      body: `Answer yes or no. Four or more “no” answers means ${name} is the wrong tool right now.\n\n1. Is your primary job ${job.noun} — not ${job.notPeer}?\n2. Best for: ${bestForPhrase(ctx)}.\n3. Not ideal: ${notIdealPhrase(ctx)}.\n4. Will named contributors update ${name} weekly?\n5. Is there an admin with ~2 hours a week?\n\nWorked example: ${job.team} scores ${name} on ${job.noun} only — they refuse to treat it as ${job.notPeer}. A polished demo does not change the score.`,
      tip: "Demo excitement is not a fit signal.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        1,
        `Fit ${name} to ${job.noun} before you talk ROI.`,
      ),
      scenarios: [
        {
          title: "Strong fit",
          body: "Motion matches best-for; admin named; contributors will live in it.",
        },
        {
          title: "Borderline",
          body: "Needs are real but admin capacity is thin — trial hard, set a decide-by date.",
        },
        {
          title: "Poor fit",
          body: `Poor-fit patterns dominate — compare ${joinList(ctx.alternativeNames, 2) || alts.join(", ")} inside the same cluster.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "trial-proof",
      heading: "Proof gate: scripted non-admin loop — not a guided demo",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\n1. Use real work, not sample data.\n2. Give the loop to the least enthusiastic contributor.\n3. A manager must see the result without an admin screenshot.\n4. Break something on purpose (reassign, filter, export) and time the recovery.\n\nWorked example: ${job.team} fails the gate when only an admin can complete the walkthrough; they extend trial and fix permissions before considering buy.`,
      tip: "Vendor tours do not count as proof. A demo proves the vendor can use the product.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        2,
        `${name} is worth it only when your team can run the loop.`,
      ),
      scenarios: [
        {
          title: "Trial pass",
          body: "Non-admin loop works; manager visibility works.",
        },
        {
          title: "Trial ambiguous",
          body: "Extend once with one written question that would close it.",
        },
        {
          title: "Trial fail",
          body: "Contributors need babysitting for basic updates — that does not improve after purchase.",
        },
      ],
    },
    {
      type: "trial-plan",
      id: "worth-it-trial-script",
      title: `${name} evaluation script`,
      days: [
        {
          day: 1,
          focus: "Honest workspace",
          tasks: [
            `Confirm which ${name} package the trial tenant is on`,
            `Stand up ${job.setupFirst}`,
            "Invite only weekly users plus one sceptic",
          ],
        },
        {
          day: 3,
          focus: "Non-admin loop",
          tasks: [
            job.prove,
            "Manager finds status without a screenshot",
            "Write down every question asked",
          ],
        },
        {
          day: 7,
          focus: "Weekly ritual",
          tasks: [
            `Run one status review entirely in ${name}`,
            "Reassign an owner and check history",
            `Test: ${featurePhrase(ctx)}`,
          ],
        },
        {
          day: 14,
          focus: "Decide",
          tasks: [
            "Score fit, proof, package, admin capacity",
            `Confirm qualifying plan on ${ctx.pricingHref}`,
            "Write buy, extend (one condition), or pass",
          ],
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "tradeoffs",
      heading: "Tradeoff gate: label every watch-out",
      body: `Strengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\n1. Sort each watch-out: acceptable · mitigable (named owner + date) · disqualifying.\n2. Treat strengths as trial claims, not facts.\n3. If a disqualifier appears in trial, stop.\n\nWorked example: ${job.team} documents known gaps instead of pretending ${name} covers every work-management job.`,
      tip: "Unspoken tradeoffs become renewal fights.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        3,
        `Accept ${name} tradeoffs in writing — or keep looking.`,
      ),
      scenarios: [
        {
          title: "Acceptable",
          body: "You can name why it does not hit your three outcomes.",
        },
        {
          title: "Mitigable",
          body: "Owner, cost, and date attached — or it is not a mitigation.",
        },
        {
          title: "Disqualifying",
          body: `It blocks the job — compare peers in the same cluster.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "decide",
      heading: "Package gate and write buy · extend · pass",
      body: `1. Confirm must-haves on a qualifying package. ${gatedHintSentence(ctx)}\n2. ${pricingPointer(ctx)}\n3. Name the admin and weekly hours.\n4. Buy only when fit + proof + package all say yes.\n5. Otherwise keep looking via ${job.categoryHowTo} — ${ctx.alternativeNames.length > 0 ? `teams often also evaluate ${joinList(ctx.alternativeNames, 3)}` : `compare ${alts.join(", ")} inside the same job cluster`}.\n\nWorked example: ${job.team} clears fit and proof but pauses the buy until hub/seat rules are written. They do not invent an ROI percentage to unblock procurement.`,
      tip: "No invented ROI — outcomes, usability, and qualifying cost either align or they don’t.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        4,
        `Buy ${name} only when fit, proof, and package gates agree.`,
      ),
      scenarios: [
        {
          title: "Buy",
          body: "Fit, proof, package, and admin hours all written.",
        },
        {
          title: "Extend",
          body: "One closing question and a date — not an open-ended demo.",
        },
        {
          title: "Pass",
          body: `Wrong cluster or failed proof — that is a successful evaluation.`,
        },
      ],
    },
    {
      type: "mistakes",
      id: "worth-it-mistakes",
      title: `Ways teams wrongly decide ${name} is “worth it”`,
      items: [
        {
          title: "Inventing ROI in a spreadsheet",
          body: "SoftwareGlimpse does not publish a worth-it percentage. If fit, proof, or package fails, the honest answer is no.",
        },
        {
          title: "Buying from a demo high",
          body: "Demos are run by people who live in the product. Your sceptic contributor is the test.",
        },
        {
          title: "Stretching the job cluster",
          body: `${name} as ${job.notPeer} is how you end up with a second tool and a messy workspace.`,
        },
        {
          title: "Confusing sibling products",
          body:
            name.includes("monday")
              ? "monday sales CRM is not this product. Work Management is boards and delivery; sales CRM is a CRM-primary entity."
              : `Do not assume a similarly named ${name} SKU is the same job cluster.`,
        },
        {
          title: "Skipping the qualifying hub",
          body: "If the loop only works on a plan you will not buy, it is not worth it at the tile you liked.",
        },
      ],
    },
    {
      type: "cost-breakdown",
      id: "worth-it-cost-shape",
      title: "Commercial clarity without invented totals",
      body: `Worth-it includes cost you can actually qualify. Confirm numbers on the pricing page.`,
      lines: [
        {
          label: "Qualifying seats",
          description: "Weekly updaters only.",
        },
        {
          label: "Guests / viewers",
          description: "Confirm whether they bill as seats.",
        },
        {
          label: "Hubs that unlock the loop",
          description: gatedHintSentence(ctx),
        },
        {
          label: "Admin time",
          description: "~2 hours/week is a real cost even when it is not on the invoice.",
        },
      ],
      calculatorHref: ctx.pricingHref,
      calculatorLabel: `Open ${name} pricing →`,
    },
    {
      type: "faq",
      id: "worth-it-faq",
      title: `Is ${name} worth it? FAQ`,
      items: [
        {
          question: "Can we decide from a demo alone?",
          answer: `No. Require non-admin proof that you can ${job.prove} on the package you will actually buy.`,
        },
        {
          question: "Does SoftwareGlimpse invent a score here?",
          answer:
            "No. This page is a qualitative gate (fit, proof, package). Criterion scores live on the product review. We do not invent ROI percentages or affiliate-ordered rankings.",
        },
        {
          question: "Is monday sales CRM the same product?",
          answer:
            name.includes("monday")
              ? "No. monday sales CRM is CRM-primary. This worth-it guide is for monday.com work management / work OS."
              : `${name} is evaluated here as ${job.noun} only. Check the product hub if a sibling SKU exists.`,
        },
        {
          question: "When should we walk away?",
          answer: `When fit, trial proof, or written packaging fails — or when the real job is ${job.notPeer}. Walking away is a successful evaluation.`,
        },
        {
          question: "What if leadership already picked it?",
          answer: `Still run the gates. A pre-chosen tool that fails non-admin proof becomes a status-meeting tax. Put the failed gate in writing.`,
        },
        {
          question: "How do we compare alternatives?",
          answer: `Use ${job.categoryHowTo} and stay inside the same job cluster. ${ctx.alternativeNames.length > 0 ? `Teams often also evaluate ${joinList(ctx.alternativeNames, 3)}.` : `Catalogue peers include ${alts.join(", ")}.`} Do not rank a work OS against a PDF editor.`,
        },
      ],
    },
    relatedLinks(ctx, "worth-it"),
    interactiveCta(ctx, "worth-it"),
  ]);
}

function tidyStrings<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\s{2,}/g, " ").trim() as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => tidyStrings(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        tidyStrings(v),
      ]),
    ) as T;
  }
  return value;
}

export function buildPmBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(pmBlocksForKind(ctx, kind));
}

function pmBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildPmImplementationBlocks(ctx);
    case "migration":
      return buildPmMigrationBlocks(ctx);
    case "setup":
      return buildPmSetupBlocks(ctx);
    case "plans":
      return buildPmPlansBlocks(ctx);
    case "worth-it":
      return buildPmWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
