"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Layers, Search } from "lucide-react";
import type { CompareHubTool } from "@/services/compare-hub";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { track } from "@/analytics/events";
import { cn } from "@/lib/cn";

const ICONS = {
  "crm-finder": Search,
  "crm-cost": Calculator,
  "stack-builder": Layers,
} as const;

const TONES = {
  "crm-finder": GUIDE_ICON_TONE_CLASSES.emerald,
  "crm-cost": GUIDE_ICON_TONE_CLASSES.amber,
  "stack-builder": GUIDE_ICON_TONE_CLASSES.violet,
} as const;

type Props = {
  tools: CompareHubTool[];
  /** Vertical stack for the mockup’s decision-tools column. */
  variant?: "grid" | "stack";
  className?: string;
};

export function ComparisonToolCta({
  tools,
  variant = "grid",
  className,
}: Props) {
  if (tools.length === 0) return null;

  if (variant === "stack") {
    return (
      <div className={cn(className)}>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Decision tools
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Need more than a side-by-side?
        </p>
        <ul className="mt-4 space-y-2.5">
          {tools.map((tool) => {
            const Icon = ICONS[tool.id as keyof typeof ICONS] ?? Search;
            const tone =
              TONES[tool.id as keyof typeof TONES] ??
              GUIDE_ICON_TONE_CLASSES.blue;
            return (
              <li key={tool.id}>
                <Link
                  href={tool.href}
                  onClick={() =>
                    track({
                      name: "comparison_tool_clicked",
                      properties: { tool: tool.id },
                    })
                  }
                  className="group flex items-start gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3.5 transition hover:border-[var(--sg-color-primary)]"
                >
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      tone,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {tool.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                      {tool.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-[var(--sg-color-text-muted)]"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Need more than a side-by-side comparison?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Use interactive tools that share the same research model.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {tools.map((tool) => {
          const Icon = ICONS[tool.id as keyof typeof ICONS] ?? Search;
          const tone =
            TONES[tool.id as keyof typeof TONES] ?? GUIDE_ICON_TONE_CLASSES.blue;
          return (
            <li key={tool.id}>
              <Link
                href={tool.href}
                onClick={() =>
                  track({
                    name: "comparison_tool_clicked",
                    properties: { tool: tool.id },
                  })
                }
                className="group flex h-full flex-col rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-md)]"
              >
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-[var(--sg-radius-md)] border",
                    tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-[var(--sg-color-text)]">
                  {tool.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                  Open tool
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
