import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  getLocalePrefix,
  isRetiredTaxonomyPath,
  resolveEnglishOnlyCutover,
} from "@/seo/english-only-cutover";
import { normalizePagePath } from "../url-resolver";
import type { ExclusionReason } from "./types";

export type UrlMappingRow = {
  legacyPath: string;
  newPath: string | null;
  recommendedAction: string;
  relationship?: string;
  legacyPageType?: string | null;
};

export type CanonicalResolution = {
  inputPath: string;
  /** Path to score as the opportunity target (live IA when known). */
  targetPath: string;
  excluded: boolean;
  exclusionReason?: ExclusionReason;
  viaRedirect: boolean;
  viaMapping: boolean;
  removalClassified: boolean;
  mappingAction?: string;
};

const UTILITY_PREFIXES = [
  "/go/",
  "/api/",
  "/search/",
  "/dev/",
  "/compare/build/",
  "/preview/",
  "/newsletter/",
] as const;

function ensureSlash(p: string): string {
  if (!p || p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

function stripQueryAndHash(pathname: string): string {
  return ensureSlash(
    pathname.split("?")[0]?.split("#")[0] ?? pathname,
  );
}

export function loadUrlMappingPlan(
  cwd: string = process.cwd(),
): Map<string, UrlMappingRow> {
  const file = path.join(cwd, "docs/migration/data/url-mapping-plan.json");
  const map = new Map<string, UrlMappingRow>();
  if (!existsSync(file)) return map;
  const rows = JSON.parse(readFileSync(file, "utf8")) as UrlMappingRow[];
  for (const row of rows) {
    if (!row.legacyPath) continue;
    map.set(ensureSlash(row.legacyPath), row);
  }
  return map;
}

export function loadLegacyRedirectMap(
  cwd: string = process.cwd(),
): Map<string, string> {
  const file = path.join(cwd, "config/legacy-redirects.json");
  const map = new Map<string, string>();
  if (!existsSync(file)) return map;
  const raw = JSON.parse(readFileSync(file, "utf8")) as {
    redirects?: Array<{ source: string; destination: string }>;
  };
  for (const row of raw.redirects ?? []) {
    map.set(ensureSlash(row.source), ensureSlash(row.destination));
  }
  return map;
}

export function loadLocaleCutoverMap(
  cwd: string = process.cwd(),
): Record<string, string> {
  const file = path.join(cwd, "config/legacy-locale-cutover.json");
  if (!existsSync(file)) return {};
  const raw = JSON.parse(readFileSync(file, "utf8")) as {
    redirects?: Record<string, string>;
  };
  return raw.redirects ?? {};
}

export type CanonicalizerContext = {
  redirects: Map<string, string>;
  mappings: Map<string, UrlMappingRow>;
  localeCutover: Record<string, string>;
};

export function buildCanonicalizerContext(
  cwd: string = process.cwd(),
): CanonicalizerContext {
  return {
    redirects: loadLegacyRedirectMap(cwd),
    mappings: loadUrlMappingPlan(cwd),
    localeCutover: loadLocaleCutoverMap(cwd),
  };
}

/**
 * Normalize + exclude + map legacy GSC URLs onto live opportunity targets.
 * Locale / taxonomy / removal-classified URLs are excluded (not scored).
 * Redirect sources are excluded as pages but their metrics roll up to destinations
 * when the caller aggregates by targetPath before exclusion of the source row…
 *
 * Contract used by analyze():
 * - excluded=true → do not score this path as its own opportunity page
 * - when viaRedirect/viaMapping and not removal → targetPath is the live page
 *   that should receive attributed impressions (caller must re-aggregate)
 */
export function resolveCanonicalOpportunity(
  inputUrlOrPath: string,
  ctx: CanonicalizerContext,
): CanonicalResolution {
  const inputPath = stripQueryAndHash(normalizePagePath(inputUrlOrPath));

  if (
    inputPath.includes("/author/") ||
    inputPath.startsWith("/author/")
  ) {
    return {
      inputPath,
      targetPath: inputPath,
      excluded: true,
      exclusionReason: "author_archive",
      viaRedirect: false,
      viaMapping: false,
      removalClassified: true,
    };
  }

  if (inputPath.includes("/feed/") || inputPath.endsWith("/feed/")) {
    return {
      inputPath,
      targetPath: inputPath,
      excluded: true,
      exclusionReason: "feed",
      viaRedirect: false,
      viaMapping: false,
      removalClassified: true,
    };
  }

  for (const prefix of UTILITY_PREFIXES) {
    if (inputPath === prefix || inputPath.startsWith(prefix)) {
      return {
        inputPath,
        targetPath: inputPath,
        excluded: true,
        exclusionReason: "utility_route",
        viaRedirect: false,
        viaMapping: false,
        removalClassified: false,
      };
    }
  }

  const tax = isRetiredTaxonomyPath(inputPath);
  if (tax.retired) {
    return {
      inputPath,
      targetPath: inputPath,
      excluded: true,
      exclusionReason: "taxonomy_junk",
      viaRedirect: false,
      viaMapping: false,
      removalClassified: true,
    };
  }

  if (getLocalePrefix(inputPath)) {
    const cut = resolveEnglishOnlyCutover(inputPath, ctx.localeCutover);
    if (cut.action === "redirect" && cut.destination) {
      return {
        inputPath,
        targetPath: ensureSlash(cut.destination),
        excluded: true,
        exclusionReason: "locale_redirect",
        viaRedirect: true,
        viaMapping: false,
        removalClassified: false,
      };
    }
    return {
      inputPath,
      targetPath: inputPath,
      excluded: true,
      exclusionReason: "legacy_locale",
      viaRedirect: false,
      viaMapping: false,
      removalClassified: true,
    };
  }

  const mapping = ctx.mappings.get(inputPath);
  if (
    mapping &&
    (mapping.recommendedAction === "410" ||
      mapping.recommendedAction === "404")
  ) {
    return {
      inputPath,
      targetPath: inputPath,
      excluded: true,
      exclusionReason:
        mapping.recommendedAction === "410" ? "removed_410" : "removed_404",
      viaRedirect: false,
      viaMapping: true,
      removalClassified: true,
      mappingAction: mapping.recommendedAction,
    };
  }

  const redirectDest = ctx.redirects.get(inputPath);
  if (redirectDest && redirectDest !== inputPath) {
    return {
      inputPath,
      targetPath: redirectDest,
      excluded: true,
      exclusionReason: "redirect_source",
      viaRedirect: true,
      viaMapping: false,
      removalClassified: false,
      mappingAction: mapping?.recommendedAction,
    };
  }

  if (
    mapping?.newPath &&
    mapping.newPath !== inputPath &&
    (mapping.recommendedAction === "301_REDIRECT" ||
      mapping.recommendedAction === "MERGE_AND_301")
  ) {
    return {
      inputPath,
      targetPath: ensureSlash(mapping.newPath),
      excluded: true,
      exclusionReason: "redirect_source",
      viaRedirect: false,
      viaMapping: true,
      removalClassified: false,
      mappingAction: mapping.recommendedAction,
    };
  }

  return {
    inputPath,
    targetPath: inputPath,
    excluded: false,
    viaRedirect: false,
    viaMapping: false,
    removalClassified: false,
    mappingAction: mapping?.recommendedAction,
  };
}
