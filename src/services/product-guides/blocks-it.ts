import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

type ItJob = {
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

function itJob(ctx: ProductGuideContext): ItJob {
  const howTo = "how to choose IT development software";
  switch (ctx.productSlug) {
    case "servicenow":
      return {
        noun: "enterprise ITSM / Now Platform",
        loop: "log one incident, route it, and resolve with a CMDB record a sceptic agent can find",
        setupFirst: "one scoped ITSM module you will actually buy, one assignment group, and an integration you depend on",
        migrateObjects: "incidents, changes, catalog items, CMDB CIs, and knowledge",
        prove: "an agent resolves an incident a requester can see without a platform admin",
        team: "Harbor IT (mid-market service desk moving off email)",
        notPeer: "an observability suite or a git host",
        categoryHowTo: howTo,
      };
    case "jira-service-management":
      return {
        noun: "Atlassian ITSM (not Jira Software project tracking)",
        loop: "open a request in the portal, SLA it, and resolve with a comment the requester can see",
        setupFirst: "one service project, one portal, and agents who are not Jira Software project admins",
        migrateObjects: "request types, queues, SLAs, and knowledge",
        prove: "a requester files a ticket and an agent resolves it without a Jira admin",
        team: "Northline IT (Atlassian shop)",
        notPeer: "Jira Software for engineering sprints, or Datadog",
        categoryHowTo: howTo,
      };
    case "freshservice":
      return {
        noun: "SMB/mid ITSM service desk",
        loop: "log an incident, apply an SLA, and close with requester confirmation",
        setupFirst: "one workspace, one ticket form, and agent seats you will buy",
        migrateObjects: "tickets, assets, SLAs, and knowledge",
        prove: "an agent closes a ticket a requester can see",
        team: "Harbor IT (helpdesk replacing a shared inbox)",
        notPeer: "Freshdesk (customer helpdesk) or an observability platform",
        categoryHowTo: howTo,
      };
    case "datadog":
      return {
        noun: "observability (infra, APM, logs)",
        loop: "instrument one service, see a metric, trace, or log, and page or ticket from a real signal",
        setupFirst: "one host or APM service, one dashboard, and the ingest you will actually pay for",
        migrateObjects: "monitors, dashboards, SLOs, and log indexes",
        prove: "an engineer finds a failing trace without a Datadog org admin",
        team: "Northline Platform (two services in production)",
        notPeer: "PagerDuty-only on-call, or a git host",
        categoryHowTo: howTo,
      };
    case "new-relic":
      return {
        noun: "application and infrastructure observability",
        loop: "ingest one service, open an APM trace, and prove an alert fired",
        setupFirst: "one full user, one data ingest path, and a dashboard you will keep",
        migrateObjects: "NRQL alerts, dashboards, and APM apps",
        prove: "a developer finds a slow transaction without an admin",
        team: "Harbor Apps (one production API)",
        notPeer: "an ITSM desk or a hosting panel",
        categoryHowTo: howTo,
      };
    case "grafana-cloud":
      return {
        noun: "managed Grafana observability",
        loop: "ship metrics or logs, build one dashboard, and fire an alert a human will see",
        setupFirst: "one stack, one data source, and usage you will actually buy",
        migrateObjects: "dashboards, alert rules, and data sources",
        prove: "an on-call engineer reads a dashboard without a Grafana admin",
        team: "Northline SRE (Prometheus-fluent team)",
        notPeer: "a full ITSM suite or PagerDuty as a substitute for metrics",
        categoryHowTo: howTo,
      };
    case "pagerduty":
      return {
        noun: "on-call and incident response",
        loop: "page a responder from a real alert, acknowledge, and run an incident to resolve",
        setupFirst: "one escalation policy, one schedule, and an integration from the monitor you already have",
        migrateObjects: "schedules, escalation policies, services, and incident history",
        prove: "a responder gets paged and acknowledges without a PagerDuty admin",
        team: "Harbor SRE (one critical service)",
        notPeer: "Datadog (observability ingest) or an ITSM catalog",
        categoryHowTo: howTo,
      };
    case "github":
      return {
        noun: "source control and DevOps platform",
        loop: "push a branch, open a PR, and merge with Actions green — Copilot is a different product",
        setupFirst: "one org, one repo, and branch protection a developer can satisfy without an org owner",
        migrateObjects: "repos, issues, Actions workflows, and packages — not Copilot seat assignments",
        prove: "a developer opens a PR and Actions runs without a GitHub org owner",
        team: "Northline Engineering (two squads)",
        notPeer: "GitHub Copilot (AI coding plugin) or Datadog",
        categoryHowTo: howTo,
      };
    case "gitlab":
      return {
        noun: "DevSecOps platform (git + CI)",
        loop: "push to a project, run a pipeline, and merge with a reviewer",
        setupFirst: "one group, one project, and a .gitlab-ci.yml that a developer can trigger",
        migrateObjects: "projects, issues, CI variables, and runners",
        prove: "a developer merges with a green pipeline without a GitLab admin",
        team: "Harbor Engineering (GitLab.com shop)",
        notPeer: "a hosting panel or an ITSM desk",
        categoryHowTo: howTo,
      };
    case "bitbucket":
      return {
        noun: "Atlassian git hosting",
        loop: "push a branch, open a PR, and run Pipelines",
        setupFirst: "one workspace, one repo, and Pipelines minutes you will buy",
        migrateObjects: "repos, PRs, and pipeline configs",
        prove: "a developer merges a PR without a Bitbucket admin",
        team: "Northline Atlassian (Jira-aligned engineering)",
        notPeer: "Jira Service Management or GitHub Copilot",
        categoryHowTo: howTo,
      };
    case "plesk":
      return {
        noun: "hosting control panel",
        loop: "add one domain, provision a site or mailbox, and prove the customer can log in",
        setupFirst: "one license edition, one subscription, and a server you actually control",
        migrateObjects: "domains, subscriptions, mail, and DNS",
        prove: "a site owner publishes without a Plesk admin",
        team: "Harbor Hosting (a small agency panel)",
        notPeer: "cPanel as a different panel, or a git host",
        categoryHowTo: howTo,
      };
    case "cpanel":
      return {
        noun: "hosting control panel (cPanel & WHM)",
        loop: "create one cPanel account, add a domain, and prove the customer can upload",
        setupFirst: "one license tier, one package, and WHM access you will keep",
        migrateObjects: "accounts, domains, email, and packages",
        prove: "a hosting customer logs into cPanel without WHM",
        team: "Northline Hosting (WHM reseller)",
        notPeer: "Plesk or an observability suite",
        categoryHowTo: howTo,
      };
    case "bright-data":
      return {
        noun: "proxy / web-data collection network",
        loop: "run one compliant collection job, inspect the dataset, and prove billing matches usage",
        setupFirst: "one zone or scraper, a target you are allowed to collect, and a spend cap",
        migrateObjects: "zones, collectors, and datasets",
        prove: "an analyst pulls a sample without an account admin",
        team: "Harbor Data (competitive intel)",
        notPeer: "a hosting panel or an ITSM desk",
        categoryHowTo: howTo,
      };
    case "dynatrace":
      return {
        noun: "enterprise observability / APM",
        loop: "instrument one host or service, open a problem, and prove an owner can act",
        setupFirst: "one environment, one OneAgent or ingest path, and host units you will buy",
        migrateObjects: "problems, dashboards, and management zones",
        prove: "an SRE opens a problem without a Dynatrace admin",
        team: "Harbor Platform (enterprise APM evaluation)",
        notPeer: "PagerDuty-only paging or a git host",
        categoryHowTo: howTo,
      };
    case "azure-devops":
      return {
        noun: "Azure Boards, Repos, and Pipelines (not GitHub)",
        loop: "commit to a repo, run a pipeline, and close a work item",
        setupFirst: "one organization, one project, and a pipeline a developer can queue",
        migrateObjects: "repos, pipelines, and work items",
        prove: "a developer ships a change without an org owner",
        team: "Northline Microsoft (Azure shop)",
        notPeer: "GitHub the SaaS git host, or GitHub Copilot",
        categoryHowTo: howTo,
      };
    default:
      return {
        noun: "IT operations or development platform",
        loop: "complete one real IT job a non-admin can repeat",
        setupFirst: "seats or hosts for weekly operators, one core loop, and a required integration",
        migrateObjects: "tickets, repos, monitors, or accounts as relevant",
        prove: "finish the loop without an admin",
        team: "Harbor IT (weekly operators)",
        notPeer: "a different IT job cluster",
        categoryHowTo: howTo,
      };
  }
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return itJob(ctx).setupFirst;
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) return itJob(ctx).loop;
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
    return `teams whose primary job is ${itJob(ctx).noun}`;
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return `teams whose blocking job is ${itJob(ctx).notPeer}`;
  }
  return clauses(ctx.notIdealFor, 4);
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves — including seats, hosts, ingest, and add-ons — against the packaging you actually intend to buy.`;
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
    return `Our research does not name specific ${ctx.productName} integrations, so verify identity, monitoring, and ticketing connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your IT loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on the core ${itJob(ctx).noun} loop rather than assistance features.`;
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
  return `${ctx.productName} is evaluated here as ${itJob(ctx).noun} tooling — not a peer for every IT job cluster.`;
}

function planSoftener(ctx: ProductGuideContext): string {
  if (ctx.hasPlanMatrix) return `Researched plans: ${planPhrase(ctx)}.`;
  return `${ctx.productName} is often sold on seats, hosts, ingest, or quote packaging in our snapshot — treat homepage tiles as marketing, not a bill of materials. Confirm live packaging on the pricing page.`;
}

function pricingPointer(ctx: ProductGuideContext): string {
  return `Never invent list prices here — confirm seats, hosts, ingest, and quote terms on ${ctx.pricingHref}.`;
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
    plans: "Weigh these when you pick seats, hosts, and a qualifying tier.",
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
      ["plans", "Plans / seats vs hosts"],
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
        description: "Researched plans, seats/hosts, and sources.",
      },
      ...siblings,
      {
        href: "/guides/how-to-choose-it-development-software/",
        label: "How to choose IT development software",
        description: "Category selection framework by job cluster.",
      },
      {
        href: "/best/it-development-software/",
        label: "Best IT & development software",
        description: "Editor’s picks by job cluster — not one ranking.",
      },
      {
        href: "/categories/it-development/",
        label: "IT & development category",
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
      body: `IT tools often mix seats, hosts, ingest, and quote terms. Use the researched pricing page — do not invent totals in a spreadsheet.`,
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
      body: `If ${ctx.productName} is close but not obvious, read how to choose IT development software and compare finalists inside the same job cluster — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-it-development-software/",
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

function buildItSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = itJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify seats for the people who will actually open it, name one IT/ops owner, configure ${job.setupFirst}, connect the identity/monitoring/ticketing you depend on, then have a non-admin run ${job.prove}.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every optional module is switched on.`,
      bullets: [
        `Start on ${startPlan(ctx)}`,
        "Name one IT / ops owner",
        job.setupFirst,
        "Connect required identity / monitoring / ticketing",
        "Prove a non-admin can run the loop",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `What matters in your ${name} setup`,
      items: [
        {
          label: `What ${name} actually is`,
          body: positioningSentence(ctx),
        },
        {
          label: "Configure these first",
          body: `Research lists ${featurePhrase(ctx)} as supported — that is your day-zero surface.`,
        },
        {
          label: "Do not treat it as every IT job",
          body: `${name} is ${job.noun}. It is not a substitute for ${job.notPeer}.`,
        },
        {
          label: "Prove with a real workflow",
          body: `Worked example: ${job.team} is done when they can ${job.prove} — not after a vendor tour.`,
        },
      ],
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
        feature: "Core job loop",
        mustHave: true,
        niceToHave: false,
        notes: job.loop,
      },
      {
        feature: "Plan / hub gates",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "Integrations",
        mustHave: true,
        niceToHave: false,
        notes: integrationSentence(ctx),
      },
      {
        feature: "AI extras",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
    {
      type: "step",
      stepNumber: 1,
      id: "qualify-seats",
      heading: "Qualify seats and packaging",
      body: `${planSoftener(ctx)}\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} lists everyone who must log in weekly before they invite “the whole company.”`,
      tip: "Homepage tiles are not a bill of materials.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "configure-loop",
      heading: "Configure one core loop",
      body: `Configure ${job.setupFirst}. Research-supported surfaces include ${coreLoopPhrase(ctx)}.\n\nWorked example: ${job.team} refuses optional modules until ${job.prove}.`,
      tip: "One loop in production beats five unused modules.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "non-admin-proof",
      heading: "Non-admin proof",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\nWorked example: ${job.team} records a 10-minute loom of the walkthrough for stakeholders who skip hands-on time.`,
      tip: "If only an admin can complete the loop, setup is not finished.",
    },
    phaseChecklist(ctx, "setup", [
      {
        id: "owner",
        label: "Name an IT/ops owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "loop",
        label: "Configure one core loop",
        description: job.setupFirst,
      },
      {
        id: "proof",
        label: "Complete non-admin proof",
        description: job.prove,
      },
    ]),
    researchCallout(ctx, "setup"),
    {
      type: "faq",
      id: "setup-faq",
      title: `${name} setup FAQ`,
      items: [
        {
          question: "When is setup actually done?",
          answer: `When a non-admin can ${job.prove} on the package you will buy.`,
        },
        {
          question: `Should we turn on every ${name} hub on day one?`,
          answer: `No. Extra modules hide whether the core ${job.noun} loop works.`,
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

function buildItImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const job = itJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in gated phases: freeze 90-day outcomes for ${job.noun}, name an owner, configure the core loop, train the people who must update it weekly, then review adoption before adding automations or extra modules.${quickGateHint(ctx)} Treat ${name} implementation as phases — not a feature dump in week one.`,
      bullets: [
        "Freeze 90-day outcomes",
        "Name an admin owner",
        "Days 1–30: core loop only",
        "Days 31–60: train weekly users",
        "Days 61–90: adoption review, then extras",
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
          body: `If ${job.team.split(" (")[0]} will not open the product weekly, extra modules will not save the rollout.`,
        },
        {
          label: "Integrations are a phase",
          body: integrationSentence(ctx),
        },
        {
          label: "AI is optional",
          body: aiSentence(ctx),
        },
      ],
    },
    {
      type: "figure",
      id: "impl-diagram",
      title: `${name} 30/60/90`,
      src: ctx.figureSrc("implementation"),
      alt: `${name} 30/60/90 rollout for ${job.noun}.`,
      caption: `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "days-30",
      heading: "Days 1–30: core loop only",
      body: `Configure ${job.setupFirst}. Success looks like: ${job.loop}.\n\nWorked example: ${job.team} delays optional AI and extra modules until the core loop has a week of real use.`,
      tip: "Week-one marketplace apps are a common failure mode.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "days-60",
      heading: "Days 31–60: train weekly users",
      body: `Train the people who must update ${name} every week — not a one-time all-hands. ${trialSentence(ctx)}\n\nWorked example: ${job.team} includes one sceptic user in training so adoption risk shows up before go-live speeches.`,
      tip: "If sceptics will not open it, fix the ritual before buying more seats.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "days-90",
      heading: "Days 61–90: adoption review",
      body: `Check whether the core loop is actually used. Only then add automations, extra modules, or AI.\n\nWorked example: ${job.team} reviews tickets, deploys, or on-call pages (whichever matches ${job.noun}) before expanding scope.`,
      tip: "Empty dashboards mean the rollout is not done.",
    },
    phaseChecklist(ctx, "implementation", [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: `Must-haves for ${job.noun} before configuration sprawl.`,
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Fields, users, and hygiene need a responsible party.",
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
            "Ninety days is enough for most SMB/mid teams if you freeze the job and defer extras. Longer programmes help when change management is the risk.",
        },
        {
          question: "What if we also need a different IT job?",
          answer: `Buy the second job as a second product (or a later wave). ${name} should not be stretched into ${job.notPeer}.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

function buildItMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = itJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Migrate into ${name} with an inventory of ${job.migrateObjects}, a field map, a pilot import, a dual-run week, and validation with the people who live in the data — so history survives and the team trusts the new system.`,
      bullets: [
        "Inventory source objects",
        "Map fields before bulk load",
        "Pilot one site / one role / one team",
        "Dual-run for a week",
        "Validate with sceptic users",
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
          body: `${name} is ${job.noun}. Do not import a git host or an observability suite and expect it to become ${job.noun}.`,
        },
      ],
    },
    {
      type: "figure",
      id: "migration-diagram",
      title: `${name} migration map`,
      src: ctx.figureSrc("migration"),
      alt: `${name} migration: export, map, pilot, dual-run, cutover.`,
      caption: `Prove a small ${name} import before you move the whole operation.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "inventory",
      heading: "Inventory and map",
      body: `List ${job.migrateObjects}. Map required fields and owners. ${pricingPointer(ctx)}\n\nWorked example: ${job.team} discovers duplicate employee IDs in the spreadsheet before the first import — and fixes identity before volume.`,
      tip: "Unmapped required fields fail loudly in week two.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "pilot",
      heading: "Pilot import",
      body: `Import one site, one role, or one team. Run ${job.loop} on the pilot set.\n\nWorked example: ${job.team} will not schedule a cutover until the pilot can ${job.prove}.`,
      tip: "A pretty mapping spreadsheet is not a successful import.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "cutover",
      heading: "Dual-run and cutover",
      body: `Run old and new in parallel for a week. Spot-check records sceptic users care about, then freeze the legacy source.\n\nWorked example: ${job.team} keeps the old export for tickets, repos, or monitors until ${name} matches for seven consecutive days.`,
      tip: "Cut over on a quiet day, not during a production incident.",
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
      ],
    },
    relatedLinks(ctx, "migration"),
    interactiveCta(ctx, "migration"),
  ]);
}

function buildItPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = itJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} plan by mapping must-haves for ${job.noun} to a qualifying tier — seats, hosts, ingest, and add-ons included — not by comparing homepage “from” tiles.${quickGateHint(ctx)} ${pricingPointer(ctx)}`,
      bullets: [
        "List day-one must-haves",
        "Map to a researched qualifying plan",
        "Price hosts / ingest / add-ons you will actually use",
        "Confirm trial or free proving ground",
        "Write the quote before you buy",
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
          label: "Free is a proving ground",
          body: trialSentence(ctx),
        },
        {
          label: "Wrong cluster, wrong comparison",
          body: `Do not compare ${name} (${job.noun}) to ${job.notPeer} on a single price tile.`,
        },
      ],
    },
    {
      type: "figure",
      id: "plans-diagram",
      title: `${name} qualifying configuration`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy: seats, hosts, gates, add-ons.`,
      caption: `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "musts",
      heading: "List must-haves, then qualify",
      body: `Must-haves should match ${job.loop}. Research-supported features include ${featurePhrase(ctx)}.\n\nWorked example: ${job.team} drops a cheaper tile when the must-have workflow unlocks only on a higher hub.`,
      tip: "If more than eight items are must-haves, you are still in wishlist mode.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "compare-like",
      heading: "Compare like for like",
      body: `${pricingPointer(ctx)}\n\nWorked example: ${job.team} totals the qualifying configuration at their headcount — not the marketing starter tile — then asks for the quote in writing.`,
      tip: "Annual vs monthly and implementation fees often decide the cheaper vendor.",
    },
    mustNiceMatrix(ctx, "plans", [
      {
        feature: "Core job on entry plan",
        mustHave: true,
        niceToHave: false,
        notes: job.setupFirst,
      },
      {
        feature: "Gated capabilities",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "AI / extra modules",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
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
        description: "Seats, hosts, add-ons, and implementation fees.",
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
      ],
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

function buildItWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = itJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth it when your primary job is ${job.noun}, a non-admin can ${job.prove} on the package you will buy, and you can live with the researched tradeoffs. It is not worth stretching into ${job.notPeer}.`,
      bullets: [
        "Fit the job cluster",
        "Prove the core loop",
        "Accept tradeoffs in writing",
        "Confirm the qualifying package",
        "Otherwise keep looking",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `Is ${name} worth it?`,
      items: [
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
      ],
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
      type: "step",
      stepNumber: 1,
      id: "fit-gate",
      heading: "Fit gate: does your motion match?",
      body: `Compare your job to researched best-for / not-ideal patterns.\n\nBest for: ${bestForPhrase(ctx)}.\nNot ideal: ${notIdealPhrase(ctx)}.\n\nWorked example: ${job.team} scores ${name} on ${job.noun} only — they refuse to treat it as ${job.notPeer}.`,
      tip: "Demo excitement is not a fit signal.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "trial-proof",
      heading: "Proof gate: non-admin loop",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\nWorked example: ${job.team} fails the gate when only an admin can complete the walkthrough; they extend trial and fix permissions before considering buy.`,
      tip: "Vendor tours do not count as proof.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "tradeoffs",
      heading: "Tradeoff gate: can you live with the limits?",
      body: `Strengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\nWorked example: ${job.team} documents known gaps instead of pretending ${name} covers every IT job.`,
      tip: "Unspoken tradeoffs become renewal fights.",
    },
    {
      type: "step",
      stepNumber: 4,
      id: "decide",
      heading: "Package gate and decide",
      body: `1. Confirm must-haves on a qualifying package. ${gatedHintSentence(ctx)}\n2. ${pricingPointer(ctx)}\n3. Buy only when fit + proof + package all say yes.\n4. Otherwise keep looking via ${job.categoryHowTo} — ${ctx.alternativeNames.length > 0 ? `teams often also evaluate ${joinList(ctx.alternativeNames, 3)}` : "compare finalists inside the same job cluster"}.\n\nWorked example: ${job.team} clears fit and proof but pauses the buy until hub/seat rules are written.`,
      tip: "No invented ROI — outcomes, usability, and qualifying cost either align or they don’t.",
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: `Your motion should be ${job.noun}.`,
      },
      {
        id: "trial",
        label: "Prove the IT loop",
        description: job.prove,
      },
      {
        id: "plan",
        label: "Confirm seats and hosts",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
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
          question: "When should we walk away?",
          answer: `When fit, trial proof, or written packaging fails — or when the real job is ${job.notPeer}.`,
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

export function buildItBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(itBlocksForKind(ctx, kind));
}

function itBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildItImplementationBlocks(ctx);
    case "migration":
      return buildItMigrationBlocks(ctx);
    case "setup":
      return buildItSetupBlocks(ctx);
    case "plans":
      return buildItPlansBlocks(ctx);
    case "worth-it":
      return buildItWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
