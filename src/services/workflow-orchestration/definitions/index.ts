import type { WorkflowDefinition } from "@/domain";
import { softwareOnboardingContentWorkflow } from "./software-onboarding-content";
import { categoryContentWorkflow } from "./category-content";
import { contentRefreshWorkflow } from "./content-refresh";
import { singleContentGenerationWorkflow } from "./single-content";
import { supportingContentWorkflow } from "./supporting-content";

const DEFINITIONS: WorkflowDefinition[] = [
  softwareOnboardingContentWorkflow,
  categoryContentWorkflow,
  contentRefreshWorkflow,
  singleContentGenerationWorkflow,
  supportingContentWorkflow,
];

const BY_ID = new Map(DEFINITIONS.map((d) => [`${d.id}:v${d.version}`, d]));
const BY_BASE = new Map(DEFINITIONS.map((d) => [d.id, d]));

export function listWorkflowDefinitions(): WorkflowDefinition[] {
  return [...DEFINITIONS];
}

export function getWorkflowDefinition(
  id: string,
  version?: string,
): WorkflowDefinition {
  if (version) {
    const keyed = BY_ID.get(`${id}:v${version}`);
    if (keyed) return keyed;
  }
  const latest = BY_BASE.get(id);
  if (!latest) throw new Error(`Unknown workflow definition: ${id}`);
  return latest;
}

export {
  softwareOnboardingContentWorkflow,
  categoryContentWorkflow,
  contentRefreshWorkflow,
  singleContentGenerationWorkflow,
  supportingContentWorkflow,
};
