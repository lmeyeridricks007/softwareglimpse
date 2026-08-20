"use client";

/**
 * Consent-aware third-party embed gate (e.g. YouTube).
 * Does not load third-party iframes until the category is allowed and the
 * visitor explicitly unlocks the embed.
 *
 * Prefer OfficialProductVideo for product media — it adds thumbnail-first
 * lazy hydration and video-specific consent copy.
 */
import { useState } from "react";
import { useConsentOptional } from "@/components/site/consent-provider";
import { Button } from "@/components/ui/button";

export function ConsentEmbed({
  title,
  category = "marketing",
  children,
  allowLabel,
}: {
  title: string;
  category?: "marketing" | "analytics" | "preferences";
  children: React.ReactNode;
  /** Override primary unlock CTA (e.g. "Allow and play"). */
  allowLabel?: string;
}) {
  const consent = useConsentOptional();
  const allowed = consent?.allows(category) ?? false;
  const [unlocked, setUnlocked] = useState(false);

  if (!allowed) {
    return (
      <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-4 text-sm text-[var(--sg-color-text-muted)]">
        <p className="font-medium text-[var(--sg-color-text)]">{title}</p>
        <p className="mt-1">
          Optional {category} consent is required before loading this third-party
          embed.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (category === "marketing") {
                consent?.savePreferences({ marketing: true });
              } else if (category === "analytics") {
                consent?.savePreferences({ analytics: true });
              } else {
                consent?.savePreferences({ preferences: true });
              }
              setUnlocked(true);
            }}
          >
            {allowLabel ?? "Allow and load"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => consent?.openPreferences()}
          >
            Cookie settings
          </Button>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-4 text-sm text-[var(--sg-color-text-muted)]">
        <p className="font-medium text-[var(--sg-color-text)]">
          Load external content: {title}
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-3"
          onClick={() => setUnlocked(true)}
        >
          {allowLabel ?? `Load ${title}`}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
