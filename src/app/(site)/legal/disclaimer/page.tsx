import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "disclaimer",
  "Disclaimer",
  "Informational disclaimer for SoftwareGlimpse content and tools.",
  LEGAL_ROUTES.disclaimer,
  true,
);

export default function Page() {
  return <StaticLegalPage id="disclaimer" />;
}
