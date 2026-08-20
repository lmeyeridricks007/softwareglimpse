import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type GuideFaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: GuideFaqItem[];
  viewAllHref?: string;
  className?: string;
};

export function GuideFaq({ items, viewAllHref, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="faq"
      className={cn("scroll-mt-28", className)}
      aria-labelledby="guide-faq-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="guide-faq-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Frequently asked questions
        </h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all FAQs →
          </Link>
        ) : null}
      </div>
      <ul className="sg-guide-card mt-5 divide-y divide-[var(--sg-guide-card-border)]">
        {items.map((item) => (
          <li key={item.question}>
            <details className="group px-4 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium text-[var(--sg-color-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-4 shrink-0 text-[var(--sg-color-text-muted)] transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
