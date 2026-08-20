import type { SerpQueryResult } from "../types";

export type SerpSearchProvider = {
  id: string;
  /** True when results come from a live approved API (not fixtures). */
  isLive: boolean;
  search(
    query: string,
    options?: { num?: number },
  ): Promise<SerpQueryResult>;
};

export class SerpProviderNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SerpProviderNotConfiguredError";
  }
}
