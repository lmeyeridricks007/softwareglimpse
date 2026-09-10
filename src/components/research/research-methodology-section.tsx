import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ResearchMethodologySection({ children, className }: Props) {
  return (
    <section
      className={cn("space-y-4", className)}
      aria-labelledby="research-methodology-heading"
    >
      <h2
        id="research-methodology-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Methodology
      </h2>
      {children}
    </section>
  );
}
