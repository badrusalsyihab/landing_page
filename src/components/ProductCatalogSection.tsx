"use client";

import { useMemo, useState } from "react";
import { Search, SmartphoneNfc } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import ProductGridCard from "./ProductGridCard";

type SortOption = "popular" | "price-low" | "price-high" | "discount";

export default function ProductCatalogSection({
  products,
  onOpenDetail,
  onAddToCart,
}: {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  const priceFloor = Math.min(...products.map((p) => p.price));
  const priceCeiling = Math.max(...products.map((p) => p.price));
  const brands = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.brand)))],
    [products]
  );

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [sort, setSort] = useState<SortOption>("popular");
  const [brand, setBrand] = useState("Semua");
  const [codOnly, setCodOnly] = useState(false);
  const [promoOnly, setPromoOnly] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    let result = products.filter((p) => {
      const matchesBrand = brand === "Semua" || p.brand === brand;
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.specs.chipset.toLowerCase().includes(query);
      const matchesPrice = p.price <= maxPrice;
      const matchesCod = !codOnly || p.codSupported;
      const matchesPromo = !promoOnly || p.originalPrice > p.price;
      return matchesBrand && matchesSearch && matchesPrice && matchesCod && matchesPromo;
    });

    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "discount")
      result = [...result].sort(
        (a, b) => b.originalPrice - b.price - (a.originalPrice - a.price)
      );

    return result;
  }, [products, search, maxPrice, sort, brand, codOnly, promoOnly]);

  function resetFilters() {
    setSearch("");
    setMaxPrice(priceCeiling);
    setSort("popular");
    setBrand("Semua");
    setCodOnly(false);
    setPromoOnly(false);
  }

  return (
    <div>
      <div className="glass-panel mb-8 space-y-4 rounded-2xl border border-gray-800 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama HP, brand, atau chipset (mis: Snapdragon, iPhone)..."
              className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pr-4 pl-11 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col justify-center px-2 md:col-span-4">
            <div className="mb-1 flex justify-between text-xs font-medium text-gray-300">
              <span>Maksimal Harga:</span>
              <span className="font-bold text-cyan-400">{formatRupiah(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={priceFloor}
              max={priceCeiling}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="popular">Urutkan: Terpopuler</option>
              <option value="price-low">Harga: Terendah ke Tertinggi</option>
              <option value="price-high">Harga: Tertinggi ke Terendah</option>
              <option value="discount">Diskon Terbesar</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto border-t border-gray-800/80 pt-3 pb-1">
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                brand === b
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-300">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={codOnly}
              onChange={(e) => setCodOnly(e.target.checked)}
              className="rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            Hanya Tampilkan Produk COD
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={promoOnly}
              onChange={(e) => setPromoOnly(e.target.checked)}
              className="rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            Hanya Produk Promo / Flash Sale
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-500">
            <SmartphoneNfc className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Produk Tidak Ditemukan</h3>
          <p className="mt-1 text-sm text-gray-400">
            Coba sesuaikan kata kunci pencarian atau reset filter Anda.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-gray-800 px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-gray-700"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductGridCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
