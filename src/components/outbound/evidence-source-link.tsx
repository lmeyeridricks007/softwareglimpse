import type { ReactNode } from "react";
import type { OutboundLinkType, ResearchSource } from "@/domain";
import { outboundTypeFromResearchSourceType } from "@/domain";
import { descriptiveSourceAnchor } from "@/services/outbound/resolve-product-links";
import { ExternalLink } from "./external-link";

type Props = {
  source: ResearchSource;
  productName?: string;
  className?: string;
  /** Override default descriptive anchor. */
  children?: ReactNode;
};

/**
 * Evidence/research source link — crawlable editorial, never sponsored.
 * Hides unavailable sources instead of falling back to affiliate URLs.
 */
export function EvidenceSourceLink({
  source,
  productName,
  className,
  children,
}: Props) {
  if (!source.url) return null;
  if (source.status === "rejected" || source.status === "archived") return null;
  if (source.sourceHealth === "unavailable") return null;
  if (source.sourceType === "affiliate-network") return null;

  const type: OutboundLinkType = outboundTypeFromResearchSourceType(
    source.sourceType,
  );
  if (type === "affiliate") return null;

  const label =
    children ?? descriptiveSourceAnchor(source, productName);

  return (
    <ExternalLink href={source.url} type={type} className={className}>
      {label}
    </ExternalLink>
  );
}
