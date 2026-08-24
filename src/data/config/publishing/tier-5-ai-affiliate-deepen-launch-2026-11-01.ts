/**
 * Tier 5 AI affiliate deepen rollout — educational what-is guides for 6 AI-category
 * affiliate products deferred from Tier 2. Window: November 2026 (~2 guides every 3 days).
 * quillbot / writesonic what-is moved to Tier 20 ai-writing (May 2027).
 * mindstudio / emergent what-is moved to Tier 21 ai-website-builder (May 2027).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_5_LAUNCH_SLOTS = [
  slotUtc("2026-11-01"),
  slotUtc("2026-11-04"),
] as const;

/** Priority: commercial + best-page weight (content-opportunity audit order). */
export const TIER_5_AI_AFFILIATE_DEEPEN_SLUGS = [
  "elevenlabs",
  "gamma",
  "rank-prompt",
] as const;

/** Two guides on first date; one on second = 3 products. */
const SLOT_BATCH_SIZES = [2, 1] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_5_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 2;
    const at = TIER_5_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_5_AI_AFFILIATE_DEEPEN_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_5_GUIDE_SCHEDULE = buildScheduleMap();

export function tier5WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_5_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier5ProductScheduledAt(productSlug: string): string | undefined {
  return tier5WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_5_SCHEDULED_GUIDE_SLUGS = [...TIER_5_GUIDE_SCHEDULE.keys()];
