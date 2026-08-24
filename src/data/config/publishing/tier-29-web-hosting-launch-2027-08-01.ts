/**
 * Tier 29 Web Hosting subcategory launch — hub, guides, best page (defer: single SKU).
 * Affiliate what-is: Plesk (Tier 16 Jan 2027) — not rescheduled.
 * Window: 1–30 August 2027 (late-month cluster). Hub not indexable until inventory expands.
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_29_LAUNCH_SLOTS = [
  slotUtc("2027-08-19"),
  slotUtc("2027-08-21"),
  slotUtc("2027-08-23"),
  slotUtc("2027-08-24"),
  slotUtc("2027-08-25"),
  slotUtc("2027-08-26"),
  slotUtc("2027-08-27"),
  slotUtc("2027-08-28"),
  slotUtc("2027-08-29"),
  slotUtc("2027-08-30"),
] as const;

export const TIER_29_WEB_HOSTING_CONTENT_KEYS = [
  "category:web-hosting",
  "guide:what-is-web-hosting-software",
  "guide:how-to-choose-web-hosting-software",
  "guide:web-hosting-pricing-guide",
  "guide:how-web-hosting-software-works",
  "guide:types-of-web-hosting-software",
  "guide:web-hosting-vs-it-development-software",
  "guide:web-hosting-requirements-guide",
  "guide:web-hosting-evaluation-guide",
  "best:web-hosting-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_29_WEB_HOSTING_CONTENT_KEYS.length; i++) {
    const key = TIER_29_WEB_HOSTING_CONTENT_KEYS[i];
    const slot = TIER_29_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_29_SCHEDULE = buildScheduleMap();

export function tier29ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_29_SCHEDULE.get(contentKey);
}

export function tier29GuideScheduledAt(guideSlug: string): string | undefined {
  return tier29ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier29CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier29ContentScheduledAt(`category:${categorySlug}`);
}

export function tier29BestScheduledAt(bestSlug: string): string | undefined {
  return tier29ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_29_SCHEDULED_GUIDE_SLUGS =
  TIER_29_WEB_HOSTING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
