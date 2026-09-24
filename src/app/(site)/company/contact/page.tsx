import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactHub } from "@/components/contact";
import { ContactHubFromQuery } from "@/components/contact/contact-hub-from-query";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd } from "@/seo/structured-data";
import {
  COMPANY_ROUTES,
  getSiteFoundationConfig,
} from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact SoftwareGlimpse",
  description:
    "Contact SoftwareGlimpse with corrections, questions, vendor information, partnership enquiries, privacy requests or technical issues.",
  path: COMPANY_ROUTES.contact,
  indexable: true,
});

export default function ContactPage() {
  const allowed = getSiteFoundationConfig().contact.reasons;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Company", path: COMPANY_ROUTES.about },
    { name: "Contact", path: COMPANY_ROUTES.contact },
  ];

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbItems)} />
      <Suspense fallback={<ContactHub defaultReason="general" />}>
        <ContactHubFromQuery allowed={allowed} />
      </Suspense>
    </>
  );
}
