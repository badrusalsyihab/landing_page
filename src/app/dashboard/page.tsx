"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product, StoreConfig } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import DashboardLogin, { dashboardLogout, isDashboardAuthed } from "@/components/DashboardLogin";
import ProductFormModal from "@/components/ProductFormModal";
import RulesManager from "@/components/RulesManager";
import FaqManager from "@/components/FaqManager";

type Tab = "config" | "products" | "rules" | "faq";

export default function DashboardPage() {
  const [authed, setAuthed] = useState(() => isDashboardAuthed());

  if (!authed) return <DashboardLogin onSuccess={() => setAuthed(true)} />;

  return <DashboardContent onLogout={() => setAuthed(false)} />;
}

function DashboardContent({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("config");
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([configData, productsData]) => {
      setConfig(configData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSavingConfig(true);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSavingConfig(false);
    if (res.ok) flash("Konfigurasi toko tersimpan.");
  }

  async function handleProductFieldSave(product: Product) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) flash(`${product.name} diperbarui.`);
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Hapus produk ini dari katalog?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      flash("Produk dihapus.");
    }
  }

  function updateLocalProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function handleProductSaved(saved: Product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
    setShowProductForm(false);
    setEditingProduct(null);
    flash(`${saved.name} tersimpan.`);
  }

  function openAddForm() {
    setEditingProduct(null);
    setShowProductForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setShowProductForm(true);
  }

  if (loading || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center text-black/50 dark:text-white/50">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/5 bg-white dark:border-white/10 dark:bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <p className="text-sm text-black/50 dark:text-white/50">{config.storeName}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              &larr; Kembali ke Landing Page
            </Link>
            <button
              onClick={() => {
                dashboardLogout();
                onLogout();
              }}
              className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="mx-auto mt-4 max-w-6xl px-6">
          <div className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-400">
            {message}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex gap-2 border-b border-black/10 dark:border-white/10">
          <button
            onClick={() => setTab("config")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "config"
                ? "border-b-2 border-black dark:border-white"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            Konfigurasi Toko
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "products"
                ? "border-b-2 border-black dark:border-white"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            Produk &amp; Stok
          </button>
          <button
            onClick={() => setTab("rules")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "rules"
                ? "border-b-2 border-black dark:border-white"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            Syarat COD
          </button>
          <button
            onClick={() => setTab("faq")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "faq"
                ? "border-b-2 border-black dark:border-white"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            FAQ
          </button>
        </div>

        {tab === "config" && (
          <form
            onSubmit={handleSaveConfig}
            className="grid max-w-2xl grid-cols-1 gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-2 dark:border-white/10 dark:bg-white/5"
          >
            <Field label="Nama Toko">
              <input
                className="input"
                value={config.storeName}
                onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
              />
            </Field>
            <Field label="Tagline">
              <input
                className="input"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              />
            </Field>
            <Field label="Nomor WhatsApp (tampilan)">
              <input
                className="input"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
              />
            </Field>
            <Field label="Nomor WhatsApp (format 62xxx)">
              <input
                className="input"
                value={config.whatsappApiFormat}
                onChange={(e) => setConfig({ ...config, whatsappApiFormat: e.target.value })}
              />
            </Field>
            <Field label="Biaya COD (%)">
              <input
                type="number"
                className="input"
                value={config.codFeePercentage}
                onChange={(e) =>
                  setConfig({ ...config, codFeePercentage: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Batas Maksimal COD (Rp)">
              <input
                type="number"
                className="input"
                value={config.maxCodLimit}
                onChange={(e) => setConfig({ ...config, maxCodLimit: Number(e.target.value) })}
              />
            </Field>
            <Field label="Jam Operasional">
              <input
                className="input"
                value={config.workingHours}
                onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
              />
            </Field>
            <Field label="Alamat Toko">
              <input
                className="input"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={config.allowCodWithoutLandmark}
                onChange={(e) =>
                  setConfig({ ...config, allowCodWithoutLandmark: e.target.checked })
                }
              />
              Izinkan COD tanpa patokan alamat
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={config.autoDeductStockOnVerify}
                onChange={(e) =>
                  setConfig({ ...config, autoDeductStockOnVerify: e.target.checked })
                }
              />
              Kurangi stok otomatis saat pesanan terverifikasi
            </label>

            <button
              type="submit"
              disabled={savingConfig}
              className="col-span-full mt-2 inline-flex w-fit items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {savingConfig ? "Menyimpan..." : "Simpan Konfigurasi"}
            </button>
          </form>
        )}

        {tab === "products" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-black/50 dark:text-white/50">
                {products.length} produk di katalog
              </p>
              <button
                onClick={openAddForm}
                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 dark:bg-white dark:text-black"
              >
                + Tambah Produk
              </button>
            </div>

            {showProductForm && (
              <ProductFormModal
                product={editingProduct ?? undefined}
                onClose={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                onSaved={handleProductSaved}
              />
            )}

            <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-black/5 text-xs uppercase text-black/50 dark:bg-white/5 dark:text-white/50">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-4 py-3">COD</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-black/5 dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-lg border border-black/10 object-cover dark:border-white/10"
                            onError={(e) => {
                              e.currentTarget.style.visibility = "hidden";
                            }}
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-black/40 dark:text-white/40">
                              {product.brand} &middot; {formatRupiah(product.price)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="input w-32"
                          value={product.price}
                          onChange={(e) =>
                            updateLocalProduct(product.id, { price: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="input w-20"
                          value={product.stock}
                          onChange={(e) =>
                            updateLocalProduct(product.id, { stock: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={product.codSupported}
                          onChange={(e) =>
                            updateLocalProduct(product.id, { codSupported: e.target.checked })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleProductFieldSave(product)}
                            className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/80 dark:bg-white dark:text-black"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => openEditForm(product)}
                            className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "rules" && <RulesManager />}

        {tab === "faq" && <FaqManager />}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-black/70 dark:text-white/70">{label}</span>
      {children}
    </label>
  );
}
