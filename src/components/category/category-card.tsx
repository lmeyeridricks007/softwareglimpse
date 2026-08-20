import type { ReactNode } from "react";
import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { CategoryIcon } from "@/components/category/category-icon";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  href: string;
  slug?: string;
  description?: string;
  productCount?: number;
  popularNames?: string[];
  icon?: ReactNode;
  featured?: boolean;
  className?: string;
};

export function CategoryCard({
  name,
  href,
  slug,
  description,
  productCount,
  popularNames = [],
  icon,
  featured = false,
  className,
}: Props) {
  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <Card
        variant="interactive"
        className={cn(
          "flex h-full flex-col items-start gap-3",
          featured ? "p-6" : "p-5",
        )}
      >
        {icon ??
          (slug ? (
            <CategoryIcon
              categoryId={slug}
              size={featured ? "lg" : "md"}
            />
          ) : (
            <span className="inline-flex size-11 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-sm font-bold text-[var(--sg-color-primary)]">
              {name.slice(0, 1)}
            </span>
          ))}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]",
              featured && "text-lg",
            )}
          >
            {name}
          </p>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
              {description}
            </p>
          ) : null}
          {productCount != null ? (
            <p className="mt-2 text-sm font-medium text-[var(--sg-color-text)]">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          ) : null}
          {popularNames.length > 0 ? (
            <p className="mt-2 line-clamp-1 text-xs text-[var(--sg-color-text-muted)]">
              {popularNames.join(" · ")}
            </p>
          ) : null}
        </div>
        <p className="text-sm font-semibold text-[var(--sg-color-primary)]">
          {withSingleArrow(`Explore ${name}`)}
        </p>
      </Card>
    </Link>
  );
}

/** @deprecated Prefer BestSoftwareCard on homepage — kept for other list pages. */
export function BestSoftwareListCard({
  title,
  href,
  description,
  countLabel,
  className,
}: {
  title: string;
  href: string;
  description?: string;
  countLabel?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <Card variant="interactive" className="flex h-full flex-col">
        <p className="text-[var(--sg-text-caption)] font-medium uppercase tracking-wide text-[var(--sg-color-primary)]">
          Best software
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
        <p className="mt-auto pt-4 text-sm font-medium text-[var(--sg-color-primary)]">
          {withSingleArrow(countLabel ?? "View full list")}
        </p>
      </Card>
    </Link>
  );
}
