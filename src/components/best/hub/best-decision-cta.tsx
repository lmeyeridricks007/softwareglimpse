import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  LayoutGrid,
  Megaphone,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { BestHubDecisionPath } from "@/services/best-hub";
import { cn } from "@/lib/cn";

const PATH_ICONS: Record<string, LucideIcon> = {
  sales: TrendingUp,
  projects: LayoutGrid,
  support: Headphones,
  marketing: Megaphone,
  hr: Users,
};

const PATH_TONES: Record<string, string> = {
  sales: GUIDE_ICON_TONE_CLASSES.emerald,
  projects: GUIDE_ICON_TONE_CLASSES.violet,
  support: GUIDE_ICON_TONE_CLASSES.blue,
  marketing: GUIDE_ICON_TONE_CLASSES.fuchsia,
  hr: GUIDE_ICON_TONE_CLASSES.amber,
};

type Props = {
  paths: BestHubDecisionPath[];
  finderHref?: string | null;
  finderLabel?: string;
  className?: string;
};

/** Full-bleed navy decision band — same Section pattern as homepage Finder CTA. */
export function BestDecisionCTA({
  paths,
  finderHref,
  finderLabel,
  className,
}: Props) {
  if (paths.length === 0) return null;

  return (
    <Section
      padding="lg"
      background="navy"
      container="wide"
      className={className}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-white">
            Not sure where to start?
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Tell us what you&apos;re trying to accomplish and we&apos;ll point
            you toward the right category, comparison, or Finder.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {finderHref && finderLabel ? (
              <ButtonLink href={finderHref} variant="onDark" size="lg">
                {finderLabel}
                <ArrowRight className="ml-1 size-4" aria-hidden />
              </ButtonLink>
            ) : null}
            <ButtonLink
              href="/categories/"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Explore All Categories
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {paths.map((path) => {
            const Icon = PATH_ICONS[path.id] ?? TrendingUp;
            const tone = PATH_TONES[path.id] ?? GUIDE_ICON_TONE_CLASSES.sky;
            return (
              <li key={path.id}>
                <Link
                  href={path.href}
                  className="group flex h-full items-center gap-3 rounded-[var(--sg-radius-lg)] border border-white/15 bg-white/5 px-3.5 py-3.5 transition hover:bg-white/10"
                >
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      tone,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      {path.title}
                    </span>
                    <span className="block text-xs text-white/65">
                      {path.categoryHint}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-white/70 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
