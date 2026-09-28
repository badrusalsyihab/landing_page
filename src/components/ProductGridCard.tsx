"use client";

import { Cpu, Eye, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default function ProductGridCard({
  product,
  onOpenDetail,
  onAddToCart,
}: {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 transition-all duration-300 hover:border-cyan-500/40">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x400/111827/06B6D4?text=${encodeURIComponent(
              product.name
            )}`;
          }}
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow ${product.badgeColor ?? "bg-cyan-600"}`}
          >
            {product.badge}
          </span>
        )}

        {product.officialGaransi && (
          <span className="absolute right-3 bottom-3 rounded-lg border border-gray-700 bg-gray-900/90 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 backdrop-blur">
            {product.officialGaransi}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-gray-400">
            <span className="text-cyan-400 uppercase tracking-wider">{product.brand}</span>
          </div>
          <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-cyan-400">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 flex items-center gap-1 text-xs text-gray-400">
            <Cpu className="h-3 w-3 text-indigo-400" /> {product.specs.ramStorage} &middot;{" "}
            {product.specs.chipset}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-800/80 pt-4">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-white">{formatRupiah(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetail(product)}
              className="flex items-center justify-center gap-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
            >
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span>Detail Spesifikasi</span>
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-emerald-500"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>+ Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
