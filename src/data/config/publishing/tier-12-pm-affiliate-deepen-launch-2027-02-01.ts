/**
 * Tier 12 project-management affiliate deepen rollout — educational what-is guides
 * for 8 affiliates deferred from Tier 2. Window: 1–13 February 2027 (~every 3 days).
 * Worth-it guides already live in each product's 5-kind pack (`is-{slug}-worth-it`).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_12_LAUNCH_SLOTS = [
  slotUtc("2027-02-01"),
  slotUtc("2027-02-04"),
  slotUtc("2027-02-07"),
  slotUtc("2027-02-10"),
  slotUtc("2027-02-13"),
] as const;

/** Priority: commercial + best-page weight (content-opportunity audit order). */
export const TIER_12_PM_AFFILIATE_DEEPEN_SLUGS = [
  "monday",
  "foxit",
  "hive",
  "office-timeline",
  "webcatalog",
  "getscreen-me",
  "vektoros",
] as const;

/** Two guides on first three slots, one on last — 7 products (mrpeasy moved to Tier 3 accounting-finance). */
const SLOT_BATCH_SIZES = [2, 2, 2, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_12_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_12_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_12_PM_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_12_GUIDE_SCHEDULE = buildScheduleMap();

export function tier12WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_12_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier12ProductScheduledAt(productSlug: string): string | undefined {
  return tier12WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_12_SCHEDULED_GUIDE_SLUGS = [...TIER_12_GUIDE_SCHEDULE.keys()];
