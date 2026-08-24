/**
 * Tier 9 HR / ops affiliate deepen rollout — educational what-is guides for affiliates
 * deferred from Tier 2. Window: 26–30 December 2026.
 * trainual + flexiquiz moved to Tier 15 LMS (Dec 1–25 wave).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_9_LAUNCH_SLOTS = [
  slotUtc("2026-12-26"),
  slotUtc("2026-12-27"),
  slotUtc("2026-12-28"),
  slotUtc("2026-12-30"),
] as const;

/** Priority: commercial + best-page weight (content-opportunity audit order). */
export const TIER_9_HR_AFFILIATE_DEEPEN_SLUGS = [
  "carepatron",
] as const;

/** One guide per slot — 4 products across 26–30 Dec. */
const SLOT_BATCH_SIZES = [1, 1, 1, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_9_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_9_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_9_HR_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_9_GUIDE_SCHEDULE = buildScheduleMap();

export function tier9WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_9_GUIDE_SCHEDULE.get(guideSlug);
}

/** Products moved to subcategory affiliate-deepen files — schedules preserved from Dec 2026 wave. */
const TIER_9_LEGACY_PRODUCT_SCHEDULES: Record<string, string> = {
  connecteam: slotUtc("2026-12-26"),
  "breezy-hr": slotUtc("2026-12-27"),
  jibble: slotUtc("2026-12-28"),
};

export function tier9ProductScheduledAt(productSlug: string): string | undefined {
  const legacy = TIER_9_LEGACY_PRODUCT_SCHEDULES[productSlug];
  if (legacy) return legacy;
  return tier9WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_9_SCHEDULED_GUIDE_SLUGS = [...TIER_9_GUIDE_SCHEDULE.keys()];
