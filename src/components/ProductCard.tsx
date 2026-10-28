import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { AddToCartButton } from "./AddToCartButton";
import { Star } from "lucide-react";

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

export function ProductCard({ product }: { product: ProductCardData }) {
  const primaryImage = product.images[0];
  const imgSrc = primaryImage?.mediumUrl || primaryImage?.url || "/placeholder-product.webp";

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <article className="group relative rounded-2xl bento-card-prestige overflow-hidden flex flex-col justify-between transition-all duration-500">
      {/* Badges prestigieux */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          {discountPercent !== null && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5C38] text-white shadow-[0_2px_12px_rgba(255,92,56,0.5)]">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white backdrop-blur-md border border-white/15">
              Nouveau
            </span>
          )}
        </div>

        {product.stock <= 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900/90 text-zinc-400 backdrop-blur-md border border-white/10">
            Épuisé
          </span>
        )}
      </div>

      {/* Visuel produit immersif avec halo réactif */}
      <Link
        href={`/produit/${product.slug}`}
        className="block relative aspect-square overflow-hidden p-6 bg-gradient-to-b from-white/[0.02] to-transparent"
      >
        {/* Glow diffus d'arrière-plan */}
        <div className="absolute inset-0 bg-radial from-[#FF5C38]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={primaryImage?.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Détails du produit */}
      <div className="p-4 flex-1 flex flex-col justify-between card-body">
        <div>
          {product.brand && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">
              {product.brand.name}
            </span>
          )}

          <h3 className="font-semibold text-sm text-main hover:opacity-80 transition-opacity line-clamp-2 leading-snug">
            <Link href={`/produit/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Note discrète */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
            <div className="flex items-center text-main">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-medium text-main text-xs">
              {product.ratingAvg && product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : "5.0"}
            </span>
            <span className="text-[11px] text-muted">
              ({product.ratingCount ?? 12})
            </span>
          </div>
        </div>

        {/* Prix & Bouton Panier */}
        <div className="mt-4 pt-3 border-t border-theme flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-main tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[11px] text-muted line-through">
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
