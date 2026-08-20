import {
  ClipboardCheck,
  FolderTree,
  RefreshCw,
  Search,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    title: "Map",
    body: "Map workflows from product positioning and category evidence.",
    Icon: Search,
  },
  {
    title: "Validate",
    body: "Keep only use cases that connect to real catalogue products.",
    Icon: ClipboardCheck,
  },
  {
    title: "Categorize",
    body: "Attach use cases to categories so hubs stay navigable.",
    Icon: FolderTree,
  },
  {
    title: "Keep updated",
    body: "Refresh when product coverage or methodology changes.",
    Icon: RefreshCw,
  },
] as const;

export function UseCaseMethodSteps({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(className)}
      aria-labelledby="use-case-method-heading"
    >
      <h2
        id="use-case-method-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How we identify use cases
      </h2>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, body, Icon }, index) => (
          <li key={title}>
            <Icon
              className="size-6 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <p className="mt-3 text-sm font-semibold text-[var(--sg-color-text)]">
              <span className="text-[var(--sg-color-primary)]">
                {index + 1}.{" "}
              </span>
              {title}
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function UseCaseQuizBanner({
  href = "/tools/crm-finder/",
  title = "Not sure where to start?",
  body = "Answer a few structured questions and get a CRM shortlist — affiliate status never changes the order.",
  ctaLabel = "Take the quiz →",
  className,
}: {
  href?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <p className="font-semibold text-[var(--sg-color-text)]">{title}</p>
        <p className="mt-1 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
          {body}
        </p>
      </div>
      <ButtonLink
        href={href}
        className="shrink-0 bg-[var(--sg-color-success)] hover:opacity-90"
      >
        {ctaLabel}
      </ButtonLink>
    </aside>
  );
}
