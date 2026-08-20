import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  items: BestPageModel["companySizes"];
  className?: string;
};

export function BestSoftwareCompanySizes({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Best by business size
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="h-full p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Explore →
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
