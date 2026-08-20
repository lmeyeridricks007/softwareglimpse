import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ThingsToKnowItem = {
  title: string;
  body: string;
};

type Props = {
  productName: string;
  items: ThingsToKnowItem[];
  className?: string;
};

export function SoftwareThingsToKnow({
  productName,
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="things-to-know-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="things-to-know-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Things to know about {productName}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.title}>
            <Card variant="soft" className="h-full">
              <h3 className="font-semibold capitalize text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                {item.body}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
