import { cn } from "@/lib/cn";

export type GuideTocItem = {
  id: string;
  label: string;
};

type Props = {
  items: GuideTocItem[];
  className?: string;
};

/** Main-column numbered TOC — supporting-article mockup “In this article”. */
export function GuideInThisArticle({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5",
        className,
      )}
      aria-labelledby="guide-in-this-article-heading"
    >
      <h2
        id="guide-in-this-article-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
      >
        In this article
      </h2>
      <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex items-baseline gap-2 text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
            >
              <span className="font-semibold text-[var(--sg-color-primary)]">
                {index + 1}.
              </span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
