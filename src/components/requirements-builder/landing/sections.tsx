import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Calculator,
  GitCompare,
  Search,
  ClipboardCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { crmRequirementsBuilderDefinition } from "../crm/definition";

export function RequirementsMethodology() {
  const steps = [
    "You define business context",
    "Use cases determine relevant capabilities",
    "Capabilities surface buyer requirements",
    "Requirements map to concrete software features",
    "You prioritize what matters",
    "The resulting profile can be reused across SoftwareGlimpse tools",
  ];

  return (
    <section
      id="how-it-works"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-10 sm:px-10"
      aria-labelledby="methodology-heading"
    >
      <h2
        id="methodology-heading"
        className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        How the Requirements Builder works
      </h2>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 p-4"
          >
            <span className="text-xs font-semibold text-[var(--sg-color-primary)]">
              Step {index + 1}
            </span>
            <p className="mt-1 text-sm font-medium text-[var(--sg-color-navy)]">
              {step}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--sg-color-navy)]">
        {[
          "Use case",
          "Capability",
          "Requirement",
          "Feature",
          "Product evidence",
        ].map((label, i, arr) => (
          <span key={label} className="inline-flex items-center gap-2">
            <span className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-3 py-1.5">
              {label}
            </span>
            {i < arr.length - 1 ? (
              <ArrowDown className="size-4 rotate-[-90deg] text-[var(--sg-color-text-muted)]" aria-hidden />
            ) : null}
          </span>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href={crmRequirementsBuilderDefinition.methodologyHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Learn about our recommendations model
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

type NextStepsProps = {
  onFind: () => void;
  onCompare: () => void;
  onCost: () => void;
  onScorecard?: () => void;
  /** Display noun, e.g. "CRM" or "sales intelligence". */
  productNoun?: string;
  findComingSoon?: boolean;
  costComingSoon?: boolean;
};

export function RequirementsNextSteps({
  onFind,
  onCompare,
  onCost,
  onScorecard,
  productNoun = "CRM",
  findComingSoon = false,
  costComingSoon = false,
}: NextStepsProps) {
  const noun = productNoun;
  const nounTitle =
    noun === "CRM" ? "CRMs" : noun.charAt(0).toUpperCase() + noun.slice(1);
  const cards = [
    {
      id: "find",
      title: `Find matching ${nounTitle}`,
      body: `Use this requirements profile to match ${noun} products.`,
      cta: findComingSoon ? "Finder coming next" : `Find matching ${nounTitle}`,
      icon: Search,
      onClick: onFind,
      comingSoon: findComingSoon,
    },
    {
      id: "compare",
      title: "Compare products",
      body: "Compare shortlisted products against these requirements.",
      cta: `Compare ${noun} software`,
      icon: GitCompare,
      onClick: onCompare,
      comingSoon: false,
    },
    {
      id: "cost",
      title: "Calculate cost",
      body: "Estimate what products meeting your requirements could cost.",
      cta: costComingSoon ? "Cost calculator coming next" : `Calculate ${noun} costs`,
      icon: Calculator,
      onClick: onCost,
      comingSoon: costComingSoon,
    },
    {
      id: "scorecard",
      title: "Create vendor scorecard",
      body: "Use these requirements to evaluate shortlisted vendors.",
      cta: onScorecard ? "Create scorecard" : "Coming next",
      icon: ClipboardCheck,
      onClick: onScorecard,
      comingSoon: !onScorecard,
    },
  ] as const;

  return (
    <section
      id="next-steps"
      className="space-y-4"
      aria-labelledby="next-steps-heading"
    >
      <h2
        id="next-steps-heading"
        className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        What do you want to do next?
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="flex flex-col gap-3 border-[var(--sg-color-border)] p-5"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--sg-color-navy)]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {card.body}
                  </p>
                </div>
              </div>
              {card.comingSoon ? (
                <span className="mt-auto inline-flex text-sm font-medium text-[var(--sg-color-text-muted)]">
                  Coming next
                </span>
              ) : (
                <button
                  type="button"
                  onClick={card.onClick}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)] hover:underline"
                >
                  {card.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function RequirementsFaq({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="space-y-4">
      <h2
        id="faq-heading"
        className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3"
          >
            <summary className="cursor-pointer font-medium text-[var(--sg-color-navy)]">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function RequirementsRelatedGuides({
  guides,
}: {
  guides: Array<{ href: string; label: string }>;
}) {
  if (guides.length === 0) return null;
  return (
    <section aria-labelledby="help-heading" className="space-y-4">
      <h2
        id="help-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Need help defining requirements?
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <li key={g.href}>
            <ButtonLink href={g.href} variant="outline" className="w-full justify-between">
              {g.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementsTrustFooter() {
  return (
    <div className="grid gap-4 border-t border-[var(--sg-color-border)] pt-8 sm:grid-cols-3">
      <div>
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Data privacy
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Your data stays yours. Profile answers are stored locally in your
          browser.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          No bias
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          No affiliate bias. This tool does not recommend products or rank
          vendors.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Control
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          You&apos;re in control. Edit, reset, copy or export your profile at
          any time.
        </p>
      </div>
    </div>
  );
}
