"use client";

import { useState } from "react";
import { Calculator, Menu, ShieldCheck, ShoppingCart, Smartphone, Truck, X } from "lucide-react";
import type { CartItem, FaqItem, HighlightItem, Product, StoreConfig } from "@/lib/types";
import type { ShippingOption } from "@/lib/shipping";
import { buildGeneralWhatsAppLink } from "@/lib/format";
import WhatsAppIcon from "./WhatsAppIcon";
import ProductCatalogSection from "./ProductCatalogSection";
import CodCalculatorSection from "./CodCalculatorSection";
import GuaranteesSection from "./GuaranteesSection";
import FaqSection from "./FaqSection";
import CartDrawer from "./CartDrawer";
import ProductDetailModal from "./ProductDetailModal";
import CheckoutModal from "./CheckoutModal";

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#produk", label: "Katalog HP" },
  { href: "#kalkulator-cod", label: "Simulasi COD" },
  { href: "#keunggulan", label: "Garansi & Layanan" },
  { href: "#faq", label: "FAQ COD" },
];

export default function Storefront({
  products,
  config,
  rules,
  faqItems,
  highlights,
  shippingOptions,
}: {
  products: Product[];
  config: StoreConfig;
  rules: string[];
  faqItems: FaqItem[];
  highlights: HighlightItem[];
  shippingOptions: ShippingOption[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const waLink = buildGeneralWhatsAppLink(config);
  const cartQty = cart.reduce((acc, item) => acc + item.qty, 0);

  function handleAddToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function handleUpdateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function handleCheckout() {
    if (cart.length === 0) {
      alert("Keranjang belanja Anda masih kosong!");
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  return (
    <div className="storefront flex min-h-screen flex-col font-sans antialiased">
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-800">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#beranda" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xl font-black text-white shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
                {config.storeName.split(" ")[0]}{" "}
                <span className="text-cyan-400">
                  {config.storeName.split(" ").slice(1).join(" ")}
                </span>
              </span>
              <span className="-mt-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Official COD Store
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl border border-gray-700 bg-gray-800/80 p-2.5 text-gray-200 transition-colors hover:bg-gray-700"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950 shadow">
                {cartQty}
              </span>
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 sm:flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>CS Online</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-xl bg-gray-800 p-2.5 text-gray-300 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="glass-panel space-y-2 border-t border-gray-800 px-4 py-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <section id="beranda" className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24">
          <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/3 right-10 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 sm:text-sm">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <ShieldCheck className="h-4 w-4 text-cyan-400" /> Distributor Smartphone Resmi
                  Indonesia
                </div>

                <h1 className="text-4xl leading-tight font-black text-white sm:text-5xl lg:text-6xl">
                  Pusat Smartphone Original, <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Bayar Pas Paket Sampai (COD)!
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg lg:mx-0">
                  Nikmati kenyamanan belanja iPhone, Samsung, Xiaomi, Poco, Infinix &amp; brand
                  ternama. 100% Garansi Resmi Distributor dengan layanan Cash on Delivery (COD)
                  nasional.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
                  <a
                    href="#produk"
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] sm:w-auto"
                  >
                    <Smartphone className="h-5 w-5" />
                    <span>Jelajahi Katalog HP</span>
                  </a>
                  <a
                    href="#kalkulator-cod"
                    className="glass-card flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-gray-800 sm:w-auto"
                  >
                    <Calculator className="h-5 w-5 text-cyan-400" />
                    <span>Hitung Biaya COD</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div key={item.id}>
                      <p className="text-xl font-black text-white sm:text-2xl">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex justify-center lg:col-span-5">
                <div className="relative w-full max-w-md">
                  <div className="glass-panel neon-glow-cyan relative rounded-3xl border border-gray-700 p-3 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
                      alt="Latest Phone Showcase"
                      className="h-[400px] w-full rounded-2xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x800/111827/06B6D4?text=Smartphone+Garansi+Resmi";
                      }}
                    />
                  </div>

                  <div className="glass-panel animate-float absolute -top-5 -left-5 flex items-center gap-3 rounded-2xl border border-gray-700 p-3.5 shadow-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Layanan COD Cepat</p>
                      <p className="text-[10px] text-gray-400">Aman Tanpa Transfer Dulu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="produk" className="relative py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                Katalog Pilihan
              </span>
              <h2 className="mt-1 text-3xl font-extrabold text-white">
                Cari Smartphone Impian Anda
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Gunakan filter di bawah untuk menemukan tipe HP, harga, dan metode pembayaran
                sesuai keinginan.
              </p>
            </div>

            <ProductCatalogSection
              products={products}
              onOpenDetail={setDetailProduct}
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>

        <section
          id="kalkulator-cod"
          className="border-y border-gray-800 bg-slate-900/60 py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CodCalculatorSection
              products={products}
              config={config}
              shippingOptions={shippingOptions}
            />
          </div>
        </section>

        <section id="keunggulan" className="relative py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GuaranteesSection />
          </div>
        </section>

        <section id="syarat-cod" className="border-y border-gray-800 bg-slate-900/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold text-white">Syarat &amp; Ketentuan COD</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rules.map((rule) => (
                <div
                  key={rule}
                  className="glass-panel rounded-2xl border border-gray-800 p-4 text-sm text-gray-300"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-gray-800 bg-slate-900/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FaqSection items={faqItems} />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 sm:text-left lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-800 pb-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-white">
                <Smartphone className="h-4 w-4" />
              </div>
              <span className="text-xl font-extrabold text-white">
                {config.storeName.split(" ")[0]}{" "}
                <span className="text-cyan-400">
                  {config.storeName.split(" ").slice(1).join(" ")}
                </span>
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Toko HP Online Resmi Terpercaya dengan Fitur Bayar di Tempat (COD) Seluruh
              Indonesia.
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-gray-500 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} {config.storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onCheckout={handleCheckout}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        config={config}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
