import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function CategoryFinderCard({
  title,
  description,
  href,
  ctaLabel,
  className,
}: {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)]",
        className,
      )}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/85">{description}</p>
      <ButtonLink href={href} variant="onDark" className="mt-4 w-full justify-center">
        {withSingleArrow(ctaLabel)}
      </ButtonLink>
    </Card>
  );
}

export function CategoryLinkList({
  title,
  items,
  className,
}: {
  title: string;
  items: Array<{
    href?: string;
    label: string;
    description?: string;
    icon?: LucideIcon;
  }>;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Card className={cn(className)} aria-labelledby={`${title}-heading`}>
      <h2
        id={`${title}-heading`}
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-3 space-y-3">
        {items.map((item) => {
          const Icon = item.icon ?? FileText;
          const body = (
            <span className="flex gap-2">
              <Icon
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <span>
                <span className="block text-sm font-medium text-[var(--sg-color-text)]">
                  {item.label}
                </span>
                {item.description ? (
                  <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </span>
                ) : null}
              </span>
            </span>
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block rounded-[var(--sg-radius-md)] hover:bg-[var(--sg-color-surface-muted)]"
                >
                  {body}
                </Link>
              ) : (
                <span className="block opacity-70">{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
