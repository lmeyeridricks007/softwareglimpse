/**
 * Lean Sales Intelligence graph for tools (Requirements Builder first).
 * Smaller than the full CRM graph — no synthesizers / industry pages.
 */

export {
  SI_CAPABILITIES,
  getSiCapabilityDefinition,
  type SiCapabilityDefinition,
  type SiCapabilityRequirementDefinition,
} from "./capabilities";

export {
  SI_USE_CASES,
  getSiUseCaseDefinition,
  type SiUseCaseCapabilityDefinition,
  type SiUseCaseDefinition,
  type SiUseCaseRequirementDefinition,
} from "./use-cases";

export {
  SI_FEATURES,
  getSiFeatureDefinition,
  type SiFeatureDefinition,
} from "./features";

export {
  SI_REQUIREMENTS,
  getSiRequirementDefinition,
  type SiRequirementDefinition,
  type SiRequirementFeatureLink,
} from "./requirements";

import { SI_CAPABILITIES } from "./capabilities";
import { SI_FEATURES } from "./features";
import { SI_REQUIREMENTS } from "./requirements";
import { SI_USE_CASES } from "./use-cases";

export function listSiCapabilitySlugs(): string[] {
  return SI_CAPABILITIES.map((item) => item.slug);
}

export function listSiUseCaseSlugs(): string[] {
  return SI_USE_CASES.map((item) => item.slug);
}

export function listSiFeatureSlugs(): string[] {
  return SI_FEATURES.map((item) => item.slug);
}

export function listSiRequirementSlugs(): string[] {
  return SI_REQUIREMENTS.map((item) => item.slug);
}
