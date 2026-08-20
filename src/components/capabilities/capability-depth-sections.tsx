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
import type { CapabilityHubModel } from "@/services/capability-hub";
import { cn } from "@/lib/cn";

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

export function CapabilityOverview({
  overview,
  whoThisIsFor,
  workedExample,
  workedExampleSecondary,
  focusAreas,
  capabilityLabel,
  className,
}: {
  overview: string;
  whoThisIsFor?: string | null;
  workedExample?: string | null;
  workedExampleSecondary?: string | null;
  focusAreas?: string[];
  capabilityLabel: string;
  className?: string;
}) {
  const examples = [workedExample, workedExampleSecondary].filter(
    Boolean,
  ) as string[];
  const chips = (focusAreas ?? []).slice(0, 5);

  return (
    <section
      id="overview-body"
      aria-labelledby="overview-body-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Fit snapshot
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

      {chips.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text)]"
            >
              {chip}
            </li>
          ))}
        </ul>
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
              Real-world examples
            </h3>
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              How teams put CRM to work for {capabilityLabel.toLowerCase()}
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

export function CapabilityChallenges({
  items,
  capabilityLabel,
  className,
}: {
  items: CapabilityHubModel["challenges"];
  capabilityLabel: string;
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
        Challenges in {capabilityLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        These are the operating problems that usually push teams toward CRM for{" "}
        {capabilityLabel.toLowerCase()} — not feature wish lists.
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
                      Without CRM discipline:{" "}
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

export function CapabilityHowCrmHelps({
  items,
  outcomes,
  capabilityLabel,
  className,
}: {
  items: CapabilityHubModel["challenges"];
  outcomes: CapabilityHubModel["outcomes"];
  capabilityLabel: string;
  className?: string;
}) {
  if (items.length === 0 && outcomes.length === 0) return null;
  return (
    <section
      id="how-crm-helps"
      aria-labelledby="how-crm-helps-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-crm-helps-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How CRM helps with {capabilityLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        A CRM only helps when the team keeps owners, history, and next steps
        current. Here is what “good” looks like for {capabilityLabel.toLowerCase()}.
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
                  With CRM discipline:{" "}
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

export function CapabilityNeedsSection({
  items,
  capabilityLabel,
  needsVisual,
  className,
}: {
  items: CapabilityHubModel["capabilityNeeds"];
  capabilityLabel: string;
  needsVisual?: CapabilityHubModel["needsVisual"];
  className?: string;
}) {
  if (items.length === 0 && !needsVisual) return null;
  const must = items.filter((i) => i.priority === "must");
  const nice = items.filter((i) => i.priority === "nice");
  return (
    <section
      id="needs"
      aria-labelledby="needs-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="needs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What {capabilityLabel.toLowerCase()} usually needs
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Start with must-haves your team will use weekly. Treat nice-to-haves as
        later upgrades — not day-one blockers.
      </p>
      {needsVisual ? (
        <figure className="mt-6 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
          <Image
            src={needsVisual.src}
            alt={needsVisual.alt}
            width={1536}
            height={1024}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-sm text-[var(--sg-color-text-muted)]">
            {needsVisual.caption ??
              `What typically breaks — and how ${capabilityLabel.toLowerCase()} capability addresses it.`}
          </figcaption>
        </figure>
      ) : null}
      {items.length > 0 ? (
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
      ) : null}
    </section>
  );
}

export function CapabilityWorkflow({
  steps,
  workflowVisual,
  capabilityLabel,
  className,
}: {
  steps: CapabilityHubModel["workflowSteps"];
  workflowVisual?: CapabilityHubModel["workflowVisual"];
  capabilityLabel: string;
  className?: string;
}) {
  if (steps.length === 0 && !workflowVisual) return null;
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="workflow-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        A practical {capabilityLabel.toLowerCase()} workflow
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        A simple operating loop beats a complex board nobody updates.
      </p>
      {workflowVisual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          <Image
            src={workflowVisual.src}
            alt={workflowVisual.alt}
            width={1536}
            height={1024}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          {workflowVisual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-sm text-[var(--sg-color-text-muted)]">
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

export function CapabilityGlanceStrip({
  model,
  className,
}: {
  model: CapabilityHubModel;
  className?: string;
}) {
  const items = [
    model.glance.primaryGoal
      ? { label: "Primary goal", value: model.glance.primaryGoal, Icon: Target }
      : null,
    model.glance.typicalTeam
      ? { label: "Typical team", value: model.glance.typicalTeam, Icon: CheckCircle2 }
      : null,
    model.glance.commonPriorities.length > 0
      ? {
          label: "Priorities",
          value: model.glance.commonPriorities.slice(0, 4).join(" · "),
          Icon: CircleAlert,
        }
      : null,
    {
      label: "CRM options shown",
      value: `${model.glance.taggedProductCount} products to explore`,
      Icon: ArrowRight,
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    Icon: typeof Target;
  }>;

  return (
    <section
      aria-label="At a glance"
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[linear-gradient(180deg,var(--sg-color-surface)_0%,#f8fbff_100%)] px-4 py-4 shadow-[var(--sg-shadow-sm)] sm:px-6",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        At a glance
      </p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ label, value, Icon }) => (
          <li key={label} className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-[var(--sg-color-primary-soft)]">
                <Icon className="size-3.5" aria-hidden />
              </span>
              {label}
            </span>
            <p className="mt-1.5 text-sm leading-snug text-[var(--sg-color-text)]">
              {value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityWhatMatters({
  title,
  intro,
  items,
  className,
}: {
  title: string;
  intro?: string;
  items: CapabilityHubModel["priorities"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="what-matters"
      aria-labelledby="what-matters-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="what-matters-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
          {intro}
        </p>
      ) : null}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] text-sm font-semibold",
                    hubToneClass(index),
                  )}
                >
                  {index + 1}
                </span>
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
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityScenarios({
  items,
  className,
}: {
  items: CapabilityHubModel["scenarios"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="scenarios-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Common scenarios
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-4">
              <p
                className={cn(
                  "inline-flex rounded-[var(--sg-radius-pill)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  hubToneClass(index),
                )}
              >
                Best when
              </p>
              <h3 className="mt-2 font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.bestWhen}
              </p>
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow("Related page")}
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityBuyingSteps({
  steps,
  guideHref,
  className,
}: {
  steps: CapabilityHubModel["buyingFramework"];
  guideHref?: string | null;
  className?: string;
}) {
  if (steps.length === 0) return null;
  return (
    <section
      id="how-to-choose"
      aria-labelledby="cap-choose-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cap-choose-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How to evaluate this capability
      </h2>
      <ol className="mt-5 space-y-3">
        {steps.map((step) => (
          <li
            key={step.step}
            className="flex gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-semibold text-[var(--sg-color-primary)]">
              {step.step}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {step.description}
                </p>
              ) : null}
              {step.href ? (
                <Link
                  href={step.href}
                  className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(step.ctaLabel ?? "Learn more")}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {guideHref ? (
        <p className="mt-4">
          <Link
            href={guideHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Read the full CRM buying guide")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export function CapabilityFaq({
  items,
  className,
}: {
  items: CapabilityHubModel["faq"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="faq-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        FAQ
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item.question}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <h3 className="font-semibold text-[var(--sg-color-text)]">
              {item.question}
            </h3>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityQuickNav({
  items,
  className,
}: {
  items: CapabilityHubModel["navItems"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="On this page"
      className={cn(
        "flex flex-wrap gap-2 border-b border-[var(--sg-color-border)] pb-4",
        className,
      )}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]/40 hover:text-[var(--sg-color-primary)]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
