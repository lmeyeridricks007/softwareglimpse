import type {
  OutboundLink,
  ProductOfficialLinks,
  ResearchSource,
  Software,
} from "@/domain";
import { outboundTypeFromResearchSourceType } from "@/domain";

function domainOf(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function firstActiveUrl(
  sources: ResearchSource[],
  types: ResearchSource["sourceType"][],
): ResearchSource | undefined {
  return sources.find(
    (s) =>
      s.url &&
      s.status !== "rejected" &&
      s.status !== "archived" &&
      s.sourceHealth !== "unavailable" &&
      types.includes(s.sourceType),
  );
}

/**
 * Derive official/research destinations from website + research sources.
 * Never returns affiliate tracking URLs — those resolve via commercial CTA.
 */
export function resolveProductOfficialLinks(
  software: Software,
): ProductOfficialLinks {
  const sources = software.sources ?? [];
  const pricing = firstActiveUrl(sources, [
    "official-pricing-page",
    "pricing-page",
  ]);
  const documentation = firstActiveUrl(sources, [
    "official-documentation",
    "docs",
  ]);
  const helpCenter = firstActiveUrl(sources, ["official-help-center"]);
  const security = firstActiveUrl(sources, ["official-security-page"]);
  const productPage = firstActiveUrl(sources, [
    "official-product-page",
    "vendor",
  ]);

  return {
    officialWebsite: software.website ?? productPage?.url,
    pricing: pricing?.url,
    documentation: documentation?.url,
    helpCenter: helpCenter?.url,
    security: security?.url,
    support: helpCenter?.url,
  };
}

/** Public evidence outbound links suitable for UI (excludes affiliate-network). */
export function evidenceOutboundLinks(
  software: Software,
): OutboundLink[] {
  const links: OutboundLink[] = [];
  for (const source of software.sources ?? []) {
    if (!source.url) continue;
    if (source.status === "rejected" || source.status === "archived") continue;
    if (source.sourceHealth === "unavailable") continue;
    if (source.sourceType === "affiliate-network") continue;
    if (source.sourceType === "fixture") continue;

    links.push({
      url: source.url,
      type: outboundTypeFromResearchSourceType(source.sourceType),
      domain: source.domain ?? domainOf(source.url),
      title: source.title,
      softwareId: software.slug,
      sourceId: source.id,
      verifiedAt: source.verifiedAt ?? source.retrievedAt,
      authorityTier: source.authorityTier,
    });
  }
  return links;
}

export function descriptiveSourceAnchor(
  source: Pick<ResearchSource, "title" | "sourceType" | "publisher" | "domain">,
  productName?: string,
): string {
  if (source.title?.trim()) return source.title.trim();
  const vendor = productName ?? source.publisher ?? source.domain ?? "Vendor";
  switch (source.sourceType) {
    case "official-pricing-page":
    case "pricing-page":
      return `${vendor} pricing documentation`;
    case "official-documentation":
    case "docs":
      return `${vendor} product documentation`;
    case "official-help-center":
      return `${vendor} help center`;
    case "official-security-page":
      return `${vendor} security documentation`;
    case "official-product-page":
    case "vendor":
      return `Official ${vendor} website`;
    default:
      return source.publisher
        ? `${source.publisher} reference`
        : "View source";
  }
}
