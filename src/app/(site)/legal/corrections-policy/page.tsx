import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "corrections-policy",
  "Corrections Policy",
  "How to report errors on SoftwareGlimpse and how we investigate, correct, and update published content.",
  LEGAL_ROUTES.correctionsPolicy,
  true,
);

export default function Page() {
  return <StaticLegalPage id="corrections-policy" />;
}
