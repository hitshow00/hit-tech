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
      {/* ────────────────── 1. HERO SECTION CINÉMATIQUE AVEC VIDÉO 3D EN ARRIÈRE-PLAN ────────────────── */}
      <section className="relative overflow-hidden min-h-[82vh] md:min-h-[88vh] flex items-center border-b border-zinc-900 bg-black hero-cinematic">
        
        {/* Vidéo 3D Flow AI : Rendu ultra-net sur la droite avec fondu cinéma vers le noir pur à gauche */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Conteneur vidéo ancré à droite sur desktop pour laisser le texte respirer à 100% sur fond noir */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[65%] h-full">
            <video
              src="/media/hero-3d.mp4"
              poster="/media/hero-3d-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-[70%_center] lg:object-center opacity-90 contrast-[1.08] saturate-[1.08]"
            />
            {/* Fondu cinéma horizontal pour fondre la vidéo dans le noir pur */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 lg:via-black/30 to-transparent" />
          </div>

          {/* Fondu vertical cinéma haut et bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          
          {/* Zone de lisibilité absolue à gauche : noir pur sous le texte */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[45%] bg-gradient-to-r from-black via-black to-transparent" />
        </div>

        {/* Contenu textuel survolant la vidéo avec clarté et contraste absolus */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-16 md:py-24">
          <div className="max-w-2xl flex flex-col items-start gap-6">
            
            {/* Badge officiel en verre givré avec puce luminescente */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-xl text-white shadow-xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
              <span className="tracking-widest uppercase text-[10px] sm:text-[11px] font-mono font-semibold !text-zinc-100">
                Sélection Officielle • Édition 2026
              </span>
            </div>

            {/* Titre Principal Cinématique Luminescent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black !text-white tracking-tight leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              L&apos;Ingénierie Tech. <br />
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                À son apogée.
              </span>
            </h1>

            {/* Sous-titre & Proposition de valeur ultra-lisible */}
            <p className="text-base sm:text-lg !text-zinc-200 leading-relaxed font-normal max-w-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Une sélection rigoureuse d&apos;appareils électroniques d&apos;exception. Smartphones flagships en titane, ordinateurs de travail avancés et acoustique haute fidélité sous boîte scellée et garantie constructeur au Maroc.
            </p>

            {/* Boutons d'action modernes & contrastés */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/boutique"
                className="px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 !text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 group shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-102 active:scale-98"
              >
                <span>Explorer le catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/boutique?sort=new"
                className="px-7 py-3.5 rounded-xl bg-zinc-900/85 hover:bg-zinc-800 !text-white backdrop-blur-md border border-zinc-700/80 hover:border-zinc-500 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Nouveaux Arrivages</span>
              </Link>
            </div>

            {/* Fiche produit phare discrète */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2.5 text-xs !text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>
                En vedette : <strong className="!text-white font-semibold">Samsung Galaxy S24 Ultra</strong> &amp; Écouteurs Pro
              </span>
              <Link
                href="/produit/samsung-galaxy-s24-5g-256go-onyx-black"
                className="!text-cyan-400 hover:!text-cyan-300 font-bold inline-flex items-center gap-0.5 transition-colors ml-1"
              >
                <span>Voir la fiche</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────── 2. BARRE D'ENGAGEMENTS & RÉASSURANCE ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">100% Neuf &amp; Scellé</h4>
              <p className="text-[11px] text-muted">Boîte d&apos;origine constructeur sous blister officiel</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Livraison Express 24h/48h</h4>
              <p className="text-[11px] text-muted">Casablanca, Rabat, Marrakech et partout au Maroc</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
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
