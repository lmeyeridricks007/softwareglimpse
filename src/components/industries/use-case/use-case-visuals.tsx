import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type UseCaseVisualKind =
  | "relationship"
  | "pipeline-sales"
  | "volume"
  | "complex"
  | "growing"
  | "default";

const SLUG_TO_KIND: Record<string, UseCaseVisualKind> = {
  "relationship-management": "relationship",
  "advisory-relationship-management": "relationship",
  "pipeline-led-sales": "pipeline-sales",
  "high-volume-lead-management": "volume",
  "complex-sales-processes": "complex",
  "growing-teams": "growing",
};

export function useCaseVisualKindForSlug(slug: string): UseCaseVisualKind {
  return SLUG_TO_KIND[slug] ?? "default";
}

export function useCaseHowItWorksCaption(
  useCaseName: string,
  industryName: string,
  kind: UseCaseVisualKind,
): string {
  switch (kind) {
    case "relationship":
      return `How ${industryName.toLowerCase()} relationship teams keep context, ownership, and follow-up on one client record.`;
    case "pipeline-sales":
      return `How pipeline-led ${industryName.toLowerCase()} teams move opportunities through stages with clear next actions.`;
    case "volume":
      return `How high-volume teams route, respond, and qualify large enquiry loads without losing ownership.`;
    case "complex":
      return `How multi-stakeholder ${industryName.toLowerCase()} deals need stages, approvals, and shared visibility.`;
    case "growing":
      return `How growing ${industryName.toLowerCase()} teams start simple, then add process as adoption sticks.`;
    default:
      return `Conceptual view of how ${useCaseName.toLowerCase()} work typically uses CRM.`;
  }
}

export function UseCaseConceptVisual({
  kind,
  useCaseName,
  className,
}: {
  kind: UseCaseVisualKind;
  useCaseName: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[#eff6ff] via-white to-[#e0f2fe]",
        className,
      )}
    >
      <div className="relative min-h-[14rem] p-5 sm:p-6" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgb(37_99_235/0.12),transparent_55%)]" />
        <div className="relative">
          <VisualArt kind={kind} />
        </div>
      </div>
      <figcaption className="border-t border-[var(--sg-color-border)] bg-white/80 px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
        Educational diagram — not a product screenshot. Explains{" "}
        {useCaseName.toLowerCase()} as a buyer scenario.
      </figcaption>
    </figure>
  );
}

function Panel({
  title,
  children,
  tone = "white",
}: {
  title: string;
  children?: ReactNode;
  tone?: "white" | "blue" | "soft";
}) {
  const toneClass =
    tone === "blue"
      ? "border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/70"
      : tone === "soft"
        ? "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
        : "border-[var(--sg-color-border)] bg-white";
  return (
    <div className={cn("rounded-md border px-2.5 py-2 shadow-sm", toneClass)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-navy)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function DotRow({ labels }: { labels: string[] }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded bg-[var(--sg-color-primary-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--sg-color-navy)]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <span className="self-center text-xs font-semibold text-[var(--sg-color-primary)]">
      →
    </span>
  );
}

function VisualArt({ kind }: { kind: UseCaseVisualKind }) {
  switch (kind) {
    case "relationship":
      return (
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <Panel title="Client context" tone="blue">
            <DotRow labels={["History", "Preferences"]} />
          </Panel>
          <Arrow />
          <Panel title="Owner">
            <DotRow labels={["Advisor / AE"]} />
          </Panel>
          <Arrow />
          <Panel title="Follow-up" tone="soft">
            <DotRow labels={["Tasks", "Next meeting"]} />
          </Panel>
        </div>
      );
    case "pipeline-sales":
      return (
        <div className="grid gap-2 sm:grid-cols-4">
          {["Prospect", "Qualify", "Propose", "Close"].map((stage, i) => (
            <Panel key={stage} title={stage} tone={i === 2 ? "blue" : "white"}>
              <div className="mt-2 h-8 rounded bg-[var(--sg-color-primary-soft)]/80" />
            </Panel>
          ))}
        </div>
      );
    case "volume":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Panel title="Inbound volume" tone="soft">
            <DotRow labels={["Many leads"]} />
          </Panel>
          <Arrow />
          <Panel title="Route + own" tone="blue">
            <DotRow labels={["Rules", "Owner"]} />
          </Panel>
          <Arrow />
          <Panel title="Respond">
            <DotRow labels={["SLA", "Sequence"]} />
          </Panel>
        </div>
      );
    case "complex":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          <Panel title="Stakeholders" tone="soft">
            <DotRow labels={["Buyer", "Legal", "Finance"]} />
          </Panel>
          <Panel title="Stages + approvals" tone="blue">
            <DotRow labels={["Gates", "Owners"]} />
          </Panel>
          <Panel title="Shared visibility">
            <DotRow labels={["Notes", "Next actions"]} />
          </Panel>
        </div>
      );
    case "growing":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Panel title="Start simple" tone="soft">
            <DotRow labels={["Contacts", "Pipeline"]} />
          </Panel>
          <Arrow />
          <Panel title="Adopt" tone="blue">
            <DotRow labels={["Team habits"]} />
          </Panel>
          <Arrow />
          <Panel title="Scale process">
            <DotRow labels={["Automation", "Reports"]} />
          </Panel>
        </div>
      );
    default:
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          <Panel title="How you work" tone="soft">
            <DotRow labels={["Scenario"]} />
          </Panel>
          <Panel title="Capabilities" tone="blue">
            <DotRow labels={["Must-haves"]} />
          </Panel>
          <Panel title="Compare">
            <DotRow labels={["Evidence"]} />
          </Panel>
        </div>
      );
  }
}
