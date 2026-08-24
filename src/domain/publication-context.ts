import {
  getPublicationState,
  isPubliclyAvailable,
  type PublicationState,
  type PublicationStateInput,
} from "@/domain/publishing";
import type { PublishStatus } from "@/domain/schemas";

/** Surfaces that determine how publication gates apply. */
export type PublicationContextKind =
  | "PUBLIC"
  | "DEVELOPMENT"
  | "AUTHORIZED_PREVIEW"
  | "BUILD"
  | "SEARCH_INDEX"
  | "SITEMAP";

/** Optional dev simulation modes — default `all` shows everything locally. */
export type PreviewMode = "all" | "as-of" | "public";

export type PublicationContext = {
  kind: PublicationContextKind;
  previewMode: PreviewMode;
  /** Simulated clock for as-of mode (ISO UTC). */
  previewAt?: string;
};

export type EffectivePublicationState =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "UNPUBLISHED"
  | "ARCHIVED";

const DRAFT_LIKE: readonly PublishStatus[] = [
  "idea",
  "researching",
  "draft",
  "review",
  "approved",
] as const;

const UNPUBLISHED_LIKE: readonly PublishStatus[] = ["rejected"] as const;

function parsePreviewMode(raw: string | undefined): PreviewMode {
  if (raw === "as-of" || raw === "public" || raw === "all") return raw;
  return "all";
}

function readEnvPreviewMode(): string | undefined {
  return (
    process.env.PUBLICATION_PREVIEW?.trim() ||
    process.env.SG_PUBLICATION_PREVIEW?.trim() ||
    process.env.PREVIEW_MODE?.trim() ||
    process.env.SG_PREVIEW_MODE?.trim()
  );
}

function envPreviewAt(): string | undefined {
  const raw =
    process.env.PREVIEW_SITE_AT?.trim() ||
    process.env.SG_PREVIEW_SITE_AT?.trim() ||
    process.env.PUBLICATION_PREVIEW_AT?.trim();
  return raw || undefined;
}

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

export type PublicationContextOverrides = {
  kind?: PublicationContextKind;
  previewMode?: PreviewMode;
  previewAt?: string;
  /** Next.js draftMode / preview secret flow */
  authorizedPreview?: boolean;
};

/**
 * Resolve the active publication context.
 *
 * - Production → PUBLIC (strict)
 * - Development default → DEVELOPMENT + all (every local entity visible)
 * - Optional PUBLICATION_PREVIEW=public|as-of for simulation
 */
export function getPublicationContextSync(
  overrides: PublicationContextOverrides = {},
): PublicationContext {
  if (overrides.kind) {
    return {
      kind: overrides.kind,
      previewMode: overrides.previewMode ?? "public",
      previewAt: overrides.previewAt,
    };
  }

  if (overrides.authorizedPreview) {
    return {
      kind: "AUTHORIZED_PREVIEW",
      previewMode: "all",
    };
  }

  if (isProductionRuntime()) {
    return {
      kind: "PUBLIC",
      previewMode: "public",
    };
  }

  return {
    kind: "DEVELOPMENT",
    previewMode: parsePreviewMode(readEnvPreviewMode()),
    previewAt: envPreviewAt(),
  };
}

/** @deprecated Use DEVELOPMENT — kept for callers that checked DEV_PREVIEW */
export function isDevelopmentContext(context: PublicationContext): boolean {
  return (
    context.kind === "DEVELOPMENT" ||
    context.kind === "AUTHORIZED_PREVIEW"
  );
}

/** Sitemap always models production eligibility. */
export function getSitemapPublicationContext(now?: Date): PublicationContext {
  void now;
  return {
    kind: "SITEMAP",
    previewMode: "public",
  };
}

export function getBuildPublicationContext(): PublicationContext {
  return {
    kind: "BUILD",
    previewMode: "public",
  };
}

export function getSearchIndexPublicationContext(): PublicationContext {
  return {
    kind: "SEARCH_INDEX",
    previewMode: "public",
  };
}

/**
 * Effective "now" for publication comparisons.
 * as-of simulation uses previewAt; otherwise real time.
 */
export function getEffectiveNow(context: PublicationContext): Date {
  if (context.previewMode === "as-of" && context.previewAt) {
    const parsed = Date.parse(context.previewAt);
    if (!Number.isNaN(parsed)) return new Date(parsed);
  }
  return new Date();
}

export function isDraftLikeStatus(status: PublishStatus): boolean {
  return (DRAFT_LIKE as readonly string[]).includes(status);
}

function scheduledInFuture(
  input: PublicationStateInput,
  now: Date,
): boolean {
  if (!input.scheduledAt) return false;
  const ts = Date.parse(input.scheduledAt);
  return !Number.isNaN(ts) && ts > now.getTime();
}

/**
 * Production visibility at an instant — used for PUBLIC, sitemap, and dev simulation.
 */
export function isPublicAt(
  input: PublicationStateInput,
  now: Date = new Date(),
): boolean {
  if (input.status === "archived") return false;
  if ((UNPUBLISHED_LIKE as readonly string[]).includes(input.status)) {
    return false;
  }

  if (input.status === "scheduled") {
    if (!input.scheduledAt) return false;
    return !scheduledInFuture(input, now);
  }

  if (isDraftLikeStatus(input.status)) return false;

  return isPubliclyAvailable(
    {
      status: input.status,
      publishedAt: input.publishedAt,
      scheduledAt: input.scheduledAt,
    },
    now,
  );
}

export function resolvePublicationState(
  input: PublicationStateInput,
  context: PublicationContext,
  now?: Date,
): EffectivePublicationState {
  const effectiveNow = now ?? getEffectiveNow(context);

  if (input.status === "archived") return "ARCHIVED";
  if ((UNPUBLISHED_LIKE as readonly string[]).includes(input.status)) {
    return "UNPUBLISHED";
  }

  if (input.status === "scheduled" || scheduledInFuture(input, effectiveNow)) {
    return "SCHEDULED";
  }

  if (isPubliclyAvailable(
    {
      status: input.status,
      publishedAt: input.publishedAt,
      scheduledAt: input.scheduledAt,
    },
    effectiveNow,
  )) {
    return "LIVE";
  }

  if (isDraftLikeStatus(input.status)) return "DRAFT";

  return "DRAFT";
}

export type PublicationVisibility = PublicationState & {
  effectiveState: EffectivePublicationState;
  isScheduledFuture: boolean;
  isVisible: boolean;
  isVisibleInDiscovery: boolean;
};

function usesPublicVisibilityRules(context: PublicationContext): boolean {
  return (
    context.kind === "PUBLIC" ||
    context.kind === "SITEMAP" ||
    context.kind === "SEARCH_INDEX" ||
    context.kind === "BUILD" ||
    (context.kind === "DEVELOPMENT" && context.previewMode === "public") ||
    (context.kind === "DEVELOPMENT" && context.previewMode === "as-of")
  );
}

/**
 * Central visibility gate — single source of truth for all surfaces.
 */
export function isContentVisible(
  input: PublicationStateInput,
  context: PublicationContext,
  now?: Date,
): boolean {
  const effectiveNow = now ?? getEffectiveNow(context);

  if (
    context.kind === "DEVELOPMENT" &&
    context.previewMode === "all"
  ) {
    return true;
  }

  if (context.kind === "AUTHORIZED_PREVIEW") {
    return true;
  }

  if (usesPublicVisibilityRules(context)) {
    return isPublicAt(input, effectiveNow);
  }

  return false;
}

export function getPublicationVisibility(
  input: PublicationStateInput,
  context: PublicationContext,
  now?: Date,
): PublicationVisibility {
  const effectiveNow = now ?? getEffectiveNow(context);
  const state = getPublicationState(input, effectiveNow);
  const effectiveState = resolvePublicationState(input, context, effectiveNow);
  const isScheduledFuture = scheduledInFuture(input, effectiveNow);
  const isVisible = isContentVisible(input, context, effectiveNow);

  const publiclyIndexable =
    isPublicAt(input, effectiveNow) && Boolean(input.seoIndexable);

  return {
    ...state,
    effectiveState,
    isScheduledFuture,
    isVisible,
    isVisibleInDiscovery: isVisible,
    isIndexable: publiclyIndexable,
    isVisibleInListings: isVisible,
    isVisibleInInternalLinks: isVisible,
  };
}

export type PublicationListOptions = {
  /**
   * Legacy bypass — equivalent to development visibility.
   * Prefer relying on getPublicationContextSync() defaults.
   */
  includeUnpublished?: boolean;
  now?: Date;
  context?: PublicationContext;
};

export function resolvePublicationListOptions(
  overrides: PublicationListOptions = {},
): PublicationListOptions & { context: PublicationContext; now: Date } {
  const context =
    overrides.context ??
    getPublicationContextSync({
      authorizedPreview: overrides.includeUnpublished,
    });
  return {
    ...overrides,
    context,
    now: overrides.now ?? getEffectiveNow(context),
  };
}

export function filterByPublicationVisibility<
  T extends {
    metadata: {
      status: PublishStatus;
      publishedAt?: string;
      scheduledAt?: string;
    };
  },
>(items: T[], options: PublicationListOptions = {}): T[] {
  if (options.includeUnpublished) return items;

  const resolved = resolvePublicationListOptions(options);
  return items.filter((item) =>
    isContentVisible(
      {
        status: item.metadata.status,
        publishedAt: item.metadata.publishedAt,
        scheduledAt: item.metadata.scheduledAt,
      },
      resolved.context!,
      resolved.now,
    ),
  );
}

/** Dev-only UI chrome for non-live content. */
export function shouldShowPublicationDevChrome(
  context: PublicationContext = getPublicationContextSync(),
): boolean {
  return (
    !isProductionRuntime() &&
    context.kind === "DEVELOPMENT" &&
    context.previewMode === "all"
  );
}

export function shouldShowScheduledPreviewChrome(
  input: PublicationStateInput,
  context: PublicationContext = getPublicationContextSync(),
  now?: Date,
): boolean {
  if (!shouldShowPublicationDevChrome(context)) return false;
  const effectiveNow = now ?? getEffectiveNow(context);
  return (
    input.status === "scheduled" && scheduledInFuture(input, effectiveNow)
  );
}
