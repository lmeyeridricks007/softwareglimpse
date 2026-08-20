#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse specialized content agents CLI
 *
 * Usage:
 *   npm run agent:list
 *   npm run agent:status
 *   npm run agent:ready
 *   npm run agent:run -- software-review -- getresponse
 *   npm run agent:run -- software-review -- getresponse --dry-run --json
 *   npm run agent:run -- comparison -- freshsales-vs-pipedrive
 *   npm run agent:run -- pricing-page -- pipedrive
 *   npm run agent:run -- refresh -- pipedrive --change pricing-changed
 *   npm run agent:qa -- <draft-id>
 *   npm run agent:validate
 *
 * Agents produce drafts only — never publish.
 */
import { loadAgentDraftBundle } from "@/data/agents/store";
import {
  agentRegistryStatus,
  buildReadyTaskReport,
  formatReadyTaskReport,
  reviseDraft,
  runContentAgent,
  runQa,
  validateContentAgents,
  buildAgentContext,
} from "@/services/content-agents/server";

type Args = {
  command: string;
  positional: string[];
  dryRun: boolean;
  json: boolean;
  change?: string;
  allowNormalized: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "list",
    positional: [],
    dryRun: false,
    json: false,
    allowNormalized: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) {
    args.command = rest.shift()!;
  }
  while (rest.length) {
    const token = rest.shift()!;
    if (token === "--dry-run") args.dryRun = true;
    else if (token === "--json") args.json = true;
    else if (token === "--allow-normalized") args.allowNormalized = true;
    else if (token === "--change") args.change = rest.shift();
    else if (token === "--") continue;
    else if (!token.startsWith("-")) args.positional.push(token);
  }
  return args;
}

function print(data: unknown, asJson: boolean): void {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (typeof data === "string") {
    console.log(data);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "list":
    case "status": {
      const rows = agentRegistryStatus().map(
        (a) => `${a.id.padEnd(28)} ${a.status}  v${a.version}`,
      );
      print(args.json ? agentRegistryStatus() : rows.join("\n"), args.json);
      return;
    }
    case "ready": {
      const product = args.positional[0];
      const rows = buildReadyTaskReport(product);
      print(
        args.json ? rows : formatReadyTaskReport(rows),
        args.json,
      );
      return;
    }
    case "run": {
      const agent = args.positional[0];
      const target = args.positional[1];
      if (!agent || !target) {
        console.error(
          "Usage: agent:run -- <agent> -- <target> [--dry-run] [--json]",
        );
        process.exitCode = 1;
        return;
      }
      const changeEvents =
        args.change === "pricing-changed"
          ? [
              {
                type: "pricing-changed",
                affectedSections: ["pricing-overview", "pricing", "example-costs"],
                summary: "Verified pricing changed — refresh pricing sections only",
              },
            ]
          : undefined;
      const agentAlias =
        args.change && !String(agent).includes("refresh")
          ? "refresh"
          : agent;
      const result = await runContentAgent(agentAlias, target, {
        dryRun: args.dryRun,
        json: args.json,
        persist: !args.dryRun,
        allowNormalizedFacts:
          args.allowNormalized || target === "getresponse",
        mode: changeEvents ? "REFRESH" : "CREATE",
        changeEvents,
      });

      print(args.json ? result : formatRun(result), args.json);
      process.exitCode =
        result.execution.status === "blocked" ||
        result.execution.status === "failed"
          ? 1
          : 0;
      return;
    }
    case "qa": {
      const draftId = args.positional[0];
      if (!draftId) {
        console.error("Usage: agent:qa -- <draft-id>");
        process.exitCode = 1;
        return;
      }
      const bundle = loadAgentDraftBundle(draftId);
      if (!bundle) {
        console.error(`Draft not found: ${draftId}`);
        process.exitCode = 1;
        return;
      }
      const context = buildAgentContext({
        agentId: bundle.extension.agentId,
        productSlugs: [bundle.draft.targetSlug],
        targetSlug: bundle.draft.targetSlug,
        allowNormalizedFacts: true,
      });
      const qa = runQa(bundle, context);
      print(qa, args.json);
      process.exitCode = qa.status === "fail" ? 1 : 0;
      return;
    }
    case "revise": {
      const draftId = args.positional[0];
      if (!draftId) {
        console.error("Usage: agent:revise -- <draft-id>");
        process.exitCode = 1;
        return;
      }
      const bundle = loadAgentDraftBundle(draftId);
      if (!bundle) {
        console.error(`Draft not found: ${draftId}`);
        process.exitCode = 1;
        return;
      }
      const context = buildAgentContext({
        agentId: bundle.extension.agentId,
        productSlugs: [bundle.draft.targetSlug],
        targetSlug: bundle.draft.targetSlug,
        allowNormalizedFacts: true,
      });
      const qa = runQa(bundle, context);
      const { bundle: revised, record } = reviseDraft({
        original: bundle,
        issues: [...qa.blockers, ...qa.warnings],
        instructions: ["qa-targeted-revision"],
        context,
      });
      const qa2 = runQa(revised, context);
      print(
        args.json
          ? { record, qaBefore: qa, qaAfter: qa2, draftId: revised.draft.id }
          : `Revised ${record.originalDraftId} → ${record.revisedDraftId}\nQA before: ${qa.status}\nQA after: ${qa2.status}`,
        args.json,
      );
      process.exitCode = qa2.status === "fail" ? 1 : 0;
      return;
    }
    case "validate": {
      const report = validateContentAgents();
      print(report, args.json);
      process.exitCode = report.ok ? 0 : 1;
      return;
    }
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exitCode = 1;
  }
}

function formatRun(result: Awaited<ReturnType<typeof runContentAgent>>): string {
  const lines = [
    `agent: ${result.execution.agentId}@${result.execution.agentVersion}`,
    `status: ${result.execution.status}`,
    `readiness: ${result.readiness.status}`,
    ...result.readiness.reasons.map((r) => `  - ${r.code}: ${r.message}`),
  ];
  if (result.dryRunPreview) {
    lines.push("dry-run preview:");
    lines.push(JSON.stringify(result.dryRunPreview, null, 2));
  }
  if (result.bundle) {
    lines.push(`draftId: ${result.bundle.draft.id}`);
    lines.push(`sections: ${result.bundle.draft.sections.map((s) => s.id).join(", ")}`);
  }
  if (result.execution.qa) {
    lines.push(`qa: ${result.execution.qa.status}`);
    for (const b of result.execution.qa.blockers) {
      lines.push(`  blocker ${b.type}: ${b.message}`);
    }
  }
  if (result.execution.errors.length) {
    lines.push("errors:");
    for (const e of result.execution.errors) lines.push(`  - ${e}`);
  }
  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
