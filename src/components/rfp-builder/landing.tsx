import { Check, FileText } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const TRUST = [
  "Free to use",
  "No signup required",
  "Reuses your CRM requirements",
  "Vendor-neutral structure",
  "No invented requirements",
] as const;

export function CrmRfpBuilderHero({ className }: { className?: string }) {
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
            <FileText className="size-4" aria-hidden />
            CRM procurement tool
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            CRM RFP / Vendor Brief Builder
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Turn your CRM requirements into a structured brief every shortlisted
            vendor can answer consistently.
          </p>
          <p className="mt-3 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Create a lightweight vendor brief or a formal CRM RFP covering
            scope, requirements, integrations, implementation, security and
            pricing — then export it as PDF, Excel or Markdown.
          </p>
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
            <ButtonLink href="#rfp-workspace" size="lg">
              Build Vendor Brief
            </ButtonLink>
            <ButtonLink href="#rfp-workspace" size="lg" variant="outline">
              Create Formal RFP
            </ButtonLink>
          </div>
        </div>

        <Card
          className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6"
          aria-hidden
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Package preview
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Mode</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Vendor Brief
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Requirements</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Your IDs preserved
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Exports</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                PDF · Excel · Markdown
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Next</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Vendor Scorecard
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </header>
  );
}

export const CRM_RFP_FAQ_ITEMS = [
  {
    question: "Do I need a formal RFP for every CRM purchase?",
    answer:
      "No. Most smaller CRM purchases do not need a full RFP. Start with a Vendor Brief unless your procurement process requires more structure, security review or formal response rules.",
  },
  {
    question: "Does this tool invent requirements or pricing?",
    answer:
      "No. Every statement must come from what you enter, import from your Requirements Builder profile, or explicitly select from labelled templates. Blank optional fields are omitted.",
  },
  {
    question: "How is this different from the Vendor Scorecard?",
    answer:
      "The RFP Builder asks what vendors must tell you. The Vendor Scorecard asks how well each vendor performed against your criteria after responses and demos.",
  },
  {
    question: "Where is my draft stored?",
    answer:
      "In localStorage on this device (sg-crm-rfp-brief-v1). Requirement text and commercial figures are not sent to analytics by default.",
  },
];

export function CrmRfpBuilderFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        FAQ
      </h2>
      <dl className="mt-6 space-y-4">
        {CRM_RFP_FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-[var(--sg-color-navy)]">
              {item.question}
            </dt>
            <dd className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CrmRfpBuilderEducation() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Do you actually need an RFP?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Use this simple guide — then switch mode in the builder if needed.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Likely Vendor Brief
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            <li>Small team</li>
            <li>Simple requirements</li>
            <li>Few integrations</li>
            <li>2–3 vendors</li>
            <li>Self-service product</li>
          </ul>
          <ButtonLink href="#rfp-workspace" className="mt-4" variant="secondary">
            Build Vendor Brief
          </ButtonLink>
        </div>
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Likely Formal RFP
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            <li>Large user base</li>
            <li>Multiple departments</li>
            <li>Formal procurement</li>
            <li>Complex migration / security review</li>
            <li>High implementation spend · many integrations</li>
          </ul>
          <ButtonLink href="#rfp-workspace" className="mt-4">
            Create Formal RFP
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          How this fits the CRM buying workflow
        </h3>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Readiness Assessment → Requirements Builder → RFP Builder → Vendor
          Responses → Vendor Scorecard → Decision Matrix → Cost / ROI → Business Case
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-readiness-assessment/">
            Readiness Assessment
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-requirements-builder/">
            Requirements Builder
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-finder/">
            CRM Finder
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-vendor-scorecard/">
            Vendor Scorecard
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/resources/crm-comparison-worksheet/">
            Decision Matrix
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-cost-calculator/">
            Cost Calculator
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/resources/crm-rfp-template/">
            Static RFP Template
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/guides/how-to-choose-crm/">
            How to choose CRM
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/guides/crm-selection-process/">
            CRM selection process
          </Link>
          <Link className="text-[var(--sg-color-primary)] underline" href="/guides/crm-requirements-guide/">
            CRM requirements guide
          </Link>
        </div>
      </div>
    </section>
  );
}
