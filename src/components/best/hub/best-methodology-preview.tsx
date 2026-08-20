import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  GitCompareArrows,
  Scale,
  Trophy,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/home/section-header";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    title: "Collect",
    body: "We collect and verify product information.",
    Icon: FlaskConical,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    title: "Score",
    body: "Products are evaluated using criteria relevant to their category.",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    title: "Compare",
    body: "Products are assessed consistently against the same decision criteria.",
    Icon: GitCompareArrows,
    tone: GUIDE_ICON_TONE_CLASSES.teal,
  },
  {
    title: "Recommend",
    body: "Recommendations explain which product fits which type of buyer.",
    Icon: Trophy,
    tone: GUIDE_ICON_TONE_CLASSES.amber,
  },
] as const;

type Props = { className?: string };

export function BestMethodologyPreview({ className }: Props) {
  return (
    <Section padding="md" background="surface" container="wide" className={className}>
      <SectionHeader
        title="How we choose the best software"
        description="“Best” is a fit judgment — grounded in category methodology, not affiliate incentives."
      />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, body, Icon, tone }, index) => (
          <li key={title} className="relative">
            <div className="flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full border",
                    tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Step {index + 1}
                  </p>
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {title}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                {body}
              </p>
            </div>
            {index < STEPS.length - 1 ? (
              <ArrowRight
                className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-[var(--sg-color-primary)] lg:block"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <ButtonLink href={COMPANY_ROUTES.methodology}>
          Read our methodology
        </ButtonLink>
        <Link
          href={COMPANY_ROUTES.howWeReview}
          className="inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          How we review software
        </Link>
      </div>
    </Section>
  );
}
