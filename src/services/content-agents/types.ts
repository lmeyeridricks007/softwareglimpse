import type {
  AgentBrief,
  AgentContext,
  AgentDraftBundle,
  AgentReadiness,
  AgentValidationResult,
  ContentAgentId,
} from "@/domain";

/**
 * Specialized content agent contract.
 * Providers are injected — agents never call LLM SDKs directly.
 */
export interface ContentAgent {
  readonly id: ContentAgentId;
  readonly version: string;
  readonly pageType: AgentBrief["pageType"];
  readonly primaryIntent: AgentBrief["primaryIntent"];

  canRun(context: AgentContext): AgentReadiness;

  buildBrief(context: AgentContext): AgentBrief;

  /**
   * Produce structured draft from brief + context.
   * Implementations may call GenerationProvider — never publish.
   */
  execute(
    brief: AgentBrief,
    context: AgentContext,
  ): Promise<AgentDraftBundle>;

  validate(
    output: AgentDraftBundle,
    context: AgentContext,
  ): AgentValidationResult;
}

export type DryRunPreview = {
  agentId: ContentAgentId;
  agentVersion: string;
  targetSlug: string;
  readiness: AgentReadiness;
  mode: AgentContext["mode"];
  primaryIntent: AgentBrief["primaryIntent"];
  contextInputs: {
    factCount: number;
    assessmentCount: number;
    relationshipCount: number;
    rankingCount: number;
    methodology?: string;
    pricingVerified?: boolean;
  };
  expectedOutputType: string;
  promptTemplateId?: string;
};
