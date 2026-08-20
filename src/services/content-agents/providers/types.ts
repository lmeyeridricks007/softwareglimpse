import type {
  AgentBrief,
  AgentDraftBundle,
  EditorialDraft,
  GenerationCostMetadata,
} from "@/domain";
import type { GenerationProviderProfile } from "@/data/config/agents/provider-profiles";

export type GenerationRequest = {
  brief: AgentBrief;
  profile: GenerationProviderProfile;
  /** Structured hints already assembled by the agent (sections, etc.). */
  skeleton?: Partial<EditorialDraft>;
};

export type GenerationResponse = {
  draft: EditorialDraft;
  cost: GenerationCostMetadata;
  providerVersion: string;
};

/**
 * Provider-neutral generation interface.
 * Live LLM adapters must live outside agent domain classes.
 */
export interface GenerationProvider {
  readonly id: string;
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}

export type { AgentDraftBundle };
