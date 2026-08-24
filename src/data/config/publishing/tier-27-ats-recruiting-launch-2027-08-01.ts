/**
 * Tier 27 ATS & Recruiting subcategory launch — hub, guides, best page.
 * Affiliate what-is: Breezy HR (Tier 9 Dec 2026); Freshteam (onboarding inventory) — not rescheduled.
 * Window: 1–30 August 2027 (odd days, interleaved with Tier 28).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_27_LAUNCH_SLOTS = [
  slotUtc("2027-08-01"),
  slotUtc("2027-08-03"),
  slotUtc("2027-08-05"),
  slotUtc("2027-08-07"),
  slotUtc("2027-08-09"),
  slotUtc("2027-08-11"),
  slotUtc("2027-08-13"),
  slotUtc("2027-08-15"),
  slotUtc("2027-08-17"),
  slotUtc("2027-08-20"),
] as const;

export const TIER_27_ATS_RECRUITING_CONTENT_KEYS = [
  "category:ats-recruiting",
  "guide:what-is-ats-recruiting-software",
  "guide:how-to-choose-ats-recruiting-software",
  "guide:ats-recruiting-pricing-guide",
  "guide:how-ats-recruiting-software-works",
  "guide:types-of-ats-recruiting-software",
  "guide:ats-recruiting-vs-hr-software",
  "guide:ats-recruiting-requirements-guide",
  "guide:ats-recruiting-evaluation-guide",
  "best:ats-recruiting-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_27_ATS_RECRUITING_CONTENT_KEYS.length; i++) {
    const key = TIER_27_ATS_RECRUITING_CONTENT_KEYS[i];
    const slot = TIER_27_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_27_SCHEDULE = buildScheduleMap();

export function tier27ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_27_SCHEDULE.get(contentKey);
}

export function tier27GuideScheduledAt(guideSlug: string): string | undefined {
  return tier27ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier27CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier27ContentScheduledAt(`category:${categorySlug}`);
}

export function tier27BestScheduledAt(bestSlug: string): string | undefined {
  return tier27ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_27_SCHEDULED_GUIDE_SLUGS =
  TIER_27_ATS_RECRUITING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
