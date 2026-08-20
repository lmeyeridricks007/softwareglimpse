"use client";

import {
  Building2,
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Link2,
  Shield,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import type { CrmDecisionProfile } from "@/domain";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  INTEGRATION_OPTIONS,
  labelForOption,
} from "@/components/finder/crm-finder-questions";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  crmRequirementsBuilderDefinition,
} from "../crm/definition";
import { siRequirementsBuilderDefinition } from "../si/definition";
import { PriorityBadge } from "./priority-controls";
import {
  currentStateLabel,
  industryLabel,
  teamLabels,
} from "@/services/decision-profile/export-documents";
import {
  isSiProfile,
  listSelectableCapabilitiesForProfile,
  listSelectableUseCasesForProfile,
  profileTitleForExport,
  resolveRequirementMetaForProfile,
  usersLabelForProfile,
  type ProfileCompleteness,
  type ProfileWarning,
} from "@/services/decision-profile/client";
import { cn } from "@/lib/cn";
import { SI_INTEGRATION_OPTIONS } from "../si/definition";

function featureLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type Props = {
  profile: CrmDecisionProfile;
  completeness: ProfileCompleteness;
  warnings: ProfileWarning[];
  copyStatus: string | null;
  onCopy: () => void;
  onPdf: () => void;
  onExcel: () => void;
  onJson: () => void;
};

export function ProfileResultsView({
  profile,
  completeness,
  warnings,
  copyStatus,
  onCopy,
  onPdf,
  onExcel,
  onJson,
}: Props) {
  const useCases = listSelectableUseCasesForProfile(profile);
  const caps = listSelectableCapabilitiesForProfile(profile);
  const bc = profile.businessContext;
  const si = isSiProfile(profile);
  const noun = si ? "sales intelligence" : "CRM";
  const title = profileTitleForExport(profile);
  const usersLabel = usersLabelForProfile(profile);
  const def = si
    ? siRequirementsBuilderDefinition
    : crmRequirementsBuilderDefinition;
  const integrationLabel = (id: string) => {
    if (si) {
      return (
        SI_INTEGRATION_OPTIONS.find((o) => o.value === id)?.label ??
        labelForOption(INTEGRATION_OPTIONS, id) ??
        id
      );
    }
    return labelForOption(INTEGRATION_OPTIONS, id) || id;
  };

  const mustReqs = profile.requirements.filter((r) => r.priority === "must-have");
  const importantReqs = profile.requirements.filter(
    (r) => r.priority === "important",
  );
  const niceReqs = profile.requirements.filter(
    (r) => r.priority === "nice-to-have",
  );

  const requirementsByCapability = new Map<
    string,
    CrmDecisionProfile["requirements"]
  >();
  for (const req of profile.requirements.filter(
    (r) => r.priority !== "not-needed",
  )) {
    const meta = resolveRequirementMetaForProfile(profile, req.id);
    const key = meta?.capabilityName ?? "Other";
    const list = requirementsByCapability.get(key) ?? [];
    list.push(req);
    requirementsByCapability.set(key, list);
  }

  return (
    <div className="space-y-5">
      {/* Hero header */}
      <Card className="overflow-hidden border-[var(--sg-color-primary)]/20 p-0 shadow-[var(--sg-shadow-md)]">
        <div className="bg-gradient-to-br from-[var(--sg-color-primary-soft)] via-[var(--sg-color-surface)] to-[var(--sg-color-surface-tint)] px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                <ClipboardList className="size-4" aria-hidden />
                Profile complete
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)] sm:text-3xl">
                Your {title.replace(" Profile", "")}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
                Use this profile to compare {noun} products, run the Finder,
                calculate cost or evaluate vendors — without product rankings
                here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="lg" onClick={onPdf}>
                <FileText className="size-4" aria-hidden />
                Download PDF
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={onExcel}>
                <FileSpreadsheet className="size-4" aria-hidden />
                Download Excel
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi
              label="Must have"
              value={String(mustReqs.length)}
              tone="primary"
            />
            <Kpi
              label="Important"
              value={String(importantReqs.length)}
              tone="warning"
            />
            <Kpi
              label={usersLabel}
              value={bc.crmUserCount != null ? String(bc.crmUserCount) : "—"}
              tone="neutral"
            />
            <Kpi
              label="Budget"
              value={
                labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "—"
              }
              tone="neutral"
              compact
            />
          </div>
        </div>
      </Card>

      {warnings.map((w) => (
        <Alert key={w.id} variant="warning">
          {w.message}
        </Alert>
      ))}

      {/* Business */}
      <SectionCard
        icon={<Building2 className="size-4" aria-hidden />}
        title="Business context"
        subtitle={`Who this ${noun} tool is for`}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Fact
            label="Industry"
            value={industryLabel(bc.industrySlug)}
          />
          <Fact
            label="Company size"
            value={
              labelForOption(COMPANY_SIZE_OPTIONS, bc.companySizeSlug) ??
              "Unknown"
            }
          />
          <Fact
            label={usersLabel}
            value={bc.crmUserCount != null ? String(bc.crmUserCount) : "Unknown"}
          />
          <Fact label="Primary teams" value={teamLabels(bc.teamIds, profile)} />
          <Fact
            label="Current state"
            value={currentStateLabel(bc.currentState, profile)}
          />
          {bc.businessTypeSlug ? (
            <Fact
              label="Business type"
              value={bc.businessTypeSlug.replaceAll("-", " ")}
            />
          ) : null}
        </div>
      </SectionCard>

      {/* Use cases */}
      <SectionCard
        icon={<Target className="size-4" aria-hidden />}
        title="Use cases"
        subtitle={`What you need ${noun} for`}
      >
        {profile.useCases.length === 0 ? (
          <Empty>No use cases selected</Empty>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.useCases.map((u) => {
              const name =
                useCases.find((x) => x.slug === u.id)?.name ?? u.id;
              return (
                <div
                  key={u.id}
                  className={cn(
                    "rounded-[var(--sg-radius-lg)] border p-4",
                    u.priority === "primary"
                      ? "border-[var(--sg-color-primary)]/40 bg-[var(--sg-color-primary-soft)]/40"
                      : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
                  )}
                >
                  <PriorityBadge priority={u.priority} />
                  <p className="mt-2 font-semibold text-[var(--sg-color-navy)]">
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Capabilities */}
      <SectionCard
        icon={<Layers className="size-4" aria-hidden />}
        title="Capabilities"
        subtitle={`Priority profile across ${noun} areas`}
      >
        {profile.capabilities.length === 0 ? (
          <Empty>No capabilities selected</Empty>
        ) : (
          <ul className="space-y-2">
            {[...profile.capabilities]
              .sort(
                (a, b) =>
                  capabilityRank(b.priority) - capabilityRank(a.priority),
              )
              .map((c) => {
                const name =
                  caps.find((x) => x.slug === c.id)?.name ?? c.id;
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "h-8 w-1.5 shrink-0 rounded-full",
                        c.priority === "critical"
                          ? "bg-[var(--sg-color-primary)]"
                          : c.priority === "high"
                            ? "bg-[var(--sg-color-warning)]"
                            : "bg-[var(--sg-color-border)]",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 font-medium text-[var(--sg-color-navy)]">
                      {name}
                    </span>
                    <PriorityBadge priority={c.priority} />
                  </li>
                );
              })}
          </ul>
        )}
      </SectionCard>

      {/* Requirements */}
      <SectionCard
        icon={<CheckCircle2 className="size-4" aria-hidden />}
        title="Requirements"
        subtitle={`${mustReqs.length} must have · ${importantReqs.length} important · ${niceReqs.length} nice to have`}
      >
        {requirementsByCapability.size === 0 ? (
          <Empty>No requirements selected</Empty>
        ) : (
          <div className="space-y-4">
            {[...requirementsByCapability.entries()].map(([capName, reqs]) => (
              <div
                key={capName}
                className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/30 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {capName}
                </p>
                <ul className="mt-3 space-y-2">
                  {reqs.map((r) => {
                    const meta = resolveRequirementMetaForProfile(profile, r.id);
                    return (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-start justify-between gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface)] px-3 py-2.5"
                      >
                        <span className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-navy)]">
                          <Check
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              r.priority === "must-have"
                                ? "text-[var(--sg-color-success)]"
                                : "text-[var(--sg-color-text-muted)]",
                            )}
                            aria-hidden
                          />
                          {meta?.href ? (
                            <a
                              href={meta.href}
                              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                            >
                              {meta.name}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {meta?.name ?? r.id}
                            </span>
                          )}
                        </span>
                        <PriorityBadge priority={r.priority} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Features */}
      <SectionCard
        icon={<Sparkles className="size-4" aria-hidden />}
        title="Feature requirements"
        subtitle="Derived from requirements plus any direct selections"
      >
        <div className="space-y-4">
          {(
            [
              ["must-have", "Must have"],
              ["important", "Important"],
              ["nice-to-have", "Nice to have"],
            ] as const
          ).map(([priority, label]) => {
            const items = profile.features.filter(
              (f) => f.priority === priority,
            );
            if (!items.length) return null;
            return (
              <div key={priority}>
                <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                  {label}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((f) => (
                    <span
                      key={f.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-sm",
                        priority === "must-have"
                          ? "border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/50 text-[var(--sg-color-navy)]"
                          : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)]",
                      )}
                    >
                      <Check
                        className="size-3.5 text-[var(--sg-color-success)]"
                        aria-hidden
                      />
                      {featureLabel(f.id)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {profile.features.length === 0 ? (
            <Empty>No feature requirements yet</Empty>
          ) : null}
        </div>
      </SectionCard>

      {/* Integrations + Security + Constraints */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          icon={<Link2 className="size-4" aria-hidden />}
          title="Integrations"
          subtitle={`Systems the ${noun} tool should connect to`}
        >
          {profile.integrations.length === 0 ? (
            <Empty>None specified</Empty>
          ) : (
            <ul className="space-y-2">
              {profile.integrations.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
                >
                  <span className="font-medium text-[var(--sg-color-navy)]">
                    {integrationLabel(i.id)}
                  </span>
                  <PriorityBadge priority={i.priority} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          icon={<Wallet className="size-4" aria-hidden />}
          title="Constraints"
          subtitle="Budget and setup preferences"
        >
          <div className="grid grid-cols-2 gap-3">
            <Fact
              label="Budget"
              value={
                labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "Unknown"
              }
            />
            <Fact
              label="Billing"
              value={profile.budget.billingPreference ?? "Unknown"}
            />
            <Fact
              label="Implementation"
              value={
                labelForOption(
                  EASE_OPTIONS,
                  profile.implementation.complexity,
                ) ?? "Unknown"
              }
            />
            <Fact
              label="Migration"
              value={
                profile.implementation.migrationComplexity ?? "Unknown"
              }
            />
            {profile.implementation.adminComplexity ? (
              <Fact
                label="Admin complexity"
                value={profile.implementation.adminComplexity.replaceAll(
                  "-",
                  " ",
                )}
              />
            ) : null}
          </div>
        </SectionCard>
      </div>

      {/* Completeness */}
      <SectionCard
        icon={<Shield className="size-4" aria-hidden />}
        title="Requirements completeness"
        subtitle="Explicit section status — not a fake percentage"
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {completeness.sections.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
            >
              {s.status === "complete" ? (
                <CheckCircle2
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
              ) : s.status === "partial" ? (
                <Circle
                  className="size-4 shrink-0 text-[var(--sg-color-warning)]"
                  aria-hidden
                />
              ) : (
                <Circle
                  className="size-4 shrink-0 text-[var(--sg-color-border)]"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1 font-medium text-[var(--sg-color-navy)]">
                {s.label}
              </span>
              <span className="capitalize text-xs text-[var(--sg-color-text-muted)]">
                {s.status.replace("-", " ")}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Export + next */}
      <Card className="border-[var(--sg-color-border)] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h4 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
              Export & share offline
            </h4>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Download a PDF report or Excel spreadsheet for vendor evaluations.
              Copies and JSON exports stay on this device.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onPdf}>
              <FileText className="size-4" aria-hidden />
              Download PDF
            </Button>
            <Button type="button" variant="outline" onClick={onExcel}>
              <FileSpreadsheet className="size-4" aria-hidden />
              Download Excel
            </Button>
            <Button type="button" variant="outline" onClick={onCopy}>
              Copy summary
            </Button>
            <Button type="button" variant="outline" onClick={onJson}>
              <Download className="size-4" aria-hidden />
              JSON
            </Button>
          </div>
        </div>
        {copyStatus ? (
          <p className="mt-3 text-sm text-[var(--sg-color-success)]" role="status">
            {copyStatus}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-5">
          <div className="flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
            <Users className="size-4" aria-hidden />
            Ready to find products that match this profile?
          </div>
          <ButtonLink href={def.finderHref}>
            Find matching {si ? "tools" : "CRMs"} →
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}

function capabilityRank(priority: string): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "important":
      return 2;
    default:
      return 1;
  }
}

function Kpi({
  label,
  value,
  tone,
  compact,
}: {
  label: string;
  value: string;
  tone: "primary" | "warning" | "neutral";
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border px-3 py-3",
        tone === "primary"
          ? "border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-surface)]"
          : tone === "warning"
            ? "border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-surface)]"
            : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-[family-name:var(--font-display)] font-semibold text-[var(--sg-color-navy)]",
          compact ? "text-sm leading-snug" : "text-2xl tabular-nums",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-[var(--sg-color-border)] p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
          {icon}
        </span>
        <div>
          <h4 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
            {title}
          </h4>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--sg-color-navy)]">
        {value}
      </p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[var(--sg-color-text-muted)]">{children}</p>
  );
}
