"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-12">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-3 text-[var(--color-fg-muted)]">
        Please try again. If this keeps happening, tell us via Contact.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-accent-fg)]"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
        >
          Home
        </Link>
        <Link
          href="/company/contact/?reason=technical"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
