import { assessSiteLaunchReadiness } from "@/services/site-foundation/launch-readiness";
import { getSiteFoundationConfig } from "@/services/site-foundation/config";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const siteFoundationChecks: AuditCheck[] = [
  {
    id: "site-launch-readiness",
    level: "readiness",
    description: "Public site foundation / legal / consent launch readiness",
    run(ctx) {
      return assessSiteLaunchReadiness(ctx.now).issues;
    },
  },
  {
    id: "cookie-inventory-classified",
    level: "validity",
    description: "All inventoried storage entries have a cookie category",
    run(ctx) {
      const config = getSiteFoundationConfig();
      return config.cookies
        .filter((c) => !c.category)
        .map((c) =>
          issue(
            {
              type: "UNCLASSIFIED_COOKIE",
              level: "validity",
              message: `Unclassified storage entry: ${c.name}`,
              evidence: c.name,
            },
            ctx.now,
          ),
        );
    },
  },
  {
    id: "cookie-settings-available",
    level: "readiness",
    description: "Cookie settings withdrawal path must remain available",
    run(ctx) {
      const config = getSiteFoundationConfig();
      const hasOptional = config.consent.categoriesInUse.some(
        (c) => c !== "strictly-necessary",
      );
      if (!hasOptional) return [];
      if (!config.consent.version) {
        return [
          issue(
            {
              type: "COOKIE_SETTINGS_UNAVAILABLE",
              level: "readiness",
              message: "Consent policy version missing — preferences cannot version",
            },
            ctx.now,
          ),
        ];
      }
      return [];
    },
  },
];
