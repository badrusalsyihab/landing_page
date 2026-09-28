"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckSquare } from "lucide-react";
import type { Product, StoreConfig } from "@/lib/types";
import type { ShippingOption } from "@/lib/shipping";
import { calcCodFee, formatRupiah } from "@/lib/format";
import WhatsAppIcon from "./WhatsAppIcon";

export default function CodCalculatorSection({
  products,
  config,
  shippingOptions,
}: {
  products: Product[];
  config: StoreConfig;
  shippingOptions: ShippingOption[];
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [shippingId, setShippingId] = useState(shippingOptions[0]?.id ?? "");

  const product = useMemo(
    () => products.find((p) => p.id === productId) ?? products[0],
    [products, productId]
  );
  const shipping = useMemo(
    () => shippingOptions.find((s) => s.id === shippingId) ?? shippingOptions[0],
    [shippingOptions, shippingId]
  );

  const codFee = calcCodFee(product.price, config.codFeePercentage);
  const total = product.price + shipping.fee + codFee;

  function handleOrder() {
    const message =
      `*SIMULASI PESANAN COD (KALKULATOR)*\n\n` +
      `Produk: ${product.name}\n` +
      `Kota Tujuan: ${shipping.label}\n` +
      `Ongkir: ${formatRupiah(shipping.fee)} (${shipping.eta})\n` +
      `Biaya COD (${config.codFeePercentage}%): ${formatRupiah(codFee)}\n` +
      `Total Bayar COD: ${formatRupiah(total)}\n\n` +
      `Saya berminat pesan dengan rincian kalkulasi di atas. Mohon bantu kirimkan format alamat lengkapnya kak!`;

    window.open(
      `https://wa.me/${config.whatsappApiFormat}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-5">
        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
          <Calculator className="mr-1 inline h-3.5 w-3.5" /> Fitur Transparansi Harga
        </span>
        <h2 className="text-3xl font-extrabold text-white">Kalkulator Estimasi Biaya COD</h2>
        <p className="text-sm leading-relaxed text-gray-300">
          Hitung rincian ongkir dan total bayar di tempat sebelum memesan. Transparan tanpa biaya
          tersembunyi!
        </p>

        <div className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/80 p-3 text-xs text-gray-300">
          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <div>
            <span className="font-bold text-white">Syarat Wajib COD:</span>
            <p className="text-gray-400">
              Verifikasi WhatsApp aktif, ada penerima di lokasi, dan menyiapkan uang pas saat
              kurir datang.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-gray-700 p-6 shadow-2xl lg:col-span-7 sm:p-8">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                Pilih Tipe Smartphone
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatRupiah(p.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                Kota Tujuan Pengiriman
              </label>
              <select
                value={shippingId}
                onChange={(e) => setShippingId(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              >
                {shippingOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} (Ongkir: {formatRupiah(s.fee)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2 space-y-2 rounded-2xl border border-gray-800 bg-gray-900/90 p-5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Harga Produk:</span>
              <span className="font-semibold text-white">{formatRupiah(product.price)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Ongkos Kirim COD:</span>
              <span className="font-semibold text-white">{formatRupiah(shipping.fee)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Biaya Penanganan (Handling {config.codFeePercentage}%):</span>
              <span className="font-semibold text-white">{formatRupiah(codFee)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Estimasi Paket Tiba:</span>
              <span className="font-semibold text-cyan-400">
                {shipping.eta} ({shipping.label})
              </span>
            </div>
            <hr className="my-2 border-gray-800" />
            <div className="flex justify-between text-base font-extrabold text-white">
              <span>Total Bayar ke Kurir:</span>
              <span className="text-lg text-cyan-400">{formatRupiah(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>Pesan via WA Berdasarkan Simulasi Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
}
