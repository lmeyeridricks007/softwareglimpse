import fs from "node:fs";
import path from "node:path";
import type { UrlMappingRow } from "../mapping-agent/types";
import { normalizeMigrationPath } from "../normalize";
import {
  EXISTING_APP_ALIASES,
  flattenRedirectChains,
  isAutoApprovedRedirect,
  WORDPRESS_RETIRED_PATTERNS,
} from "./policy";
import { loadReviewBacklogFile } from "./review-backlog-resolver";
import {
  assertNoRedirectChains,
  buildDestinationIndex,
  validateRedirectDestination,
} from "./validate";
import type {
  LegacyRedirectsFile,
  RedirectManifestEntry,
} from "./types";
import { REDIRECT_PLAN_GENERATOR } from "./types";

export type GeneratedRedirectPlan = {
  file: LegacyRedirectsFile;
  manifest: RedirectManifestEntry[];
  validationErrors: string[];
};

function loadMappingRows(): UrlMappingRow[] {
  const file = path.join(
    process.cwd(),
    "docs/migration/data/url-mapping-plan.json",
  );
  if (!fs.existsSync(file)) {
    throw new Error(
      `Missing ${file}. Run npm run migration:map-urls first.`,
    );
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as UrlMappingRow[];
}

function slugId(source: string): string {
  return `redir-${source.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "root"}`;
}

/**
 * Build the approved redirect plan from the URL mapping plan.
 * Only HIGH-confidence, policy-allowlisted mappings are auto-implemented.
 */
export function generateRedirectPlan(opts?: {
  mappingRows?: UrlMappingRow[];
  generatedAt?: string;
  /** Inject for unit tests to avoid rebuilding the full inventory. */
  destinationIndex?: ReturnType<typeof buildDestinationIndex>;
  /** When false, skip config/review-backlog-redirects.json (unit tests). */
  includeReviewBacklog?: boolean;
}): GeneratedRedirectPlan {
  const generatedAt = opts?.generatedAt ?? new Date().toISOString();
  const rows = opts?.mappingRows ?? loadMappingRows();
  const validationErrors: string[] = [];
  const manifest: RedirectManifestEntry[] = [];

  const autoPairs: Array<{
    source: string;
    destination: string;
    reason: string;
    confidence: "HIGH";
    matchBasis?: string;
    legacyIntent?: string;
  }> = [];

  const excludedManual: LegacyRedirectsFile["excludedManual"] = [];

  for (const row of rows) {
    const decision = isAutoApprovedRedirect(row);
    const redirectCandidate =
      row.recommendedAction === "301_REDIRECT" ||
      row.recommendedAction === "MERGE_AND_301" ||
      (row.recommendedAction === "REVIEW" && row.newPath);
    if (redirectCandidate) {
      if (decision.approved && row.newPath) {
        autoPairs.push({
          source: normalizeMigrationPath(row.legacyPath),
          destination: normalizeMigrationPath(row.newPath),
          reason: `${decision.reason}: ${row.reason}`,
          confidence: "HIGH",
          matchBasis: row.matchBasis,
          legacyIntent: row.legacyIntent,
        });
      } else if (!decision.approved) {
        excludedManual.push({
          source: row.legacyPath,
          destination: row.newPath,
          reason: decision.reason,
          confidence: row.confidence,
        });
        manifest.push({
          id: slugId(row.legacyPath),
          source: normalizeMigrationPath(row.legacyPath),
          destination: row.newPath
            ? normalizeMigrationPath(row.newPath)
            : "",
          type: "301",
          reason: decision.reason,
          confidence: row.confidence,
          matchBasis: row.matchBasis,
          legacyIntent: row.legacyIntent,
          approvalStatus: "manual_review_excluded",
          implemented: false,
          testStatus: "skipped",
          notes: [row.reason],
        });
      }
    } else if (
      row.recommendedAction === "410" ||
      row.recommendedAction === "404"
    ) {
      manifest.push({
        id: slugId(row.legacyPath),
        source: normalizeMigrationPath(row.legacyPath),
        destination: "",
        type: "301",
        reason: row.reason,
        confidence: row.confidence,
        matchBasis: row.matchBasis,
        legacyIntent: row.legacyIntent,
        approvalStatus: "retired_no_redirect",
        implemented: false,
        testStatus: "skipped",
        notes: [
          `${row.recommendedAction} retirement — do not redirect to homepage or generic hubs`,
        ],
      });
    }
  }

  // Review backlog resolutions (editorial batch)
  const reviewBacklog =
    opts?.includeReviewBacklog === false ? null : loadReviewBacklogFile();
  if (reviewBacklog) {
    for (const row of reviewBacklog.redirects) {
      autoPairs.push({
        source: normalizeMigrationPath(row.source),
        destination: normalizeMigrationPath(row.destination),
        reason: row.reason,
        confidence: "HIGH",
        matchBasis: "review_backlog_resolution",
        legacyIntent: "other",
      });
    }
  }

  // Existing in-app aliases — highest priority (override backlog/mapping collisions)
  for (const alias of EXISTING_APP_ALIASES) {
    autoPairs.push({
      source: normalizeMigrationPath(alias.source),
      destination: normalizeMigrationPath(alias.destination),
      reason: alias.reason,
      confidence: "HIGH",
      matchBasis: "existing_app_alias",
      legacyIntent: "feature",
    });
  }

  const { flattened, chainsFlattened } = flattenRedirectChains(autoPairs);

  // Validate destinations + build implemented redirects
  const redirects: LegacyRedirectsFile["redirects"] = [];
  const pairMeta = new Map(
    autoPairs.map((p) => [p.source, p] as const),
  );
  const destIndex = opts?.destinationIndex ?? buildDestinationIndex();

  for (const pair of flattened) {
    const meta = pairMeta.get(pair.source);
    const validation = validateRedirectDestination(pair.destination, destIndex);
    if (!validation.ok) {
      validationErrors.push(
        `${pair.source} → ${pair.destination}: ${validation.notes.join("; ")}`,
      );
      excludedManual.push({
        source: pair.source,
        destination: pair.destination,
        reason: `Failed destination validation: ${validation.notes.join("; ")}`,
        confidence: meta?.confidence ?? "HIGH",
      });
      continue;
    }

    const id = slugId(pair.source);
    const reason = meta?.reason ?? "Approved permanent redirect";
    redirects.push({
      source: pair.source,
      destination: pair.destination,
      permanent: true,
      id,
      reason,
    });

    manifest.push({
      id,
      source: pair.source,
      destination: pair.destination,
      type: "301",
      reason,
      confidence: "HIGH",
      matchBasis: meta?.matchBasis,
      legacyIntent: meta?.legacyIntent,
      approvalStatus:
        meta?.matchBasis === "existing_app_alias"
          ? "existing_app_alias"
          : "auto_approved",
      implemented: true,
      testStatus: "pending",
      notes: validation.notes.length ? validation.notes : undefined,
    });
  }

  const chainProblems = assertNoRedirectChains(
    redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
    })),
  );
  validationErrors.push(...chainProblems);

  // Sort redirects for stable diffs
  redirects.sort((a, b) => a.source.localeCompare(b.source));
  manifest.sort((a, b) => {
    if (a.implemented !== b.implemented) return a.implemented ? -1 : 1;
    return a.source.localeCompare(b.source);
  });

  const file: LegacyRedirectsFile = {
    version: 1,
    generatedAt,
    generator: `${REDIRECT_PLAN_GENERATOR.name} v${REDIRECT_PLAN_GENERATOR.version}`,
    policy: {
      onlyHighConfidence: false,
      permanentOnly: true,
      flattenChains: true,
      noHomepageDump: true,
      noMiddleware: true,
    },
    redirects,
    retired: WORDPRESS_RETIRED_PATTERNS,
    excludedManual: excludedManual.sort((a, b) =>
      a.source.localeCompare(b.source),
    ),
    stats: {
      redirects: redirects.length,
      autoApproved: redirects.filter((r) =>
        !EXISTING_APP_ALIASES.some(
          (a) => normalizeMigrationPath(a.source) === r.source,
        ),
      ).length,
      manualExcluded: excludedManual.length,
      retiredPatterns: WORDPRESS_RETIRED_PATTERNS.length,
      chainsFlattened,
    },
  };

  return { file, manifest, validationErrors };
}
