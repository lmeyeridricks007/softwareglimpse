import Link from "next/link";
import type { ResearchSource } from "@/domain";
import { ResearchSourcesList } from "@/components/research/research-sources-list";
import { COMPANY_ROUTES } from "@/services/site-foundation/config";
import { cn } from "@/lib/cn";

export type ProvenanceSource = {
  id: string;
  title: string;
  url?: string | null;
  verifiedAt?: string | null;
  status?: ResearchSource["status"];
  sourceHealth?: ResearchSource["sourceHealth"];
  sourceType?: ResearchSource["sourceType"] | string | null;
};

type Props = {
  sources?: Array<ResearchSource | ProvenanceSource>;
  productName?: string;
  /** ISO pricing verification when present */
  pricingVerifiedAt?: string | null;
  /** ISO last research / data check */
  dataCheckedAt?: string | null;
  methodologyHref?: string;
  methodologyLabel?: string;
  className?: string;
  /** Cap visible source rows */
  maxSources?: number;
};

function formatDate(iso?: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toResearchSource(
  source: ResearchSource | ProvenanceSource,
): ResearchSource {
  if (
    typeof source === "object" &&
    source !== null &&
    "sourceType" in source &&
    "authority" in source
  ) {
    return source as ResearchSource;
  }
  return {
    id: source.id,
    title: source.title,
    url: source.url ?? undefined,
    verifiedAt: source.verifiedAt ?? undefined,
    status: source.status ?? "active",
    sourceHealth: source.sourceHealth,
    sourceType:
      (source.sourceType as ResearchSource["sourceType"] | undefined) ??
      "other",
    authority: "unknown",
    language: "en",
    domains: [],
    fieldsSupported: [],
  };
}

/**
 * Clean bottom-of-page provenance: Sources · Methodology · Data checked.
 * Omits empty sections; never invents sources or dates.
 */
export function EditorialProvenance({
  sources = [],
  productName,
  pricingVerifiedAt,
  dataCheckedAt,
  methodologyHref = COMPANY_ROUTES.methodology,
  methodologyLabel = "Editorial methodology",
  className,
  maxSources = 8,
}: Props) {
  const priced = formatDate(pricingVerifiedAt);
  const checked = formatDate(dataCheckedAt);
  const visibleSources = sources.slice(0, maxSources).map(toResearchSource);
  const hasSources = visibleSources.length > 0;

  if (!hasSources && !priced && !checked) {
    return (
      <aside
        className={cn(
          "mt-10 border-t border-[var(--sg-color-border)] pt-6 text-sm text-[var(--sg-color-text-muted)]",
          className,
        )}
        aria-label="Methodology"
      >
        <p>
          <Link
            href={methodologyHref}
            className="underline-offset-2 hover:underline"
          >
            {methodologyLabel}
          </Link>
          {" · "}
          <Link
            href={COMPANY_ROUTES.howWeReview}
            className="underline-offset-2 hover:underline"
          >
            How we review
          </Link>
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "mt-10 space-y-4 border-t border-[var(--sg-color-border)] pt-6",
        className,
      )}
      aria-label="Sources and methodology"
    >
      {hasSources ? (
        <ResearchSourcesList
          sources={visibleSources}
          productName={productName}
        />
      ) : null}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--sg-color-text-muted)]">
        <span>
          <Link
            href={methodologyHref}
            className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
          >
            {methodologyLabel}
          </Link>
        </span>
        {priced ? (
          <span>
            Pricing verified{" "}
            <time dateTime={pricingVerifiedAt!}>{priced}</time>
          </span>
        ) : null}
        {checked && checked !== priced ? (
          <span>
            Data checked <time dateTime={dataCheckedAt!}>{checked}</time>
          </span>
        ) : null}
      </div>
    </aside>
  );
}
