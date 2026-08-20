import { Check, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  pros?: string[];
  cons?: string[];
  className?: string;
};

export function SoftwareProsCons({
  name,
  pros = [],
  cons = [],
  className,
}: Props) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <section
      id="pros-cons"
      aria-labelledby="pros-cons-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="pros-cons-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {name} pros and cons
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {pros.length > 0 ? (
          <Card variant="soft" className="bg-[var(--sg-color-success-soft)]/35">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--sg-color-text)]">
              <Check
                className="size-4 text-[var(--sg-color-success)]"
                aria-hidden
              />
              Pros
            </h3>
            <ul className="mt-3 space-y-2">
              {pros.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
        {cons.length > 0 ? (
          <Card variant="soft" className="bg-[var(--sg-color-warning-soft)]/40">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--sg-color-text)]">
              <Minus
                className="size-4 text-[var(--sg-color-warning)]"
                aria-hidden
              />
              Cons
            </h3>
            <ul className="mt-3 space-y-2">
              {cons.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Minus
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
