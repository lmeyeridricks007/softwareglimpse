import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  featureHowItWorksCaption,
  featureVisualKindForSlug,
  type FeatureVisualKind,
} from "@/services/feature-detail/visual-kind";

export type { FeatureVisualKind };
export { featureHowItWorksCaption, featureVisualKindForSlug };

/**
 * Educational concept diagrams for Feature Detail pages.
 * These explain the idea — they are not product UI screenshots or mockups.
 * Prefer concrete buyer scenarios and full-width layouts (no left-clustered stubs).
 */

export function FeatureConceptVisual({
  kind,
  featureName,
  className,
  compact = false,
}: {
  kind: FeatureVisualKind;
  featureName: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[#eff6ff] via-white to-[#e0f2fe]",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full",
          compact ? "min-h-[12rem] p-4" : "min-h-[16rem] p-5 sm:min-h-[18rem] sm:p-6",
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgb(37_99_235/0.12),transparent_55%)]" />
        <div className="relative flex h-full min-h-[inherit] w-full flex-col justify-center">
          <VisualArt kind={kind} />
        </div>
      </div>
      <figcaption className="border-t border-[var(--sg-color-border)] bg-white/80 px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
        Educational diagram — not a product screenshot. Explains{" "}
        {featureName.toLowerCase()} with a concrete team scenario.
      </figcaption>
    </figure>
  );
}

function Panel({
  title,
  children,
  tone = "white",
  className,
}: {
  title: string;
  children?: ReactNode;
  tone?: "white" | "blue" | "soft" | "amber";
  className?: string;
}) {
  const toneClass =
    tone === "blue"
      ? "border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/70"
      : tone === "soft"
        ? "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
        : tone === "amber"
          ? "border-amber-200 bg-amber-50"
          : "border-[var(--sg-color-border)] bg-white";
  return (
    <div
      className={cn(
        "h-full rounded-lg border px-3 py-2.5 shadow-sm",
        toneClass,
        className,
      )}
    >
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
    <span
      className="hidden self-center text-sm font-semibold text-[var(--sg-color-primary)] sm:inline"
      aria-hidden
    >
      →
    </span>
  );
}

function ScenarioLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium text-[var(--sg-color-text-muted)] sm:text-sm">
      {children}
    </p>
  );
}

function VisualArt({ kind }: { kind: FeatureVisualKind }) {
  switch (kind) {
    case "contacts":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: account manager + specialist share one client record
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="Contact" tone="blue">
              <DotRow labels={["Dana Chen", "Owner: Sam", "Email logged"]} />
            </Panel>
            <Arrow />
            <Panel title="Account">
              <DotRow labels={["Acme Corp", "Tier: Growth"]} />
            </Panel>
            <Arrow />
            <Panel title="Shared timeline" tone="soft">
              <DotRow labels={["Call note", "Proposal email", "Next step"]} />
            </Panel>
          </div>
        </div>
      );
    case "leads":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: website demo request at 4:50pm needs an owner immediately
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="Enquiry" tone="soft">
              <DotRow labels={["Pricing form", "Source: Website"]} />
            </Panel>
            <Arrow />
            <Panel title="Lead" tone="blue">
              <DotRow labels={["Owner: Jordan", "Status: New"]} />
            </Panel>
            <Arrow />
            <Panel title="Qualified">
              <DotRow labels={["→ Contact", "→ Deal opened"]} />
            </Panel>
          </div>
        </div>
      );
    case "pipeline":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: small B2B team Friday review — which deals are actually moving?
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-4">
            {[
              { stage: "New", deals: ["Acme intro"] },
              { stage: "Qualified", deals: ["Northwind", "Brightline"] },
              { stage: "Proposal", deals: ["Harbor Co"] },
              { stage: "Won", deals: ["Pulse Labs"] },
            ].map((col, i) => (
              <Panel
                key={col.stage}
                title={col.stage}
                tone={i === 1 ? "blue" : "white"}
              >
                <div className="mt-2 space-y-1.5">
                  {col.deals.map((d) => (
                    <div
                      key={d}
                      className="rounded bg-[var(--sg-color-primary-soft)]/80 px-2 py-1.5 text-[10px] font-medium text-[var(--sg-color-navy)]"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      );
    case "deals":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: forecast meeting needs value, stage, and owner on every open deal
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1.2fr_0.8fr]">
            <Panel title="Deal: Harbor Co — Q2 expand" tone="blue">
              <DotRow
                labels={["$28k", "Stage: Proposal", "Close: 28 Aug", "Owner: Priya"]}
              />
            </Panel>
            <Panel title="Linked to" tone="soft">
              <DotRow labels={["Contact: Lee", "Account: Harbor"]} />
            </Panel>
          </div>
        </div>
      );
    case "automation":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: demo marked “No-show” — follow-up should not depend on memory
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="1. Trigger" tone="amber">
              <p className="mt-1.5 text-[11px] font-semibold text-[var(--sg-color-navy)]">
                Deal stage → No-show
              </p>
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                Harbor Co demo missed
              </p>
            </Panel>
            <Arrow />
            <Panel title="2. Condition">
              <p className="mt-1.5 text-[11px] font-semibold text-[var(--sg-color-navy)]">
                If owner = Priya
              </p>
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                and no follow-up task exists
              </p>
            </Panel>
            <Arrow />
            <Panel title="3. Action" tone="blue">
              <p className="mt-1.5 text-[11px] font-semibold text-[var(--sg-color-navy)]">
                Create task for Priya
              </p>
              <DotRow labels={["Reschedule demo", "Due tomorrow", "Notify Slack"]} />
            </Panel>
          </div>
          <div className="mt-3 grid w-full gap-2 sm:grid-cols-3">
            <Panel title="Before" tone="soft">
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                No-shows only get chased if someone remembers — volume makes that fail.
              </p>
            </Panel>
            <Panel title="Rule intent" tone="soft">
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                Same follow-up every time: owner, deadline, stop if deal moves on.
              </p>
            </Panel>
            <Panel title="After" tone="soft">
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                Priya sees a task at 9am — Harbor does not vanish into the inbox.
              </p>
            </Panel>
          </div>
        </div>
      );
    case "sequences":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: outbound SDR cadence for a new lead from a webinar
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="Day 0" tone="blue">
              <DotRow labels={["Email: thank + CTA"]} />
            </Panel>
            <Arrow />
            <Panel title="Day 2">
              <DotRow labels={["Call task", "Voicemail script"]} />
            </Panel>
            <Arrow />
            <Panel title="Day 5" tone="soft">
              <DotRow labels={["Email: case study", "Stop if replied"]} />
            </Panel>
          </div>
        </div>
      );
    case "email":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: Priya’s proposal thread should appear on the Harbor deal timeline
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <Panel title="Mailbox" tone="soft">
              <DotRow labels={["Re: Harbor proposal", "Synced"]} />
            </Panel>
            <Arrow />
            <Panel title="CRM timeline" tone="blue">
              <DotRow labels={["Logged on deal", "Visible to manager"]} />
            </Panel>
          </div>
        </div>
      );
    case "calls":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: outbound call logged so the next AE does not repeat questions
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="Call" tone="blue">
              <DotRow labels={["Outbound", "12 min"]} />
            </Panel>
            <Arrow />
            <Panel title="Logged activity">
              <DotRow labels={["Budget confirmed", "Next: demo"]} />
            </Panel>
            <Arrow />
            <Panel title="Next step" tone="soft">
              <DotRow labels={["Task: send deck"]} />
            </Panel>
          </div>
        </div>
      );
    case "reporting":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: Monday pipeline review without rebuilding a spreadsheet
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-3">
            <Panel title="Activity" tone="soft">
              <div className="mt-2 flex h-14 items-end gap-1.5">
                {[40, 70, 55, 85].map((h) => (
                  <span
                    key={h}
                    className="flex-1 rounded-t bg-[var(--sg-color-primary)]/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </Panel>
            <Panel title="Pipeline by stage" tone="blue">
              <div className="mt-2 h-14 rounded bg-white/70" />
            </Panel>
            <Panel title="Outcomes">
              <DotRow labels={["Won: 4", "Lost: 2", "Aging: 3"]} />
            </Panel>
          </div>
        </div>
      );
    case "forecasting":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: this month’s commit from weighted open deals — not optimism
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <Panel title="Open deals" tone="soft">
              <DotRow labels={["Harbor $28k", "Pulse $12k", "Weighted"]} />
            </Panel>
            <Arrow />
            <Panel title="Period forecast" tone="blue">
              <DotRow labels={["August commit", "From CRM stages"]} />
            </Panel>
          </div>
        </div>
      );
    case "analytics":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: conversion drops after Proposal — find the bottleneck stage
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Panel title="Conversion trend" tone="blue">
              <div className="mt-2 h-12 rounded bg-[linear-gradient(90deg,transparent_0%,rgb(37_99_235/0.35)_60%,transparent_100%)]" />
            </Panel>
            <Panel title="Bottleneck" tone="soft">
              <DotRow labels={["Stuck in Proposal", "Avg 18 days"]} />
            </Panel>
          </div>
        </div>
      );
    case "integrations":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: email, support, and billing must stay tied to the same account
          </ScenarioLabel>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            <Panel title="Email" />
            <Panel title="CRM" tone="blue" />
            <Panel title="Support" />
            <Panel title="Billing" tone="soft" />
          </div>
        </div>
      );
    case "fields":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: advisory firm needs Segment and SLA fields beyond Name/Email
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Panel title="Standard fields" tone="soft">
              <DotRow labels={["Name", "Email"]} />
            </Panel>
            <Panel title="Your fields" tone="blue">
              <DotRow labels={["Segment", "SLA", "AUM band"]} />
            </Panel>
          </div>
        </div>
      );
    case "mobile":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: AE logs a call from the car — same record as desktop
          </ScenarioLabel>
          <div className="mx-auto grid w-full max-w-md gap-2 sm:grid-cols-2">
            <Panel title="On the go" tone="blue">
              <DotRow labels={["Notes", "Call log"]} />
            </Panel>
            <Panel title="Syncs to CRM" tone="soft">
              <DotRow labels={["Same Harbor deal"]} />
            </Panel>
          </div>
        </div>
      );
    case "ai":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: draft a follow-up from the deal timeline — human still edits and sends
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            <Panel title="Context" tone="soft">
              <DotRow labels={["Harbor timeline"]} />
            </Panel>
            <Arrow />
            <Panel title="Suggestion" tone="blue">
              <DotRow labels={["Draft email"]} />
            </Panel>
            <Arrow />
            <Panel title="Human review">
              <DotRow labels={["Edit · Send"]} />
            </Panel>
          </div>
        </div>
      );
    case "permissions":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: reps see owned deals; managers see the team; admins see all
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-3">
            <Panel title="Admin" tone="blue">
              <DotRow labels={["All records"]} />
            </Panel>
            <Panel title="Manager">
              <DotRow labels={["Team only"]} />
            </Panel>
            <Panel title="Rep" tone="soft">
              <DotRow labels={["Owned only"]} />
            </Panel>
          </div>
        </div>
      );
    case "sso":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: company Okta login provisions CRM users — no shared passwords
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <Panel title="Identity provider" tone="soft">
              <DotRow labels={["Company login"]} />
            </Panel>
            <Arrow />
            <Panel title="CRM access" tone="blue">
              <DotRow labels={["Provisioned users"]} />
            </Panel>
          </div>
        </div>
      );
    case "audit":
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: compliance asks who exported the client list last quarter
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Panel title="Change log" tone="blue">
              <DotRow labels={["Who", "What", "When"]} />
            </Panel>
            <Panel title="Access events" tone="soft">
              <DotRow labels={["Export", "View", "Edit"]} />
            </Panel>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full">
          <ScenarioLabel>
            Example: match a buyer need to the capability and the evidence you will check
          </ScenarioLabel>
          <div className="grid w-full gap-2 sm:grid-cols-3">
            <Panel title="Need" tone="soft">
              <DotRow labels={["Buyer goal"]} />
            </Panel>
            <Panel title="Feature" tone="blue">
              <DotRow labels={["Product capability"]} />
            </Panel>
            <Panel title="Evidence">
              <DotRow labels={["Evaluate"]} />
            </Panel>
          </div>
        </div>
      );
  }
}
