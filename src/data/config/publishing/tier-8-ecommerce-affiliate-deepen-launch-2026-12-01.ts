/**
 * Tier 8 ecommerce affiliate deepen rollout — educational what-is guides for 6
 * ecommerce-category affiliates deferred from Tier 2. Window: December 2026
 * (~1 guide every 3 days). Worth-it guides already live in each 5-kind pack.
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_8_LAUNCH_SLOTS = [
  slotUtc("2026-12-01"),
  slotUtc("2026-12-04"),
  slotUtc("2026-12-07"),
  slotUtc("2026-12-10"),
] as const;

/** Priority: commercial + best-page weight (content-opportunity audit order). */
export const TIER_8_ECOMMERCE_AFFILIATE_DEEPEN_SLUGS = [
  "spocket",
  "printify",
  "shipbob",
  "sendcloud",
] as const;

const SLOT_BATCH_SIZES = [1, 1, 1, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_8_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_8_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_8_ECOMMERCE_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_8_GUIDE_SCHEDULE = buildScheduleMap();

export function tier8WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_8_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier8ProductScheduledAt(productSlug: string): string | undefined {
  return tier8WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_8_SCHEDULED_GUIDE_SLUGS = [...TIER_8_GUIDE_SCHEDULE.keys()];
