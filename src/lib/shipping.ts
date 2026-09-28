export type ShippingOption = {
  id: string;
  label: string;
  fee: number;
  eta: string;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "jabodetabek", label: "Jabodetabek", fee: 22000, eta: "1-2 Hari" },
  { id: "bandung", label: "Bandung", fee: 28000, eta: "1-2 Hari" },
  { id: "surabaya", label: "Surabaya & Jawa Timur", fee: 35000, eta: "2-3 Hari" },
  { id: "semarang", label: "Semarang & Jawa Tengah", fee: 32000, eta: "2-3 Hari" },
  { id: "medan", label: "Medan & Sumatra", fee: 45000, eta: "3-4 Hari" },
  { id: "makassar", label: "Makassar & Sulawesi", fee: 50000, eta: "3-4 Hari" },
  { id: "lainnya", label: "Kota Lainnya", fee: 42000, eta: "2-4 Hari" },
];
