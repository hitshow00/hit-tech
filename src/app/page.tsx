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
      {/* ────────────────── 1. HERO SECTION CINÉMATIQUE STYLE KOMOOT / AWWWARDS ────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-black hero-cinematic">
        
        {/* Vidéo 3D Flow AI : Plein écran immersif avec dégradé cinéma continu sans aucune rupture */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            src="/media/hero-3d.mp4"
            poster="/media/hero-3d-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-[75%_center] lg:object-[68%_center] opacity-85 contrast-[1.06] saturate-[1.08] transition-opacity duration-1000"
          />

          {/* Dégradé horizontal continu : Noir pur à gauche sous le texte, transition soyeuse vers la 3D à droite */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.96) 28%, rgba(0,0,0,0.80) 45%, rgba(0,0,0,0.25) 70%, transparent 100%)",
            }}
          />

          {/* Dégradé vertical haut & bas : Intégration parfaite dans le noir absolu */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 75%, #000000 100%)",
            }}
          />
        </div>

        {/* Ligne basse en dégradé subtil */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent z-10" />

        {/* Contenu textuel épuré & concis (Style Awwwards / Komoot - zéro texte verbeux) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-24 md:py-32">
          <div className="max-w-2xl flex flex-col items-start gap-6">
            
            {/* Badge officiel discret */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full shadow-lg"
              style={{
                backgroundColor: "rgba(18, 18, 20, 0.85)",
                border: "1px solid rgba(82, 82, 91, 0.60)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
              <span
                className="tracking-widest uppercase text-[10px] font-mono font-semibold"
                style={{ color: "#ffffff" }}
              >
                Hit Tech Maroc • Édition 2026
              </span>
            </div>

            {/* Titre Magistral & Impactant */}
            <h1
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{ color: "#ffffff" }}
            >
              L&apos;Ingénierie tech. <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                À son apogée.
              </span>
            </h1>

            {/* Sous-titre concis & percutant (1 phrase essentielle au lieu de 3 lignes verbeuses) */}
            <p
              className="text-lg sm:text-xl font-light leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              style={{ color: "#e4e4e7" }}
            >
              Smartphones en titane, stations de travail et acoustique d&apos;exception. Sous garantie constructeur officielle au Maroc.
            </p>

            {/* Boutons d'action épurés & modernes */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/boutique"
                className="px-8 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 group shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
              >
                <span>Explorer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/boutique?sort=new"
                className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:border-zinc-400 shadow-lg hover:scale-105 active:scale-98"
                style={{
                  backgroundColor: "rgba(24, 24, 27, 0.85)",
                  border: "1px solid rgba(113, 113, 122, 0.55)",
                  color: "#ffffff",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span>Nouveautés</span>
              </Link>
            </div>

            {/* Micro-pastille en vedette */}
            <div
              className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                backgroundColor: "rgba(18, 18, 20, 0.70)",
                border: "1px solid rgba(63, 63, 70, 0.45)",
                color: "#d4d4d8",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>Galaxy S24 Ultra &amp; Audio Pro</span>
              <Link
                href="/produit/samsung-galaxy-s24-5g-256go-onyx-black"
                className="font-bold inline-flex items-center gap-0.5 ml-1 hover:underline"
                style={{ color: "#22d3ee" }}
              >
                <span>Découvrir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* Indicateur de défilement subtil invitant au scroll (Style Awwwards / Komoot) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-60">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
            Défiler pour explorer
          </span>
          <div className="w-4 h-7 rounded-full border border-zinc-600/80 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ────────────────── 2. BARRE D'ENGAGEMENTS & RÉASSURANCE ────────────────── */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Neuf &amp; Scellé</h4>
              <p className="text-[11px] text-muted">Boîte d&apos;origine sous blister officiel</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Livraison 24h/48h</h4>
              <p className="text-[11px] text-muted">Expédition sécurisée partout au Maroc</p>
            </div>
          </div>

          <div className="rounded-xl card-theme p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg badge-theme flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-main" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-main">Garantie 12-24 Mois</h4>
              <p className="text-[11px] text-muted">SAV officiel &amp; assistance certifiée</p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 3. CATÉGORIES MINIMALISTES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-theme">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Univers
            </span>
            <h2 className="text-2xl font-black text-main mt-1">
              Écosystème Matériel
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
