"use client";

import { useState } from "react";
import { PackageCheck, X } from "lucide-react";
import type { CartItem, StoreConfig } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import WhatsAppIcon from "./WhatsAppIcon";

export default function CheckoutModal({
  open,
  cart,
  config,
  onClose,
}: {
  open: boolean;
  cart: CartItem[];
  config: StoreConfig;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [benchmark, setBenchmark] = useState("");
  const [agree, setAgree] = useState(false);

  if (!open) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const itemsList = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} (${item.qty}x) - ${formatRupiah(item.price * item.qty)}`
      )
      .join("\n");

    const message =
      `*PESANAN BARU VIA LANDING PAGE COD - ${config.storeName.toUpperCase()}*\n\n` +
      `*Data Penerima:* \n` +
      `- Nama: ${name}\n` +
      `- No WA: ${phone}\n` +
      `- Kecamatan/Kota: ${city}\n` +
      `- Alamat Lengkap: ${address}\n` +
      `- Patokan Rumah: ${benchmark}\n\n` +
      `*Rincian Produk:* \n${itemsList}\n\n` +
      `*Subtotal:* ${formatRupiah(total)}\n` +
      `*Metode Pembayaran:* COD (Bayar Tunai di Tempat ke Kurir)\n\n` +
      `Saya menyatakan data alamat di atas sudah benar & siap melakukan pembayaran tunai saat paket tiba. Mohon diproses kak!`;

    window.open(
      `https://wa.me/${config.whatsappApiFormat}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-panel relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-700 p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-5 right-5 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
          <PackageCheck className="h-5 w-5 text-emerald-400" /> Form Alamat COD
        </h3>
        <p className="mb-6 text-xs text-gray-400">
          Lengkapi data agar pengiriman kurir presisi dan cepat sampai.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-300">
              Nama Penerima *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-300">
              Nomor WhatsApp Aktif *
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-300">
              Alamat Jalan / No. Rumah / RT RW *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Mawar No. 12, RT 03 / RW 02..."
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300">
                Kecamatan & Kota *
              </label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kec. Gambir, Jakarta Pusat"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300">
                Patokan Rumah (Penting) *
              </label>
              <input
                required
                value={benchmark}
                onChange={(e) => setBenchmark(e.target.value)}
                placeholder="Depan Masjid / Pagar Hijau"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-gray-800 bg-gray-900 p-3">
            <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-300">
              <input
                required
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>
                Saya siap berada di lokasi dan menyiapkan uang pas pembayaran saat kurir sampai.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-500"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>Kirim Pesanan ke CS WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}
