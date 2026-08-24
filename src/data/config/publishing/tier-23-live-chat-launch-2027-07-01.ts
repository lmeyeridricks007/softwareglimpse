/**
 * Tier 23 Live Chat subcategory launch — hub, guides, and best page for the CS
 * live-chat cluster. Affiliate what-is guides for Tidio (published Aug 2026) and
 * Freshchat (Tier 7 Nov 2026) are not rescheduled here.
 * Window: 1–30 July 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_23_LAUNCH_SLOTS = [
  slotUtc("2027-07-01"),
  slotUtc("2027-07-03"),
  slotUtc("2027-07-05"),
  slotUtc("2027-07-07"),
  slotUtc("2027-07-09"),
  slotUtc("2027-07-11"),
  slotUtc("2027-07-13"),
  slotUtc("2027-07-15"),
  slotUtc("2027-07-17"),
  slotUtc("2027-07-20"),
] as const;

export const TIER_23_LIVE_CHAT_CONTENT_KEYS = [
  "category:live-chat",
  "guide:what-is-live-chat-software",
  "guide:how-to-choose-live-chat-software",
  "guide:live-chat-pricing-guide",
  "guide:how-live-chat-software-works",
  "guide:types-of-live-chat-software",
  "guide:live-chat-vs-customer-service-software",
  "guide:live-chat-requirements-guide",
  "guide:live-chat-evaluation-guide",
  "best:live-chat-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_23_LIVE_CHAT_CONTENT_KEYS.length; i++) {
    const key = TIER_23_LIVE_CHAT_CONTENT_KEYS[i];
    const slot = TIER_23_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_23_SCHEDULE = buildScheduleMap();

export function tier23ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_23_SCHEDULE.get(contentKey);
}

export function tier23GuideScheduledAt(guideSlug: string): string | undefined {
  return tier23ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier23CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier23ContentScheduledAt(`category:${categorySlug}`);
}

export function tier23BestScheduledAt(bestSlug: string): string | undefined {
  return tier23ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_23_SCHEDULED_GUIDE_SLUGS =
  TIER_23_LIVE_CHAT_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
