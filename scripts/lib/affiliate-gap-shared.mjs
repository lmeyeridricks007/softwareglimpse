/** Shared helpers for affiliate-gap reconcile batch packs. */
export const VERIFIED_AT = "2026-08-19T12:00:00.000Z";

export function scores(criteria, overrides = {}, fallback = 7) {
  const out = {};
  for (const key of criteria) {
    out[key] = overrides[key] ?? fallback;
  }
  return out;
}

export function contactSalesPlanEntry(name, extra = {}) {
  return [
    {
      kind: "contact-sales",
      slug: extra.slug ?? "enterprise",
      name: extra.planName ?? "Enterprise",
      hasFreeTrial: extra.hasFreeTrial ?? true,
      trialDays: extra.trialDays ?? 14,
      description:
        extra.description ??
        `Contact sales for published ${name} pricing — confirm live tiers on the vendor site.`,
    },
  ];
}

export function prosFromStrings(items) {
  return items.slice(0, 5);
}

export function defaultAiLines() {
  return [
    "AI assistant: limited",
    "AI summaries: limited",
    "AI automation: limited",
    "AI recommendations: limited",
  ];
}

export function defaultIntegrations() {
  return [{ integrationSlug: "zapier", kind: "zapier-style" }];
}
