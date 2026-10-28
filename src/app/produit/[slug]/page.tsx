import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getProductBySlug, getFeaturedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ReviewForm } from "@/components/ReviewForm";
import { ProductCard } from "@/components/ProductCard";
import {
  Star,
  ChevronRight,
  Layers,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produit non trouvé" };
  }

  return {
    title: `${product.name} | Hit Tech`,
    description: product.shortDescription || `${product.name} chez Hit Tech.`,
    openGraph: {
      title: `${product.name} — Hit Tech`,
      description: product.shortDescription,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.url || "/placeholder-product.webp";
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const featured = await getFeaturedProducts();
  const related = featured.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <Link href="/boutique" className="hover:text-white transition-colors">
          Boutique
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <Link
              href={`/boutique?categorie=${product.category.slug}`}
              className="hover:text-white transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-zinc-300 truncate">{product.name}</span>
      </nav>

      {/* ── Section Principale Produit ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Galerie Image */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-zinc-950 border border-zinc-900 p-8 flex items-center justify-center overflow-hidden aspect-square">
            {discountPercent !== null && (
              <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded text-xs font-bold bg-white text-black shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                Nouveau
              </span>
            )}

            <Image
              src={primaryImage}
              alt={product.images[0]?.alt || product.name}
              width={600}
              height={600}
              priority
              className="w-full h-full object-contain max-h-[460px] transition-transform hover:scale-105 duration-500"
            />
          </div>

          {/* Miniatures */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-xl bg-zinc-950 border border-zinc-900 p-2 shrink-0 cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <Image
                    src={img.thumbUrl || img.url}
                    alt={img.alt || product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails & Achat */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            {product.brand && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">
                {product.brand.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {product.name}
            </h1>
            <span className="text-xs text-zinc-500 mt-1 block">Réf : {product.sku}</span>

            {/* Note & Avis */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-white">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-semibold text-zinc-200">
                {product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-zinc-500">
                ({product.ratingCount || 1} avis)
              </span>
            </div>
          </div>

          {/* Prix & Stock */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm line-through text-zinc-500">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                  En stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-black text-zinc-600 border border-zinc-900">
                  Épuisé
                </span>
              )}
            </div>
          </div>

          {/* Description courte */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Bouton d'ajout au panier */}
          <div className="pt-2">
            <AddToCartButton
              productId={product.id}
              stock={product.stock}
              className="w-full py-3.5 text-xs rounded-lg font-bold uppercase tracking-wider"
            />
          </div>
        </div>
      </div>

      {/* ── Caractéristiques & Description ── */}
      <div className="mt-20 pt-12 border-t border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Description
          </h2>
          <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed whitespace-pre-line space-y-4">
            {product.description || product.shortDescription}
          </div>
        </div>

        {/* Fiche technique */}
        {product.specs && product.specs.length > 0 && (
          <div className="lg:col-span-5">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-zinc-400" />
              Spécifications
            </h2>
            <div className="rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden divide-y divide-zinc-900">
              {product.specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-3 p-3.5 text-xs">
                  <span className="text-zinc-500 font-medium">{spec.label}</span>
                  <span className="col-span-2 text-zinc-200 font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Section Avis Clients ── */}
      <div className="mt-20 pt-12 border-t border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
            Avis Vérifiés ({product.reviews?.length || product.ratingCount || 0})
          </h2>

          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="rounded-xl bg-zinc-950 p-5 border border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {rev.user?.firstName || "Client"} {rev.user?.lastName ? rev.user.lastName.charAt(0) + "." : ""}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-amber-400" : "text-zinc-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-semibold text-white text-xs">{rev.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rev.body}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-zinc-950 p-6 border border-zinc-900 text-center space-y-1">
                <p className="text-xs font-semibold text-white">Soyez le premier à donner votre avis !</p>
                <p className="text-xs text-zinc-500">Partagez votre expérience avec la communauté Hit Tech.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <ReviewForm productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* ── Produits similaires ── */}
      {related.length > 0 && (
        <div className="mt-24 pt-12 border-t border-zinc-900">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-8">
            Produits Similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
