import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext, ProductGuidePlanSummary } from "./context";
import type { CrmProductGuideKind } from "./kinds";
import { buildSiBlocksForKind } from "./blocks-si";
import { buildEmBlocksForKind } from "./blocks-em";
import { buildMarketingBlocksForKind } from "./blocks-marketing";
import { buildBcBlocksForKind } from "./blocks-bc";
import { buildEcommerceBlocksForKind } from "./blocks-ecommerce";
import { buildPmBlocksForKind } from "./blocks-pm";
import { buildHrBlocksForKind } from "./blocks-hr";
import { buildAiBlocksForKind } from "./blocks-ai";
import { buildItBlocksForKind } from "./blocks-it";
import { withProductGuideDepth } from "./blocks-depth";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/** Worked-example team used across every product guide. */
const TEAM = "a 12-person B2B advisory team";
const TEAM_SEATS = 12;

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

/** Joins researched lines that may already end in punctuation. */
function clauses(items: readonly string[], max: number, sep = "; "): string {
  return items
    .slice(0, max)
    .map((line) => line.replace(/\s*[.;·]+$/u, ""))
    .join(sep);
}

/**
 * Never invent vendor menus. When the exact control is unknown, point at the
 * capability area and tell the reader to confirm labels in the product.
 */
function uiHint(ctx: ProductGuideContext, area: string): string {
  return `In ${ctx.productName}, open ${area} — confirm the current control labels in the product, docs, or trial.`;
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return "core CRM jobs (contacts, pipeline, activities)";
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) {
    return "contacts, deals, and logged activities";
  }
  return joinList(ctx.coreLoopLabels, 4);
}

function planPhrase(ctx: ProductGuideContext): string {
  if (!ctx.hasPlanMatrix) {
    return "custom / contact-sales pricing (no public plan matrix in our snapshot)";
  }
  return ctx.planNames.join(", ");
}

function bestForPhrase(ctx: ProductGuideContext): string {
  if (ctx.bestFor.length === 0) {
    return "teams that need a clear sales system of record and will admin the tool weekly";
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return "teams that refuse to name an admin owner or need deep ERP/finance as day-one CRM";
  }
  return clauses(ctx.notIdealFor, 4);
}

/** "email sync is researched on Growth, Premium, and Ultimate" — or null. */
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

function missingLine(
  ctx: ProductGuideContext,
  featureSlug: string,
  label: string,
): string | null {
  return ctx.feature(featureSlug)
    ? null
    : `Our ${ctx.productName} research does not list ${label} — treat it as unproven until you see it in the product`;
}

function capabilityOrGap(
  ctx: ProductGuideContext,
  featureSlug: string,
  label: string,
): string {
  return gateLine(ctx, featureSlug) ?? (missingLine(ctx, featureSlug, label) as string);
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
    return `Our research does not name specific ${ctx.productName} integrations, so verify each connector you depend on in the vendor's integration directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the ones your daily loop actually depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on process and habits rather than assistance features.`;
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

function seatCapSentence(ctx: ProductGuideContext): string | null {
  if (ctx.planCapacityNotes.length === 0) return null;
  return `Researched capacity limits: ${clauses(ctx.planCapacityNotes, 4)}.`;
}

/** Plans the worked-example team cannot use because of researched seat caps. */
function seatCapBlocker(ctx: ProductGuideContext): string | null {
  const blocked = ctx.plans.filter(
    (p) => p.seatCap != null && p.seatCap < TEAM_SEATS,
  );
  if (blocked.length === 0) return null;
  const parts = blocked
    .slice(0, 3)
    .map((p) => `${p.name} (up to ${p.seatCap} in research)`);
  return `A ${TEAM_SEATS}-seat team already exceeds ${joinList(parts, 3)}.`;
}

function limitationLines(ctx: ProductGuideContext): string[] {
  const merged = [...ctx.reviewLimitations, ...ctx.enrichmentLimitations];
  const out: string[] = [];
  for (const line of merged) {
    if (!out.includes(line)) out.push(line);
  }
  return out;
}

/** Limitations that are not already covered by the weaknesses list. */
function extraLimitationLines(ctx: ProductGuideContext): string[] {
  const known = new Set(ctx.weaknesses.map((w) => w.toLowerCase()));
  return limitationLines(ctx).filter((line) => !known.has(line.toLowerCase()));
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves against the plan you actually intend to buy.`;
  }
  return `Plan-gated in research: ${ctx.gatedFeatureHints.slice(0, 4).join("; ")}.`;
}

/** Short, natural plan-gate note for Quick Answer — never a research dump. */
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
    return ` Confirm ${phrase(top[0]!)} is on the plan you will actually buy.`;
  }
  return ` Confirm ${phrase(top[0]!)} and ${phrase(top[1]!)} are on the plan you will actually buy.`;
}

function positioningSentence(ctx: ProductGuideContext): string {
  if (ctx.shortDescription) return ctx.shortDescription;
  if (ctx.vendorClaim) return `Vendor positioning: ${ctx.vendorClaim}`;
  return `${ctx.productName} is evaluated here as a sales CRM system of record.`;
}

function keyFeaturePhrase(ctx: ProductGuideContext): string {
  if (ctx.keyFeatures.length > 0) return joinList(ctx.keyFeatures, 4);
  return featurePhrase(ctx);
}

/** Researched limitations as a warning callout — shown on every kind. */
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
    plans: "Weigh these when you pick a qualifying plan.",
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
      ["plans", "Plans / free vs paid"],
      ["worth-it", "Worth it?"],
    ] as const
  )
    .filter(([k]) => k !== kind)
    .map(([k, label]) => ({
      href: `/guides/${ctx.siblingSlugs[k]}/`,
      label: `${ctx.productName} ${label}`,
      description: `Continue the ${ctx.productName} path.`,
    }));

  const category =
    kind === "plans" || kind === "worth-it"
      ? [
          {
            href: "/guides/crm-pricing-guide/",
            label: "CRM pricing guide",
            description: "How seats, tiers, and add-ons work.",
          },
          {
            href: "/guides/crm-total-cost-guide/",
            label: "CRM total cost guide",
            description: "Ownership categories beyond seats.",
          },
          {
            href: "/guides/how-to-choose-crm/",
            label: "How to choose a CRM",
            description: "Full selection framework.",
          },
        ]
      : [
          {
            href: "/guides/crm-requirements-guide/",
            label: "CRM requirements guide",
            description: "Freeze must vs nice before rollout.",
          },
          {
            href: "/guides/crm-selection-process/",
            label: "CRM selection process",
            description: "Gates and owners through Decide.",
          },
          {
            href: "/guides/how-to-choose-crm/",
            label: "How to choose a CRM",
            description: "Framework before you configure.",
          },
        ];

  const tools =
    kind === "plans"
      ? [
          {
            href: "/tools/crm-cost-calculator/",
            label: "CRM Cost Calculator",
            description: "Estimate from researched list prices.",
          },
          {
            href: "/tools/crm-tco-calculator/",
            label: "CRM TCO Calculator",
            description: "Ownership categories beyond seats.",
          },
          {
            href: "/tools/crm-finder/",
            label: "CRM Finder",
            description: "Constrained shortlist if plans do not fit.",
          },
        ]
      : kind === "worth-it"
        ? [
            {
              href: "/tools/crm-finder/",
              label: "CRM Finder",
              description: "Compare fit against alternatives.",
            },
            {
              href: "/tools/crm-vendor-scorecard/",
              label: "Vendor Scorecard",
              description: "Score shortlisted CRMs fairly.",
            },
            {
              href: "/tools/crm-cost-calculator/",
              label: "CRM Cost Calculator",
              description: "Check qualifying plan cost bands.",
            },
          ]
        : [
            {
              href: "/tools/crm-requirements-builder/",
              label: "Requirements Builder",
              description: "Must/nice sheet before configuration.",
            },
            {
              href: "/tools/crm-finder/",
              label: "CRM Finder",
              description: "Re-check fit if rollout stalls.",
            },
            {
              href: "/tools/crm-vendor-scorecard/",
              label: "Vendor Scorecard",
              description: "Keep evaluation evidence handy.",
            },
          ];

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
        description: "Researched plans and sources.",
      },
      ...siblings,
      ...category,
      ...tools,
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
      id: "plan-selector-cta",
      title: `Which ${ctx.productName} plan do you need?`,
      body: `Answer a few questions and find the lowest plan that meets your must-haves — with upgrade drivers and list-price estimates from researched matrices.`,
      href: `/tools/crm-plan-selector/?vendor=${encodeURIComponent(ctx.productSlug)}`,
      ctaLabel: `Find my ${ctx.productName} plan →`,
      variant: "calculator",
    };
  }
  if (kind === "worth-it") {
    return {
      type: "interactive-cta",
      id: "finder-cta",
      title: "Still unsure? Shortlist fairly",
      body: `If ${ctx.productName} is close but not obvious, run CRM Finder and compare finalists with the same requirements — no affiliate-ordered rankings.`,
      href: "/tools/crm-finder/",
      ctaLabel: "Find My CRM →",
      variant: "generic",
    };
  }
  return {
    type: "interactive-cta",
    id: "requirements-cta",
    title: "Freeze outcomes before you configure",
    body: `Use the Requirements Builder to lock must vs nice for ${ctx.productName}, then follow setup and implementation gates.`,
    href: "/tools/crm-requirements-builder/",
    ctaLabel: "Open Requirements Builder →",
    variant: "generic",
  };
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

function mustNiceMatrix(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  rows: Array<{
    feature: string;
    mustHave: boolean;
    niceToHave: boolean;
    notes?: string;
  }>,
): GuideBlockInput {
  return {
    type: "feature-matrix",
    id: `${kind}-matrix`,
    title: `${ctx.productName}: must-have vs nice-to-have`,
    rows,
  };
}

/* ------------------------------------------------------------------ setup */

export function buildSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const emailSync = ctx.feature("email-sync");
  const pipeline = ctx.feature("pipeline-management");
  const customFields = ctx.feature("custom-fields");
  const customPipelines = ctx.feature("custom-pipelines");
  const startPlan =
    ctx.freePlanNames[0] ?? ctx.entryPlanName ?? "the entry plan on the pricing page";
  const capacity = seatCapSentence(ctx);
  const blocker = seatCapBlocker(ctx);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: pick a plan that covers day-one needs, name one admin, configure one pipeline, invite daily users, connect email, then have a non-admin create a deal, log activity, and move a stage.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every module is switched on.`,
      bullets: [
        `Start on ${startPlan}`,
        "Name one admin",
        "One pipeline only",
        emailSync?.gated
          ? `Email sync (${emailSync.planNames[0] ?? "higher plan"}+)`
          : "Connect email",
        "Invite daily users",
        "Prove a seller can run it",
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
          body: `Research lists ${featurePhrase(ctx)} as supported — that is your day-zero surface. ${keyFeaturePhrase(ctx) ? `Editorial key features: ${keyFeaturePhrase(ctx)}.` : ""}`.trim(),
        },
        {
          label: "Check the gates before you promise",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Start on the right plan",
          body: `${ctx.hasPlanMatrix ? `Researched plans: ${planPhrase(ctx)}.` : `${name} is quote-led in our snapshot.`} ${capacity ?? ""} ${blocker ?? ""}`.trim(),
        },
        {
          label: "Connect only what the loop needs",
          body: integrationSentence(ctx),
        },
        ctx.hasAi
          ? {
              label: "AI comes after habits",
              body: `${aiSentence(ctx)} Leave it off until the manual loop is boring and reliable.`,
            }
          : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "setup-path",
      title: `${name} day-zero path`,
      steps: [
        { id: "plan", label: "Plan", short: "Qualify" },
        { id: "workspace", label: "Workspace", short: "Admin owner" },
        { id: "model", label: "Model", short: "Objects" },
        { id: "users", label: "Users", short: "Roles" },
        { id: "sync", label: "Sync", short: "Email" },
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
      caption: `Finish the ${name} core loop — ${coreLoopPhrase(ctx)} — before optional modules.`,
    },
    mustNiceMatrix(ctx, "setup", [
      {
        feature: "One pipeline + required fields",
        mustHave: true,
        niceToHave: false,
        notes: "Day-zero selling loop",
      },
      {
        feature: emailSync?.label ?? "Email sync",
        mustHave: true,
        niceToHave: false,
        notes: emailSync?.gated
          ? `Researched on ${joinList(emailSync.planNames, 3)}`
          : "Confirm on your plan",
      },
      {
        feature: "Non-admin loop proof",
        mustHave: true,
        niceToHave: false,
        notes: "Setup exit criteria",
      },
      {
        feature:
          ctx.feature("workflow-automation")?.label ??
          ctx.feature("sales-automation")?.label ??
          "Workflow automation",
        mustHave: false,
        niceToHave: true,
        notes: "After habits stick",
      },
      {
        feature: ctx.hasAi ? "AI assistance" : "Extra integrations",
        mustHave: false,
        niceToHave: true,
        notes: "Defer until week 4+",
      },
    ]),
    phaseChecklist(ctx, "setup", [
      {
        id: "plan",
        label: `Qualify the ${name} plan`,
        description: "Day-one must-haves on the cheapest researched tier.",
      },
      {
        id: "workspace",
        label: "Name one admin owner",
        description: "Two hours a week for fields, users, hygiene.",
      },
      {
        id: "pipeline",
        label: "Configure one pipeline",
        description: "5–7 buyer-verifiable stages + required fields.",
      },
      {
        id: "users",
        label: "Invite daily users only",
        description: "Least privilege; spectators wait.",
      },
      {
        id: "sync",
        label: "Connect email and calendar",
        description: "Plus one daily tool — document the rest as gaps.",
      },
      {
        id: "loop",
        label: "Prove the non-admin loop",
        description: "Create · log · move — then write the setup note.",
      },
    ]),
    researchCallout(ctx, "setup"),
    {
      type: "step",
      stepNumber: 1,
      id: "choose-plan",
      heading: `Start on the ${name} plan your must-haves need`,
      body: `Write five day-one jobs, map each to a researched ${name} plan, and pick the cheapest tier that covers all five.\n\n1. List the five things sellers must do on day one.\n2. Match each one to a researched ${name} plan. ${gatedHintSentence(ctx)}\n3. Pick the cheapest plan that covers all five.\n4. Check capacity, not just features. ${capacity ?? `Confirm seat/record caps for ${name} before inviting everyone.`}\n\n${trialSentence(ctx)}\n\nWorked example: ${TEAM} needs ${coreLoopPhrase(ctx)} plus email sync on day one in ${name}. ${blocker ? `${blocker} They set up on ${ctx.paidEntryPlanName ?? ctx.entryPlanName ?? "a paid plan"} rather than a capped tier.` : `They start on ${startPlan} and note which capabilities would force an upgrade.`}`,
      tip: `Do not configure against a demo tenant. Demos frequently run on ${ctx.topPlanName ?? "the top tier"} — ask which plan you are looking at.`,
      figure: teachingFigure(
        ctx,
        "setup",
        1,
        `Plan choice decides what you can configure in ${name} at all.`,
      ),
      scenarios: [
        {
          title: ctx.freePlanNames[0] ?? "Entry plan",
          body:
            ctx.freePlanNames.length > 0
              ? `Free start for a pilot pod. ${ctx.plans.find((p) => p.isFree)?.capacityNote ? `Research shows ${ctx.plans.find((p) => p.isFree)?.capacityNote}.` : "Confirm limits before you invite the whole team."}`
              : `Our snapshot lists no free ${name} plan — ${ctx.entryPlanName ?? "the entry tier"} is the floor. Verify on the pricing page.`,
        },
        {
          title: "Qualifying paid plan",
          body: `${ctx.paidEntryPlanName ? `${ctx.paidEntryPlanName} upward` : "Paid tiers"} — stay on the cheapest one that clears every must-have gate.`,
        },
        {
          title: "Quote-only tier",
          body:
            ctx.quotePlanNames.length > 0
              ? `${joinList(ctx.quotePlanNames, 2)} is contact-sales in research — get gates in writing before you design around it.`
              : `No quote-only tier appears in our ${name} snapshot; treat any sales-only promise as unconfirmed.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "workspace-owner",
      heading: "Create the workspace and name one admin owner",
      body: `Name one admin — not a committee — before you invite sellers.\n\n1. Create the workspace with real company name, currency, and timezone.\n2. Name one admin with ~2 hours a week for fields, users, and hygiene.\n3. Agree: new fields and pipelines go through that admin only.\n4. ${uiHint(ctx, "workspace or account settings")}\n\nWorked example: ${TEAM} makes ops the ${name} admin, writes the two-hour commitment into the week, and blocks everyone else from adding fields for 30 days.`,
      tip: "An unnamed admin is the single best predictor of a dead CRM six months later.",
      figure: teachingFigure(
        ctx,
        "setup",
        1,
        `Name one ${name} admin owner before you invite the rest of the team.`,
      ),
      scenarios: [
        {
          title: "Admin owner",
          body: `Fields, users, integrations, and data hygiene in ${name}.`,
        },
        {
          title: "Sales champion",
          body: "Owns stage definitions and what “next step” means.",
        },
        {
          title: "Executive sponsor",
          body: "Clears blockers; does not redesign the data model midweek.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "model-pipeline",
      heading: `Model your data and exactly one pipeline in ${name}`,
      body: `Research confirms ${joinList(ctx.coreLoopLabels, 4) || "core CRM objects"} for ${name} — that is the surface you are configuring here.\n\n1. Decide what a company, a person, and a deal mean in your business, then mirror that in ${name}. ${sentence(capabilityOrGap(ctx, "contact-management", "contact management"))}.\n2. Build one pipeline for your main motion. ${pipeline ? `${sentence(capabilityOrGap(ctx, "pipeline-management", "pipeline management"))}.` : `Our research does not list pipeline management for ${name} — confirm how deals are tracked before you commit.`} ${customPipelines?.gated ? `Custom pipelines are researched on ${joinList(customPipelines.planNames, 3)}, so a second motion may need that tier.` : ""}\n3. Use five to seven stages named after buyer-verifiable events, not internal feelings.\n4. Add only the required fields Friday's review needs: owner, next step, next-step date, expected close. ${customFields?.gated ? `Custom fields are researched on ${joinList(customFields.planNames, 3)}.` : ""}\n5. ${uiHint(ctx, "the objects, pipeline, or deal configuration area")}\n\nWorked example: ${TEAM} configures six stages in ${name} (qualified, scoped, proposal, verbal, won, lost), makes “next step” required, and refuses every other custom field until after go-live.`,
      tip: "Stages nobody can verify from the buyer's side become data lies within a month.",
      figure: teachingFigure(
        ctx,
        "setup",
        2,
        `One ${name} pipeline and four required fields beat a crowded data model.`,
      ),
      scenarios: [
        {
          title: "One motion first",
          body: `A second pipeline in ${name} can wait until the first one is honest.`,
        },
        {
          title: "Required fields",
          body: "Owner, next step, next-step date, expected close — that is it.",
        },
        {
          title: "Archive, do not recreate",
          body: "Legacy fields you will not use belong in an export, not the new workspace.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "users-roles",
      heading: "Invite daily users and set least-privilege roles",
      body: `Invite people who touch deals daily. Spectators can wait.\n\n1. Invite daily users only — viewers often burn paid seats.\n2. Sellers get standard access; admin stays with the owner from step 2.\n3. Count seats against research capacity. ${capacity ?? `Confirm ${name} seat caps before you invite.`} ${blocker ?? ""}\n4. ${uiHint(ctx, "the members, users, or permissions area")}\n5. Log in as a non-admin and prove you can create a deal.\n\nWorked example: ${TEAM} invites eight sellers, two managers, and ops into ${name}; part-time analysts wait until someone proves they need a seat.`,
      tip: `Permission labels differ by ${name} edition — confirm them in the product.`,
      figure: teachingFigure(
        ctx,
        "setup",
        4,
        `Invite ${name} daily users with least privilege — keep admin scarce.`,
      ),
      scenarios: [
        {
          title: "Daily users in",
          body: "Anyone who owns a deal or logs activity.",
        },
        {
          title: "Viewers wait",
          body: "Read-only curiosity is not worth a paid seat in week one.",
        },
        {
          title: "Admin rights scarce",
          body: "One or two admins maximum; everyone else requests changes.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 5,
      id: "sync-integrations",
      heading: "Connect email, calendar, and the first integrations",
      body: `1. Connect email and calendar for the people who own deals. ${emailSync ? `${sentence(capabilityOrGap(ctx, "email-sync", "email sync"))}${emailSync.gated ? " — check your plan before you promise it to the team" : ""}.` : `Our research does not list email sync for ${name}; confirm what activity capture exists before go-live.`}\n2. ${integrationSentence(ctx)}\n3. Connect nothing else. Every extra connector is another thing to debug during onboarding week.\n4. Write down what is not connected. A documented gap is fine; a pretended integration is not.\n5. ${uiHint(ctx, "the integrations or connected-apps area")}\n\nWorked example: ${TEAM} connects mailboxes and ${ctx.integrationNames[0] ?? "their calendar"} in ${name}, then postpones accounting and document tools until the 30-day adoption review.`,
      tip: "If a must-have connector sits behind a higher plan, that is a plan decision — not a setup workaround.",
      figure: teachingFigure(
        ctx,
        "setup",
        3,
        `Connect email, calendar, and one daily tool in ${name} — defer the rest.`,
      ),
      scenarios: [
        {
          title: "Connect now",
          body: `Email, calendar, and ${ctx.integrationNames[0] ?? "the one tool sellers open every day"}.`,
        },
        {
          title: "Connect later",
          body: `${ctx.integrationNames[2] ?? "Finance, document, and reporting tools"} after adoption holds.`,
        },
        {
          title: "Document the gap",
          body: `Anything ${name} research does not confirm goes on the risk list, not the launch deck.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 6,
      id: "prove-loop",
      heading: "Prove the non-admin loop, then write the setup note",
      body: `1. Pick a seller who is not an admin. Watch them create a company and contact, create a deal on the pipeline, log a call or email, set a next step, and move a stage in ${name}.\n2. Fix whatever they had to ask about — that friction is your real training backlog.\n3. Run the same loop on mobile if that matters. ${ctx.feature("mobile-app") ? `${sentence(capabilityOrGap(ctx, "mobile-app", "a mobile app"))}.` : `Our research does not list a mobile app for ${name} — confirm before promising field access.`}\n4. Write a one-page setup note: plan, stage definitions, required fields, admin owner, sync status, known gaps.\n5. Hand that note to the ${name} implementation guide and schedule training on the same pipeline.\n\nWorked example: ${TEAM}'s founder completes the loop in ${name} without ops help, ops writes the one-pager, and only then does the team announce go-live.`,
      tip: "Setup without a training session produces a beautifully configured, empty CRM.",
      figure: teachingFigure(
        ctx,
        "setup",
        4,
        `${name} setup is done only after a non-admin completes the loop unaided.`,
      ),
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: `${name} setup mistakes`,
      items: compact([
        {
          title: "Installing integrations before the pipeline works",
          body: `Connector logos are not a sales process. Get ${coreLoopPhrase(ctx)} right in ${name} first.`,
        },
        {
          title: "Copying a 20-stage template",
          body: "Stages nobody can verify from the buyer's side become noise, then get ignored.",
        },
        {
          title: "Testing only as an admin",
          body: "Admin accounts hide the permission and visibility problems sellers hit on day one.",
        },
        {
          title: "Configuring a capability your plan does not include",
          body: `${gatedHintSentence(ctx)} Check the ${name} plans guide before you design around a gated feature.`,
        },
        {
          title: "Inviting everyone at once",
          body: `Seats and capacity are researched limits, not suggestions. ${seatCapSentence(ctx) ?? "Confirm caps on the pricing page before a bulk invite."}`,
        },
        ctx.weaknesses[0]
          ? {
              title: "Designing around a known weak spot",
              body: `Research flags: ${ctx.weaknesses[0]}. Plan for it during setup instead of discovering it in month two.`,
            }
          : {
              title: "Skipping the written setup note",
              body: "Undocumented stage meanings drift within weeks and nobody can say what changed.",
            },
      ]) as Array<{ title: string; body: string }>,
    },
    {
      type: "faq",
      id: "faq",
      items: compact([
        {
          question: `How do I set up ${name} quickly?`,
          answer: `Qualify the plan, create the workspace with one admin owner, model ${coreLoopPhrase(ctx)} with a single pipeline, invite daily users, connect email and calendar, then prove the loop as a non-admin. Decision rule: no non-admin loop proof means setup is not finished.`,
        },
        {
          question: `Which ${name} plan should I set up on?`,
          answer: `${ctx.hasPlanMatrix ? `Researched plans are ${planPhrase(ctx)}. Pick the cheapest one that carries every day-one must-have — ${gatedHintSentence(ctx)}` : `${name} is quote-led in our snapshot, so ask which edition carries your must-haves in writing.`} See the ${name} plans guide for the full selection algorithm.`,
        },
        {
          question: `Does ${name} email sync work on every plan?`,
          answer: emailSync
            ? `${sentence(capabilityOrGap(ctx, "email-sync", "email sync"))}. ${emailSync.gated ? "Treat that as a plan decision rather than a setup workaround." : "Confirm current packaging on the pricing page before go-live."}`
            : `Our ${name} research does not list email sync. Confirm what activity capture exists in the product before you design the loop around it.`,
        },
        {
          question: "How long should setup take?",
          answer: `A focused small team can finish this six-step path in days, not quarters — the delay is usually agreeing stage definitions, not clicking. ${trialSentence(ctx)}`,
        },
        {
          question: "Should we import all our data during setup?",
          answer: `No. Start with a small clean working set so you can prove the loop, then run the ${name} migration guide's pilot before bulk import.`,
        },
        {
          question: `Which integrations should we connect first in ${name}?`,
          answer: `${integrationSentence(ctx)} Connect email and calendar, plus the one tool sellers already open daily. Everything else waits for the 30-day review.`,
        },
        {
          question: `Should we turn on AI features while setting up ${name}?`,
          answer: `${aiSentence(ctx)} Leave assistance off until the manual loop is reliable — otherwise you cannot tell whether the AI or the process caused a result.`,
        },
        {
          question: "What should I do next?",
          answer: `Continue with the ${name} implementation guide for the 30/60/90 adoption gates, or the migration guide if you are moving history from another system.`,
        },
      ]) as Array<{ question: string; answer: string }>,
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

/* --------------------------------------------------------- implementation */

export function buildImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const automation = ctx.feature("workflow-automation") ?? ctx.feature("sales-automation");
  const reporting = ctx.feature("reporting");
  const forecasting = ctx.feature("forecasting");
  const sequences = ctx.feature("email-sequences");
  const enrichment = ctx.feature("data-enrichment");
  const day30Features = (ctx.entryPlanFeatureLabels.length > 0
    ? ctx.entryPlanFeatureLabels
    : ctx.supportedFeatureLabels
  ).slice(0, 5);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in three phases: days 1–30 get selling work happening in the CRM, days 31–60 make Friday reviews run from ${name}, and days 61–90 add only what still isn’t working.${quickGateHint(ctx)} If sellers still need an admin for basic deal updates by week two, pause new features and fix that first.`,
      bullets: [
        "Freeze 3 outcomes",
        "Name an admin",
        "Day 30: live pipeline",
        automation ? "Day 60: light automation" : "Day 60: weekly rhythm",
        ctx.hasAi ? "Day 90: expand carefully" : "Day 90: expand only if needed",
        "Adoption before features",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} rollout takeaways`,
      items: compact([
        {
          label: "Implementation is habit work",
          body: `${positioningSentence(ctx)} None of that helps until the weekly loop is boring.`,
        },
        {
          label: "Sequence features to plan gates",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Enable in this order",
          body: `Days 1–30: ${joinList(day30Features, 4)}. Days 31–60: ${reporting ? reporting.label : "weekly reporting"}${automation ? ` and ${automation.label}` : ""}. Days 61–90: ${joinList([forecasting?.label, sequences?.label, enrichment?.label, ctx.hasAi ? "AI assistance" : undefined].filter(Boolean) as string[], 3) || "second pipeline and extra integrations"}.`,
        },
        {
          label: "Measure adoption, not configuration",
          body: `Count deals with a next step, stage moves per seller per week, and activities logged in ${name} — not modules enabled.`,
        },
        {
          label: "Know what you inherited",
          body:
            ctx.weaknesses.length > 0
              ? `Research watch-outs to plan around: ${clauses(ctx.weaknesses, 3)}.`
              : `Confirm admin capacity and plan gates before you promise a rollout date for ${name}.`,
        },
        ctx.hasAi
          ? {
              label: "AI is a day-61 decision",
              body: aiSentence(ctx),
            }
          : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "rollout-path",
      title: `${name} 30/60/90 path`,
      steps: [
        { id: "d0", label: "Week 0", short: "Outcomes + RACI" },
        { id: "d30", label: "Days 1–30", short: "Core loop" },
        { id: "d60", label: "Days 31–60", short: "Rhythm" },
        { id: "d90", label: "Days 61–90", short: "Expand" },
        { id: "review", label: "Review", short: "Adopt or fix" },
      ],
      ctaHref: `/guides/${ctx.siblingSlugs.setup}/`,
      ctaLabel: "Setup guide →",
    },
    {
      type: "figure",
      id: "impl-figure",
      title: `${name} implementation walkthrough`,
      src: ctx.figureSrc("implementation"),
      alt: `${name} implementation walkthrough diagram.`,
      caption: `Gate ${name} rollout so configuration never outruns adoption.`,
    },
    mustNiceMatrix(ctx, "implementation", [
      {
        feature: joinList(day30Features, 2) || "Core loop",
        mustHave: true,
        niceToHave: false,
        notes: "Days 1–30",
      },
      {
        feature: reporting?.label ?? "Weekly reporting views",
        mustHave: true,
        niceToHave: false,
        notes: "Days 31–60",
      },
      {
        feature: automation?.label ?? "Light automation",
        mustHave: false,
        niceToHave: true,
        notes: "Only after hygiene holds",
      },
      {
        feature: forecasting?.label ?? "Forecasting",
        mustHave: false,
        niceToHave: true,
        notes: "Days 61–90 if evidence",
      },
      {
        feature: ctx.hasAi ? "AI assistance" : sequences?.label ?? "Sequences",
        mustHave: false,
        niceToHave: true,
        notes: "Measure two-week usage",
      },
    ]),
    phaseChecklist(ctx, "implementation", [
      {
        id: "outcomes",
        label: "Freeze three 90-day outcomes",
        description: "Business language, not module names.",
      },
      {
        id: "raci",
        label: "Assign RACI for admin + sales lead",
        description: "Responsible and Accountable names in writing.",
      },
      {
        id: "d30",
        label: "Prove the day-30 core loop",
        description: "Live deals, training, Friday review inside the CRM.",
      },
      {
        id: "d60",
        label: "Run four weeks of CRM-native reviews",
        description: "Two views + at most one automation.",
      },
      {
        id: "d90",
        label: "Expand only unmet outcomes",
        description: "Confirm plan gates before new capabilities.",
      },
      {
        id: "review",
        label: "Run the adoption scorecard",
        description: "Green / amber / red before calling it done.",
      },
    ]),
    researchCallout(ctx, "implementation"),
    {
      type: "step",
      stepNumber: 1,
      id: "freeze-outcomes",
      heading: "Week 0: freeze three outcomes and assign RACI",
      body: `Lock three 90-day outcomes and name Responsible / Accountable before anyone configures ${name}.\n\n1. Write exactly three 90-day outcomes in business language.\n2. Assign RACI — Responsible: ${name} admin owner; Accountable: sales lead; Consulted: two sellers; Informed: finance and delivery.\n3. Write the “not now” list for anything not tied to the three outcomes.\n4. Book the day-30 and day-60 reviews in the calendar now.\n\nWorked example: ${TEAM} freezes three outcomes for ${name}, gives ops two hours a week as Responsible, and defers ${joinList([forecasting?.label, enrichment?.label, ctx.hasAi ? "AI assistance" : undefined].filter(Boolean) as string[], 2) || "extra pipelines and marketplace apps"} to day 61.`,
      tip: "If stakeholders keep adding must-haves, force a one-in / one-out trade against the three outcomes.",
      figure: teachingFigure(
        ctx,
        "implementation",
        1,
        "Outcomes and owners come before configuration sprawl.",
      ),
    },
    {
      type: "step",
      stepNumber: 2,
      id: "days-1-30",
      heading: `Days 1–30: make one loop real in ${name}`,
      body: `1. Finish the setup guide's six steps if they are not already done — pipeline, users, required fields, email sync, non-admin loop proof.\n2. Turn on only what the loop needs. Research supports ${joinList(day30Features, 5)} on your researched entry tier${ctx.entryPlanName ? ` (${ctx.entryPlanName})` : ""}.\n3. Move real, current deals in — not a demo dataset. Sellers do not trust fake pipelines.\n4. Train on the loop, not the product: one 45-minute session where every seller creates a deal, logs an activity, and sets a next step in ${name} on their own screen.\n5. Hold one Friday pipeline review inside ${name}. If anyone reads from a spreadsheet, that is your day-30 defect.\n\nWorked example: ${TEAM} imports 40 live deals into ${name}, runs one training session on their own pipeline, and bans the shadow spreadsheet from the Friday call in week three.`,
      tip: `Do not enable a second pipeline in ${name} this month, no matter who asks.`,
      figure: teachingFigure(
        ctx,
        "implementation",
        2,
        `Days 1–30 in ${name}: setup done → live deals → train the loop → Friday in CRM.`,
      ),
      scenarios: [
        {
          title: "In scope",
          body: `${joinList(day30Features, 3)} and one pipeline.`,
        },
        {
          title: "Out of scope",
          body: `${joinList([automation?.label, forecasting?.label, sequences?.label].filter(Boolean) as string[], 3) || "Automation, forecasting, and sequences"} — later phases.`,
        },
        {
          title: "Exit criteria",
          body: "Every open deal has an owner, a stage, and a dated next step.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "days-31-60",
      heading: "Days 31–60: build the weekly rhythm and light automation",
      body: `Build the management rhythm in ${name} before you automate.\n\n1. Build two views: open pipeline by stage with next steps, and deals with no activity in 14 days. ${reporting ? `${sentence(capabilityOrGap(ctx, "reporting", "reporting"))}.` : `Confirm what views exist in ${name} before you promise a dashboard.`}\n2. Run every pipeline review from ${name} for four consecutive weeks.\n3. Add automation only where a human forgets something predictable. ${automation ? `${sentence(capabilityOrGap(ctx, automation.slug, automation.label))}${automation.gated ? " — confirm your plan carries it" : ""}.` : `Keep the process manual if ${name} research does not list workflow automation.`}\n4. Fix data quality with rules, not nagging.\n5. ${uiHint(ctx, "the reports, dashboards, or automation area")}\n\nWorked example: ${TEAM} adds two ${name} views and one automation that creates a follow-up task when a deal enters proposal — then stops, because hygiene is still at 70%.`,
      tip: "One automation that everyone understands beats six that nobody can debug.",
      figure: teachingFigure(
        ctx,
        "implementation",
        3,
        `Days 31–60: two ${name} views and at most one automation.`,
      ),
      scenarios: [
        {
          title: "Healthy signal",
          body: "Deals move with notes; the forecast conversation uses CRM numbers.",
        },
        {
          title: "Warning signal",
          body: `Empty next steps, or contact lists maintained outside ${name}.`,
        },
        {
          title: "Hard stop",
          body: "No admin owner after 30 days — fix staffing before features.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "days-61-90",
      heading: "Days 61–90: expand only what evidence justifies",
      body: `1. Re-read the three outcomes. Expand only where an outcome is still missing.\n2. Then, in this order: second pipeline or extra objects, forecasting, sequences, enrichment, remaining integrations. ${sentence(joinList(compact([forecasting, sequences, enrichment]).map((f) => `${f.label} is researched on ${joinList(f.planNames, 3) || "researched plans"}`), 3) || `confirm which capabilities your ${name} plan carries before scheduling this phase`)}.\n3. Decide on AI deliberately. ${aiSentence(ctx)} Turn on one capability, measure whether reps keep using it after two weeks, then decide on the rest.\n4. Connect the remaining integrations from your requirements sheet. ${integrationSentence(ctx)}\n5. Write down what you chose not to do and why. That list is your renewal-time evidence.\n\nWorked example: ${TEAM} adds a second ${name} pipeline for renewals, enables one AI capability for meeting summaries, and leaves enrichment off because nobody could name the decision it would change.`,
      tip: `Every capability you enable in ${name} is a maintenance commitment — someone owns it forever.`,
      figure: {
        src: ctx.figureSrc("implementation"),
        alt: `${name} days 61–90 expansion decision paths.`,
        caption: `Expand ${name} only when an outcome is unmet — not because a feature tour looks shiny.`,
      },
      scenarios: [
        {
          title: "Expand",
          body: "An outcome is unmet and the missing capability is the blocker.",
        },
        {
          title: "Hold",
          body: "Outcome is met — resist the feature tour.",
        },
        {
          title: "Escalate to plans",
          body: `The needed capability is gated. ${gatedHintSentence(ctx)}`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 5,
      id: "adoption-review",
      heading: "Run the adoption review before anyone says “done”",
      body: `Score five adoption metrics at day 30, 60, and 90 before you add more ${name} features.\n\n1. Percentage of open deals with a dated next step.\n2. Stage moves per seller per week.\n3. Activities logged per seller per week.\n4. Number of shadow spreadsheets still in use.\n5. Admin hours actually spent versus the two hours committed.\n\nIf three of five are weak, do not add ${name} features — simplify stages, retrain, or fix ownership.\n\nWorked example: at day 30, two of ${TEAM}'s sellers still rebuilt Friday in a spreadsheet. The team paused automation, cut two ${name} stages, retrained in 30 minutes, and hit 90% next-step coverage by day 45.`,
      tip: `Declare ${name} implementation “done” only when a new hire can run the loop from the one-page note.`,
      figure: teachingFigure(
        ctx,
        "implementation",
        4,
        `Green / amber / red adoption gates for ${name} before you call rollout done.`,
      ),
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: `${name} implementation mistakes`,
      items: compact([
        {
          title: "Configuring everything in week one",
          body: `Unused modules create noise and maintenance. Ship ${coreLoopPhrase(ctx)} first in ${name}.`,
        },
        {
          title: "No named admin owner",
          body: "Without Responsible and Accountable names, fields and hygiene rot quietly.",
        },
        {
          title: "Training managers instead of sellers",
          body: "A manager demo is not a non-admin walkthrough on a seller's own screen.",
        },
        {
          title: "Automating a broken process",
          body: `${automation ? `${sentence(automation.label)} in ${name} multiplies whatever process you already have` : "Automation multiplies whatever process you already have"} — including the mess.`,
        },
        {
          title: "Enabling gated features you did not buy",
          body: `${gatedHintSentence(ctx)} Confirm the plan before you put a capability in the rollout plan.`,
        },
        ctx.weaknesses[1] || ctx.weaknesses[0]
          ? {
              title: "Ignoring a documented tradeoff",
              body: `Research flags: ${ctx.weaknesses[1] ?? ctx.weaknesses[0]}. Decide how you will live with it before day 60.`,
            }
          : {
              title: "Migrating dirty data on day one",
              body: `Pilot a clean subset via the ${name} migration guide instead.`,
            },
      ]) as Array<{ title: string; body: string }>,
    },
    {
      type: "faq",
      id: "faq",
      items: compact([
        {
          question: `How long does ${name} implementation take?`,
          answer: `Small teams reach a usable core loop in weeks when outcomes are frozen and an admin is named; the 30/60/90 frame exists for habits, not clicking. Decision rule: do not call it done until non-admins run the loop unaided and a new hire can follow the one-page note.`,
        },
        {
          question: `What should we enable first in ${name}?`,
          answer: `Start with ${joinList(day30Features, 4)} on your entry tier${ctx.entryPlanName ? ` (${ctx.entryPlanName})` : ""}, one pipeline, and required fields. Everything else waits for adoption evidence.`,
        },
        {
          question: "When should we turn on automation?",
          answer: automation
            ? `Days 31–60, after four clean weekly reviews. ${sentence(capabilityOrGap(ctx, automation.slug, automation.label))}. Automate only predictable human forgetfulness — task creation, owner assignment.`
            : `Our ${name} research does not list workflow automation, so document the manual process and revisit if packaging changes.`,
        },
        {
          question: `When should we enable AI in ${name}?`,
          answer: `${aiSentence(ctx)} Enable it in the days 61–90 phase, one capability at a time, and keep it only if reps still use it two weeks later.`,
        },
        {
          question: "What adoption metrics actually matter?",
          answer: `Next-step coverage on open deals, stage moves per seller per week, activities logged per seller, surviving shadow spreadsheets, and real admin hours. Modules enabled is a vanity metric.`,
        },
        {
          question: "Do we need consultants?",
          answer: `Many SMB ${name} rollouts succeed with an internal admin and a one-page plan. Bring help when integrations, complex permissions, or a large migration exceed that capacity — and scope it in writing against your three outcomes.`,
        },
        {
          question: "What if adoption stalls at day 60?",
          answer: `Stop adding features. Cut stages, re-train on the loop, and check whether the admin owner actually has time. If the core loop still fails, re-open the fit question in the ${name} worth-it guide${ctx.alternativeNames.length > 0 ? ` and compare ${joinList(ctx.alternativeNames, 2)}` : ""}.`,
        },
        {
          question: "What should I do next?",
          answer: `Use the ${name} setup guide for day-zero configuration, the migration guide if history is still moving, and the plans guide if a needed capability turns out to be gated.`,
        },
      ]) as Array<{ question: string; answer: string }>,
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

/* -------------------------------------------------------------- migration */

export function buildMigrationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const customFields = ctx.feature("custom-fields");
  const customPipelines = ctx.feature("custom-pipelines");
  const objectLabels =
    ctx.coreLoopLabels.length > 0 ? ctx.coreLoopLabels : ["contacts", "deals"];

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Migrate into ${name} by listing what you need, mapping fields, piloting one seller’s book, dual-running for a week, then cutting over only after sellers sign off. If you can’t explain where companies, people, and open deals land — and what you will leave behind — don’t run a bulk import yet.`,
      bullets: [
        "Inventory sources",
        "Map fields & stages",
        "Pilot one seller",
        "Dual-run one week",
        "Seller sign-off",
        "Keep an exit copy",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} migration takeaways`,
      items: compact([
        {
          label: "Map to what this product supports",
          body: `${name} research supports ${featurePhrase(ctx)} — your object model has to land inside that, not inside your old CRM's shape.`,
        },
        {
          label: "Pilot beats big-bang",
          body: `One successful ${name} import of a single owner's deals teaches more than a weekend bulk load.`,
        },
        {
          label: "Stage meaning is the real migration",
          body: "Columns copy easily; “what qualified means” does not. Agree stage definitions before mapping.",
        },
        {
          label: "Custom structure has limits",
          body: `${customFields ? `${sentence(capabilityOrGap(ctx, "custom-fields", "custom fields"))}.` : `Our research does not list custom fields for ${name}.`} ${customPipelines?.gated ? `Custom pipelines are researched on ${joinList(customPipelines.planNames, 3)} — check your plan before promising a second motion.` : ""}`.trim(),
        },
        {
          label: "Keep an exit copy",
          body: `Retain source exports until ${name} passes seller spot-checks — and ask the export question before you sign, not at renewal.`,
        },
        {
          label: "Verify tooling, do not assume it",
          body: `Import formats, record limits, and API behaviour belong in ${name} documentation. ${trialSentence(ctx)}`,
        },
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "migration-path",
      title: `${name} migration path`,
      steps: [
        { id: "inventory", label: "Inventory", short: "Objects" },
        { id: "map", label: "Map", short: "Fields" },
        { id: "pilot", label: "Pilot", short: "One book" },
        { id: "dual", label: "Dual-run", short: "Parallel" },
        { id: "validate", label: "Validate", short: "Sellers" },
        { id: "cutover", label: "Cutover", short: "Exit copy" },
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
      caption: `Prove mapping into ${name} before you move every historical activity.`,
    },
    phaseChecklist(ctx, "migration", [
      {
        id: "inventory",
        label: "Inventory sources and objects",
        description: "CRM, sheets, mailboxes — must/later/archive.",
      },
      {
        id: "map",
        label: "Sign the field map",
        description: "Meanings before bulk import.",
      },
      {
        id: "pilot",
        label: "Pilot 20–50 clean records",
        description: "Seller spot-check before scale.",
      },
      {
        id: "dual",
        label: "Run a dual-run week",
        description: `${name} as system of record; old system read-only.`,
      },
      {
        id: "validate",
        label: "Validate counts and samples",
        description: "Open deals and seller-critical records.",
      },
    ]),
    researchCallout(ctx, "migration"),
    {
      type: "step",
      stepNumber: 1,
      id: "inventory",
      heading: `Inventory objects against what ${name} supports`,
      body: `List every source and object before you design a ${name} import.\n\n1. List every source: previous CRM, spreadsheets, mailboxes, invoicing tool, the one person's laptop.\n2. List the objects: companies, people, open deals, closed history, activities, tasks, notes, files.\n3. Map each object to a capability ${name} research confirms — ${joinList(objectLabels, 4)} are the anchors.\n4. Classify each object as must-move, later, or archive-only.\n5. Count records per object.\n\nWorked example: ${TEAM} finds 3,100 contacts, 780 companies, 62 open deals, four years of closed history, and two spreadsheets. Only contacts touched in 24 months, all companies, and open deals are must-move into ${name}; closed history stays in an exported archive.`,
      tip: "Migration is the cheapest moment you will ever have to delete junk. Use it.",
      figure: teachingFigure(
        ctx,
        "migration",
        1,
        "Map meanings first; bulk import second.",
      ),
      scenarios: [
        {
          title: "Must move",
          body: "Open deals, active contacts and companies, recent activities.",
        },
        {
          title: "Later",
          body: "Closed-won history for reporting — after cutover proves stable.",
        },
        {
          title: "Archive only",
          body: `Dead records and fields with no home in ${name}. Export, store, move on.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "field-map",
      heading: "Write the field map — including stage meanings",
      body: `Map meanings first. Bulk import second.\n\n1. Three columns: source field → ${name} destination → transformation rule.\n2. Map object names honestly (account → company, opportunity → deal).\n3. Map stages by buyer-verifiable meaning, not labels — merging stages is fine.\n4. Every record needs an active ${name} owner — no ex-employee owners.\n5. Leftovers: ${customFields ? `${sentence(capabilityOrGap(ctx, "custom-fields", "custom fields"))} — only if someone names the decision it drives.` : `archive export or a notes field if ${name} research does not list custom fields.`}\n6. ${uiHint(ctx, "the import or data-management area")}\n\nWorked example: ${TEAM} maps account → company and opportunity → deal, collapses seven stages into six, reassigns 40 orphaned records, and archives 22 unused columns.`,
      tip: "A field nobody can tie to a decision is clutter — leave it in the export.",
      figure: teachingFigure(
        ctx,
        "migration",
        4,
        `Map source fields and stages into ${name} before you touch bulk import.`,
      ),
      scenarios: [
        {
          title: "One-to-one",
          body: "Name, email, company, owner, close date — mechanical.",
        },
        {
          title: "Needs a rule",
          body: "Stage, status, source, and inconsistent free-text.",
        },
        {
          title: "Do not migrate",
          body: "Fields with no owner, no decision, and no report behind them.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "pilot-import",
      heading: `Pilot one owner's book in ${name}`,
      body: `1. Pick one seller with a representative book — roughly 30–60 open deals and their contacts.\n2. Import companies first, then people, then deals, then activities. Order matters: relationships need their parents to exist.\n3. Run the import on the plan you actually intend to buy${ctx.entryPlanName ? `, not just ${ctx.entryPlanName} if your must-haves live higher` : ""}. ${trialSentence(ctx)}\n4. Check counts against the source before you look at anything else: companies in, people in, deals in, activities in.\n5. Sit with that seller for 20 minutes. Ask them to find three deals and tell you what looks wrong. Their answer is the acceptance test.\n6. Fix the map and re-import the sample. Expect to do this twice; that is the point of a pilot.\n\nWorked example: ${TEAM} pilots 62 deals into ${name}, discovers two stages mapped backwards and every activity timestamped as import day, fixes both, then re-runs the sample before touching the rest of the book.`,
      tip: `Never let the first ${name} import be the whole company on a Friday night.`,
      figure: teachingFigure(
        ctx,
        "migration",
        2,
        `Pilot a small clean segment into ${name} and fix the map before bulk.`,
      ),
      scenarios: [
        {
          title: "Pilot pass",
          body: "Counts match, owners correct, stages sensible, seller recognises their deals.",
        },
        {
          title: "Pilot fail",
          body: "Fix the map, clear the sample, re-import. Do not scale a broken mapping.",
        },
        {
          title: "Tooling limit hit",
          body: `Confirm ${name} import formats and limits in documentation before promising a date.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "dual-run",
      heading: "Dual-run for one week, then validate with sellers",
      body: `1. Announce one rule for the dual-run week: all new activity goes into ${name}; the old system is read-only for history.\n2. Bulk-import the remaining must-move records at the start of that week, in the same object order as the pilot.\n3. Run the validation checklist in ${name}: every open deal has an owner and a stage; deal counts by owner match the source; contacts resolve to companies; no obvious duplicates on the top 50 accounts; activity dates are real, not import dates; required fields are populated.\n4. Hold a 30-minute seller spot-check — each seller opens their own five biggest deals and signs off or flags. Admin approval is not validation.\n5. Log every defect with an owner and a fix date. Unowned defects become permanent distrust.\n\nWorked example: ${TEAM} dual-runs for six working days, catches 14 duplicate companies and three deals with missing owners in ${name}, fixes them all before Friday, and gets verbal sign-off from all eight sellers.`,
      tip: "One week of dual-running is enough. A month of dual-running means you never actually switch.",
      figure: teachingFigure(
        ctx,
        "migration",
        3,
        `Dual-run ${name} as system of record for one week before cutover.`,
      ),
      scenarios: [
        {
          title: "Dual-run rule",
          body: `New work in ${name}; source frozen for edits.`,
        },
        {
          title: "Validation owners",
          body: "Admin checks counts and structure; sellers check their own deals.",
        },
        {
          title: "Rollback plan",
          body: "Know exactly how to clear a bad bulk load and re-import from source.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 5,
      id: "cutover-exit",
      heading: "Cut over — and do your export diligence now",
      body: `Make ${name} the system of record on a named date.\n\n1. Cut over; revoke edit access to the old system the same day.\n2. Store source exports with a note of what they contain and when.\n3. Confirm in writing how you export companies, people, deals, activities, and files out of ${name} — formats, attachments, post-cancellation.\n4. Schedule the day-30 adoption review from the implementation guide.\n5. Update the one-pager: what moved, what was archived, who signed off.\n\nWorked example: once Friday’s ${name} pipeline matched reality, ${TEAM} revoked spreadsheet edits, archived exports, and asked in writing how a future export works — before renewal.`,
      tip: "Cutover without a named admin is how teams drift back to spreadsheets by month three.",
      figure: {
        src: ctx.figureSrc("migration"),
        alt: `${name} cutover and exit diligence diagram.`,
        caption: `Cut over to ${name} only after sellers sign off — then confirm export terms in writing.`,
      },
      scenarios: [
        {
          title: "Cutover ready",
          body: "Validation passed, sellers signed off, defects closed.",
        },
        {
          title: "Cutover blocked",
          body: "Open defects with no owner — hold the date, fix the data.",
        },
        {
          title: "After cutover",
          body: `Follow ${name} implementation gates; do not start adding apps.`,
        },
      ],
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: `${name} migration mistakes`,
      items: compact([
        {
          title: "Big-bang import with no pilot",
          body: `A weekend bulk load into ${name} means Monday surprises and permanent seller distrust.`,
        },
        {
          title: "Bringing every legacy custom field",
          body: `Clutter migrates faster than value. ${customFields ? `${sentence(capabilityOrGap(ctx, "custom-fields", "custom fields"))} — that is not permission to recreate all of it.` : "Leftover fields belong in the archive export."}`,
        },
        {
          title: "Mapping stage names instead of stage meanings",
          body: "Identical names hide different definitions; your forecast inherits the confusion.",
        },
        {
          title: "Skipping seller validation",
          body: `Admins approve structure; sellers notice their missing deals. Both have to sign off in ${name}.`,
        },
        {
          title: "Importing records owned by ex-employees",
          body: `Every ${name} record needs an active owner, or it silently stops being worked.`,
        },
        {
          title: "No retained export and no exit answer",
          body: `Keep source files until ${name} proves trustworthy, and get the export process in writing before you sign.`,
        },
      ]) as Array<{ title: string; body: string }>,
    },
    {
      type: "faq",
      id: "faq",
      items: compact([
        {
          question: `Can we migrate everything into ${name} at once?`,
          answer: `You can, but you should not. Decision rule: pilot one owner's book, fix the map, then scale. Bulk-importing an unvalidated map is the most common reason a CRM rollout loses seller trust.`,
        },
        {
          question: "Which objects should we move first?",
          answer: `Companies, then people, then open deals, then recent activities — parents before children. ${joinList(objectLabels, 4)} are the ${name} anchors in our research; old closed history can stay in an archive export.`,
        },
        {
          question: `How do we map custom fields into ${name}?`,
          answer: customFields
            ? `${sentence(capabilityOrGap(ctx, "custom-fields", "custom fields"))}. Recreate a field only when someone can name the decision or report that depends on it; everything else goes to the archive CSV.`
            : `Our ${name} research does not list custom fields, so plan to fold leftovers into notes or keep them in the archive export. Confirm current capability in the product.`,
        },
        {
          question: "How long should the dual-run last?",
          answer: `One week is usually right: long enough to catch mapping defects, short enough that people actually switch. Freeze the old system for edits during that week or you will migrate twice.`,
        },
        {
          question: "Who should own the migration?",
          answer: `The ${name} admin owner runs the mechanics; a sales champion owns stage meaning; each seller validates their own book. Not an intern alone with a CSV.`,
        },
        {
          question: `What do we validate before cutting over to ${name}?`,
          answer: `Deal counts by owner, every open deal has an owner and stage, contacts resolve to companies, no duplicates in the top accounts, activity dates are real rather than import dates, and required fields are populated. Then seller sign-off.`,
        },
        {
          question: "What about getting data back out later?",
          answer: `Ask before you sign: which objects export, in what format, whether notes and attachments come along, and what happens to data after cancellation. Keep your pre-migration exports either way.`,
        },
        {
          question: "What should I do next?",
          answer: `Run the ${name} setup guide in parallel with the pilot so the target workspace is ready, then follow the implementation guide's 30/60/90 gates after cutover.`,
        },
      ]) as Array<{ question: string; answer: string }>,
    },
    relatedLinks(ctx, "migration"),
    interactiveCta(ctx, "migration"),
  ]);
}

/* ------------------------------------------------------------------ plans */

function planAudience(
  ctx: ProductGuideContext,
  plan: ProductGuidePlanSummary,
  index: number,
): string {
  const previous = index > 0 ? ctx.plans[index - 1] : null;
  const capacity = plan.capacityNote ? ` Research shows ${plan.capacityNote}.` : "";
  const trial =
    plan.trialDays != null ? ` Snapshot records a ${plan.trialDays}-day trial.` : "";

  if (plan.contactSales) {
    return `Quote-led tier — no public price in our snapshot. ${plan.unlocks.length > 0 ? `Research places ${joinList(plan.unlocks, 3)} here.` : "Ask which capabilities require this tier."} Get gates, seats, and term in writing before you design around it.${capacity}`;
  }
  if (plan.isFree) {
    return `Free start for a pilot pod or a solo operator. Research shows it carries ${joinList(plan.includes, 3) || "a limited capability set"}.${capacity} Outgrow it when you need ${joinList(ctx.plans[index + 1]?.unlocks ?? [], 2) || "more seats or more capability"}.${trial}`;
  }
  if (plan.unlocks.length > 0 && !previous) {
    return `Entry tier. Research shows it carries ${joinList(plan.unlocks, 4)}. Choose it only when every must-have on your sheet appears here — otherwise its price is irrelevant to you.${capacity}${trial}`;
  }
  if (plan.unlocks.length > 0) {
    return `Adds ${joinList(plan.unlocks, 4)} in our research on top of ${previous?.name}. Choose it when at least one of those is a day-one must-have — not because it sits comfortably in the middle.${capacity}${trial}`;
  }
  return `Research shows the same capability list as ${previous?.name ?? "the tier below"} in our snapshot, so step up only for a reason you can name: seats, scale, governance, or support.${capacity}${trial} Confirm what changes on the pricing page.`;
}

export function buildPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;

  if (!ctx.hasPlanMatrix) {
    return compact([
      {
        type: "direct-answer",
        id: "quick-answer",
        title: "Quick answer",
        body: `${name} is quote-led in our research — treat pricing like procurement, not a pricing-page browse. List must-haves and seats, get a written quote that names which edition covers each one, and don’t compare totals until those gates are clear.`,
        bullets: [
          "Quote-led pricing",
          "Must-haves first",
          "Edition named in writing",
          "Seats & term fixed",
          "Compare categories",
          "Walk if gates stay vague",
        ],
      },
      {
        type: "key-takeaways",
        id: "key-takeaways",
        title: `${name} commercial takeaways`,
        items: compact([
          {
            label: "Quote-led ≠ blank cheque",
            body: `${positioningSentence(ctx)} You still need a must-have sheet and a seat count before the first call.`,
          },
          {
            label: "Ask for gates in writing",
            body: `Which edition carries ${featurePhrase(ctx)}? ${gatedHintSentence(ctx)}`,
          },
          {
            label: "Research flags to raise on the call",
            body:
              limitationLines(ctx).length > 0
                ? clauses(limitationLines(ctx), 3)
                : `Ask what is add-on versus included for ${name}, and what happens at renewal.`,
          },
          {
            label: "Compare categories, not slogans",
            body: "Licences, implementation, admin time, training, and integration work — the TCO guide lists the categories to price qualitatively.",
          },
          {
            label: "Keep an exit question",
            body: `Export terms matter most when switching costs are high, and ${name} sits at the heavier end of that range.`,
          },
        ]) as Array<{ label: string; body?: string }>,
      },
      {
        type: "decision-framework",
        id: "quote-path",
        title: `${name} commercial diligence`,
        steps: [
          { id: "musts", label: "Musts", short: "Sheet" },
          { id: "seats", label: "Seats", short: "Count" },
          { id: "quote", label: "Quote", short: "Written" },
          { id: "gates", label: "Gates", short: "Editions" },
          { id: "compare", label: "Compare", short: "Categories" },
          { id: "decide", label: "Decide", short: "Sign or walk" },
        ],
        ctaHref: ctx.pricingHref,
        ctaLabel: "Pricing page →",
      },
      {
        type: "figure",
        id: "plans-figure",
        title: `${name} commercial checklist`,
        src: ctx.figureSrc("plans"),
        alt: `${name} plans figure for custom-quote diligence.`,
        caption: `Without a public ${name} matrix, diligence is a written quote against your must-have sheet.`,
      },
      researchCallout(ctx, "plans"),
      {
        type: "step",
        stepNumber: 1,
        id: "musts-sheet",
        heading: "Write the must-have sheet before you talk to sales",
        body: `1. List day-one must-haves in outcome language. Research supports ${featurePhrase(ctx)} for ${name} — say which of those you actually need.\n2. Separate must from nice, and mark which nice-to-haves you would trade away.\n3. Name the integrations you cannot live without. ${integrationSentence(ctx)}\n4. Fix your seat count: daily users, managers, and anyone who needs read access.\n5. Write the constraint you will not break — a date, an admin-capacity limit, or a governance requirement.\n\nWorked example: ${TEAM} evaluating ${name} lists ${joinList(ctx.coreLoopLabels, 3) || "contacts and deals"} plus reporting as must-haves, ${TEAM_SEATS} seats, and one non-negotiable: no rollout that needs more than four admin hours a week.`,
        tip: "A sales conversation without your own sheet becomes a tour of whatever the vendor wants to show.",
        figure: teachingFigure(
        ctx,
        "plans",
        1,
        "Must-haves first; quote second.",
      ),
        scenarios: [
          {
            title: "Must-haves",
            body: `${joinList(ctx.coreLoopLabels, 3) || "Core CRM jobs"} and the reporting the business reads weekly.`,
          },
          {
            title: "Nice-to-haves",
            body: `${ctx.hasAi ? "AI assistance" : "Advanced automation"} and anything you cannot tie to a decision.`,
          },
          {
            title: "Constraints",
            body: "Seat count, admin capacity, timeline, governance requirements.",
          },
        ],
      },
      {
        type: "step",
        stepNumber: 2,
        id: "quote-packet",
        heading: "Send a quote packet and demand edition-level answers",
        body: `Get gates in writing — verbal “it includes everything” dies in procurement.\n\n1. Send outcomes, seats, must-haves, and required integrations in one packet.\n2. Ask in writing: edition per must-have; add-on vs included; minimum seats/term; implementation expectations; export at exit.\n3. Ask which edition the demo tenant runs on.\n4. Log answers next to your sheet.\n\nWorked example: ${TEAM} attaches its ${name} sheet to the sales thread and gets a written edition map — enough to compare against public-tier CRMs.`,
        tip: "No written gate map means no fair comparison.",
        figure: teachingFigure(
          ctx,
          "plans",
          2,
          `Send a ${name} quote packet and demand edition-level answers in writing.`,
        ),
        scenarios: [
          {
            title: "Must include",
            body: "Edition, seats, term, support level, and what is add-on.",
          },
          {
            title: "Ask explicitly",
            body: "Overages, sandbox, admin/implementation expectations, exit and export.",
          },
          {
            title: "Never invent",
            body: "Dollar totals or ROI percentages — wait for the written quote.",
          },
        ],
      },
      {
        type: "step",
        stepNumber: 3,
        id: "seats-and-term",
        heading: "Size seats and fix the term before you negotiate",
        body: `Minimum seats and term often set the floor more than the per-seat rate.\n\n1. Count by role: sellers, managers, ops, read-access consumers.\n2. Ask ${name} for minimum seats and minimum term in writing.\n3. Cap your first term while adoption is unproven.\n4. Ask what happens when seats are added or removed mid-term.\n5. Put seat count and term in the quote request so vendors are comparable.\n\nWorked example: ${TEAM} quotes ${name} at ${TEAM_SEATS} seats plus one ops seat, states a one-year max first term, and asks about mid-term reductions in writing.`,
        tip: "Minimum seats and term decide the real floor price more often than the rate card.",
        figure: teachingFigure(
          ctx,
          "plans",
          3,
          `Fix ${name} seat count and term before you negotiate price.`,
        ),
        scenarios: [
          {
            title: "Seat roles",
            body: "Sellers, managers, ops, and read-only consumers — count all four.",
          },
          {
            title: "Term posture",
            body: "Short first term while adoption is unproven; renegotiate later from evidence.",
          },
          {
            title: "Ask in writing",
            body: "Minimum seats, minimum term, and mid-term seat reductions.",
          },
        ],
      },
      {
        type: "step",
        stepNumber: 4,
        id: "compare-categories",
        heading: "Compare cost categories, not headline numbers",
        body: `Compare categories, not a single headline.\n\n1. Categories: licences, implementation, admin time, training, integrations, migration, support.\n2. Rate ${name} high / medium / low per category with one sentence of why.\n3. Do the same for one public-pricing CRM${ctx.alternativeNames.length > 0 ? ` (research names ${joinList(ctx.alternativeNames, 2)})` : ""}.\n4. Use the TCO Calculator for the frame — do not invent dollar totals.\n\nWorked example: ${TEAM} rates ${name} implementation and admin effort high, integration depth strong, then asks whether the extra effort buys any of their three outcomes.`,
        tip: "A vague enterprise quote is a risk signal, not a prestige feature.",
        figure: teachingFigure(
          ctx,
          "plans",
          4,
          `Compare ${name} cost categories side by side — not one headline number.`,
        ),
        scenarios: [
          {
            title: "Clear quote",
            body: "Edition, seats, term, add-ons, and gates all named.",
          },
          {
            title: "Opaque quote",
            body: "Request a line-item edition map before any internal presentation.",
          },
          {
            title: "Walk away",
            body: "Gates still unclear after two asks — that predicts the renewal too.",
          },
        ],
      },
      {
        type: "step",
        stepNumber: 5,
        id: "decide-quote",
        heading: "Decide: sign, pilot, or walk",
        body: `1. Sign when every must-have has a named edition, seats/term are fixed, and admin capacity exists.\n2. Pilot when one question is open — time-box it. ${trialSentence(ctx)}\n3. Walk when the qualifying edition breaks a written constraint.${ctx.notIdealFor.length > 0 ? ` Weaker fit: ${notIdealPhrase(ctx)}.` : ""}\n4. Write the reason next to the sheet for renewal-you.\n\nWorked example: ${TEAM} pauses ${name} because the qualifying edition assumes IT support they lack, then compares ${joinList(ctx.alternativeNames, 2) || "public-tier CRMs"} on the same sheet.`,
        tip: "“We could not get the gates in writing” is a complete reason to pass.",
        figure: {
          src: ctx.figureSrc("plans"),
          alt: `${name} sign / pilot / walk decision paths.`,
          caption: `Sign ${name} only when edition gates, seats, and admin capacity are written down.`,
        },
        scenarios: [
          {
            title: "Sign",
            body: "Gates written, seats fixed, admin capacity real.",
          },
          {
            title: "Pilot",
            body: "One open question, time-boxed, with a named closing condition.",
          },
          {
            title: "Walk",
            body: `Qualifying edition breaks a constraint — compare alternatives in CRM Finder.`,
          },
        ],
      },
      {
        type: "mistakes",
        id: "mistakes",
        title: `${name} plan mistakes`,
        items: [
          {
            title: "Inventing a price for the internal deck",
            body: `Use the ${name} pricing page and the vendor quote only. Made-up numbers destroy your credibility at approval.`,
          },
          {
            title: "Assuming a free tier exists",
            body: `${name} has no public plan matrix in our snapshot — do not assume a free or self-serve entry point.`,
          },
          {
            title: "Skipping the must-have sheet",
            body: "Quote-led pricing still needs requirements, or the quote defines your requirements for you.",
          },
          {
            title: "Accepting verbal capability claims",
            body: "If a gate is not written down, it is not a commitment you can hold anyone to.",
          },
          {
            title: "Comparing a quote to a headline tile",
            body: "Compare category by category against a CRM with public tiers, or the comparison is theatre.",
          },
          {
            title: "Leaving exit terms to renewal",
            body: `Ask how data leaves ${name} while you still have negotiating leverage.`,
          },
        ],
      },
      {
        type: "faq",
        id: "faq",
        items: compact([
          {
            question: `Does ${name} have free vs paid plans?`,
            answer: `Our researched snapshot contains no public plan matrix for ${name}. Decision rule: treat pricing as quote-led, verify on the pricing page, and never assume a free tier.`,
          },
          {
            question: `What ${name} plans or editions exist?`,
            answer: `${ctx.gatedFeatureHints.length > 0 ? `Research references edition names alongside capabilities: ${ctx.gatedFeatureHints.slice(0, 3).join("; ")}.` : `Our snapshot does not list ${name} edition names.`} Ask the vendor for the current edition map in writing.`,
          },
          {
            question: "How should I estimate cost?",
            answer: `Fix your seat count, list must-haves, request a written quote, then price the non-licence categories qualitatively with the TCO guide. Do not invent list prices or implementation fees.`,
          },
          {
            question: "What questions force a useful quote?",
            answer: `Which edition carries each must-have; what is add-on; minimum seats and term; expected implementation effort; support level; and how export works at the end.`,
          },
          {
            question: `Is ${name} worth the procurement effort?`,
            answer: `${ctx.bestFor.length > 0 ? `Research says it fits: ${bestForPhrase(ctx)}.` : ""} ${ctx.notIdealFor.length > 0 ? `It fits poorly for: ${notIdealPhrase(ctx)}.` : ""} If you are outside the fit pattern, a public-tier CRM will cost less to evaluate, let alone run.`.trim(),
          },
          {
            question: "What if sales will not name the gates?",
            answer: `Ask twice, in writing. If it stays vague, treat that as data about how the relationship will run and shortlist alternatives${ctx.alternativeNames.length > 0 ? ` such as ${joinList(ctx.alternativeNames, 2)}` : ""}.`,
          },
          {
            question: "What should I do next?",
            answer: `Read the ${name} review and worth-it guide, open the pricing page for researched context, and use CRM Finder if you need options with public tiers.`,
          },
        ]) as Array<{ question: string; answer: string }>,
      },
      relatedLinks(ctx, "plans"),
      interactiveCta(ctx, "plans"),
    ]);
  }

  const freeLine =
    ctx.freePlanNames.length > 0
      ? `Free or entry options in our snapshot: ${joinList(ctx.freePlanNames, 3)}.`
      : `Our snapshot lists no free ${name} plan — verify on the pricing page rather than assuming one.`;
  const paidLine =
    ctx.paidPlanNames.length > 0
      ? `Paid plans in our snapshot: ${joinList(ctx.paidPlanNames, 5)}.`
      : `Our snapshot lists no paid ${name} tiers.`;
  const freePlan = ctx.plans.find((p) => p.isFree);
  const blocker = seatCapBlocker(ctx);

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Pick the cheapest ${name} plan that covers every day-one must-have, then estimate seats with the Cost Calculator.${quickGateHint(ctx)} Your highest gated need sets the plan — not the homepage starting price.`,
      bullets: [
        "List must-haves first",
        "Find the highest gate",
        "Cheapest plan that clears it",
        "Count seats honestly",
        ctx.trialDays != null ? `${ctx.trialDays}-day trial` : "Confirm trial terms",
        "Estimate, then verify",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} plan takeaways`,
      items: compact([
        {
          label: "Starting tier ≠ buying tier",
          body: gatedHintSentence(ctx),
        },
        {
          label: `What each ${name} plan is for`,
          body: `${joinList(ctx.planNames, 6)}${ctx.highlightedPlanName ? ` — the vendor highlights ${ctx.highlightedPlanName}, which is a marketing choice, not your requirement.` : "."}`,
        },
        {
          label: "Free vs paid is a capability decision",
          body: `${freeLine} ${freePlan?.capacityNote ? `Research shows ${freePlan.name} allows ${freePlan.capacityNote}.` : ""} ${blocker ?? ""}`.trim(),
        },
        {
          label: "Capacity limits bite before features do",
          body:
            seatCapSentence(ctx) ??
            `Our snapshot does not publish ${name} seat or record caps — confirm them before you commit a team size.`,
        },
        {
          label: "Trial before term",
          body: trialSentence(ctx),
        },
        {
          label: "Numbers live on pricing tools",
          body: `Use ${ctx.pricingHref} and the Cost Calculator for amounts. This guide deliberately carries no prices, so nothing here goes stale or gets quoted wrongly.`,
        },
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "plans-path",
      title: `${name} plan choice path`,
      steps: [
        { id: "musts", label: "Musts", short: "Sheet" },
        { id: "gates", label: "Gates", short: "Tier map" },
        { id: "qualify", label: "Qualify", short: "Cheapest fit" },
        { id: "seats", label: "Seats", short: "Count + caps" },
        { id: "estimate", label: "Estimate", short: "Calculator" },
        { id: "decide", label: "Decide", short: "Stay/step/walk" },
      ],
      ctaHref: "/tools/crm-cost-calculator/",
      ctaLabel: "Cost Calculator →",
    },
    {
      type: "figure",
      id: "plans-figure",
      title: `${name} plan anatomy`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy diagram.`,
      caption: `Qualify your ${name} plan from must-have gates, then estimate with researched prices.`,
    },
    phaseChecklist(ctx, "plans", [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Outcome language, not feature tours.",
      },
      {
        id: "gates",
        label: "Map each must to a researched plan",
        description: "Lowest tier that clears every gate.",
      },
      {
        id: "capacity",
        label: "Confirm seats and capacity notes",
        description: "Limits are part of the plan decision.",
      },
      {
        id: "estimate",
        label: "Estimate with Cost Calculator",
        description: "Then confirm on the pricing page.",
      },
    ]),
    researchCallout(ctx, "plans"),
    {
      type: "step",
      stepNumber: 1,
      id: "map-gates",
      heading: "Map every must-have to a researched plan name",
      body: `Map must-haves to ${name} plan names before you compare starting tiles.\n\n1. Write your day-one must-haves as a list, in outcome language.\n2. Beside each one, write the lowest ${name} plan that research shows carries it. ${gatedHintSentence(ctx)}\n3. Highlight anything unclear and check it on ${ctx.pricingHref} or in the trial.\n4. Note add-ons separately.\n5. Ask which plan any demo runs on before you use it as evidence.\n\nWorked example: ${TEAM} needs ${joinList(ctx.coreLoopLabels, 2) || "contacts and deals"}, email sync, and weekly reporting from ${name}. Two of those sit on the entry tier in research; the highest-gated one sets the plan, so they stop comparing anything cheaper.`,
      tip: "Screenshot the plan name shown during a demo. It is the cheapest evidence you will ever collect.",
      figure: teachingFigure(
        ctx,
        "plans",
        1,
        "Must-haves decide the tier; seats scale the estimate.",
      ),
      scenarios: [
        {
          title: "On the entry tier",
          body: `${joinList(ctx.entryPlanFeatureLabels, 3) || "Core CRM jobs"} — researched on ${ctx.entryPlanName ?? "the entry plan"}.`,
        },
        {
          title: "Gated higher",
          body:
            ctx.gatedFeatureHints.length > 0
              ? ctx.gatedFeatureHints.slice(0, 2).join("; ")
              : `No plan-gated capabilities appear in our ${name} research — confirm on the pricing page.`,
        },
        {
          title: "Add-on or unclear",
          body: "Treat as a separate cost line and confirm before you sign.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "plan-by-plan",
      heading: `What each ${name} plan is actually for`,
      body: `Read these as capability tiers — not good / better / best marketing.\n\n${ctx.plans
        .slice(0, 6)
        .map((p, i) => `${i + 1}. ${p.name} — ${planAudience(ctx, p, i)}`)
        .join("\n")}\n\nWorked example: ${TEAM} drops ${ctx.entryPlanName ?? "the entry tier"} once must-haves sit higher, and compares only the ${name} plans that clear every gate.`,
      tip: `A plan that adds nothing your research can name should be justifiable in one sentence — or skipped.`,
      figure: teachingFigure(
        ctx,
        "plans",
        2,
        `Read each ${name} plan as a capability tier, not a marketing ladder.`,
      ),
      scenarios: ctx.plans.slice(0, 6).map((p, i) => ({
        title: p.name,
        body: p.contactSales
          ? `Quote-led — get gates in writing.${p.capacityNote ? ` ${sentence(p.capacityNote)}.` : ""}`
          : p.unlocks.length > 0
            ? `Unlocks ${joinList(p.unlocks, 3)} in research.${p.capacityNote ? ` ${sentence(p.capacityNote)}.` : ""}`
            : `${i === 0 ? "Entry tier" : "No new researched capability versus the tier below"} — check scale, governance, and support.${p.capacityNote ? ` ${sentence(p.capacityNote)}.` : ""}`,
      })),
    },
    {
      type: "step",
      stepNumber: 3,
      id: "free-vs-paid",
      heading:
        ctx.freePlanNames.length > 0
          ? `Free vs paid: the ${name} decision tree`
          : `Trial vs paid entry: the ${name} decision tree`,
      body:
        ctx.freePlanNames.length > 0
          ? `1. Do all day-one must-haves sit on ${joinList(ctx.freePlanNames, 2)}? If no → paid.\n2. Do seats fit? ${freePlan?.capacityNote ? `${freePlan.name}: ${freePlan.capacityNote}.` : `Confirm ${joinList(ctx.freePlanNames, 2)} capacity.`} ${blocker ? `${blocker}` : ""}\n3. Will you hit a record/object cap within two quarters? If yes → paid now.\n4. Using free to defer a decision? Run a scoped trial with a decide-by date instead.\n\nWorked example: ${TEAM} cannot fit ${TEAM_SEATS} people into ${joinList(ctx.freePlanNames, 1)}, so free becomes a two-week sandbox — not the plan they run on.`
          : `1. No free ${name} plan in our snapshot — the question is trial vs ${ctx.entryPlanName ?? "the entry plan"}. ${trialSentence(ctx)}\n2. Do must-haves sit on ${ctx.entryPlanName ?? "the entry tier"}? If no, entry price is irrelevant.\n3. Can you prove the loop in the trial window with real deals? If no, ask for an extension in writing.\n4. Prefer monthly while fit is unproven over a long annual term.\n\nWorked example: ${TEAM} runs a scoped trial with two sellers, then buys the qualifying plan — not ${ctx.entryPlanName ?? "the entry tier"} — for ${TEAM_SEATS} seats.`,
      tip: "Free is a win only when the sheet genuinely fits. Otherwise it is deferred migration work.",
      figure: teachingFigure(
        ctx,
        "plans",
        3,
        ctx.freePlanNames.length > 0
          ? `Decide free vs paid for ${name} from must-haves and capacity — not the landing tile.`
          : `Decide trial vs paid entry for ${name} from must-haves and proof — not the landing tile.`,
      ),
      scenarios: [
        {
          title: "Free works",
          body:
            ctx.freePlanNames.length > 0
              ? `All must-haves and seats fit inside ${joinList(ctx.freePlanNames, 2)}.`
              : `Not applicable — no free ${name} plan in our snapshot.`,
        },
        {
          title: "Free as sandbox",
          body: "Use it to evaluate, then upgrade on a named date with a named trigger.",
        },
        {
          title: "Paid from day one",
          body: `A gated must-have or a seat cap decides it. ${blocker ?? ""}`.trim(),
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "qualifying-algorithm",
      heading: "Run the qualifying-plan algorithm",
      body: `Hand this five-line algorithm to anyone on the buying team.\n\n1. List must-haves (M1…Mn).\n2. For each Mi, find the lowest ${name} plan that carries it.\n3. Take the highest of those — that is the qualifying plan.\n4. Check capacity. ${seatCapSentence(ctx) ?? `Confirm ${name} seat/record caps on the pricing page.`} If you do not fit, move up one tier.\n5. Count seats honestly (sellers, managers, ops, paid viewers).\n\nThen estimate that plan in the Cost Calculator; add admin / migration / training as categories, not invented totals.\n\nWorked example: ${TEAM} lands on a ${name} qualifying plan set by their highest-gated must-have, counts ${TEAM_SEATS} seats plus ops, and prices only that combination.`,
      tip: `Do not average across ${name} tiers. You buy one plan — it must carry the hardest requirement.`,
      figure: teachingFigure(
        ctx,
        "plans",
        4,
        `Run the ${name} qualifying-plan algorithm before you open the Cost Calculator.`,
      ),
      scenarios: [
        {
          title: "Seat count",
          body: "Include managers, ops, and viewers who consume paid seats.",
        },
        {
          title: "Add-ons",
          body: "Ask which capabilities are separate SKUs and price them as recurring lines.",
        },
        {
          title: "Evidence",
          body: `Keep ${ctx.pricingHref} open beside the Calculator while you work.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 5,
      id: "decide",
      heading: "Decide: stay, step up, or walk away",
      body: `1. Stay on the cheapest qualifying plan when must-haves and seats fit.\n2. Step up when one must-have sits higher — buy the tier, skip the forever workaround.\n3. Walk when the qualifying ${name} plan breaks a written constraint.${ctx.notIdealFor.length > 0 ? ` Research: stronger for ${joinList(ctx.bestFor, 2)}; weaker for ${joinList(ctx.notIdealFor, 2)}.` : ""}\n4. Write plan name, must-have that set it, and re-check date.\n5. Use the worth-it guide for fit — not invented payback maths.\n\nWorked example: when the cheap ${name} tier missed a must-have, ${TEAM} bought the qualifying plan or shortlisted ${joinList(ctx.alternativeNames, 2) || "alternatives"} — they did not pretend the workaround was free.`,
      tip: "A low seat cost on the wrong tier is deferred upgrade debt with interest.",
      figure: {
        src: ctx.figureSrc("plans"),
        alt: `${name} stay / step up / walk decision paths.`,
        caption: `Stay, step up, or walk from the ${name} qualifying plan — not the entry tile.`,
      },
      scenarios: [
        {
          title: "Stay",
          body: "Qualifying plan fits budget posture and trial evidence.",
        },
        {
          title: "Step up",
          body: "Buy the tier that includes the must-have; skip the workaround.",
        },
        {
          title: "Walk",
          body: `Must-haves only on an unacceptable tier — compare ${joinList(ctx.alternativeNames, 2) || "alternatives"} instead.`,
        },
      ],
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: `${name} plan mistakes`,
      items: compact([
        {
          title: "Comparing homepage “from” tiles",
          body: `Your must-haves often sit above the cheapest ${name} tile. Compare qualifying plans only.`,
        },
        {
          title: "Pasting invented totals into a memo",
          body: `Use the Cost Calculator and ${ctx.pricingHref}. Numbers you made up will be the first thing challenged in the approval meeting.`,
        },
        {
          title: "Ignoring which plan the demo ran on",
          body: `Demo tenants are often richer than what you buy — ask, and write the answer down.`,
        },
        {
          title: "Buying free when must-haves are paid",
          body: `${freeLine} Free is only a win when the sheet actually fits.`,
        },
        {
          title: "Missing capacity caps",
          body: `${seatCapSentence(ctx) ?? `Confirm ${name} seat and record caps before committing.`} Caps stop rollouts more often than missing features do.`,
        },
        ctx.weaknesses[0]
          ? {
              title: "Discounting a documented tradeoff",
              body: `Research flags: ${ctx.weaknesses[0]}. Price that in before you sign an annual term.`,
            }
          : {
              title: "Signing annual before the trial finishes",
              body: `${trialSentence(ctx)} Prove the loop first.`,
            },
      ]) as Array<{ title: string; body: string }>,
    },
    {
      type: "faq",
      id: "faq",
      items: compact([
        {
          question: `What ${name} plans exist?`,
          answer: `Our researched snapshot lists ${planPhrase(ctx)}. ${ctx.highlightedPlanName ? `${ctx.highlightedPlanName} is highlighted by the vendor — treat that as marketing, not as your requirement.` : ""} Re-check ${ctx.pricingHref} for current packaging.`.trim(),
        },
        {
          question: `Is there a free ${name} plan?`,
          answer:
            ctx.freePlanNames.length > 0
              ? `Snapshot free or entry plan names: ${joinList(ctx.freePlanNames, 2)}. ${freePlan?.capacityNote ? `Research shows ${freePlan.capacityNote}.` : ""} Confirm limits and gates before you build on it.`.trim()
              : `No free plan appears in our ${name} snapshot, so ${ctx.trialDays != null ? `the researched ${ctx.trialDays}-day trial is how you evaluate before paying` : "ask for an evaluation window in writing"}. Confirm current packaging on ${ctx.pricingHref}.`,
        },
        {
          question: `Which ${name} plan should a small team choose?`,
          answer: `Run the algorithm: lowest plan per must-have, take the highest, check capacity, then count seats. ${gatedHintSentence(ctx)}`,
        },
        {
          question: `What is plan-gated in ${name}?`,
          answer: gatedHintSentence(ctx),
        },
        {
          question: "How do I estimate cost safely?",
          answer: `Must-haves → qualifying plan name → Cost Calculator seats → TCO categories for admin, migration, and training. Do not invent implementation fees or ROI percentages.`,
        },
        {
          question: `Does ${name} offer a free trial?`,
          answer: trialSentence(ctx),
        },
        {
          question: "Is annual billing worth it?",
          answer: `Annual versus monthly is a term and cash-flow choice, not a capability one. While you are still proving adoption, the ability to fail cheaply for one quarter is often worth more than the annual discount.`,
        },
        {
          question: "What should I do next?",
          answer: `Open ${ctx.pricingHref}, run the Cost Calculator on your qualifying plan, and read the ${name} worth-it guide before signature.`,
        },
      ]) as Array<{ question: string; answer: string }>,
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

/* ----------------------------------------------------------------- worth-it */

export function buildWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const trialFeatures =
    ctx.keyFeatures.length > 0 ? ctx.keyFeatures : ctx.supportedFeatureLabels;

  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth buying when three things hold: it fits how you sell, a normal seller can run real deals in a trial without constant admin help, and the plan you need covers your must-haves. If fit, trial proof, or plan coverage fails, keep looking — don’t invent ROI to justify a shaky buy.`,
      bullets: [
        "Fit how you sell",
        "Seller can run deals alone",
        "Plan covers must-haves",
        "Admin time is real",
        "No invented ROI",
        "Walking away is fine",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} decision takeaways`,
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
          label: "Strengths to verify yourself",
          body:
            ctx.strengths.length > 0
              ? `${clauses(ctx.strengths, 4)}. Treat each as a claim to test in the trial, not a fact to repeat.`
              : `Verify ${featurePhrase(ctx)} in a scripted trial rather than a guided demo.`,
        },
        {
          label: "Watch-outs to accept or reject",
          body:
            ctx.weaknesses.length > 0
              ? clauses(ctx.weaknesses, 4)
              : "Admin capacity, plan gates, and export clarity are the usual failure points.",
        },
        {
          label: "Editorial recommendation",
          body:
            ctx.recommendation ??
            ctx.whoShouldChoose ??
            `Read the ${name} review for the full verdict and criterion scores.`,
        },
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "worth-path",
      title: `Is ${name} worth it?`,
      steps: [
        { id: "fit", label: "Fit", short: "Best-for" },
        { id: "stress", label: "Stress-test", short: "Weaknesses" },
        { id: "trial", label: "Trial", short: "Core loop" },
        { id: "plan", label: "Plan", short: "Gates" },
        { id: "owners", label: "Owners", short: "Admin" },
        { id: "decide", label: "Decide", short: "Buy/pass" },
      ],
      ctaHref: ctx.reviewHref,
      ctaLabel: "Product review →",
    },
    {
      type: "figure",
      id: "worth-figure",
      title: `${name} worth-it framework`,
      src: ctx.figureSrc("worth-it"),
      alt: `${name} worth-it decision framework diagram.`,
      caption: `Buy ${name} only when fit, trial evidence, and qualifying cost agree.`,
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Pass the fit checklist",
        description: "Best-for match; not-ideal patterns do not dominate.",
      },
      {
        id: "loop",
        label: "Prove the non-admin core loop",
        description: "Trial evidence beats the demo.",
      },
      {
        id: "plan",
        label: "Confirm the qualifying plan",
        description: "Must-haves on a real tier, capacity included.",
      },
      {
        id: "decide",
        label: "Choose buy · trial · walk",
        description: "Write the reason; do not invent ROI %.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
    {
      type: "step",
      stepNumber: 1,
      id: "fit-check",
      heading: "Score the fit checklist honestly",
      body: `Answer yes or no. Four or more “no” answers means ${name} is the wrong tool right now.\n\n1. Does your motion match who it serves well? Best for: ${bestForPhrase(ctx)}.\n2. Are you outside the poor-fit patterns? Weaker fit: ${notIdealPhrase(ctx)}.\n3. Do you need ${joinList(ctx.coreLoopLabels, 3) || "contacts, deals, and activity tracking"} as day-one work?\n4. Is there an admin with ~2 hours a week?\n5. Can you name the decision better pipeline data would change?\n\nWorked example: ${TEAM} scores five yeses for ${name}; the gap is admin capacity, so they fix that before spending.`,
      tip: "Fit is not flattery. Be willing to fail your own checklist.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        1,
        `Use this ${name} scorecard — four or more “no” answers means keep looking.`,
      ),
      scenarios: [
        {
          title: "Strong fit",
          body: `Motion matches ${joinList(ctx.bestFor, 2) || "best-for patterns"}; admin named.`,
        },
        {
          title: "Borderline",
          body: "Needs are real but admin capacity is thin — trial hard, set a decide-by date.",
        },
        {
          title: "Poor fit",
          body: `Poor-fit patterns dominate — compare ${joinList(ctx.alternativeNames, 2) || "alternatives"}.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "stress-test",
      heading: "Label every watch-out: acceptable, mitigable, or disqualifying",
      body: `Do not start with the strengths list. Sort each researched watch-out into one bucket — no “we will see.”\n\n1. List the watch-outs. ${ctx.weaknesses.length > 0 ? `Start with: ${clauses(ctx.weaknesses, 3)}.` : `Start with admin capacity, plan gates, and export clarity for ${name}.`}\n2. Mark each: acceptable · mitigable (named owner + cost + date) · disqualifying.\n3. Treat strengths as trial claims, not facts. ${ctx.strengths.length > 0 ? `Verify: ${clauses(ctx.strengths, 2)}.` : `Verify ${featurePhrase(ctx)} in the trial.`}\n\nWorked example: ${TEAM} marks one ${name} watch-out mitigable (ops owns it), one acceptable, and one disqualifying if it appears in trial.`,
      tip: "A tradeoff you chose deliberately is manageable. One you discover after signing is a grievance.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        4,
        `Sort ${name} watch-outs into buy / trial / walk paths — disqualifying means stop.`,
      ),
      scenarios: [
        {
          title: "Acceptable",
          body: "You can name why it does not affect your three outcomes.",
        },
        {
          title: "Mitigable",
          body: "Owner, cost, and date attached — or it is not a mitigation.",
        },
        {
          title: "Disqualifying",
          body: `It blocks an outcome — compare ${joinList(ctx.alternativeNames, 2) || "alternatives"} now.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "trial-script",
      heading: `Run a scripted ${name} trial — not a guided demo`,
      body: `Use real deals and your least enthusiastic seller.\n\n1. Non-admin loop: create company + person, create deal, log activity, set next step, move stage.\n2. One task each for: ${joinList(trialFeatures, 3) || "your must-have capabilities"}.\n3. Run one Friday review inside ${name} — no spreadsheet.\n4. Break something on purpose (reassign, merge, export) and time the recovery.\n\n${trialSentence(ctx)}\n\nWorked example: ${TEAM} gives eight scripted tasks to the two sellers least excited about CRM and treats every question as a training-cost line.`,
      tip: "A vendor demo proves the vendor can use the product. That was never in doubt.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        2,
        `Prove a real ${name} deal record works without an admin watching.`,
      ),
      scenarios: [
        {
          title: "Trial pass",
          body: "Core loop works unaided; sellers finish without babysitting.",
        },
        {
          title: "Trial ambiguous",
          body: "Extend once with one written question that would close it.",
        },
        {
          title: "Trial fail",
          body: "Sellers need help for basic record work — that does not improve after purchase.",
        },
      ],
    },
    {
      type: "trial-plan",
      id: "trial-script-plan",
      title: `${name} evaluation script`,
      days: [
        {
          day: 1,
          focus: "Honest workspace",
          tasks: [
            `One ${name} pipeline with real stages`,
            "Three real open deals with next steps",
            "Confirm which plan the trial runs on",
          ],
        },
        {
          day: 3,
          focus: "Non-admin loop",
          tasks: [
            "Seller runs create → log → next step → stage",
            "Log a real call and email",
            "Write down every question asked",
          ],
        },
        {
          day: 7,
          focus: "Weekly review",
          tasks: [
            `Test: ${joinList(trialFeatures, 2) || "key capabilities"}`,
            `Friday review entirely in ${name}`,
            "Reassign an owner and export a list",
          ],
        },
        {
          day: 14,
          focus: "Decide",
          tasks: [
            "Score fit, trial, plan, admin capacity",
            `Confirm qualifying plan on ${ctx.pricingHref}`,
            "Write buy, extend, or pass with a reason",
          ],
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "plan-gate-check",
      heading: "Check the plan gates before you call it good value",
      body: `Price the tier your must-haves actually need.\n\n1. List must-haves the trial proved.\n2. Map each to the lowest ${name} plan. ${gatedHintSentence(ctx)}\n3. The highest plan on that list is what you are buying.\n4. Check capacity too. ${seatCapSentence(ctx) ?? `Confirm ${name} seat/record caps before you commit.`}\n5. Estimate that plan in the Cost Calculator — if it breaks budget, the honest answer is “not worth it.”\n\nWorked example: ${TEAM} finds forecasting forces a higher ${name} plan than budgeted, so they re-run numbers before deciding.`,
      tip: "Value is qualifying plan versus outcome — never entry tile versus hope.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        3,
        `Map ${name} must-haves to the cheapest qualifying plan before you talk price.`,
      ),
      scenarios: [
        {
          title: "Plan pass",
          body: "Must-haves sit on a tier you can accept.",
        },
        {
          title: "Plan stretch",
          body: "Qualifying tier is above budget — decide, do not improvise.",
        },
        {
          title: "Plan fail",
          body: `Capability or capacity blocks you — compare ${joinList(ctx.alternativeNames, 2) || "alternatives"}.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 5,
      id: "decide-buy",
      heading: "Write the one-page decision: buy, extend, or pass",
      body: `Keep it to one page before anyone argues about renewal.\n\n1. Fit score + named gaps.\n2. Watch-outs accepted and who owns each mitigation.\n3. Trial evidence (what non-admins could / could not do).\n4. Qualifying plan and the must-have that set it.\n5. Admin owner + hours.\n6. Buy · extend (one closing condition) · or pass — with a re-check date.\n\nWorked example: ${TEAM} buys ${name} only after the admin is named with real hours and the qualifying plan is confirmed in writing.`,
      tip: `“Worth it” without a named admin is where CRM regret usually starts.`,
      figure: {
        src: ctx.figureSrc("worth-it"),
        alt: `${name} buy / trial / walk decision paths.`,
        caption: `Buy ${name} only when fit, trial proof, and plan coverage all clear.`,
      },
      scenarios: [
        {
          title: "Buy",
          body: "Fit, trial, plan, and owners all green — go to setup.",
        },
        {
          title: "Extend",
          body: "One open question, time-boxed, with a written closing condition.",
        },
        {
          title: "Pass",
          body: `Keep looking${ctx.alternativeNames.length > 0 ? ` — try ${joinList(ctx.alternativeNames, 2)}` : ""}. Better than forced ROI maths.`,
        },
      ],
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: `${name} “worth it” mistakes`,
      items: compact([
        {
          title: "Inventing ROI percentages",
          body: "Use adoption evidence and cost bands. A fabricated payback number loses approval meetings.",
        },
        {
          title: "Confusing brand polish with fit",
          body: `Research says ${name} fits ${joinList(ctx.bestFor, 2) || "specific patterns"} — check yours.`,
        },
        {
          title: "Trialling with your biggest champion",
          body: "Champions succeed with anything. Give the script to the sceptic.",
        },
        {
          title: "Calling the entry tile a bargain",
          body: `${gatedHintSentence(ctx)}`,
        },
        {
          title: "Buying without an admin owner",
          body: "No named owner with real hours means the data decays and the tool gets blamed.",
        },
        {
          title: "Treating this page as the full review",
          body: `Read the ${name} review for criterion scores and evidence.`,
        },
      ]) as Array<{ title: string; body: string }>,
    },
    {
      type: "faq",
      id: "faq",
      items: compact([
        {
          question: `Is ${name} worth it for small teams?`,
          answer: `Yes when your motion matches ${joinList(ctx.bestFor, 2) || "the best-for patterns"}, someone can admin weekly, and the qualifying plan clears must-haves. No admin capacity means not worth it yet.`,
        },
        {
          question: `Who should not buy ${name}?`,
          answer: `Weaker fit: ${notIdealPhrase(ctx)}.${ctx.whoShouldConsiderAlternatives ? ` ${ctx.whoShouldConsiderAlternatives}` : ""}`,
        },
        {
          question: `What are the main ${name} tradeoffs?`,
          answer:
            ctx.weaknesses.length > 0
              ? `${clauses(ctx.weaknesses, 3)}. Label each acceptable, mitigable, or disqualifying before you sign.`
              : `Confirm admin capacity, plan gates, and export terms for ${name}.`,
        },
        {
          question: `How do I test ${name} properly?`,
          answer: `Scripted trial with real deals and a sceptical seller: non-admin loop, one task per key capability, one Friday review in ${name}, one recovery task. ${trialSentence(ctx)}`,
        },
        {
          question: "How is this different from the review?",
          answer: `The review carries verdict and scores. This guide is the decision memo: fit, watch-outs, trial, plan gates, buy/extend/pass.`,
        },
        {
          question: `Which ${name} plan should I price?`,
          answer: `The one set by your highest-gated must-have. ${gatedHintSentence(ctx)} Estimate that plan in the Cost Calculator.`,
        },
        {
          question: "What if we already bought it?",
          answer: `Re-run setup and implementation checklists, measure adoption, and audit plan gates before renewal.`,
        },
        {
          question: "What should I do next?",
          answer: `Read the ${name} review, run plans diligence for the qualifying tier, or shortlist with CRM Finder if the answer is “not yet.”`,
        },
      ]) as Array<{ question: string; answer: string }>,
    },
    relatedLinks(ctx, "worth-it"),
    interactiveCta(ctx, "worth-it"),
  ]);
}

/**
 * Optional research fields leave gaps when absent ("… plans. .") — normalise
 * spacing on every string leaf instead of guarding each interpolation.
 */
function tidyStrings<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/[ \t]{2,}/g, " ")
      .replace(/[ \t]+([.,;:!?])/g, "$1")
      .replace(/[ \t]+\n/g, "\n")
      .trim() as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => tidyStrings(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        tidyStrings(v),
      ]),
    ) as unknown as T;
  }
  return value;
}

export function buildBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  let raw: GuideBlockInput[];
  if (ctx.categorySlug === "sales-intelligence") {
    raw = buildSiBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "email-marketing") {
    raw = buildEmBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "marketing") {
    raw = buildMarketingBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "business-communications") {
    raw = buildBcBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "hr") {
    raw = buildHrBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "ecommerce") {
    raw = buildEcommerceBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "project-management") {
    raw = buildPmBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "ai") {
    raw = buildAiBlocksForKind(ctx, kind);
  } else if (ctx.categorySlug === "it-development") {
    raw = buildItBlocksForKind(ctx, kind);
  } else {
    raw = blocksForKind(ctx, kind);
  }
  return withProductGuideDepth(tidyStrings(raw), ctx, kind);
}

function blocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildImplementationBlocks(ctx);
    case "migration":
      return buildMigrationBlocks(ctx);
    case "setup":
      return buildSetupBlocks(ctx);
    case "plans":
      return buildPlansBlocks(ctx);
    case "worth-it":
      return buildWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
