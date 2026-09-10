import type {
  DistributionCampaign,
  NewsletterEdition,
} from "@/domain";
import { withUtm, channelUtm } from "./utm";

/**
 * Assemble SoftwareGlimpse Weekly from genuine campaigns only.
 * Empty sections get omittedReason — never filler.
 */
export function assembleSoftwareGlimpseWeekly(
  campaigns: DistributionCampaign[],
  opts: { weekLabel?: string; now?: Date } = {},
): NewsletterEdition {
  const now = opts.now ?? new Date();
  const weekLabel = opts.weekLabel ?? now.toISOString().slice(0, 10);

  const pricing = campaigns.filter((c) => c.campaignType === "verified_price_change");
  const research = campaigns.filter(
    (c) =>
      c.campaignType === "research_insight" ||
      c.campaignType === "data_insight",
  );
  const testing = campaigns.filter((c) => c.campaignType === "product_testing");
  const comparison = campaigns.filter(
    (c) => c.campaignType === "comparison_finding",
  );

  const sections: NewsletterEdition["sections"] = [];

  if (pricing.length > 0) {
    const c = pricing[0]!;
    sections.push({
      id: "pricing_changes",
      heading: "Pricing Changes",
      body: `${c.keyFinding}\n\n${c.supportingData
        .slice(0, 4)
        .map((d) => `• ${d.label}: ${d.value}`)
        .join("\n")}`,
      sourceURL: withUtm(c.sourceURL, channelUtm(c.utmCampaign, "newsletter")),
    });
  } else {
    sections.push({
      id: "pricing_changes",
      heading: "Pricing Changes",
      body: "",
      omittedReason: "No CONFIRMED price changes in this pack.",
    });
  }

  if (research.length > 0) {
    const c = research[0]!;
    sections.push({
      id: "data_insight",
      heading: "One Data Insight",
      body: c.keyFinding,
      sourceURL: withUtm(c.sourceURL, channelUtm(c.utmCampaign, "newsletter")),
    });
  } else {
    sections.push({
      id: "data_insight",
      heading: "One Data Insight",
      body: "",
      omittedReason: "No research/data insight campaign available.",
    });
  }

  if (testing.length > 0) {
    const c = testing[0]!;
    sections.push({
      id: "software_worth_watching",
      heading: "Software Worth Watching",
      body: `${c.sourceAsset}\n${c.keyFinding}`,
      sourceURL: withUtm(c.sourceURL, channelUtm(c.utmCampaign, "newsletter")),
    });
  } else {
    sections.push({
      id: "software_worth_watching",
      heading: "Software Worth Watching",
      body: "",
      omittedReason:
        "No completed hands-on test summaries to feature this week.",
    });
  }

  if (comparison.length > 0) {
    const c = comparison[0]!;
    sections.push({
      id: "comparison_of_the_week",
      heading: "Comparison of the Week",
      body: c.keyFinding,
      sourceURL: withUtm(c.sourceURL, channelUtm(c.utmCampaign, "newsletter")),
    });
  } else {
    sections.push({
      id: "comparison_of_the_week",
      heading: "Comparison of the Week",
      body: "",
      omittedReason:
        "No new comparison-finding campaign in this pack (avoid filler).",
    });
  }

  if (research.length > 0) {
    const c = research[0]!;
    sections.push({
      id: "research_update",
      heading: "Research Update",
      body: `${c.sourceAsset}\n${c.keyFinding}\nLimitations: ${c.limitations.slice(0, 2).join("; ") || "see source page"}`,
      sourceURL: withUtm(c.sourceURL, channelUtm(c.utmCampaign, "newsletter")),
    });
  } else {
    sections.push({
      id: "research_update",
      heading: "Research Update",
      body: "",
      omittedReason: "No research report campaign this week.",
    });
  }

  const included = sections.filter((s) => !s.omittedReason && s.body.trim());

  return {
    id: `sg-weekly-${weekLabel}`,
    title: "SoftwareGlimpse Weekly",
    weekLabel,
    generatedAt: now.toISOString(),
    sections,
    includedSectionIds: included.map((s) => s.id),
  };
}

export function formatNewsletterMarkdown(edition: NewsletterEdition): string {
  const lines: string[] = [
    `# ${edition.title}`,
    "",
    `Week: ${edition.weekLabel}`,
    `Generated: ${edition.generatedAt}`,
    "",
    "_Only sections with genuine developments are meant for send. Omitted sections stay unpublished._",
    "",
  ];

  for (const section of edition.sections) {
    if (section.omittedReason) {
      lines.push(`## ${section.heading}`);
      lines.push("");
      lines.push(`_Omitted: ${section.omittedReason}_`);
      lines.push("");
      continue;
    }
    lines.push(`## ${section.heading}`);
    lines.push("");
    lines.push(section.body);
    if (section.sourceURL) {
      lines.push("");
      lines.push(`[Source](${section.sourceURL})`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
