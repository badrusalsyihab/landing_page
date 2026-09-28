"use client";

import { useEffect, useState } from "react";

export default function RulesManager() {
  const [rules, setRules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((data) => {
        setRules(data);
        setLoading(false);
      });
  }, []);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }

  function updateRule(index: number, value: string) {
    setRules((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function removeRule(index: number) {
    setRules((prev) => prev.filter((_, i) => i !== index));
  }

  function addRule() {
    setRules((prev) => [...prev, ""]);
  }

  async function handleSave() {
    const cleaned = rules.map((r) => r.trim()).filter(Boolean);
    setSaving(true);
    const res = await fetch("/api/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });
    setSaving(false);
    if (res.ok) {
      setRules(cleaned);
      flash("Syarat & Ketentuan COD tersimpan.");
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

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-2">
            <textarea
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              rows={2}
              className="input flex-1"
              placeholder="Tulis syarat/ketentuan COD..."
            />
            <button
              onClick={() => removeRule(index)}
              className="mt-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addRule}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          + Tambah Syarat
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
