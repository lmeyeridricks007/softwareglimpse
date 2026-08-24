/**
 * Tier 21 AI Website Builder subcategory launch — hub, guides, best page, and affiliate
 * what-is guides (wegic from Tier 16 WDP; mindstudio/emergent from Tier 5 AI).
 * Uses parent ai-finder build-surface constraint. Window: 2–29 May 2027 (interleaved with Tier 20).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_21_LAUNCH_SLOTS = [
  slotUtc("2027-05-02"),
  slotUtc("2027-05-04"),
  slotUtc("2027-05-06"),
  slotUtc("2027-05-08"),
  slotUtc("2027-05-10"),
  slotUtc("2027-05-12"),
  slotUtc("2027-05-14"),
  slotUtc("2027-05-16"),
  slotUtc("2027-05-18"),
  slotUtc("2027-05-22"),
  slotUtc("2027-05-26"),
  slotUtc("2027-05-28"),
  slotUtc("2027-05-29"),
] as const;

export const TIER_21_AI_WEBSITE_BUILDER_CONTENT_KEYS = [
  "category:ai-website-builder",
  "guide:what-is-ai-website-builder-software",
  "guide:how-to-choose-ai-website-builder-software",
  "guide:ai-website-builder-pricing-guide",
  "guide:how-ai-website-builder-software-works",
  "guide:types-of-ai-website-builder-software",
  "guide:ai-website-builder-vs-ai-software",
  "guide:ai-website-builder-requirements-guide",
  "guide:ai-website-builder-evaluation-guide",
  "best:ai-website-builder-software",
  "guide:what-is-wegic",
  "guide:what-is-mindstudio",
  "guide:what-is-emergent",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_21_AI_WEBSITE_BUILDER_CONTENT_KEYS.length; i++) {
    const key = TIER_21_AI_WEBSITE_BUILDER_CONTENT_KEYS[i];
    const slot = TIER_21_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_21_SCHEDULE = buildScheduleMap();

export function tier21ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_21_SCHEDULE.get(contentKey);
}

export function tier21GuideScheduledAt(guideSlug: string): string | undefined {
  return tier21ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier21CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier21ContentScheduledAt(`category:${categorySlug}`);
}

export function tier21BestScheduledAt(bestSlug: string): string | undefined {
  return tier21ContentScheduledAt(`best:${bestSlug}`);
}

export function tier21ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier21GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_21_SCHEDULED_GUIDE_SLUGS =
  TIER_21_AI_WEBSITE_BUILDER_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
