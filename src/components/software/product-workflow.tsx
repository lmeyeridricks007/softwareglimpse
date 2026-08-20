import { createElement } from "react";
import {
  hubToneClassForSlug,
  resolveHubIcon,
} from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ProductWorkflowStep = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type ProductWorkflowProps = {
  productName: string;
  summary: string;
  steps: ProductWorkflowStep[];
  evidenceNote?: string | null;
  className?: string;
};

export function ProductWorkflow({
  productName,
  summary,
  steps,
  evidenceNote,
  className,
}: ProductWorkflowProps) {
  if (steps.length === 0) return null;

  return (
    <section
      id="product-experience"
      aria-labelledby="product-experience-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="product-experience-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How {productName} works
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
        {summary}
      </p>
      {evidenceNote ? (
        <p className="mt-2 max-w-3xl text-xs text-[var(--sg-color-text-muted)]">
          {evidenceNote}
        </p>
      ) : null}

      <ol className="mt-6 flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:overflow-x-auto lg:pb-2">
        {steps.map((step, index) => {
          const Icon = resolveHubIcon(step.icon);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex min-w-0 flex-col lg:shrink-0 lg:max-w-[15rem] lg:flex-1 lg:min-w-[11rem]",
                !isLast &&
                  "lg:pr-8 lg:after:absolute lg:after:left-[calc(100%-1.5rem)] lg:after:top-6 lg:after:h-px lg:after:w-6 lg:after:bg-[var(--sg-color-border-strong)]",
              )}
            >
              <Card className="flex h-full flex-col p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] font-[family-name:var(--font-display)] text-sm font-semibold tabular-nums text-[var(--sg-color-primary)]"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      hubToneClassForSlug(step.id, index),
                    )}
                  >
                    {createElement(Icon, {
                      className: "size-4",
                      "aria-hidden": true,
                    })}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-[var(--sg-color-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                  {step.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
