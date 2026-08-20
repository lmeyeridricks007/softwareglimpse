import {
  ClipboardList,
  ListChecks,
  Scale,
  Target,
  Search,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    n: "01",
    title: "Tell us about your business",
    body: "Company size, team and CRM context.",
    Icon: ClipboardList,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    n: "02",
    title: "Choose your priorities",
    body: "Tell us what you need the CRM to do.",
    Icon: Target,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    n: "03",
    title: "Set your requirements",
    body: "Features, integrations and budget.",
    Icon: ListChecks,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
  },
  {
    n: "04",
    title: "We compare the evidence",
    body: "Your requirements are matched against SoftwareGlimpse CRM research.",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.sky,
  },
  {
    n: "05",
    title: "Get your shortlist",
    body: "See your strongest matches and understand why they ranked.",
    Icon: Search,
    tone: GUIDE_ICON_TONE_CLASSES.orange,
  },
] as const;

export function CrmFinderHowItWorks() {
  return (
    <Section
      id="how-it-works"
      padding="md"
      background="surface"
      container="wide"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        How the CRM Finder works
      </h2>
      <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-8 hidden h-px bg-[var(--sg-color-border)] lg:block"
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
              {step.n}
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
