/**
 * Tier 3 Accounting & Finance category launch — hub, guides, best page, finder tool,
 * and affiliate what-is guides for navan / dext / mrpeasy (moved from Tier 9 HR and Tier 12 PM).
 * Window: 1–28 September 2026 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_3_LAUNCH_SLOTS = [
  slotUtc("2026-09-01"),
  slotUtc("2026-09-03"),
  slotUtc("2026-09-05"),
  slotUtc("2026-09-07"),
  slotUtc("2026-09-09"),
  slotUtc("2026-09-11"),
  slotUtc("2026-09-13"),
  slotUtc("2026-09-15"),
  slotUtc("2026-09-17"),
  slotUtc("2026-09-19"),
  slotUtc("2026-09-22"),
  slotUtc("2026-09-25"),
  slotUtc("2026-09-28"),
  slotUtc("2026-09-29"),
] as const;

/** Publication order — one item per slot unless noted in batch map. */
export const TIER_3_ACCOUNTING_FINANCE_CONTENT_KEYS = [
  "category:accounting-finance",
  "guide:what-is-accounting-finance-software",
  "guide:how-to-choose-accounting-finance-software",
  "guide:accounting-finance-pricing-guide",
  "guide:how-accounting-finance-software-works",
  "guide:types-of-accounting-finance-software",
  "guide:accounting-finance-vs-hr-software",
  "guide:accounting-finance-requirements-guide",
  "guide:accounting-finance-evaluation-guide",
  "best:accounting-finance-software",
  "tool:accounting-finance-finder",
  "guide:what-is-navan",
  "guide:what-is-dext",
  "guide:what-is-mrpeasy",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_3_ACCOUNTING_FINANCE_CONTENT_KEYS.length; i++) {
    const key = TIER_3_ACCOUNTING_FINANCE_CONTENT_KEYS[i];
    const slot = TIER_3_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_3_SCHEDULE = buildScheduleMap();

export function tier3ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_3_SCHEDULE.get(contentKey);
}

export function tier3GuideScheduledAt(guideSlug: string): string | undefined {
  return tier3ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier3CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier3ContentScheduledAt(`category:${categorySlug}`);
}

export function tier3BestScheduledAt(bestSlug: string): string | undefined {
  return tier3ContentScheduledAt(`best:${bestSlug}`);
}

export function tier3ToolScheduledAt(toolSlug: string): string | undefined {
  return tier3ContentScheduledAt(`tool:${toolSlug}`);
}

export function tier3ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier3GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_3_SCHEDULED_GUIDE_SLUGS = TIER_3_ACCOUNTING_FINANCE_CONTENT_KEYS.filter(
  (key) => key.startsWith("guide:"),
).map((key) => key.replace(/^guide:/, ""));
