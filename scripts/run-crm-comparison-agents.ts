#!/usr/bin/env npx tsx
/**
 * Run comparison-agent for every CRM pair.
 *
 *   npx tsx scripts/run-crm-comparison-agents.ts
 */
import { canonicalizeComparisonSlug } from "../src/domain";
import { listCrmProductSlugs } from "../src/services/comparison-research";
import { runContentAgent } from "../src/services/content-agents/server";

async function main() {
  const slugs = listCrmProductSlugs();
  const pairs: string[] = [];
  for (let i = 0; i < slugs.length; i += 1) {
    for (let j = i + 1; j < slugs.length; j += 1) {
      pairs.push(canonicalizeComparisonSlug([slugs[i]!, slugs[j]!]));
    }
  }

  let ok = 0;
  let blocked = 0;
  let failed = 0;
  const blockedDetails: Array<{ pair: string; reasons: unknown }> = [];

  for (const pair of pairs) {
    try {
      const result = await runContentAgent("comparison", pair, {
        persist: true,
        allowNormalizedFacts: true,
      });
      if (result.execution.status === "blocked") {
        blocked += 1;
        blockedDetails.push({
          pair,
          reasons: result.execution.errors ?? result.readiness,
        });
        console.log(`${pair}\tBLOCKED`);
      } else if (result.execution.status === "failed") {
        failed += 1;
        console.log(
          `${pair}\tFAILED\t${(result.execution.errors ?? []).join("; ")}`,
        );
      } else {
        ok += 1;
        console.log(
          `${pair}\t${result.execution.status}\t${result.bundle?.draft.id ?? ""}`,
        );
      }
    } catch (error) {
      failed += 1;
      console.log(
        `${pair}\tERROR\t${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.log(
    JSON.stringify(
      {
        total: pairs.length,
        ok,
        blocked,
        failed,
        blockedDetails: blockedDetails.slice(0, 8),
      },
      null,
      2,
    ),
  );
  if (failed > 0 || blocked > 0) process.exitCode = 1;
}

main();
