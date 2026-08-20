import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type GuideNavItem = {
  href: string;
  title: string;
};

type Props = {
  previous?: GuideNavItem | null;
  next?: GuideNavItem | null;
  className?: string;
};

export function GuideArticleNav({ previous, next, className }: Props) {
  if (!previous && !next) return null;

  return (
    <nav
      className={cn("grid gap-4 sm:grid-cols-2", className)}
      aria-label="Adjacent articles"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-col gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition-shadow hover:shadow-[var(--sg-shadow-md)]"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            <ArrowLeft className="size-3.5" aria-hidden />
            Previous article
          </span>
          <span className="font-semibold text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 text-right shadow-[var(--sg-shadow-sm)] transition-shadow hover:shadow-[var(--sg-shadow-md)] sm:items-end"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Next article
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="font-semibold text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
