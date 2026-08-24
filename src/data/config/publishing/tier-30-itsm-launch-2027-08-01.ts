/**
 * Tier 30 ITSM subcategory launch — hub, guides, best page (defer: need 3+ ITSM-native peers).
 * Affiliate what-is: Freshservice (Tier 7 Nov 2026) — not rescheduled.
 * Window: 1–30 August 2027 (~every 3 days). Hub not indexable until peer depth expands.
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_30_LAUNCH_SLOTS = [
  slotUtc("2027-08-03"),
  slotUtc("2027-08-06"),
  slotUtc("2027-08-09"),
  slotUtc("2027-08-12"),
  slotUtc("2027-08-15"),
  slotUtc("2027-08-18"),
  slotUtc("2027-08-21"),
  slotUtc("2027-08-24"),
  slotUtc("2027-08-27"),
  slotUtc("2027-08-30"),
] as const;

export const TIER_30_ITSM_CONTENT_KEYS = [
  "category:itsm",
  "guide:what-is-itsm-software",
  "guide:how-to-choose-itsm-software",
  "guide:itsm-pricing-guide",
  "guide:how-itsm-software-works",
  "guide:types-of-itsm-software",
  "guide:itsm-vs-it-development-software",
  "guide:itsm-requirements-guide",
  "guide:itsm-evaluation-guide",
  "best:itsm-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_30_ITSM_CONTENT_KEYS.length; i++) {
    const key = TIER_30_ITSM_CONTENT_KEYS[i];
    const slot = TIER_30_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_30_SCHEDULE = buildScheduleMap();

export function tier30ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_30_SCHEDULE.get(contentKey);
}

export function tier30GuideScheduledAt(guideSlug: string): string | undefined {
  return tier30ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier30CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier30ContentScheduledAt(`category:${categorySlug}`);
}

export function tier30BestScheduledAt(bestSlug: string): string | undefined {
  return tier30ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_30_SCHEDULED_GUIDE_SLUGS =
  TIER_30_ITSM_CONTENT_KEYS.filter((key) => key.startsWith("guide:")).map(
    (key) => key.replace(/^guide:/, ""),
  );
