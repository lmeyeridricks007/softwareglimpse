/**
 * Tier 28 Time & Attendance subcategory launch — hub, guides, best page.
 * Affiliate what-is: Connecteam, Jibble (Tier 9 Dec 2026) — not rescheduled.
 * Window: 1–30 August 2027 (even days, interleaved with Tier 27).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_28_LAUNCH_SLOTS = [
  slotUtc("2027-08-02"),
  slotUtc("2027-08-04"),
  slotUtc("2027-08-06"),
  slotUtc("2027-08-08"),
  slotUtc("2027-08-10"),
  slotUtc("2027-08-12"),
  slotUtc("2027-08-14"),
  slotUtc("2027-08-16"),
  slotUtc("2027-08-18"),
  slotUtc("2027-08-22"),
] as const;

export const TIER_28_TIME_ATTENDANCE_CONTENT_KEYS = [
  "category:time-attendance",
  "guide:what-is-time-attendance-software",
  "guide:how-to-choose-time-attendance-software",
  "guide:time-attendance-pricing-guide",
  "guide:how-time-attendance-software-works",
  "guide:types-of-time-attendance-software",
  "guide:time-attendance-vs-hr-software",
  "guide:time-attendance-requirements-guide",
  "guide:time-attendance-evaluation-guide",
  "best:time-attendance-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_28_TIME_ATTENDANCE_CONTENT_KEYS.length; i++) {
    const key = TIER_28_TIME_ATTENDANCE_CONTENT_KEYS[i];
    const slot = TIER_28_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_28_SCHEDULE = buildScheduleMap();

export function tier28ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_28_SCHEDULE.get(contentKey);
}

export function tier28GuideScheduledAt(guideSlug: string): string | undefined {
  return tier28ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier28CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier28ContentScheduledAt(`category:${categorySlug}`);
}

export function tier28BestScheduledAt(bestSlug: string): string | undefined {
  return tier28ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_28_SCHEDULED_GUIDE_SLUGS =
  TIER_28_TIME_ATTENDANCE_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
