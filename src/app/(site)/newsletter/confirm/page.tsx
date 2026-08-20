import type { Metadata } from "next";
import Link from "next/link";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import { NEWSLETTER_ROUTES, getSiteFoundationConfig } from "@/services/site-foundation";
import { confirmNewsletter } from "@/services/newsletter";

export const metadata: Metadata = buildPageMetadata({
  title: "Confirm newsletter",
  description: "Confirm your SoftwareGlimpse newsletter subscription.",
  path: NEWSLETTER_ROUTES.confirm,
  indexable: false,
});

type SearchParams = Promise<{ token?: string }>;

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;
  const newsletter = getSiteFoundationConfig().newsletter;
  let status:
    | "confirmation-required"
    | "confirmed"
    | "already-subscribed"
    | "error" = "confirmation-required";
  let message =
    newsletter.confirmIntro ??
    "Open the confirmation link from your email to finish subscribing.";

  if (token) {
    const result = await confirmNewsletter(token);
    status = result.status;
    message = result.message;
  }

  return (
    <FoundationPageShell title="Newsletter confirmation">
      <SectionBlock heading={status.replace(/-/g, " ")}>
        <p>{message}</p>
        {status === "confirmed" || status === "already-subscribed" ? (
          <p>
            <Link href={NEWSLETTER_ROUTES.thanks}>Continue</Link>
          </p>
        ) : null}
      </SectionBlock>
    </FoundationPageShell>
  );
}
