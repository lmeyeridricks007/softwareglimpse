"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ConsentRecord, CookieCategory } from "@/domain";
import {
  acceptAllConsent,
  categoryAllowed,
  CONSENT_STORAGE_KEY,
  isConsentExpired,
  parseConsentRecord,
  rejectOptionalConsent,
  writeConsentToStorage,
} from "@/services/consent";
import { getSiteFoundationConfig } from "@/data/config/site/foundation-client";
import { SiteModal } from "@/components/site/site-modal";
import { trackSiteEvent } from "@/analytics/site-events";

type ConsentContextValue = {
  consent: ConsentRecord | null;
  needsDecision: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (partial: {
    preferences?: boolean;
    analytics?: boolean;
    marketing?: boolean;
  }) => void;
  allows: (category: CookieCategory) => boolean;
  cookieUiBlocking: boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}

export function useConsentOptional(): ConsentContextValue | null {
  return useContext(ConsentContext);
}

function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseConsentRecord(JSON.parse(raw));
    if (!parsed || isConsentExpired(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const consentListeners = new Set<() => void>();

function emitConsentChange() {
  for (const listener of consentListeners) listener();
}

function subscribeConsent(listener: () => void) {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}

/** Cached so useSyncExternalStore getSnapshot returns a stable reference. */
let cachedConsentRaw: string | null | undefined;
let cachedConsentSnapshot: ConsentRecord | null = null;

function getConsentSnapshot(): ConsentRecord | null {
  if (typeof window === "undefined") return cachedConsentSnapshot;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedConsentRaw) {
    return cachedConsentSnapshot;
  }
  cachedConsentRaw = raw;
  cachedConsentSnapshot = readStoredConsent();
  return cachedConsentSnapshot;
}

function getServerConsentSnapshot(): ConsentRecord | null {
  return null;
}

function ConsentBannerShownTracker({ active }: { active: boolean }) {
  const sent = useRef(false);
  useEffect(() => {
    if (!active || sent.current) return;
    sent.current = true;
    trackSiteEvent("cookie_consent_shown");
  }, [active]);
  return null;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const config = getSiteFoundationConfig();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const persist = useCallback((record: ConsentRecord) => {
    writeConsentToStorage(window.localStorage, record);
    emitConsentChange();
    setPreferencesOpen(false);
    trackSiteEvent("cookie_consent_saved", {
      version: record.version,
      analytics: record.categories.analytics,
      marketing: record.categories.marketing,
      preferences: record.categories.preferences,
    });
  }, []);

  const acceptAll = useCallback(() => {
    persist(acceptAllConsent(config.consent.version));
  }, [config.consent.version, persist]);

  const rejectOptional = useCallback(() => {
    persist(rejectOptionalConsent(config.consent.version));
  }, [config.consent.version, persist]);

  const savePreferences = useCallback(
    (partial: {
      preferences?: boolean;
      analytics?: boolean;
      marketing?: boolean;
    }) => {
      const inUse = new Set(config.consent.categoriesInUse);
      const record = {
        version: config.consent.version,
        decidedAt: new Date().toISOString(),
        categories: {
          strictlyNecessary: true as const,
          preferences: inUse.has("preferences")
            ? (partial.preferences ?? consent?.categories.preferences ?? false)
            : false,
          analytics: inUse.has("analytics")
            ? (partial.analytics ?? consent?.categories.analytics ?? false)
            : false,
          marketing: inUse.has("marketing")
            ? (partial.marketing ?? consent?.categories.marketing ?? false)
            : false,
        },
      };
      persist(record);
      trackSiteEvent("cookie_preferences_updated", {
        analytics: record.categories.analytics,
        marketing: record.categories.marketing,
        preferences: record.categories.preferences,
      });
    },
    [config.consent, consent, persist],
  );

  const allows = useCallback(
    (category: CookieCategory) => categoryAllowed(consent, category),
    [consent],
  );

  const bannerVisible = hydrated && !consent;
  const needsDecision = hydrated && !consent;
  const cookieUiBlocking = needsDecision || preferencesOpen;

  const value = useMemo(
    () => ({
      consent,
      needsDecision,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      acceptAll,
      rejectOptional,
      savePreferences,
      allows,
      cookieUiBlocking,
    }),
    [
      consent,
      needsDecision,
      preferencesOpen,
      acceptAll,
      rejectOptional,
      savePreferences,
      allows,
      cookieUiBlocking,
    ],
  );

  const showAnalytics = config.consent.categoriesInUse.includes("analytics");
  const showMarketing = config.consent.categoriesInUse.includes("marketing");
  const showPreferences = config.consent.categoriesInUse.includes("preferences");

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <ConsentBannerShownTracker active={bannerVisible && !preferencesOpen} />
      {bannerVisible && !preferencesOpen ? (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-lg"
        >
          <div className="container-site flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl text-sm text-[var(--color-fg-muted)]">
              <p className="font-medium text-[var(--color-fg)]">
                {config.consent.bannerTitle ?? "Cookies & privacy choices"}
              </p>
              <p className="mt-1">
                {config.consent.bannerBody ??
                  "We use necessary storage to run the site. Optional analytics only run if you allow them."}{" "}
                <a
                  href="/legal/cookies/"
                  className="underline underline-offset-2"
                >
                  Cookie Policy
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                onClick={rejectOptional}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                onClick={() => setPreferencesOpen(true)}
              >
                Manage preferences
              </button>
              <button
                type="button"
                className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-accent-fg)]"
                onClick={acceptAll}
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <SiteModal
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        title="Cookie preferences"
        closeOnEscape
      >
        <CookiePreferencesForm
          showAnalytics={showAnalytics}
          showMarketing={showMarketing}
          showPreferences={showPreferences}
          descriptions={config.consent.categoryDescriptions}
          initial={consent}
          onSave={savePreferences}
          onReject={rejectOptional}
          onAcceptAll={acceptAll}
        />
      </SiteModal>
    </ConsentContext.Provider>
  );
}

function CookiePreferencesForm({
  showAnalytics,
  showMarketing,
  showPreferences,
  descriptions,
  initial,
  onSave,
  onReject,
  onAcceptAll,
}: {
  showAnalytics: boolean;
  showMarketing: boolean;
  showPreferences: boolean;
  descriptions: {
    strictlyNecessary?: string;
    preferences?: string;
    analytics?: string;
    marketing?: string;
  };
  initial: ConsentRecord | null;
  onSave: ConsentContextValue["savePreferences"];
  onReject: () => void;
  onAcceptAll: () => void;
}) {
  const [preferences, setPreferences] = useState(
    initial?.categories.preferences ?? false,
  );
  const [analytics, setAnalytics] = useState(
    initial?.categories.analytics ?? false,
  );
  const [marketing, setMarketing] = useState(
    initial?.categories.marketing ?? false,
  );

  return (
    <div className="space-y-4 text-sm text-[var(--color-fg-muted)]">
      <label className="flex items-start gap-2">
        <input type="checkbox" checked disabled readOnly className="mt-1" />
        <span>
          <strong className="text-[var(--color-fg)]">Strictly necessary</strong>
          <br />
          {descriptions.strictlyNecessary ??
            "Always active — required for consent storage and core site function."}
        </span>
      </label>
      {showPreferences ? (
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={preferences}
            onChange={(e) => setPreferences(e.target.checked)}
          />
          <span>
            <strong className="text-[var(--color-fg)]">Preferences</strong>
            <br />
            {descriptions.preferences ??
              "Remember optional UI choices such as newsletter popup dismissal."}
          </span>
        </label>
      ) : null}
      {showAnalytics ? (
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
          <span>
            <strong className="text-[var(--color-fg)]">Analytics</strong>
            <br />
            {descriptions.analytics ??
              "Help us understand aggregated usage. Not loaded before consent."}
          </span>
        </label>
      ) : null}
      {showMarketing ? (
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          <span>
            <strong className="text-[var(--color-fg)]">Marketing</strong>
            <br />
            {descriptions.marketing ??
              "Advertising / marketing tags if configured."}
          </span>
        </label>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
          onClick={onReject}
        >
          Reject non-essential
        </button>
        <button
          type="button"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
          onClick={onAcceptAll}
        >
          Accept all
        </button>
        <button
          type="button"
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 font-medium text-[var(--color-accent-fg)]"
          onClick={() => onSave({ preferences, analytics, marketing })}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}
