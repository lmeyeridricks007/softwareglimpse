import type { Metadata } from "next";
import Link from "next/link";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import { COMPANY_ROUTES, NEWSLETTER_ROUTES, getSiteFoundationConfig } from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "Thanks for subscribing",
  description: "Your SoftwareGlimpse newsletter subscription is confirmed.",
  path: NEWSLETTER_ROUTES.thanks,
  indexable: false,
});

export default function NewsletterThanksPage() {
  const newsletter = getSiteFoundationConfig().newsletter;

  return (
    <FoundationPageShell title="Thanks for subscribing">
      <SectionBlock heading="What to expect">
        <p>
          {newsletter.thanksBody ??
            "You’re confirmed. Expect software buying guides, comparisons, and practical updates when the newsletter is operational."}
        </p>
      </SectionBlock>
      <SectionBlock heading="Useful starting points">
        <ul className="list-disc pl-5">
          <li>
            <Link href="/tools/crm-finder/">CRM Finder</Link>
          </li>
          <li>
            <Link href="/categories/">Browse categories</Link>
          </li>
          <li>
            <Link href={COMPANY_ROUTES.howWeReview}>How we review software</Link>
          </li>
        </ul>
      </SectionBlock>
    </FoundationPageShell>
  );
}
