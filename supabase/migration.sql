-- ============================================================
-- Migration: Create all tables for the landing-page store
-- Run this once in Supabase SQL Editor
-- ============================================================

-- products
create table if not exists products (
  id text primary key,
  name text not null,
  brand text not null,
  price bigint not null,
  original_price bigint not null,
  stock int not null default 0,
  cod_supported boolean not null default true,
  specs jsonb not null default '{}',
  colors text[] not null default '{}',
  rating float8,
  reviews_count int,
  badge text,
  badge_color text,
  official_garansi text,
  image text,
  created_at timestamptz not null default now()
);

-- store_config (single row, id = 1)
create table if not exists store_config (
  id int primary key default 1,
  store_name text not null,
  tagline text not null,
  whatsapp_number text not null,
  whatsapp_api_format text not null,
  cod_fee_percentage float not null default 2,
  allow_cod_without_landmark boolean not null default false,
  auto_deduct_stock_on_verify boolean not null default true,
  max_cod_limit bigint not null default 25000000,
  working_hours text not null,
  address text not null
);

-- faq_items
create table if not exists faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- highlights
create table if not exists highlights (
  id text primary key,
  title text not null,
  subtitle text not null,
  sort_order int not null default 0
);

-- cod_rules
create table if not exists cod_rules (
  id serial primary key,
  rule text not null,
  sort_order int not null default 0
);

-- shipping_options
create table if not exists shipping_options (
  id text primary key,
  label text not null,
  fee int not null,
  eta text not null,
  sort_order int not null default 0
);

-- ============================================================
-- Seed data (from existing JSON files)
-- ============================================================

-- store_config
insert into store_config (id, store_name, tagline, whatsapp_number, whatsapp_api_format, cod_fee_percentage, allow_cod_without_landmark, auto_deduct_stock_on_verify, max_cod_limit, working_hours, address)
values (
  1,
  'kokomRia Cell',
  'Smartphone Original Garansi Resmi, Bisa COD Se-Indonesia',
  '085692849672',
  '6285692849672',
  2,
  false,
  true,
  25000000,
  '10:00 - 21:00 WIB',
  'ITC Cempaka Mas, Jakarta Pusat'
)
on conflict (id) do nothing;

-- products
insert into products (id, name, brand, price, original_price, stock, cod_supported, specs, colors, rating, reviews_count, badge, badge_color, official_garansi, image) values
('1', 'iPhone 15 Pro Max', 'Apple', 22999000, 24999000, 12, true,
  '{"ramStorage":"8GB / 256GB","chipset":"Apple A17 Pro (3nm)","camera":"48MP Main + 12MP Telephoto 5x","battery":"4422 mAh Fast Charging","screen":"6.7 inch Super Retina XDR OLED 120Hz"}',
  '{"Titanium Alami","Titanium Biru","Titanium Hitam"}',
  4.9, 142, 'Terlaris', 'bg-red-500', 'Garansi Resmi iBox 1 Thn',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'),

('2', 'Samsung Galaxy S24 Ultra 5G', 'Samsung', 19999000, 21999000, 8, true,
  '{"ramStorage":"12GB / 512GB","chipset":"Snapdragon 8 Gen 3 for Galaxy","battery":"5000 mAh 45W Fast Charge","camera":"200MP Quad Cam + S-Pen","screen":"6.8 inch Dynamic AMOLED 2X 120Hz"}',
  '{"Titanium Gray","Titanium Black","Titanium Yellow"}',
  4.9, 98, 'Promo COD', 'bg-indigo-600', 'Garansi Resmi SEIN',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'),

('3', 'Xiaomi 14 Leica Camera', 'Xiaomi', 11999000, 12999000, 15, true,
  '{"ramStorage":"12GB / 256GB","chipset":"Snapdragon 8 Gen 3","battery":"4610 mAh 90W HyperCharge","camera":"50MP Leica Summilux Optics","screen":"6.36 inch LTPO OLED 120Hz"}',
  '{"Black","White","Jade Green"}',
  4.8, 76, 'Flagship', 'bg-amber-500', 'Garansi Resmi TAM',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'),

('4', 'Poco F6 Pro 5G', 'Poco', 7499000, 7999000, 20, true,
  '{"ramStorage":"12GB / 512GB","chipset":"Snapdragon 8 Gen 2","battery":"5000 mAh 120W Charge","camera":"50MP Triple Cam with OIS","screen":"6.67 inch WQHD+ AMOLED 120Hz"}',
  '{"Black","White"}',
  4.7, 112, 'Gaming King', 'bg-yellow-500 text-black', 'Garansi Resmi Xiaomi Indonesia',
  'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80'),

('5', 'Infinix GT 20 Pro 5G', 'Infinix', 4399000, 4699000, 25, true,
  '{"ramStorage":"12GB / 256GB","chipset":"MediaTek Dimensity 8200 Ultimate","battery":"5000 mAh 45W Fast Charge","camera":"108MP OIS Gaming Camera","screen":"6.78 inch FHD+ AMOLED 144Hz"}',
  '{"Mecha Blue","Mecha Orange","Mecha Silver"}',
  4.7, 89, 'Best Value', 'bg-emerald-600', 'Garansi Resmi Infinix ID',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'),

('6', 'OPPO Reno11 5G', 'Oppo', 5999000, 6499000, 10, true,
  '{"ramStorage":"8GB / 256GB","chipset":"MediaTek Dimensity 7050","battery":"5000 mAh 67W SUPERVOOC","camera":"32MP Telephoto Portrait + 50MP Main","screen":"6.7 inch 3D Curved OLED 120Hz"}',
  '{"Wave Green","Rock Grey"}',
  4.8, 64, 'Portrait Expert', 'bg-cyan-600', 'Garansi Resmi OPPO',
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80'),

('7', 'Vivo V30 5G', 'Vivo', 5999000, 6299000, 14, true,
  '{"ramStorage":"12GB / 256GB","chipset":"Snapdragon 7 Gen 3","battery":"5000 mAh 80W FlashCharge","camera":"50MP AF Ultra-Wide + Aura Light","screen":"6.78 inch AMOLED 1.5K 120Hz"}',
  '{"Hijau Khatulistiwa","Hitam Vulkanik"}',
  4.8, 52, 'Aura Light', 'bg-indigo-500', 'Garansi Resmi Vivo ID',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80'),

('8', 'Realme 12 Pro+ 5G', 'Realme', 6999000, 7499000, 9, true,
  '{"ramStorage":"12GB / 512GB","chipset":"Snapdragon 7s Gen 2","battery":"5000 mAh 67W SUPERVOOC","camera":"64MP Periscope Portrait + 50MP Sony IMX890","screen":"6.7 inch OLED Curved Display"}',
  '{"Submarine Blue","Navigator Beige"}',
  4.7, 43, 'Periscope Zoom', 'bg-amber-600', 'Garansi Resmi Realme',
  'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80'),

('12123', 'iphone new yang lipat', 'iphone', 3000000000, 340430, 34, true,
  '{"ramStorage":"12","chipset":"fi","camera":"swews","battery":"23","screen":"sdsd"}',
  '{"blck"}',
  null, null, null, null, null,
  'https://cms.disway.id/uploads/40749a53657626464b15e43aecf97442.jpg')

on conflict (id) do nothing;

-- faq_items
insert into faq_items (id, question, answer, sort_order) values
('faq-1', 'Bagaimana cara kerja pembelian HP secara COD?',
  'Anda cukup memilih HP, mengisi data alamat beserta patokan rumah. Tim CS kami akan melakukan konfirmasi via WhatsApp. Setelah terverifikasi, barang dikirim dan Anda cukup membayarkan uang pas tunai kepada kurir saat barang sampai.',
  0),
('faq-2', 'Apakah IMEI HP terdaftar resmi di Kemenperin?',
  'Ya, 100% terdaftar resmi Kemenperin/Beacukai. Semua unit bergaransi resmi Indonesia (SEIN, iBox, TAM, OPPO, Vivo, Poco, Infinix). Signal aman selamanya!',
  1),
('faq-3', 'Berapa biaya penanganan COD (handling fee)?',
  'Biaya penanganan COD adalah 2% dari harga produk untuk menutup biaya asuransi pengiriman dari pihak ekspedisi mitra (JNT/Sicepat/Shopee Express).',
  2)
on conflict (id) do nothing;

-- highlights
insert into highlights (id, title, subtitle, sort_order) values
('highlight-1', '100% Original', 'BNIB Resmi Indonesia', 0),
('highlight-2', 'Bisa COD', 'Jangkauan Seluruh Kota', 1),
('highlight-3', '1 Tahun', 'Garansi Resmi Toko & Brand', 2)
on conflict (id) do nothing;

-- cod_rules
insert into cod_rules (rule, sort_order) values
('Pesanan tidak diproses jika tidak ada patokan alamat yang jelas.', 0),
('Biaya layanan COD 2% dari harga produk (di luar ongkir).', 1),
('Segel/dus baru dibuka setelah pembayaran diserahkan ke kurir.', 2),
('COD berlaku untuk transaksi hingga Rp25.000.000, di atas itu wajib transfer bank.', 3);

-- shipping_options
insert into shipping_options (id, label, fee, eta, sort_order) values
('jabodetabek', 'Jabodetabek', 22000, '1-2 Hari', 0),
('bandung', 'Bandung', 28000, '1-2 Hari', 1),
('surabaya', 'Surabaya & Jawa Timur', 35000, '2-3 Hari', 2),
('semarang', 'Semarang & Jawa Tengah', 32000, '2-3 Hari', 3),
('medan', 'Medan & Sumatra', 45000, '3-4 Hari', 4),
('makassar', 'Makassar & Sulawesi', 50000, '3-4 Hari', 5),
('lainnya', 'Kota Lainnya', 42000, '2-4 Hari', 6),
('kota-1790617721830', 'Lampung', 40000, '2-4 Hari', 7)
on conflict (id) do nothing;
