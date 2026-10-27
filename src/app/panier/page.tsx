import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";
import { CartClient } from "@/components/CartClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Panier | Hit Tech",
  description: "Consultez et gérez vos articles sélectionnés chez Hit Tech.",
};

export default async function PanierPage() {
  let cartSummary = null;
  try {
    const { user } = await getCurrentUser();
    cartSummary = await getCartSummary(user?.id);
  } catch (e) {
    // Silently fall back
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-zinc-300">Panier</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Panier d&apos;achat
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Vérifiez vos articles avant de procéder au règlement.
        </p>
      </div>

      <CartClient initialCart={cartSummary} />
    </div>
  );
}
