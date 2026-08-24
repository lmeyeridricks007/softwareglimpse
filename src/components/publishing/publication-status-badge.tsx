import type { ContentMetadata } from "@/domain";
import {
  getPublicationContextSync,
  resolvePublicationState,
  shouldShowPublicationDevChrome,
  type PublicationContext,
} from "@/domain/publication-context";

type Props = {
  metadata: Pick<ContentMetadata, "status" | "scheduledAt" | "publishedAt">;
  timezone?: string;
  className?: string;
  context?: PublicationContext;
};

function formatScheduledAt(iso: string, timezone?: string): string {
  const date = new Date(iso);
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone || "UTC",
      timeZoneName: timezone ? "short" : undefined,
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

const BADGE_STYLES: Record<string, string> = {
  DRAFT: "border-slate-300/60 bg-slate-50 text-slate-800",
  SCHEDULED: "border-amber-300/60 bg-amber-50 text-amber-900",
  LIVE: "border-emerald-300/60 bg-emerald-50 text-emerald-900",
  UNPUBLISHED: "border-rose-300/60 bg-rose-50 text-rose-900",
  ARCHIVED: "border-slate-300/60 bg-slate-100 text-slate-600",
};

/**
 * Development-only publication state badge.
 */
export function PublicationStatusBadge({
  metadata,
  timezone,
  className = "",
  context = getPublicationContextSync(),
}: Props) {
  if (!shouldShowPublicationDevChrome(context)) return null;

  const state = resolvePublicationState(
    {
      status: metadata.status,
      publishedAt: metadata.publishedAt,
      scheduledAt: metadata.scheduledAt,
    },
    context,
  );

  const label =
    state === "SCHEDULED" && metadata.scheduledAt
      ? `Scheduled · ${formatScheduledAt(metadata.scheduledAt, timezone)}`
      : state === "LIVE"
        ? "Published"
        : state;

  const style = BADGE_STYLES[state] ?? BADGE_STYLES.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${style} ${className}`}
      data-testid="publication-status-badge"
      data-publication-state={state}
    >
      {label}
    </span>
  );
}

/** @deprecated Use PublicationStatusBadge */
export function ScheduledContentBadge(props: Props) {
  return <PublicationStatusBadge {...props} />;
}
