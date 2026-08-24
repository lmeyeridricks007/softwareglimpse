import {
  getPublicationContextSync,
  getEffectiveNow,
  shouldShowPublicationDevChrome,
} from "@/domain/publication-context";

function formatDevBannerLabel(): string | null {
  const context = getPublicationContextSync();
  if (!shouldShowPublicationDevChrome(context)) {
    if (context.kind === "DEVELOPMENT" && context.previewMode === "public") {
      return "Production visibility simulation — drafts and future scheduled content are hidden";
    }
    if (context.kind === "DEVELOPMENT" && context.previewMode === "as-of") {
      const at = context.previewAt ?? getEffectiveNow(context).toISOString();
      return `Production visibility as of ${at}`;
    }
    return null;
  }

  return "Development — all local content visible (drafts, scheduled, published)";
}

/**
 * Sticky development banner — never rendered in production builds.
 */
export function DevPreviewBanner() {
  if (process.env.NODE_ENV === "production") return null;

  const label = formatDevBannerLabel();
  if (!label) return null;

  const context = getPublicationContextSync();
  const isFullDev =
    context.kind === "DEVELOPMENT" && context.previewMode === "all";

  return (
    <div
      className="border-b border-amber-300/50 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950"
      data-testid="dev-preview-banner"
      role="status"
    >
      <strong className="font-semibold uppercase tracking-wide">
        {isFullDev ? "Development" : "Publication preview"}
      </strong>
      <span className="mx-2 text-amber-700" aria-hidden="true">
        —
      </span>
      <span>{label}</span>
      {isFullDev ? (
        <>
          <span className="mx-2 text-amber-700" aria-hidden="true">
            ·
          </span>
          <span className="text-amber-800">
            Status badges show what production will look like. Use{" "}
            <code className="rounded bg-amber-100 px-1">npm run dev:public</code>{" "}
            to simulate production visibility.
          </span>
        </>
      ) : null}
    </div>
  );
}
