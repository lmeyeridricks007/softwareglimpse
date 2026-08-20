import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Funnel,
  Headset,
  Megaphone,
  ShoppingCart,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type BestUseCaseCard = {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon?: "sales" | "support" | "marketing" | "ecommerce" | "automation" | "generic";
};

const ICONS: Record<NonNullable<BestUseCaseCard["icon"]>, LucideIcon> = {
  sales: Funnel,
  support: Headset,
  marketing: Megaphone,
  ecommerce: ShoppingCart,
  automation: Workflow,
  generic: Sparkles,
};

type Props = {
  title?: string;
  items: BestUseCaseCard[];
  className?: string;
};

export function BestUseCaseGrid({
  title = "Best software by use case",
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="use-cases"
      className={cn("scroll-mt-28", className)}
      aria-labelledby="best-use-cases-heading"
    >
      <h2
        id="best-use-cases-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon ?? "generic"];
          return (
            <li key={item.slug}>
              <Card className="h-full">
                <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  View top picks →
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
