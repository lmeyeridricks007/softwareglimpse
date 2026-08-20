#!/usr/bin/env npx tsx
/**
 * Supporting knowledge planner CLI.
 *
 * Examples:
 *   npm run knowledge:plan -- category crm
 *   npm run knowledge:plan -- product pipedrive
 *   npm run knowledge:gaps -- category crm
 *   npm run knowledge:support -- content:best:crm-software
 *   npm run knowledge:candidates -- category crm
 *   npm run knowledge:candidate -- candidate:crm-how-to-choose
 *   npm run knowledge:workflow -- candidate:crm-pricing-explained --category crm --dry-run
 *   npm run knowledge:route -- --query "how much does crm cost"
 *   npm run knowledge:audit -- crm
 *   npm run knowledge:validate
 */

import {
  createSupportingContentWorkflow,
  evaluateSupportingTopic,
  planCategoryKnowledge,
  planCoreSupportingWorkflows,
  planProductKnowledge,
  resolveAgentForIntent,
  saveCategoryKnowledgePlan,
  saveProductKnowledgePlan,
  validateKnowledgePlanners,
} from "@/services/knowledge-planners";
import { reportAnchorSupport } from "@/services/content-clusters";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--json") flags.json = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg.startsWith("--") && arg.includes("=")) {
      const [k, ...rest] = arg.slice(2).split("=");
      flags[k!] = rest.join("=");
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else flags[key] = true;
    } else positionals.push(arg);
  }
  return { flags, positionals };
}

function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0] ?? "help";
  const { flags, positionals } = parseArgs(argv.slice(1));

  switch (command) {
    case "plan": {
      const kind = positionals[0];
      const id = positionals[1];
      if (!kind || !id) {
        console.error("Usage: knowledge plan <category|product> <slug>");
        process.exit(1);
      }
      if (kind === "category") {
        const plan = planCategoryKnowledge(id);
        if (!flags.dryRun) saveCategoryKnowledgePlan(plan);
        if (flags.json) printJson(plan);
        else {
          console.log(`CATEGORY KNOWLEDGE PLAN — ${id}\n`);
          console.log(
            `CORE ${plan.summary.coreCount}  SECONDARY ${plan.summary.secondaryCount}  EXISTING ${plan.summary.existingCount}`,
          );
          console.log(
            `NEW_PAGE ${plan.summary.newPageCount}  EXPAND ${plan.summary.expandCount}  SECTION ${plan.summary.sectionCount}  REJECTED ${plan.summary.rejectedCount}`,
          );
          console.log(`SEO evidence: ${plan.summary.seoEvidence}\n`);
          console.log("AREAS");
          for (const a of plan.knowledgeAreas.filter((x) => x.applicable)) {
            console.log(`  ${a.label}`);
          }
          console.log("\nCORE CANDIDATES");
          for (const c of plan.topicCandidates.filter(
            (t) => t.priorityClass === "CORE",
          )) {
            console.log(
              `  ${c.readiness === "exists" ? "✓" : "-"} ${c.titleConcept} [${c.placement}]`,
            );
          }
          if (plan.warnings.length) {
            console.log("\nWARNINGS");
            for (const w of plan.warnings) console.log(`  ${w}`);
          }
          console.log("\nGuide tasks: Not executed");
        }
      } else if (kind === "product") {
        const plan = planProductKnowledge(id);
        if (!flags.dryRun) saveProductKnowledgePlan(plan);
        if (flags.json) printJson(plan);
        else {
          console.log(`PRODUCT SUPPORT CONTENT — ${id}\n`);
          console.log(`Eligibility: ${plan.eligibility}`);
          for (const r of plan.eligibilityReasons) console.log(`  ${r}`);
          console.log("\nCANDIDATES");
          for (const c of plan.topicCandidates) {
            console.log(
              `  ${c.priorityClass.padEnd(10)} ${c.titleConcept} [${c.placement}/${c.readiness}]`,
            );
          }
          if (!plan.topicCandidates.length) console.log("  (none)");
          console.log("\nREJECTED");
          for (const r of plan.rejected) {
            console.log(`  ✗ ${r.titleConcept}`);
            console.log(`    Reason: ${r.reason}`);
            if (r.canonicalTarget) console.log(`    Canonical: ${r.canonicalTarget}`);
          }
          console.log(
            `\nSignals: importance=${plan.signals.strategicImportance} complexity=${plan.signals.complexity} seoQueries=${plan.signals.seoQueryCount} affiliateCommissionUsed=${plan.signals.affiliateCommissionUsed}`,
          );
        }
      } else {
        console.error("kind must be category|product");
        process.exit(1);
      }
      break;
    }

    case "gaps": {
      const category =
        (flags.category as string) ||
        (positionals[0] === "category" ? positionals[1] : positionals[0]);
      const slugs = category
        ? [category]
        : listCategoryKnowledgeMaps().map((m) => m.categorySlug);
      const rows = slugs.map((slug) => ({
        category: slug,
        gaps: planCategoryKnowledge(slug).gaps,
      }));
      if (flags.json) printJson(category ? rows[0] : { categories: rows });
      else {
        for (const row of rows) {
          console.log(`KNOWLEDGE GAPS — ${row.category}\n`);
          for (const g of row.gaps) {
            console.log(`[${g.severity}] ${g.message}`);
          }
          if (!row.gaps.length) console.log("(none)");
          console.log("");
        }
      }
      break;
    }

    case "support": {
      const target = positionals[0] || (flags.target as string);
      if (!target) {
        console.error("Usage: knowledge support <contentId>");
        process.exit(1);
      }
      const report = reportAnchorSupport(target);
      if (flags.json) printJson(report);
      else {
        console.log(`ANCHOR SUPPORT — ${report.contentId}\n`);
        console.log("SUPPORTED BY");
        for (const g of report.supportedBy) {
          console.log(`  ${g.status.padEnd(12)} ${g.title}`);
        }
        if (!report.supportedBy.length) console.log("  (none)");
        console.log("\nGAPS");
        for (const g of report.gaps) console.log(`  - ${g.titleConcept}`);
      }
      break;
    }

    case "candidates": {
      const category =
        (flags.category as string) ||
        (positionals[0] === "category" ? positionals[1] : positionals[0]) ||
        "crm";
      const plan = planCategoryKnowledge(category);
      if (flags.json) printJson(plan.topicCandidates);
      else {
        for (const c of plan.topicCandidates) {
          console.log(
            `${c.id}  ${c.priorityClass}  ${c.placement}  ${c.titleConcept}`,
          );
        }
      }
      break;
    }

    case "candidate": {
      const id = positionals[0];
      if (!id) {
        console.error("Usage: knowledge candidate <id>");
        process.exit(1);
      }
      const category = (flags.category as string) || "crm";
      const plan = planCategoryKnowledge(category);
      const c = plan.topicCandidates.find(
        (t) => t.id === id || t.id === `candidate:${id}` || t.suggestedSlug === id,
      );
      if (!c) {
        console.error("Candidate not found");
        process.exit(1);
      }
      const decision = evaluateSupportingTopic(c);
      if (flags.json) printJson({ candidate: c, decision });
      else {
        console.log(c.titleConcept);
        console.log(`placement=${c.placement} readiness=${c.readiness}`);
        console.log(
          `decision=${decision.recommendation} → ${decision.workflowAction} (${decision.nextAgentId})`,
        );
        for (const r of decision.reasons) console.log(`  - ${r}`);
      }
      break;
    }

    case "workflow": {
      const topicId = positionals[0];
      if (!topicId) {
        console.error(
          "Usage: knowledge workflow <topic-id> --category crm [--dry-run]",
        );
        process.exit(1);
      }
      const result = createSupportingContentWorkflow({
        supportingTopicId: topicId,
        categorySlug: (flags.category as string) || "crm",
        dryRun: Boolean(flags.dryRun),
      });
      if (flags.json) printJson(result);
      else console.log(result.message);
      break;
    }

    case "core-plan": {
      const category = (flags.category as string) || positionals[0] || "crm";
      const items = planCoreSupportingWorkflows(category);
      if (flags.json) printJson(items);
      else {
        console.log(`CORE SUPPORTING WORKFLOWS — ${category} (not executed)\n`);
        for (const i of items) {
          console.log(
            `  ${i.suggestedSlug} → ${i.decision.workflowAction} (${i.decision.nextAgentId})`,
          );
        }
      }
      break;
    }

    case "route": {
      const route = resolveAgentForIntent({
        query: flags.query as string | undefined,
        suggestedPageType: flags.pageType as string | undefined,
        productSlug: flags.product as string | undefined,
        categorySlug: flags.category as string | undefined,
      });
      if (flags.json) printJson(route);
      else console.log(`${route.agentId} (${route.pageType}) — ${route.reason}`);
      break;
    }

    case "audit": {
      const category = positionals[0];
      if (category) {
        const plan = planCategoryKnowledge(category);
        if (flags.json) printJson(plan);
        else {
          console.log(`KNOWLEDGE AUDIT — ${category.toUpperCase()}\n`);
          console.log("CORE SUPPORT");
          const core = plan.topicCandidates.filter(
            (c) => c.priorityClass === "CORE",
          );
          console.log(
            `  Published/exists ${core.filter((c) => c.readiness === "exists").length}`,
          );
          console.log(
            `  Missing ${core.filter((c) => c.readiness !== "exists").length}`,
          );
          console.log("\nANCHORS WITHOUT SUPPORT");
          for (const a of plan.anchorCoverage.filter(
            (x) => x.supportingGuideCount === 0,
          )) {
            console.log(`  ${a.title}`);
          }
          console.log("\nJOURNEY");
          for (const j of plan.journeyAudit) {
            console.log(`  ${j.stage.padEnd(12)} ${j.status}`);
          }
        }
      } else {
        for (const map of listCategoryKnowledgeMaps()) {
          const plan = planCategoryKnowledge(map.categorySlug);
          const core = plan.topicCandidates.filter(
            (c) => c.priorityClass === "CORE",
          );
          const exists = core.filter((c) => c.readiness === "exists").length;
          console.log(
            `${map.categorySlug}: CORE exists ${exists}/${core.length} new-page ${plan.summary.newPageCount}`,
          );
        }
      }
      break;
    }

    case "validate": {
      const result = validateKnowledgePlanners();
      if (flags.json) printJson(result);
      else {
        for (const e of result.errors) console.error(`ERROR ${e}`);
        for (const w of result.warnings) console.warn(`WARN  ${w}`);
        console.log(result.ok ? "OK knowledge validate" : "FAILED");
      }
      process.exit(result.ok ? 0 : 1);
      break;
    }

    case "help":
    default:
      console.log(`Knowledge planners

  plan category|product <slug> [--json] [--dry-run]
  gaps [category <slug>] [--json]
  support <contentId> [--json]
  candidates category <slug> [--json]
  candidate <id> [--category crm] [--json]
  workflow <topic-id> --category crm [--dry-run] [--json]
  core-plan --category crm [--json]
  route --query "..." [--json]
  audit [category] [--json]
  validate [--json]
`);
      if (command !== "help") process.exit(1);
  }
}

main();
