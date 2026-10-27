"use client";

import { useState } from "react";
import { addToCartAction } from "@/actions/cart";
import { ShoppingBag, Check, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({
  productId,
  stock,
  className = "",
  compact = false,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOutOfStock = stock <= 0;

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || loading) return;

    setLoading(true);
    setError(null);

    const res = await addToCartAction(productId, 1);
    setLoading(false);

    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } else {
      setError(res.error || "Erreur");
      setTimeout(() => setError(null), 3000);
    }
  }

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`px-3 py-1.5 rounded-md bg-zinc-950 text-zinc-600 text-xs font-medium cursor-not-allowed border border-zinc-900 ${className}`}
      >
        Épuisé
      </button>
    );
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-xs transition-all ${
          added
            ? "bg-zinc-800 text-white border border-zinc-700"
            : "btn-theme-primary active:scale-95 shadow-sm"
        } ${compact ? "px-3 py-1.5" : "px-5 py-2.5"} ${className}`}
        aria-label="Ajouter au panier"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : added ? (
          <>
            <Check className="w-3.5 h-3.5" />
            {!compact && <span>Ajouté</span>}
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            {!compact && <span>Ajouter au panier</span>}
          </>
        )}
      </button>

      {error && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-30 px-2 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] rounded shadow-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
