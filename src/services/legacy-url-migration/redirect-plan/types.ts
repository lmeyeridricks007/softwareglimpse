/**
 * Redirect plan types — permanent legacy → new URL redirects only.
 */

export type RedirectType = "301" | "302";

export type RedirectApprovalStatus =
  | "auto_approved"
  | "manual_review_excluded"
  | "retired_no_redirect"
  | "existing_app_alias";

export type RedirectManifestEntry = {
  id: string;
  source: string;
  destination: string;
  type: RedirectType;
  reason: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchBasis?: string;
  legacyIntent?: string;
  approvalStatus: RedirectApprovalStatus;
  implemented: boolean;
  testStatus: "pending" | "pass" | "fail" | "skipped";
  notes?: string[];
};

export type LegacyRedirectsFile = {
  version: number;
  generatedAt: string;
  generator: string;
  policy: {
    onlyHighConfidence: true;
    permanentOnly: true;
    flattenChains: true;
    noHomepageDump: true;
    noMiddleware: true;
  };
  redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
    id: string;
    reason: string;
  }>;
  /** Exact sources that must NOT be redirected (retired). */
  retired: Array<{
    sourcePattern: string;
    action: "404" | "410";
    reason: string;
  }>;
  excludedManual: Array<{
    source: string;
    destination: string | null;
    reason: string;
    confidence: string;
  }>;
  stats: {
    redirects: number;
    autoApproved: number;
    manualExcluded: number;
    retiredPatterns: number;
    chainsFlattened: number;
  };
};

export const REDIRECT_PLAN_GENERATOR = {
  id: "redirect-plan-generator",
  name: "RedirectPlanGenerator",
  version: "1.0.0",
  mutatesProduction: false as const,
};
