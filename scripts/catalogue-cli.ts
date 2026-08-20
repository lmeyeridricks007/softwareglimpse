#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse catalogue onboarding CLI
 *
 * Usage:
 *   npm run catalogue:import
 *   npm run catalogue:status
 *   npm run catalogue:status -- --category email-marketing
 *   npm run catalogue:plan -- --dry-run
 *   npm run catalogue:next
 *   npm run catalogue:approve -- <batch-id>
 *   npm run catalogue:onboard -- --batch next
 *   npm run catalogue:run -- <batch-id>
 *   npm run catalogue:resume -- <batch-id>
 *   npm run catalogue:validate
 *   npm run catalogue:export -- --json
 *   npm run catalogue:commercial
 *   npm run catalogue:research-backlog
 *   npm run catalogue:category-backlog
 *   npm run catalogue:agent-backlog
 *   npm run catalogue:legacy
 *   npm run catalogue:crm
 *   npm run catalogue:report
 */
import {
  importAndProcessCatalogue,
  planCatalogueBatch,
  recommendNextBatch,
  approveCatalogueBatch,
  runCatalogueBatch,
  resumeCatalogueBatch,
  catalogueStatusReport,
  catalogueStatusByCategory,
  commercialReport,
  researchBacklogReport,
  categoryBacklogReport,
  agentBacklogReport,
  legacyContentReport,
  contentCoverageMatrix,
  categoryCoverageMatrix,
  operatingReport,
  crmReconciliationReport,
  exportCatalogueJson,
  explainPriority,
  validateCatalogueOnboarding,
  recordReviewDecision,
} from "@/services/catalogue-onboarding/server";
import {
  listCatalogueBatches,
  loadCatalogueBatch,
} from "@/data/catalogue/store";
import { AFFILIATE_INVENTORY_COUNT } from "@/data/catalogue/source";

type Args = {
  command: string;
  positional: string[];
  dryRun: boolean;
  json: boolean;
  category?: string;
  limit?: number;
  priority?: "high" | "medium" | "low" | "any";
  batch?: string;
  createOnly: boolean;
  decision?: string;
  mapTo?: string;
  notes?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "status",
    positional: [],
    dryRun: false,
    json: false,
    createOnly: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift()!;
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--dry-run") args.dryRun = true;
    else if (t === "--json") args.json = true;
    else if (t === "--create-only") args.createOnly = true;
    else if (t === "--category") args.category = rest.shift();
    else if (t === "--limit") args.limit = Number(rest.shift());
    else if (t === "--priority")
      args.priority = rest.shift() as Args["priority"];
    else if (t === "--batch") args.batch = rest.shift();
    else if (t === "--decision") args.decision = rest.shift();
    else if (t === "--map-to") args.mapTo = rest.shift();
    else if (t === "--notes") args.notes = rest.shift();
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
    case "import": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(
        {
          imported: items.length,
          inventoryConstant: AFFILIATE_INVENTORY_COUNT,
          buckets: Object.fromEntries(
            [
              "SOFTWARE",
              "SERVICE",
              "MARKETPLACE",
              "MULTI_PRODUCT_PROGRAM",
              "REVIEW_REQUIRED",
              "LOGISTICS",
              "SOFTWARE_LIKE_PLATFORM",
              "OTHER",
            ].map((b) => [
              b,
              items.filter((i) => i.classification.bucket === b).length,
            ]),
          ),
        },
        args.json,
      );
      break;
    }
    case "status": {
      const items = await importAndProcessCatalogue({ persist: true });
      if (args.category) {
        print(catalogueStatusByCategory(items, args.category), args.json);
      } else if (args.json) {
        print(
          {
            total: items.length,
            buckets: Object.fromEntries(
              [...new Set(items.map((i) => i.classification.bucket))].map(
                (b) => [
                  b,
                  items.filter((i) => i.classification.bucket === b).length,
                ],
              ),
            ),
          },
          true,
        );
      } else {
        print(catalogueStatusReport(items), false);
      }
      break;
    }
    case "plan": {
      const items = await importAndProcessCatalogue({ persist: !args.dryRun });
      const plan = planCatalogueBatch(items, {
        dryRun: args.dryRun,
        category: args.category,
        maxProducts: args.limit,
        priority: args.priority ?? "any",
      });
      if (args.json) {
        print(
          {
            batch: plan.batch,
            products: plan.items.map((i) => ({
              name: i.candidate.normalizedName,
              priority: i.priority.score,
              category: i.mapping.categorySlug,
              action: i.priority.actionHint,
              maturity: i.maturityTier,
              blockers: i.processing.blockers,
              reasons: i.priority.reasons,
            })),
            deferred: plan.deferred,
            explanation: plan.explanation,
          },
          true,
        );
      } else {
        console.log(`BATCH ${plan.batch.id} (${plan.batch.status})`);
        console.log(plan.explanation.join("\n"));
        console.log("\nDeferred:", plan.deferred.length);
      }
      break;
    }
    case "next": {
      const items = await importAndProcessCatalogue({ persist: true });
      const plan = recommendNextBatch(items);
      if (args.json) {
        print(
          {
            recommended: plan.items.map((i) => i.candidate.normalizedName),
            category: plan.batch.categoryIds[0],
            explanation: plan.explanation,
            batchPreview: plan.batch,
          },
          true,
        );
      } else {
        console.log("Recommended next:\n");
        console.log(plan.batch.categoryIds[0] ?? "(mixed)");
        console.log("");
        for (const i of plan.items) {
          console.log(i.candidate.normalizedName);
        }
        console.log("\nWhy:");
        console.log(plan.explanation.join("\n"));
      }
      break;
    }
    case "approve": {
      const batchId = args.positional[0];
      if (!batchId) throw new Error("Usage: catalogue approve <batch-id>");
      const batch = approveCatalogueBatch(batchId);
      print(batch, args.json);
      break;
    }
    case "onboard": {
      const items = await importAndProcessCatalogue({ persist: true });
      let batchId = args.batch ?? args.positional[0];
      if (batchId === "next" || !batchId) {
        const plan = planCatalogueBatch(items, {
          category: args.category,
          maxProducts: args.limit ?? 5,
          priority: args.priority ?? "any",
          dryRun: false,
        });
        batchId = plan.batch.id;
        approveCatalogueBatch(batchId);
        const result = await runCatalogueBatch(batchId, items, {
          dryRun: args.dryRun,
          createOnly: args.createOnly || args.dryRun,
        });
        print(result, args.json);
      } else {
        const batch = loadCatalogueBatch(batchId);
        if (!batch) throw new Error(`Unknown batch ${batchId}`);
        if (batch.status === "planned") approveCatalogueBatch(batchId);
        const result = await runCatalogueBatch(batchId, items, {
          dryRun: args.dryRun,
          createOnly: args.createOnly,
        });
        print(result, args.json);
      }
      break;
    }
    case "run": {
      const batchId = args.positional[0];
      if (!batchId) throw new Error("Usage: catalogue run <batch-id>");
      const items = await importAndProcessCatalogue({ persist: true });
      const batch = loadCatalogueBatch(batchId);
      if (batch?.status === "planned") approveCatalogueBatch(batchId);
      const result = await runCatalogueBatch(batchId, items, {
        dryRun: args.dryRun,
        createOnly: args.createOnly,
      });
      print(result, args.json);
      break;
    }
    case "resume": {
      const batchId = args.positional[0];
      if (!batchId) throw new Error("Usage: catalogue resume <batch-id>");
      const result = await resumeCatalogueBatch(batchId);
      print(result, args.json);
      break;
    }
    case "batches": {
      print(listCatalogueBatches(), args.json);
      break;
    }
    case "commercial": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(args.json ? items.map((i) => ({
        name: i.candidate.normalizedName,
        score: i.priority.score,
        label: i.priority.label,
        action: i.priority.actionHint,
        maturity: i.maturityTier,
      })) : commercialReport(items), args.json);
      break;
    }
    case "research-backlog": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(researchBacklogReport(items), args.json);
      break;
    }
    case "category-backlog": {
      await importAndProcessCatalogue({ persist: true });
      print(categoryBacklogReport(), args.json);
      break;
    }
    case "agent-backlog": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(agentBacklogReport(items), args.json);
      break;
    }
    case "legacy": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(legacyContentReport(items), args.json);
      break;
    }
    case "coverage": {
      const items = await importAndProcessCatalogue({ persist: true });
      if (args.json) {
        print(
          {
            products: contentCoverageMatrix(items),
            categories: categoryCoverageMatrix(),
          },
          true,
        );
      } else {
        console.log(contentCoverageMatrix(items));
        console.log("");
        console.log(categoryCoverageMatrix());
      }
      break;
    }
    case "crm": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(crmReconciliationReport(items), args.json);
      break;
    }
    case "report": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(operatingReport(items), args.json);
      break;
    }
    case "export": {
      const items = await importAndProcessCatalogue({ persist: true });
      print(exportCatalogueJson(items), true);
      break;
    }
    case "explain": {
      const name = args.positional[0];
      if (!name) throw new Error("Usage: catalogue explain <name>");
      const items = await importAndProcessCatalogue({ persist: true });
      const item = items.find(
        (i) =>
          i.candidate.normalizedName.toLowerCase() === name.toLowerCase() ||
          i.candidate.suggestedSlug === name ||
          i.candidate.sourceId === name,
      );
      if (!item) throw new Error(`Not found: ${name}`);
      print(explainPriority(item), args.json);
      break;
    }
    case "review": {
      const sourceId = args.positional[0];
      if (!sourceId || !args.decision) {
        throw new Error(
          "Usage: catalogue review <sourceId> --decision approve-as-software|classify-as-service|split-multi-product|map-to-existing|exclude",
        );
      }
      const updated = recordReviewDecision({
        sourceId,
        decision: args.decision as
          | "approve-as-software"
          | "classify-as-service"
          | "split-multi-product"
          | "map-to-existing"
          | "exclude",
        notes: args.notes,
        mapToSlug: args.mapTo,
      });
      print(updated, args.json);
      break;
    }
    case "validate": {
      const result = await validateCatalogueOnboarding();
      print(result, args.json);
      if (!result.ok) process.exitCode = 1;
      break;
    }
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
