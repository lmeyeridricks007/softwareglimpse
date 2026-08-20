import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  ChartColumn,
  Funnel,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Mail,
  Phone,
  ScrollText,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
  Code2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { hubToneClass } from "@/components/category/hub-icons";

export type FeatureCardItem = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  typeLabel?: string;
};

const ICONS: Record<string, LucideIcon> = {
  "multiple-pipelines": GitBranch,
  "workflow-automation": Workflow,
  "custom-pipeline-stages": Funnel,
  "email-sync": Mail,
  "lead-scoring": Target,
  "custom-fields": ListChecks,
  forecasting: ChartColumn,
  "reporting-dashboards": LayoutDashboard,
  calling: Phone,
  "email-sequences": Mail,
  sso: KeyRound,
  "audit-logs": ScrollText,
  "role-permissions": Shield,
  "api-access": Code2,
  "mobile-app": Smartphone,
  "ai-assistance": Brain,
};

export function FeatureExploreGrid({
  title = "Explore CRM features",
  items,
  className,
}: {
  title?: string;
  items: FeatureCardItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={cn(className)} aria-labelledby="feature-explore-heading">
      <h2
        id="feature-explore-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const Icon = ICONS[item.slug] ?? Sparkles;
          return (
            <li key={item.slug}>
              <Card className="flex h-full flex-col p-5">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full",
                    hubToneClass(index),
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                {item.typeLabel ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                    {item.typeLabel}
                  </p>
                ) : null}
                <p className="mt-1 font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 line-clamp-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Compare support →
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
