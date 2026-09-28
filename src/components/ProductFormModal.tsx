"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

type FormState = {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  stock: string;
  codSupported: boolean;
  ramStorage: string;
  chipset: string;
  camera: string;
  battery: string;
  screen: string;
  colors: string;
  image: string;
};

function toFormState(product?: Product): FormState {
  if (!product) {
    return {
      id: "",
      name: "",
      brand: "",
      price: "",
      originalPrice: "",
      stock: "",
      codSupported: true,
      ramStorage: "",
      chipset: "",
      camera: "",
      battery: "",
      screen: "",
      colors: "",
      image: "",
    };
  }
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: String(product.price),
    originalPrice: String(product.originalPrice),
    stock: String(product.stock),
    codSupported: product.codSupported,
    ramStorage: product.specs.ramStorage,
    chipset: product.specs.chipset,
    camera: product.specs.camera,
    battery: product.specs.battery,
    screen: product.specs.screen,
    colors: product.colors.join(", "),
    image: product.image ?? "",
  };
}

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product?: Product;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Product = {
      id: form.id.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price) || 0,
      originalPrice: Number(form.originalPrice) || 0,
      stock: Number(form.stock) || 0,
      codSupported: form.codSupported,
      specs: {
        ramStorage: form.ramStorage,
        chipset: form.chipset,
        camera: form.camera,
        battery: form.battery,
        screen: form.screen,
      },
      colors: form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      image: form.image.trim() || undefined,
      ...(isEdit
        ? {
            rating: product?.rating,
            reviewsCount: product?.reviewsCount,
            badge: product?.badge,
            badgeColor: product?.badgeColor,
            officialGaransi: product?.officialGaransi,
          }
        : {}),
    };

    setSaving(true);
    const res = await fetch(isEdit ? `/api/products/${payload.id}` : "/api/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      const saved = await res.json();
      onSaved(saved);
    } else {
      const err = await res.json();
      setError(err.error ?? "Gagal menyimpan produk.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="ID Produk (unik)">
            <input
              required
              disabled={isEdit}
              className="input disabled:opacity-60"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </Field>
          <Field label="Nama Produk">
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Brand">
            <input
              className="input"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </Field>
          <Field label="Harga Jual (Rp)">
            <input
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Field>
          <Field label="Harga Coret (Rp)">
            <input
              type="number"
              className="input"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            />
          </Field>
          <Field label="Stok">
            <input
              type="number"
              className="input"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </Field>
          <Field label="RAM/Storage">
            <input
              className="input"
              value={form.ramStorage}
              onChange={(e) => setForm({ ...form, ramStorage: e.target.value })}
            />
          </Field>
          <Field label="Chipset">
            <input
              className="input"
              value={form.chipset}
              onChange={(e) => setForm({ ...form, chipset: e.target.value })}
            />
          </Field>
          <Field label="Kamera">
            <input
              className="input"
              value={form.camera}
              onChange={(e) => setForm({ ...form, camera: e.target.value })}
            />
          </Field>
          <Field label="Baterai">
            <input
              className="input"
              value={form.battery}
              onChange={(e) => setForm({ ...form, battery: e.target.value })}
            />
          </Field>
          <Field label="Layar">
            <input
              className="input"
              value={form.screen}
              onChange={(e) => setForm({ ...form, screen: e.target.value })}
            />
          </Field>
          <Field label="Warna (pisahkan koma)">
            <input
              className="input"
              placeholder="Black, White, Blue"
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-3">
            <Field label="URL Gambar Produk">
              <input
                type="url"
                className="input"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Field>
            {form.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.image}
                alt="Pratinjau produk"
                className="mt-2 h-24 w-24 rounded-lg border border-black/10 object-cover dark:border-white/10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.codSupported}
              onChange={(e) => setForm({ ...form, codSupported: e.target.checked })}
            />
            Mendukung COD
          </label>

          {error && <p className="col-span-full text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="col-span-full flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="w-fit rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-fit rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Batal
            </button>
          </div>
        </form>
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
