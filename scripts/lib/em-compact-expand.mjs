/**
 * Expand compact EM product configs into full onboard product objects.
 */
import { freePlan, planFlat, contactSalesPlan } from "./em-onboard-runtime.mjs";

const ALL_SUPPORTED = {
  "email-campaigns": "supported",
  "newsletter-builder": "supported",
  "email-templates": "supported",
  "drag-drop-editor": "supported",
  "automation-workflows": "supported",
  segmentation: "supported",
  personalization: "supported",
  "ab-testing": "supported",
  "contact-management": "supported",
  "landing-pages": "supported",
  forms: "supported",
  "transactional-email": "limited",
  analytics: "supported",
  "deliverability-tools": "supported",
  "ai-content-generation": "limited",
};

export function expandEmProduct(c) {
  const featureOverrides = { ...ALL_SUPPORTED, ...(c.featureOverrides ?? {}) };
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

  const fixturePlans = enrichmentPlans.map((pl) => {
    if (pl.isFree) return `PLAN ${pl.slug}: name=${pl.name}; isFree=true`;
    if (pl.contactSales) return `PLAN ${pl.slug}: name=${pl.name}; contactSales=true`;
    const amt = pl.rules?.[0]?.amount;
    return `PLAN ${pl.slug}: name=${pl.name}; amount=${amt}; currency=USD; interval=month`;
  });

  return {
    aliases: [],
    membershipRole: "primary",
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    officialVideos: [],
    sourcesExtra: [],
    limitationKinds: (c.limitations ?? []).map(() => "other"),
    aiLines: c.aiLines ?? [
      "AI email-generation: limited",
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI automation: unknown",
    ],
    integrations: c.integrations ?? [
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    useCaseSlugs: c.useCaseSlugs ?? [
      "newsletters",
      "small-business-campaigns",
      "lead-nurturing",
      "marketing-automation",
    ],
    teamTypeSlugs: c.teamTypeSlugs ?? ["marketing", "founders"],
    businessSizeSlugs: c.businessSizeSlugs ?? ["micro", "small-business", "mid-market"],
    ...c,
    featureOverrides,
    enrichmentPlans,
    fixturePlans: c.fixturePlans ?? fixturePlans,
    scoreRationales: Object.fromEntries(
      Object.entries(c.scores).map(([k, v]) => [
        k,
        c.scoreRationales?.[k] ??
          `${k} scored ${v}/10 from first-party research for ${c.name} — not hands-on lab tested.`,
      ]),
    ),
  };
}
