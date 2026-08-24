/**
 * Tier 25 Dropshipping & POD subcategory launch — hub, guides, and best page.
 * Affiliate what-is: Spocket/Printify/ShipBob/Sendcloud (Tier 8 Dec 2026) — not rescheduled.
 * Window: 1–30 July 2027 (late-month cluster, interleaved with other July tiers).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_25_LAUNCH_SLOTS = [
  slotUtc("2027-07-19"),
  slotUtc("2027-07-21"),
  slotUtc("2027-07-23"),
  slotUtc("2027-07-24"),
  slotUtc("2027-07-25"),
  slotUtc("2027-07-26"),
  slotUtc("2027-07-27"),
  slotUtc("2027-07-28"),
  slotUtc("2027-07-29"),
  slotUtc("2027-07-30"),
] as const;

export const TIER_25_DROPSHIPPING_POD_CONTENT_KEYS = [
  "category:dropshipping-pod",
  "guide:what-is-dropshipping-pod-software",
  "guide:how-to-choose-dropshipping-pod-software",
  "guide:dropshipping-pod-pricing-guide",
  "guide:how-dropshipping-pod-software-works",
  "guide:types-of-dropshipping-pod-software",
  "guide:dropshipping-pod-vs-ecommerce-software",
  "guide:dropshipping-pod-requirements-guide",
  "guide:dropshipping-pod-evaluation-guide",
  "best:dropshipping-pod-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_25_DROPSHIPPING_POD_CONTENT_KEYS.length; i++) {
    const key = TIER_25_DROPSHIPPING_POD_CONTENT_KEYS[i];
    const slot = TIER_25_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_25_SCHEDULE = buildScheduleMap();

export function tier25ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_25_SCHEDULE.get(contentKey);
}

export function tier25GuideScheduledAt(guideSlug: string): string | undefined {
  return tier25ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier25CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier25ContentScheduledAt(`category:${categorySlug}`);
}

export function tier25BestScheduledAt(bestSlug: string): string | undefined {
  return tier25ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_25_SCHEDULED_GUIDE_SLUGS =
  TIER_25_DROPSHIPPING_POD_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
