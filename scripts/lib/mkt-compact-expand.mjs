/**
 * Expand compact marketing product configs into full onboard objects.
 */
import { freePlan, planFlat, contactSalesPlan } from "./mkt-onboard-runtime.mjs";

const ALL_FEATURES = {
  "social-scheduling": "limited",
  "content-calendar": "limited",
  "social-listening": "unsupported",
  "funnel-builder": "limited",
  "landing-pages": "limited",
  "marketing-automation": "supported",
  "forms-lead-capture": "supported",
  analytics: "supported",
  "ads-management": "unsupported",
  "reputation-reviews": "unsupported",
  webinars: "unsupported",
  "email-sms-channels": "limited",
  "team-collaboration": "supported",
  "ai-content-generation": "limited",
};

export function expandMktProduct(c) {
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
    return planFlat(pl.slug, pl.name, pl.amount, {
      highlighted: pl.highlighted,
      hasFreeTrial: pl.hasFreeTrial ?? c.hasFreeTrial,
      trialDays: pl.trialDays ?? c.trialDays,
      limits: pl.limits,
      description: pl.description,
    });
  });

  return {
    aliases: [],
    membershipRole: "primary",
    primaryCategorySlug: "marketing",
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    officialVideos: [],
    sourcesExtra: [],
    limitationKinds: (c.limitations ?? []).map(() => "other"),
    aiLines: c.aiLines ?? [
      "AI copywriting: limited",
      "AI assistant: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: c.integrations ?? [{ integrationSlug: "zapier", kind: "zapier-style" }],
    useCaseSlugs: c.useCaseSlugs ?? ["marketing-automation", "lead-generation"],
    teamTypeSlugs: c.teamTypeSlugs ?? ["marketing"],
    businessSizeSlugs: c.businessSizeSlugs ?? ["small-business", "mid-market"],
    ...c,
    featureOverrides,
    enrichmentPlans,
    fixturePlans:
      c.fixturePlans ??
      enrichmentPlans.map((pl) => {
        if (pl.isFree) return `PLAN ${pl.slug}: name=${pl.name}; isFree=true`;
        if (pl.contactSales) return `PLAN ${pl.slug}: name=${pl.name}; contactSales=true`;
        return `PLAN ${pl.slug}: name=${pl.name}; amount=${pl.rules?.[0]?.amount}; currency=USD; interval=month`;
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
