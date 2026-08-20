import { listContentAgents, getContentAgent } from "./registry";
import { ContentAgentIdSchema } from "@/domain";
import { PROMPT_TEMPLATES } from "./prompts";
import { GENERATION_PROVIDER_PROFILES } from "@/data/config/agents/provider-profiles";

export type AgentValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

export type AgentValidationReport = {
  ok: boolean;
  issues: AgentValidationIssue[];
  agentCount: number;
};

export function validateContentAgents(): AgentValidationReport {
  const issues: AgentValidationIssue[] = [];
  const agents = listContentAgents();

  for (const id of ContentAgentIdSchema.options) {
    try {
      getContentAgent(id);
    } catch {
      issues.push({
        severity: "error",
        code: "AGENT_MISSING",
        message: `Registry missing agent ${id}`,
      });
    }
  }

  for (const agent of agents) {
    if (!agent.version) {
      issues.push({
        severity: "error",
        code: "AGENT_VERSION_MISSING",
        message: `${agent.id} missing version`,
      });
    }
  }

  for (const key of Object.keys(PROMPT_TEMPLATES)) {
    const t = PROMPT_TEMPLATES[key];
    if (!t.role || !t.outputSchemaHint) {
      issues.push({
        severity: "error",
        code: "PROMPT_INCOMPLETE",
        message: `Prompt ${key} incomplete`,
      });
    }
  }

  for (const profile of Object.values(GENERATION_PROVIDER_PROFILES)) {
    if (profile.allowLiveNetwork) {
      issues.push({
        severity: "warning",
        code: "LIVE_NETWORK_ENABLED",
        message: `Provider profile ${profile.id} allows live network`,
      });
    }
  }

  return {
    ok: issues.filter((i) => i.severity === "error").length === 0,
    issues,
    agentCount: agents.length,
  };
}
