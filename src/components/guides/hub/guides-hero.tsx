import Link from "next/link";
import { ArrowRight, BookOpen, Check, Compass, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { StartHereDashboardArt } from "@/components/guides/hub/guide-illustrations";
import type { GuidesHubModel } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  startHere: GuidesHubModel["startHere"];
  className?: string;
};

export function GuidesHero({ startHere, className }: Props) {
  return (
    <header className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-0 -mx-4 bg-[radial-gradient(ellipse_at_12%_0%,rgb(37_99_235/0.09),transparent_50%)] sm:-mx-6"
        aria-hidden
      />
      <div className="relative grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,26rem)] lg:gap-10">
        <div className="flex flex-col justify-center py-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sg-color-primary)]">
            Software buying guides
          </p>
          <h1 className="mt-3 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(2.15rem,4.2vw,3rem)] font-bold leading-[1.05] tracking-tight text-[var(--sg-color-navy)]">
            Make better software decisions.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--sg-color-text-muted)] sm:text-[length:var(--sg-text-body-lg)]">
            Practical guides for choosing, comparing, buying and getting more
            from business software — backed by the same structured recommendations used
            across SoftwareGlimpse.
          </p>

          <form action="/guides/" method="get" role="search" className="mt-6 max-w-xl">
            <label htmlFor="guides-hub-search" className="sr-only">
              Search guides, software or topics
            </label>
            <div className="flex items-center gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-3.5 py-3 shadow-[var(--sg-shadow-sm)] focus-within:border-[var(--sg-color-primary)] focus-within:ring-2 focus-within:ring-[var(--sg-color-primary)]/15">
              <Search
                className="size-4 shrink-0 text-[var(--sg-color-text-muted)]"
                aria-hidden
              />
              <input
                id="guides-hub-search"
                name="q"
                type="search"
                placeholder="Search guides, software or topics..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--sg-color-text)] outline-none placeholder:text-[var(--sg-color-text-muted)]"
              />
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="#latest-guides" size="lg">
              Browse all guides
            </ButtonLink>
            <ButtonLink href="/software/" variant="outline" size="lg">
              Explore software
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--sg-color-text)]">
            {[
              "Recommendation-backed guidance",
              "Vendor-independent recommendations",
              "Regularly reviewed",
            ].map((label) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {startHere ? (
          <aside className="flex flex-col rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/25 bg-[linear-gradient(160deg,#dbeafe_0%,#eff6ff_45%,#f8fbff_100%)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sg-color-primary)]">
              Start here
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--sg-color-navy)]">
              Choosing {startHere.categoryLabel}?
            </p>

            <div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1fr_9.5rem]">
              <ul className="space-y-2.5">
                {startHere.guides.map((g, i) => {
                  const Icon = i === 0 ? BookOpen : Compass;
                  return (
                    <li key={g.slug}>
                      <Link
                        href={g.href}
                        className="group flex items-start gap-3 rounded-[var(--sg-radius-lg)] border border-white/80 bg-white/95 p-3 shadow-[var(--sg-shadow-sm)] transition hover:shadow-[var(--sg-shadow-md)]"
                      >
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                            {g.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                            {g.topicType === "fundamental"
                              ? "Understand the basics"
                              : "A practical buying framework"}
                            {" · "}
                            {g.readingMinutes} min read →
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <StartHereDashboardArt className="min-h-0" />
            </div>

            <Link
              href={startHere.categoryHref}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Explore {startHere.categoryLabel} guides
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
        ) : (
          <aside className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sg-color-text-muted)]">
              Start here
            </p>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              Published buying guides will appear here as category research is
              completed.
            </p>
            <Link
              href="/categories/"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]"
            >
              Browse categories
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
        )}
      </div>
    </header>
  );
}
