import { randomUUID } from "node:crypto";
import type {
  NewsletterConfirmResult,
  NewsletterProvider,
  NewsletterSubscribeInput,
  NewsletterSubscribeResult,
  NewsletterUnsubscribeResult,
  StoredSubscription,
} from "./types";
import type { NewsletterSubscriptionStatus } from "@/domain";

/**
 * In-memory / injectable fake provider for tests and local stubbing.
 * Does not mark pending as subscribed.
 */
export class FakeNewsletterProvider implements NewsletterProvider {
  private readonly byEmail = new Map<string, StoredSubscription>();

  constructor(private readonly doubleOptIn = true) {}

  async subscribe(
    input: NewsletterSubscribeInput,
  ): Promise<NewsletterSubscribeResult> {
    const key = input.email.toLowerCase();
    const existing = this.byEmail.get(key);
    if (existing?.status === "subscribed") {
      return {
        status: "subscribed",
        message: "Already subscribed",
      };
    }
    if (existing?.status === "pending-confirmation") {
      return {
        status: "pending-confirmation",
        message: "Confirmation already pending — check your email",
        confirmationToken: existing.confirmationToken,
      };
    }

    const token = randomUUID();
    const status: NewsletterSubscriptionStatus = this.doubleOptIn
      ? "pending-confirmation"
      : "subscribed";
    const record: StoredSubscription = {
      email: key,
      status,
      source: input.source,
      placement: input.placement,
      contentId: input.contentId,
      pageType: input.pageType,
      consentAt: new Date().toISOString(),
      confirmationToken: this.doubleOptIn ? token : undefined,
      updatedAt: new Date().toISOString(),
    };
    this.byEmail.set(key, record);
    return {
      status,
      message:
        status === "pending-confirmation"
          ? "Check your email to confirm subscription"
          : "Subscribed",
      confirmationToken: record.confirmationToken,
    };
  }

  async unsubscribe(email: string): Promise<NewsletterUnsubscribeResult> {
    const key = email.toLowerCase();
    const existing = this.byEmail.get(key);
    if (!existing) {
      return { status: "not-found", message: "Subscription not found" };
    }
    existing.status = "unsubscribed";
    existing.updatedAt = new Date().toISOString();
    this.byEmail.set(key, existing);
    return { status: "unsubscribed", message: "Unsubscribed" };
  }

  async confirm(token: string): Promise<NewsletterConfirmResult> {
    for (const [key, record] of this.byEmail) {
      if (record.confirmationToken !== token) continue;
      if (record.status === "subscribed") {
        return {
          status: "already-subscribed",
          message: "Already confirmed",
        };
      }
      record.status = "subscribed";
      record.updatedAt = new Date().toISOString();
      this.byEmail.set(key, record);
      return { status: "confirmed", message: "Subscription confirmed" };
    }
    return { status: "error", message: "Invalid or expired confirmation token" };
  }

  async getStatus(email: string): Promise<NewsletterSubscriptionStatus | null> {
    return this.byEmail.get(email.toLowerCase())?.status ?? null;
  }

  /** Test helper */
  dump(): StoredSubscription[] {
    return [...this.byEmail.values()];
  }
}

let shared: FakeNewsletterProvider | null = null;

export function getNewsletterProvider(): NewsletterProvider {
  if (!shared) {
    shared = new FakeNewsletterProvider(true);
  }
  return shared;
}

export function __resetNewsletterProviderForTests(): void {
  shared = new FakeNewsletterProvider(true);
}
