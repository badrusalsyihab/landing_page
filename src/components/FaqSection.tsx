import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/types";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-white">Pertanyaan Sering Diajukan (FAQ)</h2>
        <p className="mt-1 text-sm text-gray-400">
          Informasi lengkap seputar pembelian HP metode COD.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((faq) => (
          <details key={faq.id} className="glass-panel group rounded-2xl border border-gray-800 p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white sm:text-base">
              <span>{faq.question}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-cyan-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
