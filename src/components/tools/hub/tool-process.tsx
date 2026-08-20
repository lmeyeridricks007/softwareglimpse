import {
  ClipboardList,
  ListChecks,
  Scale,
  Search,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    n: "01",
    title: "Tell us what you need",
    body: "Answer practical questions about your team, budget and requirements.",
    Icon: ClipboardList,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    n: "02",
    title: "We evaluate the options",
    body: "Our tools use the same structured product research behind SoftwareGlimpse reviews and comparisons.",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    n: "03",
    title: "Get your shortlist",
    body: "See products that fit your requirements and understand why they were selected.",
    Icon: ListChecks,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
  },
  {
    n: "04",
    title: "Decide before you buy",
    body: "Compare recommendations, read reviews and check pricing before making your decision.",
    Icon: Search,
    tone: GUIDE_ICON_TONE_CLASSES.sky,
  },
] as const;

export function ToolProcess() {
  return (
    <Section padding="md" background="surface" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        How SoftwareGlimpse tools work
      </h2>

      <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-[var(--sg-color-border)] lg:block"
          aria-hidden
        />
        {STEPS.map((step) => (
          <li key={step.n} className="relative">
            <span
              className={cn(
                "relative z-10 inline-flex size-12 items-center justify-center rounded-full border bg-[var(--sg-color-surface)]",
                step.tone,
              )}
            >
              <step.Icon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
              Step {step.n}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--sg-color-text)]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
