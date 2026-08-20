import { validateContentRepository } from "@/data/validation/validate-content";
import { validateResearchRepository } from "@/data/validation/validate-research";
import { validateCategorySeedAlignment } from "@/services/category-onboarding/validate";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

function mapSeverity(
  severity: "error" | "warning",
): "critical" | "high" | "medium" {
  return severity === "error" ? "high" : "medium";
}

export const validityChecks: AuditCheck[] = [
  {
    id: "content-repository",
    level: "validity",
    description: "Reuse content repository validator",
    run(ctx) {
      const report = validateContentRepository();
      return report.issues.map((i) =>
        issue(
          {
            type:
              i.code.includes("duplicate") || i.code.includes("unique")
                ? "DUPLICATE_SLUG"
                : i.code.includes("unknown") || i.code.includes("ref")
                  ? "BROKEN_REFERENCE"
                  : "INVALID_SCHEMA",
            severity: mapSeverity(i.severity),
            level: "validity",
            message: i.message,
            evidence: i.code,
            entityType: "repository",
            entityId: "content",
          },
          ctx.now,
        ),
      );
    },
  },
  {
    id: "research-repository",
    level: "validity",
    description: "Reuse research repository validator",
    run(ctx) {
      const report = validateResearchRepository();
      return report.issues.map((i) =>
        issue(
          {
            type:
              i.code.includes("orphan") || i.code.includes("missing")
                ? "RESEARCH_GAP"
                : i.code.includes("source")
                  ? "SOURCE_QUALITY"
                  : "INVALID_SCHEMA",
            severity: mapSeverity(i.severity),
            level: "validity",
            message: i.message,
            evidence: i.code,
            entityType: "repository",
            entityId: "research",
          },
          ctx.now,
        ),
      );
    },
  },
  {
    id: "category-seed-alignment",
    level: "validity",
    description: "Category definitions must exist in the live catalogue",
    run(ctx) {
      return validateCategorySeedAlignment().map((i) =>
        issue(
          {
            type:
              i.code.includes("unknown") || i.code.includes("ref")
                ? "BROKEN_REFERENCE"
                : "INVALID_SCHEMA",
            severity: mapSeverity(i.severity),
            level: "validity",
            message: i.message,
            evidence: i.code,
            entityType: "repository",
            entityId: "category-definitions",
          },
          ctx.now,
        ),
      );
    },
  },
];
