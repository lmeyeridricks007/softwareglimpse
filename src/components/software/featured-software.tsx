import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { FeatureChecklist } from "@/components/software/software-card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

type FeaturedSoftwareProps = {
  name: string;
  href: string;
  logo?: { src: string; alt: string } | null;
  summary?: string;
  rating?: number | null;
  ratingApproved?: boolean;
  strengths?: string[];
  badge?: string;
  className?: string;
};

export function FeaturedSoftware({
  name,
  href,
  logo,
  summary,
  rating,
  ratingApproved,
  strengths = [],
  badge = "Featured",
  className,
}: FeaturedSoftwareProps) {
  return (
    <Card variant="highlighted" className={cn("relative", className)}>
      {badge ? (
        <Badge variant="editorial-choice" className="mb-3">
          {badge}
        </Badge>
      ) : null}
      <div className="flex items-start gap-3">
        <ProductLogo name={name} logo={logo} size="lg" />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {ratingApproved && rating != null ? (
            <Rating score={rating} className="mt-1" />
          ) : null}
        </div>
      </div>
      {summary ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">{summary}</p>
      ) : null}
      <FeatureChecklist items={strengths.slice(0, 4)} className="mt-4" />
      <ButtonLink href={href} className="mt-5 w-full" size="md">
        View full review
      </ButtonLink>
    </Card>
  );
}

type ComparisonPreviewProps = {
  title: string;
  href: string;
  products: Array<{
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  rows: Array<{ label: string; values: string[] }>;
  className?: string;
};

export function ComparisonPreview({
  title,
  href,
  products,
  rows,
  className,
}: ComparisonPreviewProps) {
  return (
    <Card variant="default" className={cn("overflow-hidden p-0", className)}>
      <div className="border-b border-[var(--sg-color-border)] px-4 py-3">
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sg-color-border)]">
              <th className="px-4 py-2 font-medium text-[var(--sg-color-text-muted)]">
                Criterion
              </th>
              {products.map((p) => (
                <th key={p.name} className="px-3 py-2 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    <span className="hidden sm:inline">{p.name}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[var(--sg-color-border)] last:border-0"
              >
                <td className="px-4 py-2 text-[var(--sg-color-text-muted)]">
                  {row.label}
                </td>
                {row.values.map((v, i) => (
                  <td key={`${row.label}-${i}`} className="px-3 py-2 font-medium tabular-nums">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--sg-color-border)] px-4 py-3">
        <Link
          href={href}
          className="text-sm font-medium text-[var(--sg-color-primary)] hover:underline"
        >
          Open full comparison
        </Link>
      </div>
    </Card>
  );
}
