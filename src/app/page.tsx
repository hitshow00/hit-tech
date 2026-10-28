import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getLatestProducts, getCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  ArrowRight,
  Star,
  Layers,
  ChevronRight,
  ShieldCheck,
  Truck,
  Cpu,
  Sparkles,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, latestProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  const categoryIcons: Record<string, React.ReactNode> = {
    smartphones: <Smartphone className="w-5 h-5 text-[#FF5C38]" />,
    "pc-portables": <Laptop className="w-5 h-5 text-[#FF5C38]" />,
    tablettes: <Tablet className="w-5 h-5 text-[#FF5C38]" />,
    "audio-casques": <Headphones className="w-5 h-5 text-[#FF5C38]" />,
  };

  // Sélection du produit phare pour le Bento Showcase
  const flagshipProduct =
    featuredProducts.find((p) => p.slug.includes("s24")) || featuredProducts[0];
  const secondaryFlagship =
    featuredProducts.find((p) => p.slug.includes("legion") || p.slug.includes("air")) ||
    featuredProducts[1] ||
    featuredProducts[0];

  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-28">
      {/* ────────────────── 1. HERO SECTION CINÉMATIQUE (MODÈLE 3 : LIQUID OBSIDIAN) ────────────────── */}
      <section className="liquid-obsidian-bg relative overflow-hidden pt-16 md:pt-24 pb-20 border-b border-white/10">
        {/* Blobs chromatiques vivants en arrière-plan */}
        <div className="liquid-blob-1" aria-hidden="true" />
        <div className="liquid-blob-2" aria-hidden="true" />

        {/* Trame fine de texture technique */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" 
          aria-hidden="true" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Colonne gauche : Typographie Cinématique & Proposition de valeur */}
            <div className="lg:col-span-6 flex flex-col items-start gap-7">
              
              {/* Badge d'introduction prestigieux */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/15 text-xs font-medium shadow-[0_0_20px_-3px_rgba(255,92,56,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C38] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C38]" />
                </span>
                <span className="tracking-widest uppercase text-[10px] text-zinc-300 font-mono">
                  SÉLECTION OFFICIELLE • ÉDITION 2026
                </span>
              </div>

              {/* Titre Principal Cinématique avec specular shine */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04]">
                L&apos;Ingénierie. <br />
                <span className="text-specular">Redéfinie.</span>
              </h1>

              {/* Texte explicatif équilibré */}
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-normal">
                Découvrez les flagships électroniques les plus avancés au Maroc. Matériel sous scellé constructeur d&apos;origine, garantie officielle et performances sans compromis.
              </p>

              {/* Boutons d'action prestigieux */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/boutique"
                  className="px-7 py-3.5 rounded-xl neon-btn-prestige text-xs uppercase tracking-wider flex items-center gap-2.5 group"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explorer le catalogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/boutique?sort=new"
                  className="px-6 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/15 backdrop-blur-md text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:border-[#FF5C38]/40"
                >
                  <span>Nouveautés</span>
                </Link>
              </div>

              {/* Indicateurs de confiance clés */}
              <div className="pt-6 border-t border-white/10 w-full grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-[#FF5C38] mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold text-white tracking-wide">100% Neuf</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">Boîte scellée d&apos;origine</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#FF5C38] mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold text-white tracking-wide">Garantie</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">12 à 24 mois Maroc</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#FF5C38] mb-1">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-bold text-white tracking-wide">Livraison</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">Express partout au Maroc</p>
                </div>
              </div>

            </div>

            {/* Colonne droite : Bento Showcase Flagship */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Carte Principale : Galaxy S24 Ultra / Flagship */}
              <div className="bento-card-prestige rounded-3xl p-7 md:p-8 flex flex-col justify-between overflow-hidden relative group">
                
                {/* Aura diffuse corail au centre */}
                <div 
                  className="absolute -right-16 -top-16 w-80 h-80 bg-radial from-[#FF5C38]/25 via-transparent to-transparent rounded-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                  aria-hidden="true" 
                />

                {/* En-tête de carte */}
                <div className="flex items-center justify-between text-xs relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FF5C38]/20 border border-[#FF5C38]/40 text-[#FFA14A] font-bold text-[10px] tracking-wider uppercase">
                      FLAGSHIP DU MOMENT
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono text-[10px]">
                      SÉLECTION HIT TECH
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    DISPONIBLE
                  </span>
                </div>

                {/* Visuel immersif centré */}
                <div className="relative aspect-[16/10] w-full flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent">
                  <Image
                    src={flagshipProduct?.images[0]?.mediumUrl || "/media/products/phone_s24-67599269e83ad236ac4dbc11-640.webp"}
                    alt={flagshipProduct?.name || "Samsung Galaxy S24"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6 group-hover:scale-106 transition-transform duration-700 ease-out"
                    priority
                  />
                </div>

                {/* Fiche technique intégrée */}
                <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5C38]">
                        {flagshipProduct?.brand?.name || "SAMSUNG"}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                        {flagshipProduct?.name || "Galaxy S24 5G 256 Go"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-black text-white">
                        {((flagshipProduct?.price || 899000) / 100).toLocaleString("fr-FR")}
                        <span className="text-xs font-normal text-zinc-400 ml-1">MAD</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {flagshipProduct?.shortDescription || "Écran Dynamic AMOLED 2X 120 Hz, Galaxy AI & châssis Armor Aluminum."}
                  </p>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
                        <Cpu className="w-3 h-3 text-[#FF5C38]" /> Snapdragon 8 Gen 3
                      </span>
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
                        Dynamic AMOLED
                      </span>
                    </div>

                    <Link
                      href={`/produit/${flagshipProduct?.slug || "samsung-galaxy-s24-5g-256go-onyx-black"}`}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-[#FF5C38] text-white hover:text-white border border-white/15 hover:border-[#FF5C38] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Découvrir</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Module secondaire compact Bento */}
              {secondaryFlagship && (
                <Link
                  href={`/produit/${secondaryFlagship.slug}`}
                  className="bento-card-prestige rounded-2xl p-4 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      <Image
                        src={secondaryFlagship.images[0]?.thumbUrl || secondaryFlagship.images[0]?.url || "/placeholder-product.webp"}
                        alt={secondaryFlagship.name}
                        fill
                        className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                        {secondaryFlagship.brand?.name || "PERFORMANCE PRO"}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFA14A] transition-colors line-clamp-1">
                        {secondaryFlagship.name}
                      </h4>
                      <span className="text-xs font-bold text-[#FF5C38]">
                        {(secondaryFlagship.price / 100).toLocaleString("fr-FR")} MAD
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 group-hover:border-[#FF5C38]/40 group-hover:bg-[#FF5C38]/20 transition-all">
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ────────────────── 2. CATÉGORIES BENTO FUTURISTES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C38] font-mono">
              UNIVERS & ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Catégories Principales
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>Voir tout l&apos;écosystème</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?categorie=${cat.slug}`}
              className="rounded-2xl bento-card-prestige p-6 transition-all duration-400 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-[#FF5C38]/40 group-hover:bg-[#FF5C38]/15 transition-all">
                  {categoryIcons[cat.slug] || <Layers className="w-5 h-5 text-[#FF5C38]" />}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  0{cat.count}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-[#FFA14A] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-normal">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ────────────────── 3. SÉLECTION DU MOMENT ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C38] font-mono">
              FLAGSHIPS EN VEDETTE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Sélection du Moment
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>Explorer la collection complète</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 4. DERNIERS ARRIVAGES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C38] font-mono">
              FLUX D&apos;ARRIVAGES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Derniers Arrivages
            </h2>
          </div>
          <Link
            href="/boutique?sort=new"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {latestProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 5. AVIS VÉRIFIÉS CINÉMATIQUES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-xl mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C38] font-mono">
            EXPÉRIENCE & SÉCURITÉ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Avis Vérifiés
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl bento-card-prestige p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#FFA14A] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                « Matériel commandé et reçu sous emballage constructeur scellé d&apos;origine. Les performances du produit correspondent en tous points aux fiches techniques. Service précis et efficace. »
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">M. Tazi</span>
              <span className="text-zinc-500 text-[11px] font-mono">Client vérifié • Casablanca</span>
            </div>
          </div>

          <div className="rounded-2xl bento-card-prestige p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#FFA14A] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                « Commande traitée rapidement. Emballage robuste garantissant l&apos;intégrité de l&apos;appareil pendant le transport. Fiche technique claire et conforme. »
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">K. Alami</span>
              <span className="text-zinc-500 text-[11px] font-mono">Client vérifié • Rabat</span>
            </div>
          </div>

          <div className="rounded-2xl bento-card-prestige p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#FFA14A] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                « Excellente clarté sur les spécifications et le suivi. Expérience d&apos;achat fluide de la commande jusqu&apos;à la réception. »
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Y. Berrada</span>
              <span className="text-zinc-500 text-[11px] font-mono">Client vérifié • Marrakech</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
