#!/usr/bin/env npx tsx
/**
 * Content Quality Gate CLI
 *
 *   npm run quality:gate -- analyze --type guide --slug what-is-crm
 *   npm run quality:gate -- analyze --type comparison --slug hubspot-vs-pipedrive --json
 *   npm run quality:gate -- profiles
 *   npm run quality:gate -- loop --type guide --slug what-is-crm --persist
 *
 * Analyzes only — never rewrites or publishes. Promotion stays on
 * canPromoteToIndexable / promoteToIndexable after the gate says indexEligible.
 */
import {
  analyzePageQualityGate,
  formatGateResultMarkdown,
  GATE_PAGE_TYPES,
  GATE_PROFILES,
  GATE_DIMENSION_META,
  recordGateResult,
  runGateImprovementLoop,
  type AnalyzePageRef,
  type GatePageType,
} from "@/services/content-quality/gate";

function parseArgs(argv: string[]) {
  const args: {
    command: string;
    type?: string;
    slug?: string;
    json: boolean;
    persist: boolean;
    note?: string;
  } = {
    command: "analyze",
    json: false,
    persist: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift()!;
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--type") args.type = rest.shift();
    else if (t === "--slug") args.slug = rest.shift();
    else if (t === "--json") args.json = true;
    else if (t === "--persist") args.persist = true;
    else if (t === "--note") args.note = rest.shift();
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === "profiles") {
    for (const p of Object.values(GATE_PROFILES)) {
      console.log(
        `${p.pageType}\tminIndex=${p.minIndexScore}\t${p.label}`,
      );
    }
    return;
  }

  if (args.command === "dimensions") {
    for (const [id, meta] of Object.entries(GATE_DIMENSION_META)) {
      console.log(`${id}\t${meta.label}\t${meta.explanation}`);
    }
    return;
  }

  if (args.command === "analyze" || args.command === "loop") {
    const type = args.type as GatePageType | undefined;
    const slug = args.slug;
    if (!type || !slug) {
      console.error(
        "Usage: quality:gate analyze --type <pageType> --slug <slug>",
      );
      console.error(`Page types: ${GATE_PAGE_TYPES.join(", ")}`);
      process.exit(1);
    }
    if (!GATE_PAGE_TYPES.includes(type)) {
      console.error(`Unknown page type: ${type}`);
      process.exit(1);
    }

    const ref = { pageType: type, slug } as AnalyzePageRef;
    const result = analyzePageQualityGate(ref);
    if (!result) {
      console.error(`Page not found: ${type}/${slug}`);
      process.exit(1);
    }

    if (args.command === "analyze") {
      if (args.persist) {
        recordGateResult(result, "analyze", { note: args.note });
      }
      if (args.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(formatGateResultMarkdown(result));
      }
      return;
    }

    // loop: record before, re-analyze as after (same content — for CLI wiring;
    // real improve happens outside this command).
    const after = analyzePageQualityGate(ref)!;
    const loop = runGateImprovementLoop({
      before: result,
      after,
      note: args.note ?? "reanalyze",
      persist: args.persist,
    });
    if (args.json) {
      console.log(JSON.stringify(loop, null, 2));
    } else {
      console.log(
        `Score delta ${loop.scoreDelta} · became index-eligible: ${loop.becameIndexEligible}`,
      );
      console.log(formatGateResultMarkdown(after));
    }
    return;
  }

  console.error(`Unknown command: ${args.command}`);
  process.exit(1);
}

main();
