"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareHubPopularComparisons } from "@/components/software/hub/software-product-hub-shell";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import { cn } from "@/lib/cn";

type Props = {
  model: SoftwareReviewModel;
};

function categorize(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("plan")) {
    return "Pricing & plans";
  }
  if (q.includes("feature") || q.includes("email") || q.includes("integrat")) {
    return "Features";
  }
  if (q.includes("integrat")) return "Integrations";
  if (q.includes("security") || q.includes("gdpr") || q.includes("compliance")) {
    return "Security";
  }
  if (q.includes("import") || q.includes("setup") || q.includes("onboard")) {
    return "Implementation";
  }
  if (q.includes("support") || q.includes("training")) return "Support & training";
  return "General";
}

export function SoftwareHubFaqTab({ model }: Props) {
  const software = model.software;
  const items = model.faq;

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const cat = categorize(item.question);
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return ["All questions", ...counts.keys()];
  }, [items]);

  const [filter, setFilter] = useState("All questions");
  const [openId, setOpenId] = useState<string | null>(
    items[0] ? `faq-0` : null,
  );

  const filtered = items.filter((item) =>
    filter === "All questions" ? true : categorize(item.question) === filter,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Click a question to view the answer.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-[var(--sg-radius-pill)] px-3 py-1.5 text-sm",
                filter === cat
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-6 p-6 text-sm text-[var(--sg-color-text-muted)]">
            FAQ content is not available for {software.name} yet.
          </Card>
        ) : (
          <ul className="mt-6 space-y-3">
            {filtered.map((item, index) => {
              const id = `faq-${index}-${item.question.slice(0, 24)}`;
              const open = openId === id;
              return (
                <li key={id}>
                  <Card className="overflow-hidden p-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : id)}
                      className="flex w-full items-start gap-3 px-4 py-4 text-left"
                    >
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-semibold text-white">
                        Q
                      </span>
                      <span className="min-w-0 flex-1 font-medium text-[var(--sg-color-text)]">
                        {item.question}
                      </span>
                      <span
                        className="text-[var(--sg-color-text-muted)]"
                        aria-hidden
                      >
                        {open ? "▴" : "▾"}
                      </span>
                    </button>
                    {open ? (
                      <div className="border-t border-[var(--sg-color-border)] px-4 py-4 pl-[3.25rem] text-sm text-[var(--sg-color-text-muted)]">
                        <p className="whitespace-pre-line">{item.answer}</p>
                      </div>
                    ) : null}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        <Card className="mt-8 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30 p-5">
          <h3 className="font-semibold text-[var(--sg-color-text)]">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            We can help you decide whether {software.name} fits your team.
          </p>
          <ButtonLink href={COMPANY_ROUTES.contact} className="mt-4">
            Contact our team →
          </ButtonLink>
        </Card>

        <p className="mt-6 text-xs text-[var(--sg-color-text-muted)]">
          FAQ answers are based on verified research from official sources and
          are reviewed regularly for accuracy.
          {model.lastUpdated
            ? ` Last updated: ${model.lastUpdated.slice(0, 10)}.`
            : null}
        </p>
      </div>

      <aside className="space-y-5">
        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />
        <SoftwareHubPopularComparisons items={model.comparisonLinks} />
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Next steps
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href={softwareHubPath(software.slug, "features")}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Explore {software.name} features →
              </Link>
            </li>
            <li>
              <Link
                href={softwareHubPath(software.slug, "pricing")}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                See {software.name} pricing details →
              </Link>
            </li>
            <li>
              <Link
                href={softwareHubPath(software.slug, "alternatives")}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                View top {software.name} alternatives →
              </Link>
            </li>
            <li>
              <Link
                href={softwareHubPath(software.slug, "overview")}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Read our full review →
              </Link>
            </li>
            {model.finderHref ? (
              <li>
                <Link
                  href={model.finderHref}
                  className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Find your perfect CRM →
                </Link>
              </li>
            ) : null}
          </ul>
        </Card>
        <Card className="border-[var(--sg-color-success)]/20 bg-[var(--sg-color-success-soft)]/40 p-5">
          <Badge variant="success">Independent</Badge>
          <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
            Trusted, independent advice. Our recommendations are editorially
            independent and research-driven.
          </p>
          <Link
            href={LEGAL_ROUTES.editorialIndependence}
            className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Learn more about our process →
          </Link>
        </Card>
        {model.finderHref ? (
          <SoftwareHubFinderCta
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
      </aside>
    </div>
  );
}
