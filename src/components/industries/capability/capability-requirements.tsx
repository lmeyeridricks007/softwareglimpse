import Link from "next/link";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { cn } from "@/lib/cn";
import type { IndustryCapabilityRequirement } from "@/domain";

type Props = {
  title?: string;
  subtitle?: string;
  requirements: IndustryCapabilityRequirement[];
  className?: string;
};

export function CapabilityRequirements({
  title = "What to look for",
  subtitle = "Use these requirements to evaluate products against your workflow — not popularity alone.",
  requirements,
  className,
}: Props) {
  if (requirements.length === 0) return null;

  return (
    <section
      id="requirements"
      aria-labelledby="requirements-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="requirements-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {subtitle}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {requirements.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          const href =
            item.href ?? (item.featureSlug ? "#matrix" : undefined);
          const requirementDetail = Boolean(
            href && href.includes("/requirements/"),
          );
          const featureDetail = Boolean(href && href.includes("/features/"));
          const content = (
            <>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index),
                  )}
                >
                  {createElement(Icon, {
                    className: "size-4",
                    "aria-hidden": true,
                  })}
                </span>
                <Badge
                  variant={item.priority === "core" ? "primary" : "neutral"}
                >
                  {item.priority === "core" ? "Core" : "Advanced"}
                </Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {item.name}
              </h3>
              <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {href ? (
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {withSingleArrow(
                    requirementDetail
                      ? "Explore requirement"
                      : featureDetail
                        ? "Explore feature"
                        : "View in matrix",
                  )}
                </span>
              ) : null}
            </>
          );

          return (
            <li key={item.id}>
              {href ? (
                <Link href={href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-4"
                  >
                    {content}
                  </Card>
                </Link>
              ) : (
                <Card className="flex h-full flex-col p-4">{content}</Card>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type SplitProps = {
  title?: string;
  essential: IndustryCapabilityRequirement[];
  advanced: IndustryCapabilityRequirement[];
  className?: string;
};

export function CapabilityEssentialAdvanced({
  title = "Essential vs advanced capabilities",
  essential,
  advanced,
  className,
}: SplitProps) {
  if (essential.length === 0 && advanced.length === 0) return null;

  return (
    <section
      aria-labelledby="essential-advanced-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="essential-advanced-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            Essential
          </p>
          <ul className="mt-3 space-y-2">
            {essential.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <span className="mt-0.5 text-[var(--sg-color-success)]" aria-hidden>
                  ✓
                </span>
                <span>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                  <span className="block text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Advanced
          </p>
          <ul className="mt-3 space-y-2">
            {advanced.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <span className="mt-0.5 text-[var(--sg-color-primary)]" aria-hidden>
                  ✓
                </span>
                <span>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                  <span className="block text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
