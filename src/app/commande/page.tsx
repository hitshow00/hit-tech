import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary } from "@/lib/cart";
import { getShippingCities } from "@/lib/catalog";
import { CheckoutClient } from "@/components/CheckoutClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Commande | Hit Tech",
  description: "Finalisation de votre commande d'équipements technologiques.",
};

export default async function CommandePage() {
  const { user } = await getCurrentUser();
  const [cartSummary, cities, userAddress] = await Promise.all([
    getCartSummary(user?.id),
    getShippingCities(),
    user
      ? prisma.address.findFirst({
          where: { userId: user.id },
          orderBy: { isDefault: "desc" },
        })
      : null,
  ]);

  const userProfile = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: userAddress,
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <Link href="/panier" className="hover:text-white transition-colors">
          Panier
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-zinc-300">Commande</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Finaliser la Commande
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Vérifiez vos coordonnées et validez votre règlement.
        </p>
      </div>

      <CheckoutClient
        initialCart={cartSummary}
        cities={cities}
        userProfile={userProfile}
      />
    </div>
  );
}
