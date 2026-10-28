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
    <div className="flex flex-col gap-20 md:gap-28 pb-24">
      {/* ────────────────── 1. HERO SECTION MINIMALISTE ────────────────── */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Colonne gauche : Typographie d'impact */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-theme text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="tracking-wider uppercase text-[10px]">Nouvelle Collection Tech</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-main tracking-tight leading-[1.05]">
                L&apos;Ingénierie. <br />
                <span className="text-secondary font-light">Redéfinie.</span>
              </h1>

              <p className="text-base sm:text-lg text-secondary max-w-xl leading-relaxed font-normal">
                Une sélection rigoureuse d&apos;appareils électroniques de pointe. Smartphones flagships, ordinateurs de travail avancés et acoustique haute précision.
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

            {/* Colonne droite : Showcase produit épuré */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl card-theme p-8 flex flex-col gap-6 relative overflow-hidden group transition-all duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded badge-theme font-semibold tracking-wider uppercase text-[10px]">
                    Flagship 2026
                  </span>
                  <span className="text-muted font-mono text-[11px]">
                    SÉLECTION OFFICIELLE
                  </span>
                </div>

                {/* Visuel immersif */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center p-4 card-media rounded-xl">
                  <Image
                    src="/media/products/phone_s24-67599269e83ad236ac4dbc11-640.webp"
                    alt="Samsung Galaxy S24"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-theme">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
                    Samsung
                  </span>
                  <h3 className="text-xl font-bold text-main tracking-tight">
                    Galaxy S24 5G 256 Go
                  </h3>
                  <p className="text-xs text-secondary line-clamp-1">
                    Écran Dynamic AMOLED 2X 120 Hz, finition Armor Aluminum.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-2xl font-black text-main">
                      8 990 <span className="text-xs font-normal text-muted">MAD</span>
                    </span>
                  </div>

                  <Link
                    href="/produit/samsung-galaxy-s24-5g-256go-onyx-black"
                    className="px-4 py-2 rounded-lg btn-theme-secondary text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Détails</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 2. CATÉGORIES MINIMALISTES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-theme">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Architecture
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

      {/* ────────────────── 3. SÉLECTION DU MOMENT ────────────────── */}
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

      {/* ────────────────── 4. DERNIERS ARRIVAGES ────────────────── */}
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

      {/* ────────────────── 5. AVIS VÉRIFIÉS ────────────────── */}
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
              <span className="text-muted text-[11px]">Client vérifié</span>
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
              <span className="text-muted text-[11px]">Client vérifié</span>
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
              <span className="text-muted text-[11px]">Client vérifié</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
