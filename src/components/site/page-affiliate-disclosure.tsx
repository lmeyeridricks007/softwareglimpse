import Link from "next/link";
import { LEGAL_ROUTES } from "@/services/site-foundation/config";

/** Concise page-level affiliate disclosure for commercial pages. */
export function PageAffiliateDisclosure({
  className = "text-xs text-[var(--color-fg-muted)]",
}: {
  className?: string;
}) {
  return (
    <p className={className}>
      Some links may be affiliate links — we may earn a commission at no extra
      cost to you. Rankings and scores are never based on commission.{" "}
      <Link
        href={LEGAL_ROUTES.affiliateDisclosure}
        className="underline underline-offset-2"
      >
        Affiliate disclosure
      </Link>
    </p>
  );
}
