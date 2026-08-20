export { REDIRECT_PLAN_GENERATOR } from "./types";
export type * from "./types";
export {
  isAutoApprovedRedirect,
  flattenRedirectChains,
  nextRedirectSources,
  EXISTING_APP_ALIASES,
  WORDPRESS_RETIRED_PATTERNS,
} from "./policy";
export {
  validateRedirectDestination,
  assertNoRedirectChains,
  buildDestinationIndex,
} from "./validate";
export { generateRedirectPlan } from "./generate";
export {
  loadLegacyRedirectsFile,
  toNextConfigRedirects,
  legacyRedirectsConfigPath,
} from "./load-redirects";
export { renderRedirectManifestMarkdown } from "./report";
export {
  runRedirectPlanGenerator,
  type RedirectPlanGeneratorOptions,
  type RedirectPlanGeneratorResult,
} from "./agent";
