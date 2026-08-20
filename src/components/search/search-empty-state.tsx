"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { trackSearchEvent } from "@/services/search/analytics";

type Props = {
  query: string;
};

const STARTING_POINTS = [
  { href: "/categories/crm/", label: "CRM Software" },
  { href: "/tools/crm-finder/", label: "CRM Finder" },
  { href: "/best/crm-software/", label: "Best CRM Software" },
  { href: "/guides/", label: "CRM Guides" },
];

export function SearchEmptyState({ query }: Props) {
  useEffect(() => {
    trackSearchEvent("search_zero_results", { query });
  }, [query]);

  return (
    <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 sm:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        No results for “{query}”
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">Try:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
        <li>Check spelling</li>
        <li>Search a software name</li>
        <li>Search a category such as CRM</li>
        <li>Search a need such as workflow automation</li>
      </ul>

      <p className="mt-6 text-sm font-semibold text-[var(--sg-color-text)]">
        Popular starting points
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {STARTING_POINTS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] px-3 py-1.5 text-sm hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Can&apos;t find something?
        </p>
        <ButtonLink href="/company/contact/" variant="outline" size="sm">
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
