import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  whatItDoes: string[];
  bestFor: string[];
  typicalFeatures: string[];
  className?: string;
};

export function CategoryAtAGlance({
  title,
  whatItDoes,
  bestFor,
  typicalFeatures,
  className,
}: Props) {
  if (
    whatItDoes.length === 0 &&
    bestFor.length === 0 &&
    typicalFeatures.length === 0
  ) {
    return null;
  }

  const columns = [
    { heading: "What it does", items: whatItDoes },
    { heading: "Who it's best for", items: bestFor },
    { heading: "Typical features", items: typicalFeatures },
  ].filter((c) => c.items.length > 0);

  return (
    <section
      id="at-a-glance"
      aria-labelledby="at-a-glance-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="at-a-glance-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-6 grid gap-6",
          columns.length === 3
            ? "lg:grid-cols-3"
            : columns.length === 2
              ? "sm:grid-cols-2"
              : "",
        )}
      >
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {col.heading}
            </h3>
            <ul className="mt-3 space-y-2">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
