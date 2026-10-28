"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloating() {
  const pathname = usePathname();

  // Ne pas afficher sur les pages d'administration
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const phone = "212661234567";
  const defaultMessage = encodeURIComponent(
    "Salam ! Je vous contacte depuis le site Hit Tech, j'ai une question concernant un produit ou une commande."
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMessage}`;

  return (
    <aside aria-label="Support client WhatsApp" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip au survol */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold border border-zinc-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Besoin d&apos;aide ? Écrivez-nous sur WhatsApp
      </span>

      {/* Bouton Flottant Vert WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        title="Discuter sur WhatsApp"
        aria-label="Discuter avec l'équipe Hit Tech sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        {/* Pulsation subtile */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full" />
      </a>
    </aside>
  );
}
