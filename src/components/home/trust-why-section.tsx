import Link from "next/link";
import {
  FlaskConical,
  GitCompareArrows,
  RefreshCw,
  Scale,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

const CARDS = [
  {
    title: "Collect",
    body: "We verify pricing, features, and product information before they shape recommendations.",
    Icon: FlaskConical,
  },
  {
    title: "Score",
    body: "Products are assessed with category-specific methodology — not affiliate incentives.",
    Icon: Scale,
  },
  {
    title: "Compare",
    body: "Comparisons use the same evidence and criteria for every product in the pair.",
    Icon: GitCompareArrows,
  },
  {
    title: "Refresh",
    body: "Coverage is monitored and updated when important product information changes.",
    Icon: RefreshCw,
  },
] as const;

export type TrustMetric = {
  label: string;
  value: string;
};

type Props = {
  metrics?: TrustMetric[];
  className?: string;
};

export function TrustWhySection({ metrics = [], className }: Props) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight">
          Why trust SoftwareGlimpse?
        </h2>
        <p className="mt-2 text-[var(--sg-color-text-muted)]">
          We separate software research from commercial relationships so you can
          decide with clearer evidence.
        </p>
      </div>

      {metrics.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <li
              key={m.label}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4 shadow-[var(--sg-shadow-sm)]"
            >
              <p className="text-2xl font-bold text-[var(--sg-color-primary)]">
                {m.value}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ title, body, Icon }) => (
          <li key={title}>
            <Card className="h-full p-5">
              <Icon
                className="size-6 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {body}
              </p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={COMPANY_ROUTES.methodology}>
          Read our methodology
        </ButtonLink>
        <ButtonLink href={COMPANY_ROUTES.howWeReview} variant="outline">
          How we review software
        </ButtonLink>
        <Link
          href={COMPANY_ROUTES.about}
          className="inline-flex items-center text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          About SoftwareGlimpse
        </Link>
      </div>
    </div>
  );
}
