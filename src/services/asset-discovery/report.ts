import type { AssetDiscoveryReport } from "@/domain/schemas/asset-discovery";

/**
 * Markdown recommendation report for asset discovery.
 * Written to reports/content-assets/ — never mutates production pages.
 */

function importanceRank(i: string): number {
  switch (i) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    default:
      return 3;
  }
}

export function formatAssetDiscoveryMarkdown(
  report: AssetDiscoveryReport,
): string {
  const lines: string[] = [];
  lines.push(`# Asset Discovery Report — ${report.title}`);
  lines.push("");
  lines.push(`- **Page:** \`${report.pageId}\``);
  lines.push(`- **Route:** ${report.route}`);
  lines.push(`- **Page type:** ${report.pageType}`);
  lines.push(`- **Generated:** ${report.generatedAt}`);
  lines.push(`- **Framework:** ${report.frameworkVersion}`);
  lines.push("");
  lines.push("> Recommendations only. Do **not** auto-embed, download, rehost, publish, or alter rankings / evidence assessments from this report.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Count |`);
  lines.push(`| --- | ---: |`);
  lines.push(`| Opportunities | ${report.summary.opportunityCount} |`);
  lines.push(`| Open | ${report.summary.openOpportunityCount} |`);
  lines.push(`| Satisfied by existing media | ${report.summary.satisfiedExistingCount} |`);
  lines.push(`| Search tasks | ${report.summary.searchTaskCount} |`);
  lines.push(`| Discovered assets | ${report.summary.discoveredAssetCount} |`);
  lines.push(`| Official-verified | ${report.summary.officialVerifiedCount} |`);
  lines.push(`| Embed recommended | ${report.summary.embedRecommendedCount} |`);
  lines.push(`| Link / cite / evidence | ${report.summary.linkRecommendedCount} |`);
  lines.push(`| Create original visual | ${report.summary.createOriginalCount} |`);
  lines.push("");

  const open = [...report.opportunities]
    .filter((o) => o.status === "open" || o.status === "candidate-found")
    .sort(
      (a, b) => importanceRank(a.importance) - importanceRank(b.importance),
    );
  const satisfied = report.opportunities.filter(
    (o) => o.status === "satisfied-existing",
  );

  lines.push("## 1. Page needs (identified before search)");
  lines.push("");
  if (!open.length) {
    lines.push("_No open asset opportunities — existing coverage may be sufficient, or sections already have visuals._");
    lines.push("");
  } else {
    for (const opp of open) {
      lines.push(`### ${opp.importance.toUpperCase()} — ${opp.needType}`);
      lines.push("");
      lines.push(`- **Id:** \`${opp.id}\``);
      lines.push(`- **Section:** ${opp.sectionTitle ?? "—"} (\`${opp.sectionId ?? "—"}\`)`);
      lines.push(`- **Description:** ${opp.description}`);
      lines.push(`- **Purpose:** ${opp.purpose}`);
      lines.push(
        `- **Preferred types:** ${opp.preferredAssetTypes.join(", ")}`,
      );
      if (opp.productId) lines.push(`- **Product:** ${opp.productId}`);
      if (opp.featureId) lines.push(`- **Feature:** ${opp.featureId}`);
      if (opp.industryId) lines.push(`- **Industry:** ${opp.industryId}`);
      lines.push(`- **Status:** ${opp.status}`);
      lines.push("");
    }
  }

  if (satisfied.length) {
    lines.push("## 2. Needs already covered by existing media");
    lines.push("");
    for (const opp of satisfied) {
      lines.push(
        `- **${opp.needType}** (${opp.sectionTitle ?? opp.sectionId}) — ${opp.description}`,
      );
    }
    lines.push("");
  }

  lines.push("## 3. Search tasks");
  lines.push("");
  if (!report.searchTasks.length) {
    lines.push("_No search tasks (all needs satisfied or deferred)._");
    lines.push("");
  } else {
    for (const task of report.searchTasks) {
      lines.push(`- \`${task.id}\` ← \`${task.opportunityId}\``);
      lines.push(`  - Query: **${task.query}**`);
      if (task.siteFilter) lines.push(`  - Site filter: \`${task.siteFilter}\``);
      if (task.preferredDomains.length) {
        lines.push(
          `  - Prefer domains: ${task.preferredDomains.join(", ")}`,
        );
      }
      if (task.notes) lines.push(`  - Notes: ${task.notes}`);
    }
    lines.push("");
  }

  lines.push("## 4. Discovered assets (recommendations)");
  lines.push("");
  if (!report.discoveredAssets.length) {
    lines.push(
      "_No candidate URLs materialized. Search tasks above are ready for a search API or researcher-supplied official URLs. This framework does **not** invent asset URLs._",
    );
    lines.push("");
  } else {
    for (const asset of report.discoveredAssets) {
      lines.push(`### ${asset.title}`);
      lines.push("");
      lines.push(`- **Id:** \`${asset.id}\``);
      lines.push(`- **URL:** ${asset.sourceUrl}`);
      lines.push(`- **Type / format:** ${asset.assetType} / ${asset.mediaFormat}`);
      lines.push(`- **Source type:** ${asset.sourceType}`);
      lines.push(
        `- **Official:** ${asset.officialSource ? "yes (verified)" : "no"}`,
      );
      lines.push(`- **Usage:** ${asset.usageRightsStatus}`);
      lines.push(`- **Recommendation:** **${asset.recommendation}**`);
      lines.push(`- **Reason:** ${asset.reason}`);
      if (asset.qualityAssessment) {
        lines.push(
          `- **Quality overall:** ${asset.qualityAssessment.overall}/100 (specificity ${asset.qualityAssessment.specificity}/5, official confidence ${asset.qualityAssessment.officialSourceConfidence}/5)`,
        );
      }
      if (asset.researchMediaBridgeSuggested) {
        lines.push(
          `- **ResearchMedia bridge:** suggested (run media research lifecycle separately — do not auto-publish)`,
        );
      }
      if (asset.officialVerificationNotes.length) {
        lines.push(`- **Verification notes:**`);
        for (const n of asset.officialVerificationNotes.slice(0, 8)) {
          lines.push(`  - ${n}`);
        }
      }
      lines.push("");
    }
  }

  lines.push("## 5. Review lifecycle");
  lines.push("");
  lines.push("```text");
  lines.push("needs identified → search tasks → candidates (real URLs only)");
  lines.push("  → official verification → usage classification → quality score");
  lines.push("  → Markdown recommendation → editorial approval");
  lines.push("  → (optional) ResearchMedia discover/verify/classify/activate");
  lines.push("```");
  lines.push("");
  lines.push("Connection to content-quality audits: open asset opportunities feed the `visual-media-support` and `evidence-source-quality` dimensions as **mediaGaps** / research follow-ups — they do not rewrite pages.");
  lines.push("");

  lines.push("## 6. Limitations");
  lines.push("");
  for (const lim of report.limitations) {
    lines.push(`- ${lim}`);
  }
  lines.push("");

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of report.notes) {
      lines.push(`- ${n}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

export function formatAssetDiscoveryText(report: AssetDiscoveryReport): string {
  return [
    `Asset Discovery: ${report.title}`,
    `route=${report.route} type=${report.pageType}`,
    `opportunities=${report.summary.opportunityCount} open=${report.summary.openOpportunityCount} searchTasks=${report.summary.searchTaskCount} assets=${report.summary.discoveredAssetCount}`,
    `official=${report.summary.officialVerifiedCount} embed=${report.summary.embedRecommendedCount} link=${report.summary.linkRecommendedCount} original=${report.summary.createOriginalCount}`,
  ].join("\n");
}
