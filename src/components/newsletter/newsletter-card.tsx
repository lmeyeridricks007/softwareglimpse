import { NewsletterSignupForm } from "@/components/site/newsletter-signup";
import { Card } from "@/components/ui/card";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import { cn } from "@/lib/cn";

export function NewsletterCard({
  className,
  source = "article-inline",
  /** When true, render nothing if newsletter is disabled (preferred on homepage). */
  hideWhenDisabled = false,
}: {
  className?: string;
  source?: "footer" | "article-inline" | "article-end" | "category" | "popup";
  hideWhenDisabled?: boolean;
}) {
  const n = siteFoundationConfig.newsletter;

  if (!n.enabled && hideWhenDisabled) {
    return null;
  }

  return (
    <Card
      variant="highlighted"
      className={cn("bg-[var(--sg-color-surface-tint)]", className)}
    >
      <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
        {n.name}
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        {n.inlineTeaser ?? n.description}
      </p>
      <div className="mt-4">
        {n.enabled ? (
          <NewsletterSignupForm source={source} placement="newsletter-card" />
        ) : (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Newsletter coming soon.
          </p>
        )}
      </div>
    </Card>
  );
}
