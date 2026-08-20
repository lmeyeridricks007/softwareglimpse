/**
 * Use-case workflow product comparison.
 *
 * Client components must import from `./pair-client` + `./types` only.
 * Importing this barrel from a client module pulls research stores (node:fs).
 */
export type {
  WorkflowCompareMedia,
  WorkflowCompareRequirementDiff,
  WorkflowComparePlanDiff,
  WorkflowCompareProduct,
  WorkflowPairAnalysis,
  UseCaseWorkflowProductCompareModel,
} from "./types";

export {
  buildUseCaseWorkflowProductCompare,
  computePairAnalysis,
  resolveCompareHref,
  selectDefaultComparePair,
} from "./build-model";

export {
  buildPairAnalysis,
  lookupPairAnalysis,
} from "./pair-client";
