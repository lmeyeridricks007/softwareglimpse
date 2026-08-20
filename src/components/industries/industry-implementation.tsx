import { createElement } from "react";
import {
  resolveIndustryIcon,
} from "@/components/industries/industry-hub-icons";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

type Props = {
  title?: string;
  items: Item[];
  className?: string;
};

export function IndustryImplementation({
  title = "Before you choose a CRM",
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="implementation"
      aria-labelledby="implementation-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="implementation-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="h-full p-4">
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index + 1),
                  )}
                >
                  {createElement(Icon, {
                    className: "size-4",
                    "aria-hidden": true,
                  })}
                </span>
                <p className="mt-3 text-sm font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
