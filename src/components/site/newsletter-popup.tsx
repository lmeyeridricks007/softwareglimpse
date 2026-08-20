"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteModal } from "@/components/site/site-modal";
import { NewsletterSignupForm } from "@/components/site/newsletter-signup";
import { useConsentOptional } from "@/components/site/consent-provider";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import { trackSiteEvent } from "@/analytics/site-events";

const STORAGE_KEY = "sg_newsletter_popup";

type PopupState = {
  dismissed?: boolean;
  subscribed?: boolean;
  lastShownAt?: number;
};

function readPopupState(): PopupState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PopupState) : {};
  } catch {
    return {};
  }
}

function writePopupState(next: PopupState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function isLegalOrUtilityPath(path: string): boolean {
  return (
    path.startsWith("/legal/") ||
    path.startsWith("/newsletter/") ||
    path.startsWith("/privacy-request")
  );
}

/**
 * Newsletter popup — never stacks with cookie consent UI.
 * Does not show on first paint; respects dismiss/subscribed + path suppression.
 */
export function NewsletterPopup() {
  const config = siteFoundationConfig.newsletter;
  const consent = useConsentOptional();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!config.enabled || !config.popupEnabled) return;
    if (consent?.cookieUiBlocking) return;
    if (isLegalOrUtilityPath(pathname)) return;
    if (pathname.startsWith("/tools/")) return;

    const state = readPopupState();
    if (state.subscribed || state.dismissed) return;
    if (state.lastShownAt && Date.now() - state.lastShownAt < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    if (config.popupTrigger === "manual") return;

    const delayMs = Math.max(config.popupMinSeconds, 30) * 1000;
    let shown = false;

    const show = () => {
      if (shown) return;
      if (consent?.cookieUiBlocking) return;
      shown = true;
      setOpen(true);
      writePopupState({ ...readPopupState(), lastShownAt: Date.now() });
    };

    if (config.popupTrigger === "scroll") {
      const onScroll = () => {
        const depth =
          (window.scrollY + window.innerHeight) /
          Math.max(document.documentElement.scrollHeight, 1);
        if (depth >= 0.5) {
          window.removeEventListener("scroll", onScroll);
          show();
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (config.popupTrigger === "exit-intent") {
      // Desktop only — no fake mobile exit intent
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      if (isCoarse) return;
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          document.removeEventListener("mouseout", onLeave);
          show();
        }
      };
      document.addEventListener("mouseout", onLeave);
      return () => document.removeEventListener("mouseout", onLeave);
    }

    // second-page / engagement: time-based after meaningful delay
    const timer = window.setTimeout(show, delayMs);
    return () => window.clearTimeout(timer);
  }, [config, consent?.cookieUiBlocking, pathname]);

  if (!config.enabled || !config.popupEnabled) return null;

  return (
    <SiteModal
      open={open && !consent?.cookieUiBlocking}
      onClose={() => {
        setOpen(false);
        writePopupState({ ...readPopupState(), dismissed: true });
        trackSiteEvent("newsletter_popup_dismissed");
      }}
      title={config.popupHeadline ?? config.name}
    >
      {config.popupBody ? (
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          {config.popupBody}
        </p>
      ) : null}
      <NewsletterSignupForm source="popup" placement="site-popup" />
    </SiteModal>
  );
}
