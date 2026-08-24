import type { PublishStatus } from "@/domain/schemas";
import {
  getEffectiveNow,
  getPublicationContextSync,
  isContentVisible,
  type PublicationContext,
  type PublicationListOptions,
  resolvePublicationListOptions,
} from "@/domain/publication-context";

export type RoutableEntity = {
  metadata: {
    status: PublishStatus;
    publishedAt?: string;
    scheduledAt?: string;
  };
};

/**
 * Publication gate for direct route resolution.
 * Returns the entity only when visible in the active publication context.
 */
export function resolveForPublicRoute<T extends RoutableEntity>(
  entity: T | null | undefined,
  options?: PublicationListOptions,
): T | undefined {
  if (!entity) return undefined;

  const resolved = resolvePublicationListOptions(options);
  const visible = isContentVisible(
    {
      status: entity.metadata.status,
      publishedAt: entity.metadata.publishedAt,
      scheduledAt: entity.metadata.scheduledAt,
    },
    resolved.context!,
    resolved.now,
  );

  return visible ? entity : undefined;
}

/**
 * Route resolution context — same as getPublicationContextSync unless overridden.
 */
export function getRoutePublicationContext(): PublicationContext {
  return getPublicationContextSync();
}

export function isRoutableAt(
  entity: RoutableEntity,
  context: PublicationContext = getRoutePublicationContext(),
  now?: Date,
): boolean {
  return isContentVisible(
    {
      status: entity.metadata.status,
      publishedAt: entity.metadata.publishedAt,
      scheduledAt: entity.metadata.scheduledAt,
    },
    context,
    now ?? getEffectiveNow(context),
  );
}

/**
 * Filter a list for route/discovery surfaces using the active publication context.
 */
export function filterRoutableEntities<T extends RoutableEntity>(
  entities: T[],
  options?: PublicationListOptions,
): T[] {
  const resolved = resolvePublicationListOptions(options);
  return entities.filter((entity) =>
    isContentVisible(
      {
        status: entity.metadata.status,
        publishedAt: entity.metadata.publishedAt,
        scheduledAt: entity.metadata.scheduledAt,
      },
      resolved.context!,
      resolved.now,
    ),
  );
}
