import type { DistributionCampaign, SupportingDatum } from "@/domain";
import { getSoftware } from "@/data";
import {
  buildPublicHandsOnSummary,
  buildTestCoverageMetrics,
} from "@/services/product-testing";
import { utmCampaignSlug } from "../utm";

/**
 * Campaigns from real completed hands-on test sessions only.
 * Never invents tester results.
 */
export function campaignsFromProductTesting(
  opts: { now?: Date; maxProducts?: number } = {},
): DistributionCampaign[] {
  const now = opts.now ?? new Date();
  const software = getSoftware({ includeUnpublished: false }).slice(
    0,
    opts.maxProducts ?? 80,
  );
  const campaigns: DistributionCampaign[] = [];

  for (const product of software) {
    const summary = buildPublicHandsOnSummary(product.slug);
    if (!summary?.taskSummary) continue;

    const tasks = summary.taskSummary;
    const supportingData: SupportingDatum[] = [
      {
        label: "Tasks passed",
        value: String(tasks.pass),
        sampleSize: tasks.total,
      },
      {
        label: "Tasks partial",
        value: String(tasks.partial),
        sampleSize: tasks.total,
      },
      {
        label: "Plan tested",
        value: summary.planTested || "recorded plan",
      },
    ];
    if (summary.setupMinutes != null) {
      supportingData.push({
        label: "Setup minutes",
        value: String(summary.setupMinutes),
      });
    }

    const testedDay = summary.testedAt.slice(0, 10);
    campaigns.push({
      id: `dist-test-${product.slug}-${testedDay}`,
      sourceAsset: `${product.name} hands-on test`,
      keyFinding: `Completed hands-on session on ${product.name}: ${tasks.pass}/${tasks.total} tasks passed (${tasks.partial} partial) on ${testedDay}.`,
      supportingData,
      sourceURL: `/software/${product.slug}/`,
      publicationDate: testedDay,
      campaignType: "product_testing",
      title: `Hands-on testing — ${product.name}`,
      limitations: [
        "Public summary only — incomplete sessions never qualify.",
        "Not a score invented for marketing.",
      ],
      utmCampaign: utmCampaignSlug(["hands-on", product.slug, testedDay]),
      generatedAt: now.toISOString(),
    });
  }

  if (campaigns.length === 0) {
    const metrics = buildTestCoverageMetrics();
    if (metrics.handsOnTested > 0) {
      const date = now.toISOString().slice(0, 10);
      campaigns.push({
        id: `dist-testing-coverage-${date}`,
        sourceAsset: "Product testing coverage",
        keyFinding: `${metrics.handsOnTested} catalogue product(s) currently qualify for hands-on tested evidence (of ${metrics.totalProducts} products scanned).`,
        supportingData: [
          {
            label: "Hands-on tested products",
            value: String(metrics.handsOnTested),
            sampleSize: metrics.totalProducts,
          },
          {
            label: "Data verified",
            value: String(metrics.dataVerified),
            sampleSize: metrics.totalProducts,
          },
        ],
        sourceURL: "/company/how-we-review-software/",
        publicationDate: date,
        campaignType: "product_testing",
        title: "Hands-on testing coverage update",
        limitations: [
          "Coverage counts are derived from completed sessions and editorial evidence flags — not invented.",
        ],
        utmCampaign: utmCampaignSlug(["testing-coverage", date]),
        generatedAt: now.toISOString(),
      });
    }
  }

  return campaigns;
}
