import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { CompareHubGuide } from "@/services/compare-hub";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const TONES = [
  GUIDE_ICON_TONE_CLASSES.emerald,
  GUIDE_ICON_TONE_CLASSES.fuchsia,
  GUIDE_ICON_TONE_CLASSES.violet,
  GUIDE_ICON_TONE_CLASSES.blue,
] as const;

type Props = {
  guides: CompareHubGuide[];
  className?: string;
};

export function ComparisonGuideGrid({ guides, className }: Props) {
  if (guides.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            Not ready to compare yet?
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Start with buying guides, then come back to a side-by-side view.
          </p>
        </div>
        <ButtonLink href="/guides/" variant="outline" size="sm">
          Browse guides →
        </ButtonLink>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {guides.map((guide, i) => (
          <li key={guide.slug}>
            <Link
              href={guide.href}
              className="group flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 transition hover:border-[var(--sg-color-primary)]"
            >
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)] border",
                  TONES[i % TONES.length],
                )}
              >
                <BookOpen className="size-4" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {guide.title}
              </h3>
              {guide.summary ? (
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-[var(--sg-color-text-muted)]">
                  {guide.summary}
                </p>
              ) : (
                <span className="flex-1" />
              )}
              <p className="mt-3 text-sm font-semibold text-[var(--sg-color-primary)]">
                Read guide →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
