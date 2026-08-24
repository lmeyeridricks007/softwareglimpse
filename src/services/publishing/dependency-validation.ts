import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
} from "@/data";
import { getAllGuidesUnfiltered } from "@/data/repositories/guides";
import type { ContentMetadata } from "@/domain";
import { getPublicationContextSync } from "@/domain/publication-context";

export type PublicationDependencyIssue = {
  code: "PUBLICATION_DEPENDENCY_ERROR";
  message: string;
  sourceId: string;
  sourcePath?: string;
  dependencyId: string;
  dependencyPath?: string;
  sourcePublishAt?: string;
  dependencyPublishAt?: string;
};

type PublishableEntity = {
  id: string;
  path?: string;
  metadata: ContentMetadata;
  productSlugs?: string[];
};

function publishInstant(metadata: ContentMetadata): number | null {
  if (metadata.status === "scheduled" && metadata.scheduledAt) {
    const ts = Date.parse(metadata.scheduledAt);
    return Number.isNaN(ts) ? null : ts;
  }
  if (metadata.status === "published" && metadata.publishedAt) {
    const ts = Date.parse(metadata.publishedAt);
    return Number.isNaN(ts) ? null : ts;
  }
  return null;
}

function entityPublishMap(): Map<string, PublishableEntity> {
  const map = new Map<string, PublishableEntity>();

  const add = (entity: PublishableEntity) => {
    map.set(entity.id, entity);
  };

  for (const software of getAllSoftwareUnfiltered()) {
    add({
      id: `software:${software.slug}`,
      path: `/software/${software.slug}/`,
      metadata: software.metadata,
    });
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    add({
      id: `comparison:${comparison.slug}`,
      path: `/compare/${comparison.slug}/`,
      metadata: comparison.metadata,
      productSlugs: comparison.productSlugs,
    });
  }

  for (const page of getAllAlternativesUnfiltered()) {
    add({
      id: `alternatives:${page.slug}`,
      path: `/alternatives/${page.slug}/`,
      metadata: page.metadata,
      productSlugs: page.productSlugs,
    });
  }

  for (const page of getAllBestPagesUnfiltered()) {
    add({
      id: `best:${page.slug}`,
      path: `/best/${page.slug}/`,
      metadata: page.metadata,
      productSlugs: page.productSlugs,
    });
  }

  for (const guide of getAllGuidesUnfiltered()) {
    add({
      id: `guide:${guide.slug}`,
      path: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
      metadata: guide.metadata,
      productSlugs: guide.productSlugs,
    });
  }

  return map;
}

/**
 * Validate that scheduled dependencies publish before dependents.
 */
export function validatePublicationDependencies(
  now = new Date(),
): PublicationDependencyIssue[] {
  void now;
  void getPublicationContextSync();
  const entities = entityPublishMap();
  const issues: PublicationDependencyIssue[] = [];

  for (const entity of entities.values()) {
    const sourceAt = publishInstant(entity.metadata);
    if (sourceAt == null || !entity.productSlugs?.length) continue;

    for (const slug of entity.productSlugs) {
      const dep = entities.get(`software:${slug}`);
      if (!dep) {
        issues.push({
          code: "PUBLICATION_DEPENDENCY_ERROR",
          message: `Missing product dependency: ${slug}`,
          sourceId: entity.id,
          sourcePath: entity.path,
          dependencyId: `software:${slug}`,
        });
        continue;
      }

      const depAt = publishInstant(dep.metadata);
      if (depAt == null) continue;

      if (depAt > sourceAt) {
        issues.push({
          code: "PUBLICATION_DEPENDENCY_ERROR",
          message: `Dependency publishes after dependent`,
          sourceId: entity.id,
          sourcePath: entity.path,
          dependencyId: dep.id,
          dependencyPath: dep.path,
          sourcePublishAt: entity.metadata.scheduledAt ?? entity.metadata.publishedAt,
          dependencyPublishAt:
            dep.metadata.scheduledAt ?? dep.metadata.publishedAt,
        });
      }
    }
  }

  return issues;
}

export function hasBlockingPublicationDependencies(
  entityId: string,
  issues = validatePublicationDependencies(),
): boolean {
  return issues.some((issue) => issue.sourceId === entityId);
}
