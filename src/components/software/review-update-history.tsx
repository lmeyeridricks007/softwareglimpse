import { cn } from "@/lib/cn";

export type ReviewUpdateHistoryItem = {
  date: string;
  label: string;
};

export type ReviewUpdateHistoryProps = {
  items: ReviewUpdateHistoryItem[];
  className?: string;
};

export function ReviewUpdateHistory({
  items,
  className,
}: ReviewUpdateHistoryProps) {
  if (items.length === 0) return null;

  return (
    <details
      className={cn(
        "group rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]",
        className,
      )}
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--sg-color-text)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-[var(--sg-color-text-muted)] group-open:text-[var(--sg-color-text)]">
          Review update history ({items.length})
        </span>
      </summary>
      <ul className="border-t border-[var(--sg-color-border)] px-4 py-3">
        {items.map((item) => (
          <li
            key={`${item.date}-${item.label}`}
            className="flex flex-wrap items-baseline justify-between gap-2 py-1.5 text-sm"
          >
            <span className="text-[var(--sg-color-text-muted)]">{item.label}</span>
            <time
              dateTime={item.date}
              className="shrink-0 tabular-nums text-xs font-medium text-[var(--sg-color-text)]"
            >
              {item.date}
            </time>
          </li>
        ))}
      </ul>
    </details>
  );
}
