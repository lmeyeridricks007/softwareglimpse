import { normalizePath, resolveCanonicalPath } from "@/seo/canonical";
import { isPathIndexable, resolveEligibleHref } from "./eligibility";
import { collectCrmOutboundEdges } from "./outbound-graph";
import { detectSeoOrphans } from "./orphan-detector";
import type { LinkModuleId } from "./types";

export type LinkHealthIssue = {
  code:
    | "BROKEN_TARGET"
    | "REDIRECT_ALIAS"
    | "DRAFT_OR_NOINDEX_TARGET"
    | "DUPLICATE_MODULE_HREF"
    | "ORPHAN_INDEXABLE"
    | "CHROME_ONLY_INBOUND";
  severity: "error" | "warning";
  from?: string;
  to?: string;
  module?: LinkModuleId;
  message: string;
};

const KNOWN_ALIASES = [
  "/features/call-functionality/",
  "/features/reporting/",
];

/**
 * Automated internal-link health checks for the full catalogue graph.
 */
export function validateInternalLinkHealth(): LinkHealthIssue[] {
  const issues: LinkHealthIssue[] = [];
  const edges = collectCrmOutboundEdges();
  const orphanReport = detectSeoOrphans({ edges });

  const moduleHrefSeen = new Map<string, Set<string>>();

  for (const edge of edges) {
    const to = normalizePath(edge.to);
    const from = normalizePath(edge.from);

    // Alias / redirect destinations where a canonical exists
    if (KNOWN_ALIASES.some((a) => to === normalizePath(a))) {
      const canonical = resolveCanonicalPath(to);
      if (canonical !== to) {
        issues.push({
          code: "REDIRECT_ALIAS",
          severity: "error",
          from,
          to,
          module: edge.module,
          message: `Links to alias ${to}; canonical is ${canonical}`,
        });
      }
    }

    const eligible = resolveEligibleHref(to, { requireIndexable: true });
    if (!eligible) {
      // Hub discovery may intentionally list pages that fail feature gates —
      // only flag primary related modules strongly.
      const primaryModules: LinkModuleId[] = [
        "relatedGuides",
        "relatedProducts",
        "relatedComparisons",
        "relatedCapabilities",
        "relatedRequirements",
        "relatedFeatures",
        "relatedUseCases",
        "relatedIndustries",
        "relatedResources",
        "recommendedNextStep",
        "tryDecisionTool",
      ];
      if (primaryModules.includes(edge.module)) {
        const soft = resolveEligibleHref(to, { requireIndexable: false });
        if (!soft) {
          issues.push({
            code: "BROKEN_TARGET",
            severity: "error",
            from,
            to,
            module: edge.module,
            message: `Unresolvable internal link target ${to}`,
          });
        } else if (!isPathIndexable(to)) {
          issues.push({
            code: "DRAFT_OR_NOINDEX_TARGET",
            severity: "warning",
            from,
            to,
            module: edge.module,
            message: `Primary module links to non-indexable ${to}`,
          });
        }
      }
    }

    const key = `${from}::${edge.module}`;
    const set = moduleHrefSeen.get(key) ?? new Set();
    if (set.has(to)) {
      issues.push({
        code: "DUPLICATE_MODULE_HREF",
        severity: "warning",
        from,
        to,
        module: edge.module,
        message: `Duplicate href in module ${edge.module}`,
      });
    }
    set.add(to);
    moduleHrefSeen.set(key, set);
  }

  for (const o of orphanReport.orphans) {
    issues.push({
      code: "ORPHAN_INDEXABLE",
      severity: "error",
      to: o.path,
      message: o.notes,
    });
  }
  for (const o of orphanReport.chromeOnly) {
    issues.push({
      code: "CHROME_ONLY_INBOUND",
      severity: "warning",
      to: o.path,
      message: o.notes,
    });
  }

  return issues;
}
