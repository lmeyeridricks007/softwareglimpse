import { getMigrationRecords } from "@/data";
import {
  buildContentId,
  parseComparisonSlug,
  type ContentId,
  type UrlResolution,
  type UrlResolutionStatus,
} from "@/domain";
import {
  canonicalizeComparisonSlug,
  isCanonicalComparisonSlug,
} from "@/domain/comparison-slug";
import { getSiteUrl } from "@/lib/site";

function ensureTrailingSlash(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/**
 * Normalize any GSC page URL to a site-relative path with trailing slash.
 * Strips query/hash; maps www/non-www via getSiteUrl host policy.
 */
export function normalizePagePath(inputUrl: string): string {
  const site = getSiteUrl();
  let url: URL;
  try {
    url = new URL(inputUrl, site);
  } catch {
    const pathOnly = inputUrl.split("?")[0]?.split("#")[0] ?? "/";
    return ensureTrailingSlash(pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`);
  }

  // Drop query/hash; keep pathname only.
  return ensureTrailingSlash(url.pathname);
}

function contentIdForPath(
  pathname: string,
): { contentId?: ContentId; status: UrlResolutionStatus; notes?: string } {
  const parts = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (parts.length === 0) {
    return { status: "unknown", notes: "Site root" };
  }

  const [seg, ...rest] = parts;
  const slug = rest.join("/");

  switch (seg) {
    case "software":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("software", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "categories":
      if (rest.length >= 1) {
        // Category content ids use leaf slug (catalogue convention).
        return {
          contentId: buildContentId("category", rest[rest.length - 1]),
          status: "resolved",
        };
      }
      break;
    case "compare":
      if (rest.length === 1) {
        const comparisonSlug = rest[0];
        const parsed = parseComparisonSlug(comparisonSlug);
        if (!parsed) {
          return {
            status: "unknown",
            notes: `Unrecognized comparison slug: ${comparisonSlug}`,
          };
        }
        if (!isCanonicalComparisonSlug(comparisonSlug)) {
          const canonical = canonicalizeComparisonSlug([
            parsed.left,
            parsed.right,
          ]);
          return {
            contentId: buildContentId("comparison", canonical),
            status: "redirected",
            notes: `Reverse comparison form; canonical is ${canonical}`,
          };
        }
        return {
          contentId: buildContentId("comparison", comparisonSlug),
          status: "resolved",
        };
      }
      break;
    case "pricing":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("pricing", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "alternatives":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("alternatives", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "best":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("best", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "tools":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("tool", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "guides":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("guide", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "industries":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("industry", rest[0]),
          status: "resolved",
        };
      }
      break;
    case "use-cases":
      if (rest.length === 1) {
        return {
          contentId: buildContentId("use-case", rest[0]),
          status: "resolved",
        };
      }
      break;
    default:
      break;
  }

  // Migration ledger (empty seed by default).
  const migrations = getMigrationRecords();
  const hit = migrations.find((m) => {
    try {
      return normalizePagePath(m.source) === pathname;
    } catch {
      return m.source === pathname || m.source === slug;
    }
  });
  if (hit) {
    if (hit.action === "REDIRECT" && hit.target) {
      const targetPath = normalizePagePath(hit.target);
      const nested = contentIdForPath(targetPath);
      return {
        ...nested,
        status: "redirected",
        notes: hit.reason ?? `Migration redirect ${hit.id}`,
      };
    }
    if (hit.action === "REWRITE" || hit.action === "KEEP") {
      return {
        status: "legacy",
        notes: hit.reason ?? `Migration ${hit.action} ${hit.id}`,
      };
    }
    return {
      status: "legacy",
      notes: hit.reason ?? `Migration ${hit.action} ${hit.id}`,
    };
  }

  return {
    status: "unknown",
    notes: `Unrecognized path: ${pathname}`,
  };
}

export function resolveSearchUrl(inputUrl: string): UrlResolution {
  const normalizedPath = normalizePagePath(inputUrl);
  const resolved = contentIdForPath(normalizedPath);

  // Non-www vs www: if absolute URL host differs from site host, note noncanonical host.
  try {
    const site = new URL(getSiteUrl());
    const absolute = new URL(inputUrl, site);
    if (
      absolute.host !== site.host &&
      absolute.host.replace(/^www\./, "") === site.host.replace(/^www\./, "")
    ) {
      return {
        inputUrl,
        normalizedPath,
        contentId: resolved.contentId,
        status:
          resolved.status === "resolved" ? "noncanonical" : resolved.status,
        notes:
          resolved.notes ??
          `Host ${absolute.host} should canonicalize to ${site.host}`,
      };
    }
  } catch {
    // relative inputs are fine
  }

  return {
    inputUrl,
    normalizedPath,
    contentId: resolved.contentId,
    status: resolved.status,
    notes: resolved.notes,
  };
}
