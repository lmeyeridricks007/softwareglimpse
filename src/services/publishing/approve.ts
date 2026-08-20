import { randomUUID } from "node:crypto";
import type { ContentId, ContentVersion } from "@/domain";
import {
  appendAuditEvent,
  loadVersion,
  saveVersion,
} from "@/data/publishing/store";

export type ApproveVersionResult = {
  version: ContentVersion;
};

/**
 * Mark a draft version as approved.
 */
export function approveVersion(
  contentId: ContentId | string,
  version: number,
  approvedBy: string,
  at: Date = new Date(),
): ApproveVersionResult {
  const existing = loadVersion(contentId, version);
  if (!existing) {
    throw new Error(`Version ${version} not found for ${contentId}`);
  }
  if (existing.status === "published" || existing.status === "superseded") {
    throw new Error(
      `Cannot approve version ${version} in status ${existing.status}`,
    );
  }
  const approvedAt = at.toISOString();
  const updated: ContentVersion = {
    ...existing,
    status: "approved",
    approvedAt,
    approvedBy,
  };
  saveVersion(updated);
  appendAuditEvent({
    id: randomUUID(),
    contentId: existing.contentId,
    action: "approve-version",
    at: approvedAt,
    actor: approvedBy,
    details: { version },
  });
  return { version: updated };
}
