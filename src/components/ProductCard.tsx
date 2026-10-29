import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { AddToCartButton } from "./AddToCartButton";
import { Star, Truck, ShieldCheck } from "lucide-react";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number; // centimes
  compareAtPrice?: number | null;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  brand?: { name: string } | null;
  category?: { name: string; slug: string } | null;
  images: Array<{
    mediumUrl?: string | null;
    url: string;
    thumbUrl?: string | null;
    alt: string;
  }>;
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const primaryImage = product.images[0];
  const imgSrc = primaryImage?.mediumUrl || primaryImage?.url || "/placeholder-product.webp";

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isFreeShipping = product.price >= 50000; // >= 500 DH au Maroc

  return (
    <article className="group relative rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 bg-[#0c0c0e] border border-zinc-850 hover:border-zinc-700 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
      {/* Badge statutaire unique en haut à gauche (Style Prestige Minimaliste) */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
        {discountPercent !== null ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-300 backdrop-blur-md shadow-sm">
            -{discountPercent}%
          </span>
        ) : product.isNew ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>2026</span>
          </span>
        ) : null}
      </div>

      {product.stock <= 0 && (
        <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-500 border border-zinc-800">
            Rupture
          </span>
        </div>
      )}

      {/* Visuel produit épuré sur plateau satiné noir */}
      <Link
        href={`/produit/${product.slug}`}
        className="block relative aspect-square overflow-hidden p-6 bg-gradient-to-b from-zinc-900/40 via-[#0c0c0e] to-black transition-colors"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={primaryImage?.alt || product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Détails du produit */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#0c0c0e] border-t border-zinc-900">
        <div>
          {/* Marque & Disponibilité */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {product.brand && (
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                {product.brand.name}
              </span>
            )}
            {product.stock > 0 ? (
              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Stock Casa</span>
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-medium">Sur commande</span>
            )}
          </div>

          <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            <Link href={`/produit/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Note & Réassurance */}
          <div className="flex items-center justify-between gap-2 mt-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-bold text-white text-xs">
                {product.ratingAvg && product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : "5.0"}
              </span>
              <span className="text-[11px] text-zinc-500">
                ({product.ratingCount ?? 14})
              </span>
            </div>

            <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
              {isFreeShipping ? (
                <>
                  <Truck className="w-3 h-3 text-emerald-400" />
                  <span>Livraison Offerte</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Scellé</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Prix & Bouton Panier */}
        <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[11px] text-zinc-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <AddToCartButton
            productId={product.id}
            stock={product.stock}
            compact
          />
        </div>
      </div>
    </article>
  );
}
