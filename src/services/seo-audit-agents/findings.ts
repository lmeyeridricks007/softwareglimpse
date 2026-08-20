import type {
  SeoAuditArea,
  SeoEffort,
  SeoFinding,
  SeoSeverity,
} from "./types";
import { stableSeoIssueId, type StableIdPrefix } from "./stable-ids";

export type FindingDraft = {
  prefix?: StableIdPrefix;
  kind: string;
  subject: string;
  signature?: string;
  severity: SeoSeverity;
  area: SeoAuditArea;
  problem: string;
  evidence: string;
  affectedPages?: string[];
  likelyCause: string;
  recommendedAction: string;
  filesLikelyAffected?: string[];
  expectedImpact: string;
  effort: SeoEffort;
  confidence?: number;
};

export function finding(draft: FindingDraft): SeoFinding {
  const prefix =
    draft.prefix ??
    (draft.area === "performance"
      ? "PERF"
      : draft.area === "media"
        ? "MEDIA"
        : draft.area === "outbound"
          ? "OUT"
          : "SEO");
  return {
    id: stableSeoIssueId(
      prefix,
      draft.kind,
      draft.subject,
      draft.signature ?? draft.problem,
    ),
    severity: draft.severity,
    area: draft.area,
    problem: draft.problem,
    evidence: draft.evidence,
    affectedPages: draft.affectedPages ?? [],
    likelyCause: draft.likelyCause,
    recommendedAction: draft.recommendedAction,
    filesLikelyAffected: draft.filesLikelyAffected ?? [],
    expectedImpact: draft.expectedImpact,
    effort: draft.effort,
    confidence: draft.confidence ?? 0.8,
  };
}
