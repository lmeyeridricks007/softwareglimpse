import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Target,
} from "lucide-react";
import { hubToneClass, withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import type { RequirementDetailModel } from "@/services/requirement-detail";
import { cn } from "@/lib/cn";

type Profile = RequirementDetailModel["profile"];

function stripWorkedExamplePrefix(text: string): string {
  return text.replace(/^Worked example:\s*/i, "").trim();
}

function parseWorkedExample(text: string): {
  lead: string;
  before?: string;
  after?: string;
} {
  const raw = stripWorkedExamplePrefix(text);
  const split = raw.match(
    /^(.*?)\s*Before CRM[,:]?\s*([\s\S]+?)\s*After CRM[,:]?\s*([\s\S]+)$/i,
  );
  if (split) {
    return {
      lead: split[1].trim().replace(/\.$/, ""),
      before: split[2].trim().replace(/\.$/, ""),
      after: split[3].trim().replace(/\.$/, ""),
    };
  }
  return { lead: raw };
}

export function RequirementOverview({
  overview,
  whoThisIsFor,
  workedExample,
  workedExampleSecondary,
  needsVisual,
  requirementLabel,
  className,
}: {
  overview: string;
  whoThisIsFor?: string | null;
  workedExample?: string | null;
  workedExampleSecondary?: string | null;
  needsVisual?: Profile["needsVisual"];
  requirementLabel: string;
  className?: string;
}) {
  const examples = [workedExample, workedExampleSecondary].filter(
    Boolean,
  ) as string[];

  return (
    <section
      id="overview-body"
      aria-labelledby="overview-body-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Requirement snapshot
      </p>
      <h2
        id="overview-body-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Overview
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
        {overview}
      </p>

      {needsVisual ? (
        <figure className="mt-6 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
          <Image
            src={needsVisual.src}
            alt={needsVisual.alt}
            width={960}
            height={540}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
            {needsVisual.caption ??
              `Teaching diagram — what "${requirementLabel}" looks like in practice.`}
          </figcaption>
        </figure>
      ) : null}

      {whoThisIsFor ? (
        <div className="sg-guide-tip mt-6 flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
            <Target className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Who this is for
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {whoThisIsFor}
            </p>
          </div>
        </div>
      ) : null}

      {examples.length > 0 ? (
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
              Worked examples
            </h3>
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              How teams satisfy “{requirementLabel.toLowerCase()}” in practice
            </p>
          </div>
          <ul
            className={cn(
              "mt-4 grid gap-4",
              examples.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2",
            )}
          >
            {examples.map((example, index) => {
              const parsed = parseWorkedExample(example);
              return (
                <li key={`example-${index}`}>
                  <Card className="relative h-full overflow-hidden border-[var(--sg-color-border)] p-0 shadow-[var(--sg-shadow-sm)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--sg-color-primary),#93c5fd)]" />
                    <div className="p-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                            hubToneClass(index),
                          )}
                        >
                          {index + 1}
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                          Example {index + 1}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-snug text-[var(--sg-color-text)]">
                        {parsed.lead}
                      </p>
                      {parsed.before && parsed.after ? (
                        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                          <div className="rounded-[var(--sg-radius-md)] border border-amber-200/80 bg-amber-50/80 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                              Before CRM
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
                              {parsed.before}
                            </p>
                          </div>
                          <div className="hidden items-center justify-center text-[var(--sg-color-primary)] sm:flex">
                            <ArrowRight className="size-4" aria-hidden />
                          </div>
                          <div className="rounded-[var(--sg-radius-md)] border border-emerald-200/80 bg-emerald-50/80 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                              After CRM
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
                              {parsed.after}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RequirementChallenges({
  items,
  requirementLabel,
  className,
}: {
  items: Profile["challenges"];
  requirementLabel: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="challenges"
      aria-labelledby="challenges-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="challenges-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Challenges without {requirementLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        These are the operating problems that usually push teams to require “
        {requirementLabel.toLowerCase()}” from a CRM — not feature wish lists.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index),
                  )}
                >
                  <AlertTriangle className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-[var(--sg-color-danger)]">
                      Without this capability in CRM:{" "}
                    </span>
                    {item.pain}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementHowItHelps({
  items,
  outcomes,
  requirementLabel,
  className,
}: {
  items: Profile["challenges"];
  outcomes: Profile["outcomes"];
  requirementLabel: string;
  className?: string;
}) {
  if (items.length === 0 && outcomes.length === 0) return null;
  return (
    <section
      id="how-it-helps"
      aria-labelledby="how-it-helps-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-it-helps-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How satisfying this requirement helps
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        A CRM only satisfies “{requirementLabel.toLowerCase()}” when the team
        keeps owners, history, and next steps current. Here is what “good” looks
        like once the requirement is met.
      </p>
      {items.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={`help-${item.id}`}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
            >
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-success)]">
                  When this requirement is satisfied:{" "}
                </span>
                {item.crmHelps}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {outcomes.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-semibold text-[var(--sg-color-text)]">
            Outcomes teams aim for
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {outcomes.map((item, index) => (
              <li key={item.id}>
                <Card className="h-full p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                        hubToneClass(index),
                      )}
                    >
                      <CheckCircle2 className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--sg-color-text)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RequirementAcceptanceNeeds({
  items,
  requirementLabel,
  className,
}: {
  items: Profile["acceptanceNeeds"];
  requirementLabel: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  const must = items.filter((i) => i.priority === "must");
  const nice = items.filter((i) => i.priority === "nice");
  return (
    <section
      id="acceptance"
      aria-labelledby="acceptance-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="acceptance-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What “{requirementLabel.toLowerCase()}” usually needs
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Start with must-haves your team will use weekly to accept this
        requirement as met. Treat nice-to-haves as later upgrades — not day-one
        blockers.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Must-have
          </p>
          <ul className="mt-3 space-y-3">
            {must.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--sg-radius-md)] border border-emerald-200/70 bg-emerald-50/50 p-4"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-emerald-700"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--sg-color-text)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                      {item.description}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {withSingleArrow("Learn more")}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            Nice-to-have
          </p>
          <ul className="mt-3 space-y-3">
            {nice.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--sg-radius-md)] border border-violet-200/70 bg-violet-50/40 p-4"
              >
                <div className="flex items-start gap-2">
                  <CircleAlert
                    className="mt-0.5 size-4 shrink-0 text-violet-700"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--sg-color-text)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                      {item.description}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {withSingleArrow("Learn more")}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function RequirementEvalWorkflow({
  steps,
  workflowVisual,
  requirementLabel,
  className,
}: {
  steps: Profile["workflowSteps"];
  workflowVisual?: Profile["workflowVisual"];
  requirementLabel: string;
  className?: string;
}) {
  if (steps.length === 0 && !workflowVisual) return null;
  return (
    <section
      id="eval-workflow"
      aria-labelledby="eval-workflow-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="eval-workflow-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How to validate “{requirementLabel.toLowerCase()}”
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        A simple validation loop beats a long checklist nobody runs during a
        trial.
      </p>
      {workflowVisual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          <Image
            src={workflowVisual.src}
            alt={workflowVisual.alt}
            width={960}
            height={540}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          {workflowVisual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
              {workflowVisual.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      {steps.length > 0 ? (
        <ol className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="flex gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-semibold text-[var(--sg-color-primary)]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
