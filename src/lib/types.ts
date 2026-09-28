export type ProductSpecs = {
  ramStorage: string;
  chipset: string;
  camera: string;
  battery: string;
  screen: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  codSupported: boolean;
  specs: ProductSpecs;
  colors: string[];
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  badgeColor?: string;
  officialGaransi?: string;
  image?: string;
};

export type CartItem = Product & { qty: number };

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type StoreConfig = {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappApiFormat: string;
  codFeePercentage: number;
  allowCodWithoutLandmark: boolean;
  autoDeductStockOnVerify: boolean;
  maxCodLimit: number;
  workingHours: string;
  address: string;
};
