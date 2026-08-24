/**
 * Tier 22 VoIP / Business Phone subcategory launch — hub, guides, best page, and affiliate
 * what-is guides for the five BC affiliate phone products. Uses parent BC finder voice-vs-chat job.
 * Window: 1–30 June 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_22_LAUNCH_SLOTS = [
  slotUtc("2027-06-01"),
  slotUtc("2027-06-03"),
  slotUtc("2027-06-05"),
  slotUtc("2027-06-07"),
  slotUtc("2027-06-09"),
  slotUtc("2027-06-11"),
  slotUtc("2027-06-13"),
  slotUtc("2027-06-15"),
  slotUtc("2027-06-17"),
  slotUtc("2027-06-20"),
  slotUtc("2027-06-23"),
  slotUtc("2027-06-25"),
  slotUtc("2027-06-27"),
  slotUtc("2027-06-28"),
  slotUtc("2027-06-30"),
] as const;

export const TIER_22_VOIP_BUSINESS_PHONE_CONTENT_KEYS = [
  "category:voip-business-phone",
  "guide:what-is-voip-business-phone-software",
  "guide:how-to-choose-voip-business-phone-software",
  "guide:voip-business-phone-pricing-guide",
  "guide:how-voip-business-phone-software-works",
  "guide:types-of-voip-business-phone-software",
  "guide:voip-business-phone-vs-business-communications",
  "guide:voip-business-phone-requirements-guide",
  "guide:voip-business-phone-evaluation-guide",
  "best:voip-business-phone-software",
  "guide:what-is-krispcall",
  "guide:what-is-callhippo",
  "guide:what-is-aircall",
  "guide:what-is-freshcaller",
  "guide:what-is-kixie",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_22_VOIP_BUSINESS_PHONE_CONTENT_KEYS.length; i++) {
    const key = TIER_22_VOIP_BUSINESS_PHONE_CONTENT_KEYS[i];
    const slot = TIER_22_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_22_SCHEDULE = buildScheduleMap();

export function tier22ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_22_SCHEDULE.get(contentKey);
}

export function tier22GuideScheduledAt(guideSlug: string): string | undefined {
  return tier22ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier22CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier22ContentScheduledAt(`category:${categorySlug}`);
}

export function tier22BestScheduledAt(bestSlug: string): string | undefined {
  return tier22ContentScheduledAt(`best:${bestSlug}`);
}

export function tier22ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier22GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_22_SCHEDULED_GUIDE_SLUGS =
  TIER_22_VOIP_BUSINESS_PHONE_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
