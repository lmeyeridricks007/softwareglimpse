import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function readJsonIfExists<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function firstExisting(...relPaths: string[]): string | null {
  for (const rel of relPaths) {
    const abs = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
    if (existsSync(abs)) return abs;
  }
  return null;
}

export function notConnected(label = "not connected") {
  return { kind: "not_connected" as const, label };
}

export function num(value: number, note?: string) {
  return { kind: "number" as const, value, note };
}

export function pct(value: number, note?: string) {
  return { kind: "percent" as const, value, note };
}

export function text(value: string, note?: string) {
  return { kind: "text" as const, value, note };
}
