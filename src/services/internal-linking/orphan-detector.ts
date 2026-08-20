import { getSoftwareBySlug } from "@/data";
import { getSitemapEntries } from "@/seo/sitemap";
import { normalizePath } from "@/seo/canonical";
import { collectCrmOutboundEdges, type OutboundEdge } from "./outbound-graph";

/**
 * Global chrome paths — homepage / sparse nav only.
 * Entity hubs (/guides/, /compare/, /features/, …) are NOT chrome when they
 * emit child discovery edges — those count as meaningful parent inbound.
 */
export const GLOBAL_CHROME_PATHS = new Set(
  ["/", "/search/", "/best/", "/categories/", "/pricing/"].map(normalizePath),
);

export type InboundLinkRecord = {
  from: string;
  relationship: OutboundEdge["relationship"];
  module: OutboundEdge["module"];
  chromeOnly: boolean;
};

export type OrphanFinding = {
  path: string;
  severity: "orphan" | "chrome-only" | "weak-parent";
  inboundCount: number;
  contentInboundCount: number;
  chromeInboundCount: number;
  inboundFrom: InboundLinkRecord[];
  notes: string;
};

export type SeoOrphanReport = {
  scannedIndexable: number;
  orphans: OrphanFinding[];
  chromeOnly: OrphanFinding[];
  weaklyLinked: OrphanFinding[];
  inboundCounts: Map<string, number>;
  contentInboundCounts: Map<string, number>;
  outgoingCounts: Map<string, number>;
};

function isChromeSource(path: string): boolean {
  const p = normalizePath(path);
  if (GLOBAL_CHROME_PATHS.has(p)) return true;
  // Top-level category listing pages still count as chrome-ish for deep orphans
  if (p === "/categories/crm/") return false; // CRM hub is a meaningful parent
  return false;
}

function isMeaningfulParentInbound(edge: OutboundEdge): boolean {
  if (edge.relationship === "parent" || edge.relationship === "child") {
    return true;
  }
  // Hub discovery edges use child from hub → detail
  if (
    edge.module === "parentHub" &&
    edge.from.endsWith("/") &&
    (edge.from.includes("/guides/") ||
      edge.from.includes("/features/") ||
      edge.from.includes("/use-cases/") ||
      edge.from.includes("/capabilities/") ||
      edge.from.includes("/requirements/") ||
      edge.from.includes("/resources/") ||
      edge.from.includes("/categories/") ||
      edge.from.includes("/compare/") ||
      edge.from.includes("/industries/") ||
      edge.from === "/software/" ||
      edge.from === "/compare/" ||
      edge.from === "/best/" ||
      edge.from === "/alternatives/")
  ) {
    return true;
  }
  return false;
}

/**
 * SEOOrphanPageDetector — scan indexable catalogue pages for missing / weak inbound.
 */
export function detectSeoOrphans(options?: {
  edges?: OutboundEdge[];
  indexablePaths?: string[];
}): SeoOrphanReport {
  const edges = options?.edges ?? collectCrmOutboundEdges();
  const indexable =
    options?.indexablePaths ??
    getSitemapEntries()
      .map((e) => {
        try {
          return normalizePath(new URL(e.url).pathname);
        } catch {
          return null;
        }
      })
      .filter((p): p is string => Boolean(p));

  const inbound = new Map<string, InboundLinkRecord[]>();
  const outgoingCounts = new Map<string, number>();

  for (const edge of edges) {
    const to = normalizePath(edge.to);
    const from = normalizePath(edge.from);
    outgoingCounts.set(from, (outgoingCounts.get(from) ?? 0) + 1);
    const list = inbound.get(to) ?? [];
    list.push({
      from,
      relationship: edge.relationship,
      module: edge.module,
      chromeOnly: isChromeSource(from),
    });
    inbound.set(to, list);
  }

  const inboundCounts = new Map<string, number>();
  const contentInboundCounts = new Map<string, number>();
  for (const [path, records] of inbound) {
    inboundCounts.set(path, records.length);
    contentInboundCounts.set(
      path,
      records.filter((r) => !r.chromeOnly).length,
    );
  }

  const orphans: OrphanFinding[] = [];
  const chromeOnly: OrphanFinding[] = [];
  const weaklyLinked: OrphanFinding[] = [];

  const utilityPrefix = (p: string) =>
    p.startsWith("/legal/") ||
    p.startsWith("/company/") ||
    p === "/pricing/" ||
    p.startsWith("/newsletter/");

  const contentRelevant = indexable.filter((p) => {
    if (utilityPrefix(p)) return false;
    if (p === "/categories/crm/" || p.startsWith("/categories/")) return true;
    if (p.startsWith("/software/")) {
      const slug = p.replace(/^\/software\//, "").replace(/\/$/, "");
      if (!slug || slug.includes("/")) return false;
      return Boolean(getSoftwareBySlug(slug));
    }
    return (
      p.startsWith("/guides/") ||
      p.startsWith("/use-cases/") ||
      p.startsWith("/capabilities/") ||
      p.startsWith("/features/") ||
      p.startsWith("/requirements/") ||
      p.startsWith("/resources/") ||
      p.startsWith("/tools/") ||
      p.startsWith("/compare/") ||
      p.startsWith("/for/") ||
      p.startsWith("/industries/") ||
      p.startsWith("/best/") ||
      p.startsWith("/alternatives/")
    );
  });

  for (const path of contentRelevant) {
    // Hubs themselves are discovery roots — skip orphan severity for index hubs
    if (
      path === "/guides/" ||
      path === "/use-cases/" ||
      path === "/features/" ||
      path === "/requirements/" ||
      path === "/capabilities/" ||
      path === "/resources/" ||
      path === "/software/" ||
      path === "/tools/" ||
      path === "/compare/" ||
      path === "/for/" ||
      path === "/categories/" ||
      path === "/categories/crm/" ||
      path === "/industries/" ||
      path === "/best/" ||
      path === "/alternatives/"
    ) {
      continue;
    }

    const records = inbound.get(path) ?? [];
    const contentRecords = records.filter((r) => !r.chromeOnly);
    const chromeRecords = records.filter((r) => r.chromeOnly);
    const hasParent = contentRecords.some((r) =>
      isMeaningfulParentInbound({
        from: r.from,
        to: path,
        relationship: r.relationship,
        module: r.module,
        sourceType: "hub",
      }),
    );

    const finding: OrphanFinding = {
      path,
      severity: "orphan",
      inboundCount: records.length,
      contentInboundCount: contentRecords.length,
      chromeInboundCount: chromeRecords.length,
      inboundFrom: records.slice(0, 12),
      notes: "",
    };

    if (records.length === 0) {
      finding.severity = "orphan";
      finding.notes = "Zero internal inbound edges in link graph";
      orphans.push(finding);
      continue;
    }

    if (contentRecords.length === 0 && chromeRecords.length > 0) {
      finding.severity = "chrome-only";
      finding.notes =
        "Only footer/global-nav style inbound — not adequate primary discovery";
      chromeOnly.push(finding);
      continue;
    }

    if (!hasParent && contentRecords.length < 2) {
      finding.severity = "weak-parent";
      finding.notes =
        "Missing clear parent/hub inbound; few contextual content links";
      weaklyLinked.push(finding);
    }
  }

  return {
    scannedIndexable: contentRelevant.length,
    orphans,
    chromeOnly,
    weaklyLinked,
    inboundCounts,
    contentInboundCounts,
    outgoingCounts,
  };
}

export const SEOOrphanPageDetector = {
  detect: detectSeoOrphans,
  GLOBAL_CHROME_PATHS,
};
