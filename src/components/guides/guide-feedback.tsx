"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Vote = "yes" | "no";

type Props = {
  slug: string;
  className?: string;
};

const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; vote: Vote | null }>();

function subscribe(key: string, listener: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
  };
}

function getVoteSnapshot(key: string): Vote | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.vote;
  const vote = raw === "yes" || raw === "no" ? raw : null;
  cache.set(key, { raw, vote });
  return vote;
}

function writeVote(key: string, vote: Vote) {
  try {
    window.localStorage.setItem(key, vote);
  } catch {
    /* ignore */
  }
  cache.set(key, { raw: vote, vote });
  const set = listeners.get(key);
  if (set) for (const listener of set) listener();
}

export function GuideFeedback({ slug, className }: Props) {
  const storageKey = `sg-guide-feedback:${slug}`;
  const vote = useSyncExternalStore(
    (listener) => subscribe(storageKey, listener),
    () => getVoteSnapshot(storageKey),
    () => null,
  );

  function cast(next: Vote) {
    writeVote(storageKey, next);
  }

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5",
        className,
      )}
      aria-labelledby="guide-feedback-heading"
    >
      <h2
        id="guide-feedback-heading"
        className="font-semibold text-[var(--sg-color-text)]"
      >
        Was this article helpful?
      </h2>
      {vote ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Thanks for the feedback
          {vote === "no"
            ? " — tell us what to improve via Contact."
            : "."}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => cast("yes")}
            className="inline-flex items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
          >
            <ThumbsUp className="size-4" aria-hidden />
            Yes
          </button>
          <button
            type="button"
            onClick={() => cast("no")}
            className="inline-flex items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
          >
            <ThumbsDown className="size-4" aria-hidden />
            No
          </button>
        </div>
      )}
      <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
        Have more questions?{" "}
        <Link
          href={`${COMPANY_ROUTES.contact}?reason=general`}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Contact our support team
        </Link>
        .
      </p>
    </section>
  );
}
