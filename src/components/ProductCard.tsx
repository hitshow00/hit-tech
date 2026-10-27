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
    <article className="group relative rounded-xl card-theme overflow-hidden flex flex-col justify-between transition-all duration-300">
      {/* Badges minimalistes en haut */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          {discountPercent !== null && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold btn-theme-primary shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium badge-theme">
              Nouveau
            </span>
          )}
        </div>

        {product.stock <= 0 && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium badge-theme">
            Épuisé
          </span>
        )}
      </div>

      {/* Visuel produit épuré */}
      <Link
        href={`/produit/${product.slug}`}
        className="block relative aspect-square card-media overflow-hidden p-6"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={primaryImage?.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
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
