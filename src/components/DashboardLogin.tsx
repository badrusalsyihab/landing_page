"use client";

import { useState } from "react";

const STATIC_EMAIL = "admin@gadgetzonecell.com";
const STATIC_PASSWORD = "admin123";
const SESSION_KEY = "dashboard_authed";

export function isDashboardAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function dashboardLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function DashboardLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onSuccess();
    } else {
      setError("Email atau password salah.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
      >
        <h1 className="mb-1 text-xl font-bold">Login Dashboard</h1>
        <p className="mb-6 text-sm text-black/50 dark:text-white/50">
          Masuk untuk mengelola GadgetZone Cell.
        </p>

        <label className="mb-3 flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/70 dark:text-white/70">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="admin@gadgetzonecell.com"
          />
        </label>

        <label className="mb-4 flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/70 dark:text-white/70">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="********"
          />
        </label>

        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/80 dark:bg-white dark:text-black"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
