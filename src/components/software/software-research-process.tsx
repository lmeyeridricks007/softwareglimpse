"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  Scale,
  Search,
} from "lucide-react";
import { useState } from "react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { cn } from "@/lib/cn";

export type ResearchSourceItem = {
  id: string;
  title: string;
  url?: string | null;
  checkedAt?: string | null;
  kindLabel?: string | null;
};

export type ResearchMeta = {
  lastChecked?: string | null;
  sourceCount: number;
  pricingChecked?: string | null;
  featuresChecked?: string | null;
  editorialStatus: string;
  methodologyVersion?: string | null;
  methodologyHref: string;
  handsOnTesting?: boolean;
};

type Props = {
  productName: string;
  research: ResearchMeta;
  sources?: ResearchSourceItem[];
  className?: string;
};

const STEPS = [
  {
    title: "Collect",
    description: "Gather product, pricing, and feature data from vendor and third-party sources.",
    Icon: Search,
  },
  {
    title: "Verify",
    description: "Cross-check claims against documentation and current list pricing.",
    Icon: FileSearch,
  },
  {
    title: "Score",
    description: "Score against our methodology criteria with documented rationale.",
    Icon: ClipboardCheck,
  },
  {
    title: "Editorial review",
    description: "Human editors approve scores and copy before publication.",
    Icon: CheckCircle2,
  },
] as const;

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-[var(--sg-color-text)]">
        {value}
      </dd>
    </div>
  );
}

export function SoftwareResearchProcess({
  productName,
  research,
  sources = [],
  className,
}: Props) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const lastChecked = formatDate(research.lastChecked);
  const pricingChecked = formatDate(research.pricingChecked);
  const featuresChecked = formatDate(research.featuresChecked);

  return (
    <div className={cn("space-y-12", className)}>
      <section
        id="evidence"
        aria-labelledby="evidence-heading"
        className="scroll-mt-28"
      >
        <h2
          id="evidence-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Research & evidence
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          How we recommended {productName} — dates, sources, and editorial status.
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lastChecked ? (
            <MetaStat label="Last checked" value={lastChecked} />
          ) : null}
          <MetaStat
            label="Sources reviewed"
            value={String(research.sourceCount)}
          />
          {pricingChecked ? (
            <MetaStat label="Pricing checked" value={pricingChecked} />
          ) : null}
          {featuresChecked ? (
            <MetaStat label="Features checked" value={featuresChecked} />
          ) : null}
          <MetaStat label="Editorial status" value={research.editorialStatus} />
          {research.methodologyVersion ? (
            <MetaStat
              label="Methodology version"
              value={research.methodologyVersion}
            />
          ) : null}
          {research.handsOnTesting ? (
            <MetaStat label="Hands-on testing" value="Yes" />
          ) : null}
        </dl>

        {sources.length > 0 ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setSourcesOpen((open) => !open)}
              aria-expanded={sourcesOpen}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)] hover:border-[var(--sg-color-border-strong)]"
            >
              <span>Sources ({sources.length})</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[var(--sg-color-text-muted)] transition-transform",
                  sourcesOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {sourcesOpen ? (
              <ul className="mt-2 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
                {sources.map((source) => (
                  <li key={source.id} className="px-4 py-3 text-sm">
                    {source.url ? (
                      <ExternalLink href={source.url} type="evidence-source">
                        {source.title}
                      </ExternalLink>
                    ) : (
                      <span className="font-medium text-[var(--sg-color-text)]">
                        {source.title}
                      </span>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      {[
                        source.kindLabel,
                        formatDate(source.checkedAt)
                          ? `Checked ${formatDate(source.checkedAt)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      <section
        id="methodology"
        aria-labelledby="methodology-heading"
        className="scroll-mt-28"
      >
        <h2
          id="methodology-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Our review process
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Every SoftwareGlimpse review follows the same four-step editorial
          workflow.
        </p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                  <step.Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-semibold text-[var(--sg-color-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {step.description}
                </p>
              </Card>
            </li>
          ))}
        </ol>

        <Link
          href={research.methodologyHref}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          <Scale className="size-4" aria-hidden />
          {withSingleArrow("Read our full methodology")}
        </Link>
      </section>
    </div>
  );
}
