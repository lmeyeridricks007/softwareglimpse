import type { Metadata } from "next";
import {
  AccessibilityLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "accessibility",
  "Accessibility Statement",
  "SoftwareGlimpse accessibility commitment and contact route for barriers.",
  LEGAL_ROUTES.accessibility,
  true,
);

export default function Page() {
  return <AccessibilityLegalPage />;
}
