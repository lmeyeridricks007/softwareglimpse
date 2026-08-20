import type { z } from "zod";
import { ProductEditorialAssessmentSchema } from "@/domain";

type AssessmentInput = z.input<typeof ProductEditorialAssessmentSchema>;

/**
 * Seed assessments for products without JSON store files.
 * Pipedrive’s approved assessment lives in `assessments/pipedrive.json`.
 */
export const assessmentsSeed: AssessmentInput[] = [
  {
    id: "assess-freshsales-crm-v1",
    productSlug: "freshsales",
    methodologySlug: "crm-editorial",
    methodologyVersion: "1.0.0",
    status: "review-required",
    verdict:
      "Freshsales appears stronger when buyers want pipeline CRM plus built-in engagement (phone, AI lead scoring) in one Freshworks suite. Assessment remains provisional.",
    strengths: [
      "Built-in call functionality evidenced in fixtures",
      "Lead scoring and AI assistance marked supported",
      "Combined sales + engagement positioning",
    ],
    weaknesses: [
      "Deal-management depth vs Pipedrive is not as explicitly evidenced",
      "Customization depth needs stronger non-fixture verification",
    ],
    bestFor: [
      "Teams wanting CRM with native calling and lead scoring",
      "Buyers already considering Freshworks ecosystem tools",
    ],
    notIdealFor: [
      "Teams that want a minimal, pipeline-only CRM with the lightest admin surface",
    ],
    tradeoffs: [
      "Broader engagement suite vs specialized pipeline CRM focus",
    ],
    handsOnTesting: false,
    confidence: "low",
    criterionAssessments: [
      {
        criterionSlug: "email-capabilities",
        score: 7,
        rationale:
          "Email sync plus engagement suite positioning; phone is an evidenced differentiator vs Pipedrive fixtures.",
        confidence: "low",
        status: "assessment-in-progress",
      },
      {
        criterionSlug: "sales-automation",
        score: 7,
        rationale:
          "Workflow automation and lead scoring are evidenced; depth not hands-on verified.",
        confidence: "low",
        status: "assessment-in-progress",
      },
    ],
    overallScore: 7,
    overallScoreRationale:
      "Provisional — engagement-suite strengths, not an approved public score.",
  },
];
