/**
 * Persist a promotion to disk (Node/CLI). Keeps seed files untouched.
 *
 *   import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
 */
import { promoteToIndexable, type PromoteablePage } from "./promote";
import { getContentLifecycleStoreSnapshot } from "./store";
import type { PromoteResult } from "./types";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "./store-write";

/**
 * Promote and write lifecycle immediately.
 * Reloads disk only when memory is empty so batch callers can promote many
 * pages without wiping earlier in-process upserts.
 */
export function promoteAndPersist(page: PromoteablePage): PromoteResult {
  const snap = getContentLifecycleStoreSnapshot();
  if (!snap.entries || Object.keys(snap.entries).length === 0) {
    loadContentLifecycleStoreFromDisk();
  }
  const result = promoteToIndexable(page);
  if (result.ok) {
    persistContentLifecycleStore();
  }
  return result;
}
