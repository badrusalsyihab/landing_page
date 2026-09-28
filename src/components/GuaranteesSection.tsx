import { Award, HandCoins, Headphones, PackageCheck } from "lucide-react";

const GUARANTEES = [
  {
    icon: Award,
    color: "bg-indigo-500/10 text-indigo-400",
    title: "100% Brand New In Box",
    description: "HP segel pabrik resmi (iBox, SEIN, TAM) garansi 1 tahun penuh.",
  },
  {
    icon: HandCoins,
    color: "bg-emerald-500/10 text-emerald-400",
    title: "Tanpa DP (Bisa COD)",
    description: "Pesan tanpa transfer uang muka. Bayar tunai penuh ke kurir saat paket sampai.",
  },
  {
    icon: PackageCheck,
    color: "bg-cyan-500/10 text-cyan-400",
    title: "Packing Kayu & Bubble",
    description: "Pengiriman diasuransikan dengan proteksi berlapis tahan benturan.",
  },
  {
    icon: Headphones,
    color: "bg-amber-500/10 text-amber-400",
    title: "CS Verifikasi Ramah",
    description: "Tim kami membantu verifikasi alamat & patokan lokasi agar pengiriman lancar.",
  },
];

export default function GuaranteesSection() {
  return (
    <div>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-white">Komitmen Layanan GadgetZone</h2>
        <p className="mt-1 text-sm text-gray-400">
          Jaminan keamanan penuh untuk kenyamanan belanja online Anda.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {GUARANTEES.map(({ icon: Icon, color, title, description }) => (
          <div key={title} className="glass-card rounded-2xl border border-gray-800 p-6">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
