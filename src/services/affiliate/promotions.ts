import type {
  CommercialCtaIntent,
  Promotion,
  PromotionEffectiveStatus,
  PromotionManualStatus,
} from "@/domain";
import {
  PROMOTION_EXPIRING_SOON_DAYS,
  PROMOTION_STALE_AFTER_DAYS,
} from "./policy";

export function derivePromotionEffectiveStatus(
  promotion: Pick<
    Promotion,
    "status" | "startsAt" | "endsAt" | "noExpiry"
  >,
  now: Date = new Date(),
): PromotionEffectiveStatus {
  if (promotion.status === "disabled") return "disabled";
  if (promotion.status === "draft") return "draft";

  const nowMs = now.getTime();
  if (promotion.startsAt) {
    const start = Date.parse(promotion.startsAt);
    if (!Number.isNaN(start) && start > nowMs) return "scheduled";
  }
  if (!promotion.noExpiry && promotion.endsAt) {
    const end = Date.parse(promotion.endsAt);
    if (!Number.isNaN(end) && end < nowMs) return "expired";
  }

  if (promotion.status === "expired") return "expired";
  if (promotion.status === "scheduled") {
    // Manual scheduled but start already passed → treat as active window
    return "active";
  }
  return "active";
}

export function isPromotionPubliclyActive(
  promotion: Promotion,
  now: Date = new Date(),
): boolean {
  const effective = derivePromotionEffectiveStatus(promotion, now);
  return effective === "active";
}

export function selectPrimaryPromotion(
  promotions: Promotion[],
  now: Date = new Date(),
): Promotion | null {
  const active = promotions
    .filter((p) => isPromotionPubliclyActive(p, now))
    .sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.id.localeCompare(b.id);
    });
  return active[0] ?? null;
}

export function isPromotionExpiringSoon(
  promotion: Promotion,
  now: Date = new Date(),
): boolean {
  if (promotion.noExpiry || !promotion.endsAt) return false;
  if (!isPromotionPubliclyActive(promotion, now)) return false;
  const end = Date.parse(promotion.endsAt);
  if (Number.isNaN(end)) return false;
  const days = (end - now.getTime()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= PROMOTION_EXPIRING_SOON_DAYS;
}

export function isPromotionStale(
  promotion: Promotion,
  now: Date = new Date(),
): boolean {
  if (!promotion.verifiedAt) return true;
  const verified = Date.parse(promotion.verifiedAt);
  if (Number.isNaN(verified)) return true;
  const days = (now.getTime() - verified) / (1000 * 60 * 60 * 24);
  return days > PROMOTION_STALE_AFTER_DAYS;
}

export function validatePromotionConflicts(
  promotions: Promotion[],
): { code: string; message: string; promotionIds: string[] }[] {
  const issues: { code: string; message: string; promotionIds: string[] }[] =
    [];
  const byProduct = new Map<string, Promotion[]>();
  for (const p of promotions) {
    const list = byProduct.get(p.productSlug) ?? [];
    list.push(p);
    byProduct.set(p.productSlug, list);
  }
  for (const [product, list] of byProduct) {
    const primaries = list.filter(
      (p) => p.isPrimary && p.status !== "disabled" && p.status !== "expired",
    );
    if (primaries.length > 1) {
      issues.push({
        code: "MULTIPLE_PRIMARY_PROMOTIONS",
        message: `${product}: multiple primary promotions`,
        promotionIds: primaries.map((p) => p.id),
      });
    }
  }
  for (const p of promotions) {
    if (p.startsAt && p.endsAt && p.startsAt > p.endsAt) {
      issues.push({
        code: "INVALID_DATE_RANGE",
        message: `${p.id}: endsAt before startsAt`,
        promotionIds: [p.id],
      });
    }
  }
  return issues;
}

export function syncManualStatusFromDates(
  status: PromotionManualStatus,
  effective: PromotionEffectiveStatus,
): PromotionManualStatus {
  if (status === "disabled" || status === "draft") return status;
  if (effective === "expired") return "expired";
  if (effective === "scheduled") return "scheduled";
  if (effective === "active") return "active";
  return status;
}

/** Safe promotional copy from structured facts — never invent magnitudes. */
export function buildPromotionLabel(promotion: Promotion): string {
  return promotion.headline;
}

export function buildPromotionSubtext(promotion: Promotion): string | null {
  const parts: string[] = [];
  if (promotion.description) parts.push(promotion.description);
  if (promotion.terms.length) parts.push(promotion.terms.join(" · "));
  return parts.length ? parts.join(" — ") : null;
}

export function defaultCtaLabel(
  productName: string,
  intent: CommercialCtaIntent,
  hasPromotion: boolean,
): string {
  if (hasPromotion && (intent === "GET_DEAL" || intent === "VISIT")) {
    return `Get the ${productName} deal`;
  }
  switch (intent) {
    case "START_TRIAL":
      return `Try ${productName}`;
    case "VIEW_PRICING":
      return `View ${productName} pricing`;
    case "GET_DEAL":
      return `Get the ${productName} deal`;
    case "REQUEST_DEMO":
      return `Request a ${productName} demo`;
    case "SIGN_UP":
      return `Sign up for ${productName}`;
    case "LEARN_MORE":
      return `Learn more about ${productName}`;
    case "VISIT":
    default:
      return `Visit ${productName}`;
  }
}
