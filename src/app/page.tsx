import Link from "next/link";
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
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, latestProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  const categoryIcons: Record<string, React.ReactNode> = {
    smartphones: <Smartphone className="w-5 h-5 text-secondary" />,
    "pc-portables": <Laptop className="w-5 h-5 text-secondary" />,
    tablettes: <Tablet className="w-5 h-5 text-secondary" />,
    "audio-casques": <Headphones className="w-5 h-5 text-secondary" />,
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24">
      {/* ────────────────── 1. HERO SECTION AVEC VIDÉO 3D CINÉMATIQUE ────────────────── */}
      <section className="relative overflow-hidden pt-10 md:pt-16 pb-12 border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Colonne gauche : Typographie d'impact & proposition de valeur */}
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-theme text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="tracking-widest uppercase text-[10px] font-mono text-secondary">
                  Sélection Officielle • Édition 2026
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-main tracking-tight leading-[1.04]">
                L&apos;Ingénierie Tech. <br />
                <span className="text-secondary font-light">À son apogée.</span>
              </h1>

              <p className="text-base sm:text-lg text-secondary max-w-xl leading-relaxed font-normal">
                Une sélection rigoureuse d&apos;appareils électroniques de pointe. Smartphones flagships en titane, ordinateurs de travail avancés et acoustique haute précision sous garantie constructeur Maroc.
              </p>

              {/* Boutons d'action thématiques */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/boutique"
                  className="px-6 py-3 rounded-lg btn-theme-primary font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 group shadow-sm"
                >
                  <span>Explorer le catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/boutique?sort=new"
                  className="px-6 py-3 rounded-lg btn-theme-secondary font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>Nouveautés</span>
                </Link>
              </div>
            </div>

            {/* Colonne droite : Showcase Vidéo 3D Réalisé sur Google Flow */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl sm:rounded-3xl card-theme p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden group shadow-2xl transition-all duration-500">
                
                {/* Header du Showcase avec badge 3D */}
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full badge-theme text-[10px] font-mono font-semibold tracking-wider uppercase text-cyan-400 border border-cyan-500/20">
                      Showcase 3D
                    </span>
                    <span className="text-[11px] text-muted font-medium hidden sm:inline">
                      Châssis Titane & Verre Dépoli
                    </span>
                  </div>
                  <span className="text-muted font-mono text-[10px] uppercase tracking-wider">
                    Garantie Maroc
                  </span>
                </div>

                {/* Cadre Vidéo 3D Fluide */}
                <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden card-media bg-black">
                  <video
                    src="/media/hero-3d.mp4"
                    poster="/media/hero-3d-poster.jpg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
                  />
                  {/* Reflet subtil en coin */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
                    <span className="text-white/90 text-xs font-semibold drop-shadow-md">
                      Flagships & Écouteurs Pro
                    </span>
                    <span className="text-[10px] text-zinc-300 font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                      4K Cinematic
                    </span>
                  </div>
                </div>

                {/* Barre info produit & lien direct */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-theme px-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted block">
                      Disponibilité Immédiate
                    </span>
                    <h3 className="text-sm font-bold text-main tracking-tight">
                      Samsung Galaxy S24 Ultra & Audio Haute Fidélité
                    </h3>
                  </div>

                  <Link
                    href="/produit/samsung-galaxy-s24-5g-256go-onyx-black"
                    className="px-3.5 py-2 rounded-lg btn-theme-secondary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
                  >
                    <span>Voir la fiche</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────── 2. BARRE D'ENGAGEMENTS & RÉASSURANCE ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">100% Neuf & Scellé</h4>
              <p className="text-[11px] text-muted">Boîte d&apos;origine constructeur sous blister officiel</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Livraison Express 24h/48h</h4>
              <p className="text-[11px] text-muted">Casablanca, Rabat, Marrakech et partout au Maroc</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Garantie Constructeur</h4>
              <p className="text-[11px] text-muted">SAV officiel et assistance 12 à 24 mois</p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 3. CATÉGORIES MINIMALISTES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-theme">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Rayons
            </span>
            <h2 className="text-2xl font-black text-main mt-1">
              Catégories Principales
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-secondary hover:text-main flex items-center gap-1 group transition-colors"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?categorie=${cat.slug}`}
              className="rounded-xl card-theme p-6 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 rounded-lg badge-theme">
                  {categoryIcons[cat.slug] || <Layers className="w-5 h-5 text-secondary" />}
                </div>
                <span className="text-[11px] font-mono text-muted">
                  0{cat.count}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-main text-sm transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted line-clamp-1 mt-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ────────────────── 4. SÉLECTION DU MOMENT ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-theme">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Catalogue
            </span>
            <h2 className="text-2xl font-black text-main mt-1">
              Sélection du Moment
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-secondary hover:text-main flex items-center gap-1 group transition-colors"
          >
            <span>Explorer la collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 5. DERNIERS ARRIVAGES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-theme">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Mises à Jour
            </span>
            <h2 className="text-2xl font-black text-main mt-1">
              Derniers Arrivages
            </h2>
          </div>
          <Link
            href="/boutique?sort=new"
            className="text-xs font-semibold text-secondary hover:text-main flex items-center gap-1 group transition-colors"
          >
            <span>Voir les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {latestProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 6. AVIS VÉRIFIÉS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-xl mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            Retour d&apos;Expérience
          </span>
          <h2 className="text-2xl font-black text-main mt-1">
            Avis Vérifiés
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl card-theme p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-main mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                « Matériel commandé et reçu sous emballage constructeur scellé d&apos;origine. Les performances du produit correspondent en tous points aux fiches techniques. Service précis et efficace. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-theme flex items-center justify-between text-xs">
              <span className="font-semibold text-main">M. Tazi</span>
              <span className="text-muted text-[11px]">Client vérifié • Casablanca</span>
            </div>
          </div>

          <div className="rounded-xl card-theme p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-main mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                « Commande traitée rapidement. Emballage robuste garantissant l&apos;intégrité de l&apos;appareil pendant le transport. Fiche technique claire et conforme. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-theme flex items-center justify-between text-xs">
              <span className="font-semibold text-main">K. Alami</span>
              <span className="text-muted text-[11px]">Client vérifié • Rabat</span>
            </div>
          </div>

          <div className="rounded-xl card-theme p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-main mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                « Excellente clarté sur les spécifications et le suivi. Expérience d&apos;achat fluide de la commande jusqu&apos;à la réception. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-theme flex items-center justify-between text-xs">
              <span className="font-semibold text-main">Y. Berrada</span>
              <span className="text-muted text-[11px]">Client vérifié • Marrakech</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
