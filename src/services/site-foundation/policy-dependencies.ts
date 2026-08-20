import type { LegalDocument } from "@/domain";
import { getSiteFoundationConfig } from "./config";

export type PolicyDependencyFlag = {
  documentId: string;
  reason: string;
  dependsOn: string[];
};

/**
 * When providers/cookies/processing change, flag Privacy + Cookie policies for review.
 */
export function flagPoliciesForProviderChange(
  change: string,
): PolicyDependencyFlag[] {
  const config = getSiteFoundationConfig();
  const targets = config.legalDocuments.filter((d) =>
    d.dependsOn.some((dep) =>
      ["processors", "processingActivities", "cookies", "consent", "retention"].includes(
        dep,
      ),
    ),
  );
  return targets.map((d) => ({
    documentId: d.id,
    reason: change,
    dependsOn: d.dependsOn,
  }));
}

export function documentNeedsLegalReview(doc: LegalDocument): boolean {
  return (
    doc.status === "draft" ||
    doc.status === "legal-review-required" ||
    !doc.approvedAt
  );
}
