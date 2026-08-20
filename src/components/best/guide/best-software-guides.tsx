import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: BestPageModel["guides"];
  className?: string;
};

export function BestSoftwareGuides({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      <div className="mt-5 -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
        <ul className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {items.map((g, i) => (
            <li key={g.href} className="w-[16rem] sm:w-auto">
              <Card
                className={cn(
                  "flex h-full flex-col p-4",
                  g.featured || i === 0
                    ? "border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/35"
                    : "",
                )}
              >
                {(g.featured || i === 0) && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-primary)]">
                    Featured guide
                  </p>
                )}
                <Link
                  href={g.href}
                  className="mt-2 font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {g.title}
                </Link>
                {g.description ? (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {g.description}
                  </p>
                ) : (
                  <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    Buying guidance from SoftwareGlimpse recommendations.
                  </p>
                )}
                <Link
                  href={g.href}
                  className="mt-4 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Read guide →
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
