import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "editorial-independence",
  "Editorial Independence",
  "How SoftwareGlimpse separates commercial relationships from editorial rankings.",
  LEGAL_ROUTES.editorialIndependence,
  true,
);

export default function Page() {
  return <StaticLegalPage id="editorial-independence" />;
}
