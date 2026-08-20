#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse workflow orchestration CLI
 *
 * Usage:
 *   npm run workflow:list
 *   npm run workflow:plan -- software getresponse
 *   npm run workflow:create -- software getresponse
 *   npm run workflow:run -- <run-id>
 *   npm run workflow:resume -- <run-id>
 *   npm run workflow:status -- <run-id>
 *   npm run workflow:ready
 *   npm run workflow:blocked
 *   npm run workflow:cancel -- <run-id> --reason "..."
 *   npm run workflow:close-published [--dry-run]
 *   npm run approval:list
 *   npm run approval:approve -- <id>
 *   npm run approval:reject -- <id> --reason "..."
 *   npm run workflow:validate
 *   npm run workflow:metrics
 */
import {
  SoftwareWorkflowInputSchema,
  CategoryWorkflowInputSchema,
  SingleContentWorkflowInputSchema,
  RefreshWorkflowInputSchema,
  ContentAgentIdSchema,
} from "@/domain";
import {
  createSoftwareWorkflow,
  createCategoryWorkflow,
  createSingleContentWorkflow,
  createRefreshWorkflow,
  runWorkflow,
  resumeWorkflow,
  cancelWorkflow,
  getWorkflowStatus,
  planWorkflow,
  formatWorkflowStatus,
  approveWorkflowApproval,
  rejectWorkflowApproval,
  listApprovals,
  listWorkflowRuns,
  listReadySteps,
  listBlockedSteps,
  resolveStepReadiness,
  validateWorkflowOrchestration,
  workflowMetrics,
  listWorkflowDefinitions,
  closeParkedContentWorkflowsForPublishedCatalogue,
} from "@/services/workflow-orchestration/server";

type Args = {
  command: string;
  positional: string[];
  dryRun: boolean;
  json: boolean;
  reason?: string;
  agent?: string;
  change?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "list",
    positional: [],
    dryRun: false,
    json: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift()!;
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--dry-run") args.dryRun = true;
    else if (t === "--json") args.json = true;
    else if (t === "--reason") args.reason = rest.shift();
    else if (t === "--agent") args.agent = rest.shift();
    else if (t === "--change") args.change = rest.shift();
    else if (t === "--") continue;
    else if (!t.startsWith("-")) args.positional.push(t);
  }
  return args;
}

function print(data: unknown, asJson: boolean): void {
  if (asJson) console.log(JSON.stringify(data, null, 2));
  else if (typeof data === "string") console.log(data);
  else console.log(JSON.stringify(data, null, 2));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "list": {
      if (args.positional[0] === "definitions") {
        print(
          listWorkflowDefinitions().map((d) => ({
            id: d.id,
            version: d.version,
            name: d.name,
            steps: d.steps.length,
          })),
          args.json,
        );
        return;
      }
      const statusFilter = args.positional.find((p) => p.startsWith("status="))?.split("=")[1];
      const targetFilter = args.positional.find((p) => p.startsWith("target="))?.split("=")[1];
      let runs = listWorkflowRuns();
      if (statusFilter) runs = runs.filter((r) => r.status === statusFilter);
      if (targetFilter) runs = runs.filter((r) => r.targetId === targetFilter);
      // Also support --status via positional flags style from docs
      print(
        args.json
          ? runs
          : runs
              .map(
                (r) =>
                  `${r.id}  ${r.status.padEnd(24)} ${r.workflowId}@${r.workflowVersion}  ${r.targetId}`,
              )
              .join("\n") || "(no runs)",
        args.json,
      );
      return;
    }
    case "definitions": {
      print(
        listWorkflowDefinitions().map((d) => `${d.id}:v${d.version}`),
        args.json,
      );
      return;
    }
    case "plan": {
      const kind = args.positional[0];
      const target = args.positional[1];
      if (!kind || !target) {
        console.error("Usage: workflow:plan -- software|category|content|refresh <target>");
        process.exitCode = 1;
        return;
      }
      const defId =
        kind === "software"
          ? "software-onboarding-content"
          : kind === "category"
            ? "category-onboarding-content"
            : kind === "refresh"
              ? "content-refresh"
              : "single-content-generation";
      const plan = planWorkflow(defId, target, {
        allowNormalizedFacts: target === "getresponse",
        agentId: args.agent,
        targetSlug: target,
      });
      print(args.json ? plan : formatPlan(plan), args.json);
      return;
    }
    case "create": {
      const kind = args.positional[0];
      const target = args.positional[1];
      if (!kind || !target) {
        console.error("Usage: workflow:create -- software <slug>");
        process.exitCode = 1;
        return;
      }
      let run;
      if (kind === "software") {
        run = createSoftwareWorkflow(
          SoftwareWorkflowInputSchema.parse({
            productId: target,
            options: {
              dryRun: args.dryRun,
              allowNormalizedFacts: target === "getresponse",
              maxComparisons: 3,
            },
          }),
        );
      } else if (kind === "category") {
        run = createCategoryWorkflow(
          CategoryWorkflowInputSchema.parse({ categoryId: target }),
        );
      } else if (kind === "content") {
        const agent = ContentAgentIdSchema.parse(
          args.agent ?? "software-review-agent",
        );
        run = createSingleContentWorkflow(
          SingleContentWorkflowInputSchema.parse({
            agentId: agent,
            targetSlug: target,
            options: { allowNormalizedFacts: target === "getresponse" },
          }),
        );
      } else if (kind === "refresh") {
        run = createRefreshWorkflow(
          RefreshWorkflowInputSchema.parse({
            contentId: `content:software:${target}`,
            productId: target,
            changeEventType: args.change ?? "pricing-changed",
          }),
        );
      } else {
        console.error(`Unknown kind: ${kind}`);
        process.exitCode = 1;
        return;
      }
      if (!args.dryRun) {
        // create already persisted
      }
      print(args.json ? run : `Created ${run.id}\n${formatWorkflowStatus(run)}`, args.json);
      return;
    }
    case "run": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: workflow:run -- <run-id>");
        process.exitCode = 1;
        return;
      }
      const run = await runWorkflow(id, { dryRun: args.dryRun });
      print(args.json ? run : formatWorkflowStatus(run), args.json);
      process.exitCode =
        run.status === "failed" || run.status === "blocked" ? 1 : 0;
      return;
    }
    case "execute": {
      // create + run software in one shot
      const kind = args.positional[0] === "software" || args.positional[0] === "category"
        ? args.positional[0]
        : "software";
      const slug =
        kind === args.positional[0] ? args.positional[1] : args.positional[0];
      if (!slug) {
        console.error("Usage: workflow:execute -- software <slug>");
        process.exitCode = 1;
        return;
      }
      const created =
        kind === "category"
          ? createCategoryWorkflow(
              CategoryWorkflowInputSchema.parse({ categoryId: slug }),
            )
          : createSoftwareWorkflow(
              SoftwareWorkflowInputSchema.parse({
                productId: slug,
                options: {
                  allowNormalizedFacts: slug === "getresponse",
                  maxComparisons: 3,
                },
              }),
            );
      const run = await runWorkflow(created.id, { dryRun: args.dryRun });
      print(args.json ? run : formatWorkflowStatus(run), args.json);
      return;
    }
    case "resume": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: workflow:resume -- <run-id>");
        process.exitCode = 1;
        return;
      }
      const run = await resumeWorkflow(id, { dryRun: args.dryRun });
      print(args.json ? run : formatWorkflowStatus(run), args.json);
      return;
    }
    case "status": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: workflow:status -- <run-id>");
        process.exitCode = 1;
        return;
      }
      const run = getWorkflowStatus(id);
      if (!run) {
        console.error(`Not found: ${id}`);
        process.exitCode = 1;
        return;
      }
      print(args.json ? run : formatWorkflowStatus(run), args.json);
      return;
    }
    case "ready": {
      const rows: string[] = ["READY TO RUN", ""];
      const jsonRows: unknown[] = [];
      for (const run of listWorkflowRuns()) {
        if (["cancelled", "superseded", "completed", "completed-with-warnings", "failed"].includes(run.status)) {
          continue;
        }
        const resolved = resolveStepReadiness(run);
        for (const step of listReadySteps(resolved)) {
          rows.push(step.label ?? step.id);
          rows.push(run.targetId);
          rows.push("");
          jsonRows.push({
            runId: run.id,
            stepId: step.id,
            label: step.label,
            target: run.targetId,
            agentId: step.config.agentId,
          });
        }
      }
      print(args.json ? jsonRows : rows.join("\n").trim() || "READY TO RUN\n(none)", args.json);
      return;
    }
    case "blocked": {
      const rows: string[] = ["BLOCKED", ""];
      const jsonRows: unknown[] = [];
      for (const run of listWorkflowRuns()) {
        const resolved = resolveStepReadiness(run);
        for (const step of listBlockedSteps(resolved)) {
          rows.push(step.label ?? step.id);
          rows.push(run.targetId);
          for (const b of step.blockers) rows.push(`- ${b}`);
          rows.push("");
          jsonRows.push({
            runId: run.id,
            stepId: step.id,
            target: run.targetId,
            blockers: step.blockers,
          });
        }
      }
      print(args.json ? jsonRows : rows.join("\n").trim() || "BLOCKED\n(none)", args.json);
      return;
    }
    case "cancel": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: workflow:cancel -- <run-id> --reason \"...\"");
        process.exitCode = 1;
        return;
      }
      const run = cancelWorkflow(id, args.reason ?? "cancelled via CLI");
      print(args.json ? run : `Cancelled ${run.id}`, args.json);
      return;
    }
    case "close-published": {
      const result = closeParkedContentWorkflowsForPublishedCatalogue({
        decidedBy: "cli",
        reason:
          args.reason ??
          "Catalogue software page already published; agent drafts remain unpublished",
        dryRun: args.dryRun,
      });
      print(
        args.json
          ? result
          : [
              args.dryRun ? "DRY RUN" : "CLOSED",
              "",
              `runs: ${result.cancelledRunIds.length}`,
              ...result.cancelledRunIds.map((id) => `- ${id}`),
              "",
              `approvals rejected: ${result.rejectedApprovalIds.length}`,
              ...result.rejectedApprovalIds.map((id) => `- ${id}`),
            ].join("\n"),
        args.json,
      );
      return;
    }
    case "validate": {
      const report = validateWorkflowOrchestration();
      print(report, args.json);
      process.exitCode = report.ok ? 0 : 1;
      return;
    }
    case "metrics": {
      print(workflowMetrics(), args.json);
      return;
    }
    // approval subcommands also routed via approval:* npm scripts
    case "approval-list":
    case "approvals": {
      const list = listApprovals();
      print(
        args.json
          ? list
          : list
              .map(
                (a) =>
                  `${a.id}  ${a.status.padEnd(10)} ${a.type}  draft=${a.draftId ?? "-"}  qa=${a.qaStatus ?? "-"}`,
              )
              .join("\n") || "(no approvals)",
        args.json,
      );
      return;
    }
    case "approval-approve": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: approval:approve -- <id>");
        process.exitCode = 1;
        return;
      }
      const record = approveWorkflowApproval(id, "cli", args.reason);
      print(args.json ? record : `Approved ${record?.id}`, args.json);
      return;
    }
    case "approval-reject": {
      const id = args.positional[0];
      if (!id) {
        console.error("Usage: approval:reject -- <id> --reason \"...\"");
        process.exitCode = 1;
        return;
      }
      const record = rejectWorkflowApproval(
        id,
        "cli",
        args.reason ?? "rejected",
      );
      print(args.json ? record : `Rejected ${record?.id}`, args.json);
      return;
    }
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exitCode = 1;
  }
}

function formatPlan(plan: ReturnType<typeof planWorkflow>): string {
  const lines = [
    `PLAN ${plan.definition.id}:v${plan.definition.version}`,
    plan.existingRun ? `Existing run: ${plan.existingRun}` : "No existing run",
    "",
    "Steps:",
  ];
  for (const s of plan.steps) {
    lines.push(
      `- ${s.id} [${s.handler}] deps=${s.dependsOn.join(",") || "-"} ${s.required ? "required" : "optional"}${s.agentId ? ` agent=${s.agentId}` : ""}`,
    );
  }
  if (plan.blockers.length) {
    lines.push("", "Blockers:");
    for (const b of plan.blockers) lines.push(`- ${b}`);
  }
  lines.push("", "Approval gates: editorial (default stopAfterApproval)");
  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
