import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "advertising-sponsorship",
  "Advertising & Sponsorship",
  "SoftwareGlimpse advertising and sponsorship policy.",
  LEGAL_ROUTES.advertising,
  true,
);

export default function Page() {
  return <StaticLegalPage id="advertising-sponsorship" />;
}
