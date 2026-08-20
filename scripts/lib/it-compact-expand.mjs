/**
 * Expand compact IT & Development product configs into full onboard objects.
 */
import {
  freePlan,
  contactSalesPlan,
  planPerSeatAnnual,
  planPerSeatMonthly,
  planFlatAnnual,
  planFlatMonthly,
  planPerHostAnnual,
} from "./it-onboard-runtime.mjs";

const ALL_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "not-supported",
  "apm-tracing": "not-supported",
  "log-management": "not-supported",
  "source-control": "not-supported",
  "cicd-actions": "not-supported",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "cloud-paas": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "limited",
};

export function expandItProduct(c) {
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
    if (pl.kind === "flat-monthly") {
      return planFlatMonthly(pl.slug, pl.name, pl.amount, {
        highlighted: pl.highlighted,
        hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
        trialDays: pl.trialDays ?? c.trialDays,
        limits: pl.limits,
        description: pl.description,
      });
    }
    if (pl.kind === "per-host-annual") {
      return planPerHostAnnual(pl.slug, pl.name, pl.amount, {
        highlighted: pl.highlighted,
        hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
        trialDays: pl.trialDays ?? c.trialDays,
        limits: pl.limits,
        description: pl.description,
        minimumUnits: pl.minimumUnits,
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
    primaryCategorySlug: "it-development",
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    officialVideos: [],
    sourcesExtra: [],
    limitationKinds: (c.limitations ?? []).map(() => "other"),
    aiLines: c.aiLines ?? [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: c.integrations ?? [{ integrationSlug: "slack", kind: "native" }],
    useCaseSlugs: c.useCaseSlugs ?? (c.jobCluster ? [c.jobCluster] : ["itsm-service-desk"]),
    teamTypeSlugs: c.teamTypeSlugs ?? ["operations"],
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
        if (rule?.kind === "usage") {
          return `PLAN ${pl.slug}: name=${pl.name}; amountPerUnit=${rule.amountPerUnit}; unit=${rule.unit}; currency=USD; interval=${rule.interval}; amountPeriod=${rule.amountPeriod}`;
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
