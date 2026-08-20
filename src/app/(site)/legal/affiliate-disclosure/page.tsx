import type { Metadata } from "next";
import {
  StaticLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "affiliate-disclosure",
  "Affiliate Disclosure",
  "How SoftwareGlimpse discloses affiliate relationships.",
  LEGAL_ROUTES.affiliateDisclosure,
  true,
);

export default function Page() {
  return <StaticLegalPage id="affiliate-disclosure" />;
}
