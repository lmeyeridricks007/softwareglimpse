import Link from "next/link";
import {
  Calculator,
  Compass,
  GitCompareArrows,
  Layers,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type DecisionPath = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: "finder" | "compare" | "browse" | "calculate" | "stack";
};

const ICONS: Record<DecisionPath["icon"], LucideIcon> = {
  finder: Compass,
  compare: GitCompareArrows,
  browse: LayoutGrid,
  calculate: Calculator,
  stack: Layers,
};

const TONES: Record<DecisionPath["icon"], string> = {
  finder: "bg-blue-50 text-blue-600",
  compare: "bg-violet-50 text-violet-600",
  browse: "bg-teal-50 text-teal-600",
  calculate: "bg-orange-50 text-orange-600",
  stack: "bg-emerald-50 text-emerald-600",
};

type Props = {
  paths: DecisionPath[];
  className?: string;
};

export function DecisionPathSection({ paths, className }: Props) {
  if (paths.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className,
      )}
    >
      {paths.map((path) => {
        const Icon = ICONS[path.icon];
        return (
          <li key={path.id}>
            <Link href={path.href} className="group block h-full">
              <Card
                variant="interactive"
                className="flex h-full flex-col p-5"
              >
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-[var(--sg-radius-md)]",
                    TONES[path.icon],
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {path.title}
                </p>
                <p className="mt-1 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {path.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--sg-color-primary)]">
                  {path.cta}
                </p>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
