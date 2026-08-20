import {
  ArrowLeftRight,
  Calculator,
  ClipboardList,
  GanttChart,
  GitCompareArrows,
  Layers,
  Search,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";
import type { ToolDefinition } from "@/data/config/tools/registry";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const ICON_MAP: Record<ToolDefinition["icon"], LucideIcon> = {
  finder: Search,
  calculator: Calculator,
  stack: Layers,
  compare: GitCompareArrows,
  sparkles: Sparkles,
  builder: ClipboardList,
  scorecard: Table2,
  planner: GanttChart,
  migration: ArrowLeftRight,
};

const TONE_MAP: Record<
  "blue" | "emerald" | "violet" | "sky" | "orange" | "fuchsia",
  keyof typeof GUIDE_ICON_TONE_CLASSES
> = {
  blue: "blue",
  emerald: "emerald",
  violet: "violet",
  sky: "sky",
  orange: "orange",
  fuchsia: "fuchsia",
};

export function ToolIcon({
  icon,
  tone = "blue",
  className,
  size = "md",
}: {
  icon: ToolDefinition["icon"];
  tone?: keyof typeof TONE_MAP;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = ICON_MAP[icon];
  const box =
    size === "sm" ? "size-9" : size === "lg" ? "size-12" : "size-10";
  const glyph = size === "sm" ? "size-4" : size === "lg" ? "size-5" : "size-4";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
        box,
        GUIDE_ICON_TONE_CLASSES[TONE_MAP[tone]],
        className,
      )}
    >
      <Icon className={cn(glyph)} aria-hidden />
    </span>
  );
}
