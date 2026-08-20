import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Target,
} from "lucide-react";
import { hubToneClass } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import type { FeatureDetailModel } from "@/services/feature-detail";
import { cn } from "@/lib/cn";

export function FeatureDepthOverview({
  overview,
  whoThisIsFor,
  whatMattersIntro,
  needsVisual,
  featureLabel,
  className,
}: {
  overview: string;
  whoThisIsFor?: string | null;
  whatMattersIntro?: string | null;
  needsVisual?: FeatureDetailModel["profile"]["needsVisual"];
  featureLabel: string;
  className?: string;
}) {
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
              `Teaching diagram — when teams need ${featureLabel.toLowerCase()}.`}
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

      {whatMattersIntro ? (
        <div className="mt-6 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
            What matters when evaluating
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
            {whatMattersIntro}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export function FeatureDepthChallenges({
  items,
  className,
}: {
  items: NonNullable<FeatureDetailModel["profile"]["challenges"]>;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <section
      id="challenges"
      aria-labelledby="challenges-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Pressure points
      </p>
      <h2
        id="challenges-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Challenges this feature addresses
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-5">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                    hubToneClass(index),
                  )}
                >
                  <AlertTriangle className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-amber-800">Pain: </span>
                    {item.pain}
                  </p>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-emerald-800">
                      How the feature helps:{" "}
                    </span>
                    {item.crmHelps}
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

export function FeatureDepthOutcomes({
  items,
  className,
}: {
  items: NonNullable<FeatureDetailModel["profile"]["outcomes"]>;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Results
      </p>
      <h2
        id="outcomes-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Outcomes teams look for
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="flex h-full gap-3 p-5">
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                  hubToneClass(index),
                )}
              >
                <CheckCircle2 className="size-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeatureDepthWorkflow({
  steps,
  workflowVisual,
  featureLabel,
  className,
}: {
  steps: NonNullable<FeatureDetailModel["profile"]["workflowSteps"]>;
  workflowVisual?: FeatureDetailModel["profile"]["workflowVisual"];
  featureLabel: string;
  className?: string;
}) {
  if (!steps.length && !workflowVisual) return null;
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        How it runs
      </p>
      <h2
        id="workflow-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Typical workflow
      </h2>

      {workflowVisual ? (
        <figure className="mt-6 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
          <Image
            src={workflowVisual.src}
            alt={workflowVisual.alt}
            width={960}
            height={540}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
            {workflowVisual.caption ??
              `Teaching diagram — how ${featureLabel.toLowerCase()} typically flows.`}
          </figcaption>
        </figure>
      ) : null}

      {steps.length > 0 ? (
        <ol className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <li key={step.id}>
              <Card className="flex gap-4 p-4 sm:p-5">
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    hubToneClass(index),
                  )}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                      {step.label}
                    </h3>
                    {index < steps.length - 1 ? (
                      <ArrowRight
                        className="hidden size-3.5 text-[var(--sg-color-primary)] sm:inline"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {step.detail}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
