/**
 * Tier 4 editorial anchor rollout — educational what-is guides for CRM leaders
 * without affiliate. October 2026, ~every 2–3 days.
 *
 * Depth work: guide cluster (what-is), links to existing 5-kind packs and
 * approved comparisons — not net-new product reviews.
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_4_LAUNCH_SLOTS = [
  slotUtc("2026-10-01"),
  slotUtc("2026-10-04"),
  slotUtc("2026-10-07"),
  slotUtc("2026-10-10"),
  slotUtc("2026-10-13"),
  slotUtc("2026-10-16"),
  slotUtc("2026-10-19"),
  slotUtc("2026-10-22"),
  slotUtc("2026-10-25"),
  slotUtc("2026-10-28"),
] as const;

/** Priority: comparison graph weight (high-traffic CRM anchors). */
export const TIER_4_EDITORIAL_ANCHOR_SLUGS = [
  "mailchimp",
  "pardot",
  "zendesk",
  "salesforce",
  "monday-sales-crm",
  "streak",
  "dynamics-365",
  "zoho-crm",
  "attio",
  "copper",
  "nutshell",
  "insightly",
  "bitrix24",
  "oracle-cx",
  "sugarcrm",
  "creatio",
  "nimble",
  "agile-crm",
  "affinity",
  "apptivo",
] as const;

/** Two guides per slot — 20 anchors across 10 dates (~every 3 days). */
const SLOT_BATCH_SIZES = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  let offset = 0;
  for (let slot = 0; slot < TIER_4_LAUNCH_SLOTS.length; slot++) {
    const batch = SLOT_BATCH_SIZES[slot] ?? 1;
    const at = TIER_4_LAUNCH_SLOTS[slot]!;
    for (let i = 0; i < batch; i++) {
      const slug = TIER_4_EDITORIAL_ANCHOR_SLUGS[offset + i];
      if (!slug) break;
      map.set(`what-is-${slug}`, at);
    }
    offset += batch;
  }
  return map;
}

const TIER_4_GUIDE_SCHEDULE = buildScheduleMap();

export function tier4WhatIsScheduledAt(guideSlug: string): string | undefined {
  return TIER_4_GUIDE_SCHEDULE.get(guideSlug);
}

export function tier4ProductScheduledAt(productSlug: string): string | undefined {
  return tier4WhatIsScheduledAt(`what-is-${productSlug}`);
}

export const TIER_4_SCHEDULED_GUIDE_SLUGS = [...TIER_4_GUIDE_SCHEDULE.keys()];
