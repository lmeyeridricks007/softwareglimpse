import type {
  CrmRfpSession,
  RfpChangeLogEntry,
  RfpRequirement,
} from "@/domain";
import { newRfpId } from "./constants";

/** Stable fingerprint of issued requirements for change detection. */
export function fingerprintRequirements(
  requirements: RfpRequirement[],
): string {
  return requirements
    .map(
      (r) =>
        `${r.id}|${r.priority}|${r.requirement.trim()}|${r.mandatory ? 1 : 0}`,
    )
    .sort()
    .join("\n");
}

function parseVersion(version: string): { major: number; minor: number } {
  const match = /^(\d+)(?:\.(\d+))?/.exec(version.trim());
  if (!match) return { major: 1, minor: 0 };
  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? "0"),
  };
}

export function bumpMinorVersion(version: string): string {
  const { major, minor } = parseVersion(version);
  return `${major}.${minor + 1}`;
}

export function diffRequirements(
  before: RfpRequirement[],
  after: RfpRequirement[],
): RfpChangeLogEntry[] {
  const now = new Date().toISOString();
  const beforeMap = new Map(before.map((r) => [r.id, r]));
  const afterMap = new Map(after.map((r) => [r.id, r]));
  const entries: RfpChangeLogEntry[] = [];

  for (const [id, req] of afterMap) {
    const prev = beforeMap.get(id);
    if (!prev) {
      entries.push({
        id: newRfpId("CHG"),
        at: now,
        version: "",
        kind: "added",
        requirementId: id,
        summary: `Added ${id}: ${req.requirement.slice(0, 80)}`,
      });
      continue;
    }
    if (
      prev.requirement !== req.requirement ||
      prev.priority !== req.priority ||
      prev.mandatory !== req.mandatory
    ) {
      entries.push({
        id: newRfpId("CHG"),
        at: now,
        version: "",
        kind: "modified",
        requirementId: id,
        summary: `Modified ${id}`,
      });
    }
  }

  for (const [id, req] of beforeMap) {
    if (!afterMap.has(id)) {
      entries.push({
        id: newRfpId("CHG"),
        at: now,
        version: "",
        kind: "removed",
        requirementId: id,
        summary: `Removed ${id}: ${req.requirement.slice(0, 80)}`,
      });
    }
  }

  return entries;
}

/**
 * Mark package as issued (v1.0 or current). Stores fingerprint for drift detection.
 */
export function markIssued(session: CrmRfpSession): CrmRfpSession {
  const now = new Date().toISOString();
  return {
    ...session,
    lastIssuedRequirementFingerprint: fingerprintRequirements(
      session.draft.requirements,
    ),
    versionMeta: {
      ...session.versionMeta,
      generatedAt: now,
      lastModifiedAt: now,
      changedAfterIssue: false,
    },
    updatedAt: now,
  };
}

/**
 * After requirements change post-issue, flag drift and optionally bump version.
 */
export function detectPostIssueChanges(
  session: CrmRfpSession,
): CrmRfpSession {
  if (!session.lastIssuedRequirementFingerprint) return session;
  const current = fingerprintRequirements(session.draft.requirements);
  if (current === session.lastIssuedRequirementFingerprint) {
    return {
      ...session,
      versionMeta: {
        ...session.versionMeta,
        changedAfterIssue: false,
      },
    };
  }
  return {
    ...session,
    versionMeta: {
      ...session.versionMeta,
      changedAfterIssue: true,
    },
  };
}

/**
 * Create Version N.M with change summary when regenerating after edits.
 */
export function generateNextVersion(
  session: CrmRfpSession,
  previousRequirements: RfpRequirement[],
): CrmRfpSession {
  const nextVersion = bumpMinorVersion(session.versionMeta.version);
  const changes = diffRequirements(
    previousRequirements,
    session.draft.requirements,
  ).map((c) => ({ ...c, version: nextVersion }));
  const now = new Date().toISOString();
  return {
    ...session,
    changeLog: [...session.changeLog, ...changes],
    lastIssuedRequirementFingerprint: fingerprintRequirements(
      session.draft.requirements,
    ),
    versionMeta: {
      ...session.versionMeta,
      version: nextVersion,
      generatedAt: now,
      lastModifiedAt: now,
      changedAfterIssue: false,
    },
    updatedAt: now,
  };
}

export function setRequirementsFrozen(
  session: CrmRfpSession,
  frozen: boolean,
  note = "",
): CrmRfpSession {
  return {
    ...session,
    versionMeta: {
      ...session.versionMeta,
      frozen,
      freezeNote:
        note ||
        (frozen
          ? "Evaluation requirements frozen after vendor issue. Changes are still allowed but will be recorded."
          : ""),
    },
  };
}
