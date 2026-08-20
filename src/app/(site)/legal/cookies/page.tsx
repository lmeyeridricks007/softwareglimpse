import type { Metadata } from "next";
import {
  CookiesLegalPage,
  legalMetadata,
} from "@/components/site/legal-document-page";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = legalMetadata(
  "cookies",
  "Cookie Policy",
  "Cookies and storage used on SoftwareGlimpse.",
  LEGAL_ROUTES.cookies,
  true,
);

export default function Page() {
  return <CookiesLegalPage />;
}
