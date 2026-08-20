import fs from "node:fs";
import path from "node:path";
import {
  CategoryKnowledgePlanSchema,
  ProductKnowledgePlanSchema,
  type CategoryKnowledgePlan,
  type ProductKnowledgePlan,
} from "@/domain";

function root() {
  return path.join(process.cwd(), "src/data/knowledge-plans");
}

function ensure(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function saveCategoryKnowledgePlan(plan: CategoryKnowledgePlan): void {
  const parsed = CategoryKnowledgePlanSchema.parse(plan);
  const dir = path.join(root(), "category", parsed.categorySlug);
  ensure(dir);
  fs.writeFileSync(
    path.join(dir, `${parsed.id.replace(/[:]/g, "-")}.json`),
    `${JSON.stringify(parsed, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(dir, "latest.json"),
    `${JSON.stringify(parsed, null, 2)}\n`,
  );
}

export function loadLatestCategoryKnowledgePlan(
  categorySlug: string,
): CategoryKnowledgePlan | null {
  const file = path.join(root(), "category", categorySlug, "latest.json");
  if (!fs.existsSync(file)) return null;
  return CategoryKnowledgePlanSchema.parse(
    JSON.parse(fs.readFileSync(file, "utf8")),
  );
}

export function saveProductKnowledgePlan(plan: ProductKnowledgePlan): void {
  const parsed = ProductKnowledgePlanSchema.parse(plan);
  const dir = path.join(root(), "product", parsed.productSlug);
  ensure(dir);
  fs.writeFileSync(
    path.join(dir, `${parsed.id.replace(/[:]/g, "-")}.json`),
    `${JSON.stringify(parsed, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(dir, "latest.json"),
    `${JSON.stringify(parsed, null, 2)}\n`,
  );
}

export function loadLatestProductKnowledgePlan(
  productSlug: string,
): ProductKnowledgePlan | null {
  const file = path.join(root(), "product", productSlug, "latest.json");
  if (!fs.existsSync(file)) return null;
  return ProductKnowledgePlanSchema.parse(
    JSON.parse(fs.readFileSync(file, "utf8")),
  );
}
