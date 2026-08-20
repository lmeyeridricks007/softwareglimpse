import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Question = {
  question: string;
  answer?: string;
};

type Props = {
  title?: string;
  items: Question[];
  className?: string;
};

export function IndustryVendorQuestions({
  title = "Questions to ask CRM vendors",
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="vendor-questions"
      aria-labelledby="vendor-questions-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="vendor-questions-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Use these prompts in vendor conversations. They are educational — not
        claims about any specific product.
      </p>
      <ul className="mt-5 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
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
                {item.answer ??
                  "Ask the vendor to demonstrate this with your workflow, plans, and data requirements — and request documentation where relevant."}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
