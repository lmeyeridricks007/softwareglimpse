import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Scale,
} from "lucide-react";
import type { GuidesHubJourneyStep } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

const ICONS = [BookOpen, ClipboardList, Scale, CheckCircle2] as const;

type Props = {
  steps: GuidesHubJourneyStep[];
  className?: string;
};

export function GuidesBuyingJourney({ steps, className }: Props) {
  if (steps.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Software buying guides
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Step-by-step guidance from defining requirements to making a final
          decision.
        </p>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="relative mt-8 space-y-0 md:hidden">
        {steps.map((step, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <li key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
              {i < steps.length - 1 ? (
                <span
                  className="absolute left-[1.15rem] top-10 bottom-0 w-px border-l border-dashed border-[var(--sg-color-border-strong)]"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-[1] inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sg-color-primary)] bg-white text-[var(--sg-color-primary)]">
                <Icon className="size-4" aria-hidden />
              </span>
              <JourneyStepBody step={step} />
            </li>
          );
        })}
      </ol>

      {/* Desktop: horizontal dashed journey */}
      <ol className="relative mt-10 hidden md:grid md:grid-cols-4 md:gap-0">
        <span
          className="pointer-events-none absolute left-[12%] right-[12%] top-[1.35rem] border-t-2 border-dashed border-[var(--sg-color-border-strong)]"
          aria-hidden
        />
        {steps.map((step, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <li key={step.step} className="relative px-3 text-center">
              <span className="relative z-[1] mx-auto inline-flex size-11 items-center justify-center rounded-full border-2 border-[var(--sg-color-primary)] bg-white text-[var(--sg-color-primary)] shadow-[var(--sg-shadow-sm)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold tabular-nums tracking-wide text-[var(--sg-color-primary)]">
                {step.step}
              </p>
              <JourneyStepBody step={step} centered />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function JourneyStepBody({
  step,
  centered,
}: {
  step: GuidesHubJourneyStep;
  centered?: boolean;
}) {
  const title = (
    <p
      className={cn(
        "mt-1 font-semibold text-[var(--sg-color-navy)]",
        centered && "mt-2",
      )}
    >
      {step.title}
    </p>
  );
  const desc = (
    <p
      className={cn(
        "mt-1.5 text-sm text-[var(--sg-color-text-muted)]",
        centered && "mx-auto max-w-[16rem]",
      )}
    >
      {step.description}
    </p>
  );
  const cta =
    step.href && step.ctaLabel ? (
      <Link
        href={step.href}
        className={cn(
          "mt-3 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline",
          centered && "justify-center",
        )}
      >
        {step.ctaLabel} →
      </Link>
    ) : null;

  return (
    <div className={cn(centered && "flex flex-col items-center")}>
      {title}
      {desc}
      {cta}
    </div>
  );
}
