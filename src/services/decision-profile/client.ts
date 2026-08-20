/**
 * Client-safe decision-profile surface.
 * Avoid importing the service barrel from client components when possible —
 * this module keeps persistence + profile mutations without pulling unrelated
 * server-only graph paths through accidental barrel re-exports.
 */

export {
  CRM_DECISION_PROFILE_STORAGE_KEY,
  SI_DECISION_PROFILE_STORAGE_KEY,
  createEmptyCrmDecisionProfile,
  createEmptySiDecisionProfile,
  createEmptyDecisionProfile,
  decisionProfileStorageKey,
  loadCrmDecisionProfile,
  saveCrmDecisionProfile,
  resetCrmDecisionProfile,
  touchCrmDecisionProfile,
  loadSiDecisionProfile,
  saveSiDecisionProfile,
  resetSiDecisionProfile,
  touchSiDecisionProfile,
  loadDecisionProfile,
  saveDecisionProfile,
  resetDecisionProfile,
  touchDecisionProfile,
} from "./persistence";

export {
  syncDecisionProfileToFinderStorage,
  syncDecisionProfileToCostStorage,
  mergeFinderAnswersIntoProfile,
  applyRequirementToProfile,
  applyFeatureToProfile,
  seedProfileFromQuery,
} from "./adapters";

export {
  deriveCapabilitiesFromUseCases,
  deriveRequirementsFromCapabilities,
  deriveFeaturesFromRequirements,
  resolveRequirementMeta,
  listSelectableCrmUseCases,
  listSelectableCrmCapabilities,
  listOptionalDirectFeatures,
  mapUseCaseToFinderSlug,
  primaryFinderUseCaseFromProfile,
} from "./derive";

export {
  deriveSiCapabilitiesFromUseCases,
  deriveSiRequirementsFromCapabilities,
  deriveSiFeaturesFromRequirements,
  resolveSiRequirementMeta,
  listSelectableSiUseCases,
  listSelectableSiCapabilities,
  listOptionalSiDirectFeatures,
  mapSiUseCaseToFinderSlug,
  primarySiFinderUseCaseFromProfile,
} from "./si-derive";

export {
  isSiProfile,
  productNounForProfile,
  listSelectableUseCasesForProfile,
  listSelectableCapabilitiesForProfile,
  resolveRequirementMetaForProfile,
  profileTitleForExport,
  usersLabelForProfile,
} from "./category-helpers";

export {
  buildProfileCompleteness,
  type ProfileCompleteness,
  type CompletenessStatus,
} from "./completeness";

export { buildProfileWarnings, type ProfileWarning } from "./warnings";

export {
  profileToPlainTextSummary,
  profileToJsonExport,
  profileToCsvChecklist,
} from "./export";
