"use client";

import type { CrmImplementationPlan } from "@/domain";
import { ButtonLink } from "@/components/ui/button";
import {
  openRiskCount,
  planCompletionPercent,
} from "@/services/implementation-planner";
import { ROLE_LABELS } from "@/services/implementation-planner/risks";
import { cn } from "@/lib/cn";
import Link from "next/link";

type Props = {
  plan: CrmImplementationPlan;
  className?: string;
  onViewPlan?: () => void;
};

export function ImplementationSidebar({ plan, className, onViewPlan }: Props) {
  const completed = planCompletionPercent(plan);
  const risks = openRiskCount(plan);
  const unresolvedGaps = plan.readinessGaps.filter((g) => !g.resolved).length;

  return (
    <aside
      className={cn(
        "space-y-4 lg:sticky lg:top-24 lg:self-start",
        className,
      )}
      aria-label="Implementation summary"
    >
      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Your implementation
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <Row
            label="CRM"
            value={
              plan.productName ??
              (plan.vendorNeutral ? "Vendor-neutral" : "Not selected")
            }
          />
          <Row label="Users" value={plan.scope.users?.toString() ?? "—"} />
          <Row
            label="Complexity"
            value={plan.complexity?.level ?? "—"}
          />
          <Row
            label="Target go-live"
            value={plan.targetGoLive ?? "No fixed date"}
          />
          <Row
            label="Duration"
            value={
              plan.planningDurationWeeks
                ? `≈ ${plan.planningDurationWeeks} weeks`
                : "—"
            }
          />
          <Row
            label="Phases"
            value={String(plan.phases.filter((p) => p.included).length)}
          />
          <Row label="Tasks" value={String(plan.tasks.length)} />
          <Row label="Completed" value={`${completed}%`} />
          <Row label="Open risks" value={String(risks)} />
          <Row label="Open decisions" value={String(unresolvedGaps)} />
        </dl>
        {onViewPlan ? (
          <button
            type="button"
            onClick={onViewPlan}
            className="mt-4 w-full rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            View full plan
          </button>
        ) : null}
      </div>

      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-primary-soft)]/40 p-4 text-sm">
        <p className="font-medium text-[var(--sg-color-navy)]">Quick links</p>
        <ul className="mt-2 space-y-1.5">
          <li>
            <Link
              href="/tools/crm-requirements-builder/?from=implementation"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Edit requirements
            </Link>
          </li>
          <li>
            <Link
              href="/tools/crm-vendor-scorecard/?from=implementation"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Vendor scorecard
            </Link>
          </li>
          <li>
            <Link
              href="/tools/crm-tco-calculator/?from=implementation"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              TCO calculator
            </Link>
          </li>
          <li>
            <Link
              href="/tools/crm-migration-planner/?from=implementation"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Migration planner
            </Link>
          </li>
        </ul>
      </div>

      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
        <p className="text-sm font-medium text-[var(--sg-color-navy)]">
          Project roles
        </p>
        <ul className="mt-3 space-y-2">
          {plan.roles.slice(0, 6).map((role) => {
            const initials = ROLE_LABELS[role.roleId]
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2);
            return (
              <li key={role.roleId} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full text-[10px] font-semibold",
                    role.assigned
                      ? "bg-[var(--sg-color-primary)] text-white"
                      : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                  )}
                  aria-hidden
                >
                  {role.label?.slice(0, 2).toUpperCase() ?? initials}
                </span>
                <span className="text-[var(--sg-color-text)]">
                  {ROLE_LABELS[role.roleId]}
                  {!role.assigned ? (
                    <span className="ml-1 text-[var(--sg-color-text-muted)]">
                      (unassigned)
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
        <ButtonLink
          href="#roles"
          variant="outline"
          size="sm"
          className="mt-3 w-full"
        >
          Manage roles
        </ButtonLink>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--sg-color-text-muted)]">{label}</dt>
      <dd className="text-right font-medium capitalize text-[var(--sg-color-text)]">
        {value}
      </dd>
    </div>
  );
}

export function ImplementationMobileBar({
  plan,
  active,
  onChange,
}: {
  plan: CrmImplementationPlan;
  active: "plan" | "tasks" | "risks";
  onChange: (id: "plan" | "tasks" | "risks") => void;
}) {
  const risks = openRiskCount(plan);
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-2 lg:hidden"
      aria-label="Plan navigation"
    >
      <div className="mx-auto flex max-w-lg gap-1">
        {(
          [
            { id: "plan" as const, label: "Plan" },
            { id: "tasks" as const, label: "Tasks" },
            { id: "risks" as const, label: `Risks (${risks})` },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "flex-1 rounded-[var(--sg-radius-md)] px-2 py-2 text-xs font-medium",
              active === item.id
                ? "bg-[var(--sg-color-primary)] text-white"
                : "text-[var(--sg-color-text-muted)]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
