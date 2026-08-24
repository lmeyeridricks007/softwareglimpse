/**
 * Tier 7 CS short guides rollout — deferred what-is / is-worth-it pairs for 6 CS
 * primaries moved out of Tier 1. Window: November 2026 (~1 product pair every 3 days).
 *
 * Five CS primaries (freshdesk, zendesk-suite, help-scout, gorgias, tidio) remain
 * published from the Aug 2026 wave — not in this schedule.
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_7_LAUNCH_SLOTS = [
  slotUtc("2026-11-01"),
  slotUtc("2026-11-04"),
  slotUtc("2026-11-07"),
  slotUtc("2026-11-10"),
  slotUtc("2026-11-13"),
  slotUtc("2026-11-16"),
] as const;

/** Deferred CS primaries — both what-is and is-worth-it publish on the same slot. */
export const TIER_7_CS_DEFERRED_PRODUCT_SLUGS = [
  "freshservice",
  "freshchat",
  "livechat",
  "zoho-desk",
  "nicejob",
  "shore",
] as const;

const SLOT_BATCH_SIZES = [1, 1, 1, 1, 1, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_7_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_7_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const productSlug = TIER_7_CS_DEFERRED_PRODUCT_SLUGS[offset + i];
      if (!productSlug) break;
      map.set(`what-is-${productSlug}`, at);
      map.set(`is-${productSlug}-worth-it`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_7_CS_GUIDE_SCHEDULE = buildScheduleMap();

export function tier7CsGuideScheduledAt(guideSlug: string): string | undefined {
  return TIER_7_CS_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier7CsProductScheduledAt(
  productSlug: string,
): string | undefined {
  return tier7CsGuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_7_SCHEDULED_GUIDE_SLUGS = [
  ...TIER_7_CS_GUIDE_SCHEDULE.keys(),
];
