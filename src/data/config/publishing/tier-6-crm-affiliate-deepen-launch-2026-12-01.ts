/**
 * Tier 6 CRM affiliate deepen rollout — educational what-is guides for 2 high-traffic
 * CRM affiliates deferred from Tier 2. Window: December 2026.
 * Worth-it guides already live in each product's 5-kind pack (`is-{slug}-worth-it`).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_6_LAUNCH_SLOTS = [
  slotUtc("2026-12-01"),
  slotUtc("2026-12-04"),
] as const;

/** Priority: commercial + best-page weight (content-opportunity audit order). */
export const TIER_6_CRM_AFFILIATE_DEEPEN_SLUGS = ["keap", "hubspot"] as const;

const SLOT_BATCH_SIZES = [1, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_6_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_6_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_6_CRM_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_6_GUIDE_SCHEDULE = buildScheduleMap();

export function tier6WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_6_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier6ProductScheduledAt(productSlug: string): string | undefined {
  return tier6WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_6_SCHEDULED_GUIDE_SLUGS = [...TIER_6_GUIDE_SCHEDULE.keys()];
