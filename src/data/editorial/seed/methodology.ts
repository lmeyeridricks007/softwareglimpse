import type { z } from "zod";
import { MethodologySchema } from "@/domain";

type MethodologyInput = z.input<typeof MethodologySchema>;

/**
 * Optional seed alias — prefer `crm-editorial` in `src/data/seed/crm-methodology.ts`.
 */
export const methodologiesSeed: MethodologyInput[] = [
  {
    id: "meth-crm-v1",
    slug: "crm-software-v1",
    name: "CRM Software Evaluation (alias)",
    version: "1.0.0",
    categorySlug: "crm",
    description:
      "Alias of crm-editorial. SoftwareGlimpse evaluates CRM products on sales workflow fit, usability, automation, reporting, administration burden, integrations, scalability, and value. Affiliate relationships never influence scores or rankings.",
    criteria: [
      criterion(
        "ease-of-use",
        "Ease of use",
        "How quickly sales teams become productive and stay productive day to day.",
        1,
        ["UI clarity", "onboarding friction", "common task speed"],
      ),
      criterion(
        "pipeline-management",
        "Pipeline management",
        "Deal stages, visibility, pipeline hygiene, and activity tracking.",
        2,
        ["pipeline views", "deal fields", "activity reminders"],
      ),
      criterion(
        "sales-automation",
        "Sales automation",
        "Automations that reduce repetitive sales work without brittle admin overhead.",
        3,
        ["workflow builders", "triggers", "sequence support"],
      ),
      criterion(
        "email-capabilities",
        "Email capabilities",
        "Native email sync, tracking, and sales email workflows.",
        4,
        ["inbox sync", "tracking", "templates"],
      ),
      criterion(
        "reporting",
        "Reporting",
        "Dashboards, forecasts, and reporting useful for managers and reps.",
        5,
        ["standard reports", "forecasting", "exportability"],
      ),
      criterion(
        "customization",
        "Customization",
        "Fields, pipelines, and configurability without excessive complexity.",
        6,
        ["custom fields", "custom pipelines", "permissions"],
      ),
      criterion(
        "integrations",
        "Integrations",
        "Quality of important third-party and ecosystem connections.",
        7,
        ["marketplace breadth", "core SaaS connectors"],
      ),
      criterion(
        "administration",
        "Administration",
        "Ongoing admin overhead and maintenance burden.",
        8,
        ["user management", "permissions model", "maintenance load"],
      ),
      criterion(
        "scalability",
        "Scalability",
        "Fit as team size, process complexity, and data volume grow.",
        9,
        ["multi-pipeline", "roles", "enterprise readiness signals"],
      ),
      criterion(
        "value-for-money",
        "Value for money",
        "Capability relative to total cost of ownership — without inventing live prices.",
        10,
        ["plan structure evidence", "feature packing", "free/trial signals when verified"],
      ),
    ],
    notes:
      "Prefer methodology slug crm-editorial. Criterion scores must cite supporting fact IDs when available.",
  },
];

function criterion(
  slug: string,
  name: string,
  description: string,
  displayOrder: number,
  evidenceRequirements: string[],
): MethodologyInput["criteria"][number] {
  return {
    id: `meth-crm-${slug}`,
    slug,
    name,
    description,
    weight: 1,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "crm",
    displayOrder,
  };
}
