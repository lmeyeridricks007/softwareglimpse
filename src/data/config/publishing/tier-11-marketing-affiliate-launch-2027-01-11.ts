/**
 * Tier 11 marketing affiliate rollout — deferred what-is deepen guides from Tier 2.
 * Window: 11–17 January 2027 (~every 3 days).
 * learnworlds what-is moved to Tier 15 LMS (Dec 2026).
 * leadpages what-is moved to Tier 16 website-digital-presence (Jan 2027).
 * whatconverts / databox what-is moved to Tier 17 analytics-bi (Feb 2027).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_11_LAUNCH_SLOTS = [
  slotUtc("2027-01-11"),
  slotUtc("2027-01-14"),
] as const;

/** Deferred marketing affiliate deepen (what-is only). */
export const TIER_11_MARKETING_AFFILIATE_DEEPEN_SLUGS = [
  "evolve",
  "lucrovox",
] as const;

/** One guide per slot — 2 products across Jan 11 and 14. */
const SLOT_DEEPEN_BATCH_SIZES = [1, 1] as const;

function buildDeepenScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_11_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_DEEPEN_BATCH_SIZES[slot] ?? 2;
    const at = TIER_11_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_11_MARKETING_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_11_DEEPEN_SCHEDULE = buildDeepenScheduleMap();

export function tier11SoftwareScheduledAt(_slug: string): string | undefined {
  return undefined;
}

export function tier11WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_11_DEEPEN_SCHEDULE.get(guideSlug);
}

/** Products moved to subcategory affiliate-deepen files — schedules preserved from Jan 2027 wave. */
const TIER_11_LEGACY_PRODUCT_SCHEDULES: Record<string, string> = {
  kartra: slotUtc("2027-01-11"),
  diginius: slotUtc("2027-01-11"),
};

export function tier11ProductScheduledAt(productSlug: string): string | undefined {
  const legacy = TIER_11_LEGACY_PRODUCT_SCHEDULES[productSlug];
  if (legacy) return legacy;
  return tier11WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_11_SCHEDULED_GUIDE_SLUGS = [
  ...TIER_11_DEEPEN_SCHEDULE.keys(),
];
