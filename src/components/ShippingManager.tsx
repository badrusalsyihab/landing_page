"use client";

import { useEffect, useState } from "react";
import type { ShippingOption } from "@/lib/shipping";

export default function ShippingManager() {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shipping")
      .then((r) => r.json())
      .then((data) => {
        setOptions(data);
        setLoading(false);
      });
  }, []);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }

  function updateOption(id: string, patch: Partial<ShippingOption>) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      { id: `kota-${Date.now()}`, label: "", fee: 0, eta: "" },
    ]);
  }

  async function handleSave() {
    const cleaned = options
      .map((o) => ({ ...o, label: o.label.trim(), eta: o.eta.trim() }))
      .filter((o) => o.label);

    setSaving(true);
    const res = await fetch("/api/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });
    setSaving(false);
    if (res.ok) {
      setOptions(cleaned);
      flash("Daftar kota & ongkir tersimpan.");
    }
  }

  if (loading) {
    return <p className="text-sm text-black/50 dark:text-white/50">Memuat...</p>;
  }

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-black/50 dark:text-white/50">
        Daftar kota tujuan &amp; ongkir yang tampil di Kalkulator Simulasi COD.
      </p>

      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className="grid grid-cols-1 gap-2 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center dark:border-white/10 dark:bg-white/5"
          >
            <input
              value={option.label}
              onChange={(e) => updateOption(option.id, { label: e.target.value })}
              className="input"
              placeholder="Nama Kota (mis: Jabodetabek)"
            />
            <input
              type="number"
              value={option.fee}
              onChange={(e) => updateOption(option.id, { fee: Number(e.target.value) })}
              className="input"
              placeholder="Ongkir (Rp)"
            />
            <input
              value={option.eta}
              onChange={(e) => updateOption(option.id, { eta: e.target.value })}
              className="input"
              placeholder="Estimasi (mis: 1-2 Hari)"
            />
            <button
              onClick={() => removeOption(option.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addOption}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          + Tambah Kota
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>
    </div>
  );
}
