import { randomUUID } from "node:crypto";
import type { ContentId, ContentRegistryEntry, PublishStatus } from "@/domain";
import { ContentIdSchema } from "@/domain";
import { appendAuditEvent } from "@/data/publishing/store";
import { applyTransition } from "./transitions";

export type UnpublishResult = {
  contentId: ContentId;
  status: PublishStatus;
  reason: string;
  entry?: ContentRegistryEntry;
};

/**
 * Archive (unpublish) content with a reason.
 */
export function unpublishContent(
  contentIdInput: ContentId | string,
  opts: {
    reason: string;
    actor?: string;
    currentStatus?: PublishStatus;
    entry?: ContentRegistryEntry;
    at?: Date;
  },
): UnpublishResult {
  const contentId = ContentIdSchema.parse(contentIdInput);
  const at = (opts.at ?? new Date()).toISOString();
  const from = opts.currentStatus ?? opts.entry?.metadata.status ?? "published";

  applyTransition({
    contentId,
    from,
    to: "archived",
    at,
    actor: opts.actor,
    reason: opts.reason,
  });

  appendAuditEvent({
    id: randomUUID(),
    contentId,
    action: "unpublish-archive",
    at,
    actor: opts.actor,
    details: { reason: opts.reason, from },
  });

  const entry = opts.entry
    ? {
        ...opts.entry,
        metadata: { ...opts.entry.metadata, status: "archived" as const },
        seoIndexable: false,
      }
    : undefined;

  return {
    contentId,
    status: "archived",
    reason: opts.reason,
    entry,
  };
}
