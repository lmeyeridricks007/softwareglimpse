import type { CrmProductGuideKind } from "@/services/product-guides/kinds";

/**
 * New / regenerated product-pack guides must not silently set indexable:true.
 * Category educational guides remain eligible when they pass KEEP_INDEX gates.
 */
export function mayCreateIndexableProductPackGuide(_input: {
  productSlug: string;
  kind: CrmProductGuideKind;
}): boolean {
  void _input;
  return false;
}
