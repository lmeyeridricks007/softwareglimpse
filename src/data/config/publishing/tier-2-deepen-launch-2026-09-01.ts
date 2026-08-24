/**
 * Tier 2 affiliate deepen rollout — educational what-is guides for 5 products.
 * Window: 1–7 September 2026 (~3 products per batch every 3 days).
 * Worth-it guides already live in each product's 5-kind pack (`is-{slug}-worth-it`).
 *
 * Deferred: Tiers [5](../publishing/launches/tier-5-ai-affiliate-deepen-2026-11-01.md)–[12](../publishing/launches/tier-12-pm-affiliate-deepen-2027-02-01.md).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_2_LAUNCH_SLOTS = [
  slotUtc("2026-09-01"),
  slotUtc("2026-09-04"),
  slotUtc("2026-09-07"),
  slotUtc("2026-09-10"),
  slotUtc("2026-09-13"),
  slotUtc("2026-09-16"),
  slotUtc("2026-09-19"),
  slotUtc("2026-09-22"),
  slotUtc("2026-09-25"),
  slotUtc("2026-09-28"),
  slotUtc("2026-09-30"),
] as const;

/** Priority order: commercial + best-page weight (matches content-opportunity audit). */
export const TIER_2_DEEPEN_PRODUCT_SLUGS = [
  "sanebox",
  "inboxally",
  "zenzap",
  "snov",
  "kit",
] as const;

/** Products per slot: 3 + 2 = 5. */
const SLOT_BATCH_SIZES = [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_2_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 4;
    const at = TIER_2_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_2_DEEPEN_PRODUCT_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_2_GUIDE_SCHEDULE = buildScheduleMap();

export function tier2WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_2_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier2ProductScheduledAt(productSlug: string): string | undefined {
  return tier2WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_2_SCHEDULED_GUIDE_SLUGS = [
  ...TIER_2_GUIDE_SCHEDULE.keys(),
];
