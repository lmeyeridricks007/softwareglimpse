import { CategoryTestProtocolSchema, type CategoryTestProtocol } from "@/domain";

/**
 * CRM hands-on test protocol v1.
 * Assists a human tester — never auto-completes or invents results.
 */
export const crmTestProtocol: CategoryTestProtocol =
  CategoryTestProtocolSchema.parse({
    id: "protocol-crm-hands-on-v1",
    slug: "crm-hands-on",
    categorySlug: "crm",
    name: "CRM hands-on test protocol",
    version: "1.0.0",
    description:
      "Structured first-hand evaluation for CRM products. Complete only what the plan and environment allow. Mark NOT_AVAILABLE / NOT_APPLICABLE honestly — do not invent pass results.",
    tasks: [
      {
        id: "crm-create-account",
        slug: "create-account",
        title: "Create account",
        description:
          "Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.",
        displayOrder: 1,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "crm-onboarding",
        slug: "complete-onboarding",
        title: "Complete onboarding",
        description:
          "Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.",
        displayOrder: 2,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "crm-import-contacts",
        slug: "import-sample-contacts",
        title: "Import sample contacts",
        description:
          "Import a small CSV or sample contact set. Record mapping UX and errors.",
        displayOrder: 3,
        required: true,
        evidenceHints: ["FEATURE_TEST", "TIMING", "SCREENSHOT"],
      },
      {
        id: "crm-create-company",
        slug: "create-company",
        title: "Create company",
        description: "Create an organization/company record and link a contact.",
        displayOrder: 4,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "crm-create-pipeline",
        slug: "create-pipeline",
        title: "Create pipeline",
        description: "Create or customize a sales pipeline with stages.",
        displayOrder: 5,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "crm-create-deal",
        slug: "create-deal",
        title: "Create deal",
        description: "Create a deal/opportunity on the pipeline.",
        displayOrder: 6,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "crm-move-deal",
        slug: "move-deal-through-pipeline",
        title: "Move deal through pipeline",
        description:
          "Advance the deal across stages (drag-and-drop or stage change).",
        displayOrder: 7,
        required: true,
        evidenceHints: ["FEATURE_TEST", "OBSERVATION"],
      },
      {
        id: "crm-automation",
        slug: "configure-automation",
        title: "Configure automation",
        description:
          "Create a simple workflow/automation (e.g. stage change → activity).",
        displayOrder: 8,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "crm-report",
        slug: "create-report-dashboard",
        title: "Create report / dashboard",
        description:
          "Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.",
        displayOrder: 9,
        required: false,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "crm-email-integration",
        slug: "test-email-integration",
        title: "Test email / integration",
        description:
          "Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.",
        displayOrder: 10,
        required: false,
        evidenceHints: ["INTEGRATION_TEST", "LIMITATION", "OBSERVATION"],
      },
      {
        id: "crm-search",
        slug: "test-search",
        title: "Test search",
        description:
          "Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.",
        displayOrder: 11,
        required: false,
        evidenceHints: ["FEATURE_TEST", "OBSERVATION"],
      },
      {
        id: "crm-permissions",
        slug: "test-permissions",
        title: "Test permissions",
        description:
          "If available on the plan, verify role/permission controls for a second user or visibility setting.",
        displayOrder: 12,
        required: false,
        evidenceHints: ["FEATURE_TEST", "NOT_AVAILABLE"],
      },
      {
        id: "crm-mobile",
        slug: "test-mobile-responsiveness",
        title: "Test mobile / responsiveness",
        description:
          "Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.",
        displayOrder: 13,
        required: false,
        evidenceHints: ["OBSERVATION", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "crm-admin",
        slug: "inspect-admin-configuration",
        title: "Inspect admin / configuration",
        description:
          "Review admin settings: custom fields, pipelines, users, billing entry points.",
        displayOrder: 14,
        required: true,
        evidenceHints: ["OBSERVATION", "SCREENSHOT"],
      },
      {
        id: "crm-help",
        slug: "inspect-help-support",
        title: "Inspect help / support",
        description:
          "Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.",
        displayOrder: 15,
        required: true,
        evidenceHints: ["SUPPORT_TEST", "OBSERVATION"],
      },
      {
        id: "crm-setup-friction",
        slug: "record-setup-friction",
        title: "Record setup friction",
        description:
          "Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.",
        displayOrder: 16,
        required: true,
        evidenceHints: ["TIMING", "OBSERVATION", "LIMITATION"],
      },
      {
        id: "crm-verify-pricing",
        slug: "verify-pricing",
        title: "Verify pricing",
        description:
          "Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.",
        displayOrder: 17,
        required: true,
        evidenceHints: ["PRICING", "SCREENSHOT"],
      },
    ],
  });

/** @deprecated Import from `@/data/editorial/testing/protocols` instead. */
export const CATEGORY_TEST_PROTOCOLS: CategoryTestProtocol[] = [crmTestProtocol];

/** @deprecated Import from `@/data/editorial/testing/protocols` instead. */
export function getTestProtocolBySlug(
  slug: string,
): CategoryTestProtocol | null {
  return CATEGORY_TEST_PROTOCOLS.find((p) => p.slug === slug) ?? null;
}

/** @deprecated Import from `@/data/editorial/testing/protocols` instead. */
export function getTestProtocolForCategory(
  categorySlug: string,
): CategoryTestProtocol | null {
  return (
    CATEGORY_TEST_PROTOCOLS.find((p) => p.categorySlug === categorySlug) ?? null
  );
}

/** @deprecated Import from `@/data/editorial/testing/protocols` instead. */
export function listTestProtocols(): CategoryTestProtocol[] {
  return [...CATEGORY_TEST_PROTOCOLS];
}
