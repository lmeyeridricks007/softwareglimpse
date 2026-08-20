import Link from "next/link";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShareComparisonButton } from "@/components/comparison/share-comparison-button";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  summary?: string;
  lastUpdated?: string;
  provisional?: boolean;
  className?: string;
};

export function ComparisonHero({
  title,
  summary,
  lastUpdated,
  provisional = false,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-text)]">
          {title}
        </h1>
        {summary ? (
          <p className="mt-3 max-w-3xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--sg-color-text-muted)]">
          {lastUpdated ? (
            <span>Last updated {lastUpdated.slice(0, 10)}</span>
          ) : null}
          <Badge variant={provisional ? "warning" : "primary"}>
            {provisional ? "Coverage in progress" : "Independent comparison"}
          </Badge>
          <Link
            href={COMPANY_ROUTES.methodology}
            className="inline-flex items-center gap-1 font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            <Info className="size-3.5" aria-hidden />
            How we compare
          </Link>
        </div>
      </div>
      <ShareComparisonButton title={title} />
    </header>
  );
}
