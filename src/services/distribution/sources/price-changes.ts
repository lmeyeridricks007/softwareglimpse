import type { DistributionCampaign, SupportingDatum } from "@/domain";
import { buildPriceMonitorQueue } from "@/services/price-change-monitor/queue";
import { detectPriceChangesForProducts } from "@/services/price-change-monitor/detect";
import { utmCampaignSlug } from "../utm";

/**
 * Campaigns from CONFIRMED price changes only.
 * LIKELY / REQUIRES_REVIEW never become distribution claims.
 */
export function campaignsFromConfirmedPriceChanges(
  opts: { limit?: number; now?: Date } = {},
): DistributionCampaign[] {
  const now = opts.now ?? new Date();
  const queue = buildPriceMonitorQueue(opts.limit ?? 40);
  const changes = detectPriceChangesForProducts(
    queue.items.map((i) => i.productId),
  ).filter((c) => c.confidence === "CONFIRMED");

  return changes.map((change) => {
    const supportingData: SupportingDatum[] = [
      {
        label: "Confidence",
        value: "CONFIRMED",
        note: "Price-change monitor validation rules",
      },
      {
        label: "Change kind",
        value: change.kind,
      },
    ];
    if (change.previousPrice != null) {
      supportingData.push({
        label: "Previous list price",
        value: String(change.previousPrice),
      });
    }
    if (change.newPrice != null) {
      supportingData.push({
        label: "New list price",
        value: String(change.newPrice),
      });
    }
    if (change.percentageChange != null) {
      supportingData.push({
        label: "Percentage change",
        value: `${change.percentageChange.toFixed(1)}%`,
      });
    }

    const date = now.toISOString().slice(0, 10);
    return {
      id: `dist-price-${change.productId}-${change.kind}-${date}`,
      sourceAsset: `${change.productName} pricing (verified change)`,
      keyFinding: change.summary,
      supportingData,
      sourceURL: `/software/${change.productId}/`,
      publicationDate: date,
      campaignType: "verified_price_change" as const,
      title: `Verified price change — ${change.productName}`,
      limitations: [
        ...change.validationNotes,
        "List-price observation — confirm live vendor pricing before publishing absolute claims.",
      ],
      utmCampaign: utmCampaignSlug([
        "price-change",
        change.productId,
        change.kind,
        date,
      ]),
      generatedAt: now.toISOString(),
    };
  });
}
