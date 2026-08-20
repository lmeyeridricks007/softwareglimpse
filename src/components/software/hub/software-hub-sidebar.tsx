import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import type { ReviewQuickFact } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";

type Props = {
  facts: ReviewQuickFact[];
  productSlug: string;
  productName: string;
  profileHref?: string;
};

export function SoftwareHubQuickFacts({
  facts,
  productSlug,
  productName,
  profileHref,
}: Props) {
  const href = profileHref ?? softwareHubPath(productSlug, "overview");
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
        Quick facts
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        {facts.slice(0, 6).map((fact) => (
          <div
            key={`${fact.label}-${fact.value}`}
            className="flex items-start justify-between gap-3"
          >
            <dt className="text-[var(--sg-color-text-muted)]">{fact.label}</dt>
            <dd className="max-w-[58%] text-right font-medium text-[var(--sg-color-text)]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        View full {productName} profile →
      </Link>
    </Card>
  );
}

type FinderProps = {
  title?: string;
  description?: string;
  href: string;
  ctaLabel?: string;
};

export function SoftwareHubFinderCta({
  title = "Not sure which software is right?",
  description = "Answer a few questions and we will match options to your requirements.",
  href,
  ctaLabel = "Find software →",
}: FinderProps) {
  return (
    <Card
      variant="highlighted"
      className="bg-[var(--sg-color-primary-soft)]/50 p-5"
    >
      <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        {description}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
        <li className="flex gap-2">
          <span className="text-[var(--sg-color-success)]" aria-hidden>
            ✓
          </span>
          Takes about 2 minutes
        </li>
        <li className="flex gap-2">
          <span className="text-[var(--sg-color-success)]" aria-hidden>
            ✓
          </span>
          100% free
        </li>
        <li className="flex gap-2">
          <span className="text-[var(--sg-color-success)]" aria-hidden>
            ✓
          </span>
          Based on requirements
        </li>
      </ul>
      <ButtonLink href={href} className="mt-4 w-full" size="md">
        {ctaLabel}
      </ButtonLink>
    </Card>
  );
}
