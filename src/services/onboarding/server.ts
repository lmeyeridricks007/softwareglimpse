/**
 * Server/fs-facing onboarding exports.
 */
export {
  onboardSoftware,
  listOnboardingStages,
  validateOnboardingRepository,
  formatScorecard,
} from "./index";
export {
  saveOnboardingRun,
  loadOnboardingRun,
  listOnboardingRuns,
  findLatestRunForSlug,
  listCandidateSoftware,
  loadCandidateSoftware,
  listManifests,
  loadManifest,
} from "@/data/onboarding/store";
