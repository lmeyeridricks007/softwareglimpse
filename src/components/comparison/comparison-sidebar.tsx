import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type SidebarComparison = {
  href: string;
  label: string;
};

export type SidebarGuide = {
  href: string;
  label: string;
};

export function ComparisonSidebar({
  comparisons,
  guides,
  className,
}: {
  comparisons: SidebarComparison[];
  guides: SidebarGuide[];
  className?: string;
}) {
  if (comparisons.length === 0 && guides.length === 0) return null;

  return (
    <aside className={cn("space-y-5", className)}>
      {comparisons.length > 0 ? (
        <Card aria-labelledby="popular-comparisons-heading">
          <h2
            id="popular-comparisons-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Popular comparisons
          </h2>
          <ul className="mt-3 space-y-2">
            {comparisons.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-2 text-sm text-[var(--sg-color-text)]"
                >
                  <span className="underline-offset-2 group-hover:underline">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[var(--sg-color-primary)]">
                    Compare
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {guides.length > 0 ? (
        <Card aria-labelledby="related-guides-heading">
          <h2
            id="related-guides-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Related guides
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                >
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </aside>
  );
}
