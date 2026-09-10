import { CategoryTestProtocolSchema, type CategoryTestProtocol } from "@/domain";

/**
 * Sales intelligence / outreach hands-on protocol.
 * Assists a human tester — never auto-completes or invents results.
 */
export const salesIntelligenceTestProtocol: CategoryTestProtocol =
  CategoryTestProtocolSchema.parse({
    id: "protocol-sales-intelligence-hands-on-v1",
    slug: "sales-intelligence-hands-on",
    categorySlug: "sales-intelligence",
    name: "Sales intelligence hands-on test protocol",
    version: "1.0.0",
    description:
      "Structured first-hand evaluation for sales intelligence / prospecting tools. Mark NOT_AVAILABLE / NOT_APPLICABLE honestly — do not invent pass results. Do not spam real prospects.",
    tasks: [
      {
        id: "si-create-account",
        slug: "create-account",
        title: "Create account",
        description:
          "Sign up for a trial. Record plan, credit/seat model hints, and signup friction.",
        displayOrder: 1,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "si-onboarding",
        slug: "complete-onboarding",
        title: "Complete onboarding",
        description:
          "Finish onboarding (ICP, chrome extension, CRM connect prompts). Note forced steps.",
        displayOrder: 2,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "si-search-people",
        slug: "search-people",
        title: "Search people / leads",
        description:
          "Run a people search with filters (title, company, location). Note result quality.",
        displayOrder: 3,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "si-search-companies",
        slug: "search-companies",
        title: "Search companies",
        description:
          "Run a company search; open a company profile and note firmographic fields.",
        displayOrder: 4,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "si-enrichment",
        slug: "test-enrichment",
        title: "Test contact enrichment",
        description:
          "Reveal or enrich email/phone for a test contact if credits allow. Record accuracy/friction — do not use for outreach spam.",
        displayOrder: 5,
        required: true,
        evidenceHints: ["FEATURE_TEST", "LIMITATION", "OBSERVATION"],
      },
      {
        id: "si-lists",
        slug: "build-list-or-sequence",
        title: "Build a list or sequence",
        description:
          "Save leads to a list and/or create a lightweight sequence draft (do not send to strangers).",
        displayOrder: 6,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "si-crm-export",
        slug: "test-crm-or-export",
        title: "Test CRM sync / export",
        description:
          "Connect CRM or export a CSV of the test list if the plan allows.",
        displayOrder: 7,
        required: true,
        evidenceHints: ["INTEGRATION_TEST", "SCREENSHOT", "NOT_AVAILABLE"],
      },
      {
        id: "si-extension",
        slug: "test-browser-extension",
        title: "Test browser extension / overlay",
        description:
          "If offered, install or open the LinkedIn/browser overlay on a public profile page. Stretch — NOT_AVAILABLE if not offered.",
        displayOrder: 8,
        required: false,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "NOT_AVAILABLE"],
      },
      {
        id: "si-credits",
        slug: "inspect-credits-usage",
        title: "Inspect credits / usage",
        description:
          "Find credit balance, usage meters, and what actions consume credits.",
        displayOrder: 9,
        required: true,
        evidenceHints: ["OBSERVATION", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "si-reporting",
        slug: "inspect-reporting",
        title: "Inspect reporting / activity",
        description:
          "Open activity, sequence, or enrichment reports if present. Stretch for express sessions.",
        displayOrder: 10,
        required: false,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "NOT_AVAILABLE"],
      },
      {
        id: "si-search-ux",
        slug: "test-in-app-search",
        title: "Test in-app search / filters",
        description:
          "Re-run filtered searches; note saved filters and speed. Stretch for express sessions.",
        displayOrder: 11,
        required: false,
        evidenceHints: ["FEATURE_TEST", "OBSERVATION"],
      },
      {
        id: "si-permissions",
        slug: "test-permissions",
        title: "Test permissions / team",
        description:
          "Review seats/roles if available; else mark NOT_AVAILABLE.",
        displayOrder: 12,
        required: false,
        evidenceHints: ["FEATURE_TEST", "NOT_AVAILABLE"],
      },
      {
        id: "si-mobile",
        slug: "test-mobile-responsiveness",
        title: "Test mobile / responsiveness",
        description: "Narrow viewport; note usable vs broken flows.",
        displayOrder: 13,
        required: false,
        evidenceHints: ["OBSERVATION", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "si-help",
        slug: "inspect-help-support",
        title: "Inspect help / support",
        description:
          "Open docs/chat/ticket. Only record channels you actually opened.",
        displayOrder: 14,
        required: true,
        evidenceHints: ["SUPPORT_TEST", "OBSERVATION"],
      },
      {
        id: "si-setup-friction",
        slug: "record-setup-friction",
        title: "Record setup friction",
        description:
          "Summarize time-to-first useful lead list, confusing steps, and blockers.",
        displayOrder: 15,
        required: true,
        evidenceHints: ["TIMING", "OBSERVATION", "LIMITATION"],
      },
      {
        id: "si-verify-pricing",
        slug: "verify-pricing",
        title: "Verify pricing",
        description:
          "Compare in-app plan/credit labels to the public pricing page. Record plan tested.",
        displayOrder: 16,
        required: true,
        evidenceHints: ["PRICING", "SCREENSHOT"],
      },
    ],
  });
