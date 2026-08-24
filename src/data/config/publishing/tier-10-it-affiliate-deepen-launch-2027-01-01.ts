/**
 * Tier 10 IT-development affiliate deepen — bright-data and thordata only.
 * Plesk what-is moved to Tier 16 website-digital-presence (Jan 2027).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_10_LAUNCH_SLOTS = [
  slotUtc("2027-01-02"),
  slotUtc("2027-01-06"),
] as const;

export const TIER_10_IT_AFFILIATE_DEEPEN_SLUGS = [
  "bright-data",
  "thordata",
] as const;

const SLOT_BATCH_SIZES = [1, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_10_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_10_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_10_IT_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_10_GUIDE_SCHEDULE = buildScheduleMap();

export function tier10WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_10_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier10ProductScheduledAt(productSlug: string): string | undefined {
  return tier10WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_10_SCHEDULED_GUIDE_SLUGS = [...TIER_10_GUIDE_SCHEDULE.keys()];
