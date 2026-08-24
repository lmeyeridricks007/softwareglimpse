import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  OnboardingLaunchPlan,
  Software,
  SoftwareOnboardingRun,
} from "@/domain";
import type { ProductResearchEnrichment } from "@/domain/schemas/research-enrichment";

const DOCS_LAUNCHES = path.join(process.cwd(), "docs/publishing/launches");

export function writeOnboardingLaunchReport(input: {
  run: SoftwareOnboardingRun;
  product: Software;
  plan: OnboardingLaunchPlan;
  enrichment?: ProductResearchEnrichment | null;
  launchWarnings?: string[];
}): string {
  const { run, product, plan, enrichment, launchWarnings = [] } = input;
  mkdirSync(DOCS_LAUNCHES, { recursive: true });
  const file = path.join(DOCS_LAUNCHES, `${product.slug}-launch.md`);

  const sources = product.sources ?? [];
  const sourceCount = sources.length + (enrichment?.sourceIds?.length ?? 0);
  const pricingVerified = product.pricingVerifiedAt;
  const screenshotCount = enrichment?.screenshots?.length ?? 0;
  const videoCount = enrichment?.media?.length ?? 0;

  const scheduled = plan.contentItems.filter(
    (i) => i.publishStatus === "scheduled",
  );
  const blocked = plan.contentItems.filter((i) => i.quality === "BLOCKED");

  const lines: string[] = [
    `# ${product.name} Launch`,
    "",
    "## Product",
    "",
    `- **Name:** ${product.name}`,
    `- **Vendor:** ${plan.vendor ?? product.company}`,
    `- **Category:** ${plan.categorySlug ?? product.primaryCategorySlug}`,
    `- **Slug:** \`${product.slug}\``,
    "",
    "## Launch",
    "",
    `- **Launch ID:** \`${plan.launchId}\``,
    `- **Human:** ${plan.humanPublishLabel}`,
    `- **Timezone:** ${plan.timezone}`,
    `- **UTC:** \`${plan.publishAtUtc}\``,
    `- **Status:** ${plan.status.toUpperCase()}`,
    `- **Readiness:** ${plan.readiness}`,
    "",
    "## Content package",
    "",
    "| Route | Type | Publish (UTC) | Status | Quality |",
    "| --- | --- | --- | --- | --- |",
    ...plan.contentItems.map(
      (i) =>
        `| \`${i.path}\` | ${i.pageType} | ${i.scheduledAt ?? "—"} | ${i.publishStatus} | ${i.quality} |`,
    ),
    "",
  ];

  if (launchWarnings.length) {
    lines.push("### Launch warnings", "", ...launchWarnings.map((w) => `- ${w}`), "");
  }

  if (blocked.length) {
    lines.push("### Blocked items", "");
    for (const item of blocked) {
      lines.push(`- **${item.title}** — ${item.warnings.join("; ") || "blocked"}`);
    }
    lines.push("");
  }

  lines.push(
    "## Research",
    "",
    `- Official sources recorded: ${sourceCount}`,
    `- Research completeness: ${run.researchCompletenessPercent ?? 0}%`,
    pricingVerified
      ? `- Pricing verified: ${pricingVerified}`
      : "- Pricing verified: not yet",
    `- Research status: ${product.metadata.researchStatus ?? "none"}`,
    "",
    "## Assets",
    "",
    product.logo ? `- Logo: READY (\`${product.logo}\`)` : "- Logo: missing",
    `- Screenshots: ${screenshotCount}`,
    `- Official videos: ${videoCount}`,
    "",
    "## SEO",
    "",
    `- Title: ${product.seo.title ?? "—"}`,
    `- Description: ${product.seo.description ? "set" : "missing"}`,
    `- Canonical: \`${product.seo.canonicalPath ?? `/software/${product.slug}/`}\``,
    `- Indexable when live: ${product.seo.indexable}`,
    `- Internal link candidates: ${run.internalLinkCandidates.length}`,
    "",
    "## Discovery (via central publishing)",
    "",
    "Scheduled content uses the publication resolver — no per-product sitemap/search edits.",
    "",
    "- **Local dev:** visible in catalogue, category, search, internal links",
    "- **Production before launch:** 404 / absent from discovery",
    "- **After launch:** automatic via `content:publish` runner + revalidation",
    "",
    `- Catalogue: ${scheduled.some((i) => i.pageType === "software-review") ? "yes when scheduled" : "no"}`,
    `- Category placement: ${product.primaryCategorySlug}`,
    `- Search: follows dev preview context`,
    `- Comparisons: ${scheduled.filter((i) => i.pageType === "comparison").length} scheduled`,
    "",
    "## Launch readiness",
    "",
    `**${plan.readiness}**`,
    "",
    "## Preview",
    "",
    "```bash",
    plan.previewCommand,
    "```",
    "",
    "Or `npm run dev` to preview all scheduled content.",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Onboarding run: \`${run.id}\``,
  );

  writeFileSync(file, lines.join("\n"), "utf8");
  return file;
}
