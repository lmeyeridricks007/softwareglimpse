import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  GitCompareArrows,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { Section } from "@/components/layout/section";
import {
  CompareArtMini,
  ReviewsArtMini,
  TrophyArtMini,
} from "@/components/guides/hub/pathway-art";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const PATHS: Array<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  Icon: LucideIcon;
  tone: string;
  Art: ComponentType;
}> = [
  {
    id: "reviews",
    eyebrow: "Reviews",
    title: "Review individual products",
    description:
      "Understand features, pricing, strengths, limitations and evidence.",
    cta: "Browse software",
    href: "/software/",
    Icon: FileSearch,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
    Art: ReviewsArtMini,
  },
  {
    id: "comparisons",
    eyebrow: "Comparisons",
    title: "Compare your shortlist",
    description:
      "See software products side-by-side across relevant criteria.",
    cta: "Compare software",
    href: "/compare/",
    Icon: GitCompareArrows,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
    Art: CompareArtMini,
  },
  {
    id: "best",
    eyebrow: "Best software",
    title: "See category recommendations",
    description:
      "Explore SoftwareGlimpse recommendationsed category recommendations and methodology.",
    cta: "Explore best software",
    href: "/best/",
    Icon: Trophy,
    tone: GUIDE_ICON_TONE_CLASSES.amber,
    Art: TrophyArtMini,
  },
];

type Props = { className?: string };

export function GuidesResearchPathways({ className }: Props) {
  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={className}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-primary)]">
        From learning to choosing
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Ready to compare your options?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
        Guides connect directly into SoftwareGlimpse software research —
        reviews, comparisons and category recommendations share the same
        underlying model.
      </p>

      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {PATHS.map((path) => (
          <li key={path.id}>
            <Link
              href={path.href}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-md)]"
            >
              <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/60 px-4 py-3">
                <path.Art />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                    path.tone,
                  )}
                >
                  <path.Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
                  {path.eyebrow}
                </p>
                <h3 className="mt-1 font-semibold text-[var(--sg-color-text)]">
                  {path.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {path.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                  {path.cta} →
                  <ArrowRight
                    className="size-3.5 transition-transform motion-safe:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
