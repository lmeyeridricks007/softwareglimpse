import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import {
  GUIDE_MIN_PROSE_WORDS,
  GUIDE_NEAR_COMPLETE_WORDS,
  proseWordsFromBlocks,
} from "@/services/guides/guide-prose";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const MIN_WORDS = GUIDE_MIN_PROSE_WORDS;

function joinList(items: readonly string[], max = 4): string {
  const picked = items.filter(Boolean).slice(0, max);
  if (picked.length === 0) return "";
  if (picked.length === 1) return picked[0] as string;
  if (picked.length === 2) return `${picked[0]} and ${picked[1]}`;
  return `${picked.slice(0, -1).join(", ")}, and ${picked[picked.length - 1]}`;
}

function nextStepNumber(blocks: GuideBlockInput[]): number {
  return blocks.filter((b) => b.type === "step").length + 1;
}

function insertBeforeTerminal(
  blocks: GuideBlockInput[],
  extra: GuideBlockInput[],
): GuideBlockInput[] {
  const terminal = blocks.findIndex(
    (b) =>
      b.type === "faq" ||
      b.type === "interactive-cta" ||
      b.type === "related-content",
  );
  if (terminal === -1) return [...blocks, ...extra];
  return [...blocks.slice(0, terminal), ...extra, ...blocks.slice(terminal)];
}

function supplementalSteps(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  startNum: number,
  idPrefix = "depth",
): GuideBlockInput[] {
  const name = ctx.productName;
  const TEAM = ctx.audienceHints[0] ?? "Harbor Ops (mid-market team)";

  const integrationLine =
    ctx.integrationNames.length > 0
      ? `Research lists ${joinList(ctx.integrationNames)} for ${name}. Confirm which are native vs API before go-live.`
      : `List integrations ${name} must connect to and verify native vs manual paths before go-live.`;

  const gateLine =
    ctx.gatedFeatureHints.length > 0
      ? `Feature gates researched on ${name}: ${joinList(ctx.gatedFeatureHints, 3)}. Map each must-have to the plan that unlocks it.`
      : `Map must-have workflows to the ${name} plan that unlocks them — demos often run above the tier you can afford.`;

  const aiLine = ctx.hasAi
    ? `AI surfaces on ${name} include ${joinList(ctx.aiCapabilityLabels, 3) || "AI assistance"}${ctx.aiPlanNames.length ? ` on ${joinList(ctx.aiPlanNames)}` : ""}. Turn on AI only after the core loop works without it.`
    : `Treat optional AI modules on ${name} as phase-two — prove the core loop first.`;

  if (kind === "setup") {
    return [
      {
        type: "step",
        stepNumber: startNum,
        id: `${idPrefix}-integrations`,
        heading: `Connect the integrations ${name} must have on day one`,
        body: `${integrationLine}\n\n1. Pick one identity or SSO path if required.\n2. Connect one operational integration the weekly users touch daily.\n3. Document anything left as manual export.\n\nWorked example: ${TEAM} connects the one integration that prevents double entry before inviting the full team.`,
        tip: "Integrations marked “available” on a website are not configured in your tenant.",
        scenarios: [
          { title: "Native connector", body: "Prefer OAuth paths IT can audit." },
          { title: "API / webhook", body: "Name an owner when the sync breaks." },
          { title: "Manual export", body: "Accept only for low-volume, low-risk data." },
        ],
      },
      {
        type: "step",
        stepNumber: startNum + 1,
        id: `${idPrefix}-train`,
        heading: "Train weekly users — not a one-time all-hands",
        body: `Train the people who must open ${name} every week. Cover: login, the core loop (${joinList(ctx.coreLoopLabels, 3) || "primary workflow"}), and where to log blockers.\n\nWorked example: ${TEAM} runs a 30-minute working session on live data and includes one sceptic who will actually use the tool.`,
        tip: "If sceptics will not attend, fix the ritual before buying more seats.",
      },
      {
        type: "step",
        stepNumber: startNum + 2,
        id: `${idPrefix}-document`,
        heading: "Write the setup note stakeholders can audit",
        body: `Document plan tier, admin owner, integrations live, and the non-admin proof (${joinList(ctx.supportedFeatureLabels, 3) || "core workflow"}). Link to ${ctx.pricingHref} for commercial detail.\n\nWorked example: ${TEAM} stores a one-page note finance and IT can read without joining another demo.`,
        tip: "Undocumented setup becomes “we thought SSO was included” at renewal.",
      },
    ];
  }

  if (kind === "implementation") {
    return [
      {
        type: "step",
        stepNumber: startNum,
        id: `${idPrefix}-gates`,
        heading: "Lock plan gates before phase two",
        body: `${gateLine}\n\nWorked example: ${TEAM} freezes must-haves on the qualifying tier before adding automations.`,
        tip: "Phase-two features on the wrong tier stall rollouts.",
      },
      {
        type: "step",
        stepNumber: startNum + 1,
        id: `${idPrefix}-adoption`,
        heading: "Measure adoption on the core loop only",
        body: `Track weekly completion of the primary workflow — not logins alone. If ${name} is empty after 30 days, pause new modules and fix the ritual.\n\nWorked example: ${TEAM} reviews completion rates before enabling ${ctx.hasAi ? "AI add-ons" : "extra hubs"}.`,
        tip: "Dashboards nobody opens mean the rollout is not done.",
      },
      {
        type: "step",
        stepNumber: startNum + 2,
        id: `${idPrefix}-expand`,
        heading: "Expand scope only after 90-day proof",
        body: `${aiLine}\n\nAdd automations, secondary hubs, or advanced reporting only after the core loop survives a full quarter.\n\nWorked example: ${TEAM} schedules a 90-day review before buying add-on seats.`,
        tip: "Scope creep in month two is the main killer of ops rollouts.",
      },
    ];
  }

  if (kind === "migration") {
    return [
      {
        type: "step",
        stepNumber: startNum,
        id: `${idPrefix}-inventory`,
        heading: `Inventory what must move into ${name}`,
        body: `List users, historical records, templates, and integrations that must survive migration. Mark nice-to-have exports you can leave behind.\n\nWorked example: ${TEAM} migrates active records only and archives the rest as read-only exports.`,
        tip: "Migrating every legacy field recreates the mess you are escaping.",
      },
      {
        type: "step",
        stepNumber: startNum + 1,
        id: `${idPrefix}-parallel`,
        heading: "Run parallel cutover with a rollback path",
        body: `Keep the old system read-only until ${name} passes non-admin proof. Name a rollback owner and maximum parallel window.\n\nWorked example: ${TEAM} caps parallel run at two weeks with daily checkpoint notes.`,
        tip: "Open-ended parallel runs never end.",
      },
      {
        type: "step",
        stepNumber: startNum + 2,
        id: `${idPrefix}-verify`,
        heading: "Verify counts and permissions after import",
        body: `Reconcile user counts, role permissions, and a sample of migrated records. ${integrationLine}`,
        tip: "Spot-check 20 records a human actually uses — not admin-only test rows.",
      },
    ];
  }

  if (kind === "plans") {
    return [
      {
        type: "step",
        stepNumber: startNum,
        id: `${idPrefix}-gates-plans`,
        heading: "Map must-haves to plan names in writing",
        body: `${gateLine}\n\nCompare ${joinList(ctx.planNames, 4) || "published tiers"} on the same headcount assumption.\n\nWorked example: ${TEAM} screenshots the plan shown in demo and matches it to ${ctx.pricingHref}.`,
        tip: "“Contact sales” tiers need gates documented before configuration starts.",
      },
      {
        type: "step",
        stepNumber: startNum + 1,
        id: `${idPrefix}-tco`,
        heading: "Model seats, usage, and add-ons together",
        body: ctx.pricingSummary
          ? `${ctx.pricingSummary} Add usage units and add-on SKUs to the same sheet before comparing vendors.`
          : `Build one sheet: seats, usage units, add-on SKUs, and overage triggers for ${name}. Compare totals — not entry tiles.`,
        tip: "Finance approves totals, not marketing “from” prices.",
      },
      {
        type: "step",
        stepNumber: startNum + 2,
        id: `${idPrefix}-quote`,
        heading: "Get a written quote on the qualifying configuration",
        body: `Ask ${name} for a quote that names plan, seats, usage band, and add-ons. Store it next to alternatives with the same assumptions.\n\nWorked example: ${TEAM} files quotes in the same folder with identical date and headcount headers.`,
        tip: "Verbal discounts do not survive vendor rep turnover.",
      },
    ];
  }

  const verdict = ctx.verdict ?? ctx.recommendation ?? ctx.shortDescription;
  return [
    {
      type: "step",
      stepNumber: startNum,
        id: `${idPrefix}-fit`,
      heading: `Decide if ${name} fits the primary job`,
      body: ctx.whoShouldChoose
        ? ctx.whoShouldChoose
        : `${name} fits teams whose weekly output matches ${joinList(ctx.coreLoopLabels, 3) || "the researched core loop"}. ${verdict ? `${verdict}` : ""}`,
      tip: "Worth-it is about job fit first — not star ratings.",
    },
    {
      type: "step",
      stepNumber: startNum + 1,
        id: `${idPrefix}-alternatives`,
      heading: "Compare finalists in the same cluster",
      body:
        ctx.alternativeNames.length > 0
          ? `Peer alternatives to compare: ${joinList(ctx.alternativeNames)}. Run the same trial script on each before you decide.`
          : `Shortlist peers in the same job cluster from the category Best page — same trial script on each finalist.`,
      tip: "Mixed-cluster comparisons produce mixed demos.",
      scenarios: [
        {
          title: "Strong fit",
          body: ctx.bestFor[0] ?? "Core job works weekly without admin rescue.",
        },
        {
          title: "Weak fit",
          body: ctx.notIdealFor[0] ?? "Primary job needs a different product shape.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: startNum + 2,
        id: `${idPrefix}-decide`,
      heading: "Write the decision in one paragraph",
      body: `Name the job, the qualifying ${name} configuration, and what you are not buying yet. Link ${ctx.reviewHref} for product detail and ${ctx.pricingHref} for commercial assumptions.`,
      tip: "If you cannot explain why #2 lost, rerun the trial fairly.",
    },
  ];
}

function nearCompleteTopUp(
  ctx: ProductGuideContext,
  startNum: number,
): GuideBlockInput[] {
  return [
    {
      type: "step",
      id: "depth-topup",
      stepNumber: startNum,
      heading: `Before you sign with ${ctx.productName}`,
      body: `Confirm the qualifying plan, non-admin proof, and integration owners in writing. Store quotes next to ${ctx.pricingHref} and the evaluation scorecard so finance can audit the same assumptions at renewal.`,
      tip: "Verbal promises do not survive rep turnover or plan repricing.",
    },
  ];
}

/** Expand thin product-guide packs to ~5 min prose (CRM-depth bar). */
export function withProductGuideDepth(
  blocks: GuideBlockInput[],
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  let result = [...blocks];
  for (const prefix of ["depth", "depth-b", "depth-c"] as const) {
    if (proseWordsFromBlocks(result) >= GUIDE_MIN_PROSE_WORDS) break;
    if (
      result.some(
        (b) => b.type === "step" && String(b.id ?? "").startsWith(`${prefix}-`),
      )
    ) {
      continue;
    }
    result = insertBeforeTerminal(
      result,
      supplementalSteps(ctx, kind, nextStepNumber(result), prefix),
    );
  }
  const words = proseWordsFromBlocks(result);
  if (
    words >= GUIDE_NEAR_COMPLETE_WORDS &&
    words < GUIDE_MIN_PROSE_WORDS &&
    !result.some((b) => b.id === "depth-topup")
  ) {
    result = insertBeforeTerminal(
      result,
      [
        ...nearCompleteTopUp(ctx, nextStepNumber(result)),
        {
          type: "step",
          id: "depth-topup-2",
          stepNumber: nextStepNumber(result) + 1,
          heading: "Write the decision memo",
          body: `Name the job, the qualifying ${ctx.productName} configuration, and what you are not buying yet. If stakeholders cannot explain why an alternative lost, the trial was not fair.`,
          tip: "One paragraph beats a slide deck for audit trails.",
        },
      ],
    );
  }
  return result;
}
