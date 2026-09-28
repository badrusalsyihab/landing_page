"use client";

import { useEffect, useState } from "react";
import type { FaqItem } from "@/lib/types";

export default function FaqManager() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
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

  function updateItem(id: string, patch: Partial<FaqItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: `faq-${Date.now()}`, question: "", answer: "" },
    ]);
  }

  async function handleSave() {
    const cleaned = items
      .map((item) => ({ ...item, question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question && item.answer);

    setSaving(true);
    const res = await fetch("/api/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });
    setSaving(false);
    if (res.ok) {
      setItems(cleaned);
      flash("FAQ tersimpan.");
    }
  }

  if (loading) {
    return <p className="text-sm text-black/50 dark:text-white/50">Memuat...</p>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="space-y-2 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <input
              value={item.question}
              onChange={(e) => updateItem(item.id, { question: e.target.value })}
              className="input font-medium"
              placeholder="Pertanyaan"
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(item.id, { answer: e.target.value })}
              rows={3}
              className="input"
              placeholder="Jawaban"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
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
          + Tambah FAQ
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
