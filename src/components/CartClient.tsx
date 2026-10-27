"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import {
  updateCartItemQuantityAction,
  removeCartItemAction,
  applyDiscountCodeAction,
} from "@/actions/cart";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";

interface CartClientProps {
  initialCart: {
    id: string;
    items: Array<{
      id: string;
      productId: string;
      name: string;
      slug: string;
      sku: string;
      imageUrl: string | null;
      unitPrice: number;
      quantity: number;
      stock: number;
      lineTotal: number;
    }>;
    itemCount: number;
    subtotal: number;
    discountCode: string | null;
    discountTotal: number;
    shippingFee: number;
    freeShippingThreshold: number | null;
    qualifiesForFreeShipping: boolean;
    amountNeededForFreeShipping: number;
    grandTotal: number;
  } | null;
}

export function CartClient({ initialCart }: CartClientProps) {
  const [cart, setCart] = useState(initialCart);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState(initialCart?.discountCode || "");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  async function handleQuantityChange(itemId: string, newQty: number) {
    if (updatingId || newQty < 0) return;
    setUpdatingId(itemId);
    const res = await updateCartItemQuantityAction(itemId, newQty);
    setUpdatingId(null);
    if (res.success && cart) {
      if (newQty === 0) {
        const newItems = cart.items.filter((i) => i.id !== itemId);
        const newSubtotal = newItems.reduce((acc, i) => acc + i.lineTotal, 0);
        setCart({
          ...cart,
          items: newItems,
          itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
          subtotal: newSubtotal,
          grandTotal: Math.max(0, newSubtotal - cart.discountTotal),
        });
      } else {
        const newItems = cart.items.map((i) =>
          i.id === itemId
            ? { ...i, quantity: newQty, lineTotal: i.unitPrice * newQty }
            : i
        );
        const newSubtotal = newItems.reduce((acc, i) => acc + i.lineTotal, 0);
        setCart({
          ...cart,
          items: newItems,
          itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
          subtotal: newSubtotal,
          grandTotal: Math.max(0, newSubtotal - cart.discountTotal),
        });
      }
    }
  }

  async function handleRemove(itemId: string) {
    if (updatingId) return;
    setUpdatingId(itemId);
    const res = await removeCartItemAction(itemId);
    setUpdatingId(null);
    if (res.success && cart) {
      const newItems = cart.items.filter((i) => i.id !== itemId);
      const newSubtotal = newItems.reduce((acc, i) => acc + i.lineTotal, 0);
      setCart({
        ...cart,
        items: newItems,
        itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: newSubtotal,
        grandTotal: Math.max(0, newSubtotal - cart.discountTotal),
      });
    }
  }

  async function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    if (promoLoading) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromoSuccess(null);

    const res = await applyDiscountCodeAction(promoInput);
    setPromoLoading(false);
    if (res.success) {
      setPromoSuccess(res.message || "Code appliqué");
      setTimeout(() => window.location.reload(), 600);
    } else {
      setPromoError(res.error || "Code promo invalide");
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-950 p-12 text-center max-w-md mx-auto my-12 border border-zinc-900 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Votre panier est vide</h2>
          <p className="text-xs text-zinc-500">
            Explorez notre sélection pour découvrir les derniers équipements.
          </p>
        </div>
        <Link
          href="/boutique"
          className="px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          <span>Découvrir le catalogue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Liste des articles ── */}
      <div className="lg:col-span-8 space-y-4">
        {/* Tableau des articles */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 divide-y divide-zinc-900 overflow-hidden">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-black border border-zinc-800 p-2 shrink-0 flex items-center justify-center">
                <Image
                  src={item.imageUrl || "/placeholder-product.webp"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link
                  href={`/produit/${item.slug}`}
                  className="font-bold text-white text-sm hover:text-zinc-300 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <span className="text-[11px] text-zinc-500 block mt-0.5">Réf : {item.sku}</span>
                <span className="text-xs font-semibold text-zinc-300 mt-1 block">
                  {formatPrice(item.unitPrice)}
                </span>
              </div>

              {/* Sélecteur de quantité monochrome */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg bg-black border border-zinc-800 p-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={updatingId === item.id}
                    className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={updatingId === item.id || item.quantity >= item.stock}
                    className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <span className="text-sm font-bold text-white block">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  disabled={updatingId === item.id}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                  aria-label="Supprimer cet article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Récapitulatif commande monochrome ── */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-5">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">
            Récapitulatif
          </h3>

          {/* Formulaire code promo */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Code privilège"
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 uppercase"
              />
              <button
                type="submit"
                disabled={promoLoading}
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-800 transition-colors"
              >
                {promoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Appliquer"}
              </button>
            </div>
            {promoError && <p className="text-[11px] text-zinc-400">{promoError}</p>}
            {promoSuccess && <p className="text-[11px] text-zinc-300">{promoSuccess}</p>}
          </form>

          {/* Lignes de calcul */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-900 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Articles ({cart.itemCount})</span>
              <span className="font-semibold text-white">{formatPrice(cart.subtotal)}</span>
            </div>

            {cart.discountTotal > 0 && (
              <div className="flex justify-between text-zinc-300">
                <span>Remise</span>
                <span className="font-bold">-{formatPrice(cart.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400">
              <span>Livraison</span>
              <span className="font-semibold text-white">Calculée à l&apos;étape suivante</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex items-baseline justify-between">
            <div>
              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Total estimé
              </span>
            </div>
            <span className="text-xl font-black text-white">
              {formatPrice(cart.grandTotal)}
            </span>
          </div>

          <Link
            href="/commande"
            className="w-full py-3 px-4 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Commander</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
