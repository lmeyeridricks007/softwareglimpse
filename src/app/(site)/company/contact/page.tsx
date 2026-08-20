import type { Metadata } from "next";
import { ContactHub } from "@/components/contact";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd } from "@/seo/structured-data";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { parseContactReasonParam } from "@/services/contact/reasons";
import { getSiteFoundationConfig } from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact SoftwareGlimpse",
  description:
    "Contact SoftwareGlimpse with corrections, questions, vendor information, partnership enquiries, privacy requests or technical issues.",
  path: COMPANY_ROUTES.contact,
  indexable: true,
});

type SearchParams = Promise<{ reason?: string }>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const config = getSiteFoundationConfig().contact;
  const defaultReason = parseContactReasonParam(params.reason, config.reasons);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Company", path: COMPANY_ROUTES.about },
    { name: "Contact", path: COMPANY_ROUTES.contact },
  ];

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbItems)} />
      <ContactHub defaultReason={defaultReason} />
    </>
  );
}
