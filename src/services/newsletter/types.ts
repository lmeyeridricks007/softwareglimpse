import { z } from "zod";
import type { NewsletterSubscriptionStatus } from "@/domain";

export const NewsletterSubscribeInputSchema = z.object({
  email: z.string().email().max(320),
  consent: z.boolean().refine((v) => v === true, {
    message: "Newsletter consent is required",
  }),
  source: z
    .enum([
      "header",
      "footer",
      "article-inline",
      "article-end",
      "category",
      "tool-result",
      "popup",
      "exit-intent",
      "manual",
    ])
    .default("manual"),
  placement: z.string().max(120).optional(),
  contentId: z.string().max(120).optional(),
  pageType: z.string().max(80).optional(),
  firstName: z.string().max(80).optional(),
});

export type NewsletterSubscribeInput = z.infer<
  typeof NewsletterSubscribeInputSchema
>;

export type NewsletterSubscribeResult = {
  status: NewsletterSubscriptionStatus;
  message: string;
  confirmationToken?: string;
};

export type NewsletterUnsubscribeResult = {
  status: "unsubscribed" | "not-found";
  message: string;
};

export type NewsletterConfirmResult = {
  status: "confirmed" | "already-subscribed" | "error" | "confirmation-required";
  message: string;
};

export interface NewsletterProvider {
  subscribe(input: NewsletterSubscribeInput): Promise<NewsletterSubscribeResult>;
  unsubscribe(email: string): Promise<NewsletterUnsubscribeResult>;
  confirm?(token: string): Promise<NewsletterConfirmResult>;
  getStatus?(email: string): Promise<NewsletterSubscriptionStatus | null>;
}

export type StoredSubscription = {
  email: string;
  status: NewsletterSubscriptionStatus;
  source: string;
  placement?: string;
  contentId?: string;
  pageType?: string;
  consentAt: string;
  confirmationToken?: string;
  updatedAt: string;
};
