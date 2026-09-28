"use client";

import { useEffect, useState } from "react";
import type { HighlightItem } from "@/lib/types";

export default function HighlightsManager() {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/highlights")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }

  function updateItem(id: string, patch: Partial<HighlightItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    setItems((prev) => [...prev, { id: `highlight-${Date.now()}`, title: "", subtitle: "" }]);
  }

  async function handleSave() {
    const cleaned = items
      .map((item) => ({ ...item, title: item.title.trim(), subtitle: item.subtitle.trim() }))
      .filter((item) => item.title);

    setSaving(true);
    const res = await fetch("/api/highlights", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });
    setSaving(false);
    if (res.ok) {
      setItems(cleaned);
      flash("Sorotan hero tersimpan.");
    }
  }

  if (loading) {
    return <p className="text-sm text-black/50 dark:text-white/50">Memuat...</p>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-black/50 dark:text-white/50">
        Sorotan singkat yang tampil di bagian hero landing page (contoh: &ldquo;100% Original&rdquo;,
        &ldquo;Bisa COD&rdquo;, &ldquo;1 Tahun&rdquo;).
      </p>

      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex-1 space-y-2">
              <input
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className="input font-medium"
                placeholder="Judul (mis: 100% Original)"
              />
              <input
                value={item.subtitle}
                onChange={(e) => updateItem(item.id, { subtitle: e.target.value })}
                className="input"
                placeholder="Sub-teks (mis: BNIB Resmi Indonesia)"
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="mt-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addItem}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          + Tambah Sorotan
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
