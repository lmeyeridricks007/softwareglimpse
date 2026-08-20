import type { ContentId, ContentVersion } from "@/domain";
import { ContentIdSchema } from "@/domain";
import {
  listVersions,
  loadVersion,
  saveVersion,
} from "@/data/publishing/store";

export type CreateDraftVersionInput = {
  contentId: ContentId | string;
  bodyRef?: string;
  generator?: string;
  methodologyVersion?: string;
  factRefs?: string[];
  summary?: Record<string, unknown>;
  previousVersion?: number;
  createdAt?: string;
};

/**
 * Create a new draft version. Never overwrites a published version body —
 * always allocates the next version number.
 */
export function createDraftVersion(
  input: CreateDraftVersionInput,
): ContentVersion {
  const contentId = ContentIdSchema.parse(input.contentId);
  const existing = listVersions(contentId);
  const nextVersion =
    existing.length === 0
      ? 1
      : Math.max(...existing.map((v) => v.version)) + 1;

  const draft: ContentVersion = {
    contentId,
    version: nextVersion,
    status: "draft",
    createdAt: input.createdAt ?? new Date().toISOString(),
    bodyRef: input.bodyRef,
    generator: input.generator,
    methodologyVersion: input.methodologyVersion,
    factRefs: input.factRefs,
    summary: input.summary,
    previousVersion:
      input.previousVersion ??
      existing.find((v) => v.status === "published")?.version,
  };

  saveVersion(draft);
  return draft;
}

export function getLiveVersion(
  contentId: ContentId | string,
): ContentVersion | null {
  const versions = listVersions(contentId);
  const published = versions.filter((v) => v.status === "published");
  if (published.length === 0) return null;
  return published[published.length - 1];
}

export function getDraftVersion(
  contentId: ContentId | string,
): ContentVersion | null {
  const versions = listVersions(contentId);
  const drafts = versions.filter(
    (v) => v.status === "draft" || v.status === "approved",
  );
  if (drafts.length === 0) return null;
  return drafts[drafts.length - 1];
}

export function getVersion(
  contentId: ContentId | string,
  version: number,
): ContentVersion | null {
  return loadVersion(contentId, version);
}
