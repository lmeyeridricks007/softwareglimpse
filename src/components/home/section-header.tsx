import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  align = "left",
}: Props) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-text)]",
            eyebrow && "mt-1",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
