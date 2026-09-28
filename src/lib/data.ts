import { promises as fs } from "fs";
import path from "path";
import type { FaqItem, Product, StoreConfig } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONFIG_PATH = path.join(DATA_DIR, "store-config.json");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const RULES_PATH = path.join(DATA_DIR, "cod-rules.json");
const FAQ_PATH = path.join(DATA_DIR, "faq.json");

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
