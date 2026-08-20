import { z } from "zod";

/** URL-safe identifier. Lowercase kebab-case. */
export const SlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const IsoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .or(z.string().date());

export const IsoDateSchema = z.string().date();

export const CurrencyCodeSchema = z
  .string()
  .length(3)
  .regex(/^[A-Z]{3}$/, "Currency must be ISO 4217 uppercase");

export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export type Slug = z.infer<typeof SlugSchema>;
