"use client";

import { Check, ClipboardList } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const TRUST = [
  "Free to use",
  "No signup required",
  "Affiliate-independent",
  "Based on SoftwareGlimpse recommendations",
] as const;

type ExampleItem = { label: string; done: boolean };

type Props = {
  onStart: () => void;
  onSeeExample: () => void;
  className?: string;
  /** When the page shell already emits an SSR H1, pass `"none"`. */
  titleElement?: "h1" | "h2" | "none";
  /** Product noun for labels (default CRM). */
  productNoun?: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  readinessNote?: ReactNode;
  exampleTitle?: string;
  exampleUseCases?: ExampleItem[];
  exampleMustHave?: ExampleItem[];
  exampleNiceToHave?: ExampleItem[];
  exampleIntegrations?: ExampleItem[];
};

const CRM_DEFAULTS = {
  eyebrow: "CRM Requirements Builder",
  headline: "Build your CRM requirements",
  description:
    "Answer a few questions about your business, processes and priorities. We'll turn them into a structured CRM requirements profile you can use to evaluate vendors, compare products and build a shortlist.",
  exampleTitle: "Your CRM Requirements",
  exampleUseCases: [
    { label: "Lead management", done: true },
    { label: "Pipeline management", done: true },
    { label: "Relationship management", done: true },
  ],
  exampleMustHave: [
    { label: "Multiple pipelines", done: true },
    { label: "Workflow automation", done: true },
    { label: "Reporting", done: true },
  ],
  exampleNiceToHave: [
    { label: "Lead scoring", done: false },
    { label: "AI assistance", done: false },
  ],
  exampleIntegrations: [
    { label: "Microsoft 365", done: true },
    { label: "Accounting", done: true },
  ],
} as const;

export function RequirementsBuilderHero({
  onStart,
  onSeeExample,
  className,
  titleElement = "h1",
  productNoun = "CRM",
  eyebrow = CRM_DEFAULTS.eyebrow,
  headline = CRM_DEFAULTS.headline,
  description = CRM_DEFAULTS.description,
  readinessNote,
  exampleTitle = CRM_DEFAULTS.exampleTitle,
  exampleUseCases = [...CRM_DEFAULTS.exampleUseCases],
  exampleMustHave = [...CRM_DEFAULTS.exampleMustHave],
  exampleNiceToHave = [...CRM_DEFAULTS.exampleNiceToHave],
  exampleIntegrations = [...CRM_DEFAULTS.exampleIntegrations],
}: Props) {
  const TitleTag = titleElement === "h2" ? "h2" : "h1";
  const defaultReadiness =
    productNoun.toLowerCase() === "crm" ? (
      <>
        Not sure you&apos;re ready to specify requirements? Start with the{" "}
        <a
          href="/tools/crm-readiness-assessment/"
          className="font-medium text-[var(--sg-color-primary)]"
        >
          CRM Readiness Assessment
        </a>
        .
      </>
    ) : null;

  return (
    <header
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            <ClipboardList className="size-4" aria-hidden />
            {eyebrow}
          </p>
          {titleElement !== "none" ? (
            <TitleTag className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
              {headline}
            </TitleTag>
          ) : null}
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {description}
          </p>
          {readinessNote !== undefined ? (
            readinessNote ? (
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {readinessNote}
              </p>
            ) : null
          ) : defaultReadiness ? (
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {defaultReadiness}
            </p>
          ) : null}
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" size="lg" onClick={onStart}>
              Start building requirements
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={onSeeExample}
            >
              See example output
            </Button>
          </div>
        </div>

        <Card
          className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6"
          aria-label="Example requirements profile preview"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {exampleTitle}
            </p>
            <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--sg-color-text-muted)]">
              Example profile
            </span>
          </div>

          <ExampleBlock title="Use cases" items={exampleUseCases} />
          <ExampleBlock title="Must have" items={exampleMustHave} />
          <ExampleBlock title="Nice to have" items={exampleNiceToHave} />
          <ExampleBlock title="Integrations" items={exampleIntegrations} />
          <p className="mt-4 border-t border-[var(--sg-color-border)] pt-3 text-sm text-[var(--sg-color-text-muted)]">
            Budget{" "}
            <span className="font-semibold text-[var(--sg-color-navy)]">
              €30–€60/user/month
            </span>
          </p>
        </Card>
      </div>
    </header>
  );
}

function ExampleBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; done: boolean }>;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {title}
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-sm text-[var(--sg-color-text)]"
          >
            {item.done ? (
              <Check
                className="size-3.5 text-[var(--sg-color-success)]"
                aria-hidden
              />
            ) : (
              <span
                className="size-3.5 rounded-full border border-[var(--sg-color-border)]"
                aria-hidden
              />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
