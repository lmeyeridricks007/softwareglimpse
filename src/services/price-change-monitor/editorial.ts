import type {
  DetectedPriceChange,
  PriceChangeEditorialCandidate,
} from "@/domain";

const MAJOR_VENDORS = new Set([
  "salesforce",
  "hubspot",
  "microsoft-dynamics-365",
  "zoho-crm",
  "pipedrive",
  "zendesk-suite",
  "intercom",
  "freshworks",
  "freshsales",
  "oracle-sales",
]);

/**
 * Build editorial candidates from noteworthy price changes.
 * Never auto-publishes articles.
 */
export function buildEditorialCandidates(
  changes: DetectedPriceChange[],
): PriceChangeEditorialCandidate[] {
  const byProduct = new Map<string, DetectedPriceChange[]>();
  for (const change of changes) {
    if (change.confidence === "NO_CHANGE") continue;
    if (!change.noteworthy && change.confidence !== "CONFIRMED") continue;
    if (
      !change.noteworthy &&
      !(
        change.percentageChange != null &&
        Math.abs(change.percentageChange) >= 15
      ) &&
      !MAJOR_VENDORS.has(change.productId)
    ) {
      continue;
    }
    const list = byProduct.get(change.productId) ?? [];
    list.push(change);
    byProduct.set(change.productId, list);
  }

  const candidates: PriceChangeEditorialCandidate[] = [];
  for (const [productId, rows] of byProduct) {
    const name = rows[0]!.productName;
    const kinds = [...new Set(rows.map((r) => r.kind))];
    const worst =
      rows.some((r) => r.confidence === "REQUIRES_REVIEW")
        ? "REQUIRES_REVIEW"
        : rows.some((r) => r.confidence === "LIKELY")
          ? "LIKELY"
          : "CONFIRMED";

    const rationaleParts = rows.map((r) => r.summary);
    if (MAJOR_VENDORS.has(productId)) {
      rationaleParts.push("Major vendor in catalogue");
    }
    if (kinds.includes("free_plan_removed")) {
      rationaleParts.push("Free tier removal is high reader impact");
    }
    if (kinds.includes("ai_addon_introduced") || kinds.includes("ai_pricing_changed")) {
      rationaleParts.push("AI pricing introduction/change");
    }

    candidates.push({
      productId,
      productName: name,
      title: `${name} changed pricing — what changed and who is affected?`,
      rationale: rationaleParts.join(". "),
      changeKinds: kinds,
      confidence: worst,
      publishStatus: "candidate",
    });
  }

  return candidates.sort((a, b) => a.productName.localeCompare(b.productName));
}
