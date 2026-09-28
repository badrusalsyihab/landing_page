"use client";

import { CheckCircle2, ShoppingCart, Star, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-700 p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-5 right-5 z-10 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full rounded-2xl border border-gray-700 object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x400/111827/06B6D4?text=${encodeURIComponent(
                  product.name
                )}`;
              }}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>
                Sisa Stok: <strong className="text-white">{product.stock} unit</strong>
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Dukung COD Nasional
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                {product.brand}
              </span>
              <h2 className="mt-0.5 text-2xl font-extrabold text-white">{product.name}</h2>
              {product.rating !== undefined && (
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" /> {product.rating} dari 5.0 (
                  {product.reviewsCount} Ulasan Pembeli)
                </p>
              )}
            </div>

            <div className="space-y-1.5 rounded-xl border border-gray-800 bg-gray-900/90 p-4 text-xs">
              <p className="text-gray-300">
                <strong className="text-gray-400">RAM/Memori:</strong> {product.specs.ramStorage}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400">Chipset:</strong> {product.specs.chipset}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400">Layar:</strong> {product.specs.screen}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400">Kamera:</strong> {product.specs.camera}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400">Baterai:</strong> {product.specs.battery}
              </p>
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-semibold text-gray-400">
                Pilihan Warna Tersedia:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-2">
              <div>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                <p className="text-xl font-black text-cyan-400">{formatRupiah(product.price)}</p>
              </div>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-500"
              >
                <ShoppingCart className="h-4 w-4" /> Beli via COD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
