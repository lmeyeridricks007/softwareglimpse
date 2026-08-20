import { BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  className?: string;
};

export function GuideLearnList({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn("mt-10", className)}
      aria-labelledby="guide-learn-heading"
    >
      <h2
        id="guide-learn-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
      >
        What you’ll learn
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.slice(0, 5).map((item) => (
          <li key={item} className="flex flex-col gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)]">
              <BookOpen className="size-4" aria-hidden />
            </span>
            <p className="text-sm text-[var(--sg-color-text-muted)]">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
