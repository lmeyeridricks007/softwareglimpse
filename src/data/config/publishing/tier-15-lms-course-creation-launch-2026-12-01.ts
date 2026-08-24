/**
 * Tier 15 LMS & Course Creation category launch — hub, guides, best page, and affiliate
 * what-is guides (moved from Tier 9 HR + Tier 11 marketing). No dedicated finder until 6+ primaries.
 * Window: 1–25 December 2026 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_15_LAUNCH_SLOTS = [
  slotUtc("2026-12-01"),
  slotUtc("2026-12-03"),
  slotUtc("2026-12-05"),
  slotUtc("2026-12-07"),
  slotUtc("2026-12-09"),
  slotUtc("2026-12-11"),
  slotUtc("2026-12-13"),
  slotUtc("2026-12-15"),
  slotUtc("2026-12-17"),
  slotUtc("2026-12-19"),
  slotUtc("2026-12-21"),
  slotUtc("2026-12-23"),
  slotUtc("2026-12-25"),
] as const;

export const TIER_15_LMS_COURSE_CREATION_CONTENT_KEYS = [
  "category:lms-course-creation",
  "guide:what-is-lms-course-creation-software",
  "guide:how-to-choose-lms-course-creation-software",
  "guide:lms-course-creation-pricing-guide",
  "guide:how-lms-course-creation-software-works",
  "guide:types-of-lms-course-creation-software",
  "guide:lms-course-creation-vs-hr-software",
  "guide:lms-course-creation-requirements-guide",
  "guide:lms-course-creation-evaluation-guide",
  "best:lms-course-creation-software",
  "guide:what-is-learnworlds",
  "guide:what-is-trainual",
  "guide:what-is-flexiquiz",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_15_LMS_COURSE_CREATION_CONTENT_KEYS.length; i++) {
    const key = TIER_15_LMS_COURSE_CREATION_CONTENT_KEYS[i];
    const slot = TIER_15_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_15_SCHEDULE = buildScheduleMap();

export function tier15ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_15_SCHEDULE.get(contentKey);
}

export function tier15GuideScheduledAt(guideSlug: string): string | undefined {
  return tier15ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier15CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier15ContentScheduledAt(`category:${categorySlug}`);
}

export function tier15BestScheduledAt(bestSlug: string): string | undefined {
  return tier15ContentScheduledAt(`best:${bestSlug}`);
}

export function tier15ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier15GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_15_SCHEDULED_GUIDE_SLUGS =
  TIER_15_LMS_COURSE_CREATION_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
