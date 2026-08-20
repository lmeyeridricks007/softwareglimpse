import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Calculator,
  Clock,
  Gift,
  Layers,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type ToolHeroValueProp = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const FINDER_PROPS: ToolHeroValueProp[] = [
  {
    icon: Gift,
    title: "Free to use",
    body: "No signup required to get a shortlist.",
  },
  {
    icon: Sparkles,
    title: "Personalized fit",
    body: "Scored from your answers and catalogue evidence.",
  },
  {
    icon: SearchCheck,
    title: "Independent model",
    body: "Affiliate status never changes Finder rankings.",
  },
];

export const CALCULATOR_VALUE_PROPS: ToolHeroValueProp[] = [
  {
    icon: ShieldCheck,
    title: "100% free",
    body: "No signup required.",
  },
  {
    icon: Calculator,
    title: "Verified pricing",
    body: "Based on verified public list prices.",
  },
  {
    icon: Wallet,
    title: "Plan comparison",
    body: "Compare seat costs across catalogue tools.",
  },
];

export function calculatorValuePropsFor(
  productNounPlural: string,
): ToolHeroValueProp[] {
  return CALCULATOR_VALUE_PROPS.map((prop) =>
    prop.title === "Plan comparison"
      ? {
          ...prop,
          body: `Compare seat costs across ${productNounPlural}.`,
        }
      : prop,
  );
}

export const STACK_VALUE_PROPS: ToolHeroValueProp[] = [
  {
    icon: Gift,
    title: "100% free",
    body: "No signup required.",
  },
  {
    icon: Sparkles,
    title: "Personalized",
    body: "Built around your business profile.",
  },
  {
    icon: SearchCheck,
    title: "Independent picks",
    body: "Affiliate status never sets the order.",
  },
  {
    icon: Clock,
    title: "Save time",
    body: "Start from a structured shortlist path.",
  },
];

type Props = {
  title: ReactNode;
  description: string;
  valueProps?: ToolHeroValueProp[];
  visual?: "finder" | "calculator" | "stack";
  /** When set, replaces the built-in decorative visual (e.g. live calculator preview). */
  visualSlot?: ReactNode;
  badge?: string;
  className?: string;
  /**
   * When the route already rendered an SSR `<h1>`, pass `h2` (or omit title)
   * so Suspense fallbacks still expose a document heading.
   */
  titleElement?: "h1" | "h2" | "none";
};

export function FinderPageHero({
  title,
  description,
  valueProps = FINDER_PROPS,
  visual = "finder",
  visualSlot,
  badge,
  className,
  titleElement = "h1",
}: Props) {
  const cols =
    valueProps.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-3";

  const TitleTag = titleElement === "h2" ? "h2" : "h1";

  return (
    <header
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
        className,
      )}
    >
      <div>
        {badge ? (
          <Badge variant="success" className="mb-3">
            {badge}
          </Badge>
        ) : null}
        {titleElement !== "none" ? (
          <TitleTag className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </TitleTag>
        ) : null}
        <p
          className={cn(
            "max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]",
            titleElement === "none" ? "mt-0" : "mt-3",
          )}
        >
          {description}
        </p>
        <ul className={cn("mt-6 grid gap-4", cols)}>
          {valueProps.map(({ icon: Icon, title: t, body }) => (
            <li key={t} className="flex gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--sg-color-text)]">
                  {t}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {visualSlot ? (
        <div className="hidden lg:block">{visualSlot}</div>
      ) : visual === "calculator" ? (
        <CalculatorHeroVisual />
      ) : visual === "stack" ? (
        <StackHeroVisual />
      ) : (
        <FinderHeroVisual />
      )}
    </header>
  );
}

function FinderHeroVisual() {
  return (
    <div
      className="relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-[var(--sg-color-surface-tint)] to-[var(--sg-color-primary-soft)] p-6 shadow-[var(--sg-shadow-md)] lg:block"
      aria-hidden
    >
      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]">
        <div className="flex items-center gap-2">
          <span className="size-8 rounded-full bg-[var(--sg-color-primary-soft)]" />
          <div className="h-2 flex-1 rounded bg-[var(--sg-color-border)]" />
        </div>
        <ul className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="size-4 rounded border-2 border-[var(--sg-color-primary)]" />
              <span className="h-2 flex-1 rounded bg-[var(--sg-color-surface-muted)]" />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute -right-2 -bottom-2 size-24 rounded-full border-8 border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-surface)]/80" />
    </div>
  );
}

function CalculatorHeroVisual() {
  return (
    <div
      className="relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-[var(--sg-color-surface-tint)] to-[var(--sg-color-success-soft)] p-6 shadow-[var(--sg-shadow-md)] lg:block"
      aria-hidden
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded bg-[var(--sg-color-surface-muted)] text-[10px] font-semibold text-[var(--sg-color-text-muted)]"
              >
                {i === 8 ? "=" : i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3">
          <div className="h-2 w-16 rounded bg-[var(--sg-color-border)]" />
          <div className="mt-3 flex h-16 items-end gap-1">
            {[35, 55, 40, 75, 60].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-[var(--sg-color-primary)]/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="col-span-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3">
          <div className="mx-auto size-16 rounded-full border-[6px] border-[var(--sg-color-success)] border-r-[var(--sg-color-primary-soft)] border-b-[var(--sg-color-border)]" />
        </div>
      </div>
    </div>
  );
}

function StackHeroVisual() {
  const nodes = [
    { top: "12%", left: "18%", label: "CRM" },
    { top: "18%", left: "68%", label: "Email" },
    { top: "62%", left: "12%", label: "PM" },
    { top: "68%", left: "72%", label: "Support" },
  ];
  return (
    <div
      className="relative hidden aspect-square max-h-72 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-[var(--sg-color-primary-soft)]/40 to-[var(--sg-color-surface-tint)] p-6 shadow-[var(--sg-shadow-md)] lg:block"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex size-20 items-center justify-center rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)] shadow-[var(--sg-shadow-md)]">
          <Layers className="size-9" />
        </span>
      </div>
      {nodes.map((node) => (
        <span
          key={node.label}
          className="absolute inline-flex items-center gap-1.5 rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]"
          style={{ top: node.top, left: node.left }}
        >
          <span className="size-2 rounded-full bg-[var(--sg-color-primary)]" />
          {node.label}
        </span>
      ))}
    </div>
  );
}
