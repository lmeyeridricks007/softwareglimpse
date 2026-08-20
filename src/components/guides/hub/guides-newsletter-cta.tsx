import { Mail } from "lucide-react";
import { NewsletterSignupForm } from "@/components/site/newsletter-signup";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  enabled: boolean;
  className?: string;
};

export function GuidesNewsletterCta({ enabled, className }: Props) {
  const n = siteFoundationConfig.newsletter;

  return (
    <Section
      padding="md"
      background="tint"
      container="wide"
      className={className}
    >
      <div
        className={cn(
          "flex flex-col gap-5 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5 shadow-[var(--sg-shadow-sm)] sm:flex-row sm:items-center sm:justify-between sm:px-6",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
            <Mail className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-semibold text-[var(--sg-color-navy)]">
              Stay smarter about software
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Get new buying guides, comparisons and research updates.
            </p>
          </div>
        </div>

        <div className="w-full shrink-0 sm:max-w-md">
          {enabled ? (
            <NewsletterSignupForm
              source="category"
              placement="guides-hub-newsletter"
            />
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                Newsletter coming soon
              </p>
              <ButtonLink
                href={COMPANY_ROUTES.contact}
                variant="outline"
                size="sm"
              >
                Get notified when it launches
              </ButtonLink>
              {n.name ? (
                <span className="sr-only">{n.name}</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
