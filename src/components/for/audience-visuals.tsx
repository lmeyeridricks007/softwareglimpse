import type { ReactNode } from "react";
import type { AudienceHubProfile } from "@/domain";
import { businessTypePlural } from "@/components/for/business-type-labels";
import { cn } from "@/lib/cn";

export type AudienceVisualKind = AudienceHubProfile["visualKind"];

export function audienceHowItWorksCaption(
  audienceName: string,
  kind: AudienceVisualKind,
): string {
  switch (kind) {
    case "small-business":
      return `How a small-business team keeps contacts, owners, and a simple pipeline in one shared CRM.`;
    case "startups":
      return `How an early-stage startup captures demos, owners, and next steps without enterprise process weight.`;
    case "enterprise":
      return `How enterprise buying connects governance, integrations, and a scored shortlist — not demo theater alone.`;
    case "freelancers":
      return `How a freelancer tracks client history and follow-ups without a multi-stage sales board.`;
    case "agencies":
      return `How an agency moves from pitch pipeline to delivery handoff with client context intact.`;
    case "nonprofits":
      return `How a nonprofit keeps donor/volunteer relationship history with clear outreach ownership.`;
    case "growing-teams":
      return `How a growing team leaves spreadsheets: light stages first, then reporting as hygiene sticks.`;
    case "sales-teams":
      return `How a remote sales team shares pipeline truth and activity so coaching does not depend on hallway chats.`;
    default:
      return `Conceptual view of how ${audienceName.toLowerCase()} typically use CRM day to day.`;
  }
}

export function AudienceConceptVisual({
  kind,
  audienceName,
  slug,
  className,
}: {
  kind: AudienceVisualKind;
  audienceName: string;
  slug?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[#eff6ff] via-white to-[#e0f2fe]",
        className,
      )}
    >
      <div className="relative min-h-[15rem] p-5 sm:p-6" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgb(37_99_235/0.12),transparent_55%)]" />
        <div className="relative">
          <VisualArt kind={kind} />
        </div>
      </div>
      <figcaption className="border-t border-[var(--sg-color-border)] bg-white/80 px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
        Educational diagram — not a product screenshot. Explains CRM fit for{" "}
        {businessTypePlural(slug ?? "", audienceName)}.
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
  tone?: "white" | "blue" | "soft" | "green" | "amber";
}) {
  const toneClass =
    tone === "blue"
      ? "border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/70"
      : tone === "soft"
        ? "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
        : tone === "green"
          ? "border-emerald-200 bg-emerald-50/90"
          : tone === "amber"
            ? "border-amber-200 bg-amber-50/90"
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

function Row({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="mt-1.5 flex items-center justify-between gap-2 rounded bg-white/80 px-2 py-1 text-[10px] text-[var(--sg-color-text)]">
      <span className="truncate font-medium">{label}</span>
      {meta ? (
        <span className="shrink-0 text-[var(--sg-color-text-muted)]">{meta}</span>
      ) : null}
    </div>
  );
}

function VisualArt({ kind }: { kind: AudienceVisualKind }) {
  switch (kind) {
    case "small-business":
      return (
        <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Team pipeline" tone="blue">
            <Row label="Qualified" meta="4 deals" />
            <Row label="Proposal" meta="2 deals" />
            <Row label="Won" meta="1 this week" />
          </Panel>
          <div className="space-y-3">
            <Panel title="Shared contacts">
              <Row label="Acme Co — owner: Maya" />
              <Row label="Next: send proposal Fri" />
            </Panel>
            <Panel title="Admin load" tone="green">
              <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                ~90 min / week hygiene
              </p>
            </Panel>
          </div>
        </div>
      );
    case "startups":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel title="Inbound" tone="blue">
            <Row label="Demo requests" meta="12" />
            <Row label="Assigned" meta="same day" />
          </Panel>
          <Panel title="Founder pipeline">
            <Row label="Discovery" meta="5" />
            <Row label="Trial" meta="3" />
          </Panel>
          <Panel title="Later" tone="soft">
            <Row label="Add AE seats" />
            <Row label="Then reporting" />
          </Panel>
        </div>
      );
    case "enterprise":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel title="Buying group" tone="blue">
            <Row label="RevOps" meta="process" />
            <Row label="IT / Security" meta="SSO" />
            <Row label="Sales leaders" meta="UX" />
          </Panel>
          <Panel title="Scorecard gates">
            <Row label="Must-have: SSO" meta="pass" />
            <Row label="Must-have: audit log" meta="pass" />
            <Row label="Integration map" meta="in review" />
          </Panel>
        </div>
      );
    case "freelancers":
      return (
        <div className="mx-auto grid max-w-md gap-3">
          <Panel title="Today’s follow-ups" tone="blue">
            <Row label="Jordan — proposal nudge" meta="Tue" />
            <Row label="Sam — invoice check-in" meta="Thu" />
          </Panel>
          <Panel title="Client record">
            <Row label="Notes + last email" />
            <Row label="No 8-stage board needed" meta="✓" />
          </Panel>
        </div>
      );
    case "agencies":
      return (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Panel title="Pitch pipeline" tone="blue">
            <Row label="RFP in" meta="3" />
            <Row label="Presentation" meta="2" />
            <Row label="Verbal" meta="1" />
          </Panel>
          <div className="hidden text-center text-xs font-semibold text-[var(--sg-color-primary)] sm:block">
            Handoff →
          </div>
          <Panel title="Delivery context" tone="green">
            <Row label="Stakeholders copied" />
            <Row label="Scope notes attached" />
            <Row label="Owner: Account lead" />
          </Panel>
        </div>
      );
    case "nonprofits":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel title="Donors" tone="blue">
            <Row label="Major gift" meta="owner set" />
            <Row label="Last thank-you" meta="logged" />
          </Panel>
          <Panel title="Volunteers">
            <Row label="Shift history" />
            <Row label="Next ask" meta="scheduled" />
          </Panel>
          <Panel title="Partners" tone="soft">
            <Row label="Grant stage" meta="submitted" />
          </Panel>
        </div>
      );
    case "growing-teams":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel title="Before" tone="amber">
            <Row label="Shared sheet" meta="conflicts" />
            <Row label="Slack status" meta="tribal" />
          </Panel>
          <Panel title="Day 1 CRM" tone="blue">
            <Row label="4 stages only" />
            <Row label="Owner required" />
          </Panel>
          <Panel title="Later" tone="green">
            <Row label="Add forecast" />
            <Row label="Then automation" />
          </Panel>
        </div>
      );
    case "sales-teams":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel title="Remote pipeline board" tone="blue">
            <Row label="AE — East" meta="7 open" />
            <Row label="AE — West" meta="5 open" />
            <Row label="Next steps visible" meta="✓" />
          </Panel>
          <Panel title="Async coaching">
            <Row label="Activity gaps" meta="flagged" />
            <Row label="Friday review" meta="from CRM" />
            <Row label="No hallway needed" />
          </Panel>
        </div>
      );
    default:
      return (
        <Panel title="CRM fit" tone="blue">
          <Row label="Contacts" />
          <Row label="Pipeline" />
          <Row label="Follow-ups" />
        </Panel>
      );
  }
}

/** Compact hero visual for index / detail heroes */
export function AudienceHeroVisual({
  kind = "default",
  className,
}: {
  kind?: AudienceVisualKind;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-[#eff6ff] to-[var(--sg-color-primary-soft)] p-5 shadow-[var(--sg-shadow-md)] lg:block",
        className,
      )}
      aria-hidden
    >
      <VisualArt kind={kind} />
    </div>
  );
}
