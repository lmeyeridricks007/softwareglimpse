import { CategoryTestProtocolSchema, type CategoryTestProtocol } from "@/domain";

/**
 * Email / marketing automation hands-on protocol.
 * Assists a human tester — never auto-completes or invents results.
 */
export const emailMarketingTestProtocol: CategoryTestProtocol =
  CategoryTestProtocolSchema.parse({
    id: "protocol-email-marketing-hands-on-v1",
    slug: "email-marketing-hands-on",
    categorySlug: "email-marketing",
    name: "Email marketing hands-on test protocol",
    version: "1.0.0",
    description:
      "Structured first-hand evaluation for email marketing / marketing automation products. Mark NOT_AVAILABLE / NOT_APPLICABLE honestly — do not invent pass results.",
    tasks: [
      {
        id: "em-create-account",
        slug: "create-account",
        title: "Create account",
        description:
          "Sign up for a trial. Record plan selected, verification steps, and signup friction.",
        displayOrder: 1,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "em-onboarding",
        slug: "complete-onboarding",
        title: "Complete onboarding",
        description:
          "Finish setup wizard (domain/brand/list). Note forced vs optional steps.",
        displayOrder: 2,
        required: true,
        evidenceHints: ["SCREENSHOT", "TIMING", "OBSERVATION"],
      },
      {
        id: "em-list-import",
        slug: "import-or-create-list",
        title: "Import or create a list",
        description:
          "Create a list/audience and import a small CSV or add contacts manually.",
        displayOrder: 3,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "TIMING"],
      },
      {
        id: "em-contact-profile",
        slug: "inspect-contact-profile",
        title: "Inspect contact profile",
        description:
          "Open a contact record; note fields, tags, activity timeline, and edit UX.",
        displayOrder: 4,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "em-campaign-draft",
        slug: "create-campaign-draft",
        title: "Create campaign draft",
        description:
          "Build a draft email/campaign (subject, body, audience). Do not send to real customers.",
        displayOrder: 5,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "em-editor",
        slug: "test-editor",
        title: "Test email editor",
        description:
          "Exercise drag-and-drop or code editor; note templates, mobile preview, and limitations.",
        displayOrder: 6,
        required: true,
        evidenceHints: ["FEATURE_TEST", "OBSERVATION", "LIMITATION"],
      },
      {
        id: "em-automation",
        slug: "configure-automation",
        title: "Configure automation",
        description:
          "Create a simple automation (e.g. tag added → send email / wait).",
        displayOrder: 7,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "em-forms-landing",
        slug: "test-form-or-landing",
        title: "Test form / landing page",
        description:
          "Create or open a signup form or landing page builder if available on the plan. Stretch for 45–60m sessions.",
        displayOrder: 8,
        required: false,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT", "NOT_AVAILABLE"],
      },
      {
        id: "em-analytics",
        slug: "inspect-analytics",
        title: "Inspect analytics / reporting",
        description:
          "Open campaign or automation reports (opens, clicks, bounce). Note clarity of metrics.",
        displayOrder: 9,
        required: true,
        evidenceHints: ["FEATURE_TEST", "SCREENSHOT"],
      },
      {
        id: "em-integrations",
        slug: "test-integration",
        title: "Test integration catalog",
        description:
          "Open integrations directory; attempt or inspect a CRM/ecommerce connection if plan allows. Stretch — use BLOCKED/NOT_AVAILABLE when gated.",
        displayOrder: 10,
        required: false,
        evidenceHints: ["INTEGRATION_TEST", "LIMITATION", "OBSERVATION"],
      },
      {
        id: "em-deliverability",
        slug: "inspect-deliverability-settings",
        title: "Inspect deliverability settings",
        description:
          "Find domain authentication (SPF/DKIM/DMARC), sending domains, or reputation tips. Stretch for express sessions.",
        displayOrder: 11,
        required: false,
        evidenceHints: ["OBSERVATION", "SCREENSHOT"],
      },
      {
        id: "em-search",
        slug: "test-search",
        title: "Test search",
        description:
          "Search contacts, campaigns, and automations; note speed and relevance. Stretch for express sessions.",
        displayOrder: 12,
        required: false,
        evidenceHints: ["FEATURE_TEST", "OBSERVATION"],
      },
      {
        id: "em-permissions",
        slug: "test-permissions",
        title: "Test permissions / team",
        description:
          "If available, review user roles or invite a second seat; else mark NOT_AVAILABLE.",
        displayOrder: 13,
        required: false,
        evidenceHints: ["FEATURE_TEST", "NOT_AVAILABLE"],
      },
      {
        id: "em-mobile",
        slug: "test-mobile-responsiveness",
        title: "Test mobile / responsiveness",
        description:
          "Narrow viewport or mobile app; note usable vs broken flows.",
        displayOrder: 14,
        required: false,
        evidenceHints: ["OBSERVATION", "SCREENSHOT", "LIMITATION"],
      },
      {
        id: "em-help",
        slug: "inspect-help-support",
        title: "Inspect help / support",
        description:
          "Open help center, chat, or ticket paths. Only record channels you actually opened.",
        displayOrder: 15,
        required: true,
        evidenceHints: ["SUPPORT_TEST", "OBSERVATION"],
      },
      {
        id: "em-setup-friction",
        slug: "record-setup-friction",
        title: "Record setup friction",
        description:
          "Summarize time-to-first-useful draft, confusing steps, and blockers.",
        displayOrder: 16,
        required: true,
        evidenceHints: ["TIMING", "OBSERVATION", "LIMITATION"],
      },
      {
        id: "em-verify-pricing",
        slug: "verify-pricing",
        title: "Verify pricing",
        description:
          "Compare in-app / billing plan labels to the public pricing page. Record plan tested.",
        displayOrder: 17,
        required: true,
        evidenceHints: ["PRICING", "SCREENSHOT"],
      },
    ],
  });
