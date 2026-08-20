/**
 * Stable migration monitor issue IDs.
 * Examples: MIG-REDIRECT-7A2C, MIG-404-01B3, MIG-CANONICAL-9F00
 */

import type { MonitorIssueKind } from "./types";

function djb2(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return h >>> 0;
}

export function stableMigIssueId(
  kind: MonitorIssueKind,
  subject: string,
  signature = "",
): string {
  const hash = djb2(`${kind}|${subject}|${signature.slice(0, 160)}`)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")
    .slice(0, 4);
  return `MIG-${kind}-${hash}`;
}
