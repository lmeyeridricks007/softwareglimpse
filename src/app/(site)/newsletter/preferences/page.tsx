import type { Metadata } from "next";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import { NEWSLETTER_ROUTES, getSiteFoundationConfig } from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "Newsletter preferences",
  description: "Manage SoftwareGlimpse newsletter preferences.",
  path: NEWSLETTER_ROUTES.preferences,
  indexable: false,
});

export default function NewsletterPreferencesPage() {
  const newsletter = getSiteFoundationConfig().newsletter;

  return (
    <FoundationPageShell title="Newsletter preferences">
      <SectionBlock heading="Preferences">
        <p>
          {newsletter.preferencesIntro ??
            "Preference controls will appear here once a newsletter provider that supports them is configured."}
        </p>
      </SectionBlock>
    </FoundationPageShell>
  );
}
