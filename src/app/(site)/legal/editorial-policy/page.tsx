import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "editorial-policy",
  "Editorial Policy",
  "SoftwareGlimpse editorial standards: authorship, evidence levels, scoring, AI assistance, and affiliate independence.",
  LEGAL_ROUTES.editorialPolicy,
  true,
);

export default function Page() {
  return <StaticLegalPage id="editorial-policy" />;
}
