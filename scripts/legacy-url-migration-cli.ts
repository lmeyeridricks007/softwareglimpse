#!/usr/bin/env tsx
/**
 * Legacy URL Migration Audit CLI
 *
 * Inventory + recommendations only. Does NOT write redirects.
 *
 *   npm run migration:legacy-urls
 *   npm run migration:legacy-urls -- --no-write
 *   npm run migration:legacy-urls -- --json
 *
 * Reads sitemap snapshot from docs/migration/data/legacy-primary-en.json when present.
 * Rebuilds new-app inventory from the live data layer.
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildAuditSummary,
  buildNewUrlInventory,
  matchAllLegacyUrls,
  renderLegacyUrlInventoryMarkdown,
  type LegacyUrlMigrationRecord,
} from "@/services/legacy-url-migration";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "docs/migration/data");
const DOC_PATH = path.join(ROOT, "docs/migration/01-legacy-url-inventory.md");

type LegacyPrimaryRow = {
  loc: string;
  lastmod?: string | null;
  sitemap?: string;
  legacyPageType?: string;
};

function parseArgs(argv: string[]) {
  return {
    write: !argv.includes("--no-write"),
    json: argv.includes("--json"),
  };
}

function loadLegacyPrimary(): LegacyPrimaryRow[] {
  const file = path.join(DATA_DIR, "legacy-primary-en.json");
  if (!fs.existsSync(file)) {
    throw new Error(
      `Missing ${file}. Run an initial sitemap harvest into docs/migration/data/ first.`,
    );
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as LegacyPrimaryRow[];
}

function loadLocaleMeta(): { count: number; sitemapUniqueLocs?: number } {
  const file = path.join(DATA_DIR, "legacy-locale-summary.json");
  if (!fs.existsSync(file)) return { count: 0 };
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    count?: number;
    sitemapUniqueLocs?: number;
  };
  return { count: raw.count ?? 0, sitemapUniqueLocs: raw.sitemapUniqueLocs };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const legacyPrimary = loadLegacyPrimary();
  const newInventory = buildNewUrlInventory();
  const records: LegacyUrlMigrationRecord[] = matchAllLegacyUrls(
    legacyPrimary.map((r) => ({
      path: r.loc,
      sitemap: r.sitemap,
      lastmod: r.lastmod ?? null,
    })),
    newInventory,
  );

  // Prefer richer prior probe fields when present
  const priorPath = path.join(DATA_DIR, "migration-records.json");
  if (fs.existsSync(priorPath)) {
    const prior = JSON.parse(
      fs.readFileSync(priorPath, "utf8"),
    ) as LegacyUrlMigrationRecord[];
    const byPath = new Map(prior.map((r) => [r.legacyPath, r]));
    for (const r of records) {
      const p = byPath.get(r.legacyPath);
      if (!p) continue;
      r.legacyStatus = p.legacyStatus ?? r.legacyStatus;
      r.legacyTitle = p.legacyTitle ?? r.legacyTitle;
      r.legacyCanonical = p.legacyCanonical ?? r.legacyCanonical;
      r.legacyH1 = p.legacyH1 ?? r.legacyH1;
      r.legacyRobots = p.legacyRobots ?? r.legacyRobots;
      r.legacyRedirectTarget =
        p.legacyRedirectTarget ?? r.legacyRedirectTarget;
    }
  }

  const localeMeta = loadLocaleMeta();
  const summary = buildAuditSummary({
    records,
    newInventory,
    legacySitemapUniqueLocs:
      localeMeta.sitemapUniqueLocs ?? legacyPrimary.length + localeMeta.count,
    legacyLocaleUrls: localeMeta.count,
  });

  const markdown = renderLegacyUrlInventoryMarkdown({
    summary,
    records,
    newInventory,
  });

  const publicNew = newInventory.filter(
    (r) =>
      !["newsletter_utility", "privacy_utility", "pricing"].includes(
        r.pageType,
      ),
  );
  const legacyPaths = new Set(records.map((r) => r.legacyPath));
  const newOnly = publicNew
    .filter((r) => !legacyPaths.has(r.path))
    .map((r) => ({
      path: r.path,
      pageType: r.pageType,
      title: r.title,
      indexable: r.indexable,
      publicationState: r.publicationState,
      hasIncomingLegacy: records.some((x) => x.newPath === r.path),
    }));

  if (args.write) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(priorPath, `${JSON.stringify(records, null, 2)}\n`);
    fs.writeFileSync(
      path.join(DATA_DIR, "new-inventory.json"),
      `${JSON.stringify(newInventory, null, 2)}\n`,
    );
    fs.writeFileSync(
      path.join(DATA_DIR, "new-only.json"),
      `${JSON.stringify(newOnly, null, 2)}\n`,
    );
    fs.writeFileSync(
      path.join(DATA_DIR, "audit-summary.json"),
      `${JSON.stringify(summary, null, 2)}\n`,
    );
    fs.writeFileSync(DOC_PATH, markdown);
  }

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log("Legacy URL Migration Audit");
    console.log(`  legacy primary EN: ${summary.counts.legacyPrimaryEn}`);
    console.log(`  new public routes: ${summary.counts.newPublicRoutes}`);
    console.log(`  exact matches: ${summary.counts.exactMatches}`);
    console.log(
      `  redirect candidates: ${summary.counts.redirectCandidates} (high: ${summary.counts.redirectCandidatesHighConfidence})`,
    );
    console.log(
      `  retirement candidates: ${summary.counts.retirementCandidates}`,
    );
    console.log(
      `  manual review: ${summary.counts.manualReviewCandidates}`,
    );
    if (args.write) {
      console.log(`  wrote ${DOC_PATH}`);
    }
  }
}

main();
