import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy request",
  description: "Submit a privacy-related request to SoftwareGlimpse.",
  path: "/privacy-request/",
  indexable: false,
});

export default function PrivacyRequestPage() {
  return (
    <FoundationPageShell
      title="Privacy request"
      summary="Access, deletion, correction, unsubscribe, or other privacy requests. Share only what is needed."
    >
      <SectionBlock heading="Request form">
        <ContactForm defaultReason="privacy" />
      </SectionBlock>
    </FoundationPageShell>
  );
}
