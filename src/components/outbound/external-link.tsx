import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { OutboundLinkType } from "@/domain";
import { relForOutboundType } from "@/domain";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  /** Semantic type — drives rel. Never mark editorial as sponsored. */
  type?: OutboundLinkType;
  className?: string;
  /** Default true for research/evidence; set false to match site nav patterns. */
  openInNewTab?: boolean;
  showIcon?: boolean;
  untrusted?: boolean;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "rel" | "target" | "children" | "className"
>;

/**
 * Editorial / research outbound link.
 * Does NOT add rel=sponsored unless type is affiliate (prefer AffiliateLink).
 */
export function ExternalLink({
  href,
  children,
  type = "editorial-reference",
  className,
  openInNewTab = true,
  showIcon = true,
  untrusted = false,
  ...rest
}: Props) {
  if (type === "affiliate") {
    // Safety: commercial destinations must use AffiliateLink / SoftwareCta.
    return null;
  }

  const rel = relForOutboundType(type, { openInNewTab, untrusted });

  return (
    <a
      href={href}
      className={cn(
        "font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline",
        className,
      )}
      rel={rel.length ? rel.join(" ") : undefined}
      target={openInNewTab ? "_blank" : undefined}
      {...rest}
    >
      {children}
      {showIcon ? (
        <span className="ml-0.5 inline-block" aria-hidden>
          ↗
        </span>
      ) : null}
    </a>
  );
}
