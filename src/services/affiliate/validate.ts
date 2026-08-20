import {
  listAffiliateDestinations,
  listAffiliateProgrammes,
  listPromotions,
} from "@/data/affiliates/store";
import { validateAffiliateUrl } from "./url-validation";
import { validatePromotionConflicts } from "./promotions";
import { getAffiliateProgramme } from "@/data/affiliates/store";

export type AffiliateValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

export function validateAffiliateRepository(): {
  ok: boolean;
  issues: AffiliateValidationIssue[];
} {
  const issues: AffiliateValidationIssue[] = [];

  for (const programme of listAffiliateProgrammes()) {
    if (programme.productSlugs.length === 0) {
      issues.push({
        severity: "warning",
        code: "EMPTY_PROGRAMME",
        message: `${programme.id}: no products`,
      });
    }
  }

  const defaults = new Map<string, number>();
  for (const dest of listAffiliateDestinations()) {
    const url = validateAffiliateUrl(dest.url);
    if (!url.ok) {
      issues.push({
        severity: "error",
        code: "MALFORMED_AFFILIATE_URL",
        message: `${dest.id}: ${url.message}`,
      });
    }
    const programme = getAffiliateProgramme(dest.programmeId);
    if (!programme) {
      issues.push({
        severity: "error",
        code: "MISSING_PROGRAMME",
        message: `${dest.id}: programme ${dest.programmeId} missing`,
      });
    } else if (!programme.productSlugs.includes(dest.productSlug)) {
      issues.push({
        severity: "warning",
        code: "PROGRAMME_PRODUCT_MISMATCH",
        message: `${dest.id}: product not listed on programme`,
      });
    }
    if (dest.isDefault && dest.status === "active") {
      defaults.set(
        dest.productSlug,
        (defaults.get(dest.productSlug) ?? 0) + 1,
      );
    }
  }

  for (const [slug, count] of defaults) {
    if (count > 1) {
      issues.push({
        severity: "error",
        code: "MULTIPLE_DEFAULT_DESTINATIONS",
        message: `${slug}: ${count} default destinations`,
      });
    }
  }

  for (const promo of listPromotions()) {
    if (promo.destinationId) {
      const dest = listAffiliateDestinations().find(
        (d) => d.id === promo.destinationId,
      );
      if (!dest) {
        issues.push({
          severity: "error",
          code: "BROKEN_PROMOTION_DESTINATION",
          message: `${promo.id}: destination missing`,
        });
      } else if (dest.productSlug !== promo.productSlug) {
        issues.push({
          severity: "error",
          code: "PROMOTION_PRODUCT_MISMATCH",
          message: `${promo.id}: destination product mismatch`,
        });
      } else if (dest.status !== "active" && promo.status === "active") {
        issues.push({
          severity: "warning",
          code: "BROKEN_PROMOTION_DESTINATION",
          message: `${promo.id}: destination inactive`,
        });
      }
    }
  }

  for (const conflict of validatePromotionConflicts(listPromotions())) {
    issues.push({
      severity: "warning",
      code: conflict.code,
      message: conflict.message,
    });
  }

  return {
    ok: !issues.some((i) => i.severity === "error"),
    issues,
  };
}

export function validatePromotionRepository(): {
  ok: boolean;
  issues: AffiliateValidationIssue[];
} {
  return validateAffiliateRepository();
}
