/**
 * Central generation provider profiles — do not hardcode model names in agents.
 */
export type ProviderProfileId =
  | "deterministic-v1"
  | "manual-v1"
  | "openai-default"
  | "anthropic-default"
  | "gemini-default";

export type GenerationProviderProfile = {
  id: ProviderProfileId;
  provider: "deterministic" | "manual" | "openai" | "anthropic" | "gemini";
  /** Logical model key — resolved by adapters, never inlined in agents. */
  modelKey: string;
  temperature?: number;
  maxOutputTokens: number;
  timeoutMs: number;
  maxAttempts: number;
  /** When false, adapters must not call live APIs (tests/CI). */
  allowLiveNetwork: boolean;
};

export const DEFAULT_PROVIDER_PROFILE_ID: ProviderProfileId = "deterministic-v1";

export const GENERATION_PROVIDER_PROFILES: Record<
  ProviderProfileId,
  GenerationProviderProfile
> = {
  "deterministic-v1": {
    id: "deterministic-v1",
    provider: "deterministic",
    modelKey: "deterministic-template-v1",
    maxOutputTokens: 8_000,
    timeoutMs: 5_000,
    maxAttempts: 1,
    allowLiveNetwork: false,
  },
  "manual-v1": {
    id: "manual-v1",
    provider: "manual",
    modelKey: "manual-queue-v1",
    maxOutputTokens: 8_000,
    timeoutMs: 5_000,
    maxAttempts: 1,
    allowLiveNetwork: false,
  },
  "openai-default": {
    id: "openai-default",
    provider: "openai",
    modelKey: "openai.default",
    temperature: 0.2,
    maxOutputTokens: 8_000,
    timeoutMs: 60_000,
    maxAttempts: 2,
    allowLiveNetwork: false,
  },
  "anthropic-default": {
    id: "anthropic-default",
    provider: "anthropic",
    modelKey: "anthropic.default",
    temperature: 0.2,
    maxOutputTokens: 8_000,
    timeoutMs: 60_000,
    maxAttempts: 2,
    allowLiveNetwork: false,
  },
  "gemini-default": {
    id: "gemini-default",
    provider: "gemini",
    modelKey: "gemini.default",
    temperature: 0.2,
    maxOutputTokens: 8_000,
    timeoutMs: 60_000,
    maxAttempts: 2,
    allowLiveNetwork: false,
  },
};

/** Optional per-agent profile overrides (logical keys only). */
export const AGENT_PROVIDER_OVERRIDES: Partial<
  Record<string, ProviderProfileId>
> = {
  "internal-link-agent": "deterministic-v1",
  "qa-agent": "deterministic-v1",
};

export function resolveProviderProfile(
  agentId: string,
  override?: ProviderProfileId,
): GenerationProviderProfile {
  const id =
    override ??
    AGENT_PROVIDER_OVERRIDES[agentId] ??
    DEFAULT_PROVIDER_PROFILE_ID;
  return GENERATION_PROVIDER_PROFILES[id];
}
