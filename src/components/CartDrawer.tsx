"use client";

import { PackageOpen, ShoppingCart, X } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default function CartDrawer({
  open,
  cart,
  onClose,
  onUpdateQty,
  onCheckout,
}: {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}) {
  if (!open) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-gray-800 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <ShoppingCart className="h-5 w-5 text-cyan-400" /> Keranjang Belanja
          </h3>
          <button onClick={onClose} aria-label="Tutup" className="p-2 text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <PackageOpen className="mx-auto mb-3 h-10 w-10" />
              <p className="text-sm">Keranjang Anda masih kosong.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-gray-800/60 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100/111827/06B6D4?text=HP";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-xs font-semibold text-cyan-400">
                    {formatRupiah(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 p-1">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="flex h-6 w-6 items-center justify-center text-xs text-gray-300"
                  >
                    -
                  </button>
                  <span className="px-1 text-xs font-bold text-white">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="flex h-6 w-6 items-center justify-center text-xs text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 border-t border-gray-800 bg-slate-950/80 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Subtotal Produk</span>
            <span className="text-lg font-extrabold text-cyan-400">
              {formatRupiah(subtotal)}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-95"
          >
            Lanjut Konfirmasi COD
          </button>
        </div>
      </div>
    </div>
  );
}
