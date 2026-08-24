/**
 * Tier 24 Helpdesk & Ticketing subcategory launch — hub, guides, and best page.
 * Affiliate what-is: Freshdesk (Aug 2026) — not rescheduled. Freshservice moved to Tier 30 ITSM.
 * Window: 1–30 July 2027 (even days, interleaved with Tier 23 live-chat).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_24_LAUNCH_SLOTS = [
  slotUtc("2027-07-02"),
  slotUtc("2027-07-04"),
  slotUtc("2027-07-06"),
  slotUtc("2027-07-08"),
  slotUtc("2027-07-10"),
  slotUtc("2027-07-12"),
  slotUtc("2027-07-14"),
  slotUtc("2027-07-16"),
  slotUtc("2027-07-18"),
  slotUtc("2027-07-22"),
] as const;

export const TIER_24_HELPDESK_TICKETING_CONTENT_KEYS = [
  "category:helpdesk-ticketing",
  "guide:what-is-helpdesk-ticketing-software",
  "guide:how-to-choose-helpdesk-ticketing-software",
  "guide:helpdesk-ticketing-pricing-guide",
  "guide:how-helpdesk-ticketing-software-works",
  "guide:types-of-helpdesk-ticketing-software",
  "guide:helpdesk-ticketing-vs-customer-service-software",
  "guide:helpdesk-ticketing-requirements-guide",
  "guide:helpdesk-ticketing-evaluation-guide",
  "best:helpdesk-ticketing-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_24_HELPDESK_TICKETING_CONTENT_KEYS.length; i++) {
    const key = TIER_24_HELPDESK_TICKETING_CONTENT_KEYS[i];
    const slot = TIER_24_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_24_SCHEDULE = buildScheduleMap();

export function tier24ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_24_SCHEDULE.get(contentKey);
}

export function tier24GuideScheduledAt(guideSlug: string): string | undefined {
  return tier24ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier24CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier24ContentScheduledAt(`category:${categorySlug}`);
}

export function tier24BestScheduledAt(bestSlug: string): string | undefined {
  return tier24ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_24_SCHEDULED_GUIDE_SLUGS =
  TIER_24_HELPDESK_TICKETING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
