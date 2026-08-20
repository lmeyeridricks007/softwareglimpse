import Link from "next/link";
import {
  ArrowRight,
  CheckSquare,
  FileText,
  Layers,
  Target,
  Wrench,
} from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchResultClick } from "@/components/search/search-result-click";
import type { ScoredSearchHit } from "@/services/search/types";
import { cn } from "@/lib/cn";

type CardProps = {
  hit: ScoredSearchHit;
  position: number;
  query: string;
  featured?: boolean;
};

function TypeIcon({ type }: { type: string }) {
  const className = "size-4";
  switch (type) {
    case "TOOL":
      return <Wrench className={className} aria-hidden />;
    case "RESOURCE":
      return <FileText className={className} aria-hidden />;
    case "FEATURE":
      return <Layers className={className} aria-hidden />;
    case "REQUIREMENT":
      return <CheckSquare className={className} aria-hidden />;
    case "USE_CASE":
    case "CAPABILITY":
      return <Target className={className} aria-hidden />;
    default:
      return <FileText className={className} aria-hidden />;
  }
}

export function FeaturedEntityCard({ hit, position, query }: CardProps) {
  const doc = hit.document;
  return (
    <Card variant="highlighted" as="article" className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {doc.logo || doc.type === "SOFTWARE" ? (
          <ProductLogo name={doc.title} logo={doc.logo} size="lg" />
        ) : (
          <span className="inline-flex size-14 items-center justify-center rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
            <TypeIcon type={doc.type} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{doc.badge ?? doc.type}</Badge>
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
            <SearchResultClick
              href={doc.canonicalUrl}
              query={query}
              resultType={doc.type}
              position={position}
              className="hover:text-[var(--sg-color-primary)]"
            >
              {doc.title}
            </SearchResultClick>
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {doc.summary}
          </p>
          {doc.bestFor ? (
            <p className="mt-3 text-sm">
              <span className="font-semibold text-[var(--sg-color-text)]">
                Best for
              </span>
              <span className="mt-0.5 block text-[var(--sg-color-text-muted)]">
                {doc.bestFor}
              </span>
            </p>
          ) : null}
          {doc.pricingTeaser ? (
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {doc.pricingTeaser}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href={doc.canonicalUrl} size="sm">
              {doc.type === "SOFTWARE"
                ? "Read review"
                : doc.type === "TOOL"
                  ? doc.toolMeta?.ctaLabel ?? "Start tool"
                  : "View"}
            </ButtonLink>
            {doc.type === "SOFTWARE" ? (
              <>
                <ButtonLink
                  href={`/software/${doc.slug}/pricing/`}
                  variant="outline"
                  size="sm"
                >
                  Pricing
                </ButtonLink>
                <ButtonLink
                  href={`/compare/build/?a=${doc.slug}`}
                  variant="outline"
                  size="sm"
                >
                  Compare
                </ButtonLink>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SearchResultCard({ hit, position, query }: CardProps) {
  const doc = hit.document;

  if (doc.type === "SOFTWARE") {
    return (
      <Card variant="interactive" as="article" className="p-4">
        <div className="flex gap-3">
          <ProductLogo name={doc.title} logo={doc.logo} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {doc.badge ?? "SOFTWARE"}
            </p>
            <h3 className="mt-0.5 text-base font-semibold">
              <SearchResultClick
                href={doc.canonicalUrl}
                query={query}
                resultType={doc.type}
                position={position}
              >
                {doc.title}
              </SearchResultClick>
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
              {doc.summary}
            </p>
            {doc.bestFor ? (
              <p className="mt-2 text-sm">
                <span className="font-medium">Best for: </span>
                <span className="text-[var(--sg-color-text-muted)]">
                  {doc.bestFor}
                </span>
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={doc.canonicalUrl}
                className="text-sm font-medium text-[var(--sg-color-primary)]"
              >
                View review →
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (doc.type === "COMPARISON") {
    return (
      <Card variant="interactive" as="article" className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Comparison
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ProductLogo name="A" logo={doc.logo} size="sm" />
          <span className="text-xs font-bold uppercase text-[var(--sg-color-text-muted)]">
            vs
          </span>
          <ProductLogo name="B" logo={doc.logoB} size="sm" />
        </div>
        <h3 className="mt-2 text-base font-semibold">
          <SearchResultClick
            href={doc.canonicalUrl}
            query={query}
            resultType={doc.type}
            position={position}
          >
            {doc.title}
          </SearchResultClick>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
          {doc.summary}
        </p>
        {doc.verdict ? (
          <p className="mt-2 text-sm">
            <span className="font-medium">Verdict: </span>
            <span className="text-[var(--sg-color-text-muted)]">
              {doc.verdict}
            </span>
          </p>
        ) : null}
        <Link
          href={doc.canonicalUrl}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)]"
        >
          View comparison <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </Card>
    );
  }

  if (doc.type === "TOOL") {
    return (
      <Card
        variant="interactive"
        as="article"
        className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/40 p-4"
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] text-white">
            <Wrench className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              Tool
            </p>
            <h3 className="mt-0.5 text-base font-semibold">
              <SearchResultClick
                href={doc.canonicalUrl}
                query={query}
                resultType={doc.type}
                position={position}
              >
                {doc.title}
              </SearchResultClick>
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
              {doc.summary}
            </p>
            <p className="mt-2 text-xs font-medium text-[var(--sg-color-text-muted)]">
              Free · No signup
            </p>
            <ButtonLink href={doc.canonicalUrl} size="sm" className="mt-3">
              {doc.toolMeta?.ctaLabel ?? "Start tool"} →
            </ButtonLink>
          </div>
        </div>
      </Card>
    );
  }

  if (doc.type === "RESOURCE") {
    return (
      <Card variant="interactive" as="article" className="p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]">
            <FileText className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {doc.badge ?? "RESOURCE"}
            </p>
            <h3 className="mt-0.5 text-base font-semibold">
              <SearchResultClick
                href={doc.canonicalUrl}
                query={query}
                resultType={doc.type}
                position={position}
              >
                {doc.title}
              </SearchResultClick>
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
              {doc.summary}
            </p>
            {doc.resourceFormats?.length ? (
              <p className="mt-2 text-xs font-medium text-[var(--sg-color-text-muted)]">
                {doc.resourceFormats.join(" + ")}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink href={doc.canonicalUrl} variant="outline" size="sm">
                Preview
              </ButtonLink>
              <ButtonLink href={doc.canonicalUrl} size="sm">
                Download
              </ButtonLink>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="interactive" as="article" className="p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
            doc.type === "FEATURE"
              ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
              : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
          )}
        >
          <TypeIcon type={doc.type} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {doc.badge ?? doc.type.replaceAll("_", " ")}
          </p>
          <h3 className="mt-0.5 text-base font-semibold">
            <SearchResultClick
              href={doc.canonicalUrl}
              query={query}
              resultType={doc.type}
              position={position}
            >
              {doc.title}
            </SearchResultClick>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
            {doc.summary}
          </p>
          {doc.readingMinutes ? (
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              {doc.readingMinutes} min read
            </p>
          ) : null}
          <Link
            href={doc.canonicalUrl}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)]"
          >
            {doc.type === "GUIDE"
              ? "Read guide"
              : doc.type === "FEATURE"
                ? "Explore feature"
                : doc.type === "REQUIREMENT"
                  ? "Explore requirement"
                  : "View"}{" "}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  );
}
