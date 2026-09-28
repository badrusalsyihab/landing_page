import { promises as fs } from "fs";
import path from "path";
import type { FaqItem, HighlightItem, Product, StoreConfig } from "./types";
import type { ShippingOption } from "./shipping";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONFIG_PATH = path.join(DATA_DIR, "store-config.json");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const RULES_PATH = path.join(DATA_DIR, "cod-rules.json");
const FAQ_PATH = path.join(DATA_DIR, "faq.json");
const HIGHLIGHTS_PATH = path.join(DATA_DIR, "hero-highlights.json");
const SHIPPING_PATH = path.join(DATA_DIR, "shipping-options.json");

export async function getStoreConfig(): Promise<StoreConfig> {
  const raw = await fs.readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2) + "\n", "utf-8");
}

export async function getCodRules(): Promise<string[]> {
  const raw = await fs.readFile(RULES_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveCodRules(rules: string[]): Promise<void> {
  await fs.writeFile(RULES_PATH, JSON.stringify(rules, null, 2) + "\n", "utf-8");
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const raw = await fs.readFile(FAQ_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveFaqItems(items: FaqItem[]): Promise<void> {
  await fs.writeFile(FAQ_PATH, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

export async function getHighlights(): Promise<HighlightItem[]> {
  const raw = await fs.readFile(HIGHLIGHTS_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveHighlights(items: HighlightItem[]): Promise<void> {
  await fs.writeFile(HIGHLIGHTS_PATH, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

export async function getShippingOptions(): Promise<ShippingOption[]> {
  const raw = await fs.readFile(SHIPPING_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveShippingOptions(options: ShippingOption[]): Promise<void> {
  await fs.writeFile(SHIPPING_PATH, JSON.stringify(options, null, 2) + "\n", "utf-8");
}
