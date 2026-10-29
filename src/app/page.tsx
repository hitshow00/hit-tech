import Link from "next/link";
import { getFeaturedProducts, getLatestProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Star, ChevronRight } from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, latestProducts] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
  ]);

  return (
    <div className="flex flex-col pb-20">
      {/* ────────────────── 1. HERO SECTION CINÉMATIQUE STYLE KOMOOT / AWWWARDS ────────────────── */}
      <section className="relative overflow-hidden min-h-[82vh] lg:min-h-[86vh] flex items-center bg-black hero-cinematic">
        
        {/* Vidéo 3D Flow AI : Plein écran immersif avec dégradé cinéma continu */}
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
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10" />

        {/* Contenu textuel épuré & concis (Style Awwwards / Komoot) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-16 sm:py-20">
          <div className="max-w-2xl flex flex-col items-start gap-5 sm:gap-6">
            
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
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff 40%, #a1a1aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                À son apogée.
              </span>
            </h1>

            {/* Sous-titre Minimal & Percutant */}
            <p
              className="text-sm sm:text-base max-w-lg font-normal leading-relaxed text-zinc-300 drop-shadow-md"
            >
              Smartphones, ordinateurs portables et acoustique de précision.
              Neufs, scellés d&apos;origine, avec garantie officielle et livraison express au Maroc.
            </p>

            {/* Actions Primaires Épurées */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/boutique"
                className="px-6 sm:px-7 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <Link
                href="/boutique?sort=new"
                className="px-6 py-3 rounded-full text-xs font-semibold transition-all duration-300 hover:bg-white/[0.12] active:scale-95 bg-zinc-900/80 border border-zinc-700/60 text-white backdrop-blur-md"
              >
                Nouveautés 2026
              </Link>
            </div>

            {/* Micro-Pilule de Vedette */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mt-1 bg-zinc-950/70 border border-zinc-800 text-zinc-400 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>Galaxy S25 Ultra 5G &amp; iPhone 15 Pro</span>
              <Link
                href="/produit/samsung-galaxy-s25-ultra-5g-512go-titane-noir"
                className="font-bold inline-flex items-center gap-0.5 ml-1 text-cyan-400 hover:underline"
              >
                <span>Découvrir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* Indicateur de défilement subtil invitant au scroll */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none opacity-60">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
            Défiler pour explorer
          </span>
          <div className="w-4 h-6 rounded-full border border-zinc-600/80 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ────────────────── 2. SÉLECTION DU MOMENT (PRODUITS PHARES) ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-12 pb-14 sm:pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-800/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Catalogue Officiel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Sélection du Moment
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-zinc-400 hover:text-cyan-300 flex items-center gap-1.5 group transition-colors"
          >
            <span>Explorer toute la collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 3. DERNIERS ARRIVAGES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-14 sm:pb-20">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-zinc-800/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Mises à Jour
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Derniers Arrivages
            </h2>
          </div>
          <Link
            href="/boutique?sort=new"
            className="text-xs font-semibold text-zinc-400 hover:text-cyan-300 flex items-center gap-1.5 group transition-colors"
          >
            <span>Voir les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {latestProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ────────────────── 4. AVIS VÉRIFIÉS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-14 sm:pb-20">
        <div className="max-w-xl mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Retour d&apos;Expérience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Avis Vérifiés
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-[#0c0c0e] border border-zinc-850 p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                « Matériel commandé et reçu sous emballage constructeur scellé d&apos;origine. Les performances du produit correspondent en tous points aux fiches techniques. Service précis et efficace. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">M. Tazi</span>
              <span className="text-zinc-500 text-[11px]">Client vérifié • Casablanca</span>
            </div>
          </div>

          <div className="rounded-xl bg-[#0c0c0e] border border-zinc-850 p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                « Commande traitée rapidement. Emballage robuste garantissant l&apos;intégrité de l&apos;appareil pendant le transport. Fiche technique claire et conforme. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">K. Alami</span>
              <span className="text-zinc-500 text-[11px]">Client vérifié • Rabat</span>
            </div>
          </div>

          <div className="rounded-xl bg-[#0c0c0e] border border-zinc-850 p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                « Excellente clarté sur les spécifications et le suivi. Expérience d&apos;achat fluide de la commande jusqu&apos;à la réception. »
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Y. Berrada</span>
              <span className="text-zinc-500 text-[11px]">Client vérifié • Marrakech</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
