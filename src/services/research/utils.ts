import { createHash } from "node:crypto";
import type { ResearchDomain } from "@/domain";

export function hashContent(text: string): string {
  return createHash("sha256").update(normalizeForHash(text)).digest("hex");
}

export function normalizeForHash(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function nowIso(date = new Date()): string {
  return date.toISOString();
}

export function daysBetween(
  fromIso: string,
  to: Date | string | number = new Date(),
): number {
  const from = Date.parse(fromIso);
  if (Number.isNaN(from)) return Number.POSITIVE_INFINITY;
  const toMs =
    to instanceof Date
      ? to.getTime()
      : typeof to === "number"
        ? to
        : Date.parse(to);
  if (Number.isNaN(toMs)) return Number.POSITIVE_INFINITY;
  return (toMs - from) / (1000 * 60 * 60 * 24);
}

export function parseDomainList(raw?: string): ResearchDomain[] | undefined {
  if (!raw) return undefined;
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean) as ResearchDomain[];
}
