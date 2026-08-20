import { Check, Layers } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const TRUST = [
  "Based on published vendor plan information",
  "Requirements-based recommendation",
  "Pricing assumptions shown",
  "No invented match scores",
] as const;

export function CrmPlanSelectorHero({ className }: { className?: string }) {
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
            <Layers className="size-4" aria-hidden />
            CRM buying tool
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            Which CRM plan do you actually need?
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Choose a CRM and tell us how your team will use it. We&apos;ll
            identify the lowest plan that meets your requirements, explain what
            forces an upgrade, and estimate what you&apos;ll actually pay.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#plan-selector-workspace" size="lg">
              Find my plan
            </ButtonLink>
            <ButtonLink href="/compare/" size="lg" variant="outline">
              Compare CRM software
            </ButtonLink>
          </div>
        </div>

        <Card
          className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6"
          aria-hidden
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Your requirements
          </p>
          <ol className="mt-4 space-y-0 text-sm">
            {[
              { name: "Starter", state: "pass" as const },
              { name: "Professional", state: "recommended" as const },
              { name: "Enterprise", state: "optional" as const },
            ].map((tier, i) => (
              <li key={tier.name} className="relative pl-6">
                {i < 2 ? (
                  <span
                    className="absolute top-5 left-[0.55rem] h-[calc(100%-0.25rem)] w-px bg-[var(--sg-color-border)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "absolute top-1.5 left-0 size-2.5 rounded-full",
                    tier.state === "recommended"
                      ? "bg-[var(--sg-color-success)] ring-4 ring-[var(--sg-color-success)]/20"
                      : "bg-[var(--sg-color-border)]",
                  )}
                />
                <div
                  className={cn(
                    "rounded-[var(--sg-radius-md)] px-3 py-2",
                    tier.state === "recommended"
                      ? "border border-[var(--sg-color-success)]/40 bg-[var(--sg-color-success)]/5"
                      : "",
                  )}
                >
                  <p className="font-medium text-[var(--sg-color-navy)]">
                    {tier.name}
                    {tier.state === "recommended" ? (
                      <span className="ml-2 text-xs font-semibold text-[var(--sg-color-success)]">
                        ← Recommended
                      </span>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
            Lowest plan meeting all must-haves
          </p>
        </Card>
      </div>
    </header>
  );
}

export const CRM_PLAN_SELECTOR_FAQ = [
  {
    question: "How do I choose the right CRM plan?",
    answer:
      "List must-have capabilities and expected seats, then pick the lowest plan that covers those must-haves and published limits. Nice-to-haves should not automatically force an upgrade.",
  },
  {
    question: "Should I pay monthly or annually?",
    answer:
      "Annual billing is often cheaper per month when the vendor publishes both rates. The Plan Selector shows the billing assumption it used so you can compare like-for-like.",
  },
  {
    question: "Can different users have different CRM seat types?",
    answer:
      "Some vendors offer light or view-only seats. We only surface seat distinctions when research verifies them — we do not invent cheaper seat economics.",
  },
  {
    question: "When is an enterprise CRM plan worth it?",
    answer:
      "When you have hard gates such as SSO, advanced permissions, audit logs, or sandbox environments that are only available on higher tiers according to published plan matrices.",
  },
  {
    question: "Why do CRM prices increase as teams grow?",
    answer:
      "Most CRM pricing is per seat. Growth can also push you past seat caps or usage limits that force a higher edition — not just more seats on the same plan.",
  },
  {
    question: "What CRM features usually require higher plans?",
    answer:
      "Forecasting, advanced automation, email sequences, SSO, and fine-grained permissions commonly sit above entry tiers. Exact gates depend on the vendor’s published matrix.",
  },
];

export function CrmPlanSelectorFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        FAQ
      </h2>
      <dl className="mt-6 space-y-4">
        {CRM_PLAN_SELECTOR_FAQ.map((item) => (
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

export function CrmPlanSelectorEducation() {
  const sections = [
    {
      id: "how-it-works",
      title: "How the CRM Plan Selector works",
      body: "You choose a CRM, set team size, mark requirements as must-have / nice-to-have / don’t need, and add growth context. We evaluate each published plan against must-haves and seat limits, then recommend the lowest qualifying tier — with drivers, tradeoffs, and unknowns made explicit.",
    },
    {
      id: "why-hard",
      title: "Why CRM plan selection is difficult",
      body: "Feature marketing pages rarely spell out which edition unlocks each capability, which limits apply, or when add-ons are required. Buyers often overbuy the top tier “to be safe” or underbuy and hit walls mid-implementation.",
    },
    {
      id: "features-vs-limits",
      title: "Features vs limits",
      body: "A feature can exist on a plan while volume caps (seats, workflows, pipelines) make that plan unsuitable. The selector treats published limits as hard gates when research includes them.",
    },
    {
      id: "seat-pricing",
      title: "How seat pricing affects CRM costs",
      body: "Per-seat list prices multiply quickly. Seat minimums, annual vs monthly commits, and light/read-only seats (when published) change the real bill more than the headline per-user number.",
    },
    {
      id: "when-upgrade",
      title: "When a higher CRM tier is worth paying for",
      body: "Upgrade when a must-have is missing, a published limit is exceeded, or security/admin gates (SSO, audit logs, advanced permissions) require it. Optional nice-to-haves should be priced as tradeoffs, not automatic upgrades.",
    },
    {
      id: "mistakes",
      title: "Common CRM plan-selection mistakes",
      body: "Treating unknown coverage as “not included,” ignoring seat caps, selecting Enterprise for unused controls, and comparing monthly cash to annual list prices without stating the assumption.",
    },
  ];

  return (
    <section className="border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-12">
      <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
        {sections.map((s) => (
          <div key={s.id} id={s.id}>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
              {s.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiPlanSelectorHero({ className }: { className?: string }) {
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
            <Layers className="size-4" aria-hidden />
            Sales intelligence tool · Partial coverage
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            Which sales intelligence plan do you actually need?
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Choose a product with a verified seat plan matrix. We recommend the
            lowest qualifying tier — and leave credit packs / custom quotes as
            unknown instead of inventing dollar totals.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#plan-selector-workspace" size="lg">
              Find my plan
            </ButtonLink>
            <ButtonLink
              href="/tools/sales-intelligence-finder/"
              size="lg"
              variant="outline"
            >
              SI Finder
            </ButtonLink>
          </div>
        </div>

        <Card
          className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6"
          aria-hidden
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Coverage honesty
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--sg-color-text-muted)]">
            <li>Seat ladders with verified matrices → selectable</li>
            <li>Credit packs / usage pricing → quote required</li>
            <li>Contact-sales tiers → never treated as $0</li>
          </ul>
        </Card>
      </div>
    </header>
  );
}

export const SI_PLAN_SELECTOR_FAQ = [
  {
    question: "Why can’t I select every sales intelligence product?",
    answer:
      "Plan selection needs a verified public seat ladder plus a feature→plan matrix. Credit packs and quote-only tools are linked to pricing notes and product hubs instead of a fake ladder.",
  },
  {
    question: "Do you estimate credit pack costs?",
    answer:
      "No. We never invent credit dollar totals. Credit and usage pricing stay unknown until the vendor quotes you.",
  },
  {
    question: "How do seats work for sales intelligence tools?",
    answer:
      "When a vendor publishes per-seat or flat subscription rules, we use those. Included-user floors and seat caps from research are treated as hard gates when present.",
  },
];

export function SiPlanSelectorFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        FAQ
      </h2>
      <dl className="mt-6 space-y-4">
        {SI_PLAN_SELECTOR_FAQ.map((item) => (
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

export function SiPlanSelectorEducation() {
  const sections = [
    {
      id: "how-it-works",
      title: "How the SI Plan Selector works",
      body: "You pick a product that has a verified seat plan matrix, set team size and must-haves, then we recommend the lowest qualifying published tier. Products without that matrix stay out of the ladder with links to pricing notes and hubs.",
    },
    {
      id: "credits",
      title: "Why credits are not forced into seat ladders",
      body: "Many sales intelligence tools sell credit packs or usage overages. Mapping those onto CRM-style seat ladders invents economics we cannot verify — so we refuse and point you to the vendor quote.",
    },
  ];

  return (
    <section className="border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-12">
      <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
        {sections.map((s) => (
          <div key={s.id} id={s.id}>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
              {s.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
