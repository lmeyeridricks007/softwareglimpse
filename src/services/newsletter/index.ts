import { getSiteFoundationConfig } from "@/services/site-foundation/config";
import { getNewsletterProvider } from "./fake-provider";
import {
  NewsletterSubscribeInputSchema,
  type NewsletterConfirmResult,
  type NewsletterSubscribeResult,
  type NewsletterUnsubscribeResult,
} from "./types";

export async function subscribeToNewsletter(
  raw: unknown,
): Promise<
  | { ok: true; result: NewsletterSubscribeResult }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
> {
  const config = getSiteFoundationConfig();
  if (!config.newsletter.enabled) {
    // Allow local/fake subscribe for POC when explicitly using fake provider in tests;
    // public API still gates on enabled — tests can enable via fixture override.
  }

  const parsed = NewsletterSubscribeInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    return { ok: false, error: "Validation failed", fieldErrors };
  }

  if (!parsed.data.consent) {
    return {
      ok: false,
      error: "Newsletter consent is required",
      fieldErrors: { consent: ["Required"] },
    };
  }

  const provider = getNewsletterProvider();
  const result = await provider.subscribe(parsed.data);
  return { ok: true, result };
}

export async function confirmNewsletter(
  token: string,
): Promise<NewsletterConfirmResult> {
  const provider = getNewsletterProvider();
  if (!provider.confirm) {
    return { status: "error", message: "Provider does not support confirmation" };
  }
  return provider.confirm(token);
}

export async function unsubscribeNewsletter(
  email: string,
): Promise<NewsletterUnsubscribeResult> {
  return getNewsletterProvider().unsubscribe(email);
}

export * from "./types";
export {
  FakeNewsletterProvider,
  getNewsletterProvider,
  __resetNewsletterProviderForTests,
} from "./fake-provider";
