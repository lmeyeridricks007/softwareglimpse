#!/usr/bin/env npx tsx
/**
 * Official Asset Discovery CLI
 *
 *   npm run assets:audit -- --fixture hubspot-product --report
 *   npm run assets:audit -- --software hubspot --report
 *   npm run assets:audit -- --guide what-is-crm --report
 *   npm run assets:audit:software -- hubspot --report
 *   npm run assets:audit:guides -- what-is-crm --report
 *   npm run assets:audit:crm -- --report
 *
 * Recommendations only — never publishes, downloads, or mutates content.
 */
import fs from "node:fs";
import {
  AssetDiscoveryReportSchema,
  ASSET_DISCOVERY_VERSION,
} from "@/domain/schemas/asset-discovery";
import {
  auditAndReport,
  formatAssetDiscoveryMarkdown,
  formatAssetDiscoveryText,
  getFixturePageSnapshot,
  getFixtureSeededCandidates,
  listFixturePageIds,
  listRegisteredVendorSlugs,
  loadGuidePageSnapshot,
  loadSoftwarePageSnapshot,
  parsePageAssetSnapshot,
  VENDOR_OFFICIAL_SOURCE_REGISTRY,
} from "@/services/asset-discovery";
import { getSoftwareByCategory } from "@/data/repositories/catalog";
import { getGuidesByCategory } from "@/data/repositories/guides";

type Args = {
  command: string;
  fixture?: string;
  software?: string;
  guide?: string;
  file?: string;
  allFixtures: boolean;
  crm: boolean;
  needsOnly: boolean;
  withSeeds: boolean;
  json: boolean;
  markdown: boolean;
  report: boolean;
  positional: string[];
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "audit",
    allFixtures: false,
    crm: false,
    needsOnly: false,
    withSeeds: false,
    json: false,
    markdown: false,
    report: false,
    positional: [],
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) {
    const cmd = rest[0];
    if (
      [
        "audit",
        "fixtures",
        "registry",
        "validate",
        "software",
        "guides",
        "crm",
      ].includes(cmd)
    ) {
      args.command = rest.shift()!;
    }
  }
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--fixture") args.fixture = rest.shift();
    else if (t === "--software") args.software = rest.shift();
    else if (t === "--guide") args.guide = rest.shift();
    else if (t === "--file") args.file = rest.shift();
    else if (t === "--all-fixtures") args.allFixtures = true;
    else if (t === "--crm") args.crm = true;
    else if (t === "--needs-only") args.needsOnly = true;
    else if (t === "--with-seeds") args.withSeeds = true;
    else if (t === "--json") args.json = true;
    else if (t === "--markdown") args.markdown = true;
    else if (t === "--report") args.report = true;
    else if (!t.startsWith("-")) args.positional.push(t);
  }
  return args;
}

async function auditOne(
  label: string,
  load: () =>
    | ReturnType<typeof getFixturePageSnapshot>
    | ReturnType<typeof loadSoftwarePageSnapshot>
    | ReturnType<typeof loadGuidePageSnapshot>
    | ReturnType<typeof parsePageAssetSnapshot>,
  opts: Args & { seeded?: boolean },
): Promise<void> {
  const snapshot = load();
  if (!snapshot) {
    console.error(`Not found: ${label}`);
    process.exitCode = 1;
    return;
  }
  const fixtureId =
    opts.fixture ??
    (label.startsWith("fixture:") ? label.slice("fixture:".length) : undefined);
  const seededCandidates =
    opts.withSeeds && fixtureId
      ? getFixtureSeededCandidates(fixtureId)
      : undefined;

  const { report, reportPath } = await auditAndReport(snapshot, {
    writeReport: opts.report,
    needsOnly: opts.needsOnly && !seededCandidates?.length,
    seededCandidates,
    generatedAt: "2026-08-15T00:00:00.000Z",
  });

  AssetDiscoveryReportSchema.parse(report);

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (opts.markdown) {
    console.log(formatAssetDiscoveryMarkdown(report));
  } else {
    console.log(formatAssetDiscoveryText(report));
    console.log(
      `  openNeeds=${report.summary.openOpportunityCount} searchTasks=${report.summary.searchTaskCount} assets=${report.summary.discoveredAssetCount}`,
    );
  }
  if (reportPath) {
    console.log(`Wrote ${reportPath}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "fixtures": {
      console.log(listFixturePageIds().join("\n"));
      return;
    }
    case "registry": {
      for (const e of VENDOR_OFFICIAL_SOURCE_REGISTRY) {
        console.log(
          `${e.productSlug}\t${e.organizationName}\tdomains=${e.officialDomains.length}\tchannels=${e.officialVideoChannels.length}`,
        );
      }
      console.log(`OK — ${listRegisteredVendorSlugs().length} vendors`);
      return;
    }
    case "validate": {
      for (const id of listFixturePageIds()) {
        const snap = getFixturePageSnapshot(id);
        const { report } = await auditAndReport(snap, {
          writeReport: false,
          needsOnly: true,
          generatedAt: "2026-08-15T00:00:00.000Z",
        });
        AssetDiscoveryReportSchema.parse(report);
        if (report.opportunities.length === 0) {
          throw new Error(`Fixture ${id} produced zero opportunities`);
        }
        // Needs must be identified before assets (search tasks only for open needs)
        const open = report.opportunities.filter((o) => o.status === "open");
        if (open.length && report.searchTasks.length === 0) {
          throw new Error(`Fixture ${id} has open needs but no search tasks`);
        }
      }
      console.log(
        `OK — asset discovery ${ASSET_DISCOVERY_VERSION}; fixtures=${listFixturePageIds().length}; registry=${listRegisteredVendorSlugs().length}`,
      );
      return;
    }
    case "software": {
      const slug = args.positional[0] ?? args.software;
      if (!slug) {
        console.error("Usage: assets:audit:software -- <slug> [--report]");
        process.exit(1);
      }
      await auditOne(`software:${slug}`, () => loadSoftwarePageSnapshot(slug), {
        ...args,
        software: slug,
      });
      return;
    }
    case "guides": {
      const slug = args.positional[0] ?? args.guide;
      if (!slug) {
        console.error("Usage: assets:audit:guides -- <slug> [--report]");
        process.exit(1);
      }
      await auditOne(`guide:${slug}`, () => loadGuidePageSnapshot(slug), {
        ...args,
        guide: slug,
      });
      return;
    }
    case "crm": {
      args.crm = true;
      break;
    }
    case "audit":
    default:
      break;
  }

  if (args.crm) {
    const products = getSoftwareByCategory("crm", {
      includeUnpublished: true,
    }).slice(0, 12);
    const guides = getGuidesByCategory("crm", {
      includeUnpublished: true,
    }).slice(0, 8);
    console.log(
      `CRM asset audit — products=${products.length} guides=${guides.length} (capped sample)`,
    );
    for (const p of products) {
      await auditOne(`software:${p.slug}`, () => loadSoftwarePageSnapshot(p.slug), {
        ...args,
        needsOnly: true,
      });
    }
    for (const g of guides) {
      await auditOne(`guide:${g.slug}`, () => loadGuidePageSnapshot(g.slug), {
        ...args,
        needsOnly: true,
      });
    }
    return;
  }

  if (args.allFixtures) {
    for (const id of listFixturePageIds()) {
      await auditOne(`fixture:${id}`, () => getFixturePageSnapshot(id), {
        ...args,
        fixture: id,
        withSeeds: args.withSeeds,
      });
    }
    return;
  }

  if (args.fixture) {
    await auditOne(
      `fixture:${args.fixture}`,
      () => getFixturePageSnapshot(args.fixture!),
      { ...args, withSeeds: true },
    );
    return;
  }

  if (args.software || args.positional[0]) {
    const slug = args.software ?? args.positional[0]!;
    // Heuristic: if --guide was not set and slug looks like a guide when load fails
    const soft = loadSoftwarePageSnapshot(slug);
    if (soft) {
      await auditOne(`software:${slug}`, () => soft, args);
      return;
    }
  }

  if (args.guide) {
    await auditOne(`guide:${args.guide}`, () => loadGuidePageSnapshot(args.guide!), args);
    return;
  }

  if (args.file) {
    const raw = JSON.parse(fs.readFileSync(args.file, "utf8"));
    await auditOne(`file:${args.file}`, () => parsePageAssetSnapshot(raw), args);
    return;
  }

  console.error(
    `Usage:
  npm run assets:audit -- --fixture hubspot-product --report
  npm run assets:audit -- --all-fixtures --with-seeds --report
  npm run assets:audit -- --software hubspot --report
  npm run assets:audit -- --guide financial-services-crm --report
  npm run assets:audit:crm -- --report
  npm run assets:audit -- fixtures|registry|validate

Fixtures: ${listFixturePageIds().join(", ")}`,
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
