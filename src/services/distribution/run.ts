import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ChannelDraft, DistributionCampaign } from "@/domain";
import { buildDistributionPack, type DistributionPack } from "./campaign";

export type RunDistributionOptions = {
  write?: boolean;
  includeResearch?: boolean;
  includePriceChanges?: boolean;
  includeTesting?: boolean;
  recordTracking?: boolean;
};

function formatPackMarkdown(pack: DistributionPack): string {
  const lines: string[] = [
    "# Distribution pack",
    "",
    `Generated: ${pack.generatedAt}`,
    "",
    "Drafts only — **do not auto-post**. Human approval required.",
    "",
    `Campaigns: ${pack.campaigns.length}`,
    `Newsletter sections included: ${pack.newsletterIncludedSections.join(", ") || "(none)"}`,
    "",
  ];

  for (const campaign of pack.campaigns) {
    lines.push(`## ${campaign.title}`);
    lines.push("");
    lines.push(`- Type: \`${campaign.campaignType}\``);
    lines.push(`- Source: ${campaign.sourceAsset}`);
    lines.push(`- URL: \`${campaign.sourceURL}\``);
    lines.push(`- UTM campaign: \`${campaign.utmCampaign}\``);
    lines.push(`- Key finding: ${campaign.keyFinding}`);
    lines.push("");
    lines.push("### Supporting data");
    lines.push("");
    for (const d of campaign.supportingData) {
      lines.push(
        `- ${d.label}: **${d.value}**${d.sampleSize != null ? ` (n=${d.sampleSize})` : ""}`,
      );
    }
    lines.push("");

    const drafts = pack.draftsByCampaignId[campaign.id] ?? [];
    for (const draft of drafts) {
      lines.push(`### Channel: ${draft.channel}`);
      lines.push("");
      if (draft.headline) lines.push(`**${draft.headline}**`, "");
      lines.push("```");
      lines.push(draft.body);
      lines.push("```");
      lines.push("");
      if (draft.slides?.length) {
        lines.push("Slides:");
        draft.slides.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
        lines.push("");
      }
      if (draft.visualSpecs?.length) {
        lines.push("Visual specs:");
        for (const v of draft.visualSpecs) {
          lines.push(
            `- ${v.kind}: ${v.title} — on-pixel: ${v.onPixelLines.join(" | ")}`,
          );
        }
        lines.push("");
      }
      lines.push(
        `_requiresHumanApproval=${draft.requiresHumanApproval} autoPost=${draft.autoPost}_`,
      );
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("# Newsletter draft");
  lines.push("");
  lines.push(pack.newsletterMarkdown);

  return lines.join("\n");
}

export function runDistributionWorkflow(
  opts: RunDistributionOptions = {},
): DistributionPack & { wrotePaths: string[] } {
  const pack = buildDistributionPack({
    includeResearch: opts.includeResearch,
    includePriceChanges: opts.includePriceChanges,
    includeTesting: opts.includeTesting,
    recordTracking: opts.recordTracking,
  });

  const wrotePaths: string[] = [];
  if (opts.write !== false) {
    const outDir = path.join(process.cwd(), "data/distribution");
    mkdirSync(outDir, { recursive: true });
    const jsonPath = path.join(outDir, "latest-pack.json");
    const mdPath = path.join(outDir, "latest-pack.md");
    const newsPath = path.join(outDir, "newsletter-weekly.md");
    writeFileSync(jsonPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
    writeFileSync(mdPath, formatPackMarkdown(pack), "utf8");
    writeFileSync(newsPath, pack.newsletterMarkdown, "utf8");
    wrotePaths.push(jsonPath, mdPath, newsPath);
  }

  return { ...pack, wrotePaths };
}

export type { DistributionCampaign, ChannelDraft, DistributionPack };
