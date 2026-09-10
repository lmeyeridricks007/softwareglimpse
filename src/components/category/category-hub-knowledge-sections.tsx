import Link from "next/link";
import type { HubSection } from "@/services/seo/knowledge-graph/types";
import { cn } from "@/lib/cn";

type Props = {
  sections: HubSection[];
  className?: string;
};

/**
 * Organized hub navigation — capped sections, not a link dump.
 * IMPROVE destinations may appear when they carry real buyer value.
 */
export function CategoryHubKnowledgeSections({ sections, className }: Props) {
  if (!sections.length) return null;
  return (
    <section
      id="start-here"
      className={cn("scroll-mt-28 space-y-10", className)}
      aria-label="Start here and related paths"
    >
      {sections.map((section) => (
        <div key={section.id}>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {section.title}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {section.links.map((item) => (
              <li key={`${section.id}-${item.href}`}>
                <Link
                  href={item.href}
                  className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {item.label}
                  {item.description ? (
                    <span className="mt-1 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
