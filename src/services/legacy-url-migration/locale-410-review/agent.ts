import fs from "node:fs";
import path from "node:path";
import { buildContentGraph } from "../mapping-agent/content-graph";
import { parseLegacyIntent } from "../mapping-agent/intent";
import { mapLegacyIntent } from "../mapping-agent/map";
import { buildNewUrlInventory } from "../inventory-new";
import { normalizeMigrationPath } from "../normalize";
import { CURATED_TOPIC_ABSORBS, RESOLVED_GAP_DECISIONS } from "./absorbs";
import { classifyLocale410Topic } from "./classify";
import {
  backlinksForPath,
  gscForPath,
  gscForPaths,
  inventoryUnmappedLocaleTopics,
  loadBacklinkSignals,
  loadGscByPath,
  loadUrlMappingPlanByPath,
} from "./inventory";
import {
  renderExistingEstateGapReviewMarkdown,
  renderLocale410ReviewMarkdown,
} from "./report";
import {
  LOCALE_410_REVIEW_AGENT,
  type Locale410Classification,
  type Locale410Disposition,
  type Locale410ReviewResult,
  type Locale410TopicRow,
} from "./types";

export type Locale410ReviewOptions = {
  cwd?: string;
  write?: boolean;
  now?: Date;
};

export type Locale410ReviewRun = Locale410ReviewResult & {
  paths: {
    json: string;
    markdown: string;
    gapReviewMarkdown: string;
    gapReviewJson: string;
  };
};

function emptyCounts(): Record<Locale410Classification, number> {
  return {
    TRUE_OBSOLETE: 0,
    TAXONOMY_JUNK: 0,
    DUPLICATE_TOPIC: 0,
    ENGLISH_EQUIVALENT_MISSING: 0,
    VALUABLE_TOPIC_CANDIDATE: 0,
  };
}

function emptyDisposition(): Record<Locale410Disposition, number> {
  return {
    KEEP_410: 0,
    ADD_301: 0,
    EXISTING_ESTATE_GAP_REVIEW: 0,
  };
}

/**
 * Phase 1–3: inventory unmapped locale URLs, enrich, classify, propose repairs / gap queue.
 * Does not apply redirects unless the CLI `--apply` path is used separately.
 */
export function runLocale410TopicReview(
  opts: Locale410ReviewOptions = {},
): Locale410ReviewRun {
  const cwd = opts.cwd ?? process.cwd();
  const now = opts.now ?? new Date();
  const write = opts.write !== false;

  const topicsInventory = inventoryUnmappedLocaleTopics({ cwd });
  const planByPath = loadUrlMappingPlanByPath(cwd);
  const gsc = loadGscByPath(cwd);
  const backlinks = loadBacklinkSignals(cwd);
  const graph = buildContentGraph();
  const inventoryPaths = new Set(
    buildNewUrlInventory(now).map((r) => normalizeMigrationPath(r.path)),
  );
  const inventoryHas = (p: string) =>
    inventoryPaths.has(normalizeMigrationPath(p));

  const topics: Locale410TopicRow[] = [];

  for (const item of topicsInventory) {
    const plan = planByPath.get(item.enPath);
    const intent = parseLegacyIntent(item.enPath, graph);
    const mapped = mapLegacyIntent(intent, graph);

    let detectedDestination: string | null = null;
    if (
      ["301_REDIRECT", "MERGE_AND_301", "KEEP"].includes(
        mapped.recommendedAction,
      ) &&
      mapped.newPath
    ) {
      detectedDestination = mapped.newPath;
    } else if (plan?.newPath) {
      detectedDestination = plan.newPath;
    }

    // Prefer mapping-agent title when primary inventory lacks one
    const title =
      item.title ??
      plan?.legacyTitle ??
      mapped.legacyTitle ??
      null;

    const row = classifyLocale410Topic({
      enPath: item.enPath,
      localePaths: item.localePaths,
      title,
      category: plan?.legacyPageType ?? item.legacyPageType,
      legacyPageType: item.legacyPageType,
      lastmod: item.lastmod,
      intentKind: intent.kind,
      mappingAction: mapped.recommendedAction ?? plan?.recommendedAction ?? null,
      mappingBasis: mapped.matchBasis ?? plan?.matchBasis ?? null,
      mappingReason: mapped.reason ?? plan?.reason ?? null,
      detectedDestination,
      inventoryHas,
      enGsc: gscForPath(gsc.byPath, gsc.available, item.enPath),
      localeGsc: gscForPaths(gsc.byPath, gsc.available, item.localePaths),
      enBacklinks: backlinksForPath(
        backlinks.byPath,
        backlinks.validity,
        backlinks.available,
        item.enPath,
      ),
      curatedAbsorbs: CURATED_TOPIC_ABSORBS,
    });
    topics.push(row);
  }

  const byClassification = emptyCounts();
  const byDisposition = emptyDisposition();
  for (const row of topics) {
    byClassification[row.classification] += 1;
    byDisposition[row.disposition] += 1;
  }

  const repairs = topics.filter((t) => t.disposition === "ADD_301");
  const gapReview = topics.filter(
    (t) => t.disposition === "EXISTING_ESTATE_GAP_REVIEW",
  );

  const result: Locale410ReviewResult = {
    summary: {
      agent: LOCALE_410_REVIEW_AGENT.name,
      version: LOCALE_410_REVIEW_AGENT.version,
      generatedAt: now.toISOString(),
      unmappedLocaleUrls: topics.reduce((n, t) => n + t.localeCount, 0),
      uniqueEnTopics: topics.length,
      byClassification,
      byDisposition,
      repairsProposed: repairs.length,
      gapReviewCount: gapReview.length,
      gscAvailable: gsc.available,
      backlinksAvailable: backlinks.available,
      policy: {
        englishOnly: true,
        noMultilingualRestore: true,
        noHomepageDump: true,
        noAutoCreatePages: true,
      },
    },
    topics,
    repairs,
    gapReview,
  };

  const paths = {
    json: path.join(cwd, "docs/migration/data/locale-410-topic-review.json"),
    markdown: path.join(cwd, "docs/seo/LOCALE-410-TOPIC-REVIEW.md"),
    gapReviewMarkdown: path.join(
      cwd,
      "docs/seo/EXISTING_ESTATE_GAP_REVIEW.md",
    ),
    gapReviewJson: path.join(
      cwd,
      "docs/migration/data/existing-estate-gap-review.json",
    ),
  };

  if (write) {
    fs.mkdirSync(path.dirname(paths.json), { recursive: true });
    fs.mkdirSync(path.dirname(paths.markdown), { recursive: true });
    fs.writeFileSync(paths.json, `${JSON.stringify(result, null, 2)}\n`);
    fs.writeFileSync(paths.markdown, renderLocale410ReviewMarkdown(result));
    fs.writeFileSync(
      paths.gapReviewMarkdown,
      renderExistingEstateGapReviewMarkdown(result),
    );
    fs.writeFileSync(
      paths.gapReviewJson,
      `${JSON.stringify(
        {
          generatedAt: result.summary.generatedAt,
          agent: result.summary.agent,
          version: result.summary.version,
          policy: result.summary.policy,
          candidates: gapReview,
          resolvedAt: "2026-09-06T21:20:00.000Z",
          resolutionNote:
            "Manual gap recovery complete — open queue cleared; see RESOLVED_GAP_DECISIONS",
          resolved: RESOLVED_GAP_DECISIONS,
        },
        null,
        2,
      )}\n`,
    );
  }

  return { ...result, paths };
}
