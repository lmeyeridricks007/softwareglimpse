/**
 * Expand compact project-management product configs into full onboard objects.
 */
import {
  freePlan,
  contactSalesPlan,
  planPerSeatAnnual,
  planPerSeatMonthly,
  planFlatAnnual,
} from "./pm-onboard-runtime.mjs";

const ALL_FEATURES = {
  "task-boards": "limited",
  "timeline-gantt": "limited",
  "workload-resources": "not-supported",
  "automations-workflows": "limited",
  "time-tracking": "not-supported",
  "docs-collaboration": "limited",
  "integrations-ecosystem": "limited",
  "reporting-dashboards": "limited",
  "ai-assistance": "limited",
  "document-pdf": "not-supported",
  "remote-access": "not-supported",
  "desktop-workspace": "not-supported",
};

export function expandPmProduct(c) {
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
    // default: per-seat annual (monthly-equivalent amountPeriod month, interval year)
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
    primaryCategorySlug: "project-management",
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    officialVideos: [],
    sourcesExtra: [],
    limitationKinds: (c.limitations ?? []).map(() => "other"),
    aiLines: c.aiLines ?? [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: c.integrations ?? [{ integrationSlug: "zapier", kind: "zapier-style" }],
    useCaseSlugs: c.useCaseSlugs ?? ["work-management", "project-tracking"],
    teamTypeSlugs: c.teamTypeSlugs ?? ["operations", "project-managers"],
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
