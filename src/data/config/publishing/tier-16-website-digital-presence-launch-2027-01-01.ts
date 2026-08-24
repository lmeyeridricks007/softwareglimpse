/**
 * Tier 16 Website & Digital Presence category launch — hub, guides, best page, and
 * affiliate what-is guides (moved from Tier 5/8/10/11). wegic moved to Tier 21 ai-website-builder.
 * Window: 1–30 January 2027 (~every 2–3 days). Plesk stays IT-primary (secondary here).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_16_LAUNCH_SLOTS = [
  slotUtc("2027-01-01"),
  slotUtc("2027-01-03"),
  slotUtc("2027-01-05"),
  slotUtc("2027-01-07"),
  slotUtc("2027-01-09"),
  slotUtc("2027-01-11"),
  slotUtc("2027-01-13"),
  slotUtc("2027-01-15"),
  slotUtc("2027-01-17"),
  slotUtc("2027-01-19"),
  slotUtc("2027-01-21"),
  slotUtc("2027-01-25"),
  slotUtc("2027-01-27"),
  slotUtc("2027-01-29"),
  slotUtc("2027-01-30"),
] as const;

export const TIER_16_WEBSITE_DIGITAL_PRESENCE_CONTENT_KEYS = [
  "category:website-digital-presence",
  "guide:what-is-website-digital-presence-software",
  "guide:how-to-choose-website-digital-presence-software",
  "guide:website-digital-presence-pricing-guide",
  "guide:how-website-digital-presence-software-works",
  "guide:types-of-website-digital-presence-software",
  "guide:website-digital-presence-vs-ecommerce-software",
  "guide:website-digital-presence-requirements-guide",
  "guide:website-digital-presence-evaluation-guide",
  "best:website-digital-presence-software",
  "guide:what-is-shopify",
  "guide:what-is-ueni",
  "guide:what-is-flippa",
  "guide:what-is-plesk",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_16_WEBSITE_DIGITAL_PRESENCE_CONTENT_KEYS.length; i++) {
    const key = TIER_16_WEBSITE_DIGITAL_PRESENCE_CONTENT_KEYS[i];
    const slot = TIER_16_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_16_SCHEDULE = buildScheduleMap();

export function tier16ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_16_SCHEDULE.get(contentKey);
}

export function tier16GuideScheduledAt(guideSlug: string): string | undefined {
  return tier16ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier16CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier16ContentScheduledAt(`category:${categorySlug}`);
}

export function tier16BestScheduledAt(bestSlug: string): string | undefined {
  return tier16ContentScheduledAt(`best:${bestSlug}`);
}

/** Products moved to subcategory affiliate-deepen — schedules preserved from Jan 2027 wave. */
const TIER_16_LEGACY_PRODUCT_SCHEDULES: Record<string, string> = {
  leadpages: slotUtc("2027-01-21"),
};

export function tier16ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  const legacy = TIER_16_LEGACY_PRODUCT_SCHEDULES[productSlug];
  if (legacy) return legacy;
  return tier16GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_16_SCHEDULED_GUIDE_SLUGS =
  TIER_16_WEBSITE_DIGITAL_PRESENCE_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
