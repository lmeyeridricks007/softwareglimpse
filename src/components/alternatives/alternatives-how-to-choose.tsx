import { CheckCircle2, Scale, Target } from "lucide-react";
import { cn } from "@/lib/cn";

export type HowToChooseStep = {
  title: string;
  body: string;
};

const DEFAULT_STEPS: HowToChooseStep[] = [
  {
    title: "Define your priorities",
    body: "List must-have workflows, team size, and budget before you fall for a feature checklist.",
  },
  {
    title: "Compare your options",
    body: "Use the same criteria across products — and ignore affiliate status when you weigh fit.",
  },
  {
    title: "Test before you decide",
    body: "Trial the shortlist with a real workflow. We only claim hands-on testing when it happened.",
  },
];

const STEP_ICONS = [Target, Scale, CheckCircle2] as const;

type Props = {
  title?: string;
  steps?: HowToChooseStep[];
  className?: string;
};

export function AlternativesHowToChoose({
  title = "How to choose an alternative",
  steps = DEFAULT_STEPS,
  className,
}: Props) {
  const rendered = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section
      className={cn(className)}
      aria-labelledby="alt-how-to-choose-heading"
    >
      <h2
        id="alt-how-to-choose-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-3">
        {rendered.map((step, index) => {
          const Icon = STEP_ICONS[index % STEP_ICONS.length]!;
          return (
            <li key={step.title}>
              <Icon
                className="size-6 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {step.title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {step.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
