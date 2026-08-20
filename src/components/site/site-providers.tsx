"use client";

import dynamic from "next/dynamic";
import { ConsentProvider } from "@/components/site/consent-provider";
import { ConsentAwareAnalytics } from "@/components/site/consent-script";
import { CookieSettingsButton } from "@/components/site/cookie-settings-button";
import { WebVitals } from "@/components/site/web-vitals";

/**
 * Newsletter popup is deferred — not needed for LCP/INP on first paint.
 * ssr:false avoids shipping popup markup in the critical HTML.
 */
const NewsletterPopup = dynamic(
  () =>
    import("@/components/site/newsletter-popup").then((m) => m.NewsletterPopup),
  { ssr: false, loading: () => null },
);

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <WebVitals />
      <ConsentAwareAnalytics />
      {children}
      <NewsletterPopup />
    </ConsentProvider>
  );
}

export { CookieSettingsButton };
