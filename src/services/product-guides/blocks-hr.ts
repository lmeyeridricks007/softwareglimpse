import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

type HrJob = {
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

function hrJob(ctx: ProductGuideContext): HrJob {
  switch (ctx.productSlug) {
    case "connecteam":
      return {
        noun: "frontline workforce management",
        loop: "publish next week’s shifts for one site, notify deskless staff, and confirm a worker opened the mobile app",
        setupFirst: "one site, one published week of shifts, and a time-clock or comms hub you will actually buy",
        migrateObjects: "employees, sites, shifts, time-off, and announcement history",
        prove: "a site manager publishes a week of shifts and a frontline worker clocks in or acknowledges a shift on mobile",
        team: "Northline Ops (35 frontline users across two sites)",
        notPeer: "a dedicated ATS or a pure time clock",
        categoryHowTo: "how to choose HR software",
      };
    case "jibble":
      return {
        noun: "time & attendance",
        loop: "clock in inside the geofence or face policy, submit a timesheet, and export for payroll",
        setupFirst: "one attendance policy, one geofence or kiosk, and three days of real clock-ins",
        migrateObjects: "employees, locations/geofences, timesheets, and overtime rules",
        prove: "a non-admin clocks in/out for three days with the policy you will enforce",
        team: "Harbor Retail (hourly staff at two stores)",
        notPeer: "a full frontline WFM suite or an ATS",
        categoryHowTo: "how to choose HR software",
      };
    case "trainual":
      return {
        noun: "SOP knowledge-base and role training",
        loop: "assign one role path, complete a playbook, and check completion evidence with a sceptic manager",
        setupFirst: "one role chart, one assigned path, and completion evidence you can show leadership",
        migrateObjects: "SOPs, role charts, training assignments, and completion records",
        prove: "a new hire finishes one assigned path and a manager can see evidence without an admin screenshot",
        team: "Northline Ops (growing managers documenting tribal knowledge)",
        notPeer: "a public course-commerce LMS, an ATS, or a time clock",
        categoryHowTo: "how to choose HR software",
      };
    default:
      return {
        noun: "applicant tracking / recruiting",
        loop: "post one live role, move three candidates through stages, and collect interview feedback",
        setupFirst: "one hiring pipeline, one career-site job, and interview scheduling that a hiring manager can run",
        migrateObjects: "open roles, candidates, stage history, and scorecards",
        prove: "a hiring manager moves a candidate and leaves feedback without an admin",
        team: "Harbor Retail (two recruiters and eight hiring managers)",
        notPeer: "frontline scheduling or a GPS time clock",
        categoryHowTo: "how to choose HR software",
      };
  }
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return hrJob(ctx).setupFirst;
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) return hrJob(ctx).loop;
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
    return `teams whose primary job is ${hrJob(ctx).noun}`;
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return `teams whose blocking job is ${hrJob(ctx).notPeer}`;
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
    return `Our research does not name specific ${ctx.productName} integrations, so verify HRIS, payroll, and calendar connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your HR loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on the core ${hrJob(ctx).noun} loop rather than assistance features.`;
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
  return `${ctx.productName} is evaluated here as ${hrJob(ctx).noun} tooling — not a peer for every HR job cluster.`;
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
        href: "/guides/how-to-choose-hr-software/",
        label: "How to choose HR software",
        description: "Category selection framework by job cluster.",
      },
      {
        href: "/best/hr-software/",
        label: "Best HR software",
        description: "Editor’s picks by job cluster — not one ranking.",
      },
      {
        href: "/categories/hr/",
        label: "HR, workforce & training category",
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
      body: `HR tools often mix seats, hubs, pools, and quote terms. Use the researched pricing page — do not invent totals in a spreadsheet.`,
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
      body: `If ${ctx.productName} is close but not obvious, read how to choose HR software and compare finalists inside the same job cluster — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-hr-software/",
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

function buildHrSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = hrJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify seats for the people who will actually open it, name one HR/ops owner, configure ${job.setupFirst}, connect the HRIS/payroll/calendar you depend on, then have a non-admin run ${job.prove}.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every optional hub is switched on.`,
      bullets: [
        `Start on ${startPlan(ctx)}`,
        "Name one HR / ops owner",
        job.setupFirst,
        "Connect required HRIS / payroll / calendar",
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
          label: "Do not treat it as every HR job",
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
      tip: "One loop in production beats five unused hubs.",
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
        label: "Name an HR/ops owner",
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
          answer: `No. Extra hubs hide whether the core ${job.noun} loop works.`,
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

function buildHrImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const job = hrJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in gated phases: freeze 90-day outcomes for ${job.noun}, name an owner, configure the core loop, train the people who must update it weekly, then review adoption before adding automations or extra hubs.${quickGateHint(ctx)} Treat ${name} implementation as phases — not a feature dump in week one.`,
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
      body: `Configure ${job.setupFirst}. Success looks like: ${job.loop}.\n\nWorked example: ${job.team} delays optional AI and extra hubs until the core loop has a week of real use.`,
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
      body: `Check whether the core loop is actually used. Only then add automations, extra hubs, or AI.\n\nWorked example: ${job.team} reviews completion, clock-ins, or stage movement (whichever matches ${job.noun}) before expanding scope.`,
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
          question: "What if we also need a different HR job?",
          answer: `Buy the second job as a second product (or a later wave). ${name} should not be stretched into ${job.notPeer}.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

function buildHrMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = hrJob(ctx);
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
          body: `${name} is ${job.noun}. Do not import a CRM pipeline or a marketing course catalogue and expect it to become ${job.noun}.`,
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
      body: `Run old and new in parallel for a week. Spot-check records sceptic users care about, then freeze the legacy source.\n\nWorked example: ${job.team} keeps the old export for payroll or offers until ${name} matches for seven consecutive days.`,
      tip: "Cut over on a quiet day, not at month-end payroll.",
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

function buildHrPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = hrJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} plan by mapping must-haves for ${job.noun} to a qualifying tier — seats, hubs, pools, and add-ons included — not by comparing homepage “from” tiles.${quickGateHint(ctx)} ${pricingPointer(ctx)}`,
      bullets: [
        "List day-one must-haves",
        "Map to a researched qualifying plan",
        "Price hubs / add-ons you will actually use",
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
      alt: `${name} plan anatomy: seats, hubs, gates, add-ons.`,
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
        feature: "AI / SMS / extra hubs",
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
        description: "Seats, hubs, add-ons, and implementation fees.",
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

function buildHrWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = hrJob(ctx);
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
      body: `Strengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\nWorked example: ${job.team} documents known gaps instead of pretending ${name} covers every HR job.`,
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
        label: "Prove the HR loop",
        description: job.prove,
      },
      {
        id: "plan",
        label: "Confirm seats and hubs",
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

export function buildHrBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(hrBlocksForKind(ctx, kind));
}

function hrBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildHrImplementationBlocks(ctx);
    case "migration":
      return buildHrMigrationBlocks(ctx);
    case "setup":
      return buildHrSetupBlocks(ctx);
    case "plans":
      return buildHrPlansBlocks(ctx);
    case "worth-it":
      return buildHrWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
