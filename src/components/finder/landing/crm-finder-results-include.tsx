import {
  BarChart3,
  GitCompareArrows,
  Scale,
  Sparkles,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const CARDS = [
  {
    title: "Fit score",
    body: "See how closely each CRM matches your requirements.",
    Icon: Sparkles,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    title: "Why it matched",
    body: "Understand the evidence behind each recommendation.",
    Icon: BarChart3,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
  },
  {
    title: "Trade-offs",
    body: "See where each product may fall short for your needs.",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.amber,
  },
  {
    title: "Compare",
    body: "Compare your strongest matches side-by-side.",
    Icon: GitCompareArrows,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
] as const;

export function CrmFinderResultsInclude() {
  return (
    <Section padding="md" background="muted" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        More than a list of CRM names
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        What your results include
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <li
            key={card.title}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]"
          >
            <span
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                card.tone,
              )}
            >
              <card.Icon className="size-4" aria-hidden />
            </span>
            <h3 className="mt-3 text-base font-semibold text-[var(--sg-color-text)]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {card.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
