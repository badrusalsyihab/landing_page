import { supabase } from "./supabase";
import type { FaqItem, HighlightItem, Product, StoreConfig } from "./types";
import type { ShippingOption } from "./shipping";

// ─── helpers ────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string,
    price: row.price as number,
    originalPrice: row.original_price as number,
    stock: row.stock as number,
    codSupported: row.cod_supported as boolean,
    specs: row.specs as Product["specs"],
    colors: row.colors as string[],
    rating: row.rating as number | undefined,
    reviewsCount: row.reviews_count as number | undefined,
    badge: row.badge as string | undefined,
    badgeColor: row.badge_color as string | undefined,
    officialGaransi: row.official_garansi as string | undefined,
    image: row.image as string | undefined,
  };
}

function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    original_price: p.originalPrice,
    stock: p.stock,
    cod_supported: p.codSupported,
    specs: p.specs,
    colors: p.colors,
    rating: p.rating ?? null,
    reviews_count: p.reviewsCount ?? null,
    badge: p.badge ?? null,
    badge_color: p.badgeColor ?? null,
    official_garansi: p.officialGaransi ?? null,
    image: p.image ?? null,
  };
}

function rowToStoreConfig(row: Record<string, unknown>): StoreConfig {
  return {
    storeName: row.store_name as string,
    tagline: row.tagline as string,
    whatsappNumber: row.whatsapp_number as string,
    whatsappApiFormat: row.whatsapp_api_format as string,
    codFeePercentage: row.cod_fee_percentage as number,
    allowCodWithoutLandmark: row.allow_cod_without_landmark as boolean,
    autoDeductStockOnVerify: row.auto_deduct_stock_on_verify as boolean,
    maxCodLimit: row.max_cod_limit as number,
    workingHours: row.working_hours as string,
    address: row.address as string,
  };
}

function storeConfigToRow(c: StoreConfig) {
  return {
    store_name: c.storeName,
    tagline: c.tagline,
    whatsapp_number: c.whatsappNumber,
    whatsapp_api_format: c.whatsappApiFormat,
    cod_fee_percentage: c.codFeePercentage,
    allow_cod_without_landmark: c.allowCodWithoutLandmark,
    auto_deduct_stock_on_verify: c.autoDeductStockOnVerify,
    max_cod_limit: c.maxCodLimit,
    working_hours: c.workingHours,
    address: c.address,
  };
}

// ─── store config ────────────────────────────────────────────────────────────

export async function getStoreConfig(): Promise<StoreConfig> {
  const { data, error } = await supabase
    .from("store_config")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw new Error(error.message);
  return rowToStoreConfig(data);
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  const { error } = await supabase
    .from("store_config")
    .upsert({ id: 1, ...storeConfigToRow(config) });
  if (error) throw new Error(error.message);
}

// ─── products ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>[]).map(rowToProduct);
}

export async function saveProducts(products: Product[]): Promise<void> {
  const { error: delErr } = await supabase
    .from("products")
    .delete()
    .neq("id", "");
  if (delErr) throw new Error(delErr.message);

  if (products.length === 0) return;

  const { error } = await supabase
    .from("products")
    .insert(products.map(productToRow));
  if (error) throw new Error(error.message);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProduct(data as Record<string, unknown>) : null;
}

export async function createProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(productToRow(product))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToProduct(data as Record<string, unknown>);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const rowUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) rowUpdates.name = updates.name;
  if (updates.brand !== undefined) rowUpdates.brand = updates.brand;
  if (updates.price !== undefined) rowUpdates.price = updates.price;
  if (updates.originalPrice !== undefined) rowUpdates.original_price = updates.originalPrice;
  if (updates.stock !== undefined) rowUpdates.stock = updates.stock;
  if (updates.codSupported !== undefined) rowUpdates.cod_supported = updates.codSupported;
  if (updates.specs !== undefined) rowUpdates.specs = updates.specs;
  if (updates.colors !== undefined) rowUpdates.colors = updates.colors;
  if (updates.rating !== undefined) rowUpdates.rating = updates.rating;
  if (updates.reviewsCount !== undefined) rowUpdates.reviews_count = updates.reviewsCount;
  if (updates.badge !== undefined) rowUpdates.badge = updates.badge;
  if (updates.badgeColor !== undefined) rowUpdates.badge_color = updates.badgeColor;
  if (updates.officialGaransi !== undefined) rowUpdates.official_garansi = updates.officialGaransi;
  if (updates.image !== undefined) rowUpdates.image = updates.image;

  const { data, error } = await supabase
    .from("products")
    .update(rowUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToProduct(data as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── cod rules ───────────────────────────────────────────────────────────────

export async function getCodRules(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cod_rules")
    .select("rule")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as { rule: string }[]).map((r) => r.rule);
}

export async function saveCodRules(rules: string[]): Promise<void> {
  const { error: delErr } = await supabase
    .from("cod_rules")
    .delete()
    .neq("id", 0);
  if (delErr) throw new Error(delErr.message);

  if (rules.length === 0) return;

  const rows = rules.map((rule, i) => ({ rule, sort_order: i }));
  const { error } = await supabase.from("cod_rules").insert(rows);
  if (error) throw new Error(error.message);
}

// ─── faq ─────────────────────────────────────────────────────────────────────

export async function getFaqItems(): Promise<FaqItem[]> {
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as FaqItem[];
}

export async function saveFaqItems(items: FaqItem[]): Promise<void> {
  const { error: delErr } = await supabase
    .from("faq_items")
    .delete()
    .neq("id", "");
  if (delErr) throw new Error(delErr.message);

  if (items.length === 0) return;

  const rows = items.map((item, i) => ({ ...item, sort_order: i }));
  const { error } = await supabase.from("faq_items").insert(rows);
  if (error) throw new Error(error.message);
}

// ─── highlights ───────────────────────────────────────────────────────────────

export async function getHighlights(): Promise<HighlightItem[]> {
  const { data, error } = await supabase
    .from("highlights")
    .select("id, title, subtitle")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as HighlightItem[];
}

export async function saveHighlights(items: HighlightItem[]): Promise<void> {
  const { error: delErr } = await supabase
    .from("highlights")
    .delete()
    .neq("id", "");
  if (delErr) throw new Error(delErr.message);

  if (items.length === 0) return;

  const rows = items.map((item, i) => ({ ...item, sort_order: i }));
  const { error } = await supabase.from("highlights").insert(rows);
  if (error) throw new Error(error.message);
}

// ─── shipping ─────────────────────────────────────────────────────────────────

export async function getShippingOptions(): Promise<ShippingOption[]> {
  const { data, error } = await supabase
    .from("shipping_options")
    .select("id, label, fee, eta")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as ShippingOption[];
}

export async function saveShippingOptions(
  options: ShippingOption[]
): Promise<void> {
  const { error: delErr } = await supabase
    .from("shipping_options")
    .delete()
    .neq("id", "");
  if (delErr) throw new Error(delErr.message);

  if (options.length === 0) return;

  const rows = options.map((opt, i) => ({ ...opt, sort_order: i }));
  const { error } = await supabase.from("shipping_options").insert(rows);
  if (error) throw new Error(error.message);
}
