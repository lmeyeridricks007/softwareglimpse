import Link from "next/link";
import {
  ArrowRight,
  FilePenLine,
  FlaskConical,
  RefreshCw,
  Scale,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    title: "Collect",
    body: "We collect structured product and category information.",
    Icon: FlaskConical,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    title: "Score",
    body: "Information is assessed using consistent category criteria.",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    title: "Write",
    body: "Guides turn that evidence into practical buying advice.",
    Icon: FilePenLine,
    tone: GUIDE_ICON_TONE_CLASSES.teal,
  },
  {
    title: "Review & refresh",
    body: "Content is reviewed and updated as product coverage changes.",
    Icon: RefreshCw,
    tone: GUIDE_ICON_TONE_CLASSES.amber,
  },
] as const;

type Props = {
  methodologyHref: string;
  howWeReviewHref: string;
  className?: string;
};

export function GuidesMethodology({
  methodologyHref,
  howWeReviewHref,
  className,
}: Props) {
  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={className}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        How SoftwareGlimpse guides are created
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Guides use the same structured recommendations model as reviews, comparisons
        and Best Software pages.
      </p>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <ButtonLink href={methodologyHref}>
          Learn about our methodology
        </ButtonLink>
        <Link
          href={howWeReviewHref}
          className="inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          How we review software →
        </Link>
      </div>
    </Section>
  );
}
