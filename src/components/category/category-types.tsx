import Link from "next/link";
import {
  EXPLORE_TONE_CLASSES,
  resolveHubIcon,
  withSingleArrow,
} from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CategoryTypeItem = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  href?: string;
  ctaLabel?: string;
};

type Props = {
  title: string;
  items: CategoryTypeItem[];
  className?: string;
};

const TYPE_TONES = ["blue", "violet", "green", "teal", "amber", "pink"] as const;

export function CategoryTypes({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="types"
      aria-labelledby="category-types-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="category-types-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item, index) => {
          const Icon = resolveHubIcon(item.icon);
          const toneKey = TYPE_TONES[index % TYPE_TONES.length]!;
          const tone = EXPLORE_TONE_CLASSES[toneKey]!;
          const body = (
            <Card
              variant={item.href ? "interactive" : "default"}
              className="flex h-full flex-col p-4"
            >
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                  tone,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {item.name}
              </p>
              <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {item.href ? (
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow(
                    item.ctaLabel ?? `Explore ${item.name}`,
                  )}
                </span>
              ) : null}
            </Card>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="group block h-full">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
