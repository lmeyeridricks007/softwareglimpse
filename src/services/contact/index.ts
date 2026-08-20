import { z } from "zod";
import { ContactReasonSchema } from "@/domain";
import { getSiteFoundationConfig } from "@/services/site-foundation/config";
import { CONTACT_REASON_LABELS } from "./reasons";

export { CONTACT_REASON_LABELS };
export {
  CONTACT_REASON_DEFINITIONS,
  CONTACT_INTENT_REASONS,
  CONTACT_REASON_BY_ID,
  parseContactReasonParam,
  getContactReasonDefinition,
  composeContactMessage,
} from "./reasons";

export const ContactSubmissionSchema = z
  .object({
    reason: ContactReasonSchema,
    name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .refine((v) => !/<[^>]*>/.test(v), "HTML is not allowed"),
    email: z.string().email().max(320),
    message: z
      .string()
      .trim()
      .min(10)
      .max(5000)
      .refine((v) => !/<script/i.test(v), "Script content is not allowed"),
    relatedUrl: z
      .string()
      .url()
      .max(500)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    company: z
      .string()
      .trim()
      .max(120)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    privacyAcknowledged: z.boolean().refine((v) => v === true, {
      message: "Privacy acknowledgement is required",
    }),
    /** Honeypot — must be empty */
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.reason === "correction" && !data.relatedUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["relatedUrl"],
        message: "Page URL is required for corrections",
      });
    }
  });

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;

export type ContactSubmissionRecord = ContactSubmissionInput & {
  id: string;
  receivedAt: string;
  sanitizedMessage: string;
};

export interface ContactProvider {
  submit(input: ContactSubmissionRecord): Promise<{ id: string }>;
}

const rateBucket = new Map<string, number[]>();

export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function validateContactSubmission(raw: unknown):
  | { ok: true; data: ContactSubmissionInput }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> } {
  const config = getSiteFoundationConfig();
  const parsed = ContactSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    return { ok: false, error: "Validation failed", fieldErrors };
  }
  if (parsed.data.website) {
    return { ok: false, error: "Rejected" };
  }
  if (parsed.data.message.length > config.contact.maxMessageLength) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: {
        message: [
          `Message must be at most ${config.contact.maxMessageLength} characters`,
        ],
      },
    };
  }
  return { ok: true, data: parsed.data };
}

export function checkContactRateLimit(
  key: string,
  now = Date.now(),
): boolean {
  const config = getSiteFoundationConfig();
  const windowMs = 60 * 60 * 1000;
  const stamps = (rateBucket.get(key) ?? []).filter((t) => now - t < windowMs);
  if (stamps.length >= config.contact.rateLimitPerHour) {
    rateBucket.set(key, stamps);
    return false;
  }
  stamps.push(now);
  rateBucket.set(key, stamps);
  return true;
}

export function __resetContactRateLimitForTests(): void {
  rateBucket.clear();
}

const memoryStore: ContactSubmissionRecord[] = [];

export class MemoryContactProvider implements ContactProvider {
  async submit(input: ContactSubmissionRecord): Promise<{ id: string }> {
    memoryStore.push(input);
    return { id: input.id };
  }

  dump(): ContactSubmissionRecord[] {
    return [...memoryStore];
  }
}

let provider: ContactProvider = new MemoryContactProvider();

export function getContactProvider(): ContactProvider {
  return provider;
}

export function setContactProvider(next: ContactProvider): void {
  provider = next;
}

export async function submitContactForm(
  raw: unknown,
  rateKey = "anon",
): Promise<
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
> {
  const config = getSiteFoundationConfig();
  if (!config.contact.enabled) {
    return { ok: false, error: "Contact form is disabled" };
  }
  if (!checkContactRateLimit(rateKey)) {
    return { ok: false, error: "Too many requests. Try again later." };
  }
  const validated = validateContactSubmission(raw);
  if (!validated.ok) return validated;

  const { randomUUID } = await import("node:crypto");
  const record: ContactSubmissionRecord = {
    ...validated.data,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    sanitizedMessage: sanitizePlainText(validated.data.message),
  };

  try {
    const result = await getContactProvider().submit(record);
    return { ok: true, id: result.id };
  } catch {
    return { ok: false, error: "Unable to submit right now. Try again later." };
  }
}

