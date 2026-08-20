import Link from "next/link";
import type { Author } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation/config";

/**
 * Authorship meta for editorial/commercial pages — not for deterministic tools.
 * Does not fabricate review dates or credentials.
 */
export function AuthorshipByline({
  author,
  lastReviewed,
}: {
  author?: Author | null;
  lastReviewed?: string;
}) {
  if (!author && !lastReviewed) return null;

  const reviewedLabel = lastReviewed ? formatReviewDate(lastReviewed) : null;
  const initials = author ? initialsFromName(author.name) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
      {author ? (
        <span className="inline-flex items-center gap-2.5">
          <span
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-[11px] font-semibold tracking-wide text-[var(--sg-color-primary)]"
            aria-hidden
          >
            {initials}
          </span>
          <span className="min-w-0 leading-snug">
            <span className="block">
              By{" "}
              <Link
                href={COMPANY_ROUTES.myStory}
                className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
              >
                {author.name}
              </Link>
            </span>
            {author.role ? (
              <span className="block text-xs text-[var(--sg-color-text-muted)]">
                {author.role}
              </span>
            ) : null}
          </span>
        </span>
      ) : null}

      {author && reviewedLabel ? (
        <span
          className="hidden h-4 w-px bg-[var(--sg-color-border)] sm:block"
          aria-hidden
        />
      ) : null}

      {lastReviewed && reviewedLabel ? (
        <span>
          Reviewed{" "}
          <time
            dateTime={lastReviewed}
            className="font-medium text-[var(--sg-color-text)]"
          >
            {reviewedLabel}
          </time>
        </span>
      ) : null}
    </div>
  );
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length === 0) return "SG";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
