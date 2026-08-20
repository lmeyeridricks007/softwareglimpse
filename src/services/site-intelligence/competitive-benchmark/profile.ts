import { competitorTypeLabel } from "../serp-competitors/classify-domain";
import type { CompetitorDomainType } from "../serp-competitors/types";
import type {
  CompetitorProfile,
  QueryClusterId,
  SampledQueryCluster,
  ScoredPage,
} from "./types";

function avgDim(pages: ScoredPage[], id: string): number | null {
  const vals = pages
    .map((p) => p.dimensions.find((d) => d.id === id)?.score)
    .filter((n): n is number => typeof n === "number");
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function typeDoNotCopy(type: CompetitorDomainType): string[] {
  switch (type) {
    case "vendor":
      return [
        "Vendor-first positioning that ranks products as default winners",
        "Migration CTAs that exist mainly to convert to one platform",
      ];
    case "software-marketplace":
      return [
        "User-review volume as a substitute for editorial decision criteria",
        "Pay-to-play listing dynamics (if present) without transparent methodology",
      ];
    case "direct-review-affiliate":
      return [
        "Affiliate-led ranking without disclosed criteria",
        "Thin roundups that list tools without trade-off analysis",
      ];
    case "consultancy":
      return [
        "Gated research paywalls as the primary value exchange",
        "Enterprise-only framing that ignores SMB decision reality",
      ];
    case "community":
      return [
        "Anecdote threads without verification as definitive guidance",
      ];
    default:
      return ["Opaque ranking claims without observable methodology"];
  }
}

function typeLearn(type: CompetitorDomainType): string[] {
  switch (type) {
    case "software-marketplace":
      return [
        "Clear category taxonomy and side-by-side comparison UX",
        "Structured product attributes that support filtering",
      ];
    case "direct-review-affiliate":
      return [
        "Scannable pick structure with explicit “best for” framing",
        "Visible update dates and author bylines when present",
      ];
    case "vendor":
      return [
        "Strong product media and practical how-to implementation content",
        "Checklist/resource formats that reduce buyer anxiety",
      ];
    case "consultancy":
      return [
        "Framework language and evaluation rigor (where ungated)",
      ];
    default:
      return ["Topic coverage breadth on high-intent CRM queries"];
  }
}

/**
 * Build a domain profile from sampled scored pages + SERP topic context.
 */
export function buildCompetitorProfile(input: {
  domain: string;
  type: CompetitorDomainType;
  significance: string;
  pages: ScoredPage[];
  clusters: SampledQueryCluster[];
}): CompetitorProfile {
  const { domain, type, significance, pages, clusters } = input;
  const topics = clusters
    .filter((c) => c.domains.some((d) => d.domain === domain))
    .map((c) => c.label);

  const depth = avgDim(pages, "content-depth");
  const method = avgDim(pages, "source-transparency");
  const media = avgDim(pages, "product-screenshots");
  const tools = avgDim(pages, "tools");
  const intent = avgDim(pages, "search-intent-alignment");
  const author = avgDim(pages, "author-trust");

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (intent != null && intent >= 70) {
    strengths.push("Strong title/URL alignment to target CRM intents");
  }
  if (depth != null && depth >= 70) strengths.push("Long-form page depth on sampled URLs");
  if (method != null && method >= 60) {
    strengths.push("Observable methodology and/or disclosure signals");
  }
  if (media != null && media >= 60) strengths.push("Product/media density on sampled pages");
  if (tools != null && tools >= 60) strengths.push("Interactive tool or finder signals");
  if (author != null && author >= 60) strengths.push("Author/byline trust signals present");

  if (depth != null && depth < 50) weaknesses.push("Thin content depth on sampled pages");
  if (method != null && method < 40) {
    weaknesses.push("Weak methodology/disclosure observability");
  }
  if (media != null && media < 40) {
    weaknesses.push("Limited product screenshot / media signals");
  }
  if (tools != null && tools < 35) {
    weaknesses.push("Few interactive tools/calculators on sampled pages");
  }
  if (author != null && author < 40) {
    weaknesses.push("Weak author attribution on sampled pages");
  }
  if (pages.some((p) => p.observation.source === "serp-metadata")) {
    weaknesses.push(
      "Some pages only assessed via SERP metadata (fetch blocked/unavailable)",
    );
  }

  if (!strengths.length) {
    strengths.push(`Visible presence on CRM SERPs (${competitorTypeLabel(type)})`);
  }
  if (!weaknesses.length) {
    weaknesses.push("No major observable weakness flagged on this limited sample");
  }

  const whyRanksLikely = [
    `Appears on ${topics.length || 1} sampled CRM query cluster(s): ${topics.join(", ") || "CRM"}`,
    `Competitor type: ${competitorTypeLabel(type)} — format often matches SERP expectations for those intents`,
    intent != null && intent >= 65
      ? "Page titles/URLs closely match query language"
      : "Brand/domain familiarity and topical coverage (inferred cautiously)",
  ];

  const topicsStrong = topics.length ? topics : ["CRM (general SERP presence)"];
  const allClusterLabels = clusters.map((c) => c.label);
  const topicsWeak = allClusterLabels.filter((l) => !topicsStrong.includes(l)).slice(0, 4);

  return {
    domain,
    type,
    significance,
    pagesAnalyzed: pages,
    mainStrengths: strengths,
    mainWeaknesses: weaknesses,
    whyRanksLikely,
    topicsStrong,
    topicsWeak: topicsWeak.length
      ? topicsWeak
      : ["Not observed weak on this sample — absence ≠ weakness"],
    learnFrom: typeLearn(type),
    doNotCopy: typeDoNotCopy(type),
    notes: [
      `Significance from SERP discovery: ${significance}`,
      "Assessment limited to representative URLs — not a full-site crawl",
      "No traffic, DA, backlinks, conversion, or revenue claims",
    ],
  };
}

export function clusterIdsForDomain(
  domain: string,
  clusters: SampledQueryCluster[],
): QueryClusterId[] {
  return clusters
    .filter((c) => c.domains.some((d) => d.domain === domain))
    .map((c) => c.id);
}
