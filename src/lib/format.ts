import type { Product, StoreConfig } from "./types";

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calcCodFee(price: number, feePercentage: number): number {
  return Math.round((price * feePercentage) / 100);
}

export function buildOrderWhatsAppLink(product: Product, config: StoreConfig): string {
  const fee = calcCodFee(product.price, config.codFeePercentage);
  const message = [
    `Halo ${config.storeName}, saya mau pesan:`,
    `- ${product.name} (${formatRupiah(product.price)})`,
    `Metode: COD (biaya layanan ${config.codFeePercentage}% = ${formatRupiah(fee)})`,
    `Mohon info kelanjutannya ya. Terima kasih!`,
  ].join("\n");

  return `https://wa.me/${config.whatsappApiFormat}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(config: StoreConfig): string {
  const message = `Halo ${config.storeName}, saya mau tanya-tanya soal produk.`;
  return `https://wa.me/${config.whatsappApiFormat}?text=${encodeURIComponent(message)}`;
}
