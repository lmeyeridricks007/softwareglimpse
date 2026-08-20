#!/usr/bin/env npx tsx
/**
 * Content Quality Evaluation CLI
 *
 *   npm run quality:evaluate -- --fixture excellent-guide
 *   npm run quality:evaluate -- --fixture thin-guide --report
 *   npm run quality:evaluate -- --all-fixtures --report
 *   npm run quality:fixtures
 *   npm run quality:validate
 *
 * Evaluation only — never rewrites or publishes content.
 */
import fs from "node:fs";
import {
  evaluateAndReport,
  formatQualityMarkdown,
  formatQualityText,
  FIXTURE_SNAPSHOTS,
  getFixtureSnapshot,
  parsePageSnapshot,
  PAGE_QUALITY_PROFILES,
  QUALITY_BAND_RANGES,
} from "@/services/content-quality";
import { listFixtureIds } from "@/services/content-quality/fixtures";
import { ContentQualityAssessmentSchema } from "@/domain";

type Args = {
  command: string;
  fixture?: string;
  file?: string;
  allFixtures: boolean;
  json: boolean;
  markdown: boolean;
  report: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "evaluate",
    allFixtures: false,
    json: false,
    markdown: false,
    report: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift()!;
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--fixture") args.fixture = rest.shift();
    else if (t === "--file") args.file = rest.shift();
    else if (t === "--all-fixtures") args.allFixtures = true;
    else if (t === "--json") args.json = true;
    else if (t === "--markdown") args.markdown = true;
    else if (t === "--report") args.report = true;
    else if (!t.startsWith("-") && !args.fixture) args.fixture = t;
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "fixtures":
    case "list": {
      console.log(listFixtureIds().join("\n"));
      return;
    }
    case "profiles": {
      for (const p of Object.values(PAGE_QUALITY_PROFILES)) {
        console.log(`${p.id}\t${p.pageType}\t${p.label}`);
      }
      return;
    }
    case "bands": {
      for (const b of QUALITY_BAND_RANGES) {
        console.log(`${b.min}–${b.max}\t${b.label}`);
      }
      return;
    }
    case "validate": {
      for (const id of listFixtureIds()) {
        const { assessment } = evaluateAndReport(getFixtureSnapshot(id), {
          writeReport: false,
          evaluatedAt: "2026-08-15T00:00:00.000Z",
        });
        ContentQualityAssessmentSchema.parse(assessment);
      }
      console.log(
        `OK — ${listFixtureIds().length} fixtures + ${Object.keys(PAGE_QUALITY_PROFILES).length} profiles`,
      );
      return;
    }
    case "evaluate":
    default: {
      const ids = args.allFixtures
        ? listFixtureIds()
        : args.fixture
          ? [args.fixture]
          : args.file
            ? ["__file__"]
            : [];

      if (!ids.length) {
        console.error(
          "Usage: quality:evaluate -- --fixture <id> [--report] [--json|--markdown]\n" +
            "       quality:evaluate -- --all-fixtures --report\n" +
            "       quality:evaluate -- --file snapshot.json --report\n" +
            `Fixtures: ${listFixtureIds().join(", ")}`,
        );
        process.exit(1);
      }

      for (const id of ids) {
        const snap =
          id === "__file__"
            ? parsePageSnapshot(
                JSON.parse(fs.readFileSync(args.file!, "utf8")),
              )
            : getFixtureSnapshot(id);
        const { assessment, reportPath } = evaluateAndReport(snap, {
          writeReport: args.report,
        });

        if (args.json) {
          console.log(JSON.stringify(assessment, null, 2));
        } else if (args.markdown) {
          console.log(formatQualityMarkdown(assessment));
        } else {
          console.log(formatQualityText(assessment));
          if (reportPath) console.log(`\nWrote ${reportPath}`);
        }
        if (ids.length > 1 && !args.json) console.log("\n---\n");
      }
      return;
    }
  }
}

main();
