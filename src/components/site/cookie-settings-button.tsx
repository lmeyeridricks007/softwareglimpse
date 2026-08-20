"use client";

import { useConsentOptional } from "@/components/site/consent-provider";

export function CookieSettingsButton({
  className = "text-sm text-[var(--color-fg-muted)] underline-offset-2 hover:underline",
}: {
  className?: string;
}) {
  const consent = useConsentOptional();
  return (
    <button
      type="button"
      className={className}
      onClick={() => consent?.openPreferences()}
    >
      Cookie settings
    </button>
  );
}
