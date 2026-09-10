export { EVIDENCE_QUALITY_VERSION } from "./types";
export type {
  EvidenceSourceKind,
  NormalizedEvidenceSource,
  PlanEvidenceRow,
  PricingVerificationResult,
  ProductEvidencePack,
  LanguageQaHit,
  EvidenceQualityReport,
} from "./types";

export { buildProductEvidencePack } from "./build-pack";
export {
  pickPricingSource,
  pickPricingSources,
  matchPlanNamesInHtml,
  verifyPricingAgainstVendor,
} from "./verify-pricing";
export {
  BANNED_HANDS_ON_LANGUAGE,
  runEvidenceLanguageQa,
} from "./language-qa";
export { runEvidenceQuality } from "./run";
export type { RunEvidenceQualityOptions } from "./run";
export { renderEvidenceQualityMarkdown } from "./report";
