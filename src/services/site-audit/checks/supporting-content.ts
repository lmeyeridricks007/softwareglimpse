import {
  getAllGuidesUnfiltered,
} from "@/data/repositories/guides";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";
import {
  buildContentCluster,
  buildSupportingTopicCandidates,
} from "@/services/content-clusters";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const supportingContentChecks: AuditCheck[] = [
  {
    id: "supporting-knowledge-coverage",
    level: "readiness",
    description: "Category CORE supporting knowledge coverage",
    run(ctx) {
      const issues = [];
      for (const map of listCategoryKnowledgeMaps()) {
        if (ctx.categorySlug && map.categorySlug !== ctx.categorySlug) continue;
        const cluster = buildContentCluster(map.categorySlug);
        if (!cluster) continue;
        for (const area of cluster.coverage) {
          if (area.missingCoreTopicIds.length === 0) continue;
          if (area.existingCoreCount >= area.targetCoreCount) continue;
          issues.push(
            issue(
              {
                type: "SUPPORTING_KNOWLEDGE_GAP",
                level: "readiness",
                message: `${map.categorySlug}: ${area.label} CORE ${area.existingCoreCount}/${area.targetCoreCount} — missing ${area.missingCoreTopicIds.join(", ")}`,
                categorySlug: map.categorySlug,
                evidence: area.missingCoreTopicIds.join(","),
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "anchor-support-coverage",
    level: "readiness",
    description: "Commercial anchors missing CORE supporting guides",
    run(ctx) {
      const issues = [];
      for (const map of listCategoryKnowledgeMaps()) {
        if (ctx.categorySlug && map.categorySlug !== ctx.categorySlug) continue;
        const candidates = buildSupportingTopicCandidates(map.categorySlug);
        for (const [bestSlug, topicIds] of Object.entries(
          map.bestSupportTopicIds,
        )) {
          const missing = topicIds.filter((id) => {
            const topic = map.topics.find((t) => t.id === id);
            if (!topic || topic.priorityClass !== "CORE") return false;
            const c = candidates.find((x) => x.id === `candidate:${id}`);
            return c && c.readiness !== "exists";
          });
          if (missing.length) {
            issues.push(
              issue(
                {
                  type: "ANCHOR_SUPPORT_GAP",
                  level: "readiness",
                  message: `best:${bestSlug} missing CORE support: ${missing.join(", ")}`,
                  categorySlug: map.categorySlug,
                  contentId: `content:best:${bestSlug}`,
                  path: `/best/${bestSlug}/`,
                },
                ctx.now,
              ),
            );
          }
        }
        for (const [toolSlug, topicIds] of Object.entries(
          map.toolSupportTopicIds,
        )) {
          const missing = topicIds.filter((id) => {
            const topic = map.topics.find((t) => t.id === id);
            if (!topic) return false;
            if (
              topic.priorityClass !== "CORE" &&
              topic.priorityClass !== "SECONDARY"
            ) {
              return false;
            }
            const c = candidates.find((x) => x.id === `candidate:${id}`);
            return c && c.readiness !== "exists" && c.placement === "NEW_PAGE";
          });
          if (missing.length) {
            issues.push(
              issue(
                {
                  type: "ANCHOR_SUPPORT_GAP",
                  level: "readiness",
                  message: `tool:${toolSlug} missing support topics: ${missing.join(", ")}`,
                  categorySlug: map.categorySlug,
                  contentId: `content:tool:${toolSlug}`,
                  path: `/tools/${toolSlug}/`,
                },
                ctx.now,
              ),
            );
          }
        }
      }
      return issues;
    },
  },
  {
    id: "support-content-duplicates",
    level: "quality",
    description: "Supporting candidates marked duplicate intent",
    run(ctx) {
      const issues = [];
      for (const map of listCategoryKnowledgeMaps()) {
        if (ctx.categorySlug && map.categorySlug !== ctx.categorySlug) continue;
        const dups = buildSupportingTopicCandidates(map.categorySlug).filter(
          (c) => c.readiness === "duplicate",
        );
        for (const d of dups) {
          issues.push(
            issue(
              {
                type: "SUPPORT_CONTENT_DUPLICATE",
                level: "quality",
                message: `${d.titleConcept}: ${d.placementReason}`,
                categorySlug: map.categorySlug,
                path: `/guides/${d.suggestedSlug}/`,
                evidence: d.expandTargetSlug,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "support-content-orphans",
    level: "quality",
    description: "Published guides without anchor support edges",
    run(ctx) {
      const issues = [];
      for (const guide of getAllGuidesUnfiltered()) {
        if (guide.metadata.status !== "published") continue;
        if (ctx.categorySlug && !guide.categorySlugs.includes(ctx.categorySlug)) {
          continue;
        }
        if (guide.supports.length === 0) {
          issues.push(
            issue(
              {
                type: "SUPPORT_CONTENT_ORPHAN",
                level: "quality",
                message: `Guide ${guide.slug} has no supports-anchor relationships`,
                path: `/guides/${guide.slug}/`,
                contentId: `content:guide:${guide.slug}`,
                categorySlug: guide.categorySlugs[0],
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
];
