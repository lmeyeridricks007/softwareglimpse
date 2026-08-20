import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/** Worked-example sales + support team used across every BC product guide. */
const TEAM = "an 8-person sales + support team";
const TEAM_SEATS = 8;

function joinList(items: readonly string[], max = 4): string {
  const picked = items.filter(Boolean).slice(0, max);
  if (picked.length === 0) return "";
  if (picked.length === 1) return picked[0] as string;
  if (picked.length === 2) return `${picked[0]} and ${picked[1]}`;
  return `${picked.slice(0, -1).join(", ")}, and ${picked[picked.length - 1]}`;
}

function sentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clauses(items: readonly string[], max: number, sep = "; "): string {
  return items
    .slice(0, max)
    .map((line) => line.replace(/\s*[.;·]+$/u, ""))
    .join(sep);
}

function uiHint(ctx: ProductGuideContext, area: string): string {
  return `In ${ctx.productName}, open ${area} — confirm the current control labels in the product, docs, or trial.`;
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return "core communications jobs (numbers, routing, softphone, CRM logging)";
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) {
    return "numbers, routing, softphone, and CRM call logging";
  }
  return joinList(ctx.coreLoopLabels, 4);
}

function planPhrase(ctx: ProductGuideContext): string {
  if (!ctx.hasPlanMatrix) {
    return "usage / credit / contact-sales packaging (no public plan matrix in our snapshot)";
  }
  return ctx.planNames.join(", ");
}

function bestForPhrase(ctx: ProductGuideContext): string {
  if (ctx.bestFor.length === 0) {
    return "sales and support teams that will own numbers, routing, softphone, and CRM CTI weekly";
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return "teams that need a CRM as day-one software, or refuse to name a phone/admin owner";
  }
  return clauses(ctx.notIdealFor, 4);
}

function gateLine(ctx: ProductGuideContext, featureSlug: string): string | null {
  const feature = ctx.feature(featureSlug);
  if (!feature) return null;
  if (feature.planNames.length === 0) {
    return `${feature.label} is researched as available in ${ctx.productName}`;
  }
  if (feature.gated) {
    return `${feature.label} is researched on ${joinList(feature.planNames, 4)} only`;
  }
  return `${feature.label} is researched across every ${ctx.productName} plan we snapshot`;
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves — including seats, numbers, and minute/usage allotments — against the packaging you actually intend to buy.`;
  }
  return `Plan-gated in research: ${ctx.gatedFeatureHints.slice(0, 4).join("; ")}.`;
}

function shortPlanLabel(planName: string): string {
  const cleaned = planName
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const first = cleaned.split(/\s+/)[0] ?? cleaned;
  return first.length <= 18 ? first : `${first.slice(0, 16)}…`;
}

function quickGateHint(ctx: ProductGuideContext): string {
  const top = ctx.gatedFeatures.slice(0, 2);
  if (top.length === 0) return "";
  const phrase = (f: (typeof top)[number]) => {
    const plan = f.planNames[0] ? shortPlanLabel(f.planNames[0]) : null;
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
  return `Our snapshot records no trial length for ${ctx.productName} — ask for an evaluation window (and seat count and number/minute allotment) in writing before you commit seats.`;
}

function integrationSentence(ctx: ProductGuideContext): string {
  if (ctx.integrationNames.length === 0) {
    return `Our research does not name specific ${ctx.productName} integrations, so verify CRM, helpdesk, and telephony connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your call and messaging loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on number hygiene and call-routing habits rather than assistance features.`;
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

function capacitySentence(ctx: ProductGuideContext): string | null {
  if (ctx.planCapacityNotes.length === 0) return null;
  return `Researched capacity / usage limits: ${clauses(ctx.planCapacityNotes, 4)}.`;
}

function seatCapBlocker(ctx: ProductGuideContext): string | null {
  const blocked = ctx.plans.filter(
    (p) => p.seatCap != null && p.seatCap < TEAM_SEATS,
  );
  if (blocked.length === 0) return null;
  const parts = blocked
    .slice(0, 3)
    .map((p) => `${p.name} (up to ${p.seatCap} in research)`);
  return `An ${TEAM_SEATS}-seat team already exceeds ${joinList(parts, 3)}.`;
}

function limitationLines(ctx: ProductGuideContext): string[] {
  const merged = [...ctx.reviewLimitations, ...ctx.enrichmentLimitations];
  const out: string[] = [];
  for (const line of merged) {
    if (!out.includes(line)) out.push(line);
  }
  return out;
}

function positioningSentence(ctx: ProductGuideContext): string {
  if (ctx.shortDescription) return ctx.shortDescription;
  if (ctx.vendorClaim) return `Vendor positioning: ${ctx.vendorClaim}`;
  return `${ctx.productName} is evaluated here as business communications / phone-system tooling — not a CRM system of record.`;
}

function planSoftener(ctx: ProductGuideContext): string {
  if (ctx.hasPlanMatrix) {
    return `Researched plans: ${planPhrase(ctx)}.`;
  }
  return `${ctx.productName} is often sold on seats, numbers/minutes, or contact-sales packaging in our snapshot — treat homepage tiles as marketing, not a bill of materials. Confirm live packaging on the pricing page.`;
}

function pricingPointer(ctx: ProductGuideContext): string {
  return `Never invent list prices here — confirm seats, numbers/minutes, and quote terms on ${ctx.pricingHref}.`;
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item != null);
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
    plans: "Weigh these when you pick seats, numbers, and a qualifying tier.",
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
      ["plans", "Plans / seats vs numbers"],
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
        description: "Researched plans, seats/numbers, and sources.",
      },
      ...siblings,
      {
        href: "/guides/how-to-choose-business-communications-software/",
        label: "How to choose business communications software",
        description: "Category selection framework.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Category shortlist for comparison.",
      },
      {
        href: "/categories/business-communications/",
        label: "Business communications category",
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
      body: `Business communications often mixes seats, numbers/minutes, and quote terms. Use the researched pricing page — do not invent totals in a spreadsheet.`,
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
      body: `If ${ctx.productName} is close but not obvious, read how to choose business communications software and compare finalists with the same requirements — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-business-communications-software/",
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

/* --------------------------------------------------------- setup */

function buildBcSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const cloudPhone = ctx.feature("cloud-phone");
  const callRouting = ctx.feature("call-routing");
  const callRecording = ctx.feature("call-recording");
  const teamMessaging = ctx.feature("team-messaging");
  const startPlan =
    ctx.freePlanNames[0] ??
    ctx.entryPlanName ??
    "the entry package on the pricing page";
  const capacity = capacitySentence(ctx);
  const blocker = seatCapBlocker(ctx);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify seats and numbers for day-one calling, name one communications owner, build one call queue / IVR route, connect CRM CTI / call logging, enable softphone or IVR / routing, then have a non-admin provision a number, set a route, place a softphone call, and confirm CRM logging.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every optional add-on is switched on.`,
      bullets: [
        `Start on ${startPlan}`,
        "Name one communications owner",
        "One call queue / IVR route only",
        "Connect CRM CTI / call logging",
        callRecording || teamMessaging ? "Softphone or IVR / routing" : "First voice channel",
        "Prove an agent can run it",
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
          body: `Research lists ${featurePhrase(ctx)} as supported — that is your day-zero surface.`,
        },
        {
          label: "Check gates and usage",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Start on the right package",
          body: `${planSoftener(ctx)} ${capacity ?? ""} ${blocker ?? ""} ${pricingPointer(ctx)}`.trim(),
        },
        {
          label: "Sync only what the loop needs",
          body: integrationSentence(ctx),
        },
        ctx.hasAi
          ? {
              label: "AI comes after habits",
              body: `${aiSentence(ctx)} Leave it off until the manual communications loop is boring and reliable.`,
            }
          : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "setup-path",
      title: `${name} day-zero path`,
      steps: [
        { id: "access", label: "Access", short: "Contacts/minutes" },
        { id: "owner", label: "Owner", short: "Phone admin" },
        { id: "list", label: "Queue", short: "List" },
        { id: "sync", label: "Sync", short: "CRM" },
        { id: "calling", label: "Calling", short: "Call" },
        { id: "loop", label: "Loop", short: "Non-admin" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.implementation}/`,
      ctaLabel: "Implementation →",
    },
    {
      type: "figure",
      id: "setup-figure",
      title: `${name} setup walkthrough`,
      src: ctx.figureSrc("setup"),
      alt: `${name} setup walkthrough diagram.`,
      caption: `Finish the ${name} communications loop — ${coreLoopPhrase(ctx)} — before optional packs.`,
    },
    mustNiceMatrix(ctx, "setup", [
      {
        feature: "One call queue / IVR route + do-not-call numbers",
        mustHave: true,
        niceToHave: false,
        notes: "Day-zero communications loop",
      },
      {
        feature: cloudPhone?.label ?? "Softphone / dialer",
        mustHave: true,
        niceToHave: false,
        notes: cloudPhone?.gated
          ? `Researched on ${joinList(cloudPhone.planNames, 3)}`
          : "Confirm on your package",
      },
      {
        feature: "CRM CTI for logged calls",
        mustHave: true,
        niceToHave: false,
        notes: "System of record stays in CRM",
      },
      {
        feature:
          callRecording?.label ?? teamMessaging?.label ?? "Softphone or IVR / routing",
        mustHave: true,
        niceToHave: false,
        notes: "One channel first",
      },
      {
        feature: callRouting?.label ?? "Extra optional add-ons",
        mustHave: false,
        niceToHave: true,
        notes: "After routing quality holds",
      },
      {
        feature: ctx.hasAi ? "AI assistance" : "Extra channels",
        mustHave: false,
        niceToHave: true,
        notes: "Defer until week 4+",
      },
    ]),
    phaseChecklist(ctx, "setup", [
      {
        id: "access",
        label: `Qualify ${name} contacts and minute/number limits`,
        description: "Day-one must-haves on the cheapest researched package.",
      },
      {
        id: "owner",
        label: "Name one communications owner",
        description: "Minutes/contacts, numbers, sync, and hygiene need an owner.",
      },
      {
        id: "list",
        label: "Build one call queue / IVR route",
        description: "Filters match how you prospect in the next 90 days.",
      },
      {
        id: "sync",
        label: "Connect CRM CTI / call logging",
        description: "Plus form capture or routing — document other gaps.",
      },
      {
        id: "calling",
        label: "Enable one voice channel",
        description: "Call or routing — not both on day zero.",
      },
      {
        id: "loop",
        label: "Prove the non-admin loop",
        description: "Provision · route · softphone · CRM log — then write the setup note.",
      },
    ]),
    researchCallout(ctx, "setup"),
    {
      type: "step",
      stepNumber: 1,
      id: "qualify-access",
      heading: `Start on the ${name} package your must-haves need`,
      body: `Write five day-one jobs, map each to researched ${name} packaging, and pick the cheapest tier that covers all five — including seats/numbers if usage-based.\n\n1. List the five things the sales + support team must do on day one.\n2. Match each one to researched ${name} packaging. ${gatedHintSentence(ctx)}\n3. Pick the cheapest package that covers all five.\n4. Check contacts and minute/number limits, not just feature checkmarks. ${capacity ?? `Confirm seat/number caps for ${name} before inviting everyone.`}\n\n${trialSentence(ctx)}\n\n${pricingPointer(ctx)}\n\nWorked example: ${TEAM} needs ${coreLoopPhrase(ctx)} plus CRM CTI / call logging on day one in ${name}. ${blocker ? `${blocker} They set up on ${ctx.paidEntryPlanName ?? ctx.entryPlanName ?? "a paid package"} rather than a capped tier.` : `They start on ${startPlan} and note which capabilities would force an upgrade.`}`,
      tip: `Do not configure against a demo tenant. Demos frequently run with inflated seats/numbers or ${ctx.topPlanName ?? "top-tier"} access — ask which package you are looking at.`,
      figure: teachingFigure(
        ctx,
        "setup",
        1,
        `Package choice decides what you can prospect and calling in ${name} at all.`,
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "stack-owner",
      heading: "Create the workspace and name one communications owner",
      body: `Name one communications owner — not a committee — before you invite the sales + support team.\n\n1. Create the workspace with real company identity and timezone.\n2. Name one owner with ~2 hours a week for seats, numbers, users, and CTI hygiene.\n3. Agree: new numbers, IVR / routing, and seat or number-pack upgrades go through that owner only.\n4. ${uiHint(ctx, "admin console, numbers, or users settings")}\n\nWorked example: ${TEAM} makes ops the ${name} communications owner, writes the two-hour commitment into the week, and blocks everyone else from buying seat or number-pack upgrades for 30 days.`,
      tip: "An unnamed owner is the single best predictor of bloated numbers and abandoned IVR / routing.",
      figure: teachingFigure(
        ctx,
        "setup",
        2,
        `Name Responsible + Accountable for ${name} before anyone builds numbers.`,
      ),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "icp-list",
      heading: "Build one call queue / IVR route — not five experiments",
      body: `Configure one call queue / IVR route that matches how you actually route and answer for the next 90 days.\n\n1. Freeze audience definition, personas, and exclusions in writing.\n2. Build one saved queue / IVR route in ${name}. ${gateLine(ctx, "cloud-phone") ?? `Confirm list and routing filters in ${name}.`}\n3. Add do-not-call numbers (do-not-call, blocked numbers, competitors).\n4. Spot-check 20 records for number quality, routing fit, and ownership.\n\nWorked example: ${TEAM} builds one mid-market inbound queue in ${name}, suppresses do-not-call and blocked numbers, and rejects the queue until 18 of 20 spot-checks look call-ready.`,
      tip: "Five half-finished numbers beat zero minutes — and waste routing quality equally.",
      figure: teachingFigure(
        ctx,
        "setup",
        3,
        `One clean ${name} call queue / IVR route beats a folder of untrusted experiments.`,
      ),
    },
    {
      type: "step",
      stepNumber: 4,
      id: "prove-loop",
      heading: "Connect CRM, enable one channel, prove the non-admin loop",
      body: `Finish day-zero by proving a agent can run the loop without screenshots of another tool.\n\n1. Connect CRM CTI / call logging for contacts and activities. ${integrationSentence(ctx)}\n2. Enable one voice channel — calls or IVR / routing, not both. ${joinList(compact([gateLine(ctx, "call-recording"), gateLine(ctx, "team-messaging")]), 2) || `Confirm calling capabilities in ${name}.`}\n3. Have a non-admin: place or take a softphone call and confirm the activity landed in CRM.\n4. Write a one-page setup note: package, owner, list, channel, known gaps.\n\nWorked example: ${TEAM} connects HubSpot, turns on a basic inbound IVR in ${name}, and only invites the rest of the sales + support team after Priya completes dial → route → softphone → CRM log without help.`,
      tip: `${callRouting ? `${sentence(callRouting.label)} can wait` : "Extra optional add-ons can wait"} until the basic loop is boring.`,
      figure: teachingFigure(
        ctx,
        "setup",
        4,
        `Exit setup when a non-admin can finish the ${name} communications loop unaided.`,
      ),
    },
    {
      type: "faq",
      id: "setup-faq",
      title: `${name} setup FAQ`,
      items: [
        {
          question: `How long should ${name} setup take?`,
          answer: `A focused team can finish day-zero setup in one working day if seats/numbers, call queue / IVR route, CRM CTI / call logging, and one voice channel are already decided. Multi-week “setup” usually means undecided packaging or missing ownership.`,
        },
        {
          question: `Do we need every routing feature on day one?`,
          answer: `No. Prove provision → route → softphone → CRM log first. Add optional add-ons only when a named decision depends on them.`,
        },
        {
          question: `Where do we confirm contacts and minute/number limits?`,
          answer: pricingPointer(ctx),
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

/* --------------------------------------------------------- implementation */

function buildBcImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const callRecording = ctx.feature("call-recording");
  const callRouting = ctx.feature("call-routing");
  const teamMessaging = ctx.feature("team-messaging");
  const reporting = ctx.feature("analytics") ?? ctx.feature("reporting");
  const day30Features = (
    ctx.entryPlanFeatureLabels.length > 0
      ? ctx.entryPlanFeatureLabels
      : ctx.supportedFeatureLabels
  ).slice(0, 5);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in three phases: days 1–30 get numbers live with number and routing hygiene and CRM sync, days 31–60 make weekly queue and call reviews run from ${name}, and days 61–90 add only IVR / routing or queues that still aren’t working.${quickGateHint(ctx)} If agents still route to unowned queues without a CRM sync or do-not-call hygiene by week two, pause new features and fix that first.`,
      bullets: [
        "Freeze 3 outcomes",
        "Name a communications owner",
        "Day 30: live communications loop",
        callRecording || teamMessaging ? "Day 60: channel rhythm" : "Day 60: weekly rhythm",
        "Day 90: expand carefully",
        "Usage before features",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} rollout takeaways`,
      items: compact([
        {
          label: "Implementation is habit work",
          body: `${positioningSentence(ctx)} None of that helps until the weekly communications loop is boring.`,
        },
        {
          label: "Gate features to plan tiers",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Enable in this order",
          body: `Days 1–30: ${joinList(day30Features, 4) || coreLoopPhrase(ctx)}. Days 31–60: ${reporting ? reporting.label : "weekly usage review"}${callRecording ? ` and ${callRecording.label}` : teamMessaging ? ` and ${teamMessaging.label}` : ""}. Days 61–90: ${joinList([callRouting?.label, ctx.hasAi ? "AI assistance" : undefined, "second call queue / IVR route"].filter(Boolean) as string[], 3)}.`,
        },
        {
          label: "Measure usage, not configuration",
          body: `Count answer rates, missed-call rates, minutes used per queue, and CRM-logged calls from ${name} — not modules enabled.`,
        },
        {
          label: "Know what you inherited",
          body:
            ctx.weaknesses.length > 0
              ? `Research watch-outs to plan around: ${clauses(ctx.weaknesses, 3)}.`
              : `Confirm minute and seat discipline and CRM CTI / call logging before you promise a rollout date for ${name}.`,
        },
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "rollout-path",
      title: `${name} 30/60/90 path`,
      steps: [
        { id: "freeze", label: "Freeze", short: "Outcomes" },
        { id: "d30", label: "Day 30", short: "Live loop" },
        { id: "d60", label: "Day 60", short: "Rhythm" },
        { id: "d90", label: "Day 90", short: "Expand" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.setup}/`,
      ctaLabel: "Setup guide →",
    },
    {
      type: "figure",
      id: "implementation-figure",
      title: `${name} implementation walkthrough`,
      src: ctx.figureSrc("implementation"),
      alt: `${name} implementation walkthrough diagram.`,
      caption: `Treat ${name} rollout as gated phases — adoption before credit expansion.`,
    },
    mustNiceMatrix(ctx, "implementation", [
      {
        feature: "Logged CRM activities from calling",
        mustHave: true,
        niceToHave: false,
        notes: "Day 30 exit criteria",
      },
      {
        feature: "Weekly list / sequence review",
        mustHave: true,
        niceToHave: false,
        notes: "Day 60 rhythm",
      },
      {
        feature: callRouting?.label ?? "Extra call routing",
        mustHave: false,
        niceToHave: true,
        notes: "Day 61+ if outcomes miss",
      },
      {
        feature: ctx.hasAi ? "AI assistance" : "Second channel",
        mustHave: false,
        niceToHave: true,
        notes: "Only after habits stick",
      },
    ]),
    phaseChecklist(ctx, "implementation", [
      {
        id: "outcomes",
        label: "Freeze three 90-day outcomes",
        description: "Meetings, coverage, or reply goals with owners.",
      },
      {
        id: "d30",
        label: "Day 30: live communications loop",
        description: "Every active rep runs number → softphone → CRM log weekly.",
      },
      {
        id: "d60",
        label: "Day 60: usage review",
        description: "Minutes/contacts per meeting and sequence hygiene on the agenda.",
      },
      {
        id: "d90",
        label: "Day 90: expand only gaps",
        description: "Add channels or packs that still miss an outcome.",
      },
    ]),
    researchCallout(ctx, "implementation"),
    {
      type: "step",
      stepNumber: 1,
      id: "freeze-outcomes",
      heading: `Freeze outcomes and RACI before you configure ${name}`,
      body: `Lock three 90-day outcomes and name Responsible / Accountable before anyone burns seats/numbers.\n\n1. Write exactly three 90-day outcomes in business language (engagement, coverage and answer-rate, routing coverage).\n2. Assign RACI — Responsible: ${name} communications owner; Accountable: sales/support lead; Consulted: two agents; Informed: Ops / CRM admin.\n3. Write the “not now” list for channels and packs not tied to the three outcomes.\n4. Book the day-30 and day-60 reviews in the calendar now.\n\nWorked example: ${TEAM} freezes three outcomes for ${name}, gives ops two hours a week as Responsible, and defers ${joinList([callRouting?.label, ctx.hasAi ? "AI assistance" : undefined].filter(Boolean) as string[], 2) || "extra optional add-ons and secondary channels"} to day 61.`,
      tip: "If you cannot name three outcomes, you are not ready to expand seats or seats/numbers.",
      figure: teachingFigure(
        ctx,
        "implementation",
        1,
        `Name Responsible + Accountable for ${name} before configuration sprawl.`,
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "day-30",
      heading: "Days 1–30: get the communications loop live",
      body: `Days 1–30 are for ${joinList(day30Features, 4) || coreLoopPhrase(ctx)} — not marketplace browsing.\n\n1. Finish setup: one call queue / IVR route, CRM CTI / call logging, one voice channel.\n2. Invite only daily users; spectators wait.\n3. Run a mid-month spot-check: 20 random callinges must show a CRM activity.\n4. Kill shadow spreadsheets that still hold “the real list.”\n\nWorked example: ${TEAM} runs ${name} as the only place new contacts enter calls, and by day 30 every open routing step has an owner and a CRM log.`,
      tip: "Modules enabled is vanity — CRM-logged calling is the day-30 gate.",
      figure: teachingFigure(
        ctx,
        "implementation",
        2,
        `Day 30 success in ${name}: live numbers and logged calling, not feature sprawl.`,
      ),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "day-60",
      heading: "Days 31–60: install the weekly rhythm",
      body: `Make Friday (or Monday) reviews run from ${name}.\n\n1. Agenda: minutes used vs answered calls, routing quality flags, answer and handle times, CRM CTI / call logging errors.\n2. Add light routing only where a human already does the same step weekly. ${gateLine(ctx, "call-recording") ?? gateLine(ctx, "crm-cti") ?? `Confirm routing/sequence gates in ${name}.`}\n3. Retrain anyone still exporting numbers to personal call logs.\n4. Re-measure adoption before unlocking day-61 packs.\n\nWorked example: ${TEAM} finds two agents still keeping “private” call sheets; they pause new calls until those numbers are suppressed or imported into ${name}.`,
      tip: "A month of dual numbers means you never actually switched.",
      figure: teachingFigure(
        ctx,
        "implementation",
        3,
        `Weekly ${name} reviews decide expand vs fix — not vanity dashboards.`,
      ),
    },
    {
      type: "step",
      stepNumber: 4,
      id: "day-90",
      heading: "Days 61–90: expand only where outcomes still miss",
      body: `1. Re-read the three outcomes. Expand only where an outcome is still missing.\n2. Then, in this order: second call queue / IVR route, ${callRouting?.label ?? "queueation"}, remaining IVR / routing, remaining integrations. ${aiSentence(ctx)}\n3. Write down what you chose not to do and why. That list is your renewal-time evidence.\n4. ${pricingPointer(ctx)}\n\nWorked example: ${TEAM} adds a second ${name} list for after-hours overflow, enables one optional add-on for shared inbox rules, and leaves AI call summaries off because nobody could name the answer-rate decision it would change.`,
      tip: "If every outcome is already green, day 90 is a freeze — not a shopping spree.",
      figure: teachingFigure(
        ctx,
        "implementation",
        4,
        `Day 90 ${name} expansion follows missing outcomes — not unused seats/numbers.`,
      ),
    },
    {
      type: "faq",
      id: "implementation-faq",
      title: `${name} implementation FAQ`,
      items: [
        {
          question: `What if seats/numbers run out before day 30?`,
          answer: `Pause new number provisioning, tighten routing filters, and review who is shadow-logging vs callinging. Do not buy a larger pack until the communications owner can explain cost-per-answered-call or handle time for the last two weeks. Confirm pack options on the pricing page.`,
        },
        {
          question: `When should we add a second voice channel?`,
          answer: `After the first channel produces CRM-logged activity and a weekly review rhythm. Parallel channels on day one usually double noise without doubling meetings.`,
        },
        {
          question: `Who should own ${name}?`,
          answer: `One communications owner with calendar time — usually Ops or ops — not a rotating agent committee.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

/* --------------------------------------------------------- migration */

function buildBcMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Migrate into ${name} with a list inventory, field map, pilot import, dual-run week, and CRM CTI / call logging validation — then cut over only when the sales + support team trusts the contacts.${quickGateHint(ctx)} Prove one queue before you move the whole book of numbers and IVR / routing.`,
      bullets: [
        "Inventory numbers and IVR / routing",
        "Map fields and owners",
        "Pilot one queue",
        "Dual-run one week",
        "Validate CRM CTI / call logging",
        "Then cut over",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} migration takeaways`,
      items: [
        {
          label: "Numbers are the product",
          body: `${positioningSentence(ctx)} A migration that moves rows but breaks do-not-call numbers or owners will burn seats/numbers and trust.`,
        },
        {
          label: "Pilot before bulk",
          body: "One agent’s book or one priority queue first — fix mapping before volume.",
        },
        {
          label: "CRM stays the system of record",
          body: integrationSentence(ctx),
        },
        {
          label: "Watch packaging during cutover",
          body: `${planSoftener(ctx)} ${pricingPointer(ctx)}`,
        },
      ],
    },
    {
      type: "decision-framework",
      id: "migration-path",
      title: `${name} migration path`,
      steps: [
        { id: "inventory", label: "Inventory", short: "Numbers" },
        { id: "map", label: "Map", short: "Fields" },
        { id: "pilot", label: "Pilot", short: "Queue" },
        { id: "dual", label: "Dual-run", short: "One week" },
        { id: "cutover", label: "Cutover", short: "Validate" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.setup}/`,
      ctaLabel: "Setup guide →",
    },
    {
      type: "figure",
      id: "migration-figure",
      title: `${name} migration map`,
      src: ctx.figureSrc("migration"),
      alt: `${name} migration map diagram.`,
      caption: `Prove a small ${name} import before you move the whole business communications book.`,
    },
    phaseChecklist(ctx, "migration", [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Numbers, IVR / routing, routing books, do-not-call numbers, owners.",
      },
      {
        id: "map",
        label: "Sign off the field map",
        description: "Titles, emails, phones, owners, do-not-contact.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One queue; fix mapping before bulk.",
      },
      {
        id: "dual",
        label: "Dual-run one week",
        description: `${name} is write-path; old tool is read-only.`,
      },
      {
        id: "validate",
        label: "Validate with the sales + support team",
        description: "Spot-check contacts and CRM CTI / call logging before cutover.",
      },
    ]),
    researchCallout(ctx, "migration"),
    {
      type: "step",
      stepNumber: 1,
      id: "inventory-map",
      heading: "Inventory numbers and map fields before any import",
      body: `1. Inventory contacts, queues, calls, routing workflows, do-not-call numbers, and owners in the source tool.\n2. Map each critical field to ${name} (and to CRM where sync will write).\n3. Decide archive-only fields — do not invent destinations for junk.\n4. Remap departed owners to living users before volume.\n\nWorked example: ${TEAM} discovers 14% of open routing steps still owned by a departed agent; they remap those owners in the sheet before any ${name} import.`,
      tip: "Never bulk-import until stage/title meanings and owners are signed off.",
      figure: teachingFigure(
        ctx,
        "migration",
        1,
        `Map meanings and owners before volume into ${name}.`,
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "pilot-import",
      heading: "Pilot one queue — then scale",
      body: `1. Choose one agent’s book or one priority queue (tens to low hundreds of records).\n2. Import into ${name}, then spot-check numbers, routes, owners, and do-not-call numbers.\n3. Run one softphone and routing session from the pilot set.\n4. Confirm CRM received the activities before approving bulk.\n\nWorked example: ${TEAM} pilots Sam’s mid-market queue into ${name}, finds two title mappings wrong, fixes the map, and only then schedules the full import.`,
      tip: "Pilot failures are cheap; bulk remaps are not.",
      figure: teachingFigure(
        ctx,
        "migration",
        2,
        `Fix mapping on one ${name} queue before you scale.`,
      ),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "dual-run",
      heading: "Dual-run one week with a hard write rule",
      body: `1. Declare ${name} the write path for new numbers and calling.\n2. Old tool becomes read-only history — no new live traffic there.\n3. If anyone starts new live traffic in the old tool, restart the dual-run week.\n4. End the week with agent sign-off on 20 random contacts.\n\nWorked example: ${TEAM} prints the rule on Slack: “New live calls only in ${name}.” Two violations restart the clock; week two is clean and they cut over.`,
      tip: "A month of dual-running means you never actually switched.",
      figure: teachingFigure(
        ctx,
        "migration",
        3,
        `One dual-run week is enough if ${name} is truly the write path.`,
      ),
    },
    {
      type: "step",
      stepNumber: 4,
      id: "cutover",
      heading: "Cut over after CRM CTI / call logging and team validation",
      body: `1. Validate CRM CTI for call creates and activity logging.\n2. Freeze legacy write access.\n3. Archive or export legacy numbers you still need for audit.\n4. Schedule the first post-cutover usage review.\n\nWorked example: ${TEAM} cutovers only after Priya and Sam each confirm five contacts and their last calling appear correctly in CRM from ${name}.`,
      tip: `${pricingPointer(ctx)} Migration week is a bad time to discover credit caps.`,
      figure: teachingFigure(
        ctx,
        "migration",
        4,
        `Cut over to ${name} only after the sales + support team trusts contacts and CRM CTI / call logging.`,
      ),
    },
    {
      type: "faq",
      id: "migration-faq",
      title: `${name} migration FAQ`,
      items: [
        {
          question: `Should we migrate every historical sequence?`,
          answer: `Usually no. Migrate active IVR / routing and do-not-call numbers first. Archive cold history unless a compliance need says otherwise.`,
        },
        {
          question: `What breaks most often?`,
          answer: `Owner remaps, phone/email field meanings, and CRM CTI / call logging direction. Pilot those three before bulk.`,
        },
        {
          question: `How do seats/numbers factor into migration?`,
          answer: `Bulk imports during migration can trip spam traps. Cap the pilot import, then confirm pack limits on the pricing page.`,
        },
      ],
    },
    relatedLinks(ctx, "migration"),
    interactiveCta(ctx, "migration"),
  ]);
}

/* --------------------------------------------------------- plans */

function buildBcPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const capacity = capacitySentence(ctx);
  const blocker = seatCapBlocker(ctx);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} package by listing day-one must-haves, mapping them to contacts and minute/number limits on researched tiers, and picking the cheapest package that clears every gate — then confirm list price on the pricing page.${quickGateHint(ctx)} Homepage “from” tiles are not a bill of materials.`,
      bullets: [
        "List day-one must-haves",
        "Map seats and numbers",
        "Highest gate sets the tier",
        "Soft-check usage limits",
        "Confirm on pricing page",
        "Defer unused packs",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} plans takeaways`,
      items: [
        {
          label: "Packaging is often usage-shaped",
          body: `${planSoftener(ctx)} ${capacity ?? "Confirm credit and seat limits in writing."}`,
        },
        {
          label: "Must-haves set the tier",
          body: gatedHintSentence(ctx),
        },
        {
          label: "No invented totals",
          body: pricingPointer(ctx),
        },
        {
          label: "Seat discipline still matters",
          body: blocker
            ? blocker
            : `Count who prospects or dials weekly — not the whole org chart — before you compare ${name} packages.`,
        },
      ],
    },
    {
      type: "decision-framework",
      id: "plans-path",
      title: `${name} plan path`,
      steps: [
        { id: "musts", label: "Musts", short: "Day one" },
        { id: "gates", label: "Gates", short: "Tier" },
        { id: "usage", label: "Usage", short: "Minutes/contacts" },
        { id: "confirm", label: "Confirm", short: "Pricing" },
      ],
      ctaHref: ctx.pricingHref,
      ctaLabel: "Pricing page →",
    },
    {
      type: "figure",
      id: "plans-figure",
      title: `${name} plan anatomy`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy diagram.`,
      caption: `Read ${name} from must-have gates and usage upward; confirm numbers on the pricing page.`,
    },
    mustNiceMatrix(ctx, "plans", [
      {
        feature: "Calls + CRM CTI / call logging",
        mustHave: true,
        niceToHave: false,
        notes: "Day-one floor",
      },
      {
        feature: "Softphone or IVR / routing",
        mustHave: true,
        niceToHave: false,
        notes: "One channel",
      },
      {
        feature: "Extra optional add-ons",
        mustHave: false,
        niceToHave: true,
        notes: "After habits",
      },
      {
        feature: "AI assistance",
        mustHave: false,
        niceToHave: true,
        notes: ctx.hasAi ? "Confirm gate" : "Unproven here",
      },
    ]),
    phaseChecklist(ctx, "plans", [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Data, calling, sync that must ship without unused enterprise.",
      },
      {
        id: "qualify",
        label: "Map seats and numbers",
        description: "Use researched plan names — not marketing tiles.",
      },
      {
        id: "confirm",
        label: "Confirm on pricing page",
        description: "List price and seat or number-pack upgrades live there — not in this guide.",
      },
    ]),
    researchCallout(ctx, "plans"),
    {
      type: "step",
      stepNumber: 1,
      id: "must-haves",
      heading: "List day-one must-haves before you open pricing tiles",
      body: `1. Write five day-one jobs for the sales + support team.\n2. Mark which require seats vs seats/numbers vs add-on packs.\n3. Circle the highest gated must-have — that sets the floor tier.\n4. ${gatedHintSentence(ctx)}\n\nWorked example: ${TEAM} needs calls, CRM CTI / call logging, and IVR / routing on day one in ${name}. Extra call routing and AI are nice later, so they refuse to let those upsells set the package.`,
      tip: "If a capability is not required for the first Friday review, it is not day-one spend.",
      figure: teachingFigure(
        ctx,
        "plans",
        1,
        `Must-haves decide the ${name} floor — not the homepage starting tile.`,
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "seats-contacts",
      heading: "Count weekly users and expected minute burn",
      body: `1. Count who takes or places calls weekly — not headcount.\n2. Estimate number provisioning and calls per week (orders of magnitude, not fake precision).\n3. Check researched capacity notes. ${capacity ?? `Confirm seat/number caps for ${name} on the pricing page.`}\n4. ${blocker ? `${blocker} ` : ""}${pricingPointer(ctx)}\n\nWorked example: ${TEAM} counts 8 daily users and 2 managers, defers view-only execs, and refuses any package that cannot explain seat and number renewals in writing.`,
      tip: "If someone never logs into the tool weekly, they are not a seat — they need a report.",
      figure: teachingFigure(
        ctx,
        "plans",
        2,
        `Seat and minute discipline beats vanity headcount for ${name}.`,
      ),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "quote-diligence",
      heading: "When packaging is opaque, demand written gates",
      body: `${ctx.hasPlanMatrix ? `Our snapshot lists researched plans (${planPhrase(ctx)}), but still confirm live terms.` : `Our snapshot has no public plan matrix for ${name} — treat sales claims as unconfirmed until written.`}\n\n1. Named SKUs / editions on the quote.\n2. Seat definition (full vs light) and seat/number definition.\n3. What happens when seats/numbers exhaust mid-month.\n4. Exit / export rights for numbers you built.\n\nWorked example: ${TEAM} delays shortlisting ${name} until seat/number exhaustion behavior and export rights appear in writing.`,
      tip: "No vague quotes — open rows block a fair shortlist.",
      figure: teachingFigure(
        ctx,
        "plans",
        3,
        `Refuse to compare ${name} on a homepage tile alone when seats/numbers matter.`,
      ),
    },
    {
      type: "step",
      stepNumber: 4,
      id: "defer-packs",
      heading: "Defer unused packs; confirm the live price last",
      body: `1. Buy seats/numbers required for the day-one loop.\n2. Defer AI packs, extra channels, and unused add-ons until day 30+ evidence.\n3. Annualize only after you have written terms — never invent monthly×12 from a marketing tile.\n4. Final check: ${ctx.pricingHref}\n\nWorked example: ${TEAM} scopes the first ${name} invoice to seats + core seat and number tiers, parks the AI add-on, and only revisits packs after two Friday reviews.`,
      tip: "Scope the first invoice to the Friday review — everything else waits.",
      figure: teachingFigure(
        ctx,
        "plans",
        4,
        `Confirm ${name} on the pricing page — this guide never invents dollars.`,
      ),
    },
    {
      type: "faq",
      id: "plans-faq",
      title: `${name} plans FAQ`,
      items: [
        {
          question: `Why don’t you list dollar prices here?`,
          answer: pricingPointer(ctx),
        },
        {
          question: `What if there is no public plan matrix?`,
          answer: `Common for business communications. Compare with a written must-have sheet and quote diligence — not blog “starting at” figures.`,
        },
        {
          question: `Seats or seats/numbers — which matters more?`,
          answer: `Whichever your day-one jobs consume. Many teams under-buy seats/numbers and over-buy spectator seats — reverse that.`,
        },
      ],
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

/* --------------------------------------------------------- worth-it */

function buildBcWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth it when your business communications motion matches who it serves well, a non-admin can prove number → softphone → CRM log logging in trial, and seats/numbers on a real package clear your must-haves — confirmed on the pricing page.${quickGateHint(ctx)} If fit, proof, or packaging fails, keep looking instead of forcing a buy.`,
      bullets: [
        "Match best-for scenarios",
        "Prove the communications loop",
        "Accept known tradeoffs",
        "Confirm seats/numbers",
        "No invented ROI",
        "Keep looking if gates fail",
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
          label: "Best for",
          body: bestForPhrase(ctx),
        },
        {
          label: "Not ideal for",
          body: notIdealPhrase(ctx),
        },
        {
          label: "Commercial clarity",
          body: `${planSoftener(ctx)} ${pricingPointer(ctx)}`,
        },
        ctx.verdict
          ? {
              label: "Editorial verdict snapshot",
              body: ctx.verdict,
            }
          : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "worth-it-path",
      title: `${name} worth-it gates`,
      steps: [
        { id: "fit", label: "Fit", short: "Motion" },
        { id: "proof", label: "Proof", short: "Trial" },
        { id: "tradeoffs", label: "Tradeoffs", short: "Accept?" },
        { id: "plan", label: "Package", short: "Minutes/contacts" },
        { id: "decide", label: "Decide", short: "Buy/pass" },
      ],
      ctaHref: ctx.reviewHref,
      ctaLabel: "Full review →",
    },
    {
      type: "figure",
      id: "worth-it-figure",
      title: `${name} worth-it framework`,
      src: ctx.figureSrc("worth-it"),
      alt: `${name} worth-it framework diagram.`,
      caption: `${name} is “worth it” when fit, trial proof, and qualifying cost align.`,
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the communications loop",
        description: "Non-admin number → softphone → CRM log evidence.",
      },
      {
        id: "plan",
        label: "Confirm contacts and minute/number limits",
        description: "Must-haves on a real package before you call it a bargain.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
    {
      type: "step",
      stepNumber: 1,
      id: "fit-gate",
      heading: "Fit gate: does your motion match?",
      body: `Compare your list size, channels, and admin capacity to researched best-for / not-ideal patterns.\n\nBest for: ${bestForPhrase(ctx)}.\nNot ideal: ${notIdealPhrase(ctx)}.\n\nWorked example: ${TEAM} needs mid-market contact data and IVR / routing with CRM sync. They score ${name} on fit only after reading those patterns — not after a polished demo.`,
      tip: "Demo excitement is not a fit signal.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        1,
        `Fit ${name} to your business communications motion before you talk ROI.`,
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "trial-proof",
      heading: "Proof gate: non-admin communications loop",
      body: `1. A non-admin builds or uses a call queue / IVR route in ${name}.\n2. Softphone places or answers a test call.\n3. Routing and recording (if required) complete.\n4. Activity appears in CRM without an admin screenshot.\n\n${trialSentence(ctx)}\n\nWorked example: ${TEAM} fails the gate when the call never lands on the CRM contact; they extend trial, fix sync, and only then reconsider buy.`,
      tip: "Vendor tours do not count as proof.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        2,
        `${name} is worth it only when your team can run the loop.`,
      ),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "tradeoffs",
      heading: "Tradeoff gate: can you live with the limits?",
      body: `Read strengths and weaknesses before you negotiate.\n\nStrengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\nWorked example: ${TEAM} accepts known data coverage gaps for their secondary geo, documents them, and refuses to pretend ${name} is universal coverage.`,
      tip: "Unspoken tradeoffs become renewal fights.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        3,
        `Accept ${name} tradeoffs in writing — or keep looking.`,
      ),
    },
    {
      type: "step",
      stepNumber: 4,
      id: "decide",
      heading: "Package gate and decide",
      body: `1. Confirm must-haves on a qualifying package. ${gatedHintSentence(ctx)}\n2. ${pricingPointer(ctx)}\n3. Buy only when fit + proof + package all say yes.\n4. Otherwise keep looking via how to choose business communications software — ${ctx.alternativeNames.length > 0 ? `teams often also evaluate ${joinList(ctx.alternativeNames, 3)}` : "compare finalists on the same sheet"}.\n\nWorked example: ${TEAM} clears fit and proof but fails package clarity; they pause the buy until seat/number exhaustion rules are written, instead of inventing an ROI percentage.`,
      tip: "No invented ROI — outcomes, usability, and qualifying cost either align or they don’t.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        4,
        `Buy ${name} only when fit, proof, and package gates agree.`,
      ),
    },
    {
      type: "faq",
      id: "worth-it-faq",
      title: `Is ${name} worth it? FAQ`,
      items: [
        {
          question: `Can we decide from a demo alone?`,
          answer: `No. Require non-admin proof of number → softphone → CRM log logging on the package you will actually buy.`,
        },
        {
          question: `What if seats/numbers look cheap but seats are expensive?`,
          answer: `Model the constraint you will hit first. Many teams exhaust seats/numbers before seats — confirm both on the pricing page.`,
        },
        {
          question: `When should we walk away?`,
          answer: `When fit, trial proof, or written packaging fails. Keeping looking is cheaper than forcing ${name} into the wrong motion.`,
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
      Object.entries(value).map(([k, v]) => [k, tidyStrings(v)]),
    ) as T;
  }
  return value;
}

export function buildBcBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(bcBlocksForKind(ctx, kind));
}

function bcBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildBcImplementationBlocks(ctx);
    case "migration":
      return buildBcMigrationBlocks(ctx);
    case "setup":
      return buildBcSetupBlocks(ctx);
    case "plans":
      return buildBcPlansBlocks(ctx);
    case "worth-it":
      return buildBcWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
