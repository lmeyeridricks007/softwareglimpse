import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ResearchUpdateItem = {
  href: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  changeLabel: string;
  dateLabel: string;
};

type Props = {
  items: ResearchUpdateItem[];
  className?: string;
};

export function ResearchUpdateFeed({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <Card className={cn("p-5", className)}>
      <h3 className="font-semibold text-[var(--sg-color-text)]">
        Recently updated research
      </h3>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 rounded-[var(--sg-radius-md)] px-1 py-2.5 hover:bg-[var(--sg-color-surface-muted)]"
            >
              <ProductLogo name={item.name} logo={item.logo} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[var(--sg-color-text)] transition-colors group-hover:text-[var(--sg-color-primary)]">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                  {item.changeLabel}
                  <span aria-hidden> · </span>
                  {item.dateLabel}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
