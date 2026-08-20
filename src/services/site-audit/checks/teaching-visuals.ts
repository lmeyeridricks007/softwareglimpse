import { join } from "node:path";
import {
  scanTeachingVisualLibrary,
  TEACHING_VISUAL_PREMIUM_BYTES,
} from "@/services/teaching-visuals/library-scan";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const teachingVisualChecks: AuditCheck[] = [
  {
    id: "teaching-visual-size-bar",
    level: "quality",
    description:
      "Teaching-art PNGs meet the ~900 KB hub bar (vendor-ui captures excluded)",
    run(ctx) {
      if (ctx.productSlug || ctx.categorySlug || ctx.contentId) return [];

      const publicRoot = join(process.cwd(), "public");
      const { teaching, vendorUi } = scanTeachingVisualLibrary(publicRoot);
      const issues = [];

      for (const row of teaching) {
        if (row.failingFiles.length === 0) continue;
        const sample = row.failingFiles.slice(0, 5).join(", ");
        issues.push(
          issue(
            {
              type: "THIN_CONTENT",
              level: "quality",
              severity: "low",
              message: `${row.directory}: ${row.failingFiles.length} teaching PNG(s) under ${Math.round(TEACHING_VISUAL_PREMIUM_BYTES / 1024)} KB`,
              evidence: sample,
              path: row.directory,
              section: "teaching-visuals",
            },
            ctx.now,
          ),
        );
      }

      // Informational only — vendor-ui is intentionally outside the teaching bar.
      if (vendorUi.pngCount > 0 && vendorUi.under900Kb > 0) {
        // No issue emitted; scan stats live in audit notes via auditSite wrapper if needed.
      }

      return issues;
    },
  },
];
