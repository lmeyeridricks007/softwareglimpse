import {
  CalendarClock,
  Goal,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  industryLabel: string;
  primaryGoal?: string | null;
  commonPriorities?: string[];
  teamTypes?: string[];
  researchedProductCount: number;
  lastReviewedAt?: string | null;
  className?: string;
};

export function IndustryGlanceStrip({
  industryLabel,
  primaryGoal,
  commonPriorities = [],
  teamTypes = [],
  researchedProductCount,
  lastReviewedAt,
  className,
}: Props) {
  const items = [
    primaryGoal
      ? {
          label: "Primary goal",
          value: primaryGoal,
          Icon: Goal,
        }
      : null,
    commonPriorities.length > 0
      ? {
          label: "Common priorities",
          value: commonPriorities.join(" · "),
          Icon: ListChecks,
        }
      : null,
    teamTypes.length > 0
      ? {
          label: "Team types",
          value: teamTypes.join(" · "),
          Icon: Users,
        }
      : null,
    {
      label: "Catalogue coverage",
      value: `${researchedProductCount} catalogue CRM ${
        researchedProductCount === 1 ? "product" : "products"
      }`,
      Icon: ShieldCheck,
    },
    lastReviewedAt
      ? {
          label: "Last reviewed",
          value: formatReviewDate(lastReviewedAt),
          Icon: CalendarClock,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    Icon: typeof Goal;
  }>;

  if (items.length === 0) return null;

  return (
    <section
      aria-label={`${industryLabel} CRM at a glance`}
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4 sm:px-6",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {industryLabel} CRM at a glance
      </p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(({ label, value, Icon }) => (
          <li key={label} className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              <Icon className="size-3.5" aria-hidden />
              {label}
            </span>
            <p className="mt-1 text-sm text-[var(--sg-color-text)]">{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
