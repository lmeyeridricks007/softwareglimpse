import type { Metadata } from "next";
import {
  PrivacyLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "privacy",
  "Privacy Policy",
  "How SoftwareGlimpse processes personal data.",
  LEGAL_ROUTES.privacy,
  true,
);

export default function Page() {
  return <PrivacyLegalPage />;
}
