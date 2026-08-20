import type { Metadata } from "next";
import {
  TermsLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "terms",
  "Terms of Use",
  "Terms of use for SoftwareGlimpse.",
  LEGAL_ROUTES.terms,
  true,
);

export default function Page() {
  return <TermsLegalPage />;
}
