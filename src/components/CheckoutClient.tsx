"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { createOrderAction } from "@/actions/order";
import {
  CreditCard,
  Lock,
  Loader2,
  ArrowRight,
  Banknote,
} from "lucide-react";

interface CityOption {
  id: string;
  name: string;
  slug: string;
  fee: number;
  minDays: number;
  maxDays: number;
  codAvailable: boolean;
}

interface CheckoutClientProps {
  initialCart: {
    items: Array<{
      id: string;
      productId: string;
      name: string;
      slug: string;
      sku: string;
      imageUrl: string | null;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }>;
    itemCount: number;
    subtotal: number;
    discountCode: string | null;
    discountTotal: number;
    grandTotal: number;
  } | null;
  cities: CityOption[];
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    address?: {
      line1: string;
      line2?: string | null;
      city: string;
      postalCode?: string | null;
    } | null;
  } | null;
}

export function CheckoutClient({
  initialCart,
  cities,
  userProfile,
}: CheckoutClientProps) {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState(
    userProfile?.firstName
      ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
      : ""
  );
  const [email, setEmail] = useState(userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [cityId, setCityId] = useState(cities[0]?.id || "");
  const [addressLine1, setAddressLine1] = useState(userProfile?.address?.line1 || "");
  const [addressLine2, setAddressLine2] = useState(userProfile?.address?.line2 || "");
  const [postalCode, setPostalCode] = useState(userProfile?.address?.postalCode || "");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!initialCart || initialCart.items.length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-950 p-12 text-center max-w-md mx-auto my-12 border border-zinc-900">
        <h2 className="text-xl font-bold text-white mb-2">Votre panier est vide</h2>
        <p className="text-xs text-zinc-500 mb-6">
          Veuillez ajouter des articles avant de finaliser la commande.
        </p>
        <Link
          href="/boutique"
          className="px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all inline-flex items-center gap-2"
        >
          <span>Boutique</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const selectedCity = cities.find((c) => c.id === cityId) || cities[0];
  const isFreeShipping = initialCart.subtotal >= 50000;
  const shippingFee = isFreeShipping ? 0 : selectedCity?.fee || 3500;
  const finalTotal = Math.max(0, initialCart.subtotal - initialCart.discountTotal + shippingFee);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const res = await createOrderAction({
      fullName,
      email,
      phone,
      cityId,
      addressLine1,
      addressLine2: addressLine2 || undefined,
      postalCode: postalCode || undefined,
      customerNote: customerNote || undefined,
      paymentMethod,
    });

    setLoading(false);

    if (res.success && res.orderNumber) {
      router.push(`/confirmation/${res.orderNumber}`);
    } else {
      setError(res.error || "Une erreur est survenue lors de la création de la commande.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Colonne Gauche : Coordonnées, Adresse & Règlement ── */}
      <div className="lg:col-span-7 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs">
            {error}
          </div>
        )}

        {/* 1. Coordonnées */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Informations Personnelles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Prénom et Nom"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Adresse email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 ..."
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Adresse de livraison */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Adresse de Livraison
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Ville de destination *
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {isFreeShipping ? "(Livraison offerte)" : `(${formatPrice(c.fee)})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Adresse postale *
              </label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Rue, numéro, bâtiment, appartement"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Complément d&apos;adresse
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Étage, code d'accès (optionnel)"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Code postal (optionnel)"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Instructions particulières
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Notes concernant la réception du colis..."
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Règlement */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Mode de Règlement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                paymentMethod === "COD"
                  ? "bg-zinc-900 border-white text-white"
                  : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-white" />
                  <span className="font-bold text-xs text-white">Paiement à la livraison</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-white"
                />
              </div>
              <p className="text-[11px] text-zinc-400">
                Règlement au transporteur lors de la remise du colis.
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                paymentMethod === "STRIPE"
                  ? "bg-zinc-900 border-white text-white"
                  : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-white" />
                  <span className="font-bold text-xs text-white">Carte Bancaire</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "STRIPE"}
                  onChange={() => setPaymentMethod("STRIPE")}
                  className="accent-white"
                />
              </div>
              <p className="text-[11px] text-zinc-400">
                Paiement direct sécurisé via carte bancaire.
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* ── Colonne Droite : Récapitulatif et Validation ── */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-5">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">
            Commande ({initialCart.itemCount} articles)
          </h3>

          {/* Liste des articles */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-zinc-900">
            {initialCart.items.map((item) => (
              <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-black border border-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {item.quantity}×
                  </span>
                  <span className="text-zinc-300 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-white shrink-0">
                  {formatPrice(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Lignes de calcul */}
          <div className="space-y-2 pt-4 border-t border-zinc-900 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Sous-total</span>
              <span className="font-semibold text-white">{formatPrice(initialCart.subtotal)}</span>
            </div>

            {initialCart.discountTotal > 0 && (
              <div className="flex justify-between text-zinc-300">
                <span>Remise</span>
                <span className="font-bold">-{formatPrice(initialCart.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400">
              <span>Livraison</span>
              <span className="font-semibold text-white">
                {shippingFee === 0 ? "Offerte" : formatPrice(shippingFee)}
              </span>
            </div>
          </div>

          {/* Total final */}
          <div className="pt-4 border-t border-zinc-900 flex items-baseline justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total à régler
            </span>
            <span className="text-2xl font-black text-white">
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Valider la commande</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
