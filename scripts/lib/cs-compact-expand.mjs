/**
 * Expand compact Customer Service product configs into full onboard objects.
 */
import {
  freePlan,
  contactSalesPlan,
  planPerSeatAnnual,
  planPerSeatMonthly,
  planFlatAnnual,
} from "./cs-onboard-runtime.mjs";

const ALL_FEATURES = {
  ticketing: "not-supported",
  "shared-inbox": "not-supported",
  "live-chat": "not-supported",
  "knowledge-base": "limited",
  "omnichannel-inbox": "not-supported",
  "sla-routing": "not-supported",
  "macros-automation": "limited",
  "self-service-portal": "limited",
  "csat-surveys": "limited",
  "helpdesk-reporting": "limited",
  "ecommerce-helpdesk": "not-supported",
  "itsm-service-desk": "not-supported",
  "chatbot-ai-agent": "limited",
  "agent-copilot": "limited",
  "phone-support": "not-supported",
  "helpdesk-integrations": "limited",
};

export function expandCsProduct(c) {
  const featureOverrides = { ...ALL_FEATURES, ...(c.featureOverrides ?? {}) };
  const enrichmentPlans = (c.plans ?? []).map((pl) => {
    if (pl.kind === "free") {
      return freePlan(pl.slug, pl.name, {
        limits: pl.limits,
        description: pl.description,
        highlighted: pl.highlighted,
      });
    }
    if (pl.kind === "contact-sales") {
      return contactSalesPlan(pl.slug, pl.name, {
        description: pl.description,
        hasFreeTrial: pl.hasFreeTrial,
        trialDays: pl.trialDays,
        highlighted: pl.highlighted,
        limits: pl.limits,
      });
    }
    if (pl.kind === "per-seat-monthly") {
      return planPerSeatMonthly(pl.slug, pl.name, pl.amount, {
        highlighted: pl.highlighted,
        hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
        trialDays: pl.trialDays ?? c.trialDays,
        limits: pl.limits,
        description: pl.description,
        minimumSeats: pl.minimumSeats,
        maximumSeats: pl.maximumSeats,
      });
    }
    if (pl.kind === "flat-annual") {
      return planFlatAnnual(pl.slug, pl.name, pl.amount, {
        highlighted: pl.highlighted,
        hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
        trialDays: pl.trialDays ?? c.trialDays,
        limits: pl.limits,
        description: pl.description,
      });
    }
    return planPerSeatAnnual(pl.slug, pl.name, pl.amount, {
      highlighted: pl.highlighted,
      hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
      trialDays: pl.trialDays ?? c.trialDays,
      limits: pl.limits,
      description: pl.description,
      minimumSeats: pl.minimumSeats,
      maximumSeats: pl.maximumSeats,
    });
  });

  return {
    aliases: [],
    membershipRole: "primary",
    primaryCategorySlug: "customer-service",
    secondaryCategorySlugs: c.secondaryCategorySlugs ?? [],
    subcategorySlugs: [],
    officialVideos: [],
    sourcesExtra: [],
    limitationKinds: (c.limitations ?? []).map(() => "other"),
    aiLines: c.aiLines ?? [
      "AI agent: limited",
      "AI copilot: limited",
      "AI deflection: limited",
      "AI summaries: limited",
    ],
    integrations: c.integrations ?? [{ integrationSlug: "zapier", kind: "zapier-style" }],
    useCaseSlugs: c.useCaseSlugs ?? ["helpdesk-ticketing"],
    teamTypeSlugs: c.teamTypeSlugs ?? ["operations", "customer-success"],
    businessSizeSlugs: c.businessSizeSlugs ?? ["small-business", "mid-market"],
    ...c,
    featureOverrides,
    enrichmentPlans,
    fixturePlans:
      c.fixturePlans ??
      enrichmentPlans.map((pl) => {
        if (pl.isFree) return `PLAN ${pl.slug}: name=${pl.name}; isFree=true`;
        if (pl.contactSales) return `PLAN ${pl.slug}: name=${pl.name}; contactSales=true`;
        const rule = pl.rules?.[0];
        if (rule?.kind === "per-seat") {
          return `PLAN ${pl.slug}: name=${pl.name}; amountPerSeat=${rule.amountPerSeat}; currency=USD; interval=${rule.interval}; amountPeriod=${rule.amountPeriod}`;
        }
        return `PLAN ${pl.slug}: name=${pl.name}; amount=${rule?.amount}; currency=USD; interval=${rule?.interval ?? "month"}; amountPeriod=${rule?.amountPeriod ?? "month"}`;
      }),
    scoreRationales: Object.fromEntries(
      Object.entries(c.scores).map(([k, v]) => [
        k,
        c.scoreRationales?.[k] ??
          `${k} scored ${v}/10 from first-party research for ${c.name} — not hands-on lab tested.`,
      ]),
    ),
  };
}
