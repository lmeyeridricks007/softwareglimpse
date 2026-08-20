import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteAnnouncementBar } from "@/components/site/announcement-bar";
import { SiteProviders } from "@/components/site/site-providers";
import { SITE_NAME, SITE_TAGLINE, getSiteUrl } from "@/lib/site";
import "@/styles/tokens.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  // Explicit weights — avoid downloading the full variable axis set unused.
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

/**
 * Root metadata: host + title template only.
 * Do NOT set a sitewide canonical here — children that omit `alternates`
 * previously inherited the homepage canonical (baseline P1-8).
 */
export const metadata: Metadata = {
  metadataBase: new URL(`${getSiteUrl().replace(/\/$/, "")}/`),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteProviders>
          <SiteAnnouncementBar />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SiteProviders>
        <Analytics />
      </body>
    </html>
  );
}
