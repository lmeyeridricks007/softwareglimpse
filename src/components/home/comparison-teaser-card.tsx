import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ComparisonTeaserCardProps = {
  href: string;
  leftName: string;
  rightName: string;
  leftLogo?: { src: string; alt: string } | null;
  rightLogo?: { src: string; alt: string } | null;
  summary: string;
  className?: string;
};

export function ComparisonTeaserCard({
  href,
  leftName,
  rightName,
  leftLogo,
  rightLogo,
  summary,
  className,
}: ComparisonTeaserCardProps) {
  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <Card variant="interactive" className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <ProductLogo name={leftName} logo={leftLogo} size="sm" />
            {leftName}
          </span>
          <span className="text-xs font-bold uppercase text-[var(--sg-color-text-muted)]">
            vs
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <ProductLogo name={rightName} logo={rightLogo} size="sm" />
            {rightName}
          </span>
        </div>
        <p className="mt-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
          {summary}
        </p>
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
          Compare
          <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
        </p>
      </Card>
    </Link>
  );
}
